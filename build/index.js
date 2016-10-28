var browserify = require('browserify');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var babel = require("gulp-babel");
var less = require('gulp-less');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var minify = require('gulp-minify-css');

var merge = require('merge-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var mithrilify = require('mithrilify');
mithrilify.hasMithrilExtension = function (file) {
    return /\.(jsx)$/.test(file);
}

var vendors = [
    'mithril'
    , 'lw-model'
    , 'handlebars'
];

var cssPrefix = 'hb-forms';
var distPath = __dirname + '/../dist';
var bundlesPath = __dirname + '/../bundles/';
var stylesPath = __dirname + '/../src/';

var fs = require('fs');
var files = fs.readdirSync(bundlesPath);
files = files.filter(n=>{ return n.match(/\.js$/) });

files.forEach(filename=>{
    gulp.task('build:'+filename, function () {
        return browserify({
            debug:true
            , entries: [bundlesPath+filename]
            , extensions: [".js", ".jsx" ]
        })
            .transform(mithrilify)
            .external(vendors)
            .bundle()
            .on('error', function(err){
                console.log('\n' + err.message);
                err.stream.emit('end');
            })
            .pipe(source(filename))
            .pipe(buffer())
            .pipe(babel({presets: ['es2015']}))
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify({mangle:false}))
            .on('error', gutil.log)
            .pipe(sourcemaps.write('/'))
            .pipe(gulp.dest(distPath));
    });
})

gulp.task('build:vendors.js', function () {
    var b = browserify({debug:true});
    vendors.forEach(lib=>{
        b.require(lib);
    });
    return b.bundle()
        .pipe(source('vendors.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(distPath));
});


gulp.task('build:app.css', function () {
    var lessStream = gulp.src(stylesPath+'**/*.less')
        .pipe(concat('src.css'))
        .pipe(replace(/^/, '.'+cssPrefix+'{'))
        .pipe(replace(/$/, '}'))
        .pipe(less())
        .on('error', function(err){
            console.log('\n' + err.message );
            this.end();
        });

    var cssStream = gulp.src(stylesPath+'**/*.css')
        .pipe(concat('src.css'));

    return merge(cssStream, lessStream)
        .pipe(concat('app.css'))
        .pipe(minify())
        .pipe(gulp.dest(distPath));
});


var startTime = new Date().getTime();
process.stdout.write(timestamp() + ' Building .');
var building = setInterval(()=>{ process.stdout.write('.') }, 1000);
gulp.start(['build:app.css','build:vendors.js']
        .concat(files.map(file=>'build:'+file))
    , err=>{
    clearInterval(building);
    console.log(' ');
    if(err) return console.error(err);
    console.log(timestamp() + ' build complete in ' + Math.round((new Date().getTime()-startTime)/1000) + 's')
});

function timestamp(){
    return new Date().toString().match(/[0-9:]{8}/)[0];
}