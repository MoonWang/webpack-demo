import text from './babelTest';

console.log('hello webpack1');

document.getElementById('app').innerHTML = 'moon';
// $('#app').html('$ moon');

require('./index.css');

// let src = require('./images/color.png');
// let img = new Image();
// img.src = src;
// document.body.appendChild(img);


// require('./less.less');
// require('./sass.scss');

// console.log(text);

// let getText = () => text;

// throw Error('test source map')

// 可以直接下面方式引用 ../lib/utils ，写法上同第三方包
// import { getDate } from 'utils';
// console.log(getDate());

// 单以一个 react 包引入对比，设定 resolve.modules 为绝对路径时，打包耗时 834ms，不设置时耗时700ms
// 目前看加速效果不行，需要在项目结构较大时，再行对比
import React from 'react';

console.log(text);
if (module.hot) {
    module.hot.accept('./babelTest.js', function () {
        // console.log('accept babelTest.js');
        // return;
        console.log(text);
    });
}