/**
 *  author: S.Cooray <sanjeya.cooray@gmail.com>
 */

var gulp            = require('gulp'),
    plumber         = require('gulp-plumber'),
    rename          = require('gulp-rename'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    bower           = require('gulp-bower'),
    inject          = require('gulp-inject'),
    rev             = require('gulp-rev'),
    karma           = require('gulp-karma'),
    wiredep         = require('wiredep'),
    series          = require('stream-series'),
    browserSync     = require('browser-sync');


/******************************************************************************
 *  Setup  phase
 ******************************************************************************/

gulp.task('bower-install', function () {
    return bower({
            directory: './src/bower_components'
        });
        //.pipe(gulp.dest('dist/lib/'))
});

gulp.task('init', ['bower-install' ]);


/******************************************************************************
 * Development phase
 ******************************************************************************/

// exectue jasmines' tests
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

// auto run test on javascripts' changes
gulp.task('autotest', function () {
    return gulp.watch(['src/scripts/**/*.js'], ['test']);
});

// automatically insert css and javascripty to index.html page
gulp.task('src-vendor-scripts', function() {
  return gulp.src(wiredep().js)
    .pipe(concat('vendor.js'))
    .pipe(rev())
    .pipe(gulp.dest('./src/lib/js'));
});

gulp.task('src-vendor-css',  function() {
  return gulp.src(wiredep().css)
    .pipe(concat('vendor.css'))
    .pipe(rev())
    .pipe(gulp.dest('./src/lib/styles'));
});

gulp.task('inject-src', ['src-vendor-scripts','src-vendor-css'], function () {
    var target = gulp.src('src/index.html');
    
    var vendors = gulp.src(['src/lib/**/*.js', 
                            'src/lib/**/*.css'], { read: false });    
    
    var sources = gulp.src(['src/scripts/**/*.js',
                            '!src/scripts/**/*.test.js',
                            'src/styles/**/*.css'], { read: false });
    
    return target.pipe(inject(series(vendors,sources), { relative: true }))
        .pipe(gulp.dest('./src'));
});

gulp.task('dev', ['inject-src'],function(){
    return gulp.watch(['src/scripts/**/*.js'], ['inject-src']);
});

/******************************************************************************
 *  Deploy  phase
 ******************************************************************************/

/**
 *  Generate final Javascript files
 */
gulp.task('deploy-js', function () {
    return gulp.src(['src/scripts/**/*.js','!src/scripts/**/*.test.js'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/scripts/'));            
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
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/styles/'));
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

// vendor script and styles
gulp.task('deploy-vendor-scripts', function() {
  return gulp.src(wiredep().js)
    .pipe(concat('vendor.js'))
    .pipe(rev())
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('deploy-vendor-css',  function() {
  return gulp.src(wiredep().css)
    .pipe(concat('vendor.css'))
    .pipe(rev())
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('deploy-inject',['deploy-vendor-scripts', 'deploy-vendor-css' ], function () {
    
    var target = gulp.src('dist/*.html');
    var sources = gulp.src(['dist/**/*.js', 
                            'dist/**/*.css'], {
        read: false
    });
    return target.pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('./dist'));
});


gulp.task('deploy-vendor',['deploy-vendor-scripts','deploy-vendor-css']);


/**
 *  Deploy with all deploy phases
 */
gulp.task('deploy', [ 'deploy-css', 'deploy-html', 'deploy-js', 'deploy-inject' ]);


gulp.task('default', ['browser-sync'], function () {
    gulp.watch("src/styles/**/*.css", ['styles']);
    gulp.watch("src/scripts/**/*.js", ['scripts']);
    gulp.watch("*.html", ['bs-reload']);
});