const fs = require('fs');
const loaderUtils = require('loader-utils');
const defaultOptions = {
    placeholder: '{{__content__}}'
}

module.exports = function (source) {
    // 需要是异步 loader
    let callback = this.async();
    // 合并默认参数和用户输入参数
    const options = Object.assign({}, defaultOptions, loaderUtils.getOptions(this));
    // 可以用 schema-utils 验证下是否设定了 layout 参数，此处略过
    const { placeholder, layout } = options;

    fs.readFile(layout, 'utf8', (err, html) => {
        html = html.replace(placeholder, source);
        // 最后一个 loader 输出需要是可执行的 js 代码，不能直接输出 html
        callback(null, `module.exports = ${JSON.stringify(html)}`);
    })
};