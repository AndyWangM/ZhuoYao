var fs = require("fs");
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('666');
})

app.get('/accountInfo.json', function (req, res) {
    fs.readFile('accountInfo.json', function (err, data) {
        if (err) {
            res.send(err.toString());
        }
        res.send(data.toString());
    });
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
document.write('我是main.js,我require了a.js文件和b.js文件');

