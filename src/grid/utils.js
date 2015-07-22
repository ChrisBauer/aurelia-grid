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
}
