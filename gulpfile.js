var gulp = require('gulp'),
  rigger = require('gulp-rigger'),
  del = require('del'),
  concat = require('gulp-concat'),
  min = require('gulp-uglify'),
  sass = require('gulp-sass'),
  size = require('gulp-size'),
  sourcemaps = require('gulp-sourcemaps'),
  browser = require("browser-sync").create();
var paths = {
  js: './dev/JS/**/*.js',
  img: './dev/img/**',
  imgdist: './dist/img',
  fonts: './dev/fonts/**',
  fontsdist: './dist/fonts',
  jsdir: './dev/JS',
  script: ['./dev/scripts/core.js','./dev/scripts/custom.js'],
  scss: [
    './dev/sass/**/*.scss',
    '!dev/sass/**/*_scsslint_tmp*.scss'
  ],
  cssdir: './dev/css',
  html: './dev/**/*.html',
  cssdist: './dist/css',
  jsdist: './dist/JS',
  dist: './dist'
};
gulp.task('clean', function() {
  del.sync([paths.jsdir, paths.cssdir]);
});
gulp.task('sass:dev', function() {
  return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      sourceComments: 'normal'
    }).on('error', sass.logError))
    .pipe(size({
      showFiles: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.cssdir))
    .pipe(browser.stream());
});
gulp.task('sass:prod', function() {
  return gulp.src(paths.scss)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest(paths.cssdist));
});
gulp.task('js:dev', function () {
    return gulp.src(paths.script)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(size({showFiles: true}))

        .pipe(sourcemaps.write())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest(paths.jsdir));
});
gulp.task('js:prod', function () {
    return gulp.src(paths.script)
        .pipe(rigger())
        .pipe(min())
        .pipe(gulp.dest(paths.jsdist));
});
gulp.task('watch', function () {
    browser.init({
        server: {
            baseDir: './dev/'
        }
    });

    gulp.watch(paths.scss, ['sass:dev']);
    gulp.watch(paths.script, ['js:dev']);
    gulp.watch([paths.html, paths.js]).on('change', browser.reload);
});

gulp.task('clean:prod', function() {
  del.sync(paths.dist)});
gulp.task('html:prod', function () {
    return gulp.src(paths.html)
      .pipe(gulp.dest(paths.dist));
});
gulp.task('img:prod', function () {
    return gulp.src(paths.img)
      .pipe(gulp.dest(paths.imgdist));
});
gulp.task('fonts:prod', function () {
    return gulp.src(paths.fonts)
      .pipe(gulp.dest(paths.fontsdist));
});
gulp.task('default', ['clean', 'js:dev', 'sass:dev', 'watch']);
gulp.task('prod', ['clean:prod','html:prod','img:prod','fonts:prod','js:prod', 'sass:prod']);
