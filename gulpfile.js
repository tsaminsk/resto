const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const scss = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const del = require('del');
const runSequence = require('run-sequence');
const rename = require('gulp-rename');



gulp.task('clean:build', function() {
    return del('./build');
});

gulp.task('server',  function() {
    browserSync.init({
    	server: {baseDir: './build/'}
    });

    gulp.watch('src/template/**/*.*', ['pug']);
    gulp.watch('src/styles/**/*.scss', ['scss']);
    gulp.watch('src/fonts/**/*.*', ['copy:fonts']);
    gulp.watch('src/img/**/*.*', ['copy:img']);
});

gulp.task('copy:fonts', function() {
    return gulp.src('src/fonts/**/*.*')
    	.pipe(gulp.dest('./build/fonts'))
		.pipe(browserSync.stream());
});

gulp.task('copy:img', function() {
    return gulp.src('src/images/**/*.*')
    	.pipe(gulp.dest('./build/images'))
		.pipe(browserSync.stream());
});

gulp.task('scss', function() {
    return gulp.src('./src/styles/main.scss')
	    .pipe(plumber({
	    	errorHandler: notify.onError(function(err){
	    		return {
	    			title: 'Styles',
	    			message: err.message
	    		}
	    	})
	    }))
	    .pipe(sourcemaps.init())
	    .pipe(scss())
	    .pipe(autoprefixer({
				browsers : ['> 2%'],
				cascade : false
			}))
	    .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
	    .pipe(rename('main.min.css'))
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest('./build/css'))
	    .pipe(browserSync.stream());
});

gulp.task('pug', function() {
    return gulp.src('./src/template/*.pug')
	    .pipe(plumber({
	    	errorHandler: notify.onError(function(err){
	    		return {
	    			title: 'Pug',
	    			message: err.message
	    		}
	    	})
	    }))
	    .pipe(pug({
	    	pretty: true
	    }))
	    .pipe(gulp.dest('./build'))
		.pipe(browserSync.stream());
});

gulp.task('default', function(callback){
	runSequence(
		'clean:build',
		['scss', 'pug', 'copy:fonts', 'copy:img' ],
		'server',
		callback
	)
});

