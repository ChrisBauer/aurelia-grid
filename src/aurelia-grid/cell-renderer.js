import {inject, ViewResources, ViewCompiler, Container, BehaviorInstruction} from 'aurelia-framework';

@inject(ViewCompiler, ViewResources, Container, BehaviorInstruction)
export class CellRenderer {
    constructor (ViewCompiler, resources, Container, BehaviorInstruction) {

        this.container = Container;
        this.compiler = ViewCompiler;
        this.resources = new ViewResources(resources);
    }

    normalizeCellTemplate (template) {
        if (!template.match(/^\<template\>/)) {
            template = '<template>' + template + '</template>';
        }
        return template;
    }

    renderCell (cell, row) {
        if (!cell.stamp) {
            cell.template = this.normalizeCellTemplate(cell.template);
            cell.stamp = this.compiler.compile(cell.template, this.resources);
        }

        var context = {
            cell: cell,
            row: row,
            field: row[cell.field]
        };

        var view = cell.stamp.create(this.container);

        view.bind(context, row);


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
