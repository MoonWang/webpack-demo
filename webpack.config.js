const path = require('path');

module.exports = {
    // 入口 默认 './src'
    entry: './src/index.js',
    // 出口 默认 './dist'
    output: {
        // 输出 路径
        path: path.join(__dirname, 'dist'),
        // 生成文件名，默认 'main.js'
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                // 匹配需要当前 loader 处理的文件
                test: /\.css$/,
                // 使用的 loader 
                loader: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [

    ],
    devServer: {

    }
};