"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var angularFilesort = require('gulp-angular-filesort');
var Karma = require('karma').Server;
var sources = {
	js: ['js/*.js', 'js/**/*.js'],
  sass: ['scss/*.*'],
	css: ['css/*.css'],
	html: ['index.html', 'views/*.html']
}
 
gulp.task('connect', function() {
  return connect.server({
    fallback: 'index.html',
    port: 4567,
    livereload: true
  });
});
 
gulp.task('html', function () {
  return gulp 
          .src('index.html')
          .pipe(connect.reload());
});

gulp.task('open', function () {
    return gulp 
            .src('index.html')
            .pipe(open({
                uri: 'http://localhost:4567/index.html',
                app: 'chrome' 
            }));
});

gulp.task('sass', function () {
  return gulp.src(sources.sass)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('css'));
});

gulp.task('inject', function () {
  return gulp 
          .src('index.html')
          .pipe(inject(
            gulp.src(sources.js)
              .pipe(angularFilesort())
            ))      
          .pipe(inject(gulp.src(sources.css)))
          .pipe(gulp.dest(''));
});

gulp.task('jshint', function () {
    return gulp.src(sources.js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function () {
  gulp.watch(sources.html.concat(sources.js), ['html']);
});

gulp.task('clean-dist', function() {
  return gulp .src(['dist'])
              .pipe(clean({force: true}));
});

gulp.task('minify-js', function () {
  return gulp 
    .src('js/tbFreeDraw.js')
    .pipe(uglify())
    .pipe(rename('tbFreeDraw.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', function(done) {
  runSequence('clean-dist', 'minify-js', done)
});
 
gulp.task('default', function(done) {
  runSequence('sass', 'inject', 'watch', 'connect', 'open', done)
});

 

 

