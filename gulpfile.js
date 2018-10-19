var gulp = require('gulp');
// var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var nunjucksRender = require('gulp-nunjucks-render');
var del = require('del');
var watch = require('gulp-watch');

var paths = {
  css: {
    src: 'dev/css/*.css',
    dest: 'dist/css'
  },
  sass: {
    src: 'dev/css/*.scss',
    dest: 'dist/css'
  },
  scripts: {
    src: 'dev/js/*.js',
    dest: 'dist/js'
  },
  img: {
    src: 'dev/img/*.*',
    dest: 'dist/img'
  },
  fonts: {
    src: 'dev/fonts/*.*',
    dest: 'dist/fonts'
  },
  html: {
    src: 'dev/pages/*.html',
    snippets: 'dev/snippets/*.html',
    dest: 'dist'
  }
};

function clean() {
  return del([ 'dist/*' ]);
}

function css(){
  return gulp.src(paths.css.src)
    .pipe(csso())
    .pipe(gulp.dest(paths.css.dest));
}

function scss(){
  return gulp.src(paths.sass.src)
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest(paths.sass.dest));
}

function js() {
  return gulp.src(paths.scripts.src)
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}

function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
}

function img() {
  return gulp.src(paths.img.src)
    .pipe(gulp.dest(paths.img.dest));
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(nunjucksRender({
      path: ['dev/snippets']
    }))
    .pipe(gulp.dest(paths.html.dest));
}

function reload(){
  browserSync.reload();
}

exports.clean = clean;
exports.css = css;
exports.scss = scss;
exports.js = js;
exports.fonts = fonts;
exports.img = img;
exports.html = html;
exports.reload = reload;

var preview = gulp.parallel(css, scss, js, fonts, img, html);
gulp.task('preview', preview);

var build = gulp.series(clean, gulp.parallel(css, scss, js, fonts, img, html));
gulp.task('build', build);

gulp.task('watch', gulp.series(preview, function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("dev/**/*.*").on('change', gulp.series(preview, reload));
}));