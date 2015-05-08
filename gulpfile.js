/**
 *  author: S.Cooray <sanjeya.cooray@gmail.com>
 */

var gulp            = require('gulp'),
    plumber         = require('gulp-plumber'),
    rename          = require('gulp-rename'),
    autoprefixer    = require('gulp-autoprefixer'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    imagemin        = require('gulp-imagemin'),
    cache           = require('gulp-cache'),
    sass            = require('gulp-sass'),
    bower           = require('gulp-bower'),
    inject          = require('gulp-inject'),
    rev             = require('gulp-rev'),
    jasmine         = require('gulp-jasmine'),
    karma           = require('gulp-karma'),
    wiredep         = require('wiredep'),
    browserSync     = require('browser-sync');


gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./src"
        }
    });
});


gulp.task('bs-reload', function () {
    pluginsbrowserSync.reload();
});


/******************************************************************************
 *  Setup  phase
 ******************************************************************************/

gulp.task('bower-install', function () {
    return bower({
            directory: './bower_components'
        });
        //.pipe(gulp.dest('dist/lib/'))
});

gulp.task('init', ['bower-install' ]);


/******************************************************************************
 * Development phase
 ******************************************************************************/

//exectue jasmines' tests
gulp.task('test', function () {
    return gulp.src('./foobar') //workaround
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

//auto run test on javascripts' changes
gulp.task('autotest', function () {
    return gulp.watch(['src/scripts/**/*.js'], ['test']);
});

//image reducing
gulp.task('images', function () {
    gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images/'));
});

//inject scripts and style in index.html
gulp.task('src-inject', function () {
    var target = gulp.src('src/index.html');
    var sources = gulp.src(['src/**/*.js', 
                            'src/**/*.css'], {
        read: false
    });
    return target.pipe(inject(sources))
        .pipe(gulp.dest('./src'));
});

// vendor script and styles
gulp.task('src-vendor-scripts', function() {
  return gulp.src(wiredep().js)
    .pipe(concat('vendor.js'))
    .pipe(rev())
    .pipe(gulp.dest('src/js'));
});

gulp.task('src-vendor-css',  function() {
  return gulp.src(wiredep().css)
    .pipe(concat('vendor.css'))
    .pipe(rev())
    .pipe(gulp.dest('src/styles'));
});

gulp.task('src-vendor',['src-vendor-scripts','src-vendor-css']);


// vendor script and styles
gulp.task('deploy-vendor-scripts', function() {
  return gulp.src(wiredep().js)
    .pipe(concat('vendor.js'))
    .pipe(rev())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('deploy-vendor-css',  function() {
  return gulp.src(wiredep().css)
    .pipe(concat('vendor.css'))
    .pipe(rev())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('deploy-vendor',['deploy-vendor-scripts','deploy-vendor-css']);

/******************************************************************************
 *  Deploy  phase
 ******************************************************************************/

/**
 *  Generate final Javascript files
 */
gulp.task('deploy-js', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(browserSync.reload({
            stream: true
        }));    
});

/**
 *  Generate final CSS files
 */
gulp.task('deploy-css', function () {
    return gulp.src(['src/styles/**/*.css'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(browserSync.reload({
            stream: true
        })); 
});

/**
 *  Generate final HTML files
 */
gulp.task('deploy-html', function () {
    return gulp.src(['src/**/*.html'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({
            stream: true
        })); 
});

/**
 *  Include js/css files in the html files
 */
gulp.task('deploy-inject', function () {
    var target = gulp.src('dist/*.html');
    var sources = gulp.src(['dist/**/*.js', 
                            'dist/**/*.css'], {
        read: false
    });
    return target.pipe(inject(sources))
        .pipe(gulp.dest('./dist'));
});


/**
 *  Deploy with all deploy phases
 */
gulp.task('deploy', [ 'deploy-css', 'deploy-html', 'deploy-js', 'deploy-inject' ]);


gulp.task('default', ['browser-sync'], function () {
    gulp.watch("src/styles/**/*.css", ['styles']);
    gulp.watch("src/scripts/**/*.js", ['scripts']);
    gulp.watch("*.html", ['bs-reload']);
});