var ZhuoYao;
(function (e) {
  var f = function () { return function () { } }(); e.ya = f; var b = function () {
    function a() { this.o = 0; this.f = {}; new f } a.prototype.put = function (a, c) { this.w(a) || (this.o++ , this.f[a] = c) }; a.prototype.get = function (a) { return this.w(a) ? this.f[a] : null }; a.prototype.remove = function (a) { this.w(a) && delete this.f[a] && this.o-- }; a.prototype.w = function (a) { return a in this.f }; a.prototype.values = function () { var a = [], c; for (c in this.f) a.push(this.f[c]); return a }; a.prototype.keys = function () { var a = [], c; for (c in this.f) a.push(c); return a };
    a.prototype.size = function () { return this.o }; a.prototype.clear = function () { this.o = 0; this.f = {} }; return a
  }(); e.g = b
})(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.setItem = function (a, d) { wx.setStorage({ key: a, data: d }) }; b.prototype.getItem = function (a) { return wx.getStorageSync(a) }; return b }(); e.Storage = f })(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.get = function (a, d) { wx.request({ url: a, data: d, method: "GET", X: function (a) { console.log(a) }, ba: function (a) { console.log(a) } }) }; b.prototype.D = function (a, d) { wx.request({ url: a, method: "POST", data: d, Ea: { "content-type": "application/json" }, X: function (a) { console.log(a) }, ba: function (a) { console.log(a) } }) }; return b }(); e.Z = f })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { this.sa = new e.g; this.J = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split(""); this.ma = "https://hy.gwgo.qq.com/sync/pet/"; this.a = new e.Storage; this.H = new e.aa } b.prototype.hash = function (a) { return this.H.hash(a) }; b.prototype.I = function (a) { return this.H.I(a) }; b.prototype.G = function (a) { return this.H.G(a) }; b.prototype.convertLocation = function (a) { return 1E6 * Number(a.toFixed(6)) }; b.prototype.qa = function (a) { this.a.setItem("SpriteList", a) }; b.prototype.setSpriteList =
      function (a) { this.j = new e.g; this.l = new e.g; for (var d = a.length; d--;) { var c = a[d]; c.u = this.R(c); this.j.put(c.h, c); this.l.put(c.v, c.h) } }; b.prototype.T = function () { if (!this.j || !this.l) { this.j = new e.g; this.l = new e.g; for (var a = this.a.getItem("SpriteList"), d = a.length; d--;) { var c = a[d]; c.u || (c.u = this.R(c)); this.j.put(c.h, c); this.l.put(c.v, c.h) } } }; b.prototype.getSpriteList = function () { this.T(); return this.j }; b.prototype.getSpriteNameHash = function () { this.T(); return this.l }; b.prototype.getSpriteByName = function (a) {
        var d =
          this.a.getItem("SpriteList") || [], c = []; if (0 < d.length) for (var b = 0; b < d.length; b++)a ? -1 != d[b].v.indexOf(a) && c.push(d[b]) : c.push(d[b]); return c
      }; b.prototype.ha = function () { for (var a = [], d = this.a.getItem("SpriteList"), c = d.length; c--;)d[c].xa && a.push(d[c].h); return a }; b.prototype.getTempResults = function () { return this.sa }; b.prototype.A = function (a) {
        a = Number(a); var d = parseInt((a / 3600).toString()); a %= 3600; return [d, parseInt((a / 60).toString()), parseInt((a % 60).toString())].map(function (a) {
          a = a.toString(); return a[1] ?
            a : "0" + a
        }).join(":")
      }; b.prototype.getLeftTime = function (a, d) { return this.A((a + d - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.R = function (a) { return a ? this.ma + a.za : "/image/default-head.png" }; b.prototype.getMarkerInfo = function (a) { return a.split(":")[1].split(" ") }; b.prototype.setCoordinate = function (a) { this.m = a; this.a.setItem("coordinate", a) }; b.prototype.getLocation = function (a, d) {
      this.m || (this.m = this.a.getItem("coordinate") || "GCJ02"); switch (this.m) {
        case "GCJ02": return [a, d]; case "BD09": return e.K.ca(a,
          d); case "WGS84": return e.K.da(a, d)
      }
      }; b.prototype.setSplitSign = function (a) { this.F = a; this.a.setItem("splitsign", a) }; b.prototype.getSplitSign = function () { "spacesplit" == (this.a.getItem("splitsign") || "spacesplit") ? this.F = " " : this.F = ","; return this.F }; b.prototype.setLonfront = function (a) { this.a.setItem("lonfront", a) }; b.prototype.setPageSize = function (a) { this.a.setItem("pagesize", a || 20) }; b.prototype.getPageSize = function () { return this.la = this.a.getItem("pagesize") || 20 }; return b
  }(); e.Utils = f
})(ZhuoYao || (ZhuoYao =
  {})); (function (e) {
    var f = function () {
      function b(a) { this.c = []; this.U = this.i = !1; this.b = new e.Utils; this.va = a; -1 != wx.getSystemInfoSync().Ba.toLocaleLowerCase().indexOf("iphone") && (this.U = !0) } b.prototype.initSocket = function () {
        var a = this; this.ja(); a.M(); wx.onSocketOpen(function () { console.log("WebSocket\u8fde\u63a5\u5df2\u6253\u5f00\uff01"); a.i = !0; a.ga(); wx.hideLoading() }); wx.onSocketError(function () { console.log("WebSocket\u8fde\u63a5\u6253\u5f00\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\uff01"); a.i = !1 }); wx.onSocketClose(function () {
          console.log("WebSocket \u5df2\u5173\u95ed\uff01");
          a.i = !1
        }); wx.onSocketMessage(function (d) { a.na(d) })
      }; b.prototype.ja = function () { var a = this; setInterval(function () { a.i || a.M() }, 500) }; b.prototype.M = function () { this.i || (console.log("\u5f00\u59cbWebSocket\u8fde\u63a5"), wx.showLoading({ title: "\u8fde\u63a5\u4e2d" }), wx.connectSocket({ url: "wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0" })) }; b.prototype.sendMessage = function (a) { this.sendSocketMessage(a) }; b.prototype.sendSocketMessage = function (a) {
        wx.sendSocketMessage({
          data: this.b.G(a),
          X: function () { console.log("\u53d1\u9001\u670d\u52a1\u5668\u6210\u529f") }, Da: function () { console.log("\u53d1\u9001\u670d\u52a1\u5668\u5931\u8d25") }
        })
      }; b.prototype.na = function (a) {
        a = this.b.I((new Uint8Array(a.data)).slice(4)); if (0 < a.length) if (console.log("\u6536\u5230\u670d\u52a1\u5668\u6d88\u606f"), a = JSON.parse(a), 0 != a.retcode && wx.hideLoading(), "10041" == this.fa(a.requestid)) this.ia(a.filename); else if (a.filter = this.b.ha(), e.$.D(a.sprite_list), this.U) {
          if (a.W) for (var d = a.W.length; d--;) {
            var c = a.W[d], b; this.b.getSpriteList().get(c.s);
            b = a.filter; if (0 < b.length && -1 != b.indexOf(c.s)) { b = this.b.getSpriteList().get(c.s); var f = (c.latitude / 1E6).toFixed(6), h = (c.V / 1E6).toFixed(6), g = this.b.getLocation(h, f); b = { name: b.v, latitude: g[1], longitude: g[0], lefttime: this.b.getLeftTime(c.B, c.C), iconPath: b.u, id: b.h + ":" + f + " " + h, width: 40, height: 40 }; c = "" + c.s + c.latitude + c.V + c.B + c.C; this.b.hash(c); this.b.getTempResults().put(c, b) }
          }
        } else this.va.postMessage(a)
      }; b.prototype.genRequestId = function (a) {
        var d = (new Date).getTime() % 1234567; switch (a) {
          case "1001": this.c[0] =
            d; break; case "1002": this.c[1] = d; break; case "1003": this.c[2] = d; break; case "10040": this.c[3] = d; break; case "10041": this.c[4] = d
        }return d
      }; b.prototype.fa = function (a) { return this.c[0] == a ? "1001" : this.c[1] == a ? "1002" : this.c[2] == a ? "1003" : this.c[3] == a ? "10040" : this.c[4] == a ? "10041" : 0 }; b.prototype.ga = function () { var a = { Fa: "1004", Ca: 1, Ga: this.genRequestId("10041"), platform: 0 }; this.sendMessage(a) }; b.prototype.ia = function (a) {
        console.log("fileName", a); this.getFileName() != a && (console.log("\u5b58\u5728\u65b0\u7248\uff0c\u5f00\u59cb\u4e0b\u8f7d"),
          this.O(a))
      }; b.prototype.pa = function (a) { this.b.a.setItem("filename", a) }; b.prototype.getFileName = function () { return this.b.a.getItem("filename") }; b.prototype.O = function (a) { var d = this; wx.downloadFile({ url: "https://hy.gwgo.qq.com/sync/pet/config/" + a, success: function (c) { 200 === c.statusCode ? (console.log("\u4e0b\u8f7d\u6210\u529f" + a), c = wx.getFileSystemManager().readFileSync(c.tempFilePath, "utf8"), c = JSON.parse(c).Data, d.b.qa(c), d.b.setSpriteList(c), d.pa(a)) : d.N(a) }, fail: function () { d.N(a) } }) }; b.prototype.N =
        function (a) { var d = this; console.log(a); setTimeout(function () { d.O(a) }, 3E3) }; return b
    }(); e.Socket = f
  })(ZhuoYao || (ZhuoYao = {})); (function (e) {
    var f = function () {
      function b() { this.J = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split("") } b.prototype.hash = function (a) { var d = 5381, c = a.length - 1; if ("string" == typeof a) for (; -1 < c; c--)d += (d << 5) + a.charCodeAt(c); else for (; -1 < c; c--)d += (d << 5) + a[c]; a = d & 2147483647; d = ""; do d += this.J[a & 63]; while (a >>= 6); return d }; b.prototype.I = function (a) {
        for (var d = "", c = 0; c < a.length;) {
          var b = a[c]; 0 === b >>> 7 ? (d += String.fromCharCode(a[c]), c += 1) : 252 === (b & 252) ? (b = (a[c] & 3) << 30, b |= (a[c + 1] & 63) << 24, b |=
            (a[c + 2] & 63) << 18, b |= (a[c + 3] & 63) << 12, b |= (a[c + 4] & 63) << 6, b |= a[c + 5] & 63, d += String.fromCharCode(b), c += 6) : 248 === (b & 248) ? (b = (a[c] & 7) << 24, b |= (a[c + 1] & 63) << 18, b |= (a[c + 2] & 63) << 12, b |= (a[c + 3] & 63) << 6, b |= a[c + 4] & 63, d += String.fromCharCode(b), c += 5) : 240 === (b & 240) ? (b = (a[c] & 15) << 18, b |= (a[c + 1] & 63) << 12, b |= (a[c + 2] & 63) << 6, b |= a[c + 3] & 63, d += String.fromCharCode(b), c += 4) : 224 === (b & 224) ? (b = (a[c] & 31) << 12, b |= (a[c + 1] & 63) << 6, b |= a[c + 2] & 63, d += String.fromCharCode(b), c += 3) : 192 === (b & 192) ? (b = (a[c] & 63) << 6, b |= a[c + 1] & 63, d += String.fromCharCode(b),
              c += 2) : (d += String.fromCharCode(a[c]), c += 1)
        } return d
      }; b.prototype.ra = function (a) { for (var b = new ArrayBuffer(2 * a.length), b = new Uint16Array(b), c = 0, e = a.length; c < e; c++)b[c] = a.charCodeAt(c); return b }; b.prototype.G = function (a) { a = this.ra(JSON.stringify(a)); var b = a.length, c = new ArrayBuffer(4); (new DataView(c)).setUint32(0, b); b = new Uint8Array(4 + b); b.set(new Uint8Array(c), 0); b.set(a, 4); return b.buffer }; return b
    }(); e.aa = f
  })(ZhuoYao || (ZhuoYao = {})); (function (e) { e.Aa = function () { return function () { } }() })(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b(a) { this.B = a.gentime; this.latitude = a.latitude; this.C = a.lifetime; this.V = a.longtitude; this.s = a.sprite_id } b.prototype.getLeftTime = function () { return this.A((this.B + this.C - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.A = function (a) { a = Number(a); var b = parseInt((a / 3600).toString()); a %= 3600; return [b, parseInt((a / 60).toString()), parseInt((a % 60).toString())].map(function (a) { a = a.toString(); return a[1] ? a : "0" + a }).join(":") }; return b }(); e.wa = f })(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.D = function (a) { this.S.D(this.url + this.oa, a) }; b.get = function (a) { this.S.get(this.url + this.ea + a) }; b.url = "https://zhuoyao.wangandi.com/"; b.ea = "api/sprites/get/"; b.oa = "api/sprites/set/"; b.S = new e.Z; return b }(); e.$ = f })(ZhuoYao || (ZhuoYao = {})); (function (e) {
    var f = function () {
      function b() { } b.ca = function (a, b) { var c = Math.sqrt(a * a + b * b) + 2E-5 * Math.sin(b * this.Y), d = Math.atan2(b, a) + 3E-6 * Math.cos(a * this.Y); return [(c * Math.cos(d) + .0065).toFixed(6), (c * Math.sin(d) + .006).toFixed(6)] }; b.da = function (a, b) {
        if (this.ka(a, b)) return [a, b]; var c = this.ta(a - 105, b - 35), d = this.ua(a - 105, b - 35), e = b / 180 * this.PI, f = Math.sin(e), f = 1 - this.P * f * f, g = Math.sqrt(f), c = 180 * c / (this.L * (1 - this.P) / (f * g) * this.PI), d = 180 * d / (this.L / g * Math.cos(e) * this.PI); return [(2 * a - (Number(a) + d)).toFixed(6),
        (2 * b - (Number(b) + c)).toFixed(6)]
      }; b.ta = function (a, b) { var c = -100 + 2 * a + 3 * b + .2 * b * b + .1 * a * b + .2 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(b * this.PI) + 40 * Math.sin(b / 3 * this.PI)) / 3; return c += 2 * (160 * Math.sin(b / 12 * this.PI) + 320 * Math.sin(b * this.PI / 30)) / 3 }; b.ua = function (a, b) {
        var c = 300 + a + 2 * b + .1 * a * a + .1 * a * b + .1 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(a * this.PI) + 40 * Math.sin(a / 3 * this.PI)) / 3; return c +=
          2 * (150 * Math.sin(a / 12 * this.PI) + 300 * Math.sin(a / 30 * this.PI)) / 3
      }; b.ka = function (a, b) { return 72.004 > a || 137.8347 < a || .8293 > b || 55.8271 < b || !1 }; b.Y = 52.35987755982988; b.PI = 3.141592653589793; b.L = 6378245; b.P = .006693421622965943; b.m = "GCJ02"; return b
    }(); e.K = f
  })(ZhuoYao || (ZhuoYao = {}));
export default ZhuoYao;
