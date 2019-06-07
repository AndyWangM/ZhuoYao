var ZhuoYao;
(function (e) {
  var f = function () { return function () { } }(); e.xa = f; var b = function () {
    function a() { this.o = 0; this.f = {}; new f } a.prototype.put = function (a, c) { this.containsKey(a) || (this.o++ , this.f[a] = c) }; a.prototype.get = function (a) { return this.containsKey(a) ? this.f[a] : null }; a.prototype.remove = function (a) { this.containsKey(a) && delete this.f[a] && this.o-- }; a.prototype.containsKey = function (a) { return a in this.f }; a.prototype.values = function () { var a = [], c; for (c in this.f) a.push(this.f[c]); return a }; a.prototype.keys = function () {
      var a =
        [], c; for (c in this.f) a.push(c); return a
    }; a.prototype.size = function () { return this.o }; a.prototype.clear = function () { this.o = 0; this.f = {} }; return a
  }(); e.HashMap = b
})(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.setItem = function (a, d) { wx.setStorage({ key: a, data: d }) }; b.prototype.getItem = function (a) { return wx.getStorageSync(a) }; return b }(); e.Storage = f })(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.get = function (a, d, c, b) { wx.request({ url: a, data: d, method: "GET", success: function (a) { c(a, b) }, failed: function (a) { console.log(a) } }) }; b.prototype.ma = function (a, d) { wx.request({ url: a, method: "POST", data: d, header: { "content-type": "application/json" }, success: function () { }, failed: function (a) { console.log(a) } }) }; return b }(); e.T = f })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { this.ta = new e.HashMap; this.C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split(""); this.la = "https://hy.gwgo.qq.com/sync/pet/"; this.a = new e.Storage; this.A = new e.U } b.prototype.hash = function (a) { return this.A.hash(a) }; b.prototype.B = function (a) { return this.A.B(a) }; b.prototype.w = function (a) { return this.A.w(a) }; b.prototype.convertLocation = function (a) { return 1E6 * Number(a.toFixed(6)) }; b.prototype.setSpriteConfig = function (a) {
      this.a.setItem("SpriteList",
        a)
    }; b.prototype.setSpriteList = function (a) { this.i = new e.HashMap; this.j = new e.HashMap; for (var d = a.length; d--;) { var c = a[d]; c.HeadImage = this.K(c); this.i.put(c.Id, c); this.j.put(c.Name, c.Id) } }; b.prototype.L = function () { if (!this.i || !this.j) { this.i = new e.HashMap; this.j = new e.HashMap; for (var a = this.a.getItem("SpriteList"), d = a.length; d--;) { var c = a[d]; c.HeadImage || (c.HeadImage = this.K(c)); this.i.put(c.Id, c); this.j.put(c.Name, c.Id) } } }; b.prototype.getSpriteList = function () { this.L(); return this.i }; b.prototype.getSpriteNameHash =
      function () { this.L(); return this.j }; b.prototype.getSpriteByName = function (a) { var d = this.a.getItem("SpriteList") || [], c = []; if (0 < d.length) for (var b = 0; b < d.length; b++)a ? -1 != d[b].Name.indexOf(a) && c.push(d[b]) : c.push(d[b]); return c }; b.prototype.fa = function () { for (var a = [], d = this.a.getItem("SpriteList"), c = d.length; c--;)d[c].Checked && a.push(d[c].Id); return a }; b.prototype.getTempResults = function () { return this.ta }; b.prototype.u = function (a) {
        a = Number(a); var d = parseInt((a / 3600).toString()); a %= 3600; return [d, parseInt((a /
          60).toString()), parseInt((a % 60).toString())].map(function (a) { a = a.toString(); return a[1] ? a : "0" + a }).join(":")
      }; b.prototype.getLeftTime = function (a, d) { return this.u((a + d - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.K = function (a) { return a ? this.la + a.SmallImgPath : "/image/default-head.png" }; b.prototype.getMarkerInfo = function (a) { return a.split(":")[1].split(" ") }; b.prototype.setCoordinate = function (a) { this.s = a; this.a.setItem("coordinate", a) }; b.prototype.getLocation = function (a, d) {
      this.s || (this.s = this.a.getItem("coordinate") ||
        "GCJ02"); switch (this.s) { case "GCJ02": return [a, d]; case "BD09": return e.D.X(a, d); case "WGS84": return e.D.Y(a, d) }
      }; b.prototype.setSplitSign = function (a) { this.v = a; this.a.setItem("splitsign", a) }; b.prototype.getSplitSign = function () { "spacesplit" == (this.a.getItem("splitsign") || "spacesplit") ? this.v = " " : this.v = ","; return this.v }; b.prototype.setLonfront = function (a) { this.P = a; this.a.setItem("lonfront", a) }; b.prototype.getLonfront = function () { return this.P = this.a.getItem("lonfront") }; b.prototype.setPageSize = function (a) {
        this.a.setItem("pagesize",
          a || 20)
      }; b.prototype.getPageSize = function () { return this.ka = this.a.getItem("pagesize") || 20 }; return b
  }(); e.V = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b(a) { this.b = []; this.h = !1; this.c = []; this.N = !1; this.g = []; this.l = []; this.utils = new e.V; this.R = a; -1 != wx.getSystemInfoSync().brand.toLocaleLowerCase().indexOf("iphone") && (this.N = !0) } b.prototype.$ = function () { var a = this; e.SpritesAPI.da(function (d) { if (d = d.data) { e.SpritesAPI.ea(function (d) { if (d = d.data) a.l = d.data.filters }); d = d.data.sprite_searching_config; for (var c = 0; c < d.length; c++) { var b = a.aa(d[c]); console.log(d[c].region); a.g = b } } }) }; b.prototype.aa = function (a) {
      for (var d =
        [], c = a.xIndex, b = a.yIndex, e = 0; e < c; e++)for (var f = a.latitude + 16E3 * e, h = 0; h < b; h++)d.push({ latitude: f, longitude: a.longitude + 19E3 * h }); return d
    }; b.prototype.initSocket = function () {
      var a = this; this.ia(); this.ha(); a.G(); wx.onSocketOpen(function () { console.log("WebSocket\u8fde\u63a5\u5df2\u6253\u5f00\uff01"); a.h = !0; for (var d = 0; d < a.c.length; d++)a.sendSocketMessage(a.c[d]); a.ca(); wx.hideLoading() }); wx.onSocketError(function () {
        console.log("WebSocket\u8fde\u63a5\u6253\u5f00\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\uff01");
        a.h = !1
      }); wx.onSocketClose(function () { console.log("WebSocket \u5df2\u5173\u95ed\uff01"); a.h = !1 }); wx.onSocketMessage(function (d) { a.na(d) })
    }; b.prototype.ia = function () { var a = this; setInterval(function () { a.h || a.G() }, 500) }; b.prototype.ha = function () { var a = this; setInterval(function () { if (0 < a.c.length) { var d = a.c[0]; a.M = !1; a.sendSocketMessage(d) } else 0 < a.g.length ? (d = a.W(a.g[0]), a.M = !0, a.sendSocketMessage(d)) : a.$() }, 2E3) }; b.prototype.W = function (a) {
      return {
        request_type: "1001", longtitude: a.longitude, latitude: a.latitude,
        requestid: this.genRequestId("1001"), platform: 0
      }
    }; b.prototype.G = function () { this.h || (console.log("\u5f00\u59cbWebSocket\u8fde\u63a5"), wx.showLoading({ title: "\u8fde\u63a5\u4e2d" }), wx.connectSocket({ url: "wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0" })) }; b.prototype.sendMessage = function (a) { this.c.push(a) }; b.prototype.clearMessageQueue = function () { this.c = [] }; b.prototype.sendSocketMessage = function (a) { wx.sendSocketMessage({ data: this.utils.w(a), success: function () { }, fail: function () { console.log("\u53d1\u9001\u670d\u52a1\u5668\u5931\u8d25") } }) };
    b.prototype.na = function (a) {
      a = this.utils.B((new Uint8Array(a.data)).slice(4)); if (0 < a.length) if (0 < this.c.length && !this.M) if (console.log("\u6536\u5230\u670d\u52a1\u5668\u6d88\u606f", new Date), a = JSON.parse(a), 0 != a.retcode && wx.hideLoading(), "10041" == this.ba(a.requestid)) this.ga(a.filename), this.c.shift(); else {
      a.packageNO && 1 == a.packageNO && this.c.shift(); a.filter = this.utils.fa(); a.serverFilter = this.l; if (this.N) {
        if (a.sprite_list) {
          for (var d = a.sprite_list, c = [], b = d.length; b--;) {
            var g = d[b], f; this.utils.getSpriteList().get(g.sprite_id);
            this.l && this.l[g.sprite_id] && c.push(g); f = a.filter; if (0 < f.length && -1 != f.indexOf(g.sprite_id)) {
              f = this.utils.getSpriteList().get(g.sprite_id); var h = (g.latitude / 1E6).toFixed(6), l = (g.longtitude / 1E6).toFixed(6), k = this.utils.getLocation(l, h); f = { hashid: this.utils.hash(f.Name + k[1] + k[0]), name: f.Name, latitude: k[1], longitude: k[0], lefttime: this.utils.getLeftTime(g.gentime, g.lifetime), totaltime: g.gentime + g.lifetime, iconPath: f.HeadImage, id: f.Id + ":" + h + " " + l, width: 40, height: 40 }; g = "" + g.sprite_id + g.latitude + g.longtitude +
                g.gentime + g.lifetime; this.utils.getTempResults().put(g, f)
            }
          } e.SpritesAPI.setSpriteList(c)
        }
      } else this.R.postMessage(a); this.O = (new Date).getTime()
      } else 0 < this.g.length && (this.g.shift(), console.log("\u6536\u5230\u540e\u53f0\u4efb\u52a1\u6d88\u606f", new Date), a = JSON.parse(a), a.filter = [], a.serverFilter = this.l, this.R.postMessage(a))
    }; b.prototype.isSearching = function () { return !this.O || 5E3 < (new Date).getTime() - this.O ? !1 : !0 }; b.prototype.genRequestId = function (a) {
      var d = (new Date).getTime() % 1234567; switch (a) {
        case "1001": this.b[0] =
          d; break; case "1002": this.b[1] = d; break; case "1003": this.b[2] = d; break; case "10040": this.b[3] = d; break; case "10041": this.b[4] = d
      }return d
    }; b.prototype.ba = function (a) { return this.b[0] == a ? "1001" : this.b[1] == a ? "1002" : this.b[2] == a ? "1003" : this.b[3] == a ? "10040" : this.b[4] == a ? "10041" : 0 }; b.prototype.ca = function () { var a = { request_type: "1004", cfg_type: 1, requestid: this.genRequestId("10041"), platform: 0 }; this.sendMessage(a) }; b.prototype.ga = function (a) {
      console.log("fileName", a); this.getFileName() != a && (console.log("\u5b58\u5728\u65b0\u7248\uff0c\u5f00\u59cb\u4e0b\u8f7d"),
        this.I(a))
    }; b.prototype.pa = function (a) { this.utils.a.setItem("filename", a) }; b.prototype.getFileName = function () { return this.utils.a.getItem("filename") }; b.prototype.I = function (a) { var d = this; wx.downloadFile({ url: "https://hy.gwgo.qq.com/sync/pet/config/" + a, success: function (c) { 200 === c.statusCode ? (console.log("\u4e0b\u8f7d\u6210\u529f" + a), c = wx.getFileSystemManager().readFileSync(c.tempFilePath, "utf8"), c = JSON.parse(c).Data, d.utils.setSpriteConfig(c), d.utils.setSpriteList(c), d.pa(a)) : d.H(a) }, fail: function () { d.H(a) } }) };
    b.prototype.H = function (a) { var d = this; console.log(a); setTimeout(function () { d.I(a) }, 3E3) }; return b
  }(); e.Socket = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { this.C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split("") } b.prototype.hash = function (a) { var d = 5381, c = a.length - 1; if ("string" == typeof a) for (; -1 < c; c--)d += (d << 5) + a.charCodeAt(c); else for (; -1 < c; c--)d += (d << 5) + a[c]; a = d & 2147483647; d = ""; do d += this.C[a & 63]; while (a >>= 6); return d }; b.prototype.B = function (a) {
      for (var d = "", c = 0; c < a.length;) {
        var b = a[c]; 0 === b >>> 7 ? (d += String.fromCharCode(a[c]), c += 1) : 252 === (b & 252) ? (b = (a[c] & 3) << 30, b |= (a[c + 1] & 63) << 24, b |=
          (a[c + 2] & 63) << 18, b |= (a[c + 3] & 63) << 12, b |= (a[c + 4] & 63) << 6, b |= a[c + 5] & 63, d += String.fromCharCode(b), c += 6) : 248 === (b & 248) ? (b = (a[c] & 7) << 24, b |= (a[c + 1] & 63) << 18, b |= (a[c + 2] & 63) << 12, b |= (a[c + 3] & 63) << 6, b |= a[c + 4] & 63, d += String.fromCharCode(b), c += 5) : 240 === (b & 240) ? (b = (a[c] & 15) << 18, b |= (a[c + 1] & 63) << 12, b |= (a[c + 2] & 63) << 6, b |= a[c + 3] & 63, d += String.fromCharCode(b), c += 4) : 224 === (b & 224) ? (b = (a[c] & 31) << 12, b |= (a[c + 1] & 63) << 6, b |= a[c + 2] & 63, d += String.fromCharCode(b), c += 3) : 192 === (b & 192) ? (b = (a[c] & 63) << 6, b |= a[c + 1] & 63, d += String.fromCharCode(b),
            c += 2) : (d += String.fromCharCode(a[c]), c += 1)
      } return d
    }; b.prototype.sa = function (a) { for (var b = new ArrayBuffer(2 * a.length), b = new Uint16Array(b), c = 0, e = a.length; c < e; c++)b[c] = a.charCodeAt(c); return b }; b.prototype.w = function (a) { a = this.sa(JSON.stringify(a)); var b = a.length, c = new ArrayBuffer(4); (new DataView(c)).setUint32(0, b); b = new Uint8Array(4 + b); b.set(new Uint8Array(c), 0); b.set(a, 4); return b.buffer }; return b
  }(); e.U = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) { e.ya = function () { return function () { } }() })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b(a) { this.gentime = a.gentime; this.latitude = a.latitude; this.lifetime = a.lifetime; this.longtitude = a.longtitude; this.sprite_id = a.sprite_id } b.prototype.getLeftTime = function () { return this.u((this.gentime + this.lifetime - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.u = function (a) { a = Number(a); var b = parseInt((a / 3600).toString()); a %= 3600; return [b, parseInt((a / 60).toString()), parseInt((a % 60).toString())].map(function (a) { a = a.toString(); return a[1] ? a : "0" + a }).join(":") };
    return b
  }(); e.wa = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.setSpriteList = function (a) { this.m.ma(this.url + this.oa, a) }; b.da = function (a) { this.m.get(this.qa, null, a) }; b.ea = function (a) { this.m.get(this.ra, null, a) }; b.get = function (a) { this.m.get(this.url + this.Z + a) }; b.url = "https://zhuoyao.wangandi.com/"; b.qa = "https://zhuoyao.wangandi.com/api/config/getSearchConfig"; b.ra = "https://zhuoyao.wangandi.com/api/sprites/filter/get"; b.Z = "api/sprites/get/"; b.oa = "api/sprites/set/"; b.m = new e.T; return b }(); e.SpritesAPI = f })(ZhuoYao || (ZhuoYao =
  {})); (function (e) {
    var f = function () {
      function b() { } b.X = function (a, b) { var c = Math.sqrt(a * a + b * b) + 2E-5 * Math.sin(b * this.S), d = Math.atan2(b, a) + 3E-6 * Math.cos(a * this.S); return [c * Math.cos(d) + .0065, c * Math.sin(d) + .006] }; b.Y = function (a, b) { if (this.ja(a, b)) return [a, b]; var c = this.ua(a - 105, b - 35), d = this.va(a - 105, b - 35), e = b / 180 * this.PI, f = Math.sin(e), f = 1 - this.J * f * f, h = Math.sqrt(f), c = 180 * c / (this.F * (1 - this.J) / (f * h) * this.PI), d = 180 * d / (this.F / h * Math.cos(e) * this.PI); return [2 * a - (Number(a) + d), 2 * b - (Number(b) + c)] }; b.ua = function (a, b) {
        var c =
          -100 + 2 * a + 3 * b + .2 * b * b + .1 * a * b + .2 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(b * this.PI) + 40 * Math.sin(b / 3 * this.PI)) / 3; return c += 2 * (160 * Math.sin(b / 12 * this.PI) + 320 * Math.sin(b * this.PI / 30)) / 3
      }; b.va = function (a, b) {
        var c = 300 + a + 2 * b + .1 * a * a + .1 * a * b + .1 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(a * this.PI) + 40 * Math.sin(a / 3 * this.PI)) / 3; return c += 2 * (150 * Math.sin(a / 12 * this.PI) + 300 * Math.sin(a / 30 * this.PI)) /
          3
      }; b.ja = function (a, b) { return 72.004 > a || 137.8347 < a || .8293 > b || 55.8271 < b || !1 }; b.S = 52.35987755982988; b.PI = 3.141592653589793; b.F = 6378245; b.J = .006693421622965943; return b
    }(); e.D = f
  })(ZhuoYao || (ZhuoYao = {}));
export default ZhuoYao;
