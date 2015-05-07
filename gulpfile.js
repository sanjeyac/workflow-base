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

gulp.task('bower-install', function () {
    return bower({
            directory: './bower_components'
        })
        .pipe(gulp.dest('lib/'))
});

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


gulp.task('autotest', function () {
    return gulp.watch(['src/scripts/**/*.js'], ['test']);
});


gulp.task('images', function () {
    gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('src-inject', function () {
    var target = gulp.src('src/index.html');
    var sources = gulp.src(['src/**/*.js', 
                            'src/**/*.css',
                            '!src/bower_components',], {
        read: false
    });
    return target.pipe(inject(sources))
        .pipe(gulp.dest('./src'));
});


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


gulp.task('deploy', [ 'deploy-css', 'deploy-html', 'deploy-js', 'deploy-inject' ]);


gulp.task('default', ['browser-sync'], function () {
    gulp.watch("src/styles/**/*.css", ['styles']);
    gulp.watch("src/scripts/**/*.js", ['scripts']);
    gulp.watch("*.html", ['bs-reload']);
});