var gulp = require('gulp');
var responsive = require('gulp-responsive');
var minify = require('gulp-minify');
let cleanCSS = require('gulp-clean-css');
let watch = require('gulp-watch');



gulp.task('default', function () {
  gulp.start('minify-images')
  gulp.start('compressJs')
  gulp.start('minify-css')
});

gulp.task('minify-images', function () {
  return gulp.src('img/*.{png,jpg}')
    .pipe(responsive({
      '*.jpg': [{
        quality: 30,
        width: 320,
        rename: { suffix: '-320px' },
      }, {
        quality: 35,
        width: 480,
        rename: { suffix: '-480px' },
      },
        // {
        //   quality: 25,
        //   width: 600,
        //   rename: { suffix: '-600px' },
        // }, 
        // {
        //   // Compress, strip metadata, and rename original image
        //   rename: { suffix: '-original' },
        // }
      ]
    }
    ))
    .pipe(gulp.dest('imgSrc'));
})

gulp.task('compressJs', function () {
  gulp.src('js/*.js')
    .pipe(minify({
      ext: {
        src: '-debug.js',
        min: '.js'
      },
      exclude: ['tasks'],
      ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('minify-css', () => {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('dist'));
});


gulp.task('watch', function () {
  var watcherJs = gulp.watch('js/**/*.js');
  watcherJs.on('change', function (path, stats) {
    // console.log('File ' + path + ' was changed');
    console.log(JSON.stringify(path))
    gulp.start('compressJs')
  });
  var watcherCss = gulp.watch('css/**/*.css');
  watcherCss.on('change', function (path, stats) {
    // console.log('File ' + path + ' was changed');
    console.log(JSON.stringify(path))
    gulp.start('minify-css')
  });
});
