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
  gulp.src(['./app/public/assets/css/variables.css', './app/public/css/shop.css', './app/public/assets/css/header.css', './app/public/assets/css/carousel.css', './app/public/assets/css/footer.css', './app/public/assets/css/cart-modal.css', './app/public/assets/css/contact-modal.css'])
    .pipe(concat('shop-bundle.css'))
    .pipe(gulp.dest('./app/public/css/bundles/'));

  gulp.src(['./app/public/assets/css/variables.css', './app/public/css/goodsDetail.css', './app/public/assets/css/header.css', './app/public/assets/css/footer.css', './app/public/assets/css/cart-modal.css', './app/public/assets/css/contact-modal.css'])
    .pipe(concat('goods-details-bundle.css'))
    .pipe(gulp.dest('./app/public/css/bundles/'));

  gulp.src(['./app/public/assets/css/variables.css', './app/public/css/blog.css', './app/public/assets/css/header.css', './app/public/assets/css/footer.css', './app/public/assets/css/cart-modal.css', './app/public/assets/css/contact-modal.css'])
    .pipe(concat('blog-bundle.css'))
    .pipe(gulp.dest('./app/public/css/bundles/'));

  gulp.src(['./app/public/assets/css/variables.css', './app/public/css/search.css', './app/public/assets/css/footer.css', './app/public/assets/css/cart-modal.css', './app/public/assets/css/contact-modal.css', './app/public/assets/css/book-modal.css'])
    .pipe(concat('search-bundle.css'))
    .pipe(gulp.dest('./app/public/css/bundles/'));

  gulp.src('./app/public/assets/css/variables.css', './app/public/css/login.css')
    .pipe(gulp.dest('./app/public/css/bundles/'));

  gulp.src('./app/public/assets/css/variables.css', './app/public/css/register.css')
    .pipe(gulp.dest('./app/public/css/bundles/'));

  return gulp.src(['./app/public/assets/css/variables.css', './app/public/css/index.css', './app/public/assets/css/header.css', './app/public/assets/css/carousel.css', './app/public/assets/css/footer.css', './app/public/assets/css/cart-modal.css', './app/public/assets/css/contact-modal.css', './app/public/assets/css/book-modal.css'])
    .pipe(concat('index-bundle.css'))
    .pipe(gulp.dest('./app/public/css/bundles/'));
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
