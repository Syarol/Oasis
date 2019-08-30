/**
	* Dependencies
**/

var gulp = require('gulp');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
//var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');

/**
	* Constant
**/

//const BROWSER_SYNC_RELOAD_DELAY = 500;


/**
 * Paths
**/

const cssBundles = './app/public/css/bundles/';

const variablesCSS = './app/public/assets/css/variables.css';
const headerCSS = './app/public/assets/css/header.css';
const footerCSS = './app/public/assets/css/footer.css';
const carouselCSS = './app/public/assets/css/carousel.css';
const cartModalCSS = './app/public/assets/css/cart-modal.css';
const contactModalCSS = './app/public/assets/css/contact-modal.css';

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
    /*.on('restart', function onRestart() {
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });*/
});

/*function initBrowserSync() {
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: 4000,
    online: true,
    open: "tunnel",
    tunnel: true
  });
}*/

//minify CSS files
function minifyCSS() {
  return gulp.src('./app/public/css/bundles/*.css')
    .pipe(csso())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./app/public/css/min/'))
    /*.pipe(browserSync.reload({
      stream: true
    }))*/
}

//watches files for changes
function watchAll(){
	gulp.watch(['./app/public/css/*.css', './app/public/assets/css/*.css'], gulp.series(makeCSSBundles, minifyCSS));
}

function makeCSSBundles(){
  gulp.src([variablesCSS, './app/public/css/shop.css', headerCSS, footerCSS, carouselCSS, cartModalCSS, contactModalCSS])
    .pipe(concat('shop-bundle.css'))
    .pipe(gulp.dest(cssBundles));

  gulp.src([variablesCSS, './app/public/css/goodsDetail.css', headerCSS, footerCSS,cartModalCSS, contactModalCSS])
    .pipe(concat('goods-details-bundle.css'))
    .pipe(gulp.dest(cssBundles));

  gulp.src([variablesCSS, './app/public/css/blog.css', headerCSS, footerCSS, cartModalCSS, contactModalCSS])
    .pipe(concat('blog-bundle.css'))
    .pipe(gulp.dest(cssBundles));

  gulp.src([variablesCSS, './app/public/css/search.css', headerCSS, footerCSS, cartModalCSS, contactModalCSS])
    .pipe(concat('search-bundle.css'))
    .pipe(gulp.dest(cssBundles));

  gulp.src([variablesCSS, './app/public/css/login.css'])
    .pipe(concat('login.css'))
    .pipe(gulp.dest(cssBundles));

  gulp.src([variablesCSS, './app/public/css/register.css'])
    .pipe(concat('register.css'))
    .pipe(gulp.dest(cssBundles));

  gulp.src([variablesCSS, './app/public/css/profile.css', headerCSS, footerCSS, cartModalCSS, contactModalCSS])
    .pipe(concat('profile-bundle.css'))
    .pipe(gulp.dest(cssBundles));

  return gulp.src([variablesCSS, './app/public/css/index.css', headerCSS, footerCSS, carouselCSS, cartModalCSS, contactModalCSS])
    .pipe(concat('index-bundle.css'))
    .pipe(gulp.dest(cssBundles));
}


/**
	* Tasks export
**/

exports.default = gulp.series(
  makeCSSBundles,
	minifyCSS,
	gulp.parallel(
		//initBrowserSync,
		nodemon,
		watchAll
	)
)
