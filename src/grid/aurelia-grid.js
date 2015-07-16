import {inject, bindable} from 'aurelia-framework';
import {Utils} from 'grid/utils';
// import {Compiler} from 'gooy/aurelia-compiler';


const ASC = -1;
const DESC = 1;
const DEFAULT_CELL_TEMPLATE = 'row[cell.field]';

@inject(Element) //, Compiler)
@bindable('config')
@bindable('dataModel')
export class AureliaGrid {

    constructor(Element) { //, Compiler) {
        this.element = Element;
        //this.compiler = Compiler;
        // this.compile = function (htmlString, cell) {
        //     var elements = this.compiler.createFragment(htmlString).children[0];
        //     return this.compiler.compile(elements, cell);
        // };
        //this.compile = (htmlString => this.compiler.compile(Utils.createElement(htmlString)));
    }

    sort (field, index) {
        let header = this.model.headers[index];

        this.model.rows = Utils.sort(this.model.rows, function (a, b) {
            return a[field] > b[field] ? 1 : -1;
        });

        header.sort === ASC ?
            header.sort = DESC :
            header.sort = ASC;

        if (header.sort === DESC) {
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
            field: configEntry.field
        }, configEntry.header);
    }

    generateRow(row) {
        let g = {};


    }

    generateCell(cell, row) {
        // would only render once, rather than once per row
        // if (cell.evaluated) {
        //     return cell.evaluated;
        // }

        if (cell.template === DEFAULT_CELL_TEMPLATE) {
            return cell.evaluated = eval(cell.template);
        }
        else {
            return cell.evaluated = eval(this.getMappedTemplate(cell));
        }

        // if (cell.template === DEFAULT_CELL_TEMPLATE) {
        //     return cell.evaluated = this.compile(cell.template, cell);
        // }
        // else {
        //     return cell.evaluated = this.compile(this.getMappedTemplate(cell), cell);
        // }
    }

    getMappedTemplate (cell) {
        return cell.template
            .replace(/\$field/g, DEFAULT_CELL_TEMPLATE)
            .replace(/\$row/g, 'row');
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
        // for (let row of this.dataModel) {
        //     this.model.rows.push(this.generateRow(row));
        // }
        this.model.rows = this.dataModel;
    }
}
