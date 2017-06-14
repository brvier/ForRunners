cordova.define("org.apache.cordova.plugin.tts.tts", function(require, exports, module) { /*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/
var exec = require("cordova/exec");

/**
 * tts object.
 * @constructor
 */
var tts = {
    say: function() {
	alert("tts");
    },
    /**
     * Play the passed in text as synthesized speech
     * 
     * @param {DOMString} text
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    speak: function(text, successCallback, errorCallback) {
	exec(successCallback, errorCallback, "TTS", "speak", [text]);
    },
    /**
     * Interrupt any existing speech, then speak the passed in text as synthesized speech
     * 
     * @param {DOMString} text
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    interrupt: function(text, successCallback, errorCallback) {
         exec(successCallback, errorCallback, "TTS", "interrupt", [text]);
    },
    /**
     * Stop any queued synthesized speech
     * 
     * @param {DOMString} text
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    stop: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "TTS", "stop", []);
    },
    /** 
     * Play silence for the number of ms passed in as duration
     * 
     * @param {long} duration
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    silence: function(duration, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "TTS", "silence", [duration]);
    },
    /** 
     * Set speed of speech.  Usable from 30 to 500.  Higher values make little difference.
     * 
     * @param {long} speed
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    speed: function(speed, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "TTS", "speed", [speed]);
    },
    /** 
     * Set pitch of speech.  Useful values are approximately 30 - 300
     * 
     * @param {long} pitch
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    pitch: function(pitch, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "TTS", "pitch", [pitch]);
    },
    /**
     * Starts up the TTS Service
     * 
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    startup: function(successCallback, errorCallback) {
	console.log("TTS-Startup");
        exec(successCallback, errorCallback, "TTS", "startup", []);
    },
    /**
     * Shuts down the TTS Service if you no longer need it.
     * 
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    shutdown: function(successCallback, errorCallback) {
         exec(successCallback, errorCallback, "TTS", "shutdown", []);
    },
    /**
     * Finds out if the language is currently supported by the TTS service.
     * 
     * @param {DOMSting} lang
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    isLanguageAvailable: function(lang, successCallback, errorCallback) {
         exec(successCallback, errorCallback, "TTS", "isLanguageAvailable", [lang]);
    },
    /**
     * Finds out the current language of the TTS service.
     * 
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    getLanguage: function(successCallback, errorCallback) {
         exec(successCallback, errorCallback, "TTS", "getLanguage", []);
    },
    /**
     * Sets the language of the TTS service.
     * 
     * @param {DOMString} lang
     * @param {Object} successCallback
     * @param {Object} errorCallback
     */
    setLanguage: function(lang, successCallback, errorCallback) {
         exec(successCallback, errorCallback, "TTS", "setLanguage", [lang]);
    }
};

module.exports = tts;


});
