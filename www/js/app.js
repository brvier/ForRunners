// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'chart.js', 'pascalprecht.translate', 'ionic-material',
                           'net.khertan.reporter', 'leaflet-directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.running', {
    url: "/running",
    views: {
      'menuContent': {
        templateUrl: "templates/running.html",
      }
    }
  })

  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html"
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html"
      }
    }
  })



   .state('app.sessions', {
      url: "/sessions",
      views: {
        'menuContent': {
          templateUrl: "templates/sessions.html",
          controller: 'SessionsCtrl'
        }
      }
    })

  .state('app.session', {
    url: "/sessions/:sessionId",
    views: {
      'menuContent': {
        templateUrl: "templates/session.html",
        controller: 'SessionCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/sessions');

  $translateProvider.translations('en-US', {
    _language: "Language",
    _english: "English",
    _french: "French",
    _vocal_announce: "Vocal Announces",
    _duration_interval: "Duration interval",
    _minutes: "minutes",
    _hours: "hours",
    _options: "Options",
    _backup_and_restore: "Backup and Restore",
    _restore: "Restore",
    _backup: "Backup",
    _distance_interval: "Distance interval",
    _notification_slug: 'ForRunners : Recording session ...',
    _notification_message: 'Recording session ...',
    _go: 'Go !',
    _kilometers: 'Kilometers',
    _kilometers_per_hour: 'Kilometers per hour',
    _and: 'and',
    _seconds_per_kilometers: 'seconds per kilometers',
    _confirm_delete: 'Are you sure you want to delete this session?',
    _gpx_export_title: 'GPX Export',
    _gpx_file_exported: 'All your sessions exported as GPX files.',
    _backup_ok_title: 'Backup',
    _backup_ok_content: 'Backup available in the application data folder.',
    _backup_error_title: 'Error',
    _backup_error_content: 'An error occur while creating the backup.',
    _gpx_error_title:'Error',
    _gpx_error_content:'The GPX export failed.',
    _toggle_music_on_announce: 'Toggle music on announce',
    _announce_distance: 'Announce distance',
    _announce_time: 'Announce time',
    _announce_average_speed: 'Announce average speed',
    _announce_average_pace: 'Announce average pace',
    _delay_start: 'Delay start of 10 secondes',
    _export_as_gpx: 'Export as GPX',
    _debug_tools: 'Debug tools',
    _debug_mode: 'Debug mode',
    _settings: 'Settings',
    _debug_test_vocal: 'Test vocal announces',
    _average:'Average',
    _records:'Records',
    _speed_kph: 'Speed (Kph)',
    _duration_minutes: 'Duration (minutes)',
    _altitude_meters: 'Altitude (meters)',
    _time:'Time',
    _distance:'Distance',
    _speed:'Speed',
    _pace: 'Pace',
    _debug_warning: 'Debug mode slow down severly the application',
    _run_fast: 'Run fast !',
    _run_slow: 'Run slower',


  });
  $translateProvider.translations('fr-FR', {
    _language: "Langage",
    _english: "Anglais",
    _french: "Francais",
    _vocal_announce: "Annonces vocale",
    _duration_interval: "Interval de temps",
    _minutes: "minutes",
    _hours: "heures",
    _options: "Options",
    _restore: "Restaurer",
    _backup: "Sauvegarder",
    _backup_and_restore: "Sauvegardes",
    _distance_interval: "Interval de distance",
    _notification_slug: 'ForRunners : Enregistrement ...',
    _notification_message: 'Enregistrement ...',
    _go: 'Go !',
    _kilometers: 'Kilometres',
    _kilometers_per_hour: 'Kilometres par heure',
    _and: 'et',
    _seconds_per_kilometers: 'secondes par kilometres',
    _confirm_delete: 'Etes vous sur de vouloir supprimer cette session?',
    _gpx_export_title: 'Export GPX',
    _gpx_file_exported: 'Toute vos sessions ont été exportées au format GPX.',
    _backup_ok_title: 'Sauvegarde',
    _backup_ok_content: 'Sauvegarde disponible dans le dossier de l\'application.',
    _backup_error_title: 'Erreur',
    _backup_error_content: 'La création de la sauvegarde à échouée.',
    _gpx_error_title:'Erreur',
    _gpx_error_content:'L\'export GPX a échoué',
    _toggle_music_on_announce: 'Couper la musique lors des annonces',
    _announce_distance: 'Annoncer la distance',
    _announce_time: 'Annoncer le temps',
    _announce_average_speed: 'Annoncer la vitesse moyenne',
    _announce_average_pace: 'Annoncer l allure moyenne',
    _delay_start: 'Report du depart de 10 secondes',
    _export_as_gpx: 'Exporter en GPX',
    _debug_tools: 'Outils de debug',
    _debug_mode: 'Mode debug',
    _settings: 'Préférences',
    _debug_test_vocal: 'Tester les annonces',
    _average:'Moyenne',
    _records:'Records',
    _speed_kph: 'Vitesse (Kph)',
    _duration_minutes: 'Durée (minutes)',
    _altitude_meters: 'Altitude (metres)',
    _time:'Temps',
    _distance:'Distance',
    _speed:'Vitesse',
    _pace: 'Allure',
    _debug_warning: 'Le mode de debuggage ralentit séverement l\`application.'

  });
  $translateProvider.preferredLanguage("en-US");
  $translateProvider.fallbackLanguage("en-US");

});
