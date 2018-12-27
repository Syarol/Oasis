/**
	* Dependencies
**/

var gulp = require('gulp');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

/**
	* Constant
**/

const BROWSER_SYNC_RELOAD_DELAY = 500;

/**
	* Tasks
**/

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
		]
  })
    .on('start', function onStart() {
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

function initBrowserSync() {
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: 4000,
    online: true,
    tunnel: true
  });
}

//minify CSS files
function minifyCSS() {
  return gulp.src('./app/public/css/*.css')
    .pipe(csso())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./app/public/css/min/'))
    .pipe(browserSync.reload({
      stream: true
    }))
}

//watches files for changes
function watchAll(){
	gulp.watch('./app/public/css/*.css', minifyCSS);
}

/**
	* Tasks export
**/

exports.default = gulp.series(
	minifyCSS,
	gulp.parallel(
		initBrowserSync,
		nodemon,
		watchAll
	)
)
