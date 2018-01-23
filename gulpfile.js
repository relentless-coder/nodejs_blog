const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const concat = require('gulp-concat');


gulp.task('clean', ()=>{
	return gulp.src(['./client/blog/build/*.js', './client/blog/admin/*.js'], {read: false})
		.pipe(clean());
});


gulp.task('blog-sass', ['clean'], ()=>{
	return gulp.src('./client/blog/styles/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./client/blog/build'));
});

gulp.task('admin-sass', ['blog-sass'], ()=>{
	return gulp.src('./client/admin/styles/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./client/admin/build'));
});


gulp.task('default', ['clean', 'sass']);