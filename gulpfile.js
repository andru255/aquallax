/*jshint esversion: 6 */

var gulp = require("gulp");
var postCSS                = require("gulp-postcss");
var importPostCSS          = require("postcss-import");
var mixinsPostCSS     = require("postcss-mixins");
var nestedPostCSS     = require("postcss-nested");
var simpleVarsPostCSS = require("postcss-simple-vars");
var resetPostCSS      = require("postcss-autoreset");
var gradientsPostCSS  = require("postcss-easing-gradients");
var autoprefixer      = require("autoprefixer");
var babel             = require("gulp-babel");
var concat            = require("gulp-concat");
var uglify            = require("uglify-js");
var composer          = require("gulp-uglify/composer");
var minify            = composer(uglify, console);
var pump              = require("pump");
var del               = require("del");
var runSequence       = require("run-sequence");
var browserSync       = require("browser-sync").create();
var concatCSS         = require("gulp-concat-css");
var buildDir          = "./docs/";

gulp.task("clean", function(){
    return del([ 
        `${buildDir}*.*`,
        `${buildDir}**/*.*`,
    ]);
});

gulp.task("css", function(){
    return gulp.src([ "./src/styles/*.css", "./src/styles/**/*.css" ])
        .pipe(postCSS([
            importPostCSS(),
            mixinsPostCSS(),
            simpleVarsPostCSS({
                variables : {
                    assets_folder: "../assets"
                }
            }),
            nestedPostCSS(),
            autoprefixer(),
            gradientsPostCSS(),
            resetPostCSS()
        ]))
        .pipe(concatCSS("main.css"))
        .pipe(gulp.dest(buildDir));
});

gulp.task("assets", function(){
    return gulp.src("./src/assets/*.*")
        .pipe(gulp.dest(`${buildDir}assets`));
});

gulp.task("html", function(){
    return gulp.src("./src/example/*.html")
        .pipe(gulp.dest(`${buildDir}`));
});

gulp.task("js", function(){
    return gulp.src([ 
            "./src/scripts/**/*.js", 
            "./src/scripts/*.js" 
        ]).pipe(babel({
            presets: ["env"],
            plugins: ["transform-remove-strict-mode"]
        }))
        .pipe(concat("min.js"))
        .pipe(gulp.dest(`${buildDir}`));
});

gulp.task("js-min", function(cb){
    var options = {
        mangle: {
            toplevel: true
        },
        ie8: true
    };
    return pump([
        gulp.src(`${buildDir}min.js`),
        minify(options),
        gulp.dest(`${buildDir}`)
    ]);
});

//development
gulp.task("server", function(){
    browserSync.init({
        server: {
            baseDir: "./",
            directory: true
        }
    });

    gulp.watch([ "./src/styles/*.*", "./src/styles/**/*.*"], ["css"]);
    gulp.watch([ "./src/scripts/*.*", './src/scripts/**/*.js'], ["js"]);
    gulp.watch("./src/example/index.html", ["html"]);
    gulp.watch("./src/assets/*.*", ["assets"]);

    gulp.watch(`${buildDir}*.css`).on("change", browserSync.reload);
    gulp.watch(`${buildDir}*.html`).on("change", browserSync.reload);
    gulp.watch(`${buildDir}*.js`).on("change", browserSync.reload);
});

gulp.task("default", function(cb){
    return runSequence("clean", 
                       ["assets", "html","css", "js"], 
                       "js-min", cb);
});
