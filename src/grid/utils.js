export class Utils {

    constructor () {

    }
    static merge () {
        var obj = {};
        for (let o of arguments) {
            for (let k in o) {
                obj[k] = o[k];
            }
        }
        return obj;
    }

    static sort (arr, comparatorFn) {
        if (arr.length <= 1) {
            return arr;
        }
        let pivot = Math.floor((arr.length - 1 / 2));
        let val = arr[pivot], less = [], more = [];
        arr.splice(pivot, 1);
        if (comparatorFn) {
            for (let el of arr) {
                comparatorFn (el, val) <= 0 ? less.push(el) : more.push(el);
            }
        }
        else {
            for (let el of arr) {
                el < val ? less.push(el) : more.push(el);
            }
        }

        var sorted = (Utils.sort(less)).concat([val], Utils.sort(more));
        return sorted;
    }
}
