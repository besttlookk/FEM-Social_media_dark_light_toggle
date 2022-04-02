// Initialize modules
const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const pug = require("gulp-pug");
const del = require("del"); //For Cleaning build/dist for fresh export
const options = require("./config");
const htmlmin = require("gulp-htmlmin");

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: options.paths.dist.base,
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },

    port: options.config.port || 5000,
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

//!=================Development Enviroment =========================

//! DEV: To Convert PUG Files to HTML
function devPugTask() {
  return src(`${options.paths.src.base}/pug/*.pug`)
    .pipe(pug({ pretty: true }))
    .pipe(dest(options.paths.src.base));
}

//! DEV: To Copy html file from src to dist folder
function devHTMLTask() {
  return src(`${options.paths.src.base}/**/*.html`).pipe(
    dest(options.paths.dist.base)
  );
}

//! Sass Task
function devSassTask() {
  return src(`${options.paths.src.css}/**/*.scss`, { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(options.paths.dist.css, { sourcemaps: "." }));
}

//! Devlopment JavaScript Task
function devJsTask() {
  return src(`${options.paths.src.js}/*.js`, { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(dest(options.paths.dist.js, { sourcemaps: "." }));
}

function devImages() {
  return src(`${options.paths.src.img}/**/*`).pipe(
    dest(options.paths.dist.img)
  );
}

//! Watch Task during development.
function watchTask() {
  watch(
    `${options.paths.src.base}/**/*.pug`,
    series(devPugTask, devHTMLTask, browserSyncReload)
  );
  watch(
    `${options.paths.src.css}/**/*.scss`,
    series(devSassTask, browserSyncReload)
  );

  watch(
    `${options.paths.src.js}/**/*.js`,
    series(devJsTask, browserSyncReload)
  );
}

function devClean() {
  return del([options.paths.dist.base]);
}

//! ========================Prodcution Tasks
function prodHTMLTask() {
  return src(`${options.paths.dist.base}/**/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(options.paths.build.base));
}

//! Sass Task
function prodStylesTask() {
  return src(`${options.paths.dist.css}/style.css`).pipe(
    dest(options.paths.build.css)
  );
}

function prodJsTask() {
  return src(`${options.paths.dist.js}/**/*.js`).pipe(
    dest(options.paths.build.js)
  );
}

function prodImageTask() {
  return src(`${options.paths.dist.img}/**/*`).pipe(
    dest(options.paths.build.img)
  );
}

function prodClean() {
  return del([options.paths.build.base]);
}

exports.default = series(
  devClean, // Clean Dist Folder,
  devPugTask,
  parallel(devSassTask, devJsTask, devHTMLTask, devImages), //Run All tasks in parallel
  browserSyncServe, // Live Preview Build
  watchTask // Watch for Live Changes
);

exports.build = series(
  prodClean, // Clean Build Folder
  parallel(prodStylesTask, prodJsTask, prodHTMLTask, prodImageTask) //Run All tasks in parallel
);
