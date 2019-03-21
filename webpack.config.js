const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const InlinePlugin = require('./plugins/inline-plugin');

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
            },
            {
                test: /\.html/,
                use: {
                    loader: 'html-layout-loader',
                    options: {
                        layout: path.resolve(__dirname, 'src_l', 'layout.html'),
                        placeholder: '{{__content__}}'
                    }
                }
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src_l/pageA.html',
            filename: 'pageA.html'
        }),
        new InlinePlugin()
    ]
};