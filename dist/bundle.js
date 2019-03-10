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


    // 向外暴露模块对象，webpackBootstrap 的参数对象
    __webpack_require__.m = modules;

    // 向外暴露模块缓存 
    __webpack_require__.c = installedModules;


    // 判断是否存在的 OwnProperty 的工具方法
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };

    // 定义 getter 方法，用于兼容 exports 
    __webpack_require__.d = function (exports, name, getter) {
        // 判断是否存在 OwnProperty 
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter
            });
        }
    };

    // 在导出对象上定义 __esModule ，为了兼容 ES6-module 和 CommonJs-module 语法混写
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, {
                value: 'Module'
            });
        }
        Object.defineProperty(exports, '__esModule', {
            value: true
        });
    };

    // 创建一个伪命名空间对象，用于异步加载、代码分割？（后面再学习）
    __webpack_require__.t = function (value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, 'default', {
            enumerable: true,
            value: value
        });
        if (mode & 2 && typeof value != 'string')
            for (var key in value) __webpack_require__.d(ns, key, function (key) {
                return value[key];
            }.bind(null, key));
        return ns;
    };

    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ?
            function getDefault() {
                return module['default'];
            } :
            function getModuleExports() {
                return module;
            };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    // 对应于 output.publicPath 公开路径
    __webpack_require__.p = "";

    // 加载入口模块，并导出 exports 对象
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})({
    "./src/index.js": (function (module, exports) {
        eval("console.log('hello webpack');\n\ndocument.getElementById('app').innerHTML = 'moon';\n\n//# sourceURL=webpack:///./src/index.js?");
    })
});
