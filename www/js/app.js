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

.config(function($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider, $logProvider, $compileProvider) {

  $ionicConfigProvider.scrolling.jsScrolling(false);
  $logProvider.debugEnabled(false);
  $compileProvider.debugInfoEnabled(false);

  $stateProvider

  .state('app', {
    url: "/app",
    //abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.running', {
    url: "/running",
    views: {
      'menuContent': {
        templateUrl: "templates/running.html"
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


   .state('app.records', {
      url: "/records",
      views: {
        'menuContent': {
          templateUrl: "templates/records.html",
          controller: 'RecordsCtrl'
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
    _gpx_import_title: 'GPX Import',
    _gpx_file_imported: 'All files have been imported.',
    _toggle_music_on_announce: 'Toggle music on announce',
    _announce_distance: 'Announce distance',
    _announce_time: 'Announce time',
    _announce_average_speed: 'Announce average speed',
    _announce_average_pace: 'Announce average pace',
    _delay_start: 'Delay start of 10 secondes',
    _export_as_gpx: 'Export as GPX',
    _import_gpxs: 'Import GPX files',
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
    enUS: 'English',
    frFR: 'French',
    _privacy_policy_text: 'ForRunners didn\'t communicate any informations outside of your device, except for getting maps from Openstreet.net services and if you activate debug mode. In this last case, any errors and debug message will be sent to my own server for debugging.',
    _short_description: 'A gps tracking application dedicated to runners.',
    _use_open_source_text : 'ForRunners use parts or library of the following open source projects',
    _by : 'By',
    _swipe_left: 'Swipe Left to Stop',
    _stop: 'Stop',
    _elevationUp: 'Up',
    _elevationDown: 'Down',
    _sessions: 'Sessions',
    _about: 'About',
    _speed_maximum: 'Maximum',
    _speed_average: 'Average',
    _up: 'Up',
    _down: 'Down',
    _km: 'Km',
    _distk: 'Type',
    _duration: 'Time',
    _best_records: 'Best',
    _average_records: 'Average',
    _fraction: 'Interval training',
    _duration_slow_interval: 'Slow interval',
    _duration_fast_interval: 'Fast interval',
    _welcome_text: 'It s look like that\'s the first time you use ForRunners. You can start recording your run with the plus button below or by import older running session from GPX files in the settings.',
    _announce_fraction: 'Interval announce',
    _empty_records_text: 'You haven\'t any runnning session recorded yet, so any records to defeat.',
    _open_source_content: 'Open Source Content',
    _bpm: 'Heart rate',
    _bpms_label: 'bpms',
    _donation: 'If you want to see this app elvoving or only thanks me, you can make a donation in bitcoin :',
    _keep_screen_on: 'Keep Screen on while running',
    _hr_zone0:'Recovery',
    _hr_zone1:'Fat Metabolism',
    _hr_zone2:'Aeoribic power',
    _hr_zone3:'Speed Endurance',
    _hr_zone4:'Maximum Sprint',
    _heartRate:'HeartRate',
    _heartrate_max:'Max Heart Rate frequency',
    _heartrate_min:'Rest Heart Rate frequency',
    _heartrate_label:'Bpm'

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
    _import_gpxs: 'Importer des fichiers GPX',
    _gpx_import_title: 'Import GPX',
    _gpx_file_imported: 'Tous les fichiers ont été importés.',
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
    _export_ans_gpx: 'Exporter en GPX',
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
    _debug_warning: 'Le mode de debuggage ralentit séverement l\`application.',
    enUS: 'Anglais',
    frFR: 'Francais',
    _privacy_policy_text: 'ForRunners ne communique aucune information en dehors de votre périphérique, exception faite lors de la recupération des carte OpenStreetMap et si vous activez le mode debug ou des logs de debug seront envoyé sur http://khertan.net/.',
    _short_description: 'Une application de géolocalisation dédiée aux coureurs.',
    _use_open_source_text : 'ForRunners utilise des librairies et du code open source',
    _by : 'Par',
    _swipe_left: 'Glisser pour stoper',
    _stop: 'Stop',
    _elevationUp: 'Monté',
    _elevationDown: 'Descente',
    _sessions: 'Sessions',
    _about: 'A propos',
    _speed_maximum: 'Maximum',
    _speed_average: 'Moyenne',
    _up: 'Montée',
    _down: 'Descente',
    _km: 'Km',
    _distk: 'Type',
    _duration: 'Temps',
    _best_records: 'Records',
    _average_records: 'Moyenne',
    _fraction: 'Entraînement fractionné',
    _duration_slow_interval: 'Interval lent',
    _duration_fast_interval: 'Interval rapide',
    _welcome_text: 'Il semblerait que cela soit la première fois que vous lancez ForRunners. Vous pouvez des maintenant enregistrer une course en appuyant sur le bouton plus, ou importer vos anciennes sessions de course par import de fichier GPX depuis le menu préférences.',
    _announce_fraction: 'Annonce fractionné',
    _empty_records_text: 'Vous n\'avez encore aucune session de course enregistrée. Donc aucun records à battre.',
    _open_source_content: 'Open Source Content',
    _bpm: 'Heart rate',
    _bpms_label: 'bpms',
    _donation: 'Si vous souhaitez voir cette application évoluer ou tout simplement me remercier, vous pouvez effectuer une donation en bitcoin :',
    _keep_screen_on: 'Garder l\'écran allumé pendant la course',
    _hr_zone0:'Récupération active',
    _hr_zone1:'Brulage des graisses',
    _hr_zone2:'Cardio',
    _hr_zone3:'Endurance',
    _hr_zone4:'Anaérobie (sprints)',
    _heartRate:'Frequence Cardiaque',
    _heartrate_max:'Frequence cardiaque max',
    _heartrate_min:'Frequence cardiaque au repos',
    _heartrate_label:'Bpm'

  });

  $translateProvider.preferredLanguage("en-US");
  $translateProvider.fallbackLanguage("en-US");

});
