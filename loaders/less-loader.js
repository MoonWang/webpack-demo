const less = require('less');
module.exports = function (source, other) {
    console.log('less-loader', other);
    less.render(source, (err, output) => {
        this.callback(err, output.css);
    });
}