/**
 * 输出文件是一个自执行函数 webpackBootstrap 
 * 参数是一个对象 { moduleId: function(){ eval(源代码) } }
 */
(function (modules) {

    // 模块缓存
	var installedModules = {};
	
	// chunk 加载状态
	// 0：已加载 Promise：加载中 undefined：未加载 null：preloaded/prefetched
    var installedChunks = {
        "lazy": 0
	};
	
	// 模块加载方法（跟前面 1.7 解释的一样，不重复解释）
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }

	// install a JSONP callback for chunk 
	// 即 window["webpackJsonp"].push 方法，最后调用的就是这个方法，传入的参数是 :
	/*[
		["pageA"], // [chunkId]
		{ // {路径：函数}
			"./src/a.js": (function (module, __webpack_exports__, __webpack_require__) {
				// ... 具体内容
			})
		}
	]*/
    function webpackJsonpCallback(data) {
        var chunkIds = data[0]; // 数组
        var moreModules = data[1]; // 对象

        var moduleId, chunkId, i = 0,
			resolves = [];
		// 遍历加载进来的 chunk 中 chunkId 数组
        for (; i < chunkIds.length; i++) {
			chunkId = chunkIds[i];
			// 从 installedChunks 中取出对应存储的数组[resolve,reject,promise]
            if (installedChunks[chunkId]) {
				// 先缓存其来 resolve ，即 arr[0]
                resolves.push(installedChunks[chunkId][0]);
			}
			// 将缓存数据置位 0 ，表示加载完成
            installedChunks[chunkId] = 0;
		}
		// 遍历加载进来的 chunk 中模块对象
        for (moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
				// 将懒加载成功的 module 都赋值给主入口，使得其可以被使用
                modules[moduleId] = moreModules[moduleId];
            }
		}
		// parentJsonpFunction window["webpackJsonp"] 数组的原生 push 方法
		// 处理同步加载的 chunk （正常懒加载应该是异步的）
        if (parentJsonpFunction) parentJsonpFunction(data);

		// 遍历执行 resolve 方法，此时就会执行开发者定义的 import().then 中 chunk 加载成功后的操作代码
        while (resolves.length) {
            resolves.shift()();
        }

    };

    // config 文件中设置的 output.publicpath
    __webpack_require__.p = "";
    // 通过 chunkId 生成 jsonp 加载脚本用的 src 
    function jsonpScriptSrc(chunkId) {
        return __webpack_require__.p + "" + ({
            "pageA": "pageA"
        } [chunkId] || chunkId) + "." + "d309d709" + ".js"
    }


	// 当前文件只包含了入口 chunk ，requireEnsure 方法是一个加载额外 chunk 的函数
	// 也就是开发者定义的 import() 懒加载 chunk 对应的底层加载方法，返回的是个 promise
	// 参数 chunkId 就是对应生成的默认数字 id 或开发者声明的 name ？
    __webpack_require__.e = function requireEnsure(chunkId) {
		// 创建一个 promise 数组
        var promises = [];

		// 懒加载是通过 JSONP 实现的
		// 先查看是否已加载成功（即 installedChunks 加载状态中对应的 value 是 0）
		var installedChunkData = installedChunks[chunkId];
		// 1. 未加载成功
        if (installedChunkData !== 0) {

			// 未加载成功则查看是加载中(Promise 表示加载中)还是未开始(undefined 表示未开始)
            if (installedChunkData) {
				// 2. 加载中则往数组中添加一个 promise 
				// installedChunkData: [ resolve, reject, promise ]
                promises.push(installedChunkData[2]);
            } else {
				// 3. 在 chunk 缓存中创建一个 promsie 
				// 并将 [promise.resolve, prommise.reject, promise ] 一起存入缓存 installedChunks[chunkId] 中
                var promise = new Promise(function (resolve, reject) {
                    installedChunkData = installedChunks[chunkId] = [resolve, reject];
                });
                promises.push(installedChunkData[2] = promise);

                // 4. 开始 chunk 的加载，JSONP 的一套实现，超时120s
                var script = document.createElement('script');
                var onScriptComplete;

                script.charset = 'utf-8';
				script.timeout = 120;
				
                script.src = jsonpScriptSrc(chunkId);

				// 说明：这里主要处理加载超时和加载错误，加载成功的是在 webpackJsonpCallback 方法中执行，而其实现是在 __webpack_require__.e  之外授权的
                onScriptComplete = function (event) {
                    // avoid mem leaks in IE.
                    script.onerror = script.onload = null;
					clearTimeout(timeout);
                    var chunk = installedChunks[chunkId];
					// 5. 如果缓存中数据不是0，表示未加载成功，则执行错误处理
                    if (chunk !== 0) {
                        if (chunk) {
                            var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                            var realSrc = event && event.target && event.target.src;
                            var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
                            error.type = errorType;
							error.request = realSrc;
							// 此处的 chunk[1] 就是 promise.reject
                            chunk[1](error);
                        }
                        installedChunks[chunkId] = undefined;
                    }
                };
                var timeout = setTimeout(function () {
                    onScriptComplete({
                        type: 'timeout',
                        target: script
                    });
                }, 120000);
                script.onerror = script.onload = onScriptComplete;
                document.head.appendChild(script);
            }
		}
		// 返回 promise 使得开发者可以在 then 中获取 chunk 内容来使用
        return Promise.all(promises);
    };


	// 实现 chunk 加载完成后的操作，主要是这里进行的绑定
	// 1. window.webpackJsonp 默认是个数组
	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
	// 2. 保留一个数组原生的方法，用于可以向指定数组 window.webpackJsonp 添加元素（缓存该方法，是因为后面push 方法会被重写）
	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
	// 3. 重写该数组(window.webpackJsonp)的 push 方法，指向 webpackJsonpCallback ，给具体的 chunk 用来执行加载完成后的操作
	jsonpArray.push = webpackJsonpCallback;
	// 深拷贝一份 window["webpackJsonp"] 数组，然后遍历执行 webpackJsonpCallback 
	// 此处是为了处理在执行这段代码之前就已经添加到数组 window["webpackJsonp"] 中的 chunk
    jsonpArray = jsonpArray.slice();
    for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    var parentJsonpFunction = oldJsonpFunction;


    // 加载入口模块并返回 exports 对象
    return __webpack_require__(__webpack_require__.s = "./src/lazy.js");
})
({

    "./src/lazy.js": (function (module, exports, __webpack_require__) {
		// import 会替换成  __webpack_require__.e 方法
		// then 方法中会调用 __webpack_require__ 方法来调用懒加载成功的模块
        eval("setTimeout(function () {\n    __webpack_require__.e(/*! import() | pageA */ \"pageA\").then(__webpack_require__.bind(null, /*! ./a */ \"./src/a.js\")).then(function (a) {\n        console.log(a.get1());\n    });\n    __webpack_require__.e(/*! import() */ \"pageA\").then(__webpack_require__.bind(null, /*! ./a */ \"./src/a.js\")).then(function (a) {\n        console.log(a.get1());\n    });\n}, 5000);\n\n//# sourceURL=webpack:///./src/lazy.js?");

    })

});
