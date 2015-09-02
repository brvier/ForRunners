#!/bin/bash
ionic build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore google-store.keystore ~/ownCloud/Projects/RulesPasswords/platforms/android/build/outputs/apk/android-release-unsigned.apk RulesPasswords
rm rulespasswords.apk
~/Android/Sdk/build-tools/21.1.2/zipalign -v 4 ~/ownCloud/Projects/RulesPasswords/platforms/android/build/outputs/apk/android-release-unsigned.apk rulespasswords.apk
