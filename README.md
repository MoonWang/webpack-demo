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