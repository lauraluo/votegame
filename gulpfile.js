
var gulp       = require('gulp')
var browserify = require('gulp-browserify')


gulp.task('default', function () {
  gulp.src('./src/*.js')
    .pipe(browserify({ transform: ['vueify', 'babelify', 'aliasify'] }))
    .pipe(gulp.dest('./wwwroot'))
})


// Read the launchSettings.json file into the launch variable.
var launch = require('./Properties/launchSettings.json');

// Holds information about the hosting environment.
var environment = {
    // The names of the different environments.
    development: "Development",
    staging: "Staging",
    production: "Production",
    // Gets the current hosting environment the application is running under.
    current: function() {
        return process.env.ASPNETCORE_ENVIRONMENT ||
            (launch && launch.profiles['IIS Express'].environmentVariables.ASPNETCORE_ENVIRONMENT) ||
            this.development;
    },
    // Are we running under the development environment.
    isDevelopment: function() {
        return this.current() === this.development;
    },
    // Are we running under the staging environment.
    isStaging: function() {
        return this.current() === this.staging;
    },
    // Are we running under the production environment.
    isProduction: function() {
        return this.current() === this.production;
    }
};

//need require os
// var browser = os.platform() === 'linux' ? 'google-chrome' : (
//   os.platform() === 'darwin' ? 'google chrome' : (
//   os.platform() === 'win32' ? 'chrome' : 'firefox'));

var gulp = require('gulp'),
    // concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require("gulp.spritesmith"),
    minifyCSS = require('gulp-clean-css'),
    plumber = require('gulp-plumber'),
    browserify = require('gulp-browserify'),

    jade = require('gulp-jade'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    open = require('gulp-open');

var concat = require('gulp-concat');

var minify = require('gulp-minify');


var distPath = "wwwroot/";

// console.log(environment.current());

// // Sass
gulp.task('sass', function() {
    gulp.src(['src/scss/**/*.scss', '!src/scss/**/_*.scss'])
        .pipe(plumber())
        .pipe(sass({
            errLogToConsole: true,
            includePaths: ['src/scss/**/**']
        }))
        .pipe(autoprefixer({
            browsers: ["last 4 versions", "Firefox >= 27", "Blackberry >= 7", "IE 8", "IE 9"],
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(distPath + 'css/'))
        .pipe(connect.reload());

});

// CSS Sprite
gulp.task('sprite', function() {
    var spriteData = gulp.src('src/images/sprites/**/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        padding: 10,
        exportOpts: { quality: 50 },
        cssTemplate: function(data) {
            var output = '';
            var v = Math.random();
            data.sprites.forEach(function(sprite) {
                output += [
                    '.' + sprite.name + ' {\n',
                    '  display: block;\n',
                    '  background-image: url(../images/' + sprite.image + '?v=' + v + ');\n',
                    '  background-position: ' + sprite.px.offset_x + ' ' + sprite.px.offset_y + ';\n',
                    '  width:' + sprite.px.width + ';\n',
                    '  height: ' + sprite.px.height + ';\n',
                    '/*source-image:' + sprite.source_image + '*/\n',
                    '}\n',
                    '@mixin ' + sprite.name + '() {\n',
                    '  display: block;\n',
                    '  background-image: url(../images/' + sprite.image + '?v=' + v + ');\n',
                    '  background-position: ' + sprite.px.offset_x + ' ' + sprite.px.offset_y + ';\n',
                    '  width:' + sprite.px.width + ';\n',
                    '  height: ' + sprite.px.height + ';\n',
                    '/*source-image:' + sprite.source_image + '*/\n',
                    '}\n'
                ].join('')
            });
            return output;
        }
    }));

    spriteData.img.pipe(gulp.dest(distPath + 'images/'));
    spriteData.css.pipe(gulp.dest('src/scss/'));
});



// Jade
gulp.task('jade', function() {
    gulp.src(['src/*.jade', '!src/_*.jade'])
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task('html', function() {
    gulp.src(distPath + '*.html')
        .pipe(connect.reload());
});

//Sever
gulp.task('connectDist', function() {
    connect.server({
        root: ['wwwroot/', 'src/'],
        port: 3001,
        livereload: true
    });
});

//Copy

gulp.task('copyJS', function() {
    gulp.src(['src/js/**/*.js'])
        .pipe(gulp.dest(distPath + 'js/'))
        .pipe(connect.reload());
});


gulp.task('js', function() {
    gulp.src('./src/app.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: ['vueify', 'babelify', 'aliasify'],
            debug: false
        }))
        .pipe(gulp.dest('./' + distPath + 'js/'))
        .pipe(connect.reload());
})

gulp.task('copyImg', function() {
    gulp.src(['src/images/*', '!src/images/sprite'])
        .pipe(gulp.dest(distPath + 'images'));
});

gulp.task('copyAssets', function() {
    gulp.src(['src/assets/**'])
        .pipe(gulp.dest(distPath + 'assets'));
});

gulp.task('copyAll', ['copyImg', 'copyAssets', 'copyJS'], function() {});

//Clean
gulp.task('reset', function() {
    gulp.src([distPath])
        .pipe(clean());
});


//Open
gulp.task('open', function() {
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3001'
            // app: 'google chrome'
        }));
});

// Watch
gulp.task('watch', function() {
    gulp.watch(['src/**/*.jade'], ['jade']);
    gulp.watch('src/scss/**/**.scss', ['sass']);
    gulp.watch(['src/app.js'], ['js']);
    gulp.watch(['src/components/**/*.vue'], ['js']);
    gulp.watch(['src/images/*'], ['copyImg']);
    gulp.watch(['src/images/sprites/*'], ['sprite']);
    gulp.watch([distPath + '*.html'], ['html']);
    gulp.watch('src/js/**/*.js', ['copyJS']);
    gulp.watch('wwwroot/js/app.js', ['jsConcatAll']);
});



gulp.task('jsConcatApp', function() {
    return gulp.src(['src/js/utility.js', 'wwwroot/js/app.js'])
        .pipe(concat('concatApp.js'))
        // .pipe(minify())
        .pipe(uglify())
        .pipe(gulp.dest('wwwroot/js/'));
});

gulp.task('jsConcatAll', ['jsConcatApp'], function() {
    return gulp.src(['src/js/jquery-3.1.1.min.js', 'src/js/firebase.js', 'src/js/vue.min.js', 'wwwroot/js/concatApp.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('wwwroot/js/'));
});


//Build
gulp.task('build', ['js', 'sprite', 'jade', 'sass', 'copyAll'], function() {});

//run
gulp.task('default', ['build', 'watch', 'connectDist', 'open'], function() {});

//public
gulp.task('public', ['build', 'watch', 'connectDist', 'jsConcatAll', 'open'], function() {});
