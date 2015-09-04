angular.module('starter.controllers', [])

.filter('ldate', function() {
    return function(date) {
        // Using ES6 filter method

        return moment(date).format('llll');
    };
})

.filter('duration', function() {
    return function(date) {
        // Using ES6 filter method

        return moment(date).format('HH:mm');
    };
})

.filter('translatei18', function($filter) {
    return function(text) {
        // Using ES6 filter method

        return $filter('translate')(text.replace('-', ''));
    };
})


.directive('navBarClass', function() {
  return {
    restrict: 'A',
    compile: function(element, attrs) {

      // We need to be able to add a class the cached nav-bar
      // Which provides the background color
      var cachedNavBar = document.querySelector('.nav-bar-block[nav-bar="cached"]');
      var cachedHeaderBar = cachedNavBar.querySelector('.bar-header');

      // And also the active nav-bar
      // which provides the right class for the title
      var activeNavBar = document.querySelector('.nav-bar-block[nav-bar="active"]');
      var activeHeaderBar = activeNavBar.querySelector('.bar-header');
      var barClass = attrs.navBarClass;
      var ogColors = [];
      var colors = ['positive', 'stable', 'light', 'royal', 'dark', 'assertive', 'calm', 'energized'];
      var cleanUp = function() {
        for (var i = 0; i < colors.length; i++) {
          var currentColor = activeHeaderBar.classList.contains('bar-' + colors[i]);
          if (currentColor) {
            ogColors.push('bar-' + colors[i]);
          }
          activeHeaderBar.classList.remove('bar-' + colors[i]);
          cachedHeaderBar.classList.remove('bar-' + colors[i]);
        }
      };
      return function($scope) {
         $scope.$on('$ionicView.beforeEnter', function() {
          cleanUp();
          cachedHeaderBar.classList.add(barClass);
          activeHeaderBar.classList.add(barClass);
        });        
       
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
for (var j = 0; j < ogColors.length; j++) {
            activeHeaderBar.classList.add(ogColors[j]);
            cachedHeaderBar.classList.add(ogColors[j]);
          }
          cachedHeaderBar.classList.remove(barClass);
          activeHeaderBar.classList.remove(barClass);
          ogColors = [];
        
        }); 
      };
    }
  };
})

// Service to communicate with OpenWeatherMap API.
.factory('$weather', function($q, $http) {
    var API_ROOT = 'http://api.openweathermap.org/data/2.5/';
    this.byCityName = function(query) {
        var deferred = $q.defer();
        // Call the API using JSONP.
        $http.jsonp(API_ROOT + '/weather?callback=JSON_CALLBACK&units=metric&q=' + encodeURI(query)).then(function(response) {
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
        $http.jsonp(API_ROOT + '/weather?callback=JSON_CALLBACK&units=metric&id=' + id).then(function(response) {
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
        $http.jsonp(API_ROOT + '/weather?callback=JSON_CALLBACK&units=metric&lat=' + coords.latitude + '&lon=' + coords.longitude).then(function(response) {
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

.controller('AppCtrl', function($state, $scope, $ionicModal, $ionicPopup, $timeout, $ionicPlatform,
    $ionicHistory, $weather, $http, $translate, $filter, ionicMaterialInk, applicationLoggingService, $ionicScrollDelegate,
    leafletData, leafletBoundsHelpers) {
    $scope.weather = $weather;

    $scope.running = false;
    $scope.prefs = {};

    $scope.prefs.minrecordingaccuracy = 14;
    $scope.prefs.minrecordinggap = 1000;
    $scope.prefs.minrecordingspeed = 3;
    $scope.prefs.maxrecordingspeed = 30;
    $scope.prefs.unit = 'kms';

    $scope.prefs.timevocalannounce = true;
    $scope.prefs.distvocalannounce = true;
    $scope.prefs.avgpacevocalannounce = true;
    $scope.prefs.avgspeedvocalannounce = true;
    $scope.prefs.language = 'English';

    $scope.prefs.delay = 10 * 1000;
    $scope.prefs.usedelay = true;
    $scope.prefs.debug = false;
    $scope.prefs.keepscreenon = true;

    $scope.prefs.togglemusic = true;
    $scope.prefs.distvocalinterval = 0; //en km (0 == None)
    $scope.prefs.timevocalinterval = 5; //en minutes
    $scope.prefs.timefastvocalinterval = 0; //en minutes
    $scope.prefs.timelowvocalinterval = 0; //en minutes

    // Load Sessions
    $timeout(function() {
        $scope.loadSessions();
    }, 100);

    $scope.dateTimeReviver = function(key, value) {
        if ((key === 'duration') || (key === 'pace')){
            if (typeof value === 'string') {
                return new Date(value);
            }
        }
        return value;
    };

    $scope.computeAllSessionsFromGPXData = function(){
        $scope.sessions.map(function(session) {
            $scope.computeSessionFromGPXData(session);
        });
        $scope.storageSetObj('sessions', $scope.sessions);
        $scope.computeResumeGraph();
    };

    $scope.computeSessionFromGPXData = function(session) {
        $scope.session = session;
        var gpxPoints = [];
        var lastEle = 0;
        simplify($scope.session.gpxData, 0.000008).map(function(item) {
            if (!isNaN(parseFloat(item[3]))) {
            lastEle = parseFloat(item[3]); }
            gpxPoints.push({
                lat: parseFloat(item[0]),
                lng: parseFloat(item[1]),
                timestamp: item[2],
                ele: lastEle,
                hr: parseFloat(item[4])
            });
        });

        //Max and min for leaflet and ele
        var minHeight = gpxPoints[0].ele;
        var maxHeight = minHeight;
        var lonMin = gpxPoints[0].lng;
        var lonMax = lonMin;
        var latMax = gpxPoints[0].lat;
        var latMin = latMax;
        var eleDown = 0;
        var eleUp = 0;
        var maxHeartRate = 0;

        //For calc
        var curLat = gpxPoints[0].lat;
        var curLng = gpxPoints[0].lng;
        var curDate = gpxPoints[0].timestamp;
        var curEle = gpxPoints[0].ele;
        var curHeartRate = gpxPoints[0].hr;

        var oldLat = curLat;
        var oldLng = curLng;
        var oldDate = curDate;
        var oldEle = curEle;
        var oldHeartRate = curHeartRate;

        var timeStartTmp = new Date(gpxPoints[0].timestamp);
        var timeEndTmp = 0;


        var mz = 1;
        var dTemp = 0;
        var dTotal = 0;
        var dMaxTemp = 1000; // kilometer marker
        var stepDetails = [];

        var mz2 = 1;
        var eleStartTmp = 0;
        var heartRatesTmp = [];
        var heartRatesTmp2 = [];
        var dTemp2 = 0;
        var smallStepDetail = [];
        var timeStartTmp2 = new Date(gpxPoints[0].timestamp);
        var timeEndTmp2 = 0;
        var dMaxTemp2 = 200;

        var paths = {};
        paths.p1 = {
            color: '#3F51B5',
            weight: 2,
            latlngs: []
        };
        var markers = {};
        markers.s = {
            lat: curLat,
            lng: curLng,
            icon: {
                type: 'div',
                className: 'leaflet-circle-marker-start',
                html: 'S',
                iconSize: [20, 20]
            },
            message: 'S',
            draggable: false,
            opacity: 0.8
        };
        markers.e = {
            lat: gpxPoints[gpxPoints.length - 1].lat,
            lng: gpxPoints[gpxPoints.length - 1].lng,
            icon: {
                type: 'div',
                className: 'leaflet-circle-marker-end',
                html: 'E',
                iconSize: [20, 20]
            },
            message: 'S',
            draggable: false,
            opacity: 0.8
        };
        var dists = [];
        for (var p = 0; p < gpxPoints.length; p++) {

            //gpxPoints.map(function(item) {

            curLat = gpxPoints[p].lat;
            curLng = gpxPoints[p].lng;
            curEle = gpxPoints[p].ele;
            curDate = gpxPoints[p].timestamp;
            curHeartRate = gpxPoints[p].hr;

            //Leaflet
            paths.p1.latlngs.push({
                lat: curLat,
                lng: curLng
            });
            if (curLat < latMin) {
                latMin = curLat;
            }
            if (curLat > latMax) {
                latMax = curLat;
            }
            if (curLng < lonMin) {
                lonMin = curLng;
            }
            if (curLng > lonMax) {
                lonMax = curLng;
            }
    
            //Max elevation
            if (curEle > maxHeight)
                maxHeight = curEle;
            if (curEle < minHeight)
                minHeight = curEle;
            if (curHeartRate > maxHeartRate) {
                maxHeartRate = curHeartRate;
            }

            if (p > 0) {
                //Distances
                dLat = (curLat - oldLat) * Math.PI / 180;
                dLon = (curLng - oldLng) * Math.PI / 180;
                dLat1 = (oldLat) * Math.PI / 180;
                dLat2 = (curLat) * Math.PI / 180;
                a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                d = 6371 * c;
                dTotal += d;
                gpxPoints[p].dist = dTotal;

                if (curHeartRate) {
                    heartRatesTmp.push(curHeartRate);
                    heartRatesTmp2.push(curHeartRate);
                }

                dTemp += (d * 1000);
                if (dTemp >= dMaxTemp) {
                    markers[mz] = {
                        lat: curLat,
                        lng: curLng,
                        icon: {
                            type: 'div',
                            className: 'leaflet-circle-marker',
                            html: mz,
                            iconSize: [20, 20]
                        },
                        message: mz + " Km(s)",
                        draggable: false,
                        opacity: 0.8
                    };
                    timeEndTmp = new Date(gpxPoints[p].timestamp);
                    timeDiff = timeEndTmp - timeStartTmp;
                    gpxpacetmp = (timeDiff) / (dTemp / 1000);
                    gpxpacetmp = (Math.round(gpxpacetmp * 100) / 100) * 1;
                    gpxspeedtmp = (Math.round((dTemp / 1000) * 100) / 100) / (timeDiff / 1000 / 60 / 60);
                    gpxspeedtmp = Math.round(gpxspeedtmp * 100) / 100;
                    stepDetails.push({
                        pace: new Date(gpxpacetmp),
                        speed: gpxspeedtmp,
                        km: (mz * dMaxTemp) / 1000,
                        hr: heartRatesTmp.avg()
                    });
                    timeStartTmp = new Date(gpxPoints[p].timestamp);
                    mz++;
                    dTemp = 0;
                    heartRatesTmp = [];
                }

                dTemp2 += (d * 1000);
                if (dTemp2 >= dMaxTemp2) {

                    timeEndTmp2 = new Date(gpxPoints[p].timestamp);
                    timeDiff = timeEndTmp2 - timeStartTmp2;
                    gpxpacetmp = (timeDiff) / (dTemp / 1000);
                    gpxpacetmp = (Math.round(gpxpacetmp * 100) / 100) * 1;
                    gpxspeedtmp = (Math.round((dTemp2 / 1000) * 100) / 100) / (timeDiff / 1000 / 60 / 60);
                    gpxspeedtmp = Math.round(gpxspeedtmp * 100) / 100;
                    smallStepDetail.push({
                        pace: new Date(gpxpacetmp),
                        speed: gpxspeedtmp,
                        km: (mz2 * dMaxTemp2 / 10) / 100,
                        ele: (eleStartTmp + curEle) / 2,
                        hr: heartRatesTmp2.avg()
                    });
                    timeStartTmp2 = new Date(gpxPoints[p].timestamp);
                    mz2++;
                    dTemp2 = 0;
                    eleStartTmp = curEle;
                    heartRatesTmp2 = [];
                }


            }
            oldLat = curLat;
            oldLng = curLng;
            oldDate = curDate;
            oldEle = curEle;
        }

        //Date
        $scope.session.date = moment(new Date(gpxPoints[0].timestamp)).format('llll');

        //Points
        $scope.session.gpxPoints = gpxPoints;

        //Maps markers
        if ($scope.session.map === undefined) {
            $scope.session.map = {
                center: {
                    lat: 48,
                    lng: 4,
                    zoom: 5,
                    autoDiscover: false
                },
                paths: {},
                bounds: {},
                controls: {scale:true},
                markers: {},
                tiles: {
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
            };
        }
        $scope.session.map.markers = markers;
        $scope.session.map.paths = paths;

        //Maps bounds
        $scope.session.map.bounds = leafletBoundsHelpers.createBoundsFromArray([
            [latMin, lonMin],
            [latMax, lonMax]
        ]);
        $scope.session.map.defaults = {
            scrollWheelZoom: false
        };

        //Pace by km
        $scope.session.paceDetails = stepDetails;
    
        //Heart Rate OK ?
        if (heartRatesTmp2.length > 1) {
            $scope.session.heartRate = true;
        } else {$scope.session.heartRate = false;}

        //Graph speed / ele
        $scope.session.chart_options = {
            animation: false,
            showTooltips: false,
            showScale: true,
            scaleIntegersOnly: true,
            bezierCurve: true,
            pointDot: false,
            responsive: true,
            scaleUse2Y: true,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        };
        $scope.session.chart_options = {
            animation: false,
            showTooltips: false,
            showScale: true,
            scaleIntegersOnly: true,
            bezierCurve: true,
            pointDot: false,
            responsive: true,
            scaleUse2Y: true,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        };


        $scope.session.chart_labels = [];
        $scope.session.chart_data = [
            [],
            []
        ];
        $scope.session.chart2_data = [
            [],
            []
        ];
        $scope.session.chart_series = [$scope.translateFilter('_speed_kph'), $scope.translateFilter('_altitude_meters')];
        $scope.session.chart2_series = [$scope.translateFilter('_speed_kph'), $scope.translateFilter('_bpms_label')];
        smallStepDetail.map(function(step) {
            if (Math.round(step.km) == step.km) {
                $scope.session.chart_labels.push(step.km);
            } else {
                $scope.session.chart_labels.push('');
            }

            $scope.session.chart_data[0].push(step.speed);
            $scope.session.chart_data[1].push(step.ele);
            $scope.session.chart2_data[0].push(step.speed);
            $scope.session.chart2_data[1].push(step.hr);
            
        });

        // altitude
        // simplification altitude

        var elePoints = simplify($scope.session.gpxData, 0.0002);
        eleUp = 0;//parseFloat(elePoints[0][3]);
        eleDown = 0;//parseFloat(elePoints[0][3]);

        for (p = 0; p < elePoints.length; p++) {
            curEle = elePoints[p][3];

            if (p > 0) {

                oldEle = elePoints[p - 1][3];

                if (curEle > oldEle) {
                    eleUp += (curEle) - (oldEle);
                } else if (curEle < oldEle) {
                    eleDown += (oldEle) - (curEle);
                }

            }
        }


        var gpxStart = gpxPoints[0].timestamp;
        var gpxEnd = gpxPoints[gpxPoints.length - 1].timestamp;

        var d1 = new Date(gpxStart);
        var d2 = new Date(gpxEnd);
        var miliseconds = d2 - d1;


        var tmpMilliseconds = miliseconds;

        var seconds = miliseconds / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;

        days = tmpMilliseconds / 1000 / 60 / 60 / 24;
        days = Math.floor(days);

        tmpMilliseconds = tmpMilliseconds - (days * 24 * 60 * 60 * 1000);
        hours = tmpMilliseconds / 1000 / 60 / 60;
        hours = Math.floor(hours);

        tmpMilliseconds = tmpMilliseconds - (hours * 60 * 60 * 1000);
        minutes = tmpMilliseconds / 1000 / 60;
        minutes = Math.floor(minutes);

        tmpMilliseconds = tmpMilliseconds - (minutes * 60 * 1000);
        seconds = tmpMilliseconds / 1000;
        seconds = Math.floor(seconds);

        var gpxdur = new Date("Sun May 10 2015 " + hours + ":" + minutes + ":" + seconds + " GMT+0200");

        var gpxpace = (miliseconds) / dTotal;
        gpxpace = (Math.round(gpxpace * 100) / 100) * 1;
        gpxpace = new Date(gpxpace);

        var gpxspeed = (Math.round(dTotal * 100) / 100) / (miliseconds / 1000 / 60 / 60);
        gpxspeed = Math.round(gpxspeed * 100) / 100;

        $scope.session.gpxMaxHeight = Math.round(maxHeight);
        $scope.session.gpxMinHeight = Math.round(minHeight);
        $scope.session.distance = Math.round(dTotal * 100) / 100;
        $scope.session.pace = gpxpace;
        $scope.session.speed = gpxspeed;
        $scope.session.eleUp = Math.round(eleUp);
        $scope.session.eleDown = Math.round(eleDown);
        $scope.session.distk = $scope.session.distance.toFixed(0);

        $scope.session.duration = new Date(d2 - d1);

        $scope.session.start = gpxPoints[0].timestamp;
        $scope.session.end = gpxPoints[gpxPoints.length - 1].timestamp;

    };

    $scope.backupOnStorage = function() {

        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
            //cordova.file.externalDataDirectory
            dirEntry.getFile('forrunners.backup', {
                create: true
            }, function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    // Already in JSON Format
                    writer.onwrite = function(e) {
                        $ionicPopup.alert({
                            title: $scope.translateFilter('_backup_ok_title'),
                            template: $scope.translateFilter('_backup_ok_content')
                        });
                    };
                    writer.onerror = function(e) {
                        $ionicPopup.alert({
                            title: $scope.translateFilter('_backup_error_title'),
                            template: $scope.translateFilter('_backup_error_content')
                        });
                        console.error(e);
                    };
                    writer.fileName = 'forrunners.backup';
                    writer.write(new Blob([localStorage.getItem('sessions')], {
                        type: 'text/plain'
                    }));
                }, function() {
                    console.error("failed can t create writer");
                });
            }, function() {
                console.error("failed to get file");
            });
        }, function() {
            console.error("failed can t open fs");
        });
    };

    $scope.restoreFromStorage = function() {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
            //cordova.file.externalDataDirectory
            dirEntry.getFile('forrunners.backup', {
                create: true
            }, function(fileEntry) {

                fileEntry.file(function(file) {
                    var reader = new FileReader();

                    reader.onloadend = function(e) {
                        $scope.storageSetObj('sessions', JSON.parse(this.result, $scope.dateTimeReviver));
                        $scope.computeAllSessionsFromGPXData();
                        $scope.loadSessions();
                        $scope.computeResumeGraph();
                        $ionicPopup.alert({
                            title: $scope.translateFilter('_restore_ok_title'),
                            template: $scope.translateFilter('_restore_ok_content')
                        });
                    };

                    reader.readAsText(file);
                });

            }, function() {
                console.error("failed to get file");
            });
        }, function() {
            console.error("failed can t open fs");
        });
    };

    $scope.importGPX = function(file) {

        var reader = new FileReader();

        reader.onloadend = function(e) {
            var x2js = new X2JS();
            var json = x2js.xml_str2json(this.result);
            var gpxPoints = json.gpx.trk.trkseg.trkpt;

            //NOW RECOMPUTE AND CREATE
            $scope.session = {};
            $scope.session.gpxData = [];

            gpxPoints.map(function(item) {
                var bpms;
                try {
                    bpms = parseFloat(item.extensions.TrackPointExtension.hr.__text);
                } catch(exception) {
                    try {
                        bpms = parseFloat(item.extensions.hr.__text);
                    } catch(exception2) {
                        bpms = undefined;
                    }
                }
                $scope.session.gpxData.push([item._lat, item._lon, item.time, item.ele, bpms]);    
            });

            $scope.session.recclicked = new Date(gpxPoints[0].time).getTime();
            //$scope.computeSessionFromGPXData($scope.session);
            //Save session already compute session
            $scope.saveSession();
        };

        reader.readAsText(file);
    };

    $scope.importGPXs = function(element) {
        for (var idx in element.files) {
            if (typeof element.files[idx] == "object")
                {$scope.importGPX(element.files[idx]);}
        }

        $ionicPopup.alert({
            title: $scope.translateFilter('_gpx_import_title'),
            template: $scope.translateFilter('_gpx_file_imported')
        });

    };


    $scope.exportAsGPX = function() {
        var gpxHead = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n';
        gpxHead += '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="ForRunners" version="1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">';
        gpxHead += '<metadata>\n';
        gpxHead += '<link href="http://www.khertan.net">\n';
        gpxHead += '<text>Khertan Software</text>\n';
        gpxHead += '</link>\n';
        gpxHead += '<time>' + moment().format() + '</time>\n';
        gpxHead += '</metadata>\n';
        gpxHead += '<trk>\n';
        gpxHead += '<trkseg>\n';

        var gpxSubHead = "";
        var gpxFoot = '</trkseg></trk>\n</gpx>';

        $scope.sessions.map(function(session, idx) {
            var stordir = cordova.file.externalDataDirectory;
            if (!stordir) {
                stordir = cordova.file.dataDirectory;
            }
            window.resolveLocalFileSystemURL(stordir, function(dirEntry) {
                dirEntry.getFile(moment(session.recclicked).format('YYYYMMDD_hhmm') + '.gpx', {
                    create: true
                }, function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        // Already in JSON Format
                        writer.onwrite = function(e) {
                        };
                        writer.onerror = function(e) {
                            $ionicPopup.alert({
                                title: $scope.translateFilter('_gpx_error_title'),
                                template: $scope.translateFilter('_gpx_error_content')
                            });
                            console.error(e);
                            console.error(writer.error);
                        };
                        writer.fileName = moment(session.recclicked).format('YYYYMMDD_hhmm') + '.gpx';
                        gpxSubHead = '<name>' + session.date + '</name>\n';

                        var gpxPoints = "";
                        session.gpxData.map(function(pts) {
                            gpxPoints += "<trkpt lat=\"" + pts[0] + "\" lon=\"" + pts[1] + "\">\n";
                            gpxPoints += "<ele>" + pts[3] + "</ele>\n";
                            gpxPoints += "<time>" + pts[2] + "</time>\n";
                            if (pts[4]) {
                                gpxPoints += "<extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>"+pts[4]+"</gpxtpx:hr></gpxtpx:TrackPointExtension></extensions>";
                            }
                            gpxPoints += "</trkpt>\n";
                        });
                        writer.write(gpxHead + gpxSubHead + gpxPoints + gpxFoot, {
                            type: 'text/plain'
                        });
                    }, function() {
                        //console.log("failed can t create writer");
                    });
                }, function() {
                    //console.log("failed to get file");
                });
            }, function() {
                //console.log("failed can t open fs");
            });
        });

        $ionicPopup.alert({
            title: $scope.translateFilter('_gpx_export_title'),
            template: $scope.translateFilter('_gpx_file_exported')
        });

    };

    $scope.storageSetObj = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    $scope.storageGetObj = function(key) {
        return JSON.parse(localStorage.getItem(key));
    };

    $scope.setLang = function() {
        var lang = 'en-US';
        //console.log($scope.prefs.language);
        //if ($scope.prefs.language === 'English') {lang = 'en-US';}
        //else if ($scope.prefs.language === 'Francais') {lang = 'fr-FR';}
        if ($scope.prefs.language) {
            lang = $scope.prefs.language;
        }
        $translate.use(lang);
        moment.locale(lang);
    };

    //$scope.translate = $translate.filter('translate');
    $scope.translateFilter = $filter('translate');

    var prefs = $scope.storageGetObj('prefs');
    if (prefs) {
        for (var prop in prefs) {
            $scope.prefs[prop] = prefs[prop];
        }
        //console.log('Prefs load ended');
        $scope.setLang();
    } else {
        //console.log('Really ? No Prefs ?');
    }


    $scope.loadSessions = function() {
        try {
            $scope.sessions = JSON.parse(localStorage.getItem('sessions'), $scope.dateTimeReviver);

            // Remove Duplicate
            $scope.sessions = $scope.sessions.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
            });

            // Clear divider that could be still here
            /*$scope.sessions.map(function (value, idx) {
        if (value.isDivider === true) {
          $scope.sessions.splice(idx, 1);
        }
      });*/
            // Temp fix
            //$scope.sessions.map(function(session, idx) {
            //    $scope.sessions[idx].map.tiles = {url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'};
            //});

            // Temp fix
            /*$scope.sessions.map(function(session, idx) {
                $scope.sessions[idx].distk = session.distance.toFixed(0);
            });*/

            // Filter null
            //$scope.sessions = $scope.sessions.filter(function(e) {
            //    return e;
            //});

            $scope.sessions.sort(function(a, b) {
                var x = a.recclicked;
                var y = b.recclicked;
                return (((x < y) ? -1 : ((x > y) ? 1 : 0)) * -1);
            });
            
           /*var previousKey = '';
      $scope.sessions.map(function (session, idx) {
          if (session.mdate != previousKey) {
              previousKey = session.mdate;
              $scope.sessions.splice(idx, 0, {'mdate':session.mdate,
                                              'isDivider':true});
          }
      });*/

            // Set Motion
            //ionicMaterialMotion.fadeSlideInRight();

            /*$timeout(function () {
          ionicMaterialMotion.fadeSlideInRight();
      }, 300);*/

        } catch (exception) {
            console.error(exception);
            $scope.sessions = [];
        }
    };

    $scope.glbs = {
        heartRate: {
                service: '180d',
                measurement: '2a37'
        },
        radius: {
            miles: 3959,
            kms: 6371
        },
        tounit: {
            miles: 1609.344,
            kms: 1000
        },
        pace: {
            miles: 26.8224,
            kms: 16.6667
        },
        speed: {
            miles: 2.2369,
            kms: 3.6
        },
        pacelabel: {
            miles: ' min/mile',
            kms: ' min/km'
        },
        speedlabel: {
            miles: ' mph',
            kms: ' kph'
        },
        distancelabel: {
            miles: ' miles',
            kms: ' km'
        }
    };

    $ionicPlatform.registerBackButtonAction(function() {
        if ($scope.running === false) {
            var view = $ionicHistory.backView();
            if (view) {
                view.go();
            }
        } else {
            $state.go('app.running');
        }
    }, 100);

    $scope.openModal = function() {

        /*$ionicModal.fromTemplateUrl('templates/running.html', {
      scope: $scope,
      animation: 'slide-in-up',
      hardwareBackButtonClose: false
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
    $scope.$on('backbutton', function () {
        console.log('Nothing');
  });*/
        $state.go('app.running');

    };

    $scope.closeModal = function() {
        //$scope.modal.hide();
        //$scope.modal.remove();
        $state.go('app.sessions');
    };

    $scope.heartRateOnData = function(buffer){
        var data = new Uint8Array(buffer);
        $scope.session.beatsPerMinute = data[1];
    };
    $scope.heartRateOnConnect = function(peripheral) {
        ble.notify(peripheral.id,
                   $scope.glbs.heartRate.service,
                   $scope.glbs.heartRate.measurement,
                   $scope.heartRateOnData, 
                   function(err) {
                       console.error('BLE error :'+err);
                       $scope.session.beatsPerMinute = null;
                   });
    };

    $scope.heartRateOnDisconnect = function(reason) {
        console.debug("BLE Disconnected");
        $scope.session.beatsPerMinute = null;
    };

    $scope.heartRateScan = function() {
        // https://developer.bluetooth.org/gatt/services/Pages/ServiceViewer.aspx?u=org.bluetooth.service.heart_rate.xml
        ble.scan([$scope.glbs.heartRate.service], 5, 
                //onScan
                function(peripheral) {
                    console.debug("Found " + JSON.stringify(peripheral));
                    foundHeartRateMonitor = true;
                    ble.connect(peripheral.id, 
                                $scope.heartRateOnConnect,
                                $scope.heartRateOnDisconnect);
                }, function(){console.error("BluetoothLE scan failed");});};

    $scope.stopSession = function() {
        navigator.geolocation.clearWatch($scope.session.watchId);
        if ($scope.session.gpxData.length > 0) {
            //Session cleaning
            delete $scope.session.accuracy;
            delete $scope.session.elapsed;
            delete $scope.session.firsttime;
            delete $scope.session.elevation;                
            delete $scope.session.time;
            delete $scope.session.pace;
            delete $scope.session.speed;
            delete $scope.session.maxspeed;
            delete $scope.session.equirect;
            delete $scope.session.eledist;
            delete $scope.session.altold;
            delete $scope.session.latold;
            delete $scope.session.lonold;
            delete $scope.session.latold;
            delete $scope.session.lastdisptime;
            delete $scope.session.maxalt;
            delete $scope.session.minalt;
            delete $scope.session.hilldistance;
            delete $scope.session.flatdistance;
            delete $scope.session.avpace;
            delete $scope.session.avspeed;
            delete $scope.session.lastdistvocalannounce;
            delete $scope.session.lasttimevocalannounce;
            delete $scope.session.timeslowvocalinterval;
            delete $scope.session.lastfastvocalannounce;

            $scope.saveSession();
            $scope.computeResumeGraph();
        }
        $scope.running = false;
        try {
            cordova.plugins.backgroundMode.disable();
        } catch (exception) {
            console.debug('ERROR: cordova.plugins.backgroundMode disable');
        }
        try {
            window.plugins.insomnia.allowSleepAgain();
        } catch (exception) {
            console.debug('ERROR: cordova.plugins.insomnia allowSleepAgain');
        }

        $scope.closeModal();
    };

    $scope.calcDistances = function(oldPos, newPos) {
        var x = $scope.toRad(newPos.lon - oldPos.lon) * Math.cos($scope.toRad(oldPos.lat + newPos.lat) / 2);
        var y = $scope.toRad(newPos.lat - oldPos.lat);
        var e = Math.sqrt(x * x + y * y) * $scope.glbs.radius[$scope.prefs.unit];
        var eledist = e;
        if ((oldPos.alt !== 'x') && (!isNaN(oldPos.alt))) {
            var elechange = (newPos.alt - oldPos.alt) / $scope.glbs.tounit[$scope.prefs.unit];
            //converts metres to miles or km
            eledist += Math.sqrt(e * e + elechange * elechange);
        }
        return {
            'equirect': e,
            'eledist': eledist
        };


    };

    $scope.speakText = function(text) {
        try {

            musicControl.isactive(function(err, cb) {
                if (err) {
                        console.error(err);
                    }
                
                var stopMusic = (cb && $scope.prefs.togglemusic);   

                var utterance = new SpeechSynthesisUtterance();

                utterance.text = text;
                utterance.volume = 1;
                utterance.lang = ($scope.prefs.language);

            
                if (stopMusic) {
                    utterance.onend = function(event) {
                        if (stopMusic) {             
                            musicControl.togglepause(function(err, cb) {
                                    if (err) {
                                        console.error(err);
                                    }
                                    return;
                                });
                            }                
                        };
                    musicControl.togglepause(function(err, cb) {
                        if (err) {
                            console.error(err);
                        }
                        speechSynthesis.speak(utterance);
                        return;
                    });
                } else {
                    speechSynthesis.speak(utterance);
                }
            });
        } catch (exception) {
            console.debug("SpeechSynthesisUtterance not available : " + exception);
        }
    };

    $scope.testRunSpeak = function() {
        $scope.session = {};
        $scope.session.equirect = 3.24;
        $scope.session.avspeed = 11.21;
        $scope.session.avpace = "5:28";
        $scope.session.time = "1:28:23";
        $scope.runSpeak();
    };

    $scope.runSpeak = function(hour, minute) {
        var speechText = '';
        if ($scope.prefs.distvocalannounce) {
            speechText += $scope.session.equirect.toFixed(2) + ' ' + $scope.translateFilter('_kilometers') + ' ';
        }
        if ($scope.prefs.timevocalannounce) {
            speechText += ', ';
            var hs = $scope.session.time.split(':')[0];
            if (parseInt(hs, 10) > 0) {
                speechText += hs + ' ' + $scope.translateFilter('_hours') + ' ' + $scope.translateFilter('_and') + ' ';
            }
            speechText += $scope.session.time.split(':')[1] + ' ' + $scope.translateFilter('_minutes');
        }

        if ($scope.prefs.avgspeedvocalannounce) {
            speechText += ', ' + $scope.session.speed + ' ' + $scope.translateFilter('_kilometers_per_hour') + ' ';
        }
        if ($scope.prefs.avgpacevocalannounce) {
            speechText += ', ';
            speechText += $scope.session.avpace.split(':')[0] + ' ' + $scope.translateFilter('_minutes') + ' ' + $scope.translateFilter('_and') + ' ';
            speechText += $scope.session.avpace.split(':')[1] + ' ' + $scope.translateFilter('_seconds_per_kilometers');
        }

        $scope.speakText(speechText);
    };

    $scope.recordPosition = function(position) {
        if ($scope.mustdelay === false) {
            var latnew = position.coords.latitude;
            var lonnew = position.coords.longitude;
            var timenew = position.timestamp;
            var altnew = 'x';
            var elapsed = 0;
            var gpsGoodSignalToggle = false;
            var speechText = '';


            if (typeof position.coords.altitude === 'number') {
                altnew = position.coords.altitude;
            }

            $scope.$apply(function() {
                $scope.session.accuracy = position.coords.accuracy;

                if ((position.coords.accuracy <= $scope.prefs.minrecordingaccuracy) && (timenew > $scope.session.recclicked) && ($scope.session.latold != 'x') && ($scope.session.lonold != 'x')) {

                    //Elapsed time
                    elapsed = timenew - $scope.session.firsttime;
                    var hour = Math.floor(elapsed / 3600000);
                    var minute = ('0' + (Math.floor(elapsed / 60000) - hour * 60)).slice(-2);
                    var second = ('0' + Math.floor(elapsed % 60000 / 1000)).slice(-2);
                    $scope.session.time = hour + ':' + minute + ':' + second;
                    $scope.session.elapsed = elapsed;
                    gpsGoodSignalToggle = true;

                }

                if ((position.coords.accuracy >= $scope.prefs.minrecordingaccuracy) && (gpsGoodSignalToggle === true) && (timenew > $scope.session.recclicked) && ($scope.session.latold != 'x') && ($scope.session.lonold != 'x') && ((parseInt($scope.prefs.distvocalinterval) > 0) || (parseInt($scope.prefs.timevocalinterval) > 0))) {
                    // In case we lost gps we should announce it
                    gpsGoodSignalToggle = false;
                    //$scope.speakText("GPS Lost");
                }

                if ((position.coords.accuracy <= $scope.prefs.minrecordingaccuracy) && (timenew > $scope.session.recclicked)) {
                    // Instant speed
                    if (position.coords.speed) {
                        var currentPace = $scope.glbs.pace[$scope.prefs.unit] / position.coords.speed;
                        //converts metres per second to minutes per mile or minutes per km
                        $scope.session.pace = Math.floor(currentPace) + ':' + ('0' + Math.floor(currentPace % 1 * 60)).slice(-2);
                        $scope.session.speed = (position.coords.speed * $scope.glbs.speed[$scope.prefs.unit]).toFixed(1);
                        if ($scope.session.maxspeed < $scope.session.speed) {
                            $scope.session.maxspeed = $scope.session.speed;
                        }
                    }
                    

                    // Not first point
                    if ($scope.session.latold != 'x' && $scope.session.lonold != 'x') {

                        //Limit ok
                        if (timenew - $scope.session.lastdisptime >= $scope.prefs.minrecordinggap) {
                            $scope.session.lastdisptime = timenew;
                            //Calc distances
                            var distances = $scope.calcDistances({
                                'lon': $scope.session.lonold,
                                'lat': $scope.session.latold,
                                'alt': $scope.session.altold
                            }, {
                                'lon': lonnew,
                                'lat': latnew,
                                'alt': altnew
                            });
                            $scope.session.equirect += distances.equirect;
                            $scope.session.eledist += distances.eledist;

                            //Elevation?
                            if ($scope.session.altold != 'x') {
                                $scope.session.altold = altnew;
                                if (altnew > $scope.session.maxalt) {
                                    $scope.session.maxalt = altnew;
                                    $scope.session.elevation = ($scope.session.maxalt - $scope.session.minalt).toFixed(1);
                                }
                                if (altnew < $scope.session.minalt) {
                                    $scope.session.minalt = altnew;
                                    $scope.session.elevation = ($scope.session.maxalt - $scope.session.minalt).toFixed(1);
                                }
                            }
                            $scope.session.hilldistance = $scope.session.eledist.toFixed(2);
                            $scope.session.flatdistance = $scope.session.equirect.toFixed(2);
                            $scope.session.distk = $scope.session.equirect.toFixed(1);
                            if ($scope.session.equirect > 0) {
                                lapsed = timenew - $scope.session.firsttime;
                                var averagePace = elapsed / ($scope.session.equirect * 60000);
                                $scope.session.avpace = Math.floor(averagePace) + ':' + ('0' + Math.floor(averagePace % 1 * 60)).slice(-2);
                                var avspeed = ($scope.session.equirect * 3.6 / elapsed);
                                if (avspeed) {
                                    $scope.session.avspeed = avspeed.toFixed(1);
                                } else {
                                    $scope.session.avspeed = "0";
                                }

                            }
                            $scope.session.latold = latnew;
                            $scope.session.lonold = lonnew;
                            $scope.session.altold = altnew;

                            //Alert and Vocal Announce
                            if (parseInt($scope.prefs.distvocalinterval) > 0) {
                                $scope.session.lastdistvocalannounce = 0;
                                if (($scope.session.equirect - $scope.session.lastdistvocalannounce) > $scope.prefs.distvocalinterval * 1000) {
                                    $scope.session.lastdistvocalannounce = $scope.session.equirect;
                                    $scope.runSpeak();
                                }
                            }

                            if (parseInt($scope.prefs.timevocalinterval) > 0) {
                                if ((timenew - $scope.session.lasttimevocalannounce) > $scope.prefs.timevocalinterval * 60000) /*fixme*/ {
                                    $scope.session.lasttimevocalannounce = timenew;
                                    $scope.runSpeak();
                                }
                            }

                            if (parseInt($scope.prefs.timeslowvocalinterval) > 0) {
                                if (($scope.session.lastslowvocalannounce != -1) && ((timenew - $scope.session.lastslowvocalannounce) > $scope.prefs.timeslowvocalinterval * 60000)) /*fixme*/ {
                                    $scope.session.lastslowvocalannounce = -1;
                                    $scope.session.lastfastvocalannounce = timenew;
                                    $scope.speakText($scope.translateFilter('_run_fast'));
                                }
                            }
                            if (parseInt($scope.prefs.timefastvocalinterval) > 0) {
                                if (($scope.session.lastfastvocalannounce != -1) && ((timenew - $scope.session.lastfastvocalannounce) > $scope.prefs.timefastvocalinterval * 60000)) /*fixme*/ {
                                    $scope.session.lastslowvocalannounce = timenew;
                                    $scope.session.lastfastvocalannounce = -1;
                                    $scope.speakText($scope.translateFilter('_run_slow'));
                                }
                            }

                        }
                    } else {
                        $scope.session.firsttime = timenew;
                        $scope.session.lastdisptime = timenew;
                        $scope.session.lastdistvocalannounce = 0;
                        $scope.session.lasttimevocalannounce = timenew;
                        $scope.session.lastslowvocalannounce = timenew;
                        $scope.session.lastfastvocalannounce = -1;
                        $scope.session.latold = latnew;
                        $scope.session.lonold = lonnew;
                        $scope.session.time = '00:00:00';
                        $scope.session.hilldistance = '0';
                        $scope.session.flatdistance = '0';
                        $scope.session.maxspeed = '0';
                        $scope.session.speed = '0';
                        $scope.session.avspeed = '0';
                        $scope.session.elapsed = 0;
                        $scope.session.minalt = 99999;
                        $scope.session.maxalt = 0;
                        $scope.session.elevation = '0';
                    }
                    if (timenew - $scope.session.lastrecordtime >= $scope.prefs.minrecordinggap) {
                        var pointData = [
                            latnew.toFixed(6),
                            lonnew.toFixed(6),
                            new Date(timenew).toISOString() //.replace(/\.\d\d\d/, '')
                        ];

                        if (typeof position.coords.altitude === 'number') {
                            pointData.push(position.coords.altitude);
                        } else {
                            pointData.push('x');
                        }

                        if ($scope.session.beatsPerMinute)  {
                            pointData.push($scope.session.beatsPerMinute);
                        } else {
                           pointData.push('x');
                        }
                        $scope.session.gpxData.push(pointData);
                        $scope.session.lastrecordtime = timenew;
                    }

                    // Record Weather
                    if ($scope.session.weather === '') {
                        //FIXME
                        $scope.weather.byLocation({
                            'latitude': latnew,
                            'longitude': lonnew
                        }).then(function(weather) {
                            $scope.session.weather = weather;
                        });
                    }
                }
            });
        }
    };

    $scope.toRad = function(x) {
        return x * Math.PI / 180;
    };

    $scope.errorfn = function(err) {
        console.debug('errorfn:' + err);
    };

    $scope.startSession = function() {
        $scope.running = true;

        $scope.session = {};
        $scope.session.recclicked = new Date().getTime();
        $scope.session.date = moment().format('llll');

        $scope.session.mdate = moment().format("MMMM YYYY");
        $scope.session.ddate = new Date().getDate();
        $scope.session.gpxData = [];

        $scope.session.unit = $scope.prefs.unit;
        $scope.session.speedlabel = $scope.glbs.speedlabel[$scope.prefs.unit];
        $scope.session.pacelabel = $scope.glbs.pacelabel[$scope.prefs.unit];
        $scope.session.distancelabel = $scope.glbs.distancelabel[$scope.prefs.unit];

        $scope.session.lastrecordtime = 0;
        $scope.session.elapsed = 0;
        $scope.session.firsttime = 0;

        $scope.session.latold = 'x';
        $scope.session.lonold = 'x';
        $scope.session.altold = 'x';

        $scope.session.time = '00:00:00';
        $scope.session.dist = 0;

        $scope.session.equirect = 0;
        $scope.session.eledist = 0;
        $scope.session.hilldistance = '0';
        $scope.session.flatdistance = '0';
        $scope.session.elevation = '0';
        $scope.session.maxspeed = '0';
        $scope.session.speed = '0';
        $scope.session.avspeed = '0';
        $scope.session.avpace = '00:00';

        $scope.session.weather = '';
        $scope.session.temp = '';

        $scope.mustdelay = ($scope.prefs.useDelay === true);
        $scope.delay = new Date().getTime();
        if ($scope.mustdelay === true) {
            $scope.mustdelaytime = new Date().getTime();
            $scope.mustdelayintervalid = setInterval($scope.delayCheck, 500);
        }
        try {
            cordova.plugins.backgroundMode.setDefaults({
                title: 'ForRunners',
                ticker: $scope.translateFilter('_notification_slug'),
                text: $scope.translateFilter('_notification_message')
            });
            cordova.plugins.backgroundMode.enable();
        } catch (exception) {
            console.debug('ERROR: cordova.plugins.backgroundMode not enabled');
        }

        if ($scope.prefs.keepscreenon === true) {
            try {
                window.plugins.insomnia.keepAwake();
            } catch (exception) {
                console.debug('ERROR: window.plugins.insomnia keepAwake');
            }
        }

        try {
            $scope.heartRateScan();
        } catch (exception) {
            console.debug('ERROR: BLEScan:' + exception);
        }


        if ($scope.prefs.debug) {
            $scope.prefs.minrecordingaccuracy = 5000000;
        }
        $scope.session.watchId = navigator.geolocation.watchPosition(
            $scope.recordPosition,
            $scope.errorfn, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 500
            });

        $scope.openModal();
    };


    $scope.delayCheck = function() {
        if ((new Date().getTime() - $scope.mustdelaytime) < $scope.prefs.delay) {
            $scope.delay = (new Date().getTime() - $scope.mustdelaytime);
            $scope.session.time = (-($scope.prefs.delay - $scope.delay) / 1000).toFixed(0);
            //Using get
            navigator.geolocation.getCurrentPosition(function(p) {}, function(p) {}, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 100
            });
            $scope.$apply();
        } else {
            $scope.mustdelay = false;
            $scope.speakText($scope.translateFilter('go'));
            $scope.session.time = '00:00:00';
            clearInterval($scope.mustdelayintervalid);
            $scope.$apply();
        }
    };

    $scope.saveSession = function() {
        var sessions = [];
        //DOCOMPUTE        
        try {
            sessions = $scope.storageGetObj('sessions');
        } catch (exception) {}

        if (!sessions) {
            sessions = [];
        }

        if (sessions.indexOf($scope.session) < 0) {
            $scope.session.map = {
                center: {
                    lat: 48,
                    lng: 4,
                    zoom: 5,
                    autoDiscover: false
                },
                paths: {},
                bounds: {},
                controls: {scale:true},
                markers: {},
                tiles: {
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
            };
            try {
                $scope.computeSessionFromGPXData($scope.session);
            } catch (exception){
                console.error("ComputeSessionFromGPX Failed on save:"+exception);
            }
            sessions.push($scope.session);
            $scope.storageSetObj('sessions', sessions);
            $scope.loadSessions();
        }
    };

    $scope.savePrefs = function() {
        $scope.storageSetObj('prefs', $scope.prefs);
        $scope.setLang();
    };


    $scope.computeResumeGraph = function() {
        $scope.resume = [];
        $scope.resume.chart_labels = [];
        $scope.resume.chart_series = [$scope.translateFilter('_speed_kph'), $scope.translateFilter('_duration_minutes')];
        $scope.resume.chart_data = [
            [],
            []
        ];
        $scope.resume.chart_options = {
            responsive: true,
            animation: false,
            showScale: false,
            scaleShowLabels: false,
            pointHitDetectionRadius: 10,
            scaleUse2Y: true,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        };

        $scope.resume.elapsed = 0;
        $scope.resume.equirect = 0;
        $scope.resume.avspeed = 0;

        $scope.resume.longesttime = new Date(0);
        $scope.resume.bestdistance = 0;
        $scope.resume.bestspeed = 0;

        $scope.sessions.map(function(item) {

            $scope.resume.chart_labels.push(item.date);
            $scope.resume.chart_data[0].push(item.speed);
            $scope.resume.chart_data[1].push(item.duration.getUTCMinutes() + item.duration.getUTCHours() * 60);

            $scope.resume.avspeed += item.speed;
            $scope.resume.elapsed += item.duration.getTime();
            $scope.resume.equirect += item.distance;

            if (item.speed > $scope.resume.bestspeed) {
                $scope.resume.bestspeed = item.speed;
            }
            if (item.duration > $scope.resume.longesttime) {
                $scope.resume.longesttime = item.duration;
            }
            if (item.distance > $scope.resume.bestdistance) {
                $scope.resume.bestdistance = item.distance;
            }

        });

        $scope.resume.chart_labels.reverse();
        $scope.resume.chart_data[0].reverse();
        $scope.resume.chart_data[1].reverse();

        $scope.resume.flatdistance = ($scope.resume.equirect / $scope.sessions.length).toFixed(1);
        $scope.resume.avspeed = ($scope.resume.avspeed / $scope.sessions.length).toFixed(1);
        $scope.resume.avduration = new Date($scope.resume.elapsed / $scope.sessions.length);

        $scope.resume.bestspeed = $scope.resume.bestspeed.toFixed(1);
        $scope.resume.bestdistance = $scope.resume.bestdistance.toFixed(1);

        $ionicScrollDelegate.resize();
 
    };

})

.controller('SessionsCtrl', function($scope, $ionicListDelegate, $timeout, ionicMaterialInk) {
    $timeout(function() {

        // Compute Resume Graph
        $timeout(function() {
            $scope.computeResumeGraph();
            ionicMaterialInk.displayEffect();

        }, 300);
    }, 300);

})

.controller('RecordsCtrl', function($scope, $ionicListDelegate, $timeout, ionicMaterialInk) {

    $scope.computeRecords = function() {
        $scope.records = {};
        var sessions = JSON.parse(localStorage.getItem('sessions'), $scope.dateTimeReviver);

        if (sessions) {
            for (var idx = 0; idx < sessions.length; idx++) {  
                var session = sessions[idx];

                if ($scope.records[session.distk] === undefined) {
                    $scope.records[session.distk] = {distk: session.distk,
                                                     speed:0,
                                                     pace:undefined,
                                                     duration:new Date(),
                                                     speeds:[],
                                                     durations:[],
                                                     paces:[],
                                                     av_speed:undefined,
                                                     av_duration:undefined,
                                                     av_pace:undefined

                                                    };

                }

                if ($scope.records[session.distk].speed < session.speed) {
                    $scope.records[session.distk].speed = session.speed;
                } 
                if ($scope.records[session.distk].pace === undefined) {
                    $scope.records[session.distk].pace = session.pace;

                } else {
                if ($scope.records[session.distk].pace > session.pace) {
                    $scope.records[session.distk].pace = session.pace;
                } }
                if ($scope.records[session.distk].duration > session.duration) {
                    $scope.records[session.distk].duration = session.duration;
                } 
                
                $scope.records[session.distk].paces.push(session.pace);
                $scope.records[session.distk].speeds.push(session.speed);
                $scope.records[session.distk].durations.push(session.duration);
                $scope.records[session.distk].av_pace = $scope.records[session.distk].paces.avg();
                $scope.records[session.distk].av_speed = $scope.records[session.distk].speeds.avg();
                $scope.records[session.distk].av_duration = $scope.records[session.distk].durations.avg();
            }
        }


    };

    $scope.computeRecords();

    $timeout(function() {
        ionicMaterialInk.displayEffect();
    }, 300);

})

.controller('SessionCtrl', function($scope, $stateParams, $ionicPopup, $ionicHistory, $timeout) {

    $scope.deleteSession = function(idx) {
        // confirm dialog
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete',
            template: $scope.translateFilter('_confirm_delete')
        });
        confirmPopup.then(function(res) {
            if (res) {
                $scope.sessions.splice(idx, 1);
                $scope.storageSetObj('sessions', $scope.sessions);
                $scope.loadSessions();
                $scope.computeResumeGraph();
                //Back
                var view = $ionicHistory.backView();
                if (view) {
                    view.go();
                }
            } else {
                console.error('Error confirm delete session');
            }
        });
    };

    $scope.saveSessionModifications = function() {
        $scope.sessions[$stateParams.sessionId] = $scope.session;
        $scope.storageSetObj('sessions', $scope.sessions);
    };

    $scope.deleteSessionByID = function(sid) {
        $scope.sessions.map(function(value, indx) {
            if (value.recclicked === sid) {
                $scope.deleteSession(indx);
            }
        });
    };


    if ($scope.sessions === undefined) {
        $scope.loadSessions();
    }


    $scope.session = $scope.sessions[$stateParams.sessionId];

    if (($scope.session.map === undefined)) {
        $scope.session.map = {
            center: {
                lat: 48,
                lng: 4,
                zoom: 5,
                autoDiscover: false
            },
            paths: {},
            bounds: {},
            controls: {scale:true},
            markers: {},
            tiles: {
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
        };
    }

    if (($scope.session.gpxPoints === undefined) || ($scope.prefs.debug === true) || ($scope.session.paceDetails === undefined) || ($scope.session.map.paths === undefined) || ($scope.session.map.bounds === undefined) || ($scope.session.map.markers === undefined)) {
        //PARSE GPX POINTS
        $timeout(function() {
            $scope.computeSessionFromGPXData($scope.session);
            $scope.saveSessionModifications();
        }, 300);
    }
});
