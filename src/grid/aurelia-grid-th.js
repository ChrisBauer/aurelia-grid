import {bindable, inject} from 'aurelia-framework';
import {AureliaGrid} from 'grid/aurelia-grid';

@inject(Element)
@bindable('header')
export class AureliaGridTh {
    constructor (element) {
        this.element = element;
    }

    activate () {

    }
}
