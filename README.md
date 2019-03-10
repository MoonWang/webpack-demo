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
