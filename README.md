# 一、快速开始

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
        compress: true
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
            - 解决：先暂时注释掉 css 文件的引入 TODO 为什么？
        - 升级高版本 
            - npm install -D babel-loader @babel/core @babel/preset-env @babel/preset-stage-0 @babel/preset-react
            - 对应的 presets 参数也要修改成 '@babel/react' ，比较繁琐，还是先回退低版本处理
- 配置
    ```javascript

    ```