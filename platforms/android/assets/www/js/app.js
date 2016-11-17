angular.module('app', ['ionic', 'app.services', 'app.controllers', 'chart.js', 'pascalprecht.translate', 'ionic-material',
                           'leaflet-directive', 'ionMdInput', 'ionic-modal-select'])

.run(function($ionicPlatform) {
  'use strict';

    $ionicPlatform.ready(function() {
        console.log('Ionic platform ready');

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        window.oldConsole = { error: console.error, log: console.log, warn: console.warn, info: console.info };
        window.initialLogs = [];

        /*if (window.cordova) {
            console.log = function () {
                var argsArr = Array.prototype.slice.call(arguments);
            window.oldConsole.log.apply(this, argsArr);
            window.initialLogs.push(argsArr);
            };

            console.error = function() {
                    var argsArr = Array.prototype.slice.call(arguments);
            window.oldConsole.error.apply(this, argsArr);
            window.initialLogs.push(argsArr);
            };

            console.info = function () {
                    var argsArr = Array.prototype.slice.call(arguments);
            window.oldConsole.info.apply(this, argsArr);
            window.initialLogs.push(argsArr);
            };

            console.warn = function ()  {
            var argsArr = Array.prototype.slice.call(arguments);
            window.oldConsole.warn.apply(this, argsArr);
            window.initialLogs.push(argsArr);
            };

            window.onerror = function() {
                // route errors to console.error for now
                var argsArr = Array.prototype.slice.call(arguments);
            window.oldConsole.error.apply(this, argsArr);
            window.initialLogs.push(argsArr);
            };
        }*/

        if (window.device) {
            console.log(window.device); }
    });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider, $logProvider, $compileProvider) {
  'use strict';

  $ionicConfigProvider.scrolling.jsScrolling(false);
  //$ionicConfigProvider.views.maxCache(0);
  $logProvider.debugEnabled(false);
  $compileProvider.debugInfoEnabled(false);
  try {
   if (window.device.platform === 'firefoxos') {
        console.log('compileProvider.aHrefSanitizationWhitelist');
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(file|https?|ftp|mailto|app):/);
  }} catch(err) {console.log('compilerProvider err:'+err);}


  $stateProvider

  .state('app', {
    url: '/app',
    //abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.running', {
    url: '/running',
    views: {
      'menuContent': {
        templateUrl: 'templates/running.html'
      }
    }
  })

  .state('app.filepicker', {
    url: '/filepicker',
    views: {
      'menuContent': {
        templateUrl: 'templates/filepicker.html'
      }
    }
  })


  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })


   .state('app.records', {
      url: '/records',
      views: {
        'menuContent': {
          templateUrl: 'templates/records.html',
          controller: 'RecordsCtrl'
        }
      }
    })

   .state('app.equipments', {
      url: '/equipments',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/equipments.html',
          controller: 'EquipmentsCtrl'
        }
      }

    })

  .state('app.sessions', {
      url: '/sessions',
      views: {
        'menuContent': {
          templateUrl: 'templates/sessions.html',
          controller: 'SessionsCtrl'
        }
      }
    })

  .state('app.session', {
    url: '/sessions/:sessionId',
    views: {
      'menuContent': {
        templateUrl: 'templates/session.html',
        controller: 'SessionCtrl'
      }
    }
  })

   .state('app.equipment', {
    url: '/equipments/:equipmentId',
    views: {
      'menuContent': {
        templateUrl: 'templates/equipment.html',
        controller: 'EquipmentCtrl'
      }
    }
  })

  .state('app.help', {
    url: '/help',
    views: {
      'menuContent': {
        templateUrl: 'templates/help.html',
        controller: 'HelpCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/sessions');

  $translateProvider.translations('en-US', {
    _language: 'Language',
    _english: 'English',
    _french: 'French',
    _vocal_announce: 'Vocal Announces',
    _duration_interval: 'Duration interval',
    _minutes: 'minutes',
    _hours: 'hours',
    _options: 'Options',
    _backup_and_restore: 'Backup and Restore',
    _restore: 'Restore',
    _backup: 'Backup',
    _distance_interval: 'Distance interval',
    _notification_slug: 'ForRunners : Recording session ...',
    _notification_message: 'Recording session ...',
    _go: 'Go !',
    _kilometers: 'Kilometers',
    _kilometers_per_hour: 'Kilometers per hour',
    _and: 'and',
    _seconds_per_kilometers: 'seconds per kilometers',
    _confirm_delete: 'Are you sure you want to delete this session?',
    _confirm_delete_eq: 'Are you sure you want to delete this equipment?',
    _delete_eq: 'Delete',
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
    _announce_heartrate: 'Announce heartrate',
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
    _run_fast: 'Run faster !',
    _run_slow: 'Run slower !',
    enUS: 'English',
    frFR: 'French',
    deDE: 'German',
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
    _welcome_text: 'It s look like that\'s the first time you use ForRunners. You can start recording your run with the plus button below or by importing older running session from GPX files in the settings.',
    _announce_fraction: 'Interval announce',
    _empty_records_text: 'You haven\'t any runnning session recorded yet, so any records to defeat.',
    _open_source_content: 'Open Source Content',
    _bpm: 'Heart rate',
    _bpms_label: 'bpms',
    _vocal_bpms_label: 'beats per minutes',
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
    _heartrate_label:'Bpm',
    _bluetooth_devices:'Bluetooth devices',
    _scan_ble:'Search devices',
    _help: 'Help',
    _report_issue: 'Report issue on GitHub',
    _gps_accuracy: 'GPS Accuracy :',
    _delete: 'Delete',
    _overnote: 'Score',
    _total: 'Total :',
    _score: 'Score :',
    _restore_ok_content: 'Backup restored',
    _restore_ok_title: 'Restore',
    _use_google_elevation_api: 'Use Google Elevation API',
    _speed_vs_altitude: 'Speed VS Altitude',
    _speed_vs_heartrate: 'Speed VS HeartRate',
    _altitude_vs_heartrate: 'Altitude VS HeartRate',
    _help_subtitle_1: 'Welcome on ForRunners ! This little help will try to explain you the main concept of ForRunners. Use the next and previous button below to navigate in this help.',
    _help_desc_1: 'The main screen presents all your running sessions. <br><br><b>1-</b> This button start a new running session<br><br><b>2-</b> Average statistics calculated from all your sessions<br><br><b>3-</b> Your best running records<br><br><b>4-</b> Rounded length of the session<br><br><b>5-</b> A score representing difficulty of your run<br><br><b>6-</b> A graph showing the score evolution and duration evolution',
    _help_subtitle_2: 'This is the detail of a session, showing your run on a map, with detailed statistics and graphics.',
    _help_desc_2: '<b>1-</b> The OpenStreetMap map, showing your run<br><br><b>2-</b> The blue marker are kilometer marker, while the green "S" marker is for "Start" and red "E" marker for "End"<br><br><b>3-</b> This icon is for sharing your run<br><br><b>4-</b> This icon is for deleting your session<br><br><b>5-</b> Date of your running session with resume values.',
    _help_desc_3: '<b>1-</b> Date<br><br><b>2-</b> Average speed<br><br><b>3-</b> Average pace<br><br><b>4-</b> Distance<br><br><b>5-</b> Duration hh:mm<br><br><b>6-</b> Total elevation in meters<br><br><b>7-</b> Total down in meter<br><br><b>8-</b> Weather at the date of the run<br><br><b>9-</b> Score, Duration, Distance, Pace<br><br>',
    _help_subtitle_3: ' ',
    _help_subtitle_4: ' ',
    _help_desc_4: 'X axis (2) hold kilometers and y axis (3) show speed, while the colors (1) show heartrate zone (Require a bluetooth heartrate monitor and a compatible smartphone)',
    _help_subtitle_5: ' ',
    _help_desc_5: 'X axis (2) hold kilometers and y axis (3) show altitude, while the colors (1) show heartrate zone (Require a bluetooth 4.0 heartrate monitor and a compatible smartphone)',
    _help_subtitle_6: ' ',
    _help_desc_6: '<b>1-</b> Average heart rate during your session<br><br><b>2-</b> Graphic showing duration in each heart rate zone<br><br><b>3- </b> Table with pace, speed and heartrate by kilometers.<br><br>Now clic next and start your first running session or import past sessions from preferences.',
    _previous:'Previous',
    _next:'Next',
    _gps_lost:'GPS Signal lost',
    _gps_got:'Recovered GPS Signal',
    _announce_gpslost: 'Announce when GPS Signal lost',
    _recording_session: 'Recording session ...',
    _speed_in_mvt: 'Moving Speed',
    _pace_in_mvt: 'Moving Pace',
    _spm_label: 'spm',
    _power: 'Power',
    _cadence: 'Step Rate',
    _sendlogs: 'Send logs',
    _equipments: 'Equipments',
    _add_equipment: 'Add a equipment',
    _duration_interval_detail: 'Announce informations at regular interval',
    _distance_interval_detail: 'Announce informations at kilometer interval',
    _heartrate_min_detail: 'Your resting heart rate, measured just after wake up',
    _heartrate_max_detail: 'Your maximum heart rate in a 4 minutes sprint just after a 20 minutes warmup.'
  });
  $translateProvider.translations('fr-FR', {
    _language: 'Langage',
    _english: 'Anglais',
    _french: 'Francais',
    _vocal_announce: 'Annonces vocale',
    _duration_interval: 'Interval de temps',
    _minutes: 'minutes',
    _hours: 'heures',
    _options: 'Options',
    _restore: 'Restaurer',
    _backup: 'Sauvegarder',
    _backup_and_restore: 'Sauvegardes',
    _distance_interval: 'Interval de distance',
    _notification_slug: 'ForRunners : Enregistrement ...',
    _notification_message: 'Enregistrement ...',
    _go: 'Go !',
    _kilometers: 'Kilometres',
    _kilometers_per_hour: 'Kilometres par heure',
    _and: 'et',
    _seconds_per_kilometers: 'secondes par kilometres',
    _confirm_delete: 'Etes vous sur de vouloir supprimer cette session?',
    _confirm_delete_eq: 'Etes vous sur de vouloir supprimer cet equipement?',
    _delete_eq: 'Supprimer',
    _equipments: 'Equipements',
    _add_equipment: 'Ajouter un equipement',
    _gpx_export_title: 'Export GPX',
    _gpx_file_exported: 'Toute vos sessions ont été exportées au format GPX.',
    _import_gpxs: 'Importer des fichiers GPX',
    _export_as_gpx: 'Export vers des fichiers GPX',
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
    _announce_heartrate: 'Announcer la fréquence cardiaque',
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
    _run_fast: 'Plus vite !',
    _run_slow: 'Plus lentement !',
    _debug_warning: 'Le mode de debuggage ralentit séverement l\`application.',
    enUS: 'Anglais',
    frFR: 'Francais',
    deDE: 'Allemand',
    _privacy_policy_text: 'ForRunners ne communique aucune information en dehors de votre périphérique, exception faite lors de la recupération des carte OpenStreetMap et si vous activez le mode debug ou des logs de debug seront envoyé sur http://khertan.net/.',
    _short_description: 'Une application de géolocalisation dédiée aux coureurs.',
    _use_open_source_text : 'ForRunners utilise des librairies et du code open source',
    _by : 'Par',
    _swipe_left: 'Glisser pour stopper',
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
    _vocal_bpms_label: 'battement par minutes',
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
    _heartrate_label:'Bpm',
    _bluetooth_devices:'Périphériques Bluetooth',
    _scan_ble:'Rechercher',
    _help: 'Aide',
    _report_issue: 'Rapporter un bogue sur GitHub',
    _gps_accuracy: 'Precision GPS :',
    _delete: 'Supprimer',
    _note: 'Note',
    _total: 'Total :',
    _score: 'Score :',
    _restore_ok_content: 'Sauvegarde restauré',
    _restore_ok_title: 'Restauration',
    _use_google_elevation_api: 'Utiliser l API Elevation Google',
    _speed_vs_altitude: 'Vitesse et Altitude',
    _speed_vs_heartrate: 'Vitesse et Fréquence Cardiaque',
    _altitude_vs_heartrate: 'Altitude et Fréquence Cardiaque',
    _help_subtitle_1: 'Bienvenue sur ForRunners ! Cette aide va essayer de vous expliquer brievement le concept de base de l\'interface de ForRunners. Utiliser les boutons suivant et précédant pour naviger dans cette aide.',
    _help_desc_1: 'L\'écran principal présente la liste de vos courses.<br><br><b>1-</b> Ce bouton commence une nouvelle session<br><br><b>2-</b> Moyenne de toutes les sessions<br><br><b>3-</b> Les records de toutes les sessions<br><br><b>4-</b> Longueur arrondi d une session en kilometres<br><br><b>5-</b> Une note representant la difficulté.<br><br><b>6-</b> Un graphique montrant votre évolution',
    _help_subtitle_2: 'Ceci est la vue détaillée d\'une course, avec graphiques et statistiques',
    _help_desc_2: '<b>1-</b> La carte en provenance d\'OpenStreetMap map<br><br><b>2-</b> Les marqueurs bleu représentent chaque kilometres, tandis que le "S" vert montre le début et le "E" rouge la fin<br><br><b>3-</b> Une icon permettant de partager votre course sur twitter, par texto ou autre<br><br><b>4-</b> Cette icon permet d\'effacer une session<br><br><b>5-</b> Date de la session avec un resumé des principales informations.',
    _help_desc_3: '<b>1-</b> Date<br><br><b>2-</b> Vitesse moyenne<br><br><b>3-</b> Allure moyenne<br><br><b>4-</b> Distance<br><br><b>5-</b> Durée hh:mm<br><br><b>6-</b> Monté en metres<br><br><b>7-</b> Descente en metres<br><br><b>8-</b> La météo au moment de la course<br><br><b>9-</b> Note, Durée, Distance, Allure<br><br>',
    _help_subtitle_3: ' ',
    _help_subtitle_4: ' ',
    _help_desc_4: 'L\'axe des X (2) indique les kilometres, et l axe Y (1) montre la vitesse, tandis que les couleurs correspondent aux zone de fréquences cardiaque (1)(Nécéssite un capteur de fréquence cardiaque Bluetooth 4.0 et un téléphone compatible)',
    _help_subtitle_5: ' ',
    _help_desc_5: 'L\'axe des X (2) indique les kilometres, et l axe Y (1) montre l\'altitude, tandis que les couleurs correspondent aux zone de fréquences cardiaque (1)(Nécéssite un capteur de fréquence cardiaque Bluetooth 4.0 et un téléphone compatible)',
    _help_subtitle_6: ' ',
    _help_desc_6: '<b>1-</b> Fréquence cardiaque moyenne<br><br><b>2-</b> Graphique montrant la durée dans chaque zone cardiaque.<br><br><b>3- </b> Un tableau montrant la vitesse, l\'allure et la fréquence cardiaque par kilometres.<br><br>Cliquez sur le bouton next et effectué votre première session ou importez d\'anciennes sessions.',
    _previous: 'Precédent',
    _next: 'Suivant',
    _gps_lost: 'Signal GPS non disponible',
    _gps_got: 'Signal GPS disponible',
    _announce_gpslost: 'Annoncer la perte du signal GPS',
    _recording_session: 'Enregistrement de la session ...',
    _speed_in_mvt: 'Vitesse en mvt',
    _pace_in_mvt: 'Allure en mvt',
    _spm_label: 'ppm',
    _power: 'Power',
    _cadence: 'Cadence',
    _sendlogs: 'Envoyer les logs',
    _duration_interval_detail: 'Effectuer les annonces vocales a interval de temps',
    _distance_interval_detail: 'Effectuer les annonces vocales a interval de kilometres',
    _heartrate_max_detail: 'Votre fréquence cardiaque sur un sprint de 4 minutes après un échauffement de 20 minutes',
    _heartrate_min_detail: 'Votre fréquence cardiaque au repos, mesuré après le reveil.'
 });

$translateProvider.translations('de-DE', {
    _language: 'Sprache',
    _english: 'Englisch',
    _french: 'Französisch',
    _german: 'Deutsch',
    _vocal_announce: 'Ansagen',
    _duration_interval: 'Ansagenhäufigkeit',
    _minutes: 'Minuten',
    _hours: 'Stunden',
    _options: 'Optionen',
    _backup_and_restore: 'Sicherung und Einlesen',
    _restore: 'Einlesen',
    _backup: 'Sichern',
    _distance_interval: 'Strecken Interval',
    _notification_slug: 'ForRunners : Aufnahme Trainingseinheit ...',
    _notification_message: 'Aufnahme Trainingseinheit ...',
    _go: 'Start !',
    _kilometers: 'Kilometer',
    _kilometers_per_hour: 'Stundenkilometer',
    _and: 'und',
    _seconds_per_kilometers: 'Sekunden pro Kilometer',
    _confirm_delete: 'Aufnahme wirklich löschen?',
    _confirm_delete_eq: 'Zubehör wirklich löschen?',
    _delete_eq: 'Löschen',
    _gpx_export_title: 'GPX Export',
    _gpx_file_exported: 'Alle Aufnahmen als GPX-Datei exportieren.',
    _backup_ok_title: 'Sichern',
    _backup_ok_content: 'Sicherung ins Programmverzeichniss zurückschreiben.',
    _backup_error_title: 'Fehler',
    _backup_error_content: 'Es ist ein Fehler beim Sichern aufgetreten.',
    _gpx_error_title:'Fehler',
    _gpx_error_content:'Die GPX Exportierung schlug fehl.',
    _gpx_import_title: 'GPX Importierung',
    _gpx_file_imported: 'Alle Dateien importiert.',
    _toggle_music_on_announce: 'Music bei Ansage stummschalten',
    _announce_distance: 'Streckendistanz ansagen',
    _announce_time: 'Zeit ansagen',
    _announce_average_speed: 'Geschwindigkeit ansagen',
    _announce_average_pace: 'Durchnittsgeschwindigkeit ansagen',
    _announce_heartrate: 'Herzfrequenz ansagen',
    _delay_start: 'Startverzögerung von 10 SeKunden',
    _export_as_gpx: 'Exportiere als GPX',
    _import_gpxs: 'Importiere eine GPX-Datei',
    _debug_tools: 'Debug Werkzeug',
    _debug_mode: 'Debug Modus',
    _settings: 'Einstellungen',
    _debug_test_vocal: 'Testansage',
    _average:'Durchschnitt',
    _records:'Aufnahmen',
    _speed_kph: 'Geschwindigkeit (kmh)',
    _duration_minutes: 'Dauer (Minuten)',
    _altitude_meters: 'Höhe (Meter)',
    _time:'Zeit',
    _distance:'Strecke',
    _speed:'Geschwindigkeit',
    _pace: 'Tempo',
    _debug_warning: 'Debug Modus verlangsamt die Anwendung',
    _run_fast: 'Schneller Laufen !',
    _run_slow: 'Langsamer Laufen !',
    enUS: 'Englisch',
    frFR: 'Französisch',
    deDE: 'Deutsch',
    _privacy_policy_text: 'ForRunners versendet keine Daten vom Gerät außer für den Service von Openstreet.net oder im Debug Modus. Dann werden die Fehler und Debug-Nachrichten an meinen eigenen Server gesendet',
    _short_description: 'Eine GPS-Tracking-Anwendung für Läufer.',
    _use_open_source_text : 'ForRunners benutzt Teile von Bibliotheken der folgenden Open Source Projekte',
    _by : 'von',
    _swipe_left: 'Wische nach links zum Stoppen',
    _stop: 'Stop',
    _elevationUp: 'Rauf',
    _elevationDown: 'Runter',
    _sessions: 'Sitzung',
    _about: 'Über',
    _speed_maximum: 'Maximum',
    _speed_average: 'Durchschnitt',
    _up: 'Höher',
    _down: 'Tiefer',
    _km: 'Km',
    _distk: 'Type',
    _duration: 'Zeit',
    _best_records: 'Beste',
    _average_records: 'Durchschnitt',
    _fraction: 'Interval Training',
    _duration_slow_interval: 'Langsamer Interval',
    _duration_fast_interval: 'Schneller Interval',
    _welcome_text: 'Es sieht so aus als ob du ForRunners zum ersten mal startest. DU kannst eine Aufnahme mit dem Plus-Zeichen unten starten oder eine GPX-Datei von älteren Sitzungen importieren.',
    _announce_fraction: 'Interval Ansage',
    _empty_records_text: 'Zurzeit keine laufenden Aufnahmen, so any records to defeat.',
    _open_source_content: 'Open Source Inhalt',
    _bpm: 'Herzfrequenz',
    _bpms_label: 'bpms',
    _vocal_bpms_label: 'Schläge pro Minute',
    _donation: 'Wenn du willst das die App weiter entwickelt wird oder Du dich nur Bedanken willst, sende Bitcoins an:',
    _keep_screen_on: 'Display nicht abschalten',
    _hr_zone0:'Zurücksetzen',
    _hr_zone1:'Stoffwechsel',
    _hr_zone2:'Aeoribische Kraft',
    _hr_zone3:'Ausdauer',
    _hr_zone4:'Schnellster Sprint',
    _heartRate:'Herzfrequenz',
    _heartrate_max:'Höhste Herzfrequenz',
    _heartrate_min:'Tiefste Herzfrequenz',
    _heartrate_label:'Bpm',
    _bluetooth_devices:'Bluetooth Gerät',
    _scan_ble:'Suche Gerät',
    _help: 'Hilfe',
    _report_issue: 'Report-Ausgabe nach GitHub',
    _gps_accuracy: 'GPS Genauigkeit:',
    _delete: 'Löschen',
    _overnote: 'Ergebnis',
    _total: 'Total:',
    _score: 'Ergebnis:',
    _restore_ok_content: 'Backup wiederhergestellt',
    _restore_ok_title: 'Wiederherstellung',
    _use_google_elevation_api: 'Nutze Google Elevation API',
    _speed_vs_altitude: 'Geschwindigkeit über die Höhe',
    _speed_vs_heartrate: 'Geschwindigkeit über die Herzfrequenz',
    _altitude_vs_heartrate: 'Höhe über die Herzfrequenz',
    _help_subtitle_1: 'Willkommen bei ForRunners ! Diese kleine Übersicht beschreibt das Konzept von ForRunners. Benutze die Vor und Zurück Schaltflächen um in der Hilfe zu blättern.',
    _help_desc_1: 'Der Hauptbildschirm zeigt alle erzeugten Läufe. <br><br><b>1-</b> Dieser Knopf startet einen neuen Lauf<br><br><b>2-</b> Durchschnitt aller Läufe<br><br><b>3-</b> Deine Laufrekorde<br><br><b>4-</b> Gerundete Strecken aller Läufe<br><br><b>5-</b> Eine Punktzahl über den Schwierigkeitsgrad des Laufs<br><br><b>6-</b> Ein Diagramm das die Entwicklung der Ergebnisse und der Dauer anzeigt',
    _help_subtitle_2: 'Das ist die Detailansicht einer Aufzeichnung, er zeigt den Lauf auf einer Karte inklusive Statistiken und Grafiken an.',
    _help_desc_2: '<b>1-</b> Die OpenStreetMap Karte zeigt deinen Lauf<br><br><b>2-</b> Die blauen Marierungen zeigen die Kilometer an, die grüne Markierung ist der Startpunkt und die rote Markierung ist der Zielpunkt<br><br><b>3-</b> Mit diesem Icon teilst du deinen Lauf<br><br><b>4-</b> Dieses Icon Löscht den aktuellen Lauf<br><br><b>5-</b> Datum und Uhrzeit des Laufs.',
    _help_desc_3: '<b>1-</b> Datum und Uhrzeit des Laufs<br><br><b>2-</b> Höchstes Tempo<br><br><b>3-</b> Durchschnittsgeschwindigkeit<br><br><b>4-</b> Distanz<br><br><b>5-</b> Gesammtzeit hh:mm<br><br><b>6-</b> Höhenunterschied Aufwärts in Meter<br><br><b>7-</b> Höhenunterschied Abwärts in Meter<br><br><b>8-</b> Wetterbedingungen beim Lauf<br><br><b>9-</b> Ergebniss, Zeit, Distanz, Tempo<br><br>',
    _help_subtitle_3: ' ',
    _help_subtitle_4: ' ',
    _help_desc_4: 'Die X-Achse (2) zeigt die Kilometer, die Y-Achse (3) zeigt die Geschwindigkeit und die Farben (1) zeigen die Herzfrequenz-Zonen (benötigt einen kompatibelen Bluetooth-Herzfrequenz-Messer)',
    _help_subtitle_5: ' ',
    _help_desc_5: 'Die X-Achse (2) zeigt die Kilometer, die Y-Achse (3) zeigt die Höhenmeter, und die Farben (1) zeigen die Herzfrequenz-Zonen (benötigt einen kompatibelen Bluetooth-Herzfrequenz-Messer)',
    _help_subtitle_6: ' ',
    _help_desc_6: '<b>1-</b> Durchschnittliche Herzfrequenz des Laufs <br><br><b>2-</b> Tabelle mit Distanz, Ergebniss, Geschwindigkeit und Herzfrequenz.<br><br><b>3- </b> Die Grafik zeigt die Dauer der Herzfrequenz-Zonen des Laufs.<br><br>Und jetzt drücke Start für deinen ersten Lauf oder Importiere ältere Läufe in den -Einstellungen-',
    _previous:'Zurück',
    _next:'Vor',
    _gps_lost:'GPS Signal verloren',
    _gps_got:'GPS Signal erkannt',
    _announce_gpslost: 'Ansage bei GPS Signalverlust ',
    _recording_session: 'Laufaufzeichnung ...',
    _speed_in_mvt: 'Ändere Geschwindigkeit',
    _pace_in_mvt: 'Ändere Tempo',
    _spm_label: 'spm',
    _power: 'Kraft',
    _cadence: 'Step Rate',
    _sendlogs: 'Sende Logdateien',
    _equipments: 'Equipments',
    _add_equipment: 'Füge Equipment hinzu',
    _duration_interval_detail: 'Ansagen in Zeitintervallen (in Minuten)',
    _distance_interval_detail: 'Ansagen nach Distanzen (in Kilometer)',
    _heartrate_min_detail: 'Deine Herzfrequenz im Ruhezustand',
    _heartrate_max_detail: 'Deine maximale Herzfrequenz nach 4 Minuten Sprint oder nach 20 Minuten Aufwärmtraining.'
});
  $translateProvider.preferredLanguage('en-US');
  $translateProvider.fallbackLanguage('en-US');

});
