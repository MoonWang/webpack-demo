const path = require('path');

// 开启一个子进程，衍生一个 shell ，执行命令
require('child_process').exec("npm config get prefix", function(err, stdout, stderr) {
    // 拿到 node 的全局路径
    // mac：/Users/moonwang/.nvm/versions/node/v8.9.4
    // win：D:\bin\node
    console.log(stdout); 

    // 路径特殊处理 win/*nix support
    let nixLib = (process.platform.indexOf("win") === 0) ? "" : "lib"; 

    // 获取 webpack 全局包的路径，找到入口文件，最新版本应该是 webpacl-cli/bin/cli.js（旧版的曾是 webpack.js）
    let webpackPath = path.resolve(path.join(
        stdout.replace("\n", ""), 
        nixLib, 
        'node_modules', 
        'webpack-cli', 
        'bin', 
        'cli.js'
    ));

    // 如果没有安装全局包，可以直接写本地路径
    // let webpackPath = './node_modules/webpack-cli/bin/cli.js';

    // /Users/moonwang/.nvm/versions/node/v8.9.4/lib/node_modules/webpack-cli/bin/cli.js
    console.log(webpackPath);
    // 虽然引入的是全局包的路径，但是调试的时候会先从本地包找，本地包打上断点开始调试吧
    require(webpackPath);
});