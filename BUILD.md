# Build Instructions

## Android

All commands are executed in the root directory of this repo unless otherwise stated.

* Follow the [Cordova install platform Guide for
  Android](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)

  Or instead pull an appropriate [docker image](https://hub.docker.com/). For
  instance [beevelop/cordova](https://github.com/beevelop/docker-cordova):

  ```
  docker pull beevelop/cordova:latest
  ```

  You can then run docker in the ForRunners directory interactively:

  ```
  docker run -it --privileged -v /dev/bus/usb:/dev/bus/usb -v $PWD:/tmp beevelop/cordova /bin/bash
  ```

* Select the platform and version you want to build for (your target
  device). It is advisable to check if all requirements for the specified
  platform are met.

  ```
  cordova platform add android@~7.0.0
  cordova requirements
  ```

  This installs the cordova plugins needed for this platform.

* Build the app for Android.

  ```
  cordova build android
  ```

* Run on an Android device.

  ```
  cordova run android
  ```

  Be sure the debugging mode of your phone is enabled and no other adb servers
  are running. Your phone should be listed in `adb devices`.

  You may also need to uninstall the old version first.
