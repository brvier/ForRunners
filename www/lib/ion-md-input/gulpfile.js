var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var tag_version = require('gulp-tag-version');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');


gulp.task('default', ['sass', 'js']);
gulp.task('build', ['sass', 'js']);

gulp.task('sass', function(done) {
  gulp.src('./ion-md-input.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./css/'))
    .on('end', done);
});

gulp.task('js', function() {
  return gulp.src('./ion-md-input.js')
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./js'))

  .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./js'))
});

function inc(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json', './bower.json'])
    // bump the version number in those files
    .pipe(bump({
      type: importance
    }))
    // save it back to filesystem
    .pipe(gulp.dest('./'))
    // commit the changed version number
    .pipe(git.commit('bumps package version'))

  // read only one file to get the version number
  .pipe(filter('package.json'))
    // **tag it in the repository**
    .pipe(tag_version());
}

gulp.task('patch', function() {
  return inc('patch');
});
gulp.task('minor', function() {
  return inc('minor');
});
gulp.task('major', function() {
  return inc('major');
});
