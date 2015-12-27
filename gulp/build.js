var gulp = require('gulp');

module.exports = function () {
    gulp.task('build', ['webpack:build']);
};
