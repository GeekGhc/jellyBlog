var gulp =require('gulp');

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

gulp.task('css',function () {
    gulp.src('assets/css/source/*.css')
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest('assets/css/')); //压缩后的路径
})

gulp.task('scripts',function () {
    gulp.src('assets/js/source/*.js')
        .pipe(plugins.uglify())
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('assets/js/')); //压缩后的路径
})
gulp.task('default', ['css', 'scripts']);