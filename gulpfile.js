const gulp = require('gulp');
const fs = require('fs');
const javascriptObfuscator = require('gulp-javascript-obfuscator');
const concat = require('gulp-concat');

gulp.task('obfuscator', function () {
    return gulp.src('amazon.js')
        .pipe(javascriptObfuscator({
            "deadCodeInjection" : false
        }))
        .pipe(gulp.dest('dist'));
});


gulp.task('concat', function() {
    return gulp.src(['dist/pre-amazon.js', 'dist/amazon.js'])
        .pipe(concat('amazon.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (done) {
    fs.unlink('dist/pre-amazon.js', function (err) {
        if (err) { throw err; }
        done();
    });
});

gulp.task('package', gulp.series('obfuscator', 'concat', 'clean'));