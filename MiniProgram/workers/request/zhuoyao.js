var ZhuoYao;
(function (e) {
  var f = function () { return function () { } }(); e.ya = f; var b = function () {
    function a() { this.s = 0; this.f = {}; new f } a.prototype.put = function (a, c) { this.u(a) || (this.s++ , this.f[a] = c) }; a.prototype.get = function (a) { return this.u(a) ? this.f[a] : null }; a.prototype.remove = function (a) { this.u(a) && delete this.f[a] && this.s-- }; a.prototype.u = function (a) { return a in this.f }; a.prototype.values = function () { var a = [], c; for (c in this.f) a.push(this.f[c]); return a }; a.prototype.keys = function () { var a = [], c; for (c in this.f) a.push(c); return a };
    a.prototype.size = function () { return this.s }; a.prototype.clear = function () { this.s = 0; this.f = {} }; return a
  }(); e.g = b
})(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.setItem = function (a, d) { wx.setStorage({ key: a, data: d }) }; b.prototype.getItem = function (a) { return wx.getStorageSync(a) }; return b }(); e.Storage = f })(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.get = function (a, d, c, b) { wx.request({ url: a, data: d, method: "GET", success: function (a) { c(a, b) }, failed: function (a) { console.log(a) } }) }; b.prototype.na = function (a, d) { wx.request({ url: a, method: "POST", data: d, header: { "content-type": "application/json" }, success: function () { }, failed: function (a) { console.log(a) } }) }; return b }(); e.U = f })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { this.ua = new e.g; this.F = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split(""); this.ma = "https://hy.gwgo.qq.com/sync/pet/"; this.a = new e.Storage; this.C = new e.V } b.prototype.hash = function (a) { return this.C.hash(a) }; b.prototype.D = function (a) { return this.C.D(a) }; b.prototype.B = function (a) { return this.C.B(a) }; b.prototype.convertLocation = function (a) { return 1E6 * Number(a.toFixed(6)) }; b.prototype.setSpriteConfig = function (a) {
      this.a.setItem("SpriteList",
        a)
    }; b.prototype.setSpriteList = function (a) { this.j = new e.g; this.l = new e.g; for (var d = a.length; d--;) { var c = a[d]; c.HeadImage = this.M(c); this.j.put(c.Id, c); this.l.put(c.Name, c.Id) } }; b.prototype.N = function () { if (!this.j || !this.l) { this.j = new e.g; this.l = new e.g; for (var a = this.a.getItem("SpriteList"), d = a.length; d--;) { var c = a[d]; c.HeadImage || (c.HeadImage = this.M(c)); this.j.put(c.Id, c); this.l.put(c.Name, c.Id) } } }; b.prototype.getSpriteList = function () { this.N(); return this.j }; b.prototype.getSpriteNameHash = function () {
      this.N();
      return this.l
    }; b.prototype.getSpriteByName = function (a) { var d = this.a.getItem("SpriteList") || [], c = []; if (0 < d.length) for (var b = 0; b < d.length; b++)a ? -1 != d[b].Name.indexOf(a) && c.push(d[b]) : c.push(d[b]); return c }; b.prototype.ga = function () { for (var a = [], d = this.a.getItem("SpriteList"), c = d.length; c--;)d[c].Checked && a.push(d[c].Id); return a }; b.prototype.getTempResults = function () { return this.ua }; b.prototype.w = function (a) {
      a = Number(a); var d = parseInt((a / 3600).toString()); a %= 3600; return [d, parseInt((a / 60).toString()),
        parseInt((a % 60).toString())].map(function (a) { a = a.toString(); return a[1] ? a : "0" + a }).join(":")
    }; b.prototype.getLeftTime = function (a, d) { return this.w((a + d - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.M = function (a) { return a ? this.ma + a.SmallImgPath : "/image/default-head.png" }; b.prototype.getMarkerInfo = function (a) { return a.split(":")[1].split(" ") }; b.prototype.setCoordinate = function (a) { this.v = a; this.a.setItem("coordinate", a) }; b.prototype.getLocation = function (a, d) {
    this.v || (this.v = this.a.getItem("coordinate") ||
      "GCJ02"); switch (this.v) { case "GCJ02": return [a, d]; case "BD09": return e.G.Y(a, d); case "WGS84": return e.G.Z(a, d) }
    }; b.prototype.setSplitSign = function (a) { this.A = a; this.a.setItem("splitsign", a) }; b.prototype.getSplitSign = function () { "spacesplit" == (this.a.getItem("splitsign") || "spacesplit") ? this.A = " " : this.A = ","; return this.A }; b.prototype.setLonfront = function (a) { this.R = a; this.a.setItem("lonfront", a) }; b.prototype.getLonfront = function () { return this.R = this.a.getItem("lonfront") }; b.prototype.setPageSize = function (a) {
      this.a.setItem("pagesize",
        a || 20)
    }; b.prototype.getPageSize = function () { return this.la = this.a.getItem("pagesize") || 20 }; return b
  }(); e.W = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b(a) { this.b = []; this.i = !1; this.c = []; this.O = !1; this.h = []; this.m = []; this.utils = new e.W; this.S = a; -1 != wx.getSystemInfoSync().brand.toLocaleLowerCase().indexOf("iphone") && (this.O = !0) } b.prototype.aa = function () { var a = this; e.SpritesAPI.ea(function (d) { if (d = d.data) { e.SpritesAPI.fa(function (d) { if (d = d.data) a.m = d.data.filters }); d = d.data.sprite_searching_config; for (var c = 0; c < d.length; c++) { var b = a.ba(d[c]); console.log(d[c].region); a.h = b } } }) }; b.prototype.ba = function (a) {
      for (var d =
        [], c = a.xIndex, b = a.yIndex, e = 0; e < c; e++)for (var f = a.latitude + 16E3 * e, h = 0; h < b; h++)d.push({ latitude: f, longitude: a.longitude + 19E3 * h }); return d
    }; b.prototype.initSocket = function () {
      var a = this; this.ja(); this.ia(); a.I(); wx.onSocketOpen(function () { console.log("WebSocket\u8fde\u63a5\u5df2\u6253\u5f00\uff01"); a.i = !0; for (var d = 0; d < a.c.length; d++)a.sendSocketMessage(a.c[d]); a.da(); wx.hideLoading() }); wx.onSocketError(function () {
        console.log("WebSocket\u8fde\u63a5\u6253\u5f00\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\uff01");
        a.i = !1
      }); wx.onSocketClose(function () { console.log("WebSocket \u5df2\u5173\u95ed\uff01"); a.i = !1 }); wx.onSocketMessage(function (d) { a.oa(d) })
    }; b.prototype.ja = function () { var a = this; setInterval(function () { a.i || a.I() }, 500) }; b.prototype.ia = function () { var a = this; setInterval(function () { if (0 < a.c.length) { var d = a.c[0]; a.sendSocketMessage(d) } else 0 < a.h.length ? (d = a.X(a.h[0]), a.sendSocketMessage(d)) : a.aa() }, 2E3) }; b.prototype.X = function (a) {
      return {
        request_type: "1001", longtitude: a.longitude, latitude: a.latitude, requestid: this.genRequestId("1001"),
        platform: 0
      }
    }; b.prototype.I = function () { this.i || (console.log("\u5f00\u59cbWebSocket\u8fde\u63a5"), wx.showLoading({ title: "\u8fde\u63a5\u4e2d" }), wx.connectSocket({ url: "wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0" })) }; b.prototype.sendMessage = function (a) { this.c.push(a) }; b.prototype.clearMessageQueue = function () { this.c = [] }; b.prototype.sendSocketMessage = function (a) { wx.sendSocketMessage({ data: this.utils.B(a), success: function () { }, fail: function () { console.log("\u53d1\u9001\u670d\u52a1\u5668\u5931\u8d25") } }) };
    b.prototype.oa = function (a) {
      a = this.utils.D((new Uint8Array(a.data)).slice(4)); if (0 < a.length) if (0 < this.c.length) if (console.log("\u6536\u5230\u670d\u52a1\u5668\u6d88\u606f", new Date), a = JSON.parse(a), 0 != a.retcode && wx.hideLoading(), "10041" == this.ca(a.requestid)) this.ha(a.filename), this.c.shift(); else {
      a.packageNO && 1 == a.packageNO && this.c.shift(); a.filter = this.utils.ga(); a.serverFilter = this.m; if (this.O) {
        if (a.sprite_list) {
          for (var d = a.sprite_list, c = [], b = d.length; b--;) {
            var f = d[b], g; this.utils.getSpriteList().get(f.sprite_id);
            this.m && this.m[f.sprite_id] && c.push(f); g = a.filter; if (0 < g.length && -1 != g.indexOf(f.sprite_id)) { g = this.utils.getSpriteList().get(f.sprite_id); var h = (f.latitude / 1E6).toFixed(6), k = (f.longtitude / 1E6).toFixed(6), l = this.utils.getLocation(k, h); g = { name: g.Name, latitude: l[1], longitude: l[0], lefttime: this.utils.getLeftTime(f.gentime, f.lifetime), iconPath: g.HeadImage, id: g.Id + ":" + h + " " + k, width: 40, height: 40 }; f = "" + f.sprite_id + f.latitude + f.longtitude + f.gentime + f.lifetime; this.utils.getTempResults().put(f, g) }
          } e.SpritesAPI.setSpriteList(c)
        }
      } else this.S.postMessage(a);
        this.P = (new Date).getTime()
      } else 0 < this.h.length && (this.h.shift(), console.log("\u6536\u5230\u540e\u53f0\u4efb\u52a1\u6d88\u606f", new Date), a = JSON.parse(a), a.filter = [], a.serverFilter = this.m, this.S.postMessage(a))
    }; b.prototype.isSearching = function () { return !this.P || 5E3 < (new Date).getTime() - this.P ? !1 : !0 }; b.prototype.genRequestId = function (a) {
      var d = (new Date).getTime() % 1234567; switch (a) {
        case "1001": this.b[0] = d; break; case "1002": this.b[1] = d; break; case "1003": this.b[2] = d; break; case "10040": this.b[3] = d; break;
        case "10041": this.b[4] = d
      }return d
    }; b.prototype.ca = function (a) { return this.b[0] == a ? "1001" : this.b[1] == a ? "1002" : this.b[2] == a ? "1003" : this.b[3] == a ? "10040" : this.b[4] == a ? "10041" : 0 }; b.prototype.da = function () { var a = { request_type: "1004", cfg_type: 1, requestid: this.genRequestId("10041"), platform: 0 }; this.sendMessage(a) }; b.prototype.ha = function (a) { console.log("fileName", a); this.getFileName() != a && (console.log("\u5b58\u5728\u65b0\u7248\uff0c\u5f00\u59cb\u4e0b\u8f7d"), this.K(a)) }; b.prototype.qa = function (a) {
      this.utils.a.setItem("filename",
        a)
    }; b.prototype.getFileName = function () { return this.utils.a.getItem("filename") }; b.prototype.K = function (a) { var d = this; wx.downloadFile({ url: "https://hy.gwgo.qq.com/sync/pet/config/" + a, success: function (c) { 200 === c.statusCode ? (console.log("\u4e0b\u8f7d\u6210\u529f" + a), c = wx.getFileSystemManager().readFileSync(c.tempFilePath, "utf8"), c = JSON.parse(c).Data, d.utils.setSpriteConfig(c), d.utils.setSpriteList(c), d.qa(a)) : d.J(a) }, fail: function () { d.J(a) } }) }; b.prototype.J = function (a) {
      var d = this; console.log(a); setTimeout(function () { d.K(a) },
        3E3)
    }; return b
  }(); e.Socket = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { this.F = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split("") } b.prototype.hash = function (a) { var d = 5381, c = a.length - 1; if ("string" == typeof a) for (; -1 < c; c--)d += (d << 5) + a.charCodeAt(c); else for (; -1 < c; c--)d += (d << 5) + a[c]; a = d & 2147483647; d = ""; do d += this.F[a & 63]; while (a >>= 6); return d }; b.prototype.D = function (a) {
      for (var d = "", c = 0; c < a.length;) {
        var b = a[c]; 0 === b >>> 7 ? (d += String.fromCharCode(a[c]), c += 1) : 252 === (b & 252) ? (b = (a[c] & 3) << 30, b |= (a[c + 1] & 63) << 24, b |=
          (a[c + 2] & 63) << 18, b |= (a[c + 3] & 63) << 12, b |= (a[c + 4] & 63) << 6, b |= a[c + 5] & 63, d += String.fromCharCode(b), c += 6) : 248 === (b & 248) ? (b = (a[c] & 7) << 24, b |= (a[c + 1] & 63) << 18, b |= (a[c + 2] & 63) << 12, b |= (a[c + 3] & 63) << 6, b |= a[c + 4] & 63, d += String.fromCharCode(b), c += 5) : 240 === (b & 240) ? (b = (a[c] & 15) << 18, b |= (a[c + 1] & 63) << 12, b |= (a[c + 2] & 63) << 6, b |= a[c + 3] & 63, d += String.fromCharCode(b), c += 4) : 224 === (b & 224) ? (b = (a[c] & 31) << 12, b |= (a[c + 1] & 63) << 6, b |= a[c + 2] & 63, d += String.fromCharCode(b), c += 3) : 192 === (b & 192) ? (b = (a[c] & 63) << 6, b |= a[c + 1] & 63, d += String.fromCharCode(b),
            c += 2) : (d += String.fromCharCode(a[c]), c += 1)
      } return d
    }; b.prototype.ta = function (a) { for (var b = new ArrayBuffer(2 * a.length), b = new Uint16Array(b), c = 0, e = a.length; c < e; c++)b[c] = a.charCodeAt(c); return b }; b.prototype.B = function (a) { a = this.ta(JSON.stringify(a)); var b = a.length, c = new ArrayBuffer(4); (new DataView(c)).setUint32(0, b); b = new Uint8Array(4 + b); b.set(new Uint8Array(c), 0); b.set(a, 4); return b.buffer }; return b
  }(); e.V = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) { e.za = function () { return function () { } }() })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b(a) { this.gentime = a.gentime; this.latitude = a.latitude; this.lifetime = a.lifetime; this.longtitude = a.longtitude; this.sprite_id = a.sprite_id } b.prototype.getLeftTime = function () { return this.w((this.gentime + this.lifetime - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.w = function (a) { a = Number(a); var b = parseInt((a / 3600).toString()); a %= 3600; return [b, parseInt((a / 60).toString()), parseInt((a % 60).toString())].map(function (a) { a = a.toString(); return a[1] ? a : "0" + a }).join(":") };
    return b
  }(); e.xa = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.setSpriteList = function (a) { this.o.na(this.url + this.pa, a) }; b.ea = function (a) { this.o.get(this.ra, null, a) }; b.fa = function (a) { this.o.get(this.sa, null, a) }; b.get = function (a) { this.o.get(this.url + this.$ + a) }; b.url = "https://zhuoyao.wangandi.com/"; b.ra = "https://zhuoyao.wangandi.com/api/config/getSearchConfig"; b.sa = "https://zhuoyao.wangandi.com/api/sprites/filter/get"; b.$ = "api/sprites/get/"; b.pa = "api/sprites/set/"; b.o = new e.U; return b }(); e.SpritesAPI = f })(ZhuoYao || (ZhuoYao =
  {})); (function (e) {
    var f = function () {
      function b() { } b.Y = function (a, b) { var c = Math.sqrt(a * a + b * b) + 2E-5 * Math.sin(b * this.T), d = Math.atan2(b, a) + 3E-6 * Math.cos(a * this.T); return [c * Math.cos(d) + .0065, c * Math.sin(d) + .006] }; b.Z = function (a, b) { if (this.ka(a, b)) return [a, b]; var c = this.va(a - 105, b - 35), d = this.wa(a - 105, b - 35), e = b / 180 * this.PI, f = Math.sin(e), f = 1 - this.L * f * f, h = Math.sqrt(f), c = 180 * c / (this.H * (1 - this.L) / (f * h) * this.PI), d = 180 * d / (this.H / h * Math.cos(e) * this.PI); return [2 * a - (Number(a) + d), 2 * b - (Number(b) + c)] }; b.va = function (a, b) {
        var c =
          -100 + 2 * a + 3 * b + .2 * b * b + .1 * a * b + .2 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(b * this.PI) + 40 * Math.sin(b / 3 * this.PI)) / 3; return c += 2 * (160 * Math.sin(b / 12 * this.PI) + 320 * Math.sin(b * this.PI / 30)) / 3
      }; b.wa = function (a, b) {
        var c = 300 + a + 2 * b + .1 * a * a + .1 * a * b + .1 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(a * this.PI) + 40 * Math.sin(a / 3 * this.PI)) / 3; return c += 2 * (150 * Math.sin(a / 12 * this.PI) + 300 * Math.sin(a / 30 * this.PI)) /
          3
      }; b.ka = function (a, b) { return 72.004 > a || 137.8347 < a || .8293 > b || 55.8271 < b || !1 }; b.T = 52.35987755982988; b.PI = 3.141592653589793; b.H = 6378245; b.L = .006693421622965943; return b
    }(); e.G = f
  })(ZhuoYao || (ZhuoYao = {}));
export default ZhuoYao;
