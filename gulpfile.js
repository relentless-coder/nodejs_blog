const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const concat = require('gulp-concat');


gulp.task('clean', ()=>{
  return gulp.src('./client/build/*.js', {read: false})
    .pipe(clean())
})


gulp.task('sass', ['clean'], ()=>{
  return gulp.src('./client/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/build'))
})


gulp.task('default', ['clean', 'sass'])