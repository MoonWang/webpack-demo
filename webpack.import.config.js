const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        lazy: './src/lazy.js'
    },
    output: {
        path: path.join(__dirname, 'dist1'),
        filename: '[name].[hash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader?cacheDirectory',
                    query: {
                        presets: [["env", {modules: false}], "stage-0", "react"]
                    }
                },
            }
        ]
    },
    resolve: {

    },
    plugins: [
        // 清除指定目录，默认 `output.path` 路径下
        new CleanWebpackPlugin(),
        // 自动产出 html 文件
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            title: 'wang', // 可以在模板这种用 htmlWebpackPlugin.options.xx 传参
            // chunks: ['index'], // 可以指定需要引入的 chunk ，默认所有
        }),
    ]
};