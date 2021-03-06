const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const HappyPack = require('happypack');

const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

let cssExtract = new ExtractTextWebpackPlugin('css/css.css');
// let lessExtract = new ExtractTextWebpackPlugin('css/less.css');
// let sassExtract = new ExtractTextWebpackPlugin('css/sass.css');

module.exports = {
    // 入口 默认 './src'
    entry: {
        // index: './src/index.js',
        // base: './src/base.js',
        main: './src/main.js',
        // jquery: 'jquery'
        // pageA: './src/pageA',
        // pageB: './src/pageB',
        // pageC: './src/pageC',
    },
    // 出口 默认 './dist'
    output: {
        // 输出 路径
        path: path.join(__dirname, 'dist'),
        // 生成文件名
        // name 是 entry 的名字，此时为默认值 main ; hash 是根据文件内容计算的 hash 值
        filename: '[name].[hash:8].js',
        // publicPath: '//cdn.com.cn/'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                // 不同页面之间的公用模块
                commons: {
                    name: 'common', // 默认自动生成， boolean: true | function (module, chunks, cacheGroupKey) | string
                    chunks: "initial", // 表示将选择哪些块进行优化，可设为 all、async、initial
                    minChunks: 2, // 最少有2个模块中复用
                    maxInitialRequests: 5,
                    minSize: 0 
                },
                // 第三方模块
                vendor: {
                    test: /node_modules/, // 控制此缓存组选择的模块，默认选择所有模块
                    chunks: "initial",
                    name: "vendor",
                    priority: 10, // 优先级，默认-10
                    enforce: true
                }
            }
        }
    },
    module: {
        // 设置不解析模块
        noParse: [/react\.min\.js/],
        rules: [
            {
                // 匹配需要当前 loader 处理的文件
                test: /\.css$/,
                // 使用的 loader 
                use: ["style-loader", "css-loader"]
                // extract-text-webpack-plugin 插件需要首先用 css-loader 处理 css 文件
                // loader: cssExtract.extract({
                //     use: ["css-loader", "postcss-loader"]
                // })
                // loader: "happypack/loader?id=css"
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
            // {
            //     test: /\.less$/,
            //     // loader: ["style-loader", "css-loader", "less-loader"]
            //     loader: lessExtract.extract({
            //         use: ["css-loader", "less-loader"]
            //     })
            // },
            // {
            //     test: /\.scss$/,
            //     // loader: ["style-loader", "css-loader", "sass-loader"]
            //     loader: sassExtract.extract({
            //         use: ["css-loader", "sass-loader"]
            //     })
            // },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader?cacheDirectory',
                    query: {
                        presets: [["env", {modules: false}], "stage-0", "react"]
                    }
                },
                // loader: 'happypack/loader?id=jsx',
                // include: path.resolve(__dirname,'src'),
                // exclude: /node_modules/
            }
        ]
    },
    resolve: {
        // 配置别名，用于缩短路径
        alias: {
            'react': path.resolve(__dirname, './node_modules/react/cjs/react.production.min.js')
        },
        // 自动解析确定的扩展，优先级从前往后
        // extensions: [".js", ".json"],
        // 显式声明模块查找目录
        modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'lib')],
        // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
        mainFields: ['jsnext:main', 'browser', 'main']
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
        // lessExtract,
        // sassExtract,
        // new UglifyjsWebpackPlugin(),
        // 使用动态链接库
        // new webpack.DllReferencePlugin({
        //     // 配置引入需要用到的配置文件
        //     manifest: require(path.join(__dirname, 'dist', 'react.manifest.json')),
        // }),
        // new HappyPack({
        //     id: 'css',
        //     loaders: ['style-loader', 'css-loader']
        // }),
        // new HappyPack({
        //     id: 'jsx',
        //     loaders: [{
        //         loader: 'babel-loader',
        //         query: {
        //             // cacheDirectory,
        //             presets: [["env", {modules: false}], "stage-0", "react"]
        //         }
        //     }],
        // }),

        // new ParallelUglifyPlugin({
        //     workerCount: 3, // 开启几个子进程去并发的执行压缩，默认是当前运行电脑的 CPU 核数减去1
        //     uglifyJS: {
        //         output: {
        //             beautify: false, //不需要格式化
        //             comments: false, //不保留注释
        //         },
        //         compress: {
        //             warnings: false, // 在 UglifyJs 删除没有用到的代码时不输出警告
        //             drop_console: true, // 删除所有的 `console` 语句，可以兼容 ie 浏览器
        //             collapse_vars: true, // 内嵌定义了但是只用到一次的变量
        //             reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
        //         }
        //     }
        // }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // 开启 Scope Hoisting
        new ModuleConcatenationPlugin(),
    ],
    devServer: {
        hot: true,
        contentBase: './dist',
        host: 'localhost',
        port: 8084,
        compress: true // gzip 压缩 
    },
    // devtool: 'source-map'
    // devtool: 'cheap-module-source-map'
    // devtool: 'eval-source-map'
    // devtool: 'cheap-module-eval-source-map'
};