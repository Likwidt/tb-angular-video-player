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
var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require("gulp-minify-html");
var angularFilesort = require('gulp-angular-filesort');
var Karma = require('karma').Server;
var sources = {
	js: ['js/*.js', 'js/**/*.js'],
  sass: ['scss/*.*', '!scss/mixins.scss'],
	css: ['css/*.css'],
	html: ['index.html', 'views/*.html'],
  templates: ['js/directives/templates/*.html'],
  img: ['img/*.*', '!img/slides']
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

gulp.task('inject-dist', function() {

  var min = gulp.src(['./dist/*.js', './dist/tbVideoPlayer.min.css', '!./dist/server.js'], {read: false});

  return gulp .src('index.html')
              .pipe(inject(min,{ignorePath: 'dist/'}))
              .pipe(gulp.dest('./dist'));
});

gulp.task('jshint', function () {
    return gulp.src(sources.js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('watch', ['watch-html', 'watch-sass', 'watch-js']);

gulp.task('watch-html', function () {
  return gulp.watch(sources.html, ['html']);
});
gulp.task('watch-sass', function () {
  return gulp.watch(sources.sass, ['sass', 'inject', 'html']);
});
gulp.task('watch-js', function () {
  return gulp.watch(sources.js, ['inject', 'html']);
});

gulp.task('clean-dist', function() {
  return gulp .src(['dist/*.*', 'dist/**/*.*', '!dist/package.json', '!dist/server.js', '!dist/node_modules/**/*.*'])
              .pipe(clean({force: true}));
});

gulp.task('clean-css', function() {
  return gulp .src(['css'])
              .pipe(clean({force: true}));
});

gulp.task('minify-js', function () {
  return gulp 
    .src(sources.js.concat(['!js/app.js', '!js/controllers/*.*']))
    .pipe(angularFilesort())
    .pipe(concat('tbVideoPlayer.min.js'))
    .pipe(sourcemaps.init())
      .pipe(uglify())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function () {
  return gulp.src(sources.sass.concat(['!scss/app.scss']))
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat('tbVideoPlayer.min.css'))
      .pipe(sourcemaps.init())
        .pipe(cleanCSS())
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest('dist'));
});

gulp.task('html2js', function () {
  return gulp.src(sources.templates)
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(ngHtml2Js({
      moduleName: "tb-video-player.templates",
      prefix: "js/directives/templates/"
    }))
    .pipe(concat("templates.js"))
    .pipe(gulp.dest("js"));
});



gulp.task('copy-img', function() {
  return gulp .src(sources.img)
              .pipe(gulp.dest('css/img'));
});

gulp.task('copy-img-dist', function() {
  return gulp .src(sources.img)
              .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-views-dist', function() {
  return gulp .src(['views/**/*.*'])
              .pipe(gulp.dest('dist/views'));
});

gulp.task('copy-example-js', function() {
  return gulp .src(['js/app.js', 'js/controllers/*.js'])
              .pipe(gulp.dest('dist'));
});

gulp.task('copy-dist', ['copy-views-dist', 'copy-img-dist', 'copy-example-js']);

gulp.task('dist', function(done) {
  runSequence('clean-dist', 'copy-dist', 'html2js', 'minify-js', 'sass', 'minify-css', 'inject-dist', done)
});
 
gulp.task('default', function(done) {
  runSequence('clean-css', 'copy-img', 'html2js', 'sass', 'inject', 'watch', 'connect', 'open', done)
});

 

 

