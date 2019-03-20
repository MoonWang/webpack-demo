const path = require('path');
const fs = require('fs');
const loaderUtils = require('loader-utils');
const defaultOptions = {
    placeholder: '{{__content__}}',
    decorator: 'layout',
    decorator2: 'include'
};

module.exports = function (source) {
    // 需要是异步 loader
    let callback = this.async();
    // 合并默认参数和用户输入参数
    const options = Object.assign({}, defaultOptions, loaderUtils.getOptions(this));
    // 可以用 schema-utils 验证下是否设定了 layout 参数，此处略过
    const { placeholder, layout, decorator, decorator2 } = options;

    // 验证 html 文件中是否存在执行的语句，来声明模板文件
    let reg1 = new RegExp(`@${decorator}\\((.+)\\)`);
    let match1 = source.match(reg1);

    // 验证 html 文件中是否存在执行的语句，来声明模板文件
    let reg2 = new RegExp(`@${decorator2}\\((.+)\\)`);
    let match2 = source.match(reg2);

    // 不严谨实现，严谨的话应该处理多个碎片、是否声明模板等多种组合操作
    if (match2) {
        // 相对路径转换成绝对路径
        fs.readFile(path.join(this.context, match2[1]), 'utf8', (err, include) => {
            // 源文件先去掉声明语句
            source = source.replace(match2[0], include);
            fs.readFile(path.join(this.context, match1[1]), 'utf8', (err, html) => {
                // 源文件先去掉声明语句
                source = source.replace(match1[0], '');
                html = html.replace(placeholder, source);
                // 最后一个 loader 输出需要是可执行的 js 代码，不能直接输出 html
                callback(null, `module.exports = ${JSON.stringify(html)}`);
            });
        });
    } else if (match1) {
        // 相对路径转换成绝对路径
        fs.readFile(path.join(this.context, match1[1]), 'utf8', (err, html) => {
            // 源文件先去掉声明语句
            source = source.replace(match1[0], '');
            html = html.replace(placeholder, source);
            // 最后一个 loader 输出需要是可执行的 js 代码，不能直接输出 html
            callback(null, `module.exports = ${JSON.stringify(html)}`);
        });
    } else {
        fs.readFile(layout, 'utf8', (err, html) => {
            html = html.replace(placeholder, source);
            // 最后一个 loader 输出需要是可执行的 js 代码，不能直接输出 html
            callback(null, `module.exports = ${JSON.stringify(html)}`);
        })
    }
};