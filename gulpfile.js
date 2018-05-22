var gulp = require('gulp');
var concat = require('gulp-concat');
var header = require('gulp-header');
var connect = require("gulp-connect");
var less = require("gulp-less");
var autoprefixer = require('gulp-autoprefixer');
var ejs = require("gulp-ejs");
var uglify = require('gulp-uglify');
var ext_replace = require('gulp-ext-replace');
var cssmin = require('gulp-cssmin');
var rev = require('gulp-rev'); //- 对css、js文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
var clean = require('gulp-clean'); //- 用于删除文件
var pkg = require("./package.json");
var imagemin = require('gulp-imagemin'); //- 压缩图片
var sass = require('gulp-sass');
var include = require('gulp-file-include');
var runsequence = require('gulp-sequence');
var babel = require('gulp-babel');
var minimist = require('minimist');
var gutil = require('gulp-util');
var base64 = require('gulp-base64');
var banner =
    "/** \n\
* Create By Caijs\n\
* Copyright © 2017 www.zgxyzx.net All Right Reserved\n\
*/\n";

var knowOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'test'
    }
};
var options = minimist(process.argv.slice(2), knowOptions);
gulp.task('clean', function () {
    return gulp.src('./dist')
        .pipe(clean());
});
//生成filename文件，存入string内容
function string_src(filename, string) {
    var src = require('stream').Readable({
        objectMode: true
    })
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }))
        this.push(null)
    }
    return src;
}
//复制js文件，仅供开发环境使用
gulp.task('js', function () {
    return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist/js'))
        .pipe(connect.reload());
});
//js文件进行压缩以及hash数组重命名
gulp.task('uglify', function (event) {
    return gulp.src(['./src/js/*.js'])
        .pipe(babel())
        .pipe(uglify().on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        })).pipe(rev()).pipe(gulp.dest('./dist/js'))
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json       
        .pipe(gulp.dest('./rev-js/')) //- 将rev-manifest.json保存到 rev-js 目录内        
        .pipe(connect.reload())
});
//转换sass
gulp.task('sass', function () {
    return gulp.src(['./src/sass/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(connect.reload());
});
//css文件压缩以及hash数组重命名
gulp.task('cssmin', ['sassmin'], function (event) {
    return gulp.src(['./src/css/*.css'])
        .pipe(cssmin())
        .pipe(base64({
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            maxImageSize: 8 * 1024, // bytes
            // debug: true 
        }))
        .pipe(header(banner))
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('./dist/css/'))
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev-css/')) //- 将rev-manifest.json保存到rev-css目录内
        .pipe(connect.reload())
});
gulp.task('sassmin', function () {
    return gulp.src(['./src/sass/*.scss', './src/sass/*.css'])
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'))
        .pipe(connect.reload());
});

//进行include转换，并复制html
gulp.task('ejs', function (event) {
    return gulp.src(["./src/*.html"])
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest("./dist/"))
        .pipe(connect.reload());
});
/*修改html文件的link标签和script标签引用的css和js文件名，并把html文件输出到指定的位置*/

/*压缩并复制图片,并给图片命名(md5/hash)*/
gulp.task('compress-img', function () {
    return gulp.src('./src/images/*.?(png|jpg|gif|svg)') //原图片的位置
        .pipe(imagemin()) //执行图片压缩
        .pipe(rev())
        .pipe(gulp.dest('./dist/images/')) //压缩后的图片输出的位置
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev-img/')) //- 将rev-manifest.json保存到 rev-js 目录内
        .pipe(connect.reload());
});

gulp.task('rev-html', function () { //- compress-css和compress-js任务执行完毕再执行rev-index任务
    /*修改index.html文件的link标签和script标签引用的css和js文件名，并把html文件输出到指定的位置*/
    gulp.src(['./rev-css/*.json', './rev-js/*.json', './rev-img/*.json', './rev-js/ben/*.json', './src/index.html']) //- 读取两个rev-manifest.json文件以及需要进行css和js名替换的html文件
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(revCollector()) //- 执行文件内css和js名的替换
        .pipe(gulp.dest('./dist/')) //- 替换后的html文件输出的目录
        .pipe(connect.reload());

    /*修改其它html文件的link标签和script标签引用的css和js文件名，并把html文件输出到指定的位置*/
    gulp.src(['./rev-css/*.json', './rev-js/*.json', './rev-img/*.json', './rev-js/ben/*.json', './src/*.html', '!./src/_*.html']) //- 读取两个rev-manifest.json文件以及需要进行css和js名替换的html文件
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(revCollector()) //- 执行文件内css和js名的替换

        .pipe(gulp.dest('./dist/')) //- 替换后的html文件输出的目录
        .pipe(connect.reload());
});
gulp.task('rev-img', function () {
    gulp.src(['./rev-img/*.json', './dist/css/*.css']) //- 读取两个rev-manifest.json文件以及需要进行css和js名替换的html文件
        .pipe(revCollector()) //- 执行文件内css和js名的替换
        .pipe(gulp.dest('./dist/css/')) //- 替换后的html文件输出的目录
        .pipe(connect.reload());
});
gulp.task('copy', function (event) {
    gulp.src(['src/lib/**/*'])
        .pipe(gulp.dest('./dist/lib/'))
        .pipe(connect.reload());

    gulp.src(['src/images/*.?(png|jpg|gif|svg)'])
        .pipe(imagemin()) //执行图片压缩
        .pipe(gulp.dest('./dist/images/'))
        .pipe(connect.reload());

    gulp.src(['src/css/*.css'])
        .pipe(gulp.dest('./dist/css/'))
        .pipe(connect.reload());
});
// gulp.task('Bensbug', function () {
//     return gulp.src('./src/js/information.js')
//         .pipe(rev())
//         .pipe(gulp.dest('./dist/js'))
//         .pipe(rev.manifest()) //- 生成一个rev-manifest.json
//         .pipe(gulp.dest('./rev-js/ben')) //- 将rev-manifest.json保存到 rev-js 目录内
//         .pipe(connect.reload());
// });
// 根据命令行 --env +参数进行不同环境的变量配置
gulp.task('constants', function () {
    //读入config.json文件
    var myConfig = require('./config.json');
    //取出对应的配置信息
    var envConfig = myConfig[options.env];
    var conConfig = 'appconfig = ' + JSON.stringify(envConfig);
    //生成config.js文件
    return string_src("config.js", conConfig)
        .pipe(gulp.dest('./src/js'))
});
gulp.task('watch', function () {
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/less/*.less', ['less']);
    gulp.watch('src/*.html', ['ejs']);
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/images/*.?(png|jpg|gif|svg)', ['copy']);
});
gulp.task('test', ['clean'], runsequence(['clean'], ['cssmin'], ['js'], ['sass'], ['ejs'], ['copy']));
gulp.task('server', function () {
    connect.server({
        port: 8018, //指定端口号，在浏览器中输入localhost:8080就可以直接访问生成的html页面
        root: './', //指定html文件起始的根目录
        livereload: true //启动实时刷新功能（配合上边的connect.reload()方法同步使用）
    });
});
gulp.task("default", ['test', 'watch', 'server']);
gulp.task("build", runsequence(['clean'], ['cssmin'], ['uglify'], ['compress-img'], ['rev-html'], ['rev-img']));