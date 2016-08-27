var gulp = require('gulp');
var eslint = require('gulp-eslint');
var cache = require('gulp-cached');
var babel = require('gulp-babel');
var tape = require('gulp-tape');
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var remember = require('gulp-remember');
var rename = require("gulp-rename");
var ngAnnotate = require('gulp-ng-annotate');
var series = require('stream-series');
var tapColorize = require('tap-colorize');

var path = {
  server: 'nodeserver/**/*.{js,json}',
  scripts: 'public_src/scripts/**/*.js',
  externalScripts: require('./externalScripts.json'),
  mainStyle: 'public_src/styles/main.less',
  styles: 'public_src/styles/**/*.less',
  tests: 'tests/**/*.js'
};

/**
 * add build tasks
 */

gulp.task('build:js', function() {
  var prepareSrc = gulp.src(path.scripts)
    .pipe(cache('scripts'))
    .pipe(eslint({
      quiet: true,
      configFile: '.eslintrc.js'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(remember('scripts'));

  var prepareLib = gulp.src(path.externalScripts)
    .pipe(cache('externalScripts'))
    .pipe(uglify())
    .pipe(remember('externalScripts'));

  return series(prepareLib, prepareSrc)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('build:less', function() {
  return gulp.src(path.mainStyle)
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(rename('app.css'))
    .pipe(gulp.dest('public/styles'));
});

/**
 * add linter tasks
 */

gulp.task('eslint:server', function() {
  return gulp.src(path.server)
    .pipe(eslint({
      quiet: true,
      configFile: '.eslintrc.js'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/**
 * add watch tasks
 */

function addWatchTask(name, path, tasks, autoClean) {
  gulp.task(name, function() {
    var watcher = gulp.watch(path, gulp.parallel.apply(null, tasks));

    if (autoClean) {
      watcher.on('change', function (event) {
        if (event.type === 'deleted') {
          delete cache.caches['scripts'][event.path];
          remember.forget('scripts', event.path);
        }
      });
    }

    return watcher;
  });
}

addWatchTask('watch:server', path.server, ['eslint:server']);
addWatchTask('watch:scripts', path.scripts, ['build:js'], true);
addWatchTask('watch:externalScripts', path.externalScripts, ['build:js'], true);
addWatchTask('watch:styles', path.styles, ['build:less']);

/**
 * add test tasks
 */

gulp.task('test:backend', function() {
  return gulp.src(path.tests)
    .pipe(tape({
      reporter: tapColorize()
    }));
});

/**
 * add general tasks
 */

gulp.task('watch', gulp.parallel('watch:scripts', 'watch:externalScripts', 'watch:styles', 'watch:server'));
gulp.task('build', gulp.parallel('build:js', 'build:less'));
gulp.task('test', gulp.parallel('test:backend'));
