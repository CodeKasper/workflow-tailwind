const { src, dest, watch, parallel } = require("gulp");

// CSS
const tailwindcss = require('tailwindcss');
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// images
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require('gulp-webp');
const avif = require("gulp-avif");

// Javascript
const terser = require("gulp-terser-js");

function css(cb) {
  const postcss = require('gulp-postcss')
    src('./src/**/*.css')
    .pipe(postcss([
      tailwindcss(),
      autoprefixer(),
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      cssnano()
    ]))
    .pipe(dest('public/css'));
  cb();
}
function images(cb) {
  const options = {
    optimizationLevel: 3,
  };
  src('src/img/**/*.{jpg,png}')
  .pipe(cache( imagemin(options) ))
  .pipe(dest("public/img"))
  cb();
}

function imgWebp(cb) {
  const options = {
    quality: 50,
  };
  src('src/img/**/*.{jpg,png}')
  .pipe(webp(options))
  .pipe(dest("public/img"))
  cb();
}
function imgAvif(cb) {
  const options = {
    quality: 50,
  };
  src('src/img/**/*.{jpg,png}')
  .pipe(avif(options))
  .pipe(dest("public/img"))
  cb();
}
function javascript(cb) {
  src("src/js/**/*.js")
    .pipe(terser())
    .pipe(dest("public/js"));

  cb();
}
function dev(cb) {
  watch("./public/**/*.html", css);
  watch("src/js/**/*.js", javascript);

  cb();
}

exports.css = css;
exports.js = javascript;
exports.images = images;
exports.imgWebp = imgWebp;
exports.imgAvif = imgAvif;

exports.dev = parallel(images, imgWebp, imgAvif, dev);

