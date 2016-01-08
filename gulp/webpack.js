var gulp = require('gulp');
var webpackConfig = require('../webpack.config.js');
var webpack = require('webpack');
var gutil = require('gulp-util');
var WebpackDevServer = require('webpack-dev-server');

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

    gulp.task('webpack:dev-server', function (callback) {
        var dsConfig = Object.create(webpackConfig);
        dsConfig.devtool = 'inline-source-map';
        dsConfig.debug = true;
        dsConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080');

        var myWebpack = webpack(dsConfig);

        new WebpackDevServer(myWebpack, {
            publicPath: '/public' + dsConfig.output.publicPath,
            stats: {
                colors: true,
            },
        }).listen(8080, 'localhost', function(err) {
            if (err) throw new gutil.PluginError('webpack-dev-server', err);
            gutil.log('[webpack-dev-server]', 'listening');
        })
    });
}
