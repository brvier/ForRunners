#!/bin/bash

# Android
ionic build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore google-store.keystore ~/Projects/ForRunners/platforms/android/build/outputs/apk/android-release-unsigned.apk ForRunners
rm net.khertan.forrunners.apk
~/bin/android-sdk-linux/build-tools/21.1.2/zipalign -v 4 ./platforms/android/build/outputs/apk/android-release-unsigned.apk net.khertan.forrunners.apk

# FirefoxOS
cordova prepare
ionic build --release firefoxos
