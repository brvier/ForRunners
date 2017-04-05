cordova.define("cordova-plugin-nativestorage.LocalStorageHandle", function(require, exports, module) {
var NativeStorageError = require('./NativeStorageError');

// args = [reference, variable]
function LocalStorageHandle(success, error, intent, operation, args) {
    var reference = args[0];
    var variable = args[1];

    if (operation.startsWith('put') || operation.startsWith('set')) {
        try {
            var varAsString = JSON.stringify(variable);
            if (reference === null) {
                error(new NativeStorageError(NativeStorageError.NULL_REFERENCE, "JS", ""));
                return;
            }
            localStorage.setItem(reference, varAsString);
            success(variable);
        } catch (err) {
            error(new NativeStorageError(NativeStorageError.JSON_ERROR, "JS", err));
        }
    } else if (operation.startsWith('get')) {
        var item = {};
        item = localStorage.getItem(reference);
        if (item === null) {
            error(NativeStorageError.ITEM_NOT_FOUND);
            return;
        }
        try {
            var obj = JSON.parse(item);
            //console.log("LocalStorage Reading: "+obj);
            success(obj);
        } catch (err) {
            error(new NativeStorageError(NativeStorageError.JSON_ERROR, "JS", err));
        }
    }
}
module.exports = LocalStorageHandle;

});
