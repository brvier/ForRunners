#!/bin/bash
ionic build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore google-store.keystore ~/Projects/ForRunners/platforms/android/build/outputs/apk/android-release-unsigned.apk ForRunners
rm net.khertan.forrunners.apk
~/Android/Sdk/build-tools/21.1.2/zipalign -v 4 ~/Projects/ForRunners/platforms/android/build/outputs/apk/android-release-unsigned.apk net.khertan.forrunners.apk
