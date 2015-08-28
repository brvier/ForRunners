#!/bin/sh

ionic plugin rm org.apache.cordova.console
ionic build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore google-store.keystore ~/Projects/ForRunners/platforms/android/build/outputs/apk/android-release-unsigned.apk ForRunners
rm -f forrunners.apk
~/Android/Sdk/build-tools/21.1.2/zipalign -v 4 ~/Projects/ForRunners/platforms/android/build/outputs/apk/android-release-unsigned.apk forrunners.apk
