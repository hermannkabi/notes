module.exports = {
    mode:"development",
    watch:true,
    context:__dirname + "/src",
    entry:{
        main:"./index.js",
        login: "./login.js",
    },
    output:{
        path: __dirname + "/dist",
        filename: "[name].js"
    },
};