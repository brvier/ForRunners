angular.module('app.services', [])


// Service to communicate with OpenWeatherMap API.
.factory('$weather', function($q, $http) {
    'use strict';
    var API_ROOT = 'http://api.openweathermap.org/data/2.5/';
    this.byCityName = function(query) {
        var deferred = $q.defer();
        // Call the API using JSONP.
        $http.jsonp(API_ROOT + '/weather?callback=JSON_CALLBACK&APPID=58a0c4c313ac9a047be43c97c2c719fc&units=metric&q=' + encodeURI(query)).then(function(response) {
            var statusCode = parseInt(response.data.cod, 10);
            if (statusCode === 200) {
                // Call successful.
                deferred.resolve(response.data);
            } else {
                // Something went wrong. Probably the city doesn't exist.
                deferred.reject(response.data.message);
            }
        }, function(error) {
            // Unable to connect to API.
            deferred.reject(error);
        });
        // Return a promise.
        return deferred.promise;
    };
    this.byCityId = function(id) {
        var deferred = $q.defer();
        $http.jsonp(API_ROOT + '/weather?callback=JSON_CALLBACK&APPID=58a0c4c313ac9a047be43c97c2c719fc&units=metric&id=' + id).then(function(response) {
            var statusCode = parseInt(response.data.cod, 10);
            if (statusCode === 200) {
                deferred.resolve(response.data);
            } else {
                deferred.reject(response.data.message);
            }
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    this.byLocation = function(coords) {
        var deferred = $q.defer();
        $http.jsonp(API_ROOT + '/weather?callback=JSON_CALLBACK&APPID=58a0c4c313ac9a047be43c97c2c719fc&units=metric&lat=' + coords.latitude + '&lon=' + coords.longitude).then(function(response) {
            var statusCode = parseInt(response.data.cod, 10);
            if (statusCode === 200) {
                deferred.resolve(response.data);
            } else {
                deferred.reject(response.data.message);
            }
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    return this;
})

.factory('SessionFactory', function($q) {
    'use string';
    var Session = function() { };

    Session.prototype = {
        dateTimeReviver: function(key, value) {
            if ((key === 'duration') || (key === 'pace')) {
                if (typeof value === 'string') {
                    return new Date(value);
                }
            }
            return value;
        },
        loadFromFile: function(recclicked) {
              var deferred = $q.defer();
<<<<<<< HEAD
              if ((window.device === undefined) || (window.device.platform === 'browser')) {
=======
              if (window.device.platform === 'browser') {
>>>>>>> e65b8c6198c9badd1bc63665965e2965436f7a25
                setTimeout(function(){
                  deferred.resolve(JSON.parse(localStorage.getItem(recclicked + '.json'), Session.dateTimeReviver));
                }, 1);
                return deferred.promise;
              }

              var path = cordova.file.externalApplicationStorageDirectory + 'sessions/' + recclicked + '.json';
              if (cordova.file.externalApplicationStorageDirectory === null) {
                path = cordova.file.documentsDirectory + 'sessions/' + recclicked + '.json';
              }

              if (typeof window.resolveLocalFileSystemURL === 'function') {
                  window.resolveLocalFileSystemURL(path, function(fileEntry) {
                      fileEntry.file(function(file) {
                          var reader = new FileReader();
                          reader.onloadend = function() {
                              deferred.resolve(JSON.parse(this.result, Session.dateTimeReviver));
                          };
                          reader.readAsText(file);
                      });
                  }, function(err) {
                      deferred.reject(err);
                  });
              }
              return deferred.promise;
        },
        saveToFile: function(session) {
          var deferred = $q.defer();
          var filename = session.recclicked.toString() + '.json';
          var path = cordova.file.externalApplicationStorageDirectory;
          if (window.device.platform === 'browser') {
            setTimeout(function(){
              localStorage.setItem(filename, JSON.stringify(session));
              deferred.resolve();
            }, 1);
            return deferred.promise;
          } else if (path === null) {
            path = cordova.file.documentsDirectory;
          } 
          console.log('iOS PATH');
          console.log(path);
          try {
              window.resolveLocalFileSystemURL(path, function(dirEntry) {
                  dirEntry.getDirectory('sessions', {
                      create: true
                  }, function(subDirEntry) {
                      subDirEntry.getFile(filename, {
                          create: true
                      }, function(fileEntry) {
                          fileEntry.createWriter(function(writer) {
                              // Already in JSON Format
                              writer.onwrite = function() {};
                              writer.onwriteend = function() {
                                  deferred.resolve();
                              };
                              writer.onerror = function(e) {
                                  deferred.reject(e);
                              };
                              writer.fileName = filename;
                              writer.write(new Blob([JSON.stringify(session)], {
                                  type: 'text/plain'
                              }));
                          }, function(e) {
                              console.error('Cant write ' + filename);
                              deferred.reject(e);
                          });
                      }, function(e) {
                          console.error('Cant write 2nd ' + filename);
                          deferred.reject(e);
                      });
                  }, function(e) {
                      console.error('Cant write 3th ' + filename);
                      deferred.reject(e);
                  });

              }, function(e) {
                  console.error('Cant write 4th ' + filename);
                  deferred.reject(e);
              });
          } catch (err) {
              console.error('writeSessionsToFile:' + err);
              deferred.reject(err);
          }
          return deferred.promise;
        }
    };

    return Session;
})

.factory('FileFactory', function($q) {
    'use strict';
    var File = function() { };

    File.prototype = {

       getParentDirectory: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURL(path, function(fileSystem) {
                fileSystem.getParent(function(result) {
                    deferred.resolve(result);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
       },

       getEntriesAtRoot: function() {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURL(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                var directoryReader = fileSystem.root.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
       },

        getEntries: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURL(path, function(fileSystem) {
                if (fileSystem.isDirectory) {
                    var directoryReader = fileSystem.createReader();
                    directoryReader.readEntries(function(entries) {
                        deferred.resolve(entries);
                    }, function(error) {
                        deferred.reject(error);
                    });
                } else {
                    deferred.resolve(fileSystem);
                }
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    };

    return File;
  }
);
