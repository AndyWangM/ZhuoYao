var ZhuoYao;
(function (e) {
  var f = function () { return function () { } }(); e.xa = f; var b = function () {
    function a() { this.o = 0; this.c = {}; new f } a.prototype.put = function (a, c) { this.v(a) || (this.o++ , this.c[a] = c) }; a.prototype.get = function (a) { return this.v(a) ? this.c[a] : null }; a.prototype.remove = function (a) { this.v(a) && delete this.c[a] && this.o-- }; a.prototype.v = function (a) { return a in this.c }; a.prototype.values = function () { var a = [], c; for (c in this.c) a.push(this.c[c]); return a }; a.prototype.keys = function () { var a = [], c; for (c in this.c) a.push(c); return a };
    a.prototype.size = function () { return this.o }; a.prototype.clear = function () { this.o = 0; this.c = {} }; return a
  }(); e.g = b
})(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.setItem = function (a, d) { wx.setStorage({ key: a, data: d }) }; b.prototype.getItem = function (a) { return wx.getStorageSync(a) }; return b }(); e.Storage = f })(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.get = function (a, d, c, b) { wx.request({ url: a, data: d, method: "GET", success: function (a) { c(a, b) }, failed: function (a) { console.log(a) } }) }; b.prototype.ma = function (a, d) { wx.request({ url: a, method: "POST", data: d, header: { "content-type": "application/json" }, success: function () { }, failed: function (a) { console.log(a) } }) }; return b }(); e.U = f })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { this.sa = new e.g; this.G = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split(""); this.la = "https://hy.gwgo.qq.com/sync/pet/"; this.a = new e.Storage; this.D = new e.V } b.prototype.hash = function (a) { return this.D.hash(a) }; b.prototype.F = function (a) { return this.D.F(a) }; b.prototype.C = function (a) { return this.D.C(a) }; b.prototype.convertLocation = function (a) { return 1E6 * Number(a.toFixed(6)) }; b.prototype.setSpriteConfig = function (a) {
      this.a.setItem("SpriteList",
        a)
    }; b.prototype.s = function (a) { this.j = new e.g; this.l = new e.g; for (var d = a.length; d--;) { var c = a[d]; c.HeadImage = this.N(c); this.j.put(c.Id, c); this.l.put(c.Name, c.Id) } }; b.prototype.O = function () { if (!this.j || !this.l) { this.j = new e.g; this.l = new e.g; for (var a = this.a.getItem("SpriteList"), d = a.length; d--;) { var c = a[d]; c.HeadImage || (c.HeadImage = this.N(c)); this.j.put(c.Id, c); this.l.put(c.Name, c.Id) } } }; b.prototype.getSpriteList = function () { this.O(); return this.j }; b.prototype.getSpriteNameHash = function () { this.O(); return this.l };
    b.prototype.getSpriteByName = function (a) { var d = this.a.getItem("SpriteList") || [], c = []; if (0 < d.length) for (var b = 0; b < d.length; b++)a ? -1 != d[b].Name.indexOf(a) && c.push(d[b]) : c.push(d[b]); return c }; b.prototype.fa = function () { for (var a = [], d = this.a.getItem("SpriteList"), c = d.length; c--;)d[c].Checked && a.push(d[c].Id); return a }; b.prototype.getTempResults = function () { return this.sa }; b.prototype.w = function (a) {
      a = Number(a); var d = parseInt((a / 3600).toString()); a %= 3600; return [d, parseInt((a / 60).toString()), parseInt((a % 60).toString())].map(function (a) {
        a =
        a.toString(); return a[1] ? a : "0" + a
      }).join(":")
    }; b.prototype.getLeftTime = function (a, d) { return this.w((a + d - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.N = function (a) { return a ? this.la + a.SmallImgPath : "/image/default-head.png" }; b.prototype.getMarkerInfo = function (a) { return a.split(":")[1].split(" ") }; b.prototype.setCoordinate = function (a) { this.m = a; this.a.setItem("coordinate", a) }; b.prototype.getLocation = function (a, d) {
    this.m || (this.m = this.a.getItem("coordinate") || "GCJ02"); switch (this.m) {
      case "GCJ02": return [a,
        d]; case "BD09": return e.H.Y(a, d); case "WGS84": return e.H.Z(a, d)
    }
    }; b.prototype.setSplitSign = function (a) { this.B = a; this.a.setItem("splitsign", a) }; b.prototype.getSplitSign = function () { "spacesplit" == (this.a.getItem("splitsign") || "spacesplit") ? this.B = " " : this.B = ","; return this.B }; b.prototype.setLonfront = function (a) { this.S = a; this.a.setItem("lonfront", a) }; b.prototype.getLonfront = function () { return this.S = this.a.getItem("lonfront") }; b.prototype.setPageSize = function (a) { this.a.setItem("pagesize", a || 20) }; b.prototype.getPageSize =
      function () { return this.ka = this.a.getItem("pagesize") || 20 }; return b
  }(); e.W = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b(a) { this.b = []; this.i = !1; this.f = []; this.P = !1; this.h = []; this.utils = new e.W; this.va = a; -1 != wx.getSystemInfoSync().brand.toLocaleLowerCase().indexOf("iphone") && (this.P = !0) } b.prototype.aa = function () { var a = this; e.u.ea(function (d) { if (d = d.data) { d = d.data.sprite_searching_config; for (var c = 0; c < d.length; c++) { var b = a.ba(d[c]); console.log(d[c].region); a.h = b } } }) }; b.prototype.ba = function (a) {
      for (var d = [], c = a.xIndex, b = a.yIndex, e = 0; e < c; e++)for (var f = a.latitude + 16E3 * e, g = 0; g < b; g++)d.push({
        latitude: f,
        longitude: a.longitude + 19E3 * g
      }); return d
    }; b.prototype.initSocket = function () {
      var a = this; this.ia(); this.ha(); a.J(); wx.onSocketOpen(function () { console.log("WebSocket\u8fde\u63a5\u5df2\u6253\u5f00\uff01"); a.i = !0; for (var d = 0; d < a.f.length; d++)a.sendSocketMessage(a.f[d]); a.da(); wx.hideLoading() }); wx.onSocketError(function () { console.log("WebSocket\u8fde\u63a5\u6253\u5f00\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\uff01"); a.i = !1 }); wx.onSocketClose(function () { console.log("WebSocket \u5df2\u5173\u95ed\uff01"); a.i = !1 });
      wx.onSocketMessage(function (d) { a.na(d) })
    }; b.prototype.ia = function () { var a = this; setInterval(function () { a.i || a.J() }, 500) }; b.prototype.ha = function () { var a = this; setInterval(function () { if (0 < a.f.length) { var d = a.f[0]; a.sendSocketMessage(d) } else 0 < a.h.length ? (d = a.X(a.h[0]), a.sendSocketMessage(d)) : a.aa() }, 2E3) }; b.prototype.X = function (a) { return { request_type: "1001", longtitude: a.longitude, latitude: a.latitude, requestid: this.genRequestId("1001"), platform: 0 } }; b.prototype.J = function () {
    this.i || (console.log("\u5f00\u59cbWebSocket\u8fde\u63a5"),
      wx.showLoading({ title: "\u8fde\u63a5\u4e2d" }), wx.connectSocket({ url: "wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0" }))
    }; b.prototype.sendMessage = function (a) { this.f.push(a) }; b.prototype.clearMessageQueue = function () { this.f = [] }; b.prototype.sendSocketMessage = function (a) { wx.sendSocketMessage({ data: this.utils.C(a), success: function () { }, fail: function () { console.log("\u53d1\u9001\u670d\u52a1\u5668\u5931\u8d25") } }) }; b.prototype.na = function (a) {
      a = this.utils.F((new Uint8Array(a.data)).slice(4));
      if (0 < a.length) if (0 < this.f.length) if (this.f.shift(), console.log("\u6536\u5230\u670d\u52a1\u5668\u6d88\u606f", new Date), a = JSON.parse(a), 0 != a.retcode && wx.hideLoading(), "10041" == this.ca(a.requestid)) this.ga(a.filename); else {
      a.filter = this.utils.fa(); e.u.s(a.sprite_list); if (this.P) {
        if (a.sprite_list) for (var d = a.sprite_list, c = d.length; c--;) {
          var b = d[c], f; this.utils.getSpriteList().get(b.sprite_id); f = a.filter; if (0 < f.length && -1 != f.indexOf(b.sprite_id)) {
            f = this.utils.getSpriteList().get(b.sprite_id); var h = (b.latitude /
              1E6).toFixed(6), g = (b.longtitude / 1E6).toFixed(6), k = this.utils.getLocation(g, h); f = { name: f.Name, latitude: k[1], longitude: k[0], lefttime: this.utils.getLeftTime(b.gentime, b.lifetime), iconPath: f.HeadImage, id: f.Id + ":" + h + " " + g, width: 40, height: 40 }; b = "" + b.sprite_id + b.latitude + b.longtitude + b.gentime + b.lifetime; this.utils.hash(b); this.utils.getTempResults().put(b, f)
          }
        }
      } else this.va.postMessage(a); this.R = (new Date).getTime()
      } else 0 < this.h.length && (this.h.shift(), console.log("\u6536\u5230\u540e\u53f0\u4efb\u52a1\u6d88\u606f",
        new Date), a = JSON.parse(a), e.u.s(a.sprite_list))
    }; b.prototype.isSearching = function () { return !this.R || 5E3 < (new Date).getTime() - this.R ? !1 : !0 }; b.prototype.genRequestId = function (a) { var d = (new Date).getTime() % 1234567; switch (a) { case "1001": this.b[0] = d; break; case "1002": this.b[1] = d; break; case "1003": this.b[2] = d; break; case "10040": this.b[3] = d; break; case "10041": this.b[4] = d }return d }; b.prototype.ca = function (a) {
      return this.b[0] == a ? "1001" : this.b[1] == a ? "1002" : this.b[2] == a ? "1003" : this.b[3] == a ? "10040" : this.b[4] ==
        a ? "10041" : 0
    }; b.prototype.da = function () { var a = { request_type: "1004", cfg_type: 1, requestid: this.genRequestId("10041"), platform: 0 }; this.sendMessage(a) }; b.prototype.ga = function (a) { console.log("fileName", a); this.getFileName() != a && (console.log("\u5b58\u5728\u65b0\u7248\uff0c\u5f00\u59cb\u4e0b\u8f7d"), this.L(a)) }; b.prototype.pa = function (a) { this.utils.a.setItem("filename", a) }; b.prototype.getFileName = function () { return this.utils.a.getItem("filename") }; b.prototype.L = function (a) {
      var d = this; wx.downloadFile({
        url: "https://hy.gwgo.qq.com/sync/pet/config/" +
          a, success: function (c) { 200 === c.statusCode ? (console.log("\u4e0b\u8f7d\u6210\u529f" + a), c = wx.getFileSystemManager().readFileSync(c.tempFilePath, "utf8"), c = JSON.parse(c).Data, d.utils.setSpriteConfig(c), d.utils.s(c), d.pa(a)) : d.K(a) }, fail: function () { d.K(a) }
      })
    }; b.prototype.K = function (a) { var d = this; console.log(a); setTimeout(function () { d.L(a) }, 3E3) }; return b
  }(); e.Socket = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { this.G = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split("") } b.prototype.hash = function (a) { var d = 5381, c = a.length - 1; if ("string" == typeof a) for (; -1 < c; c--)d += (d << 5) + a.charCodeAt(c); else for (; -1 < c; c--)d += (d << 5) + a[c]; a = d & 2147483647; d = ""; do d += this.G[a & 63]; while (a >>= 6); return d }; b.prototype.F = function (a) {
      for (var d = "", c = 0; c < a.length;) {
        var b = a[c]; 0 === b >>> 7 ? (d += String.fromCharCode(a[c]), c += 1) : 252 === (b & 252) ? (b = (a[c] & 3) << 30, b |= (a[c + 1] & 63) << 24, b |=
          (a[c + 2] & 63) << 18, b |= (a[c + 3] & 63) << 12, b |= (a[c + 4] & 63) << 6, b |= a[c + 5] & 63, d += String.fromCharCode(b), c += 6) : 248 === (b & 248) ? (b = (a[c] & 7) << 24, b |= (a[c + 1] & 63) << 18, b |= (a[c + 2] & 63) << 12, b |= (a[c + 3] & 63) << 6, b |= a[c + 4] & 63, d += String.fromCharCode(b), c += 5) : 240 === (b & 240) ? (b = (a[c] & 15) << 18, b |= (a[c + 1] & 63) << 12, b |= (a[c + 2] & 63) << 6, b |= a[c + 3] & 63, d += String.fromCharCode(b), c += 4) : 224 === (b & 224) ? (b = (a[c] & 31) << 12, b |= (a[c + 1] & 63) << 6, b |= a[c + 2] & 63, d += String.fromCharCode(b), c += 3) : 192 === (b & 192) ? (b = (a[c] & 63) << 6, b |= a[c + 1] & 63, d += String.fromCharCode(b),
            c += 2) : (d += String.fromCharCode(a[c]), c += 1)
      } return d
    }; b.prototype.ra = function (a) { for (var b = new ArrayBuffer(2 * a.length), b = new Uint16Array(b), c = 0, e = a.length; c < e; c++)b[c] = a.charCodeAt(c); return b }; b.prototype.C = function (a) { a = this.ra(JSON.stringify(a)); var b = a.length, c = new ArrayBuffer(4); (new DataView(c)).setUint32(0, b); b = new Uint8Array(4 + b); b.set(new Uint8Array(c), 0); b.set(a, 4); return b.buffer }; return b
  }(); e.V = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) { e.ya = function () { return function () { } }() })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b(a) { this.gentime = a.gentime; this.latitude = a.latitude; this.lifetime = a.lifetime; this.longtitude = a.longtitude; this.sprite_id = a.sprite_id } b.prototype.getLeftTime = function () { return this.w((this.gentime + this.lifetime - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.w = function (a) { a = Number(a); var b = parseInt((a / 3600).toString()); a %= 3600; return [b, parseInt((a / 60).toString()), parseInt((a % 60).toString())].map(function (a) { a = a.toString(); return a[1] ? a : "0" + a }).join(":") };
    return b
  }(); e.wa = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.s = function (a) { this.A.ma(this.url + this.oa, a) }; b.ea = function (a) { this.A.get(this.qa, null, a) }; b.get = function (a) { this.A.get(this.url + this.$ + a) }; b.url = "https://zhuoyao.wangandi.com/"; b.qa = "https://zhuoyao.wangandi.com/api/config/getSearchConfig"; b.$ = "api/sprites/get/"; b.oa = "api/sprites/set/"; b.A = new e.U; return b }(); e.u = f })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { } b.Y = function (a, b) { var c = Math.sqrt(a * a + b * b) + 2E-5 * Math.sin(b * this.T), d = Math.atan2(b, a) + 3E-6 * Math.cos(a * this.T); return [(c * Math.cos(d) + .0065).toFixed(6), (c * Math.sin(d) + .006).toFixed(6)] }; b.Z = function (a, b) {
      if (this.ja(a, b)) return [a, b]; var c = this.ta(a - 105, b - 35), d = this.ua(a - 105, b - 35), e = b / 180 * this.PI, f = Math.sin(e), f = 1 - this.M * f * f, g = Math.sqrt(f), c = 180 * c / (this.I * (1 - this.M) / (f * g) * this.PI), d = 180 * d / (this.I / g * Math.cos(e) * this.PI); return [(2 * a - (Number(a) + d)).toFixed(6), (2 *
        b - (Number(b) + c)).toFixed(6)]
    }; b.ta = function (a, b) { var c = -100 + 2 * a + 3 * b + .2 * b * b + .1 * a * b + .2 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(b * this.PI) + 40 * Math.sin(b / 3 * this.PI)) / 3; return c += 2 * (160 * Math.sin(b / 12 * this.PI) + 320 * Math.sin(b * this.PI / 30)) / 3 }; b.ua = function (a, b) {
      var c = 300 + a + 2 * b + .1 * a * a + .1 * a * b + .1 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(a * this.PI) + 40 * Math.sin(a / 3 * this.PI)) / 3; return c += 2 *
        (150 * Math.sin(a / 12 * this.PI) + 300 * Math.sin(a / 30 * this.PI)) / 3
    }; b.ja = function (a, b) { return 72.004 > a || 137.8347 < a || .8293 > b || 55.8271 < b || !1 }; b.T = 52.35987755982988; b.PI = 3.141592653589793; b.I = 6378245; b.M = .006693421622965943; b.m = "GCJ02"; return b
  }(); e.H = f
})(ZhuoYao || (ZhuoYao = {}));
export default ZhuoYao;
