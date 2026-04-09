const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();

function vendor() {
  return gulp
    .src("./node_modules/jquery/dist/jquery.min.js")
    .pipe(gulp.dest("./js/vendor")); // moved from ./src/js/vendor to ./js/vendor
}

function style() {
  return gulp
    .src("./scss/**/*.scss") // moved from ./src/scss/**/*.scss to ./scss/**/*.scss
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css")) // moved from ./src/css to ./css
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./", // changed from './src' to './'
    },
  });
  gulp.watch("./scss/**/*.scss", style); // moved from ./src/scss/**/*.scss to ./scss/**/*.scss
  gulp.watch("./*.html").on("change", browserSync.reload); // changed from ./src/*.html to ./*.html
  gulp.watch("./js/**/*.js").on("change", browserSync.reload); // changed from ./src/js/**/*.js to ./js/**/*.js
}

exports.style = style;
exports.vendor = vendor;
exports.watch = gulp.series(vendor, style, watch);
exports.default = gulp.series(vendor, style, watch);
