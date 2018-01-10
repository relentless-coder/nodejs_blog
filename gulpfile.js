const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const clean = require('gulp-clean');


gulp.task('clean', ()=>{
  return gulp.src('./client/build/*', {read: false})
    .pipe(clean())
})

gulp.task('js:babel', ['clean'], ()=>{
  return gulp.src('./client/**/*.js')
    .pipe(babel({presets: ['babel-preset-env']}))
    .pipe(gulp.dest('./client/build'))
})

gulp.task('sass', ['js:babel'], ()=>{
  return gulp.src('./client/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/build'))
})


gulp.task('default', ['clean', 'js:babel', 'sass'])