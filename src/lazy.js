document.getElementById('btn').addEventListener('click', function() {
    import(/* webpackChunkName: "pageA" */ "./a").then(a => {
        console.log(a.get1());
    })
    import("./a").then(a => {
        console.log(a.get1());
    })
}, false);