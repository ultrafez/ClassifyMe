var gulp = require('gulp');
var webpackConfig = require('../webpack.config.js');
var webpack = require('webpack');
var gutil = require('gulp-util');

var paths = [
    'assets/js/**/*'
];

module.exports = function () {
    gulp.task('webpack:watch', ['webpack:build-dev'], function () {
        gulp.watch(paths, ['webpack:build-dev']);
    });

    gulp.task('webpack:build', function (callback) {
        var buildConfig = Object.create(webpackConfig);

        buildConfig.plugins = buildConfig.plugins.concat(
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        );

        webpack(buildConfig, function (err, stats) {
            if (err) throw new gutil.PluginError('webpack:build', err);

            gutil.log('[webpack:build]', stats.toString({colors: true}))

            callback();
        });
    });


    var devConfig = Object.create(webpackConfig);
    devConfig.devtool = 'inline-source-map';
    devConfig.debug = true;
    var devWebpack = webpack(devConfig);

    gulp.task('webpack:build-dev', function (callback) {
        devWebpack.run(function (err, stats) {
            if (err) throw new gutil.PluginError('webpack:build-dev', err);

            gutil.log('[webpack:build-dev]', stats.toString({colors: true}));

            callback();
        });
    });
}
