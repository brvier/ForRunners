angular.module('starter.controllers', [])

.filter('ldate', function() {
    'use strict';
    return function(date) {
        // Using ES6 filter method

        return moment(date).format('llll');
    };
})

.filter('duration', function() {
    'use strict';
    return function(date) {
        // Using ES6 filter method

        return moment(date).format('HH:mm');
    };
})

.filter('translatei18', function($filter) {
    'use strict';
    return function(text) {
        // Using ES6 filter method

        return $filter('translate')(text.replace('-', ''));
    };
})


.directive('navBarClass', function() {
    'use strict';
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

                $scope.$on('$stateChangeStart', function() {
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

.controller('AppCtrl', function($state, $scope, $ionicModal, $ionicPopup, $timeout, $ionicPlatform,
    $ionicHistory, $weather, $http, $translate, $filter, $ionicScrollDelegate,
    leafletData, leafletBoundsHelpers) {
    'use strict';

    $scope._version = '0.9.11';
    try {
        $scope.platform = window.device.platform;
        console.log(window.device.platform);
    } catch(err) {
        $scope.platform = 'Browser';
        console.log(err);
    }
    $scope.weather = $weather;

    $scope.running = false;
    $scope.prefs = {};

    $scope.prefs.minrecordingaccuracy = 14;
    $scope.prefs.minrecordinggap = 1000;
    $scope.prefs.minrecordingspeed = 3;
    $scope.prefs.maxrecordingspeed = 38;
    $scope.prefs.unit = 'kms';

    $scope.prefs.timevocalannounce = true;
    $scope.prefs.distvocalannounce = true;
    $scope.prefs.avgpacevocalannounce = true;
    $scope.prefs.avgspeedvocalannounce = true;
    $scope.prefs.language = 'English';
    $scope.prefs.heartrateannounce = false;

    $scope.prefs.delay = 10 * 1000;
    $scope.prefs.usedelay = true;
    $scope.prefs.debug = false;
    $scope.prefs.keepscreenon = true;

    $scope.prefs.togglemusic = true;
    $scope.prefs.distvocalinterval = 0; //en km (0 == None)
    $scope.prefs.timevocalinterval = 5; //en minutes
    $scope.prefs.timefastvocalinterval = 0; //en minutes
    $scope.prefs.timelowvocalinterval = 0; //en minutes

    $scope.prefs.heartratemax = 190;
    $scope.prefs.heartratemin = 80;
    $scope.prefs.registeredBLE = {};
    //$scope.prefs.registeredBLE['00:18:8C:31:3C:7E'] = 'HRS';

    $scope.prefs.usegoogleelevationapi = false;
 
    // Load Sessions
    $timeout(function() {
        $scope.loadSessions();
    }, 100);

    $timeout(function() {
        $scope.detectBLEDevice();
    }, 500);

    $scope.dateTimeReviver = function(key, value) {
        if ((key === 'duration') || (key === 'pace')) {
            if (typeof value === 'string') {
                return new Date(value);
            }
        }
        return value;
    };

    $scope.computeAllSessionsFromGPXData = function() {
        $scope.sessions.map(function(session) {
            $scope.computeSessionFromGPXData(session);
        });
        $scope.storageSetObj('sessions', $scope.sessions);
        $scope.computeResumeGraph();
    };

    $scope.computeSessionSimplifyAndFixElevation = function(session) {
        var encpath = '';
        var gpx_path = [];
        var gpxPoints = [];
        var lastEle = 0;
        simplify($scope.session.gpxData, 0.00003).map(function(item) {
            if (!isNaN(parseFloat(item[3]))) {
                lastEle = parseFloat(item[3]);
            } else {
                lastEle = 'x';
            }
            gpxPoints.push({
                lat: parseFloat(item[0]),
                lng: parseFloat(item[1]),
                timestamp: item[2],
                ele: lastEle,
                hr: parseFloat(item[4]),
                accuracy: parseInt(item[5])
            });
            gpx_path.push([parseFloat(item[0]), parseFloat(item[1])]);
        });

        console.log(gpx_path);
        encpath = L.polyline(gpx_path).encodePath();
        
        //Do it before and talk after
        //Thats here for preventing waiting too long an answer which could be
        //long to get on slow mobile network and so the session is displayed
        //with a 0 km run
        $scope.computeSessionFromGPXPoints(session, gpxPoints); 
        
        if ($scope.prefs.usegoogleelevationapi === true) {
            //https://maps.googleapis.com/maps/api/elevation/json?path=enc: 
            $http({url:'https://maps.googleapis.com/maps/api/elevation/json?key=AIzaSyDoUe8tyV_IUmAC4oOYC2Zuh-_npXAu5TU&locations=enc:' + encpath ,
                method:'GET',
                }).then(function(response) {
                    if (response.data.status === 'OK') {
                        console.log('Great');
                        console.log(response.data);
                        for (var idx in gpxPoints) {
                            gpxPoints[idx].ele = response.data.results[idx].elevation;                        
                        }
                        session.fixedElevation = true;
                        $scope.computeSessionFromGPXPoints(session, gpxPoints);
                    } else {
                        console.log('Failed google elevation api');
                        console.log(response.data);
                        //$scope.computeSessionFromGPXPoints(session, gpxPoints);
                    }
            }, function(error) {
                // Unable to connect to API.
                console.log(error);
                //$scope.computeSessionFromGPXPoints(session, gpxPoints);
            });
        }
    };

    $scope.computeSessionFromGPXData = function(session) { 
       $scope.session = session;
       $scope.computeSessionSimplifyAndFixElevation(session);
    };

    $scope.computeSessionFromGPXPoints = function(session, gpxPoints) {
        var hrZ1 = parseInt($scope.prefs.heartratemin) + parseInt(($scope.prefs.heartratemax - $scope.prefs.heartratemin) * 0.60);
        var hrZ2 = parseInt($scope.prefs.heartratemin) + parseInt(($scope.prefs.heartratemax - $scope.prefs.heartratemin) * 0.70);
        var hrZ3 = parseInt($scope.prefs.heartratemin) + parseInt(($scope.prefs.heartratemax - $scope.prefs.heartratemin) * 0.80);
        var hrZ4 = parseInt($scope.prefs.heartratemin) + (parseInt($scope.prefs.heartratemax - $scope.prefs.heartratemin) * 0.90);
        var hrZ = [0, 0, 0, 0, 0];
        var hr_color = 0;
        $scope.session.hhr_colors = ['#dcdcdc', '#97BBCD', '#46BFBD', '#FDB45C', '#F7464A'];
        $scope.session.hr_colors = ['rgba(220,220,220,0.5)', 'rgba(151, 187, 205, 0.5)', 'rgba(70, 191, 189, 0.5)', 'rgba(253, 180, 92, 0.5)', 'rgba(247, 70, 74, 0.5)'];
        $scope.session.hhr_colors = [{
            fillColor: 'rgba(220,220,220,0.5)',
            strokeColor: 'rgba(220,220,220,0.7)'
        }, {
            fillColor: 'rgba(151, 187, 205, 0.5)',
            strokeColor: 'rgba(151, 187, 205, 0.7)'
        }, {
            fillColor: 'rgba(70, 191, 189, 0.5)',
            strokeColor: 'rgba(70, 191, 189, 0.7)'
        }, {
            fillColor: 'rgba(253, 180, 92, 0.5)',
            strokeColor: 'rgba(253, 180, 92, 0.7)'
        }, {
            fillColor: 'rgba(247, 70, 74, 0.5',
            strokeColor: 'rgba(247, 70, 74, 0.7'
        }];

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
        var curAcc = gpxPoints[0].accuracy;

        var oldLat = curLat;
        var oldLng = curLng;
        var oldDate = curDate;
        var oldEle = curEle;

        var timeStartTmp = new Date(gpxPoints[0].timestamp);
        var timeEndTmp = 0;

        var mz = 1;
        var dTemp = 0;
        var dTotal = 0;
        var dMaxTemp = 1000; // kilometer marker
        var stepDetails = [];

        var mz2 = 1;
        var eleStartTmp = curEle;
        var heartRatesTmp = [];
        var heartRatesTmp2 = [];
        var dTemp2 = 0;
        var smallStepDetail = [];
        var timeStartTmp2 = new Date(gpxPoints[0].timestamp);
        var timeEndTmp2 = 0;
        var dMaxTemp2 = 250;

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
        //var dists = [];
        var gpxspeedtmp;
        var gpxpacetmp;
        var timeDiff;
        var dLat;
        var dLon;
        var dLat1;
        var dLat2;
        var dtd;
        var dspeed;
        var a, c, d;
        var idx = 0;

        for (var p = 0; p < gpxPoints.length; p++) {

            //gpxPoints.map(function(item) {

            curLat = gpxPoints[p].lat;
            curLng = gpxPoints[p].lng;
            curEle = gpxPoints[p].ele;
            curDate = gpxPoints[p].timestamp;
            curHeartRate = gpxPoints[p].hr;
            curAcc = gpxPoints[p].accuracy;

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
            //Speed between this and previous point
            dtd = new Date(curDate) - new Date(oldDate);
            dspeed = (Math.round((d) * 100) / 100) / (dtd / 1000 / 60 / 60);
            if (dspeed > 38 + 200) {
                //console.log("usain bold power");
            } else {

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
                if (curEle > maxHeight) {
                    maxHeight = curEle;
                }
                if (curEle < minHeight) {
                    minHeight = curEle;
                }
                if (curHeartRate > maxHeartRate) {
                    {
                        maxHeartRate = curHeartRate;
                    }
                }

                if (p > 0) {
                    dTotal += d;
                    gpxPoints[p].dist = dTotal;

                    if (curHeartRate) {
                        heartRatesTmp.push(curHeartRate);
                        heartRatesTmp2.push(curHeartRate);

                        if (curHeartRate > hrZ4) {
                            idx = 4;
                        } else {
                            if (curHeartRate > hrZ3) {
                                idx = 3;
                            } else {
                                if (curHeartRate > hrZ2) {
                                    idx = 2;
                                } else {
                                    if (curHeartRate > hrZ1) {
                                        idx = 1;
                                    } else {
                                        idx = 0;
                                    }
                                }
                            }
                        }
                        hrZ[idx] += dtd / 60000;
                    }

                    dTemp += (d * 1000);
                    if (((dTotal - (mz - 1)) * 1000) >= dMaxTemp) {
                        markers[mz] = {
                            lat: curLat,
                            lng: curLng,
                            icon: {
                                type: 'div',
                                className: 'leaflet-circle-marker',
                                html: mz,
                                iconSize: [20, 20]
                            },
                            message: mz + ' Km(s)',
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
                            hr: average(heartRatesTmp, 0)
                        });
                        timeStartTmp = new Date(gpxPoints[p].timestamp);
                        mz++;
                        dTemp = 0;
                        heartRatesTmp = [];
                    }
                    dTemp2 += (d * 1000);
                    if (((dTotal * 1000 - mz2 * 250)) >= dMaxTemp2) {

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
                            hr: average(heartRatesTmp2, 0)
                        });
                        timeStartTmp2 = new Date(gpxPoints[p].timestamp);
                        mz2++;
                        dTemp2 = 0;
                        eleStartTmp = curEle;
                        heartRatesTmp2 = [];
                    }
                }
                if ((gpxPoints.length - 1) === p) {
                    timeEndTmp = new Date(gpxPoints[p].timestamp);
                    timeDiff = timeEndTmp - timeStartTmp;
                    gpxpacetmp = (timeDiff) / (dTemp / 1000);
                    gpxpacetmp = (Math.round(gpxpacetmp * 100) / 100) * 1;
                    gpxspeedtmp = (Math.round((dTemp / 1000) * 100) / 100) / (timeDiff / 1000 / 60 / 60);
                    gpxspeedtmp = Math.round(gpxspeedtmp * 100) / 100;
                    stepDetails.push({
                        pace: new Date(gpxpacetmp),
                        speed: gpxspeedtmp,
                        km: Math.round(dTotal * 10) / 10,
                        hr: average(heartRatesTmp, 0)
                    });
                    timeEndTmp2 = new Date(gpxPoints[p].timestamp);
                    timeDiff = timeEndTmp2 - timeStartTmp2;
                    if (timeDiff > 0) {
                        gpxpacetmp = (timeDiff) / (dTemp / 1000);
                        gpxpacetmp = (Math.round(gpxpacetmp * 100) / 100) * 1;
                        gpxspeedtmp = (Math.round((dTemp2 / 1000) * 100) / 100) / (timeDiff / 1000 / 60 / 60);
                        gpxspeedtmp = Math.round(gpxspeedtmp * 100) / 100;
                        smallStepDetail.push({
                            pace: new Date(gpxpacetmp),
                            speed: gpxspeedtmp,
                            km: Math.round(dTotal * 10) / 10,
                            ele: (eleStartTmp + curEle) / 2,
                            hr: average(heartRatesTmp2, 0)
                        });
                    }
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
                controls: {
                    scale: true
                },
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
        if ((hrZ[0] === 0) && (hrZ[1] === 0) &&
            (hrZ[2] === 0) && (hrZ[3] === 0) && (hrZ[4] === 0)) {
            $scope.session.heartRate = false;
        } else {
            $scope.session.heartRate = true;
        }

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
            legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        };
        $scope.session.chart2_options = {
            animation: false,
            showTooltips: false,
            showScale: true,
            scaleIntegersOnly: true,
            bezierCurve: true,
            pointDot: false,
            responsive: true,
            legendTemplate: '' //'<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        };
        $scope.session.chart3_options = {
            animation: false,
            showTooltips: true,
            showScale: false,
            showLegend: true,
            scaleIntegersOnly: true,
            responsive: true,
            legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
        };
        $scope.session.chart4_options = {
            animation: false,
            showTooltips: false,
            showScale: true,
            scaleIntegersOnly: true,
            bezierCurve: true,
            pointDot: false,
            responsive: true,
            legendTemplate: '' //'<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        };
        $scope.session.chart3_labels = [$scope.translateFilter('_hr_zone0') + ' < 60%',
            $scope.translateFilter('_hr_zone1') + ' > 60%',
            $scope.translateFilter('_hr_zone2') + ' > 70%',
            $scope.translateFilter('_hr_zone3') + ' > 80%',
            $scope.translateFilter('_hr_zone4') + ' > 90%'
        ];
        for (var i = 0; i < hrZ.length; i++) {
            hrZ[i] = hrZ[i].toFixed(1);
        }
        $scope.session.chart3_data = hrZ;

        $scope.session.chart_labels = [];
        $scope.session.chart2_labels = [];
        $scope.session.chart4_labels = [];
        $scope.session.chart_data = [
            [],
            []
        ];
        $scope.session.chart2_data = [
            []
        ];
        $scope.session.chart4_data = [
            []
        ];
        $scope.session.chart2_type = 'Heartrate';
        $scope.session.chart_series = [$scope.translateFilter('_speed_kph'), $scope.translateFilter('_altitude_meters')];
        $scope.session.chart2_series = [$scope.translateFilter('_speed_kph'), $scope.translateFilter('_bpms_label')];
        $scope.session.chart4_type = 'Heartrate';
        $scope.session.chart4_series = [$scope.translateFilter('_altitude_meters'), $scope.translateFilter('_bpms_label')];
        smallStepDetail.map(function(step) {
            if (step.hr > hrZ4) {
                hr_color = 4;
            } else {
                if (step.hr > hrZ3) {
                    hr_color = 3;
                } else {
                    if (step.hr > hrZ2) {
                        hr_color = 2;
                    } else {
                        if (step.hr > hrZ1) {
                            hr_color = 1;
                        } else {
                            hr_color = 0;
                        }
                    }
                }
            }
            if (Math.round(step.km) === step.km) {
                $scope.session.chart_labels.push(step.km);
                $scope.session.chart2_labels.push(step.km + '|' + $scope.session.hr_colors[hr_color]);
                $scope.session.chart4_labels.push(step.km + '|' + $scope.session.hr_colors[hr_color]);
            } else {
                $scope.session.chart_labels.push('');
                $scope.session.chart2_labels.push('|' + $scope.session.hr_colors[hr_color]);
                $scope.session.chart4_labels.push('|' + $scope.session.hr_colors[hr_color]);
           }

            $scope.session.chart_data[0].push(step.speed);
            $scope.session.chart_data[1].push(step.ele);
            $scope.session.chart2_data[0].push(step.speed);
            $scope.session.chart4_data[0].push(step.ele);
            //$scope.session.chart2_data[1].push(step.hr); // was step.hr

        });

        // altitude
        // simplification altitude
        if ($scope.session.fixedElevation) {
            eleUp = 0; //parseFloat(elePoints[0][3]);
            eleDown = 0; //parseFloat(elePoints[0][3]);
            for (p = 0; p < gpxPoints.length; p++) {
                curEle = gpxPoints[p].ele;

                if (p > 0) {

                    oldEle = gpxPoints[p - 1].ele;

                    if (curEle > oldEle) {
                        eleUp += (curEle) - (oldEle);
                    } else if (curEle < oldEle) {
                        eleDown += (oldEle) - (curEle);
                    }

                }
            }
        } else {
            var elePoints = simplify($scope.session.gpxData, 0.0002);
            eleUp = 0; //parseFloat(elePoints[0][3]);
            eleDown = 0; //parseFloat(elePoints[0][3]);

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

        //var gpxdur = new Date("Sun May 10 2015 " + hours + ":" + minutes + ":" + seconds + " GMT+0200");

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

        $scope.session.overnote = (parseInt(gpxspeed) * 1000 * (miliseconds / 1000 / 60) * 0.000006 + ((Math.round(eleUp) - Math.round(eleDown)) * 0.01)).toFixed(1);

        //And now save
        $scope.sessions.map(function(item, idx){
            if (item.recclicked === $scope.session.recclicked) {
                $scope.sessions[idx] = $scope.session;
                $scope.storageSetObj('sessions', $scope.sessions);
                $scope.loadSessions();
            }
        });
    };

    $scope.backupOnStorage = function(backupName) {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
            //cordova.file.externalDataDirectory
            dirEntry.getFile(backupName, {
                create: true
            }, function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    // Already in JSON Format
                    writer.onwrite = function() {
                        if (backupName === 'forrunners.backup') {
                            $ionicPopup.alert({
                                title: $scope.translateFilter('_backup_ok_title'),
                                template: $scope.translateFilter('_backup_ok_content')
                            });
                        }
                    };
                    writer.onerror = function(e) {
                        if (backupName === 'forrunners.backup') {
                            $ionicPopup.alert({
                                title: $scope.translateFilter('_backup_error_title'),
                                template: $scope.translateFilter('_backup_error_content')
                            });
                        }
                        console.error(e);
                    };
                    writer.fileName = backupName;
                    writer.write(new Blob([localStorage.getItem('sessions')], {
                        type: 'text/plain'
                    }));
                }, function() {
                    console.error('failed can t create writer');
                });
            }, function() {
                console.error('failed to get file');
            });
        }, function() {
            console.error('failed can t open fs');
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

                    reader.onloadend = function() {
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
                console.error('failed to get file');
            });
        }, function() {
            console.error('failed can t open fs');
        });
    };

    $scope.importGPX = function(file) {

        var reader = new FileReader();

        reader.onloadend = function() {
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
                } catch (exception) {
                    try {
                        bpms = parseFloat(item.extensions.hr.__text);
                    } catch (exception2) {
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

    $scope.iosFilePicker = function() {
        var utis = ['public.data', 'public.item', 'public.content', 'public.file-url'];
        window.FilePicker.pickFile(function(url) {
            $scope.importGPX(url);
        }, function(err){
            $ionicPopup.alert({
            title: $scope.translateFilter('_gpx_import_title'),
            template: err
        }, utis);});
    };

    $scope.importGPXs = function(element) {
        for (var idx in element.files) {
            if (typeof element.files[idx] === 'object') {
                $scope.importGPX(element.files[idx]);
            }
        }

        $ionicPopup.alert({
            title: $scope.translateFilter('_gpx_import_title'),
            template: $scope.translateFilter('_gpx_file_imported')
        });

    };

    $scope.writeGPX = function(dirEntry, filename, session) {
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

        var gpxSubHead = '';
        var gpxFoot = '</trkseg></trk>\n</gpx>';

        dirEntry.getFile(filename, {
            create: true
        }, function(fileEntry) {
            fileEntry.createWriter(function(writer) {
                // Already in JSON Format
                writer.onwrite = function() {};
                writer.onerror = function(e) {
                    $ionicPopup.alert({
                        title: $scope.translateFilter('_gpx_error_title'),
                        template: $scope.translateFilter('_gpx_error_content')
                    });
                    console.error(e);
                    console.error(writer.error);
                };
                writer.fileName = filename; //moment(session.recclicked).format('YYYYMMDD_hhmm') + '.gpx';
                gpxSubHead = '<name>' + session.date + '</name>\n';

                var gpxPoints = '';
                session.gpxData.map(function(pts) {
                    gpxPoints += '<trkpt lat=\"' + pts[0] + '\" lon=\"' + pts[1] + '\">\n';
                    gpxPoints += '<ele>' + pts[3] + '</ele>\n';
                    gpxPoints += '<time>' + pts[2] + '</time>\n';
                    if (pts[4]) {
                        gpxPoints += '<extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>' + pts[4] + '</gpxtpx:hr></gpxtpx:TrackPointExtension></extensions>';
                    }
                    gpxPoints += '</trkpt>\n';
                });
                writer.write(gpxHead + gpxSubHead + gpxPoints + gpxFoot, {
                    type: 'text/plain'
                });
            }, function() {
                console.log('failed can t create writer');
            });
        }, function() {
            console.log('failed to get file');
        });

    };

    $scope.exportAGPX = function(dirEntry, session, overwrite) {
        if (overwrite === false) {
            dirEntry.getFile(
                moment(session.recclicked).format('YYYYMMDD_hhmm') + '.gpx', {
                    create: false
                },
                function() {}, //exist so don t overwrite
                function() {
                    $scope.writeGPX(dirEntry, moment(session.recclicked).format('YYYYMMDD_hhmm') + '.gpx', session);
                });
        } else {
            $scope.writeGPX(dirEntry, moment(session.recclicked).format('YYYYMMDD_hhmm') + '.gpx', session);
        }

    };

    $scope.exportAsGPX = function(overwrite) {
        $scope.sessions.map(function(session) {
            var stordir = cordova.file.externalDataDirectory;
            if (!stordir) {
                stordir = cordova.file.dataDirectory;
            }

            window.resolveLocalFileSystemURL(stordir,
                function(dirEntry) {
                    $scope.exportAGPX(dirEntry, session, overwrite);
                },
                function() {
                    console.log('failed can t open fs');
                });
        });

        if (overwrite) {
            $ionicPopup.alert({
                title: $scope.translateFilter('_gpx_export_title'),
                template: $scope.translateFilter('_gpx_file_exported')
            });
        }

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
                return self.indexOf(item) === pos;
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
        
            if ($scope.prefs.version !== $scope._version ) {
                //UPDATE !
                
                $scope.computeAllSessionsFromGPXData();
 
                $scope.prefs.version = $scope._version;
                $scope.savePrefs();
            }

            $scope.sessions.sort(function(a, b) {
                var x = a.recclicked;
                var y = b.recclicked;
                return (((x < y) ? -1 : ((x > y) ? 1 : 0)) * -1);
            });

            if ($scope.prefs.debug === true) {
                $scope.sessions.sort(function(a, b) {
                    var x = a.overnote;
                    var y = b.overnote;
                    return (((x < y) ? -1 : ((x > y) ? 1 : 0)) * -1);
                });

            }
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

    $scope.registerBluetoothDevice = function(id) {
        if (id in $scope.prefs.registeredBLE) {
             delete $scope.prefs.registeredBLE[id];
       } else {
             $scope.prefs.registeredBLE[id] = $scope.bluetooth_devices[id];
        }
        $scope.savePrefs();
    };

    $scope.detectBLEDevice = function() {
        $scope.bluetooth_devices = {};
        //$scope.prefs.registeredBLE = {};
        //$scope.prefs.registeredBLE['00:18:8C:31:3C:7E'] = 'HRS';
       // $scope.prefs.registeredBLE.map(function(k) {
        
        for (var prop in $scope.prefs.registeredBLE) {
            $scope.bluetooth_devices[prop] = {
                'id': prop,
                'name': $scope.prefs.registeredBLE[prop],
                'registered': true
            };
        }
        $scope.bluetooth_scanning = true;

        try {
            ble.startScan([], function(device) {
                $scope.$apply(function() {
                    if (!(device.id in $scope.bluetooth_devices)) {
                        if (device.id in $scope.prefs.registeredBLE) {
                            $scope.bluetooth_devices[device.id] = {
                                'id': device.id,
                                'name': device.name,
                                'registered': true
                            };

                        } else {
                            $scope.bluetooth_devices[device.id] = {
                                'id': device.id,
                                'name': device.name,
                                'registered': false
                            };
                        }
                    }
                });
            }, function() {
                $scope.$apply(function() {
                    $scope.bluetooth_scanning = false;
                });
            });

            setTimeout(function() {
                ble.stopScan(
                    function() {
                        $scope.$apply(function() {
                            $scope.bluetooth_scanning = false;
                        });
                    },
                    function() {
                        $scope.$apply(function() {
                            $scope.bluetooth_scanning = false;
                        });
                    }
                );
            }, 5000);
        } catch (exception) {                                                   
            $scope.bluetooth_scanning = false;
            console.debug('ERROR: ble not available');   
        }  
    };

    $scope.heartRateOnData = function(buffer) {
        var data = new Uint8Array(buffer);
        $scope.session.beatsPerMinute = data[1];
    };

    $scope.heartRateOnConnect = function(peripheral) {
        ble.notify(peripheral.id,
            $scope.glbs.heartRate.service,
            $scope.glbs.heartRate.measurement,
            $scope.heartRateOnData,
            function(err) {
                console.error('BLE error :' + err);
                $scope.session.beatsPerMinute = null;
            });
    };

    $scope.heartRateOnDisconnect = function(reason) {
        console.debug('BLE Disconnected:' + reason);
    };

    $scope.heartRateScan = function() {
        // https://developer.bluetooth.org/gatt/services/Pages/ServiceViewer.aspx?u=org.bluetooth.service.heart_rate.xml
        if (($scope.prefs.registeredBLE.length > 0) && ($scope.session.beatsPerMinute === null)) {
            ble.scan([$scope.glbs.heartRate.service], 5,
                //onScan
                function(peripheral) {
                    console.debug('Found ' + JSON.stringify(peripheral));

                    if (peripheral.id in $scope.prefs.registeredBLE) {
                        //foundHeartRateMonitor = true;
                        ble.connect(peripheral.id,
                            $scope.heartRateOnConnect,
                            $scope.heartRateOnDisconnect);
                    } else {
                        console.debug('Device ' + peripheral.id + ' not registered');
                    }

                }, function() {
                    console.error('BluetoothLE scan failed');
                }
            );
        }
    };

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

        try {
            clearInterval($scope.btscanintervalid);
        } catch (exception) {
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
                                    console.error(err, event, cb);
                                }
                                return;
                            });
                        }
                    };
                    musicControl.togglepause(function(err, cb) {
                        if (err) {
                            console.error(err, event, cb);
                        }
                        speechSynthesis.speak(utterance);
                        return;
                    });
                } else {
                    speechSynthesis.speak(utterance);
                }
            });
        } catch (exception) {
            console.debug('SpeechSynthesisUtterance not available : ' + exception);
        }
    };

    $scope.testRunSpeak = function() {
        $scope.session = {};
        $scope.session.equirect = 3.24;
        $scope.session.avspeed = 10.21;
        $scope.session.avpace = '5:48';
        $scope.session.time = '1:28:23';
        $scope.session.beatsPerMinute = 160;
        $scope.runSpeak();
    };

    $scope.runSpeak = function() {
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
        if (($scope.prefs.heartrateannounce === true) && ($scope.session.beatsPerMinute > 0)) {
            speechText += ', ' + $scope.session.beatsPerMinute + ' ' + $scope.translateFilter('_bpms') + ' ';
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


            if (typeof position.coords.altitude === 'number') {
                altnew = position.coords.altitude;
            }

            if ($scope.prefs.debug) {
                console.debug('Accuracy:' + position.coords.accuracy);
            }
            $scope.$apply(function() {
                $scope.session.accuracy = position.coords.accuracy;
                $scope.session.accuracy_fixed = position.coords.accuracy.toFixed(0);

                if ((position.coords.accuracy <= $scope.prefs.minrecordingaccuracy) &&
                    (timenew > $scope.session.recclicked) &&
                    ($scope.session.latold !== 'x') &&
                    ($scope.session.lonold !== 'x')) {
                    $scope.session.gpsGoodSignalToggle = true;
                    console.debug('gpsGoodSignalToggle set to true');
                }

                if ((position.coords.accuracy >= $scope.prefs.minrecordingaccuracy) &&
                    ($scope.session.gpsGoodSignalToggle === true) &&
                    (timenew > $scope.session.recclicked)) {
                    // In case we lost gps we should announce it
                    $scope.session.gpsGoodSignalToggle = false;
                    console.debug('gpsGoodSignalToggle set to false');
                    //$scope.speakText("GPS Lost");
                }

                if ($scope.session.firsttime !== 0) {
                    //Elapsed time
                    elapsed = timenew - $scope.session.firsttime;
                    var hour = Math.floor(elapsed / 3600000);
                    var minute = ('0' + (Math.floor(elapsed / 60000) - hour * 60)).slice(-2);
                    var second = ('0' + Math.floor(elapsed % 60000 / 1000)).slice(-2);
                    $scope.session.time = hour + ':' + minute + ':' + second;
                    $scope.session.elapsed = elapsed;

                    if ((position.coords.accuracy <= $scope.prefs.minrecordingaccuracy)) {
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
                        if ($scope.session.latold !== 'x' && $scope.session.lonold !== 'x') {

                            //Limit ok
                            if (timenew - $scope.session.lastdisptime >= $scope.prefs.minrecordinggap) {
                                $scope.session.lastdisptime = timenew;
                                //Calc distances
                                /*var distances = $scope.calcDistances({
                                    'lon': $scope.session.lonold,
                                    'lat': $scope.session.latold,
                                    'alt': $scope.session.altold
                                }, {
                                    'lon': lonnew,
                                    'lat': latnew,
                                    'alt': altnew
                                });*/

                                //Distances
                                var dLat;
                                var dLon;
                                var dLat1;
                                var dLat2;
                                var a, c, d;
                                var dtd;
                                var dspeed;

                                dLat = (latnew - $scope.session.latold) * Math.PI / 180;
                                dLon = (lonnew - $scope.session.lonold) * Math.PI / 180;
                                dLat1 = ($scope.session.latold) * Math.PI / 180;
                                dLat2 = (latnew) * Math.PI / 180;
                                a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                    Math.cos(dLat1) * Math.cos(dLat1) *
                                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                d = 6371 * c;
                                //Speed between this and previous point
                                dtd = new Date(timenew) - new Date($scope.session.timeold);
                                dspeed = (d) / (dtd / 1000 / 60 / 60);

                                elapsed = timenew - $scope.session.firsttime;
                                //console.log(ispeed);
                                if ((dspeed < 38) && (dspeed > 2)) {
                                    $scope.session.equirect += d;
                                    $scope.session.eledist += d;
                                }

                                //Elevation?
                                if ($scope.session.altold !== 'x') {
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
                                    var averagePace = elapsed / ($scope.session.equirect * 60000);
                                    $scope.session.avpace = Math.floor(averagePace) + ':' + ('0' + Math.floor(averagePace % 1 * 60)).slice(-2);
                                    if (dspeed) {
                                        $scope.session.avspeed = dspeed.toFixed(1);
                                    } else {
                                        $scope.session.avspeed = '0';
                                    }
                                }

                                $scope.session.latold = latnew;
                                $scope.session.lonold = lonnew;
                                $scope.session.altold = altnew;
                                $scope.session.timeold = timenew;

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
                                    if (($scope.session.lastslowvocalannounce !== -1) &&
                                        ((timenew - $scope.session.lastslowvocalannounce) > $scope.prefs.timeslowvocalinterval * 60000)) /*fixme*/ {
                                        $scope.session.lastslowvocalannounce = -1;
                                        $scope.session.lastfastvocalannounce = timenew;
                                        $scope.speakText($scope.translateFilter('_run_fast'));
                                    }
                                }
                                if (parseInt($scope.prefs.timefastvocalinterval) > 0) {
                                    if (($scope.session.lastfastvocalannounce !== -1) &&
                                        ((timenew - $scope.session.lastfastvocalannounce) > $scope.prefs.timefastvocalinterval * 60000)) /*fixme*/ {
                                        $scope.session.lastslowvocalannounce = timenew;
                                        $scope.session.lastfastvocalannounce = -1;
                                        $scope.speakText($scope.translateFilter('_run_slow'));
                                    }
                                }
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
                if ((timenew - $scope.session.lastrecordtime >= $scope.prefs.minrecordinggap) &&
                    (position.coords.accuracy <= $scope.prefs.minrecordingaccuracy)) {
                    //console.log('Should record');
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

                    if ($scope.session.beatsPerMinute) {
                        pointData.push($scope.session.beatsPerMinute);
                    } else {
                        pointData.push('x');
                    }

                    pointData.push(position.coords.accuracy);
                    $scope.session.gpxData.push(pointData);
                    $scope.session.lastrecordtime = timenew;
                }

                // Record Weather
                if ($scope.session.weather === '') {
                    $scope.weather.byLocation({
                        'latitude': latnew,
                        'longitude': lonnew
                    }).then(function(weather) {
                        $scope.session.weather = weather;
                    });
                }

            });
        }
    };

    $scope.toRad = function(x) {
        return x * Math.PI / 180;
    };

    //$scope.errorfn = function(err) {
    //    console.debug('errorfn:' + err);
    //};

    $scope.errorPosition = function(err) {
        console.debug('errorPosition:' + err.message);
        $scope.session.gpsGoodSignalToggle = false;
        console.debug('gpsGoodSignalToggle set to false');
    };


    $scope.startSession = function() {
        $scope.running = true;

        $scope.session = {};
        $scope.session.gpsGoodSignalToggle = false;
        $scope.session.recclicked = new Date().getTime();
        $scope.session.date = moment().format('llll');

        $scope.session.mdate = moment().format('MMMM YYYY');
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
            $scope.btscanintervalid = setInterval($scope.heartRateScan, 10000);
        } catch (exception) {
            console.debug('ERROR: BLEScan:' + exception);
        }


        //FIXME
        if ($scope.prefs.debug) {
            $scope.prefs.minrecordingaccuracy = 22;
        } else {
            $scope.prefs.minrecordingaccuracy = 22;
        }

        $scope.session.watchId = navigator.geolocation.watchPosition(
            $scope.recordPosition,
            $scope.errorPosition, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 3000
            });

        $scope.openModal();
    };


    $scope.delayCheck = function() {
        if ((new Date().getTime() - $scope.mustdelaytime) < $scope.prefs.delay) {
            $scope.delay = (new Date().getTime() - $scope.mustdelaytime);
            $scope.session.time = (-($scope.prefs.delay - $scope.delay) / 1000).toFixed(0);
            //Using get
            //navigator.geolocation.getCurrentPosition(function() {}, function() {}, {
            //    enableHighAccuracy: true,
            //    timeout: 10000,
            //    maximumAge: 0
            //});
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
                controls: {
                    scale: true
                },
                markers: {},
                tiles: {
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
            };
            sessions.push($scope.session);
            $scope.storageSetObj('sessions', sessions);
            $scope.loadSessions();
 
            try {
                $scope.computeSessionFromGPXData($scope.session);
            } catch (exception) {
                console.error('ComputeSessionFromGPX Failed on save:' + exception);
            }
 
            //Automated backup
            setTimeout(function() {
                $scope.exportAsGPX(false);
            }, 2000);
        }
        $scope.storageSetObj('version', $scope._version);
    };

    $scope.savePrefs = function() {
        $scope.storageSetObj('prefs', $scope.prefs);
        $scope.setLang();
    };


    $scope.computeResumeGraph = function() {
        $scope.resume = [];
        $scope.resume.chart_labels = [];
        $scope.resume.chart_series = [$scope.translateFilter('_overnote'), $scope.translateFilter('_duration_minutes')];
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
            legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        };

        $scope.resume.overnote = 0;
 
        $scope.resume.elapsed = 0;
        $scope.resume.equirect = 0;
        $scope.resume.avspeed = 0;

        $scope.resume.longesttime = new Date(0);
        $scope.resume.bestdistance = 0;
        $scope.resume.bestspeed = 0;

        $scope.sessions.map(function(item) {

            $scope.resume.chart_labels.push(item.date);
           try {
             $scope.resume.chart_data[1].push(item.duration.getUTCMinutes() + item.duration.getUTCHours() * 60);
             $scope.resume.chart_data[0].push(item.overnote);
             $scope.resume.elapsed += item.duration.getTime();
            } catch(err) {console.error('item.duration.getUTCMinutes'); }
            $scope.resume.avspeed += item.speed;
            $scope.resume.equirect += item.distance;
            $scope.resume.overnote += parseFloat(item.overnote);


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
        $scope.resume.overnote = Math.round(($scope.resume.overnote / $scope.sessions.length), 1);
 
        $scope.resume.bestspeed = $scope.resume.bestspeed.toFixed(1);
        $scope.resume.bestdistance = $scope.resume.bestdistance.toFixed(1);

        $ionicScrollDelegate.resize();

    };

})

.controller('SessionsCtrl', function($scope, $timeout, ionicMaterialInk) {
    'use strict';
    $timeout(function() {
        //Get position a first time to get better precision when we really
        //start running
        navigator.geolocation.getCurrentPosition(function() {}, function() {}, {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 0
        });

        // Compute Resume Graph
        $timeout(function() {
            $scope.computeResumeGraph();
            ionicMaterialInk.displayEffect();

        }, 300);
    }, 300);

})

.controller('RecordsCtrl', function($scope, $timeout, ionicMaterialInk) {
    'use strict';
    $scope.computeRecords = function() {
        $scope.records = {};
        var sessions = JSON.parse(localStorage.getItem('sessions'), $scope.dateTimeReviver);
        $scope.total_kms = 0;
        
        if (sessions) {
            for (var idx = 0; idx < sessions.length; idx++) {
                var session = sessions[idx];

                if ($scope.records[session.distk] === undefined) {
                    $scope.records[session.distk] = {
                        distk: session.distk,
                        speed: 0,
                        pace: undefined,
                        duration: new Date(),
                        speeds: [],
                        durations: [],
                        paces: [],
                        av_speed: undefined,
                        av_duration: undefined,
                        av_pace: undefined

                    };

                }
                $scope.total_kms += session.distance;

                if ($scope.records[session.distk].speed < session.speed) {
                    $scope.records[session.distk].speed = session.speed;
                }
                if ($scope.records[session.distk].pace === undefined) {
                    $scope.records[session.distk].pace = session.pace;

                } else {
                    if ($scope.records[session.distk].pace > session.pace) {
                        $scope.records[session.distk].pace = session.pace;
                    }
                }
                if ($scope.records[session.distk].duration > session.duration) {
                    $scope.records[session.distk].duration = session.duration;
                }

                $scope.records[session.distk].paces.push(session.pace);
                $scope.records[session.distk].speeds.push(session.speed);
                $scope.records[session.distk].durations.push(session.duration);
                $scope.records[session.distk].av_pace = average($scope.records[session.distk].paces, 0);
                $scope.records[session.distk].av_speed = average($scope.records[session.distk].speeds, 1);
                $scope.records[session.distk].av_duration = average($scope.records[session.distk].durations, 0);
            }
        }


    };

    $scope.computeRecords();

    $timeout(function() {
        ionicMaterialInk.displayEffect();
    }, 300);

})

.controller('SessionCtrl', function($scope, $stateParams, $ionicPopup, $ionicHistory, $timeout) {
    'use strict';
    $scope.deleteSession = function(idx) {
        // confirm dialog
        var confirmPopup = $ionicPopup.confirm({
            title: $scope.translateFilter('_delete'),
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
        $scope.storageSetObj('version', $scope._version);
    };

    $scope.deleteSessionByID = function(sid) {
        $scope.sessions.map(function(value, indx) {
            if (value.recclicked === sid) {
                $scope.deleteSession(indx);
            }
        });
    };

    $scope.sharePieceOfDOM = function(){

        //var $sel = $(selector);
        //var element = document.getElementById('sessmap');
        //var element = document.getElementById('speedvsalt');

        //share the image via phonegap plugin
        window.plugins.socialsharing.share(
            $scope.session.distance + ' Kms in ' + moment($scope.session.duration).utc().format('HH:mm') + ' ( '+ $scope.session.speed+' Kph ) tracked with #ForRunners',
            'ForRunners',
            document.getElementById('speedvsalt').toDataURL(),
            'http://khertan.net/projects/forrunners/',
            function(){ 
                //success callback
            },
            function(err){
                //error callback
                console.error('error in share', err);
            }
        );

        /*html2canvas(element, {
            onrendered: function(canvas) {
                //get a drawing context from canvas
                var context = canvas.getContext('2d');

                //get the right coords to position the caption
                var x = canvas.width / 2;
                var y = canvas.height - 40;

                //set up text properties before drawing
                context.fillStyle = '#222';
                context.font = '10pt "AmaticSCBold"';
                context.textAlign = 'center';

                //draw text at the specified coords
                context.fillText('made with ForRunners © Khertan 2015', x, y);

                //convert canvas data to an image data url
                var imgDataUrl = canvas.toDataURL();

                //share the image via phonegap plugin
                window.plugins.socialsharing.share(
                    $scope.session.distance + 'Kms in ' + moment($scope.session.duration).utc().format('HH:mm') + '( '+ $scope.session.speed+' Kph )',
                    'ForRunners',
                    [imgDataUrl, document.getElementById('speedvsalt').toDataURL()],
                    'http://khertan.net/',
                    function(){ 
                        //success callback
                    },
                    function(err){
                        //error callback
                        console.error('error in share', err);
                    }
                );
            }
        });*/
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
            controls: {
                scale: true
            },
            markers: {},
            tiles: {
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
        };
    }

    if (($scope.session.fixedElevation === undefined) || ($scope.session.overnote === undefined) || ($scope.session.gpxPoints === undefined) || ($scope.prefs.debug === true) || ($scope.session.paceDetails === undefined) || ($scope.session.map.paths === undefined) || ($scope.session.map.bounds === undefined) || ($scope.session.map.markers === undefined)) {
        //PARSE GPX POINTS
        $timeout(function() {
            $scope.computeSessionFromGPXData($scope.session);
            $scope.saveSessionModifications();
        }, 300);
    }
});
