// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

function initConfig() {
    if (!Cookies.getJSON("config")) {
        var config = {};
        config["splitsign"] = "comma";
        config["frontLat"] = "true";
        config["coordinates"] = "GCJ02";
        Cookies.set('config', config);
    }
}
initConfig();

function getSpriteConfig() {
    var spcfgCache = Cookies.getJSON("spcfgCache");
    if (!spcfgCache) {
        $.ajax({
            url: "/api/sprites/config",
            async: false,
            success: function (res) {
                if (res) {
                    var spriteConfig = res.data.configs;
                    var kv = {};
                    for (var sprite of spriteConfig) {
                        kv[sprite.name] = sprite.id;
                    }
                    localStorage.setItem('spriteConfig', encodeURIComponent(JSON.stringify(kv)));
                    Cookies.set('spcfgCache', 1, { expires: 1 });
                    return kv;
                }
            }
        });
    } else {
        return JSON.parse(decodeURIComponent(localStorage.getItem('spriteConfig')));
    }
}

$(document).ready(function () {
    getSpriteConfig();
});

var g = new (function () {
    function e() { }
    e.prototype.c = function (a) {
        for (var d = "", b = 0; b < a.length;) {
            var c = a[b];
            0 === c >>> 7 ? (d += String.fromCharCode(a[b]),
                b += 1) : 252 === (c & 252) ? (c = (a[b] & 3) << 30,
                    c |= (a[b + 1] & 63) << 24,
                    c |= (a[b + 2] & 63) << 18,
                    c |= (a[b + 3] & 63) << 12,
                    c |= (a[b + 4] & 63) << 6,
                    c |= a[b + 5] & 63,
                    d += String.fromCharCode(c),
                    b += 6) : 248 === (c & 248) ? (c = (a[b] & 7) << 24,
                        c |= (a[b + 1] & 63) << 18,
                        c |= (a[b + 2] & 63) << 12,
                        c |= (a[b + 3] & 63) << 6,
                        c |= a[b + 4] & 63,
                        d += String.fromCharCode(c),
                        b += 5) : 240 === (c & 240) ? (c = (a[b] & 15) << 18,
                            c |= (a[b + 1] & 63) << 12,
                            c |= (a[b + 2] & 63) << 6,
                            c |= a[b + 3] & 63,
                            d += String.fromCharCode(c),
                            b += 4) : 224 === (c & 224) ? (c = (a[b] & 31) << 12,
                                c |= (a[b + 1] & 63) << 6,
                                c |= a[b + 2] & 63,
                                d += String.fromCharCode(c),
                                b += 3) : 192 === (c & 192) ? (c = (a[b] & 63) << 6,
                                    c |= a[b + 1] & 63,
                                    d += String.fromCharCode(c),
                                    b += 2) : (d += String.fromCharCode(a[b]),
                                        b += 1)
        }
        return d
    }
        ;
    e.prototype.b = function (a) {
        for (var d = new ArrayBuffer(2 * a.length), d = new Uint16Array(d), b = 0, c = a.length; b < c; b++)
            d[b] = a.charCodeAt(b);
        return d
    }
        ;
    e.prototype.a = function () {
        var a = f[0]
            , a = this.b(JSON.stringify({
                request_type: "1001",
                longtitude: a.longitude,
                latitude: a.latitude,
                requestid: (new Date).getTime() % 1234567,
                platform: 0
            }))
            , d = a.length
            , b = new ArrayBuffer(4);
        (new DataView(b)).setUint32(0, d);
        d = new Uint8Array(4 + d);
        d.set(new Uint8Array(b), 0);
        d.set(a, 4);
        return d.buffer
    }
        ;
    return e
}()), f = [], l, q, ho = "https://www.wangandi.com/";
function m() {
    $.ajax({
        url: "https://www.wangandi.com/api/config/getSearchConfig",
        type: "GET",
        xhrFields: {
            withCredentials: !0
        },
        success: function (e) {
            if (e) {
                e = e.data.sprite_searching_config;
                for (var a = 0; a < e.length; a++) {
                    var d;
                    d = e[a];
                    for (var b = [], c = d.xIndex, p = d.yIndex, h = 0; h < c; h++)
                        for (var q = d.latitude + 16E3 * h, k = 0; k < p; k++)
                            b.push({
                                latitude: q,
                                longitude: d.longitude + 19E3 * k
                            });
                    d = b;
                    f = d
                }
            }
        }
    })
}
function n() {
    return setInterval(function () {
        0 < f.length ? l && l.send(g.a()) : m()
    }, 2E3)
}
function r() {
    l = new WebSocket("wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0");
    l.onmessage = function (e) {
        e = e.data;
        if ("string" !== typeof e) {
            var a = new FileReader;
            a.onload = function (a) {
                a = g.c((new Uint8Array(a.target.result)).slice(4));
                0 < a.length && (f.shift(),
                    a = JSON.parse(a),
                    $.ajax({
                        url: "https://www.wangandi.com/api/sprites/set",
                        data: JSON.stringify(a.sprite_list),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        xhrFields: {
                            withCredentials: !0
                        }
                    }))
            }
                ;
            a.readAsArrayBuffer(e)
        }
    }
        ;
    l.onclose = function () {
        setTimeout(function () {
            r()
        }, 1000)
    }
}
r();
n();
