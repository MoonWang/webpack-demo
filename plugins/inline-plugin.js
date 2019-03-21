class InlinePlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('compilation', compilation => {
            // [html-webpack-plugin 扩展了部分 async钩子](https://www.npmjs.com/package/html-webpack-plugin#async)
            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('ChangeTags', function (data, cb) {
                console.log(data); // 见下面
                // body 字段包含了即将插入到页面的的标签相关内容 [{}, {} ...]
                data.body.forEach(function (scriptTag) {
                    // 获取资源的路径
                    let src = scriptTag.attributes.src;
                    // 移除 script 标签的 src 属性
                    delete scriptTag.attributes.src;
                    // 获取对应资源的内容，compilation.assets 对象存储了资源信息，source 方法获取资源内容
                    let source = compilation.assets[src].source();
                    // 移除 compilation 上该资源信息，就不会再生成 main.js 文件
                    delete compilation.assets[src];
                    // 设置标签内容，注意这里的 innerHTML 写法是因为[源码](https://github.com/jantimon/html-webpack-plugin/blob/master/lib/html-tags.js#L42)中这么声明的，并不是常规意义上的 innerHTML
                    scriptTag.innerHTML = source;
                });
                cb(null, data);
            });
        });
    }
}
module.exports = InlinePlugin;

/*
data = {
    head: [],
    body: [{
        tagName: 'script',
        closeTag: true,
        attributes: [Object]
    }],
    plugin: HtmlWebpackPlugin {
        options: {
            template: '/Users/moonwang/store/webpack/node_modules/html-webpack-plugin/lib/loader.js!/Users/moonwang/store2/webpack/src_l/pageA.html',
            templateParameters: [Function: templateParametersGenerator],
            filename: 'pageA.html',
            hash: false,
            inject: true,
            compile: true,
            favicon: false,
            minify: false,
            cache: true,
            showErrors: true,
            chunks: 'all',
            excludeChunks: [],
            chunksSortMode: 'auto',
            meta: {},
            title: 'Webpack App',
            xhtml: false
        },
        childCompilerHash: '074d3b82c7068d949752f3e85845ef85',
        childCompilationOutputName: 'pageA.html',
        assetJson: '["main.js"]'
    },
    chunks: [{
        id: 'main',
        rendered: true,
        initial: true,
        entry: true,
        recorded: undefined,
        reason: undefined,
        size: 94,
        names: [Array],
        files: [Array],
        hash: '71a7a341119078db56c3',
        siblings: [],
        parents: [],
        children: [],
        childrenByOrder: [Object: null prototype] {}
    }],
    outputName: 'pageA.html'
}
*/
