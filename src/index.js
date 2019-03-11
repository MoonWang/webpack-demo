import text from './babelTest';

console.log('hello webpack');

// document.getElementById('app').innerHTML = 'moon';
// $('#app').html('$ moon');

// require('./index.css');

let src = require('./images/color.png');
let img = new Image();
img.src = src;
document.body.appendChild(img);


// require('./less.less');
// require('./sass.scss');

console.log(text);

let getText = () => text;

throw Error('test source map')