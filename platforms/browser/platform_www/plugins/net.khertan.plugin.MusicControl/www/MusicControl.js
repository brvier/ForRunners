cordova.define("net.khertan.plugin.MusicControl.MusicControl", function(require, exports, module) { module.exports = {
  play: function(cb) {
    return this._execute("play", cb);
  },
  togglepause: function(cb) {
    return this._execute("togglepause", cb);
  },
  pause: function(cb) {
    return this._execute("pause", cb);
  },
  stop: function(cb) {
    return this._execute("stop", cb);
  },
  previous: function(cb) {
    return this._execute("previous", cb);
  },
  next: function(cb) {
    return this._execute("next", cb);
  },
  isactive: function(cb) {
    return this._execute("isactive", cb);
  },
  _execute: function(mcCmd, callback) {
    return cordova.exec(function(cb) {
      if (callback) {
        return callback(null, cb);
      }
    }, function(err) {
      return callback(err);
    }, "MusicControl", mcCmd, []);
  }
};

});
