
const CLASS_PATTERN = /^col-/;
const DRAGOVER = 'dragover';
const RIGHT = 'right';
const LEFT = 'left';


export class Draggable {

    constructor (Element, dropCallback) {
        this.element = Element;
        this.dropCallback = dropCallback;
        this.dragInProgress = false;
    }

    setupDraggables(index) {
        var queryString = index !== undefined ? 'th.col-' + index + '[draggable=true]' : 'th[draggable=true]';
        var headers = this.element.querySelectorAll(queryString);

        for(let header of headers) {
            header.addEventListener('dragstart', this.dragstart.bind(this));
            header.addEventListener('dragend', this.dragend.bind(this));
            header.addEventListener('dragenter', this.dragenter.bind(this));
            header.addEventListener('dragover', this.dragover.bind(this));
            header.addEventListener('drop', this.drop.bind(this));
            header.addEventListener('dragleave', this.dragleave.bind(this));
        }
    }

    getColClass (el) {
         var colClass = Array.prototype.filter.call(el.classList, (c) => c.match(CLASS_PATTERN));
         return colClass.length === 1 ? colClass[0] : '';
    }

    getColElements (el) {
        var colClass = this.getColClass(el);
        return colClass ? this.element.querySelectorAll('.' + colClass) : [];
    }

    forColElements(target, cb) {
        for(let el of this.getColElements(target)) {
            cb(el);
        }
    }

    getSiblingIndex(el) {
        return Array.prototype.indexOf.call(el.parentNode.childNodes, el);
    }

    handleRowChanges () {
        if (this.dragInProgress) {
            this.applyDropTargetClass();
            this.applyDragClass();
        }
    }

    applyDragClass (target) {
        target = target || this.element.querySelector('.' + this.dragColClass);
        this.forColElements(target, (el) => el.style.opacity = 0.4);
    }

    applyDropTargetClass (target) {
        target = target || this.element.querySelector('.' + this.dropColClass);

        var dropPos = this.getSiblingIndex(target);
        var dragStartPos = this.dragStartPos;

        this.forColElements(target, (el) => el.classList.add(DRAGOVER,
            dragStartPos > dropPos ? LEFT : RIGHT
        ));
    }

    dragstart (e) {
        this.dragInProgress = true;
        this.dragColClass = this.getColClass(e.target);
        this.dragStartPos = this.getSiblingIndex(e.target);
        e.dataTransfer.setData('text', '' + this.dragColClass.split('-')[1]);
        this.applyDragClass(e.target);
    }

    dragend (e) {
        this.dragInProgress = false;
        this.dragColClass = null;
        this.forColElements(e.target, (el) => el.style.opacity = 1);
    }

    dragenter (e) {
        var colClass = this.getColClass(e.target);
        if (colClass !== this.dragColClass) {
            this.dropColClass = colClass;
            this.applyDropTargetClass(e.target);
        }
    }

    dragleave (e) {
        this.forColElements(e.target, (el) => el.classList.remove(DRAGOVER, LEFT, RIGHT));
    }

    dragover (e) {
        e.preventDefault();
    }

    drop (e) {
        e.preventDefault();
        var dropColClass = this.getColClass(e.target);
        var move = e.dataTransfer.getData('text');
        if (!dropColClass || !move) {
            return;
        }
        this.dragleave(e);
        var move = e.dataTransfer.getData('text');
        var to = dropColClass.split('-')[1];
        this.dropCallback(move, to);
    }
}
