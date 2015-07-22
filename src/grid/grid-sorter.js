

const ASC = 'sort-asc';
const DESC = 'sort-desc';
const MAX_HISTORY = 5;

export class GridSorter {

    constructor (model) {
        this.model = model;
        this.sortHistory = [];
    }

    sort(sortHeader) {
        let index = sortHeader.index;
        let field = sortHeader.field;

        this.clearSortHeaders(sortHeader);

        this.model.rows.sort(sortHeader.sortBy ? sortHeader.sortBy:
            function (a, b) {
                return a[field] > b[field] ? 1 : -1;
            }
        );

        sortHeader.sort === ASC ?
            sortHeader.sort = DESC :
            sortHeader.sort = ASC;

        if (sortHeader.sort === DESC) {
            this.model.rows.reverse();
        }

        this.addToHistory(sortHeader);
    }

    sortOriginal () {
        this.clearSortHeaders()
        this.model.rows.sort(function (a, b) {
            return a.key > b.key;
        });
    }

    addToHistory (sortHeader) {
        this.sortHistory.push(sortHeader);
        if (this.sortHistory.length > MAX_HISTORY) {
            this.sortHistory.shift();
        }
    }

    clearSortHeaders (skipHeader) {
        for(let header of this.model.headers) {
            if (!skipHeader || header.index !== skipHeader.index) {
                header.sort = null;
            }
        }
    }

    clearSortHistory () {
        this.sortHistory.splice(0, this.sortHistory.length);
    }

    applySortHistory () {
        this.sortOriginal();
        this.sortHistory.forEach((sortHeader) => {
            this.sort(sortHeader);
        });
    }
}
