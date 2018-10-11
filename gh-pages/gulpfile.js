var gulp = require('gulp');
// var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
// var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var nunjucksRender = require('gulp-nunjucks-render');
var del = require('del');
var watch = require('gulp-watch');

var paths = {
  styles: {
    src: 'dev/css/*.css',
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
    snippets: 'dev/snippets',
    dest: 'dist'
  }
};

function clean() {
  return del([ 'dist/*' ]);
}

function css() {
  return gulp.src(paths.styles.src)
    .pipe(csso())
    .pipe(gulp.dest(paths.styles.dest));
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
exports.js = js;
exports.fonts = fonts;
exports.img = img;
exports.html = html;
exports.reload = reload;

var build = gulp.series(clean, gulp.parallel(css, js, fonts, img, html));
gulp.task('build', build);

gulp.task('watch', gulp.series(build, function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("dev/**/*.*").on('change', gulp.series(build, reload));
}));