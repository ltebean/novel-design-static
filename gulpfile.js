var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var nib = require('nib');

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

gulp.task('cortex', function() {
  return gulp.src(["./dev/js/neurons/**/*.js"])
    .pipe(gulp.dest('./build/neurons/'));
});


gulp.task('img', function() {
  return gulp.src(['./dev/img/*'])
    .pipe(gulp.dest('./build/img'));
});



gulp.task('watch', function() {
  gulp.watch(['./dev/views/**/*.jade'], ['jade']);
  gulp.watch(['./dev/css/**/*.styl'], ['stylus']);
  gulp.watch(["./dev/js/neurons/**/*.js"], ['cortex']);
});


gulp.task('default', ['stylus', 'img', 'jade', 'cortex', 'watch']);

gulp.task('build', ['stylus', 'img', 'jade','cortex']);