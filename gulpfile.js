var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var nib = require('nib');
var browserify = require('gulp-browserify');

process.on('uncaughtException', function(err) {
  console.log(err);
});

gulp.task('stylus', function() {
  var stylusOptions = {
    use: [nib()],
    'import': ['nib']
  };
  return gulp.src(['./dev/css/**/*.styl'])
    .pipe(stylus(stylusOptions))
    .on('error', console.log)
    .pipe(gulp.dest('./build/css'));
});

gulp.task('jade', function() {
  return gulp.src(['./dev/views/*.jade'])
    .pipe(jade())
    .pipe(gulp.dest('./build/'));
});

gulp.task('browserify', function() {
  return gulp.src(["./dev/js/*.js"])
    .pipe(browserify({
      debug: true
    }))
    .pipe(gulp.dest('./build/js'));
});


gulp.task('img', function() {
  return gulp.src(['./dev/img/*'])
    .pipe(gulp.dest('./build/img'));
});



gulp.task('watch', function() {
  gulp.watch(['./dev/views/**/*.jade'], ['jade']);
  gulp.watch(['./dev/css/**/*.styl'], ['stylus']);
  gulp.watch(['./dev/js/*.js'], ['browserify']);
});


gulp.task('default', ['stylus', 'img', 'jade', 'browserify', 'watch']);

gulp.task('build', ['stylus', 'img', 'jade','browserify']);