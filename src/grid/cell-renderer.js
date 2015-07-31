import {inject, ViewResources, ViewCompiler, ResourceRegistry, Container} from 'aurelia-framework';

@inject(ViewCompiler, ResourceRegistry, Container)
export class CellRenderer {
    constructor (ViewCompiler, resources, Container) {

        this.container = Container;
        this.compiler = ViewCompiler;
        this.resources = new ViewResources(resources);
    }

    renderCell (cell, row) {
        if (!cell.stamp) {
            cell.stamp = this.compiler.compile(cell.template, this.resources);
        }

        var context = {
            cell: cell,
            row: row,
            field: row[cell.field]
        }

        var view = cell.stamp.create(this.container, context);
        var html;

        // if the user provided an string containing HTML Element(s)
        if (view.fragment.children.length > 0) {
            return Array.prototype.map.call(view.fragment.children,
                child => child.outerHTML).join('');
        }
        // if the user provided just a binding string
        else {
            return view.fragment.childNodes[1].textContent;
        }
    }
}
