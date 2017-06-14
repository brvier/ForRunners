cordova.define("com.jcesarmobile.filepicker.FilePicker", function(require, exports, module) { (function(window) {
 
    var FilePicker = function() {};
  
    FilePicker.prototype = {
  
        isAvailable: function(success) {
            cordova.exec(success, null, "FilePicker", "isAvailable", []);
        },
  
        pickFile: function(success, fail,utis) {
            cordova.exec(success, fail, "FilePicker", "pickFile", [utis]);
        }

    };
  
    cordova.addConstructor(function() {
                         
        window.FilePicker = new FilePicker();
                         
    });
  
})(window);
});
