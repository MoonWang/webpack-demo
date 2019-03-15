# 一、快速开始

> [webpack 中文文档](https://www.webpackjs.com/configuration/)

## 1.1 配置并打包

- 本地安装
    ```base
    $ npm i webpack webpack-cli -D
    ```
- 配置启动
    ```json
    "scripts": {
        "build": "webpack --mode development"
    },
    ```
- 配置 config.js
    ```javascript
    module.exports = {
        entry: './src/index.js',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'bundle.js'
        }
    }
    ```
- 执行打包
    ```bash
    npm run build
    ```

### 打包文件说明

```javascript
/**
 * 输出文件是一个自执行函数 webpackBootstrap 
 * 参数是一个对象 { moduleId: function(){ eval(源代码) } }
 */
(function (modules) {
    // 模块缓存
    var installedModules = {};

    // 声明一个 require 方法，模仿 commonjs
    function __webpack_require__(moduleId) {

        // 判断是否存在缓存（已加载过）
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // 创建一个新的模块，并添加到缓存中
        var module = installedModules[moduleId] = {
            i: moduleId, // 模块 ID
            l: false, // 加载标识
            exports: {} // 导出对象
        };

        // 执行模块函数，初始化
        // 参数：改变 this 指针、当前模块 this、当前模块导出对象、require 方法（用于加载其他方法 ）
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // 标识模块为已加载
        module.l = true;

        // 返回导出对象
        return module.exports;
    }

    // 加载入口模块，并导出 exports 对象
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})({
    "./src/index.js": (function (module, exports) {
        eval("console.log('hello webpack');\n\ndocument.getElementById('app').innerHTML = 'moon';\n\n//# sourceURL=webpack:///./src/index.js?");
    })
});
```

## 1.2 使用 loader 

> 加载非 js 模块文件时，需要使用 loader 对其进行转换

- 安装
    ```bash
    $ npm i style-loader css-loader -D
    ```
- 配置
    ```javascript
    module: {
        rules: [
            {
                // 匹配需要当前 loader 处理的文件
                test: /\.css$/,
                // 使用的 loader ，多个 loader 有执行顺序要求，为从右向左
                // css-loader 解析处理 css 文件中的 url 路径，并把 css 文件变成一个模块
                // style-loader 把 css 文件变成 style 标签插入 
                loader: ["style-loader", "css-loader"]
            }
        ]
    },
    ```

## 1.3 项目预览 devServer

- 安装
    ```bash
    $ npm i webpack-dev-server -D
    ```
- 配置
    ```json
    "scripts": {
        "dev": "webpack-dev-server --mode development"
    },
    ```
    ```javascript
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 8080,
        // gzip 压缩 
        compress: true,
        // 请求代理
        proxy: {
            // 注意：/api/ 代理时不会被携带，/api 代理时会被携带
            '/api/': {
                target: 'http://www.baidu.com/',
                pathRewrite: {
                    '^/api': ""
                },
                secure: false,
                changeOrigin: true,
            }
        }
    }
    ```
- 说明
    - dev-server 打包生成的文件是存放在内存中的
    - dev-server 服务器的静态文件提供目录是根据 contentBase 定位，推荐绝对路径

## 1.4 使用 plugin

> html-webpack-plugin 插件用于自动生成 html 文件，并自动引入 js 脚本；clean-webpack-plugin 用于清除指定目录

- 安装
    ```base
    $ npm i html-webpack-plugin -D
    $ npm i clean-webpack-plugin -D
    ```
- 配置
    ```javascript
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ],
    ```

## 1.5 多入口

- 多入口配置
    ```javascript
    entry: {
        index: './src/index.js',
        base: './src/base.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index'], // 可以指定需要引入的 chunk ，默认所有
        })
    ],
    ```

## 1.6 打包第三方库

- 直接引用
    - 在需要的模块这种直接引入
    - 但是开发体验差，每个都要引入；且都会被打包，输出文件体积都比较大
- 插件注入
    - 配置，文件中可以直接使用 $ ，无需引入
        ```
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
        ```
    - 但是每个文件都打包了 jquery ，体积仍然很大
- 增加入口
    - 增加一个 entry 入口，增加一个 HtmlWebpackPlugin 中的 chunks
    - 但是 $ 无法跨模块引用，会报错
    - 可以考虑将 $ 暴露到全局，expose-loader

## 1.7 使用图片

- 安装
    ```base
    $ npm i file-loader url-loader -D
    $ npm i html-withimg-loader -D
    ```
- 说明
    - file-loader 
        - 用于解析图片地址(任意二进制文件)，把图片从源位置拷贝到目标位置并且修改原引用地址
            - css 中、js 中都可以使用
        - 默认是拷贝到 output.path 下，可以通过设置 outputPath 参数指定目标路径
    - url-loader
        - 将文件转成 base64 字符串嵌入(默认全部转换)
        - 如果需要通过路径引用较大图片，设置 limit 参数即可
    - html-withimg-loader(非常用)
        - 用于解析 html 文件，并替换其中的 img 地址
        - 还跟 HtmlWebpackPlugin 冲突了，将 <%= xx %> 解析成了字符串，不要用了

## 1.8 css 预处理、后处理

- 预处理
    - 安装
        ```base
        $ npm i less less-loader node-sass sass-loader -D
        ```
    - 配置
        ```javascript
        module: {
            rules: [
                {
                    test: /\.less$/,
                    loader: ["style-loader", "css-loader", "less-loader"]
                },
            ]
        },
        ```
- 后处理
    - 安装
        ```base
        $ npm i postcss-loader autoprefixer -D
        ```
    - 配置
        ```javascript
        loader: ["style-loader", "css-loader", "postcss-loader"]
        ```
        ```javascript
        // postcss.config.js
        module.exports = {
            plugins: [require('autoprefixer')]
        };
        ```

## 1.9 提取 css 文件

- 安装
    - 该插件不支持 v4 需要用 next 版本
    ```base
    $ npm i extract-text-webpack-plugin@next -D
    ```
- 配置
    ```javascript
    const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
    let cssExtract = new ExtractTextWebpackPlugin('css/css.css');
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    // extract-text-webpack-plugin 插件需要首先用 css-loader 处理 css 文件
                    loader: cssExtract.extract({
                        use: ["css-loader"]
                    })
                },
            ]
        },
        plugins: [
            cssExtract
        ],
    };
    ```
- 问题
    - css 文件中的图片路径存在问题，待解决

## 1.10 转义 ES6/ES7/JSX 

- 安装
    ```base
    $ npm i babel-loader babel-core babel-preset-env babel-preset-stage-0 babel-preset-react -D
    ```
    - 报错： Cannot find module '@babel/core' 
    - 说明：官方默认 babel-loader | babel 对应的版本需要一致，即 babel-loader 需要搭配最新版本 babel
    - 解决：
        - 回退低版本 
            - npm install -D babel-loader@7 babel-core babel-preset-env babel-preset-stage-0 babel-preset-react
            - 报错：Couldn't find preset "@babel/preset-env" relative to directory "webpack/node_modules/css-loader"
            - 原因：编译了 node_modules 下的文件
            - 解决：给 js loader 添加配置 `exclude: /node_modules/`
        - 升级高版本 
            - npm install -D babel-loader @babel/core @babel/preset-env @babel/preset-stage-0 @babel/preset-react
            - 对应的 presets 参数也要修改成 '@babel/react' ，比较繁琐，还是先回退低版本处理
- 配置
    ```javascript
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ["env", "stage-0", "react"]
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    ```

## 1.11 [调试 devtool](https://www.webpackjs.com/configuration/devtool/)

- 设置
    ```javascript
    devtool: 'eval-source-map'
    ```
- 说明
    - source-map 
        - 把映射文件生成到单独的文件，`最完整最慢`
        - 生成单独 map 调试文件，可以定位到`出错列`
    - cheap-module-source-map 
        - 在一个单独的文件中产生一个不带列映射的Map
        - 生成单独 map 调试文件，体积更小，但只能定位到`出错行`
    - eval-source-map 
        - 使用 eval 打包源文件模块，在`同一个文件`中生成完整 sourcemap
        - 没有生成单独文件
    - cheap-module-eval-source-map 
        - sourcemap 和打包后的 JS 同行显示，没有映射列
        - 没有生成单独文件，只定位到行

## 1.12 css 压缩

> 旧版本的 css-loader 可以通过添加参数 minimize 来实现压缩，v1.0 版本以后已废除。
> 报错：CSS Loader Invalid Options  —— options should NOT have additional properties

- 安装
    ```bash
    $ npm i cssnano -D
    ```
- 配置
    ``` javascript
    // postcss.config.js
    module.exports = {
        plugins: [
            require('autoprefixer'),
            require('cssnano')
        ]
    };
    ```

## 1.13 js 压缩

- development 模式下可以通过 UglifyJsPlugin 插件
- production 模式下默认启用该插件

## 1.14 配置模块别名，简化引用

```javascript
resolve: {
    alias: {
        Utilities: path.resolve(__dirname, 'src/utilities/')
    },
    // 自动解析确定的扩展，优先级从前往后
    extensions: [".js", ".json"]
}
```

# 二、常用优化

> 项目较小的时候，优化的意义不大，浪费资源和时间，有时候还会适得其反；当项目打包速度超出忍耐度时再考虑优化。

## 2.1 优化 loader 配置

```javascript
module:{
    // 忽略对部分没采用模块化的文件的递归解析处理，下面配置 alias 在用
    noParse: [/react\.min\.js/],
    rules:[
        {
            test: /\.jsx?$/,
            // 开启缓存
            use: ['babel-loader?cacheDirectory'],
            // 缩小命中范围，只编译需要的目录
            include: path.resolve(__dirname,'src'),
            // 设定排除范围，其实这个一定要有，不然可能会造成其他 loader 无法使用（前面的例子）
            exclude: /node_modules/
        }
    ]
},
resolve: {
    // 设置解析时的 modules 包路径，建议用绝对路径，因为相对路径将类似于 Node 查找 'node_modules' 的方式进行查找。
    // 如果有自定义的包，可以设置多个目录，优先级从前向后
    modules: [path.resolve(__dirname, 'node_modules')],
    // 在导入语句没带文件后缀时，Webpack会自动带上后缀后去尝试询问文件是否存在 默认后缀是 extensions: ['.js', '.json']
    // 后缀列表尽可能小，频率最高的往前方，导出语句里尽可能带上后缀(js之外的建议都写上)
    extensions: ['js'],
    // 可以直接查到包的具体位置，此时会直接查找这个，而不再去查找 resolve.modules 指定的目录
    alias: {
        'react': path.resolve(__dirname, './node_modules/react/cjs/react.production.min.js')
    }
},
```

## 2.1 使用 DLL 动态链接库文件加载框架模块

1. 新建 DLL 打包配置

```javascript
module.exports = {
    entry: {
        // react 模块打包到一个动态连接库
        react: ['react']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_dll.js', // 输出动态连接库的文件名称
        libraryTarget: 'var', // 默认 var ，其他看文档
        library: '_dll_[name]' // libraryTarget 为 var 时，全局变量的名字，其它会从此变量上获取到里面的模块
    },
    plugins: [
        // 用于打包出一个个动态连接库
        new webpack.DllPlugin({
            // 该 name 要是 output.library 相同
            name: '_dll_[name]',
            // manifest 表示一个描述文件
            path: path.join(__dirname, 'dist', 'react.manifest.json')
        })
    ]
}
```

2. 使用动态链接库文件构建

```javascript
new webpack.DllReferencePlugin({
    // 配置引入需要用到的配置文件
    manifest: require(path.join(__dirname, 'dist', 'react.manifest.json')),
})
```

顺序：先构建 dll 文件，存在依赖关系

说明：这东西怎么使用才是最佳体验，有待商榷，感受不到优化之美

## 2.3 HappyPack

> Node 单线程，HappyPack 让 webpack 将任务分解成多个子进程并发的执行，子进程处理完后再把结果发送给主进程

- 安装
    ```bash
    $ npm i happypack -D
    ```
- 使用
    ```javascript
    module: {
        rules: [
            {
                test: /\.css$/,
                // id 对应下面实例化插件时的 id，一对一创建子进程
                loader: "happypack/loader?id=css"
            },
            {
                test: /\.jsx?$/,
                loader: 'happypack/loader?id=jsx',
                include: path.resolve(__dirname,'src'),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'css',
            loaders: ['style-loader', 'css-loader']
        }),
        new HappyPack({
            id: 'jsx',
            loaders: [{
                loader: 'babel-loader',
                query: {
                    presets: ["env", "stage-0", "react"]
                }
            }],
        }),
    ]
    ```

## 2.4 ParallelUglifyPlugin

快速压缩 js

- 安装
    ```bash
    $ npm i webpack-parallel-uglify-plugin -D
    ```
- 配置
    ```javascript
    new ParallelUglifyPlugin({
        workerCount: 3, // 开启几个子进程去并发的执行压缩，默认是当前运行电脑的 CPU 核数减去1
        uglifyJS: {
            output: {
                beautify: false, //不需要格式化
                comments: false, //不保留注释
            },
            compress: {
                warnings: false, // 在 UglifyJs 删除没有用到的代码时不输出警告
                drop_console: true, // 删除所有的 `console` 语句，可以兼容 ie 浏览器
                collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
            }
        }
    })
    ```

## 2.5 [模块热替换](https://www.webpackjs.com/guides/hot-module-replacement/)

- 配置
    ```javascript
    devServer: {
        hot: true,
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        // 需要该插件才能完全启用 HMR ，如果是 --hot 方式启动 webpack 会自动添加，此处使用的配置声明，所以要加上
        new webpack.HotModuleReplacementPlugin(), 
    ]
    ```
- 定义接口
    ```javascript
    if (module.hot) {
        // 如果检测到了 index.js 模块更新，则会调用后面的回调函数
        module.hot.accept('./index.js', function () {
            console.log('accept index.js');
            // do something
        });
    }
    ```

## 2.6 [Tree Shaking](https://www.webpackjs.com/guides/tree-shaking/)

- 配置
    ```javascript
    // 修改 .babelrc 文件
    {
        "presets": [ 
            ["env", { "modules": false }]
        ]
    }
    ```
- 只作用于符合` ES6 模块系统`规范的模块
    - 即使用 import 导入 和 export 导出
- 为了方便查看哪些模块有用，哪些没用，可以在启动命令中加入下面参数
    - --display-used-exports
- 开发的时候并没有效果，需要在生产模式下才有用(代码压缩)
    - 用 mode: "production" （v4版本）
    - 注意：`不要开启 devtool`


## 2.7 [提取公共代码](https://www.webpackjs.com/plugins/split-chunks-plugin/)

> 旧版的 CommonsChunkPlugin 已经废弃

```

```