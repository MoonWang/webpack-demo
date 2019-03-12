const path = require('path');
const webpack = require('webpack')

module.exports = {
    entry: {
        react: ['react']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_dll.js',
        libraryTarget: 'var',
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