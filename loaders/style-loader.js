module.exports = function (source, other) {
    console.log('style-loader', other);
    return `
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(source)};
        document.head.appendChild(style);
    `;
}