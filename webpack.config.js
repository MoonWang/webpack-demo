const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: './src_l/main.js',
    },
    output: {
        // 输出 路径
        path: path.join(__dirname, 'dist_l'),
        filename: '[name].js',
    },
    resolveLoader: {
        modules: [
            path.resolve(__dirname, 'loaders'),
            path.resolve('node_modules')
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // loader: path.resolve(__dirname, 'loaders', 'log-loader.js')
                loader: 'log-loader'
            },
            {
                test: /\.less/,
                loader: ['style-loader', 'less-loader']
            }
        ]
    },
};