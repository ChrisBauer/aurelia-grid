import {ViewCompiler, ViewResources, ResourceRegistry, Container, ObserverLocator, inject, bindable} from 'aurelia-framework';
import {CellRenderer} from 'grid/cell-renderer';
import {Utils} from 'grid/utils';
// import {Compiler} from 'gooy/aurelia-compiler';


const ASC = -1;
const DESC = 1;
const DEFAULT_CELL_TEMPLATE = '<span>${row[cell.field]}</span>';

@inject(Element, CellRenderer, ObserverLocator)
@bindable('config')
@bindable({
    name: 'dataModel',
    defaultValue: []
})
export class AureliaGrid {

    constructor(Element, CellRenderer, ObserverLocator) {
        this.element = Element;
        this.ObserverLocator = ObserverLocator;
        this.CellRenderer = CellRenderer;

        this.nextRowIndex = 0;
        this.cellLookup = {};
    }

    sort (sortHeader) {
        this.inSort = true;
        let index = sortHeader.index;
        let field = sortHeader.field;

        for(let header of this.model.headers) {
            if (header.index !== sortHeader.index) {
                delete header.sort;
            }
        }

        this.model.rows = this.model.rows.sort(function (a, b) {
            return a[field] > b[field] ? 1 : -1;
        });

        sortHeader.sort === ASC ?
            sortHeader.sort = DESC :
            sortHeader.sort = ASC;

        if (sortHeader.sort === DESC) {
            this.model.rows.reverse();
        }
    }

    createCell (configEntry, index) {
        return Utils.merge({
            index: index,
            field: configEntry.field,
            template: DEFAULT_CELL_TEMPLATE
        }, configEntry.cell)
    }

    createHeader (configEntry, index) {
        return Utils.merge({
            index: index,
            title: configEntry.field.toUpperCase(),
            field: configEntry.field,
            sortBy: configEntry.field
        }, configEntry.header);
    }

    initRow(row) {
        row.key = this.nextRowIndex;
        this.cellLookup[this.nextRowIndex++] = {};
    }

    getCell(cell, row) {
        if (!this.inSort) {
            var lookup = this.cellLookup[row.key][cell.index];
            if (lookup) {
                return lookup;
            }
            else {
                this.cellLookup[row.key][cell.index] = this.CellRenderer.renderCell(cell, row);
                return this.cellLookup[row.key][cell.index];
            }
        }
        else {
            var round = Math.floor(this.sortSpliceCount++ / this.model.cells.length);
            row = this.model.rows[this.spliceMap[round]];
            var lookup = this.cellLookup[row.key][cell.index];
            if (lookup) {
                return lookup;
            }
            else {
                this.cellLookup[row.key][cell.index] = this.CellRenderer.renderCell(cell, row);
                return this.cellLookup[row.key][cell.index];
            }
        }
    }

    attached () {
        this.model = {
            headers: [],
            cells: [],
            rows: []
        }
        var i = 0;
        for (let configEntry of this.config) {
            this.model.headers.push(this.createHeader(configEntry, i));
            this.model.cells.push(this.createCell(configEntry, i++));
        }

        for (let row of this.dataModel) {
            this.initRow(row);
        }
        this.model.rows = this.dataModel;

        // this attached() gets called before the repeat.for, so it would normally
        // be the second callback. Since we want to generate the key data first,
        // we need to have this be the first callback run. Since Aurelia runs
        // the callbacks in the reverse order of subscription, we need to
        // have a timeout to make sure that it is the last subscription
        setTimeout( () => {
            var self = this;
            this.ObserverLocator.getArrayObserver(this.model.rows)
            .subscribe((splices) => {
                if (this.inSort) {
                    this.sortSpliceCount = 0;
                    this.spliceMap = this.generateSpliceMap(splices);
                }
                else {
                    for(let splice of splices) {
                        var addedCount = splice.addedCount
                        while (addedCount-- > 0) {
                            self.initRow(self.model.rows[splice.index + addedCount]);
                        }
                    }
                }
            });
        });
        this.ObserverLocator.getArrayObserver(this.model.rows)
        .subscribe(() => {
            if (this.inSort) {
                this.sortSpliceCount = 0;
                this.inSort = false;
                this.spliceMap = null
            }
        });
    }

    generateSpliceMap(splices) {
        var map = [];
        for (let splice of splices) {
            for (var i = 0; i < splice.addedCount; i++){
                map.push(splice.index + i);
            }
        }
        return map;
    }

    dataModelChanged () {
        console.log(arguments);
    }
}
