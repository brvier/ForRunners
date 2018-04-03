angular
  .module("app", [
    "ionic",
    "app.services",
    "app.controllers",
    "chart.js",
    "pascalprecht.translate", //'ionic-material', 'ionMdInput',
    "leaflet-directive",
    "ionic-modal-select",
    "iosDblclick"
  ])

  .run(function($ionicPlatform) {
    "use strict";

    $ionicPlatform.ready(function() {
      console.log("Ionic platform ready");

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      window.oldConsole = {
        error: console.error,
        log: console.log,
        warn: console.warn,
        info: console.info
      };
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
        console.log(window.device);
      }
    });
  })

  .config(function(
    $stateProvider,
    $urlRouterProvider,
    $translateProvider,
    $ionicConfigProvider,
    $logProvider,
    $compileProvider
  ) {
    "use strict";

    $ionicConfigProvider.scrolling.jsScrolling(false);
    //$ionicConfigProvider.views.maxCache(0);
    $logProvider.debugEnabled(false);
    $compileProvider.debugInfoEnabled(false);
    try {
      if (window.device.platform === "firefoxos") {
        console.log("compileProvider.aHrefSanitizationWhitelist");
        $compileProvider.aHrefSanitizationWhitelist(
          /^\s*(file|https?|ftp|mailto|app):/
        );
      }
    } catch (err) {
      console.log("compilerProvider err:" + err);
    }

    $stateProvider

      .state("app", {
        url: "/app",
        //abstract: true,
        templateUrl: "templates/menu.html",
        controller: "AppCtrl"
      })

      .state("app.running", {
        url: "/running",
        views: {
          menuContent: {
            templateUrl: "templates/running.html"
          }
        }
      })

      .state("app.filepicker", {
        url: "/filepicker",
        views: {
          menuContent: {
            templateUrl: "templates/filepicker.html"
          }
        }
      })

      .state("app.about", {
        url: "/about",
        views: {
          menuContent: {
            templateUrl: "templates/about.html"
          }
        }
      })

      .state("app.settings", {
        url: "/settings",
        views: {
          menuContent: {
            templateUrl: "templates/settings.html",
            controller: "SettingsCtrl"
          }
        }
      })

      .state("app.records", {
        url: "/records",
        views: {
          menuContent: {
            templateUrl: "templates/records.html",
            controller: "RecordsCtrl"
          }
        }
      })

      .state("app.equipments", {
        url: "/equipments",
        cache: false,
        views: {
          menuContent: {
            templateUrl: "templates/equipments.html",
            controller: "EquipmentsCtrl"
          }
        }
      })

      .state("app.sessions", {
        url: "/sessions",
        views: {
          menuContent: {
            templateUrl: "templates/sessions.html",
            controller: "SessionsCtrl"
          }
        }
      })

      .state("app.session", {
        url: "/sessions/:sessionId",
        views: {
          menuContent: {
            templateUrl: "templates/session.html",
            controller: "SessionCtrl"
          }
        }
      })

      .state("app.edit_session", {
        url: "/edit_sessions/:sessionId",
        views: {
          menuContent: {
            templateUrl: "templates/edit_session.html",
            controller: "EditSessionCtrl"
          }
        }
      })
      .state("app.equipment", {
        url: "/equipments/:equipmentId",
        views: {
          menuContent: {
            templateUrl: "templates/equipment.html",
            controller: "EquipmentCtrl"
          }
        }
      })

      .state("app.help", {
        url: "/help",
        views: {
          menuContent: {
            templateUrl: "templates/help.html",
            controller: "HelpCtrl"
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/app/sessions");

    $translateProvider.translations("en-US", {
      _language: "Language",
      _english: "English",
      _french: "French",
      _german: "German",
      _portuguese: "Portuguese",
      _vocal_announce: "Vocal Announces",
      _duration_interval: "Duration interval",
      _minutes: "minutes",
      _hours: "hours",
      _options: "Options",
      _backup_and_restore: "Backup and Restore",
      _restore: "Restore",
      _backup: "Backup",
      _distance_interval: "Distance interval",
      _notification_slug: "ForRunners : Recording session ...",
      _notification_message: "Recording session ...",
      _go: "Go !",
      _kilometers: "Kilometers",
      _kilometers_per_hour: "Kilometers per hour",
      _and: "and",
      _seconds_per_kilometers: "seconds per kilometer",
      _confirm_delete: "Are you sure you want to delete this session?",
      _confirm_delete_eq: "Are you sure you want to delete this equipment?",
      _delete_eq: "Delete",
      _gpx_export_title: "GPX Export",
      _gpx_file_exported: "All your sessions exported as GPX files.",
      _backup_ok_title: "Backup",
      _backup_ok_content: "Backup available in the application data folder.",
      _backup_error_title: "Error",
      _backup_error_content: "An error occurred while creating the backup.",
      _gpx_error_title: "Error",
      _gpx_error_content: "The GPX export failed.",
      _gpx_import_title: "GPX Import",
      _gpx_file_imported: "All files have been imported.",
      _toggle_music_on_announce: "Toggle music on announce",
      _announce_distance: "Announce distance",
      _announce_time: "Announce time",
      _announce_average_speed: "Announce average speed",
      _announce_average_pace: "Announce average pace",
      _announce_heartrate: "Announce heartrate",
      _delay_start: "Delay start by 10 seconds",
      _export_as_gpx: "Export as GPX",
      _import_gpxs: "Import GPX files",
      _debug_tools: "Debug tools",
      _debug_mode: "Debug mode",
      _settings: "Settings",
      _debug_test_vocal: "Test vocal announcements",
      _average: "Average",
      _records: "Records",
      _speed_kph: "Speed (Kph)",
      _duration_minutes: "Duration (minutes)",
      _altitude_meters: "Altitude (meters)",
      _time: "Time",
      _distance: "Distance",
      _speed: "Speed",
      _pace: "Pace",
      _debug_warning: "Debug mode will severely slow down the application",
      _run_fast: "Run faster!",
      _run_slow: "Run slower!",
      enUS: "English",
      frFR: "French",
      deDE: "German",
      deAT: "German (Austria)",
      ptPT: "Portuguese",
      _privacy_policy_text:
        "ForRunners doesn't send any information from your device, except for downloading maps from Openstreet.net services or when debug mode is active. In the latter case, any errors and debug messages will be sent to the author's server for debugging.",
      _short_description: "A GPS tracking application dedicated to runners.",
      _use_open_source_text:
        "ForRunners uses parts or libraries of the following open source projects",
      _by: "By",
      _swipe_left: "Swipe Left to Stop",
      _stop: "Stop",
      _elevationUp: "Up",
      _elevationDown: "Down",
      _sessions: "Sessions",
      _about: "About",
      _speed_maximum: "Maximum",
      _speed_average: "Average",
      _up: "Up",
      _down: "Down",
      _km: "Km",
      _distk: "Type",
      _duration: "Time",
      _best_records: "Best",
      _average_records: "Average",
      _fraction: "Interval training",
      _duration_slow_interval: "Slow interval",
      _duration_fast_interval: "Fast interval",
      _welcome_text:
        "It looks like this is the first time you're using use ForRunners. You can start recording your run with the plus button below or by importing older running sessions from GPX files in the settings.",
      _announce_fraction: "Interval announce",
      _empty_records_text:
        "You haven't recorded any runnning sessions yet, so there are no records to beat.",
      _open_source_content: "Open Source Content",
      _bpm: "Heart rate",
      _bpms_label: "bpm",
      _vocal_bpms_label: "beats per minute",
      _donation:
        "If you want to see this app evolve or only thank me, you can make a donation in bitcoin:",
      _keep_screen_on: "Keep screen active while running",
      _hr_zone0: "Recovery",
      _hr_zone1: "Fat Metabolism",
      _hr_zone2: "Aerobic Power",
      _hr_zone3: "Speed Endurance",
      _hr_zone4: "Maximum Sprint",
      _heartRate: "Heart Rate",
      _heartrate_max: "Max Heart Rate Frequency",
      _heartrate_min: "Resting Heart Rate Frequency",
      _heartrate_label: "Bpm",
      _bluetooth_devices: "Bluetooth devices",
      _scan_ble: "Search for Devices",
      _help: "Help",
      _report_issue: "Report issue on GitHub",
      _gps_accuracy: "GPS Accuracy:",
      _delete: "Delete",
      _overnote: "Score",
      _total: "Total:",
      _score: "Score:",
      _restore_ok_content: "Backup restored",
      _restore_ok_title: "Restore",
      _use_google_elevation_api: "Use Google Elevation API",
      _speed_vs_altitude: "Speed VS Altitude",
      _speed_vs_heartrate: "Speed VS HeartRate",
      _altitude_vs_heartrate: "Altitude VS HeartRate",
      _help_subtitle_1:
        "Welcome to ForRunners! This little guide will try to explain the main concept of ForRunners. Use the next and previous button below to navigate through this guide.",
      _help_desc_1:
        "The main screen presents all your running sessions. <br><br><b>1-</b> This button start a new running session<br><br><b>2-</b> Average statistics calculated from all your sessions<br><br><b>3-</b> Your best running records<br><br><b>4-</b> Rounded length of the session<br><br><b>5-</b> A score representing difficulty of your run<br><br><b>6-</b> A graph showing the score evolution and duration evolution",
      _help_subtitle_2:
        "These are the details of a session, showing your run on a map with detailed statistics and graphics.",
      _help_desc_2:
        '<b>1-</b> The OpenStreetMap map, showing your run<br><br><b>2-</b> The blue markers are kilometer markers, while the green "S" marker is for "Start" and red "E" marker for "End"<br><br><b>3-</b> This icon is for sharing your run<br><br><b>4-</b> This icon is for deleting your session<br><br><b>5-</b> Date of your running session with resume values.',
      _help_desc_3:
        "<b>1-</b> Date<br><br><b>2-</b> Average speed<br><br><b>3-</b> Average pace<br><br><b>4-</b> Distance<br><br><b>5-</b> Duration hh:mm<br><br><b>6-</b> Total elevation in meters<br><br><b>7-</b> Total down in meter<br><br><b>8-</b> Weather at the date of the run<br><br><b>9-</b> Score, Duration, Distance, Pace<br><br>",
      _help_subtitle_3: " ",
      _help_subtitle_4: " ",
      _help_desc_4:
        "The x-axis (2) represents distance in kilometers and the y-axis (3) shows speed, while the colors (1) show heartrate zone (Requires a bluetooth heartrate monitor and compatible smartphone)",
      _help_subtitle_5: " ",
      _help_desc_5:
        "The x-axis (2) represents distance in kilometers and the y-axis (3) shows altitude, while the colors (1) show heartrate zone (Requires a bluetooth 4.0 heartrate monitor and compatible smartphone)",
      _help_subtitle_6: " ",
      _help_desc_6:
        "<b>1-</b> Average heart rate during your session<br><br><b>2-</b> Graphic showing duration in each heart rate zone<br><br><b>3- </b> Table with pace, speed and heartrate over each distance.<br><br>Now click next and start your first running session or import past sessions from preferences.",
      _previous: "Previous",
      _next: "Next",
      _gps_lost: "GPS Signal lost",
      _gps_got: "Recovered GPS Signal",
      _announce_gpslost: "Announce when GPS Signal lost",
      _recording_session: "Recording session ...",
      _speed_in_mvt: "Moving Speed",
      _pace_in_mvt: "Moving Pace",
      _spm_label: "spm",
      _power: "Power",
      _cadence: "Step Rate",
      _sendlogs: "Send logs",
      _equipments: "Equipment",
      _add_equipment: "Add a equipment",
      _duration_interval_detail: "Announce information at regular interval",
      _distance_interval_detail: "Announce information at kilometer interval",
      _heartrate_min_detail:
        "Your resting heart rate, measured just after waking up",
      _heartrate_max_detail:
        "Your maximum heart rate during a 4-minute sprint just after a 20-minute warmup.",
      _add_manually_a_session: "Add a session manually",
      _file_file_imported: "Imported successfully",
      _file_import_title: "Import",
      _import_files: "Import",
      _use_vocalAnnounce: "Voice announcements",
      _editable: "Touch to edit",
      _edit_session: "Edit Session",
      _session_name: "Session Name",
      _session_type: "Session Type"
    });

    $translateProvider.translations("fr-FR", {
      _language: "Langage",
      _english: "Anglais",
      _french: "Francais",
      _german: "Allemand",
      _portuguese: "Portugais",
      _vocal_announce: "Annonces vocale",
      _duration_interval: "Interval de temps",
      _minutes: "minutes",
      _hours: "heures",
      _options: "Options",
      _restore: "Restaurer",
      _backup: "Sauvegarder",
      _backup_and_restore: "Sauvegardes",
      _distance_interval: "Interval de distance",
      _notification_slug: "ForRunners : Enregistrement ...",
      _notification_message: "Enregistrement ...",
      _go: "Go !",
      _kilometers: "Kilometres",
      _kilometers_per_hour: "Kilometres par heure",
      _and: "et",
      _seconds_per_kilometers: "secondes par kilometres",
      _confirm_delete: "Etes vous sur de vouloir supprimer cette session?",
      _confirm_delete_eq: "Etes vous sur de vouloir supprimer cet equipement?",
      _delete_eq: "Supprimer",
      _equipments: "Equipements",
      _add_equipment: "Ajouter un equipement",
      _gpx_export_title: "Export GPX",
      _gpx_file_exported: "Toute vos sessions ont été exportées au format GPX.",
      _import_gpxs: "Importer des fichiers GPX",
      _export_as_gpx: "Export vers des fichiers GPX",
      _gpx_import_title: "Import GPX",
      _gpx_file_imported: "Tous les fichiers ont été importés.",
      _backup_ok_title: "Sauvegarde",
      _backup_ok_content:
        "Sauvegarde disponible dans le dossier de l'application.",
      _backup_error_title: "Erreur",
      _backup_error_content: "La création de la sauvegarde à échouée.",
      _gpx_error_title: "Erreur",
      _gpx_error_content: "L'export GPX a échoué",
      _toggle_music_on_announce: "Couper la musique lors des annonces",
      _announce_distance: "Annoncer la distance",
      _announce_time: "Annoncer le temps",
      _announce_average_speed: "Annoncer la vitesse moyenne",
      _announce_average_pace: "Annoncer l allure moyenne",
      _announce_heartrate: "Annoncer la fréquence cardiaque",
      _delay_start: "Report du depart de 10 secondes",
      _export_ans_gpx: "Exporter en GPX",
      _debug_tools: "Outils de debug",
      _debug_mode: "Mode debug",
      _settings: "Préférences",
      _debug_test_vocal: "Tester les annonces",
      _average: "Moyenne",
      _records: "Records",
      _speed_kph: "Vitesse (Kph)",
      _duration_minutes: "Durée (minutes)",
      _altitude_meters: "Altitude (metres)",
      _time: "Temps",
      _distance: "Distance",
      _speed: "Vitesse",
      _pace: "Allure",
      _run_fast: "Plus vite !",
      _run_slow: "Plus lentement !",
      _debug_warning: "Le mode de debuggage ralentit séverement l`application.",
      enUS: "Anglais",
      frFR: "Francais",
      deDE: "Allemand",
      deAT: "Allemand()",
      ptPT: "Portugais",
      _privacy_policy_text:
        "ForRunners ne communique aucune information en dehors de votre périphérique, exception faite lors de la recupération des carte OpenStreetMap et si vous activez le mode debug ou des logs de debug seront envoyé sur http://khertan.net/.",
      _short_description:
        "Une application de géolocalisation dédiée aux coureurs.",
      _use_open_source_text:
        "ForRunners utilise des librairies et du code open source",
      _by: "Par",
      _swipe_left: "Glisser pour stopper",
      _stop: "Stop",
      _elevationUp: "Monté",
      _elevationDown: "Descente",
      _sessions: "Sessions",
      _about: "A propos",
      _speed_maximum: "Maximum",
      _speed_average: "Moyenne",
      _up: "Montée",
      _down: "Descente",
      _km: "Km",
      _distk: "Type",
      _duration: "Temps",
      _best_records: "Records",
      _average_records: "Moyenne",
      _fraction: "Entraînement fractionné",
      _duration_slow_interval: "Interval lent",
      _duration_fast_interval: "Interval rapide",
      _welcome_text:
        "Il semblerait que cela soit la première fois que vous lancez ForRunners. Vous pouvez des maintenant enregistrer une course en appuyant sur le bouton plus, ou importer vos anciennes sessions de course par import de fichier GPX depuis le menu préférences.",
      _announce_fraction: "Annonce fractionné",
      _empty_records_text:
        "Vous n'avez encore aucune session de course enregistrée. Donc aucun records à battre.",
      _open_source_content: "Open Source Content",
      _bpm: "Heart rate",
      _bpms_label: "bpms",
      _vocal_bpms_label: "battement par minutes",
      _donation:
        "Si vous souhaitez voir cette application évoluer ou tout simplement me remercier, vous pouvez effectuer une donation en bitcoin :",
      _keep_screen_on: "Garder l'écran allumé pendant la course",
      _hr_zone0: "Récupération active",
      _hr_zone1: "Brulage des graisses",
      _hr_zone2: "Cardio",
      _hr_zone3: "Endurance",
      _hr_zone4: "Anaérobie (sprints)",
      _heartRate: "Frequence Cardiaque",
      _heartrate_max: "Frequence cardiaque max",
      _heartrate_min: "Frequence cardiaque au repos",
      _heartrate_label: "Bpm",
      _bluetooth_devices: "Périphériques Bluetooth",
      _scan_ble: "Rechercher",
      _help: "Aide",
      _report_issue: "Rapporter un bogue sur GitHub",
      _gps_accuracy: "Precision GPS :",
      _delete: "Supprimer",
      _note: "Note",
      _total: "Total :",
      _score: "Score :",
      _restore_ok_content: "Sauvegarde restauré",
      _restore_ok_title: "Restauration",
      _use_google_elevation_api: "Utiliser l API Elevation Google",
      _speed_vs_altitude: "Vitesse et Altitude",
      _speed_vs_heartrate: "Vitesse et Fréquence Cardiaque",
      _altitude_vs_heartrate: "Altitude et Fréquence Cardiaque",
      _help_subtitle_1:
        "Bienvenue sur ForRunners ! Cette aide va essayer de vous expliquer brievement le concept de base de l'interface de ForRunners. Utiliser les boutons suivant et précédant pour naviger dans cette aide.",
      _help_desc_1:
        "L'écran principal présente la liste de vos courses.<br><br><b>1-</b> Ce bouton commence une nouvelle session<br><br><b>2-</b> Moyenne de toutes les sessions<br><br><b>3-</b> Les records de toutes les sessions<br><br><b>4-</b> Longueur arrondi d une session en kilometres<br><br><b>5-</b> Une note representant la difficulté.<br><br><b>6-</b> Un graphique montrant votre évolution",
      _help_subtitle_2:
        "Ceci est la vue détaillée d'une course, avec graphiques et statistiques",
      _help_desc_2:
        '<b>1-</b> La carte en provenance d\'OpenStreetMap map<br><br><b>2-</b> Les marqueurs bleu représentent chaque kilometres, tandis que le "S" vert montre le début et le "E" rouge la fin<br><br><b>3-</b> Une icon permettant de partager votre course sur twitter, par texto ou autre<br><br><b>4-</b> Cette icon permet d\'effacer une session<br><br><b>5-</b> Date de la session avec un resumé des principales informations.',
      _help_desc_3:
        "<b>1-</b> Date<br><br><b>2-</b> Vitesse moyenne<br><br><b>3-</b> Allure moyenne<br><br><b>4-</b> Distance<br><br><b>5-</b> Durée hh:mm<br><br><b>6-</b> Monté en metres<br><br><b>7-</b> Descente en metres<br><br><b>8-</b> La météo au moment de la course<br><br><b>9-</b> Note, Durée, Distance, Allure<br><br>",
      _help_subtitle_3: " ",
      _help_subtitle_4: " ",
      _help_desc_4:
        "L'axe des X (2) indique les kilometres, et l axe Y (1) montre la vitesse, tandis que les couleurs correspondent aux zone de fréquences cardiaque (1)(Nécéssite un capteur de fréquence cardiaque Bluetooth 4.0 et un téléphone compatible)",
      _help_subtitle_5: " ",
      _help_desc_5:
        "L'axe des X (2) indique les kilometres, et l axe Y (1) montre l'altitude, tandis que les couleurs correspondent aux zone de fréquences cardiaque (1)(Nécéssite un capteur de fréquence cardiaque Bluetooth 4.0 et un téléphone compatible)",
      _help_subtitle_6: " ",
      _help_desc_6:
        "<b>1-</b> Fréquence cardiaque moyenne<br><br><b>2-</b> Graphique montrant la durée dans chaque zone cardiaque.<br><br><b>3- </b> Un tableau montrant la vitesse, l'allure et la fréquence cardiaque par kilometres.<br><br>Cliquez sur le bouton next et effectué votre première session ou importez d'anciennes sessions.",
      _previous: "Precédent",
      _next: "Suivant",
      _gps_lost: "Signal GPS non disponible",
      _gps_got: "Signal GPS disponible",
      _announce_gpslost: "Annoncer la perte du signal GPS",
      _recording_session: "Enregistrement de la session ...",
      _speed_in_mvt: "Vitesse en mvt",
      _pace_in_mvt: "Allure en mvt",
      _spm_label: "ppm",
      _power: "Power",
      _cadence: "Cadence",
      _sendlogs: "Envoyer les logs",
      _duration_interval_detail:
        "Effectuer les annonces vocales a interval de temps",
      _distance_interval_detail:
        "Effectuer les annonces vocales a interval de kilometres",
      _heartrate_max_detail:
        "Votre fréquence cardiaque sur un sprint de 4 minutes après un échauffement de 20 minutes",
      _heartrate_min_detail:
        "Votre fréquence cardiaque au repos, mesuré après le reveil.",
      _file_file_imported: "Importé avec succés",
      _file_import_title: "Import",
      _import_files: "Importer",
      _use_vocalAnnounce: "Annonces vocales",
      _edit_session: "Edition",
      _editable: "Toucher pour modifier",
      _session_name: "Nom de la session",
      _session_type: "Type de la session"
    });

    $translateProvider.translations("de-DE", {
      _language: "Sprache",
      _english: "Englisch",
      _french: "Französisch",
      _german: "Deutsch",
      _portuguese: "Portugiesisch",
      _vocal_announce: "Ansagen",
      _duration_interval: "Ansagenhäufigkeit",
      _minutes: "Minuten",
      _hours: "Stunden",
      _options: "Optionen",
      _backup_and_restore: "Sicherung und Einlesen",
      _restore: "Einlesen",
      _backup: "Sichern",
      _distance_interval: "Streckenintervall",
      _notification_slug: "ForRunners : Aufnahme Trainingseinheit ...",
      _notification_message: "Aufnahme Trainingseinheit ...",
      _go: "Start !",
      _kilometers: "Kilometer",
      _kilometers_per_hour: "Stundenkilometer",
      _and: "und",
      _seconds_per_kilometers: "Sekunden pro Kilometer",
      _confirm_delete: "Aufnahme wirklich löschen?",
      _confirm_delete_eq: "Zubehör wirklich löschen?",
      _delete_eq: "Löschen",
      _gpx_export_title: "GPX Export",
      _gpx_file_exported: "Alle Aufnahmen als GPX-Datei exportieren.",
      _backup_ok_title: "Sichern",
      _backup_ok_content: "Sicherung ins Programmverzeichniss zurückschreiben.",
      _backup_error_title: "Fehler",
      _backup_error_content: "Es ist ein Fehler beim Sichern aufgetreten.",
      _gpx_error_title: "Fehler",
      _gpx_error_content: "Die GPX Exportierung ist fehlgeschlagen.",
      _gpx_import_title: "GPX Importierung",
      _gpx_file_imported: "Alle Dateien importiert.",
      _toggle_music_on_announce: "Musik bei Ansage stummschalten",
      _announce_distance: "Streckendistanz ansagen",
      _announce_time: "Zeit ansagen",
      _announce_average_speed: "Geschwindigkeit ansagen",
      _announce_average_pace: "Durchnittsgeschwindigkeit ansagen",
      _announce_heartrate: "Herzfrequenz ansagen",
      _delay_start: "Startverzögerung von 10 Sekunden",
      _export_as_gpx: "Exportiere als GPX",
      _import_gpxs: "Importiere eine GPX-Datei",
      _debug_tools: "Debug Werkzeug",
      _debug_mode: "Debug Modus",
      _settings: "Einstellungen",
      _debug_test_vocal: "Testansage",
      _average: "Durchschnitt",
      _records: "Aufnahmen",
      _speed_kph: "Geschwindigkeit (km/h)",
      _duration_minutes: "Dauer (Minuten)",
      _altitude_meters: "Höhe (Meter)",
      _time: "Zeit",
      _distance: "Strecke",
      _speed: "Geschwindigkeit",
      _pace: "Tempo",
      _debug_warning: "Debug Modus verlangsamt die Anwendung",
      _run_fast: "Schneller Laufen !",
      _run_slow: "Langsamer Laufen !",
      enUS: "Englisch",
      frFR: "Französisch",
      deDE: "Deutsch",
      deAT: "Deutsch (Österreich)",
      ptPT: "Portugiesisch",
      _privacy_policy_text:
        "ForRunners versendet keine Daten vom Gerät, außer für den Service von Openstreet.net oder im Debug Modus. Dann werden die Fehler und Debug-Nachrichten an meinen eigenen Server gesendet.",
      _short_description: "Eine GPS-Tracking-Anwendung für Läufer.",
      _use_open_source_text:
        "ForRunners benutzt Teile von Bibliotheken der folgenden Open Source Projekte",
      _by: "von",
      _swipe_left: "Wische nach links zum Stoppen",
      _stop: "Stop",
      _elevationUp: "Rauf",
      _elevationDown: "Runter",
      _sessions: "Sitzung",
      _about: "Über",
      _speed_maximum: "Maximum",
      _speed_average: "Durchschnitt",
      _up: "Höher",
      _down: "Tiefer",
      _km: "Km",
      _distk: "Type",
      _duration: "Zeit",
      _best_records: "Beste",
      _average_records: "Durchschnitt",
      _fraction: "Intervalltraining",
      _duration_slow_interval: "Langsamer Intervall",
      _duration_fast_interval: "Schneller Intervall",
      _welcome_text:
        "Es sieht so aus als ob du ForRunners zum ersten mal startest. Du kannst eine Aufnahme mit dem Plus-Zeichen unten starten oder eine GPX-Datei von älteren Sitzungen importieren.",
      _announce_fraction: "Intervallansage",
      _empty_records_text:
        "Zurzeit keine existierende Aufnahmen, es gibt keinen Rekord zu schlagen",
      _open_source_content: "Open Source Inhalte",
      _bpm: "Herzfrequenz",
      _bpms_label: "bpms",
      _vocal_bpms_label: "Schläge pro Minute",
      _donation:
        "Wenn du willst, dass die App weiter entwickelt wird oder du dich Bedanken willst, sende Bitcoins an:",
      _keep_screen_on: "Display nicht abschalten",
      _hr_zone0: "Zurücksetzen",
      _hr_zone1: "Stoffwechsel",
      _hr_zone2: "Aeoribische Kraft",
      _hr_zone3: "Ausdauer",
      _hr_zone4: "Schnellster Sprint",
      _heartRate: "Herzfrequenz",
      _heartrate_max: "Höchste Herzfrequenz",
      _heartrate_min: "Niedrigste Herzfrequenz",
      _heartrate_label: "Bpm",
      _bluetooth_devices: "Bluetooth Gerät",
      _scan_ble: "Suche Gerät",
      _help: "Hilfe",
      _report_issue: "Report-Ausgabe nach GitHub",
      _gps_accuracy: "GPS Genauigkeit:",
      _delete: "Löschen",
      _overnote: "Ergebnis",
      _total: "Total:",
      _score: "Ergebnis:",
      _restore_ok_content: "Backup wiederhergestellt",
      _restore_ok_title: "Wiederherstellung",
      _use_google_elevation_api: "Nutze Google Elevation API",
      _speed_vs_altitude: "Geschwindigkeit über die Höhe",
      _speed_vs_heartrate: "Geschwindigkeit über die Herzfrequenz",
      _altitude_vs_heartrate: "Höhe über die Herzfrequenz",
      _help_subtitle_1:
        "Willkommen bei ForRunners ! Diese kleine Übersicht beschreibt das Konzept von ForRunners. Benutze die Vor und Zurück Schaltflächen um in der Hilfe zu blättern.",
      _help_desc_1:
        "Der Hauptbildschirm zeigt alle erzeugten Läufe. <br><br><b>1-</b> Dieser Knopf startet einen neuen Lauf<br><br><b>2-</b> Durchschnitt aller Läufe<br><br><b>3-</b> Deine Laufrekorde<br><br><b>4-</b> Gerundete Strecken aller Läufe<br><br><b>5-</b> Eine Punktzahl über den Schwierigkeitsgrad des Laufs<br><br><b>6-</b> Ein Diagramm, welches die Entwicklung der Ergebnisse und der Dauer anzeigt",
      _help_subtitle_2:
        "Das ist die Detailansicht einer Aufzeichnung, sie zeigt den Lauf auf einer Karte inklusive Statistiken und Grafiken an.",
      _help_desc_2:
        "<b>1-</b> Die OpenStreetMap Karte zeigt deinen Lauf<br><br><b>2-</b> Die blauen Markierungen zeigen die Kilometer an, die grüne Markierung ist der Startpunkt und die rote Markierung ist der Zielpunkt<br><br><b>3-</b> Mit diesem Icon teilst du deinen Lauf<br><br><b>4-</b> Dieses Icon löscht den aktuellen Lauf<br><br><b>5-</b> Datum und Uhrzeit des Laufs.",
      _help_desc_3:
        "<b>1-</b> Datum und Uhrzeit des Laufs<br><br><b>2-</b> Höchstes Tempo<br><br><b>3-</b> Durchschnittsgeschwindigkeit<br><br><b>4-</b> Distanz<br><br><b>5-</b> Gesamtzeit hh:mm<br><br><b>6-</b> Höhenunterschied Aufwärts in Meter<br><br><b>7-</b> Höhenunterschied Abwärts in Meter<br><br><b>8-</b> Wetterbedingungen beim Lauf<br><br><b>9-</b> Ergebnis, Zeit, Distanz, Tempo<br><br>",
      _help_subtitle_3: " ",
      _help_subtitle_4: " ",
      _help_desc_4:
        "Die X-Achse (2) zeigt die Kilometer, die Y-Achse (3) zeigt die Geschwindigkeit und die Farben (1) zeigen die Herzfrequenz-Zonen (benötigt einen kompatiblen Bluetooth-Herzfrequenz-Messer)",
      _help_subtitle_5: " ",
      _help_desc_5:
        "Die X-Achse (2) zeigt die Kilometer, die Y-Achse (3) zeigt die Höhenmeter, und die Farben (1) zeigen die Herzfrequenz-Zonen (benötigt einen kompatiblen Bluetooth-Herzfrequenz-Messer)",
      _help_subtitle_6: " ",
      _help_desc_6:
        "<b>1-</b> Durchschnittliche Herzfrequenz des Laufs <br><br><b>2-</b> Tabelle mit Distanz, Ergebnis, Geschwindigkeit und Herzfrequenz.<br><br><b>3- </b> Die Grafik zeigt die Dauer der Herzfrequenz-Zonen des Laufs.<br><br>Und jetzt drücke Start für deinen ersten Lauf oder Importiere ältere Läufe in den -Einstellungen-",
      _previous: "Zurück",
      _next: "Vor",
      _gps_lost: "GPS Signal verloren",
      _gps_got: "GPS Signal erkannt",
      _announce_gpslost: "Ansage bei GPS Signalverlust ",
      _recording_session: "Laufaufzeichnung ...",
      _speed_in_mvt: "Ändere Geschwindigkeit",
      _pace_in_mvt: "Ändere Tempo",
      _spm_label: "spm",
      _power: "Kraft",
      _cadence: "Rythmus",
      _sendlogs: "Sende Logdateien",
      _equipments: "Equipments",
      _add_equipment: "Füge Equipment hinzu",
      _duration_interval_detail: "Ansagen in Zeitintervallen (in Minuten)",
      _distance_interval_detail: "Ansagen nach Distanzen (in Kilometer)",
      _heartrate_min_detail: "Deine Herzfrequenz im Ruhezustand",
      _heartrate_max_detail:
        "Deine maximale Herzfrequenz nach 4 Minuten Sprint oder nach 20 Minuten Aufwärmtraining.",
      _file_file_imported: "Erfolgreich importiert",
      _file_import_title: "Einführen",
      _import_files: "Einführen",
      _use_vocalAnnounce: "Sprachansagen",
      _edit_session: "Ausgabe",
      _editable: "Berühren Sie, um zu ändern",
      _session_name: "_session_name",
      _session_type: "_session_type"
    });

    $translateProvider.translations("de-AT", {
      _language: "Sprache",
      _english: "Englisch",
      _french: "Französisch",
      _german: "Deutsch",
      _portuguese: "Portugiesisch",
      _vocal_announce: "Ansagen",
      _duration_interval: "Ansagenhäufigkeit",
      _minutes: "Minuten",
      _hours: "Stunden",
      _options: "Optionen",
      _backup_and_restore: "Sicherung und Einlesen",
      _restore: "Einlesen",
      _backup: "Sichern",
      _distance_interval: "Streckenintervall",
      _notification_slug: "ForRunners : Aufnahme Trainingseinheit ...",
      _notification_message: "Aufnahme Trainingseinheit ...",
      _go: "Start !",
      _kilometers: "Kilometer",
      _kilometers_per_hour: "Stundenkilometer",
      _and: "und",
      _seconds_per_kilometers: "Sekunden pro Kilometer",
      _confirm_delete: "Aufnahme wirklich löschen?",
      _confirm_delete_eq: "Zubehör wirklich löschen?",
      _delete_eq: "Löschen",
      _gpx_export_title: "GPX Export",
      _gpx_file_exported: "Alle Aufnahmen als GPX-Datei exportieren.",
      _backup_ok_title: "Sichern",
      _backup_ok_content: "Sicherung ins Programmverzeichniss zurückschreiben.",
      _backup_error_title: "Fehler",
      _backup_error_content: "Es ist ein Fehler beim Sichern aufgetreten.",
      _gpx_error_title: "Fehler",
      _gpx_error_content: "Die GPX Exportierung ist fehlgeschlagen.",
      _gpx_import_title: "GPX Importierung",
      _gpx_file_imported: "Alle Dateien importiert.",
      _toggle_music_on_announce: "Musik bei Ansage stummschalten",
      _announce_distance: "Streckendistanz ansagen",
      _announce_time: "Zeit ansagen",
      _announce_average_speed: "Geschwindigkeit ansagen",
      _announce_average_pace: "Durchnittsgeschwindigkeit ansagen",
      _announce_heartrate: "Herzfrequenz ansagen",
      _delay_start: "Startverzögerung von 10 Sekunden",
      _export_as_gpx: "Exportiere als GPX",
      _import_gpxs: "Importiere eine GPX-Datei",
      _debug_tools: "Debug Werkzeug",
      _debug_mode: "Debug Modus",
      _settings: "Einstellungen",
      _debug_test_vocal: "Testansage",
      _average: "Durchschnitt",
      _records: "Aufnahmen",
      _speed_kph: "Geschwindigkeit (km/h)",
      _duration_minutes: "Dauer (Minuten)",
      _altitude_meters: "Höhe (Meter)",
      _time: "Zeit",
      _distance: "Strecke",
      _speed: "Geschwindigkeit",
      _pace: "Tempo",
      _debug_warning: "Debug Modus verlangsamt die Anwendung",
      _run_fast: "Schneller Laufen !",
      _run_slow: "Langsamer Laufen !",
      enUS: "Englisch",
      frFR: "Französisch",
      deDE: "Deutsch",
      deAT: "Deutsch (Österreich)",
      ptPT: "Portugiesisch",
      _privacy_policy_text:
        "ForRunners versendet keine Daten vom Gerät, außer für den Service von Openstreet.net oder im Debug Modus. Dann werden die Fehler und Debug-Nachrichten an meinen eigenen Server gesendet.",
      _short_description: "Eine GPS-Tracking-Anwendung für Läufer.",
      _use_open_source_text:
        "ForRunners benutzt Teile von Bibliotheken der folgenden Open Source Projekte",
      _by: "von",
      _swipe_left: "Wische nach links zum Stoppen",
      _stop: "Stop",
      _elevationUp: "Rauf",
      _elevationDown: "Runter",
      _sessions: "Sitzung",
      _about: "Über",
      _speed_maximum: "Maximum",
      _speed_average: "Durchschnitt",
      _up: "Höher",
      _down: "Tiefer",
      _km: "Km",
      _distk: "Type",
      _duration: "Zeit",
      _best_records: "Beste",
      _average_records: "Durchschnitt",
      _fraction: "Intervalltraining",
      _duration_slow_interval: "Langsamer Intervall",
      _duration_fast_interval: "Schneller Intervall",
      _welcome_text:
        "Es sieht so aus als ob du ForRunners zum ersten mal startest. Du kannst eine Aufnahme mit dem Plus-Zeichen unten starten oder eine GPX-Datei von älteren Sitzungen importieren.",
      _announce_fraction: "Intervallansage",
      _empty_records_text:
        "Zurzeit keine existierende Aufnahmen, es gibt keinen Rekord zu schlagen",
      _open_source_content: "Open Source Inhalte",
      _bpm: "Herzfrequenz",
      _bpms_label: "bpms",
      _vocal_bpms_label: "Schläge pro Minute",
      _donation:
        "Wenn du willst, dass die App weiter entwickelt wird oder du dich Bedanken willst, sende Bitcoins an:",
      _keep_screen_on: "Display nicht abschalten",
      _hr_zone0: "Zurücksetzen",
      _hr_zone1: "Stoffwechsel",
      _hr_zone2: "Aeoribische Kraft",
      _hr_zone3: "Ausdauer",
      _hr_zone4: "Schnellster Sprint",
      _heartRate: "Herzfrequenz",
      _heartrate_max: "Höchste Herzfrequenz",
      _heartrate_min: "Niedrigste Herzfrequenz",
      _heartrate_label: "Bpm",
      _bluetooth_devices: "Bluetooth Gerät",
      _scan_ble: "Suche Gerät",
      _help: "Hilfe",
      _report_issue: "Report-Ausgabe nach GitHub",
      _gps_accuracy: "GPS Genauigkeit:",
      _delete: "Löschen",
      _overnote: "Ergebnis",
      _total: "Total:",
      _score: "Ergebnis:",
      _restore_ok_content: "Backup wiederhergestellt",
      _restore_ok_title: "Wiederherstellung",
      _use_google_elevation_api: "Nutze Google Elevation API",
      _speed_vs_altitude: "Geschwindigkeit über die Höhe",
      _speed_vs_heartrate: "Geschwindigkeit über die Herzfrequenz",
      _altitude_vs_heartrate: "Höhe über die Herzfrequenz",
      _help_subtitle_1:
        "Willkommen bei ForRunners ! Diese kleine Übersicht beschreibt das Konzept von ForRunners. Benutze die Vor und Zurück Schaltflächen um in der Hilfe zu blättern.",
      _help_desc_1:
        "Der Hauptbildschirm zeigt alle erzeugten Läufe. <br><br><b>1-</b> Dieser Knopf startet einen neuen Lauf<br><br><b>2-</b> Durchschnitt aller Läufe<br><br><b>3-</b> Deine Laufrekorde<br><br><b>4-</b> Gerundete Strecken aller Läufe<br><br><b>5-</b> Eine Punktzahl über den Schwierigkeitsgrad des Laufs<br><br><b>6-</b> Ein Diagramm, welches die Entwicklung der Ergebnisse und der Dauer anzeigt",
      _help_subtitle_2:
        "Das ist die Detailansicht einer Aufzeichnung, sie zeigt den Lauf auf einer Karte inklusive Statistiken und Grafiken an.",
      _help_desc_2:
        "<b>1-</b> Die OpenStreetMap Karte zeigt deinen Lauf<br><br><b>2-</b> Die blauen Markierungen zeigen die Kilometer an, die grüne Markierung ist der Startpunkt und die rote Markierung ist der Zielpunkt<br><br><b>3-</b> Mit diesem Icon teilst du deinen Lauf<br><br><b>4-</b> Dieses Icon löscht den aktuellen Lauf<br><br><b>5-</b> Datum und Uhrzeit des Laufs.",
      _help_desc_3:
        "<b>1-</b> Datum und Uhrzeit des Laufs<br><br><b>2-</b> Höchstes Tempo<br><br><b>3-</b> Durchschnittsgeschwindigkeit<br><br><b>4-</b> Distanz<br><br><b>5-</b> Gesamtzeit hh:mm<br><br><b>6-</b> Höhenunterschied Aufwärts in Meter<br><br><b>7-</b> Höhenunterschied Abwärts in Meter<br><br><b>8-</b> Wetterbedingungen beim Lauf<br><br><b>9-</b> Ergebnis, Zeit, Distanz, Tempo<br><br>",
      _help_subtitle_3: " ",
      _help_subtitle_4: " ",
      _help_desc_4:
        "Die X-Achse (2) zeigt die Kilometer, die Y-Achse (3) zeigt die Geschwindigkeit und die Farben (1) zeigen die Herzfrequenz-Zonen (benötigt einen kompatiblen Bluetooth-Herzfrequenz-Messer)",
      _help_subtitle_5: " ",
      _help_desc_5:
        "Die X-Achse (2) zeigt die Kilometer, die Y-Achse (3) zeigt die Höhenmeter, und die Farben (1) zeigen die Herzfrequenz-Zonen (benötigt einen kompatiblen Bluetooth-Herzfrequenz-Messer)",
      _help_subtitle_6: " ",
      _help_desc_6:
        "<b>1-</b> Durchschnittliche Herzfrequenz des Laufs <br><br><b>2-</b> Tabelle mit Distanz, Ergebnis, Geschwindigkeit und Herzfrequenz.<br><br><b>3- </b> Die Grafik zeigt die Dauer der Herzfrequenz-Zonen des Laufs.<br><br>Und jetzt drücke Start für deinen ersten Lauf oder Importiere ältere Läufe in den -Einstellungen-",
      _previous: "Zurück",
      _next: "Vor",
      _gps_lost: "GPS Signal verloren",
      _gps_got: "GPS Signal erkannt",
      _announce_gpslost: "Ansage bei GPS Signalverlust ",
      _recording_session: "Laufaufzeichnung ...",
      _speed_in_mvt: "Ändere Geschwindigkeit",
      _pace_in_mvt: "Ändere Tempo",
      _spm_label: "spm",
      _power: "Kraft",
      _cadence: "Rythmus",
      _sendlogs: "Sende Logdateien",
      _equipments: "Equipments",
      _add_equipment: "Füge Equipment hinzu",
      _duration_interval_detail: "Ansagen in Zeitintervallen (in Minuten)",
      _distance_interval_detail: "Ansagen nach Distanzen (in Kilometer)",
      _heartrate_min_detail: "Deine Herzfrequenz im Ruhezustand",
      _heartrate_max_detail:
        "Deine maximale Herzfrequenz nach 4 Minuten Sprint oder nach 20 Minuten Aufwärmtraining.",
      _file_file_imported: "Erfolgreich importiert",
      _file_import_title: "Einführen",
      _import_files: "Einführen",
      _use_vocalAnnounce: "Gesangsansagen",
      _edit_session: "Ausgabe",
      _editable: "Berühren Sie, um zu ändern",
      _session_name: "_session_name",
      _session_type: "_session_type"
    });

    $translateProvider.translations("pt-pt", {
      _language: "Lingua",
      _english: "Inglês",
      _french: "Francês",
      _german: "Alemão",
      _portuguese: "Português",
      _vocal_announce: "Anuncios vocais",
      _duration_interval: "Intervalo da duração",
      _minutes: "minutos",
      _hours: "horas",
      _options: "Opções",
      _backup_and_restore: "Cópia de segurança e restaurar",
      _restore: "Restaurar",
      _backup: "Cópia de segurança",
      _distance_interval: "Intervalo de distançia",
      _notification_slug: "ForRunners : A gravar a sessão ...",
      _notification_message: "Guardar a sessão...",
      _go: "Vai !",
      _kilometers: "Kilômetros",
      _kilometers_per_hour: "Kilômetros por hora",
      _and: "e",
      _seconds_per_kilometers: "Segundos por Kilômetros",
      _confirm_delete: "Tem a certeza que deseja apagar esta sessão?",
      _confirm_delete_eq: "Tem a certeza que deseja apagar estes equipamento?",
      _delete_eq: "Apagar",
      _gpx_export_title: "Exportar GPX",
      _gpx_file_exported: "Todas as sessões exportadas em ficheiros GPX.",
      _backup_ok_title: "Cópia de segurança OK",
      _backup_ok_content:
        "Cópia de segurança disponivel na pasta de dados da applicação.",
      _backup_error_title: "Erro",
      _backup_error_content:
        "Um erro ocorreu aquando da criação da Cópia de segurança.",
      _gpx_error_title: "Erro",
      _gpx_error_content: "Exportação do GPX falhou.",
      _gpx_import_title: "Importar GPX",
      _gpx_file_imported: "Todos os ficheiros foram importados.",
      _toggle_music_on_announce: "Anunciar mudança de musica",
      _announce_distance: "Aviso da distância",
      _announce_time: "Aviso de tempo",
      _announce_average_speed: "Aviso da velocidade media",
      _announce_average_pace: "Aviso do ritmo médio",
      _announce_heartrate: "Aviso de batimento cardiaco",
      _delay_start: "Atrazar começo em 10 segundos",
      _export_as_gpx: "Exportar como GPX",
      _import_gpxs: "Importar ficheiros GPX",
      _debug_tools: "Ferramentas de depuração",
      _debug_mode: "Modo de depuração",
      _settings: "Definições",
      _debug_test_vocal: "Testar avisos vocais",
      _average: "Média",
      _records: "Registos",
      _speed_kph: "Velocidade (Kmh)",
      _duration_minutes: "Duração (minutos)",
      _altitude_meters: "Altitude (metros)",
      _time: "Tempo",
      _distance: "Distancia",
      _speed: "Velocidade",
      _pace: "Ritmo",
      _debug_warning: "Modo de depuração atrasa a aplicação severamente",
      _run_fast: "Corre mais rapido !",
      _run_slow: "Corre mais lento !",
      enUS: "Inglês",
      frFR: "Francês",
      deDE: "Alemão",
      deAT: "Alemão (Austria)",
      ptPT: "Português",
      _privacy_policy_text:
        'ForRunners não comunica nenhuma informação para fora do seu dispositivo, exceto para obter mapas de serviços em  "Openstreet.net" e se você ativar o modo de depuração. Neste último caso, qualquer erro e mensagem de depuração serão enviados para o meu servidor para despiste. ',
      _short_description: "Aplicação de tracking GPS dedicada a corredores.",
      _use_open_source_text:
        "ForRunners usa partes ou livrarias dos seguintes projetos fonte-aberta",
      _by: "Por",
      _swipe_left: "Deslizar para a esquerda para Parar",
      _stop: "Parar",
      _elevationUp: "Subir",
      _elevationDown: "Descer",
      _sessions: "Sessões",
      _about: "Sobre",
      _speed_maximum: "Maximo",
      _speed_average: "Média",
      _up: "Subir",
      _down: "Descer",
      _km: "Km",
      _distk: "Tipo",
      _duration: "Tempo",
      _best_records: "Melhor",
      _average_records: "Média",
      _fraction: "Intervalo de treino",
      _duration_slow_interval: "Intervalo lento",
      _duration_fast_interval: "Intervalo rapido",
      _welcome_text:
        "Parece que é a primeira vez que você usa ForRunners. Pode começar a gravar sua execução com o botão abaixo ou importando uma sessão de execução mais antiga a partir de arquivos GPX nas configurações.",
      _announce_fraction: "Aviso de intervalo",
      _empty_records_text:
        "Não tem nenhuma sessão de corrida gravada, ainda não tem nenhum registo para derrotar.",
      _open_source_content: "Conteudo Fonte-Aberta",
      _bpm: "Batimento cardiaco",
      _bpms_label: "bpms",
      _vocal_bpms_label: "Batimentos por minutos",
      _donation:
        "Se quer ver esta aplicação evoluir ou apenas agradecer-me, pode fazer uma doação em bitcoin:",
      _keep_screen_on: "Manter o ecrã activo no decorrer da sessão",
      _hr_zone0: "Recuperação",
      _hr_zone1: "Metabolismo gordo",
      _hr_zone2: "Poder aerobico",
      _hr_zone3: "Velocidade e Resistençia",
      _hr_zone4: "Sprint Maximo",
      _heartRate: "Batimento cardiaco",
      _heartrate_max: "Frequencia de Batimento cardiaco maxima",
      _heartrate_min: "Frequencia de Batimento cardiaco em descanço",
      _heartrate_label: "Bpm",
      _bluetooth_devices: "Dispositivos Bluetooth",
      _scan_ble: "Procurar Dispositivos",
      _help: "Ajuda",
      _report_issue: "Reportar problema no GitHub",
      _gps_accuracy: "Precisão GPS :",
      _delete: "Apagar",
      _overnote: "Pontuações",
      _total: "Total:",
      _score: "Pontuação:",
      _restore_ok_content: "Copia de segurança restaurada",
      _restore_ok_title: "Restaurar",
      _use_google_elevation_api: "Usar API Google Elevation",
      _speed_vs_altitude: "Velocidade VS Altitude",
      _speed_vs_heartrate: "Velocidade VS Batimento cardiaco",
      _altitude_vs_heartrate: "Altitude VS Batimento cardiaco",
      _help_subtitle_1:
        "Bem-vindo ao ForeRunners! Essa pequena ajuda tentará explicar o conceito principal de ForeRunners. Use o botão seguinte e anterior abaixo para navegar nesta ajuda.",
      _help_desc_1:
        "Este é o ecrã principal apresenta todas as suas sessões de corrida. <br> <br> <b> 1 - </ b> Este botão inicia uma nova sessão de corrida. <br> <br> <b> 2 - </ b> As estatísticas médias são calculadas a partir de todas as sessões <br> <br> <b> 3 - </ b> Os seus melhores registos de corrida <br> <br> <b> 4 - </ b> Aarredondamento do comprimento da sessão <br> <br> <b> 5 - </ b> A pontuação representa a dificuldade da sua corrida <br> <br> <b> 6 - </ b> Um gráfico que mostra a evolução da pontuação e a evolução da duração",
      _help_subtitle_2:
        "Este é o detalhe de uma sessão, mostra todas as corridas no mapa, com graficos e estatisticas detalhadas.",
      _help_desc_2:
        '<b> 1 - </ b> O mapa OpenStreetMap, mostra a sua corrida <br> <br> <b> 2 - </ b> O marcador azul é um marcador de Kilometragem, enquanto o marcador verde "S" é para "Iniciar" e marcador vermelho "E" para "Terminar" <br> <br> <b> 3 - </ b> Este ícone é para compartilhar a sua corrida <br> <br> <b> 4 - </ b> Este ícone é para excluir a sua sessão <br> <br> <b> 5 - </ b> Data da sua sessão de corrida com o resumo de valores.',
      _help_desc_3:
        "<b> 1 - </ b> Data <br> <br> <b> 2 - </ b> Velocidade média <br> <br> <b> 3 - </ b> Ritmo médio <br> <br> <b> 4 - </ b> Distância <br> <br> <b> 5 - </ b> Duração hh: mm <br> <br> <b> 6 - </ b> Elevação total em metros <br > <br> <b> 7 - </ b> Elevação minima em metros <br> <br> <b> 8 - </ b> Tempo na data da corrida <br> <br> <b> 9- </ b> Pontuação, duração, distância, ritmo <br> <br>",
      _help_subtitle_3: " ",
      _help_subtitle_4: " ",
      _help_desc_4:
        "O eixo X (2) mostra os Kilômetros e o eixo y (3) mostra a velocidade, enquanto as cores (1) mostram a zona do batimento cardiaco (Exige um sensor corporal bluetooth e um smartphone compatível)",
      _help_subtitle_5: " ",
      _help_desc_5:
        "O eixo X (2) mostra os Kilômetros e o eixo y (3) mostra altitude, enquanto as cores (1) mostram a zona do batimento cardiaco (Exige um sensor corporal bluetooth e um smartphone compatível)",
      _help_subtitle_6: " ",
      _help_desc_6:
        "<b> 1 - </ b> Freqüência cardíaca média durante a sessão <br> <br> <b> 2 - </ b> Gráfico que mostra a duração em cada zona de frequencia cardiaca <br> <br> <b> 3- < / b> Tabela com ritmo, velocidade e frequencia cardiaca por Kilometros. <br> <br> Agora clique em seguida e comece sua primeira sessão em execução ou importe as sessões anteriores das preferências.",
      _previous: "Anterior",
      _next: "Seguinte",
      _gps_lost: "Sinal de GPS perdido",
      _gps_got: "Sinal de GPS recuperado",
      _announce_gpslost: "Aviso quando o sinal de GPS for perdido",
      _recording_session: "Gravando a sessão ...",
      _speed_in_mvt: "Velocidade de movimento",
      _pace_in_mvt: "Passo em movimento",
      _spm_label: "spm",
      _power: "Poder",
      _cadence: "Taxa de passo",
      _sendlogs: "Enviar logs",
      _equipments: "Equipamentos",
      _add_equipment: "Addicionar um equipamento",
      _duration_interval_detail: "Anuncie informações em intervalos regulares",
      _distance_interval_detail:
        "Anuncie informações em intervalos de Kilometros",
      _heartrate_min_detail: "O seu batimento cardiaco após acordar",
      _heartrate_max_detail:
        "O seu batimento cardiaco maximo num sprint de 4 minutos após um aquecimento de 20 minutos.",
      _session_name: "_session_name",
      _session_type: "_session_type"
    });

    $translateProvider.preferredLanguage("en-US");
    $translateProvider.fallbackLanguage("en-US");
  });
