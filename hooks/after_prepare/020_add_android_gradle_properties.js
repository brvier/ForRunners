#!/usr/bin/env node

// this plugin add a gradle.properties file

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

var target = "stage";
if (process.env.TARGET) {
    target = process.env.TARGET;
}

if (rootdir) {
    var filepath = path.join(rootdir, "platforms", "android", "gradle.properties");
    //var configobj = JSON.parse(fs.readFileSync(ourconfigfile, 'utf8'));

    // CONFIGURE HERE
    // with the names of the files that contain tokens you want
    // replaced.  Replace files that have been copied via the prepare step.
    //var filestoreplace = [
        // android
    //    "platforms/android/assets/www/index.html",
        // ios
    //    "platforms/ios/www/index.html",
    //];

    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, "android.useDeprecatedNdk=true\n", 'utf8');
    }

}
