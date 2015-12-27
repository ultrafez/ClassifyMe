var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./assets/js/main.jsx",
    output: {
        path: path.join(__dirname, 'public', 'js'),
        filename: 'bundle.js',
        publicPath: '/js/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    module: {
        loaders: [
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react',
        }),
    ],
};