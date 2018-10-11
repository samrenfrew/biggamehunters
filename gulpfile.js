var gulp = require('gulp');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
// var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

gulp.task('reload', function() {
    browserSync.init({
        server: {
            baseDir: 'dev'
        },
    })
})

// gulp.task('scss', function(){
//      return gulp.src('scss/styles.scss')
//      .pipe(plumber(function (error) {
//         this.emit('end');
//     }))
//     .pipe(sass())
//     .pipe(gulp.dest('css'))
//     .pipe(browserSync.reload({ stream: true }))
// });

gulp.task('js', function(){
     return gulp.src('dev/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('css', function(){
     return gulp.src('dev/css/*.css')
    .pipe(csso())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('html', function(){
    return gulp.src('dev/*.html')
    .pipe(gulp.dest('dist'))
})

gulp.task('fonts', function(){
    return gulp.src('dev/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('img', function(){
    return gulp.src('dev/img/*.*')
    .pipe(gulp.dest('dist/img'))
})

gulp.task('watch', ['reload'], function (){
    // gulp.watch('scss/styles.scss', ['scss']);
    gulp.watch("**/*.*").on('change', browserSync.reload);
})

gulp.task('build', ['css', 'js', 'html', 'fonts', 'img']);