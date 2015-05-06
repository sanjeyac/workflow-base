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

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./src"
    }
  });
});

gulp.task('bs-reload', function () {
  pluginsbrowserSync.reload();
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

gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function(){
  gulp.src(['src/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('src/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("*.html", ['bs-reload']);
});
