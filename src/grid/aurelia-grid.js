import {ViewCompiler, View, ViewResources, ResourceRegistry, Container, ObserverLocator, inject, bindable} from 'aurelia-framework';
import {CellRenderer} from 'grid/cell-renderer';
import {Draggable} from 'grid/draggable';
import {GridSorter} from 'grid/grid-sorter';
import {Utils} from 'grid/utils';
// import {Compiler} from 'gooy/aurelia-compiler';


const DEFAULT_CELL_TEMPLATE = '<span>${row[cell.field]}</span>';
const DEFAULT_SORT_BY = function (field) {
    return function (a, b) {
        return a[field] > b[field] ? 1 : a[field] === b[field] ? 0 : -1;
    };
}
const OVERRIDE = 'Fixes issue with Aurelia binding to the wrong execution context';

@inject(Element, CellRenderer, ObserverLocator)
@bindable('config')
@bindable({
    name: 'dataModel',
    defaultValue: []
})
export class AureliaGrid {

    constructor(Element, CellRenderer, ObserverLocator) {
        // TODO: figure out a way to make this only apply to instances of the View
        // created in cell-renderer.js
        View.prototype.originalBind = View.prototype.bind;
        View.prototype.bind = function (executionContext, systemUpdate){
            if (this.executionContext && this.executionContext.cell &&
                this.executionContext.cell.hasOwnProperty('specialKey') &&
                executionContext && executionContext.row &&
                executionContext.row.hasOwnProperty('specialKey') &&
                this.executionContext.cell.specialKey === executionContext.row.specialKey
            ) {
                this.executionContext.$parent = executionContext;
                View.prototype.originalBind.call(this, this.executionContext, systemUpdate);
            }
            else {
                View.prototype.originalBind.call(this, executionContext, systemUpdate);
            }
        }
        this.element = Element;
        this.ObserverLocator = ObserverLocator;
        this.CellRenderer = CellRenderer;
        this.Draggable = new Draggable(this.element, this.dropCallback.bind(this));
        this.changeHandlers = {
            before: [],
            after: []
        };

        this.nextRowIndex = 0;
        this.cellLookup = {};
    }

    sort (sortHeader) {
        this.inSort = true;
        this.GridSorter.sort(sortHeader);
    }

    createCell (configEntry, index) {
        return Utils.merge({
            specialKey: OVERRIDE,
            index: index,
            field: configEntry.field,
            template: DEFAULT_CELL_TEMPLATE,
            colClass: configEntry.colClass
        }, configEntry.cell)
    }

    createHeader (configEntry, index) {
        var header = Utils.merge({
            index: index,
            title: configEntry.field.toUpperCase(),
            field: configEntry.field,
            width: configEntry.width,
            colClass: configEntry.colClass,
            sortBy: DEFAULT_SORT_BY(configEntry.field)
        }, configEntry.header);

        if (configEntry.header && configEntry.header.sortBy) {
            if (typeof configEntry.header.sortBy === 'string') {
                header.sortBy = DEFAULT_SORT_BY(configEntry.header.sortBy)
            }
            else if (typeof configEntry.header.sortBy === 'function') {
                header.sortBy = configEntry.header.sortBy;
            }
        }
        return header;
    }

    initRow(row) {
        row.specialKey = OVERRIDE;
        row.key = this.nextRowIndex;
        this.cellLookup[this.nextRowIndex++] = {};
        Array.observe(row, (changes) => {
            console.log(changes);
            if (changes.some((change) => change.type === 'update')) {
                this.renderRow(changes[0].object);
            }
        }.bind(this));
        this.renderRow(row);
    }

    renderRow(row) {
        for (let cell of this.model.cells) {
            this.cellLookup[row.key][cell.index] = this.CellRenderer.renderCell(cell, row);
        }
    }


    dropCallback(move, to) {
        if (!this.dropInProgress) {
            this.dropInProgress = true;
            var moveHeader = this.model.headers.filter((header) => header.index == move)[0];
            var moveCell = this.model.cells.filter((cell) => cell.index == move)[0];
            var movePos = this.model.headers.indexOf(moveHeader);

            var toHeader = this.model.headers.filter((header) => header.index == to)[0];
            var toPos = this.model.headers.indexOf(toHeader);

            this.model.headers.splice(movePos, 1);
            this.model.cells.splice(movePos, 1);

            this.model.headers.splice(toPos, 0, moveHeader);
            this.model.cells.splice(toPos, 0, moveCell);

            // make sure this runs after Aurelia re-orders the DOM
            setTimeout(() => {
                this.Draggable.setupDraggables(moveHeader.index);
                this.dropInProgress = false;
            });
        }
        else {
            this.dropInProgress = false;
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
        this.GridSorter = new GridSorter(this.model);

        var self = this;
        this.rowObserver = this.ObserverLocator.getArrayObserver(this.model.rows);

        this.rowObserver.subscribe(() => {
            // clean up sort if necessary
            if (self.inSort) {
                self.inSort = false;
            }
            // otherwise, set sort flag and apply sort to new data
            else {
                self.inSort = true;
                self.GridSorter.applySortHistory();
            }
            this.Draggable.handleRowChanges();
        });

        setTimeout( () => {
            this.afterAttached();
        });
    }

    // this attached() gets called before the repeat.for, so it would normally
    // be the second callback. Since we want to generate the key data first,
    // we need to have this be the first callback run. Since Aurelia runs
    // the callbacks in the reverse order of subscription, we need to
    // have a timeout to make sure that it is the last subscription
    afterAttached() {
        var self = this;
        this.rowObserver.subscribe((splices) => {
            if (!self.inSort) {
                for(let splice of splices) {
                    var addedCount = splice.addedCount
                    while (addedCount-- > 0) {
                        self.initRow(self.model.rows[splice.index + addedCount]);
                    }
                }
            }
        });

        this.Draggable.setupDraggables();
    }
}
