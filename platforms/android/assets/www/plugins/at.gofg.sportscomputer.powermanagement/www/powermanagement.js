cordova.define("at.gofg.sportscomputer.powermanagement.device", function(require, exports, module) {
/*
 * Copyright 2013 Wolfgang Koller
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var PowerManagement = function() {};

/**
 * Acquire a new wake-lock (keep device awake)
 *
 * @param successCallback function to be called when the wake-lock was acquired successfully
 * @param errorCallback function to be called when there was a problem with acquiring the wake-lock
 */
PowerManagement.prototype.acquire = function(successCallback,failureCallback, runLockScreen) {
    if( typeof runLockScreen === "undefined" ) runLockScreen = false;

    cordova.exec(successCallback, failureCallback, 'PowerManagement', 'acquire', [runLockScreen]);
}

/**
 * Release the wake-lock
 *
 * @param successCallback function to be called when the wake-lock was released successfully
 * @param errorCallback function to be called when there was a problem while releasing the wake-lock
 */
PowerManagement.prototype.release = function(successCallback,failureCallback) {
    cordova.exec(successCallback, failureCallback, 'PowerManagement', 'release', []);
}

/**
 * Enable or disable releasing of the wakelock on pause
 *
 * @param enabled boolean - true to enable releasing of wakelock on pause, or false to disable
 * @param successCallback
 * @param errorCallback
 */
PowerManagement.prototype.setReleaseOnPause = function(enabled, successCallback, failureCallback) {
    cordova.exec(successCallback, failureCallback, 'PowerManagement', 'setReleaseOnPause', [enabled]);
}

/**
 * Acquire a partial wake-lock, allowing the device to dim the screen
 *
 * @param successCallback function to be called when the wake-lock was acquired successfully
 * @param errorCallback function to be called when there was a problem with acquiring the wake-lock
 */
PowerManagement.prototype.dim = function(successCallback,failureCallback) {
    cordova.exec(successCallback, failureCallback, 'PowerManagement', 'acquire', [true]);
}

module.exports = new PowerManagement();

});
