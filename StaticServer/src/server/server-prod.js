import path from 'path'
import express from 'express'
import fs from 'fs'
import bodyParser from 'body-parser';

const app = express(),
    DIST_DIR = __dirname,
    HTML_FILE = path.join(DIST_DIR, 'index.html')


app.use(express.static(DIST_DIR))
app.use(bodyParser.json());

app.post('/setMyInfo', (req, res) => {
    fs.writeFile('accountInfo.json', JSON.stringify(req.body), function (err) {
        if (err) {
            return console.error(err);
        }
        res.send("post successfully!");
    });
})

app.get('/setMyInfo', function (req, res) {
    var obj = {};
    obj["openid"] = req.param('openid');
    obj["token"] = req.param('token');
    fs.writeFile('accountInfo.json', JSON.stringify(obj), function (err) {
        if (err) {
            return console.error(err);
        }
        res.send("post successfully!");
    });
})

app.get('/accountInfo.json', function (req, res) {
    fs.readFile('accountInfo.json', function (err, data) {
        if (err) {
            res.send(err.toString());
        }
        res.send(data.toString());
    });
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})