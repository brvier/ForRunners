cordova.define("cordova-plugin-powermanagement.powermanagement", function(require, exports, module) {

var PowerManagement = function() {
};

/**
 * Acquire a new wake-lock (keep device awake)
 * 
 * @param successCallback
 *            function to be called when the wake-lock was acquired successfully
 * @param errorCallback
 *            function to be called when there was a problem with acquiring the
 *            wake-lock
 */
PowerManagement.prototype.acquire = function(successCallback, failureCallback) {
	cordova.exec(successCallback, failureCallback, 'PowerManagement', 'acquire', []);
};

/**
 * Release the wake-lock
 * 
 * @param successCallback
 *            function to be called when the wake-lock was released successfully
 * @param errorCallback
 *            function to be called when there was a problem while releasing the
 *            wake-lock
 */
PowerManagement.prototype.release = function(successCallback, failureCallback) {
	cordova.exec(successCallback, failureCallback, 'PowerManagement', 'release', []);
};

module.exports = new PowerManagement();
});
