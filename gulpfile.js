const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const concat = require('gulp-concat');


gulp.task('clean', ()=>{
    return gulp.src(['./client/blog/build/*.js', './client/admin/build/*.js'], {read: false}).pipe(clean());
});


gulp.task('blog-sass', ['clean'], ()=>{
    return gulp.src('./client/blog/src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./client/blog/build'));
});

gulp.task('admin-sass', ['blog-sass'], ()=>{
    return gulp.src('./client/admin/src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./client/admin/build'));
});


gulp.task('default', ['clean', 'blog-sass', 'admin-sass']);
