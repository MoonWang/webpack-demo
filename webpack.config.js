const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

let cssExtract = new ExtractTextWebpackPlugin('css/css.css');
let lessExtract = new ExtractTextWebpackPlugin('css/less.css');
let sassExtract = new ExtractTextWebpackPlugin('css/sass.css');

module.exports = {
    // 入口 默认 './src'
    entry: {
        index: './src/index.js',
        base: './src/base.js',
        // jquery: 'jquery'
    },
    // 出口 默认 './dist'
    output: {
        // 输出 路径
        path: path.join(__dirname, 'dist'),
        // 生成文件名
        // name 是 entry 的名字，此时为默认值 main ; hash 是根据文件内容计算的 hash 值
        filename: '[name].[hash:8].js'
    },
    module: {
        rules: [
            {
                // 匹配需要当前 loader 处理的文件
                test: /\.css$/,
                // 使用的 loader 
                // loader: ["style-loader", "css-loader"]
                // extract-text-webpack-plugin 插件需要首先用 css-loader 处理 css 文件
                loader: cssExtract.extract({
                    use: ["css-loader"]
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|bmp)$/,
                // use: 'file-loader'
                use: {
                    // loader: 'file-loader',
                    loader: 'url-loader',
                    options: {
                        outputPath: 'images/',
                        limit: 10 * 1024
                    }
                }
            },
            // {
            //     test: /\.(html|htm)$/,
            //     use: 'html-withimg-loader'
            // },
            {
                test: /\.less$/,
                // loader: ["style-loader", "css-loader", "less-loader"]
                loader: lessExtract.extract({
                    use: ["css-loader", "less-loader"]
                })
            },
            {
                test: /\.scss$/,
                // loader: ["style-loader", "css-loader", "sass-loader"]
                loader: sassExtract.extract({
                    use: ["css-loader", "sass-loader"]
                })
            },
        ]
    },
    plugins: [
        // 清除指定目录，默认 `output.path` 路径下
        new CleanWebpackPlugin(),
        // 自动产出 html 文件
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            title: 'wang', // 可以在模板这种用 htmlWebpackPlugin.options.xx 传参
            chunks: ['index'], // 可以指定需要引入的 chunk ，默认所有
            hash: true, // 会在引入的 js 里加入查询字符串避免缓存，在 output.filename 是固定字符串的时候有用
            minify: {
                removeAttributeQuotes: true // 去掉属性的引号，防 xss 攻击？
            }
        }),
        // 不需要引入第三方包，可以直接使用
        // new webpack.ProvidePlugin({
        //     $: 'jquery'
        // }),
        cssExtract,
        lessExtract,
        sassExtract,
    ],
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 8081,
        compress: true // gzip 压缩 
    }
};