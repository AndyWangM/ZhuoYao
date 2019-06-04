
var StringUtils = /** @class */ (function () {
    function StringUtils() {
        this.I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
    }
    StringUtils.prototype.hash = function (input) {
        var hash = 5381;
        var i = input.length - 1;
        if (typeof input == 'string') {
            for (; i > -1; i--)
                hash += (hash << 5) + input.charCodeAt(i);
        }
        else {
            for (; i > -1; i--)
                hash += (hash << 5) + input[i];
        }
        var value = hash & 0x7FFFFFFF;
        var retValue = '';
        do {
            retValue += this.I64BIT_TABLE[value & 0x3F];
        } while (value >>= 6);
        return retValue;
    };
    StringUtils.prototype.utf8ByteToUnicodeStr = function (utf8Bytes) {
        var unicodeStr = "";
        for (var pos = 0; pos < utf8Bytes.length;) {
            var flag = utf8Bytes[pos];
            var unicode = 0;
            if ((flag >>> 7) === 0) {
                unicodeStr += String.fromCharCode(utf8Bytes[pos]);
                pos += 1;
            }
            else if ((flag & 0xFC) === 0xFC) {
                unicode = (utf8Bytes[pos] & 0x3) << 30;
                unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
                unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
                unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
                unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 5] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 6;
            }
            else if ((flag & 0xF8) === 0xF8) {
                unicode = (utf8Bytes[pos] & 0x7) << 24;
                unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
                unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
                unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 4] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 5;
            }
            else if ((flag & 0xF0) === 0xF0) {
                unicode = (utf8Bytes[pos] & 0xF) << 18;
                unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
                unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 3] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 4;
            }
            else if ((flag & 0xE0) === 0xE0) {
                unicode = (utf8Bytes[pos] & 0x1F) << 12;
                ;
                unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 2] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 3;
            }
            else if ((flag & 0xC0) === 0xC0) { //110
                unicode = (utf8Bytes[pos] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 1] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 2;
            }
            else {
                unicodeStr += String.fromCharCode(utf8Bytes[pos]);
                pos += 1;
            }
        }
        return unicodeStr;
    };
    // 字符串转为Uint16Array，参数为字符串
    StringUtils.prototype.str2abUint16Array = function (str) {
        var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return bufView;
    };
    // 字符串转为ArrayBuffer，参数为字符串
    StringUtils.prototype.str2ab = function (str) {
        var uint16array = this.str2abUint16Array(JSON.stringify(str));
        var arrayLength = uint16array.length;
        var buf = new ArrayBuffer(4);
        new DataView(buf).setUint32(0, arrayLength);
        var uint8array = new Uint8Array(4 + arrayLength);
        uint8array.set(new Uint8Array(buf), 0);
        uint8array.set(uint16array, 4);
        return uint8array.buffer;
    };
    return StringUtils;
}());

var strUtils = new StringUtils();
var lastTime;

var request = require('request');
const WebSocketClient = require('websocket').w3cwebsocket;

function recMessage(data) {
    if (backendMessageQueue.length > 0) {
        backendMessageQueue.shift();
        request({
            url: "https://zhuoyao.wangandi.com/api/sprites/set",
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                "User-Agent": "MicroMessenger"
            },
            body: data
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("[" + new Date() + "]" + JSON.stringify(body));
            }
        });
    }
}
var ws;
function initSocket() {
    ws = new WebSocketClient("wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0");
    ws.onopen = function () {
        console.log("[" + new Date() + "]Open.")
    };
    // 接收到服务端响应的数据时，触发事件
    ws.onmessage = evt => {
        console.log("[" + new Date() + "]Received message.")
        const { data } = evt;
        // console.log(data)
        if (typeof data === 'object') {
            const buf = Buffer.from(data);
            const tempresult = buf.toString('utf8', 4);
            var obj = JSON.parse(tempresult);
            // console.log(tempresult.substring(0,100))
            if (obj.sprite_list) {
                recMessage(obj.sprite_list)
            }
        }
        lastTime = new Date();
    };
    ws.onerror = err => {
        try {
            ws.close();
        } catch (ex) {

        }
        initSocket()
    };
    ws.onclose = () => {
        setTimeout(() => {
            initSocket();
        }, 1000);
        console.log("[" + new Date() + "]Close.");
    };
}
initSocket();
initMessageQueueChecker();

var backendMessageQueue = [];
var region;
const http = require('http');

const server = http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("[" + lastTime + "]" + region + ": " + JSON.stringify(backendMessageQueue));
});

const port = process.env.PORT || 1337;
server.listen(port);
function getPoints(config) {
    var latStep = 0.016 * 1000000;
    var longStep = 0.019 * 1000000;
    var allPoints = [];
    var aindex = config["xIndex"];
    var bindex = config["yIndex"];
    for (var i = 0; i < aindex; i++) {
        var lat = config["latitude"] + i * latStep;
        for (var j = 0; j < bindex; j++) {
            var lon = config["longitude"] + j * longStep;
            var obj = {
                latitude: lat,
                longitude: lon
            };
            allPoints.push(obj);
        }
    }
    return allPoints;
}
function getBackendMessage() {

    request({
        url: "https://zhuoyao.wangandi.com/api/config/getSearchConfig",
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
            "User-Agent": "MicroMessenger"
        }
        // body: JSON.stringify(requestData)
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var configs = body["data"]["sprite_searching_config"];
                for (var i = 0; i < configs.length; i++) {
                    var searchPoints = getPoints(configs[i]);
                    region = configs[i]["region"];
                    backendMessageQueue = searchPoints;
                }
            }
        }
    });
}

function buildRequest(location) {
    var obj = {
        "request_type": "1001",
        "longtitude": location.longitude,
        "latitude": location.latitude,
        "requestid": (new Date).getTime() % 1234567,
        "platform": 0
    };
    return obj;
}

function sendSocketMessage(str) {
    try {
        ws.send(strUtils.str2ab(str));
    } catch (e) {

    }
}

function initMessageQueueChecker() {
    setInterval(function () {
        if (backendMessageQueue.length > 0) {
            var message = buildRequest(backendMessageQueue[0]);
            sendSocketMessage(message);
        } else {
            getBackendMessage();
        }
    }, 5000)
}
console.log("Server running at http://localhost:%d", port);
var azureUrl = ".azurewebsites.net";
var urlList = ["andymeng", "zhuoyao", "zhuoyao1", "zhuoyaospider"]
var index = 6;
setInterval(() => {
    for (var url of urlList) {
        request({
            url: "https://" + url + azureUrl,
            method: "GET",
            json: true,
            headers: {
                "content-type": "application/json",
                "User-Agent": "MicroMessenger"
            }
            // body: JSON.stringify(requestData)
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body) {
                    // console.log(body)
                }
            }
        });
    }
    for (var i = 1; i <= index; i++) {
        // console.log("https://zhuoyaospider" + i + azureUrl)
        request({
            url: "https://zhuoyaospider" + i + azureUrl,
            method: "GET",
            json: true,
            headers: {
                "content-type": "application/json",
                "User-Agent": "MicroMessenger"
            }
            // body: JSON.stringify(requestData)
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body) {
                    // console.log(body)
                }
            }
        });
    }
}, 10000);
setInterval(() => {
    ws.close();
}, 5 * 60 * 1000);

