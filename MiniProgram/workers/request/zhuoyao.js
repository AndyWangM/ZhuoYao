var ZhuoYao;
(function (e) {
  var f = function () { return function () { } }(); e.Ba = f; var b = function () {
    function a() { this.o = 0; this.f = {}; new f } a.prototype.put = function (a, d) { this.containsKey(a) || this.o++; this.f[a] = d }; a.prototype.get = function (a) { return this.containsKey(a) ? this.f[a] : null }; a.prototype.remove = function (a) { this.containsKey(a) && delete this.f[a] && this.o-- }; a.prototype.containsKey = function (a) { return a in this.f }; a.prototype.values = function () { var a = [], d; for (d in this.f) a.push(this.f[d]); return a }; a.prototype.keys = function () {
      var a =
        [], d; for (d in this.f) a.push(d); return a
    }; a.prototype.size = function () { return this.o }; a.prototype.clear = function () { this.o = 0; this.f = {} }; return a
  }(); e.HashMap = b
})(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.setItem = function (a, c) { wx.setStorage({ key: a, data: c }) }; b.prototype.getItem = function (a) { return wx.getStorageSync(a) }; return b }(); e.Storage = f })(ZhuoYao || (ZhuoYao = {})); (function (e) { var f = function () { function b() { } b.prototype.get = function (a, c, d, b) { wx.request({ url: a, data: c, method: "GET", success: function (a) { d(a, b) }, failed: function (a) { console.log(a) } }) }; b.prototype.qa = function (a, c) { wx.request({ url: a, method: "POST", data: c, header: { "content-type": "application/json" }, success: function () { }, failed: function (a) { console.log(a) } }) }; return b }(); e.T = f })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { this.xa = new e.HashMap; this.C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split(""); this.pa = "https://hy.gwgo.qq.com/sync/pet/"; this.a = new e.Storage; this.A = new e.U } b.prototype.hash = function (a) { return this.A.hash(a) }; b.prototype.B = function (a) { return this.A.B(a) }; b.prototype.w = function (a) { return this.A.w(a) }; b.prototype.convertLocation = function (a) { return 1E6 * Number(a.toFixed(6)) }; b.prototype.setSpriteConfig = function (a) {
      this.a.setItem("SpriteList",
        a)
    }; b.prototype.setSpriteList = function (a) { this.j = new e.HashMap; this.l = new e.HashMap; for (var c = a.length; c--;) { var d = a[c]; d.HeadImage = this.K(d); this.j.put(d.Id, d); this.l.put(d.Name, d.Id) } }; b.prototype.L = function () { if (!this.j || !this.l) { this.j = new e.HashMap; this.l = new e.HashMap; for (var a = this.a.getItem("SpriteList"), c = a.length; c--;) { var d = a[c]; d.HeadImage || (d.HeadImage = this.K(d)); this.j.put(d.Id, d); this.l.put(d.Name, d.Id) } } }; b.prototype.getSpriteList = function () { this.L(); return this.j }; b.prototype.getSpriteNameHash =
      function () { this.L(); return this.l }; b.prototype.getSpriteByName = function (a) { var c = this.a.getItem("SpriteList") || [], d = []; if (0 < c.length) for (var b = 0; b < c.length; b++)a ? -1 != c[b].Name.indexOf(a) && d.push(c[b]) : d.push(c[b]); return d }; b.prototype.ja = function () { for (var a = [], c = this.a.getItem("SpriteList"), d = c.length; d--;)c[d].Checked && a.push(c[d].Id); return a }; b.prototype.getTempResults = function () { return this.xa }; b.prototype.u = function (a) {
        a = Number(a); var c = parseInt((a / 3600).toString()); a %= 3600; return [c, parseInt((a /
          60).toString()), parseInt((a % 60).toString())].map(function (a) { a = a.toString(); return a[1] ? a : "0" + a }).join(":")
      }; b.prototype.getLeftTime = function (a, c) { return this.u((a + c - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.K = function (a) { return a && a.SmallImgPath ? this.pa + a.SmallImgPath : "/images/default-head.png" }; b.prototype.getMarkerInfo = function (a) { a = a.split(":"); var c = a[2].split(" "); return { hashid: a[0], totaltime: a[1], latitude: c[0], longitude: c[1] } }; b.prototype.setCoordinate = function (a) {
      this.s = a; this.a.setItem("coordinate",
        a)
      }; b.prototype.getLocation = function (a, c) { this.s || (this.s = this.a.getItem("coordinate") || "GCJ02"); switch (this.s) { case "GCJ02": return [a, c]; case "BD09": return e.D.$(a, c); case "WGS84": return e.D.aa(a, c) } }; b.prototype.setSplitSign = function (a) { this.v = a; this.a.setItem("splitsign", a) }; b.prototype.getSplitSign = function () { "spacesplit" == (this.a.getItem("splitsign") || "spacesplit") ? this.v = " " : this.v = ","; return this.v }; b.prototype.setLonfront = function (a) { this.P = a; this.a.setItem("lonfront", a) }; b.prototype.getLonfront =
        function () { return this.P = this.a.getItem("lonfront") }; b.prototype.setPageSize = function (a) { this.a.setItem("pagesize", a || 20) }; b.prototype.getPageSize = function () { return this.oa = this.a.getItem("pagesize") || 20 }; b.prototype.getOpenId = function () { return this.a.getItem("offical_openid") || this.a.getItem("own_openid") }; b.prototype.getToken = function () { return this.a.getItem("offical_gwgo_token") || this.a.getItem("own_token") }; return b
  }(); e.V = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b(a, c) { this.c = []; this.i = !1; this.b = []; this.N = !1; this.g = []; this.m = []; this.utils = new e.V; this.R = a; this.app = c; -1 != wx.getSystemInfoSync().brand.toLocaleLowerCase().indexOf("iphone") && (this.N = !0) } b.prototype.ca = function () { var a = this; e.SpritesAPI.ha(function (c) { if (c = c.data) { e.SpritesAPI.ia(function (c) { if (c = c.data) a.m = c.data.filters }); c = c.data.sprite_searching_config; for (var d = 0; d < c.length; d++) { var b = a.ea(c[d]); a.g = b } } }) }; b.prototype.ea = function (a) {
      for (var c = [], d = a.xIndex,
        b = a.yIndex, e = 0; e < d; e++)for (var f = a.latitude + 16E3 * e, g = 0; g < b; g++)c.push({ latitude: f, longitude: a.longitude + 19E3 * g }); return c
    }; b.prototype.Z = function (a) { return a.charAt(0).toUpperCase() + a.slice(1) }; b.prototype.Y = function () { var a = this; a.utils.a.getItem("SpriteList") ? console.log(a.utils.a.getItem("SpriteList")) : e.SpritesAPI.da(function (c) { if (200 === c.statusCode) { c = c.data.data.configs; for (var d = [], b = 0; b < c.length; b++) { var e = {}, f; for (f in c[b]) e[a.Z(f)] = c[b][f]; d.push(e) } a.utils.setSpriteConfig(d); a.utils.setSpriteList(d) } }) };
    b.prototype.initSocket = function () { var a = this; this.Y(); this.ma(); this.la(); a.G(); wx.onSocketOpen(function () { console.log("WebSocket\u8fde\u63a5\u5df2\u6253\u5f00\uff01"); a.i = !0; for (var c = 0; c < a.b.length; c++)a.sendSocketMessage(a.b[c]); a.ga(); wx.hideLoading() }); wx.onSocketError(function () { console.log("WebSocket\u8fde\u63a5\u6253\u5f00\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\uff01"); a.i = !1 }); wx.onSocketClose(function () { console.log("WebSocket \u5df2\u5173\u95ed\uff01"); a.i = !1 }); wx.onSocketMessage(function (c) { a.ra(c) }) };
    b.prototype.ma = function () { var a = this; setInterval(function () { a.i || a.G() }, 5E3) }; b.prototype.la = function () { var a = this; setInterval(function () { if (0 < a.b.length) { var c = a.b[0]; a.M = !1; a.sendSocketMessage(c) } else 0 < a.g.length ? (c = a.W(a.g[0]), a.M = !0, a.sendSocketMessage(c)) : a.ca() }, 2E3) }; b.prototype.W = function (a) { return { request_type: "1001", longtitude: a.longitude, latitude: a.latitude, requestid: this.genRequestId("1001"), platform: 0, appid: "wx19376645db21af08", openid: this.utils.getOpenId(), gwgo_token: this.utils.getToken() } };
    b.prototype.G = function () { this.i || (console.log("\u5f00\u59cbWebSocket\u8fde\u63a5"), wx.showLoading({ title: "\u8fde\u63a5\u4e2d" }), wx.connectSocket({ url: "wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0" })) }; b.prototype.sendMessage = function (a) { this.b.push(a) }; b.prototype.clearMessageQueue = function () { this.b = [] }; b.prototype.clearAllMessageQueue = function () { this.b = []; this.g = [] }; b.prototype.sendSocketMessage = function (a) {
      wx.sendSocketMessage({
        data: this.utils.w(a), success: function () { },
        fail: function () { console.log("\u53d1\u9001\u670d\u52a1\u5668\u5931\u8d25") }
      })
    }; b.prototype.ra = function (a) {
      a = this.utils.B((new Uint8Array(a.data)).slice(4)); if (0 < a.length) if (0 < this.b.length && !this.M) if (console.log("\u6536\u5230\u670d\u52a1\u5668\u6d88\u606f", new Date), a = JSON.parse(a), 0 != a.retcode && wx.hideLoading(), "10041" == this.fa(a.requestid)) this.ka(a.filename), this.b.shift(); else {
      (a.packageNO && 1 == a.packageNO || !a.sprite_list || 0 == a.sprite_list.length) && this.b.shift(); a.filter = this.utils.ja(); a.serverFilter =
        this.m; if (this.N) {
          if (a.sprite_list) {
            for (var c = a.sprite_list, d = [], b = c.length; b--;) {
              var f = c[b], h; this.utils.getSpriteList().get(f.sprite_id); this.m && this.m[f.sprite_id] && d.push(f); var g = a.filter; if (0 < g.length && -1 != g.indexOf(f.sprite_id)) {
                h = this.utils.getSpriteList().get(f.sprite_id); var k = (f.latitude / 1E6).toFixed(6), l = (f.longtitude / 1E6).toFixed(6), n = this.utils.getLocation(l, k), m = f.gentime + f.lifetime, g = this.utils.hash(h.Name + f.latitude + f.longtitude + m), p = h.HeadImage; this.app.globalData.clickedObj[g] &&
                  (p = "/images/all.png"); f = { hashid: g, name: h.Name, latitude: k, longitude: l, rlatitude: n[1], rlongitude: n[0], lefttime: this.utils.getLeftTime(f.gentime, f.lifetime), totaltime: m, iconPath: p, id: g + ":" + m + ":" + k + " " + l, width: 40, height: 40, callout: { content: h.Name } }; this.utils.getTempResults().put(g, f)
              }
            } e.SpritesAPI.setSpriteList(d)
          }
        } else this.R.postMessage(a); this.O = (new Date).getTime()
      } else 0 < this.g.length && (this.g.shift(), console.log("\u6536\u5230\u540e\u53f0\u4efb\u52a1\u6d88\u606f", new Date), a = JSON.parse(a), a.filter =
        [], a.serverFilter = this.m, this.R.postMessage(a))
    }; b.prototype.isSearching = function () { return !this.O || 5E3 < (new Date).getTime() - this.O ? !1 : !0 }; b.prototype.genRequestId = function (a) { var c = (new Date).getTime() % 1234567; switch (a) { case "1001": this.c[0] = c; break; case "1002": this.c[1] = c; break; case "1003": this.c[2] = c; break; case "10040": this.c[3] = c; break; case "10041": this.c[4] = c }return c }; b.prototype.fa = function (a) {
      return this.c[0] == a ? "1001" : this.c[1] == a ? "1002" : this.c[2] == a ? "1003" : this.c[3] == a ? "10040" : this.c[4] ==
        a ? "10041" : 0
    }; b.prototype.ga = function () { var a = { request_type: "1004", cfg_type: 1, requestid: this.genRequestId("10041"), platform: 0, appid: "wx19376645db21af08", openid: this.utils.getOpenId(), gwgo_token: this.utils.getToken() }; this.sendMessage(a) }; b.prototype.ka = function (a) { console.log("fileName", a); this.getFileName() != a && (console.log("\u5b58\u5728\u65b0\u7248\uff0c\u5f00\u59cb\u4e0b\u8f7d"), this.I(a)) }; b.prototype.ta = function (a) { this.utils.a.setItem("filename", a) }; b.prototype.getFileName = function () { return this.utils.a.getItem("filename") };
    b.prototype.I = function (a) { var c = this; wx.downloadFile({ url: "https://hy.gwgo.qq.com/sync/pet/config/" + a, success: function (d) { 200 === d.statusCode ? (console.log("\u4e0b\u8f7d\u6210\u529f" + a), d = wx.getFileSystemManager().readFileSync(d.tempFilePath, "utf8"), d = JSON.parse(d).Data, c.utils.setSpriteConfig(d), c.utils.setSpriteList(d), c.ta(a)) : c.H(a) }, fail: function () { c.H(a) } }) }; b.prototype.H = function (a) { var c = this; console.log(a); setTimeout(function () { c.I(a) }, 3E3) }; return b
  }(); e.Socket = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { this.C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split("") } b.prototype.hash = function (a) { var c = 5381, d = a.length - 1; if ("string" == typeof a) for (; -1 < d; d--)c += (c << 5) + a.charCodeAt(d); else for (; -1 < d; d--)c += (c << 5) + a[d]; a = c & 2147483647; c = ""; do c += this.C[a & 63]; while (a >>= 6); return c }; b.prototype.B = function (a) {
      for (var c = "", d = 0; d < a.length;) {
        var b = a[d]; 0 === b >>> 7 ? (c += String.fromCharCode(a[d]), d += 1) : 252 === (b & 252) ? (b = (a[d] & 3) << 30, b |= (a[d + 1] & 63) << 24, b |=
          (a[d + 2] & 63) << 18, b |= (a[d + 3] & 63) << 12, b |= (a[d + 4] & 63) << 6, b |= a[d + 5] & 63, c += String.fromCharCode(b), d += 6) : 248 === (b & 248) ? (b = (a[d] & 7) << 24, b |= (a[d + 1] & 63) << 18, b |= (a[d + 2] & 63) << 12, b |= (a[d + 3] & 63) << 6, b |= a[d + 4] & 63, c += String.fromCharCode(b), d += 5) : 240 === (b & 240) ? (b = (a[d] & 15) << 18, b |= (a[d + 1] & 63) << 12, b |= (a[d + 2] & 63) << 6, b |= a[d + 3] & 63, c += String.fromCharCode(b), d += 4) : 224 === (b & 224) ? (b = (a[d] & 31) << 12, b |= (a[d + 1] & 63) << 6, b |= a[d + 2] & 63, c += String.fromCharCode(b), d += 3) : 192 === (b & 192) ? (b = (a[d] & 63) << 6, b |= a[d + 1] & 63, c += String.fromCharCode(b),
            d += 2) : (c += String.fromCharCode(a[d]), d += 1)
      } return c
    }; b.prototype.wa = function (a) { for (var b = new ArrayBuffer(2 * a.length), b = new Uint16Array(b), d = 0, e = a.length; d < e; d++)b[d] = a.charCodeAt(d); return b }; b.prototype.w = function (a) { a = this.wa(JSON.stringify(a)); var b = a.length, d = new ArrayBuffer(4); (new DataView(d)).setUint32(0, b); b = new Uint8Array(4 + b); b.set(new Uint8Array(d), 0); b.set(a, 4); return b.buffer }; return b
  }(); e.U = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) { e.Ca = function () { return function () { } }() })(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b(a) { this.gentime = a.gentime; this.latitude = a.latitude; this.lifetime = a.lifetime; this.longtitude = a.longtitude; this.sprite_id = a.sprite_id } b.prototype.getLeftTime = function () { return this.u((this.gentime + this.lifetime - (new Date).getTime() / 1E3).toFixed(0)) }; b.prototype.u = function (a) { a = Number(a); var b = parseInt((a / 3600).toString()); a %= 3600; return [b, parseInt((a / 60).toString()), parseInt((a % 60).toString())].map(function (a) { a = a.toString(); return a[1] ? a : "0" + a }).join(":") };
    return b
  }(); e.Aa = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { } b.setSpriteList = function (a) { this.h.qa(this.url + this.sa, a) }; b.ha = function (a) { this.h.get(this.ua, null, a) }; b.ia = function (a) { this.h.get(this.va, null, a) }; b.da = function (a) { this.h.get(this.X, null, a) }; b.get = function (a) { this.h.get(this.url + this.ba + a) }; b.url = "https://www.wangandi.com/"; b.ua = "https://www.wangandi.com/api/config/getSearchConfig"; b.va = "https://www.wangandi.com/api/sprites/filter/get"; b.X = "http://www.wangandi.com/api/sprites/config"; b.ba = "api/sprites/get/";
    b.sa = "api/sprites/set/"; b.h = new e.T; return b
  }(); e.SpritesAPI = f
})(ZhuoYao || (ZhuoYao = {})); (function (e) {
  var f = function () {
    function b() { } b.$ = function (a, b) { var c = Math.sqrt(a * a + b * b) + 2E-5 * Math.sin(b * this.S), e = Math.atan2(b, a) + 3E-6 * Math.cos(a * this.S); return [c * Math.cos(e) + .0065, c * Math.sin(e) + .006] }; b.aa = function (a, b) { if (this.na(a, b)) return [a, b]; var c = this.ya(a - 105, b - 35), e = this.za(a - 105, b - 35), f = b / 180 * this.PI, h = Math.sin(f), h = 1 - this.J * h * h, g = Math.sqrt(h), c = 180 * c / (this.F * (1 - this.J) / (h * g) * this.PI), e = 180 * e / (this.F / g * Math.cos(f) * this.PI); return [2 * a - (Number(a) + e), 2 * b - (Number(b) + c)] }; b.ya = function (a, b) {
      var c =
        -100 + 2 * a + 3 * b + .2 * b * b + .1 * a * b + .2 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(b * this.PI) + 40 * Math.sin(b / 3 * this.PI)) / 3; return c += 2 * (160 * Math.sin(b / 12 * this.PI) + 320 * Math.sin(b * this.PI / 30)) / 3
    }; b.za = function (a, b) {
      var c = 300 + a + 2 * b + .1 * a * a + .1 * a * b + .1 * Math.sqrt(Math.abs(a)), c = c + 2 * (20 * Math.sin(6 * a * this.PI) + 20 * Math.sin(2 * a * this.PI)) / 3, c = c + 2 * (20 * Math.sin(a * this.PI) + 40 * Math.sin(a / 3 * this.PI)) / 3; return c += 2 * (150 * Math.sin(a / 12 * this.PI) + 300 * Math.sin(a / 30 * this.PI)) /
        3
    }; b.na = function (a, b) { return 72.004 > a || 137.8347 < a || .8293 > b || 55.8271 < b || !1 }; b.S = 52.35987755982988; b.PI = 3.141592653589793; b.F = 6378245; b.J = .006693421622965943; return b
  }(); e.D = f
})(ZhuoYao || (ZhuoYao = {}));
export default ZhuoYao;