var ZhuoYao;
(function (ZhuoYao) {
  var Common = function () {
    function Common() { } Common.prototype.isObjectValueEqual = function (a, b) { var aProps = Object.getOwnPropertyNames(a); var bProps = Object.getOwnPropertyNames(b); if (aProps.length != bProps.length) return false; for (var i = 0; i < aProps.length; i++) { var propName = aProps[i]; if (a[propName] !== b[propName]) return false } return true }; Common.prototype.isObjectValueEqualIgnoreSequence = function (a, b) {
      var flag = true; var aProps = Object.getOwnPropertyNames(a); var bProps = Object.getOwnPropertyNames(b); if (aProps.length !=
        bProps.length) return false; for (var i = 0; i < aProps.length; i++)if (!this.isPropertyInObject(b, a[aProps[i]])) flag = false; return flag
    }; Common.prototype.isPropertyInObject = function (object, value) { for (var i in object) if (object[i] == value) return true; return false }; Common.prototype.isPropertyValueInAndEqualObjectPropertyValue = function (object, prop, value) { if (prop in object) if (object[prop] == value) return true; return false }; Common.prototype.findPropertyValueInObjectWithOtherPropertyValue = function (object, prop1, prop2,
      value) { if (prop1 in object) if (object[prop1] == value) return object[prop2]; return false }; return Common
  }(); var HashMap = function () {
    function HashMap() { this.mapSize = 0; this.entry = new Object; this.common = new Common } HashMap.prototype.put = function (key, value) { if (!this.containsKey(key)) { this.mapSize++; this.entry[key] = value } }; HashMap.prototype.get = function (key) { return this.containsKey(key) ? this.entry[key] : null }; HashMap.prototype.remove = function (key) { if (this.containsKey(key) && delete this.entry[key]) this.mapSize-- };
    HashMap.prototype.containsKey = function (key) { return key in this.entry }; HashMap.prototype.containsValue = function (value) { for (var prop in this.entry) if (this.common.isObjectValueEqual(this.entry[prop], value)) return true; return false }; HashMap.prototype.values = function () { var values = new Array; for (var prop in this.entry) values.push(this.entry[prop]); return values }; HashMap.prototype.keys = function () { var keys = new Array; for (var prop in this.entry) keys.push(prop); return keys }; HashMap.prototype.size = function () { return this.mapSize };
    HashMap.prototype.clear = function () { this.mapSize = 0; this.entry = new Object }; HashMap.prototype.getKeyByValue = function (value) { for (var prop in this.entry) if (this.common.isObjectValueEqual(this.entry[prop], value)) { console.log("getKeyByValue is ok"); return prop } return null }; HashMap.prototype.specialKeys = function (containsID) {
      var keys = new Array; var object_container = new Array; var values = this.values(); for (var i = 0; i < values.length; i++) {
        console.log(this.common.isPropertyInObject(values[i], containsID)); if (this.common.isPropertyInObject(values[i],
          containsID)) object_container.push(values[i])
      } console.log("object_container.length", object_container.length); for (var j = 0; j < object_container.length; j++)keys.push(this.getKeyByValue(object_container[j])); return keys
    }; HashMap.prototype.findWeekObjectInHash = function (obj) { var values = this.values(); for (var i = 0; i < values.length; i++)if (this.common.isObjectValueEqualIgnoreSequence(obj, values[i])) return true; return false }; HashMap.prototype.specialKeysSequence = function (containsID, start_end) {
      var keys = new Array;
      var object_container = new Array; var values = this.values(); for (var i = 0; i < values.length; i++)if (this.common.isPropertyValueInAndEqualObjectPropertyValue(values[i], start_end, containsID)) object_container.push(values[i]); for (var j = 0; j < object_container.length; j++)keys.push(this.getKeyByValue(object_container[j])); return keys
    }; HashMap.prototype.findObjectByPropety = function (ID) { var value = this.values(); for (var i = 0; i < value.length; i++)if (this.common.isPropertyInObject(value[i], ID)) return value[i]; return null };
    return HashMap
  }(); ZhuoYao.HashMap = HashMap; var Utils = function () {
    function Utils() { } Utils.hash = function (input) { var hash = 5381; var i = input.length - 1; if (typeof input == "string") for (; i > -1; i--)hash += (hash << 5) + input.charCodeAt(i); else for (; i > -1; i--)hash += (hash << 5) + input[i]; var value = hash & 2147483647; var retValue = ""; do retValue += this.I64BIT_TABLE[value & 63]; while (value >>= 6); return retValue }; Utils.utf8ByteToUnicodeStr = function (utf8Bytes) {
      var unicodeStr = ""; for (var pos = 0; pos < utf8Bytes.length;) {
        var flag = utf8Bytes[pos];
        var unicode = 0; if (flag >>> 7 === 0) { unicodeStr += String.fromCharCode(utf8Bytes[pos]); pos += 1 } else if ((flag & 252) === 252) { unicode = (utf8Bytes[pos] & 3) << 30; unicode |= (utf8Bytes[pos + 1] & 63) << 24; unicode |= (utf8Bytes[pos + 2] & 63) << 18; unicode |= (utf8Bytes[pos + 3] & 63) << 12; unicode |= (utf8Bytes[pos + 4] & 63) << 6; unicode |= utf8Bytes[pos + 5] & 63; unicodeStr += String.fromCharCode(unicode); pos += 6 } else if ((flag & 248) === 248) {
          unicode = (utf8Bytes[pos] & 7) << 24; unicode |= (utf8Bytes[pos + 1] & 63) << 18; unicode |= (utf8Bytes[pos + 2] & 63) << 12; unicode |= (utf8Bytes[pos +
            3] & 63) << 6; unicode |= utf8Bytes[pos + 4] & 63; unicodeStr += String.fromCharCode(unicode); pos += 5
        } else if ((flag & 240) === 240) { unicode = (utf8Bytes[pos] & 15) << 18; unicode |= (utf8Bytes[pos + 1] & 63) << 12; unicode |= (utf8Bytes[pos + 2] & 63) << 6; unicode |= utf8Bytes[pos + 3] & 63; unicodeStr += String.fromCharCode(unicode); pos += 4 } else if ((flag & 224) === 224) { unicode = (utf8Bytes[pos] & 31) << 12; unicode |= (utf8Bytes[pos + 1] & 63) << 6; unicode |= utf8Bytes[pos + 2] & 63; unicodeStr += String.fromCharCode(unicode); pos += 3 } else if ((flag & 192) === 192) {
          unicode = (utf8Bytes[pos] &
            63) << 6; unicode |= utf8Bytes[pos + 1] & 63; unicodeStr += String.fromCharCode(unicode); pos += 2
        } else { unicodeStr += String.fromCharCode(utf8Bytes[pos]); pos += 1 }
      } return unicodeStr
    }; Utils.str2abUint16Array = function (str) { var buf = new ArrayBuffer(str.length * 2); var bufView = new Uint16Array(buf); for (var i = 0, strLen = str.length; i < strLen; i++)bufView[i] = str.charCodeAt(i); return bufView }; Utils.str2ab = function (str) {
      var uint16array = Utils.str2abUint16Array(JSON.stringify(str)); var arrayLength = uint16array.length; var buf = new ArrayBuffer(4);
      (new DataView(buf)).setUint32(0, arrayLength); var uint8array = new Uint8Array(4 + arrayLength); uint8array.set(new Uint8Array(buf), 0); uint8array.set(uint16array, 4); return uint8array.buffer
    }; Utils.convertLocation = function (num) { var numStr = num.toFixed(6); return Number(numStr) * 1E6 }; Utils.setStorage = function (key, value) { wx["setStorage"]({ key: key, data: value }) }; Utils.getStorage = function (key) { return wx["getStorageSync"](key) }; Utils.setSpriteList = function (spriteList) { Utils.setStorage("SpriteList", spriteList) }; Utils.setSpriteHash =
      function (spriteList) { this.spriteHash = new HashMap; this.spriteNameHash = new HashMap; for (var i = spriteList.length; i--;) { var spriteInfo = spriteList[i]; spriteInfo.HeadImage = this.getHeadImagePath(spriteInfo); this.spriteHash.put(spriteInfo.Id, spriteInfo); this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id) } }; Utils.getSpriteList = function () {
        if (!this.spriteHash || !this.spriteNameHash) {
        this.spriteHash = new HashMap; this.spriteNameHash = new HashMap; var spriteList = Utils.getStorage("SpriteList"); for (var i = spriteList.length; i--;) {
          var spriteInfo =
            spriteList[i]; if (!spriteInfo.HeadImage) spriteInfo.HeadImage = this.getHeadImagePath(spriteInfo); this.spriteHash.put(spriteInfo.Id, spriteInfo); this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id)
        }
        } return this.spriteHash
      }; Utils.getSpriteNameHash = function () {
        if (!this.spriteHash || !this.spriteNameHash) {
        this.spriteHash = new HashMap; this.spriteNameHash = new HashMap; var spriteList = Utils.getStorage("SpriteList"); for (var i = spriteList.length; i--;) {
          var spriteInfo = spriteList[i]; this.spriteHash.put(spriteInfo.Id,
            spriteInfo); this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id)
        }
        } return this.spriteNameHash
      }; Utils.getSpriteByName = function (name) { var sprite = Utils.getStorage("SpriteList") || []; var itemData = []; if (sprite.length > 0) for (var i = 0; i < sprite.length; i++)if (name) { if (sprite[i].Name.indexOf(name) != -1) itemData.push(sprite[i]) } else itemData.push(sprite[i]); return itemData }; Utils.setSpriteSearchFilter = function (name) { this.setStorage("spriteNameFilter", name) }; Utils.getSpriteSearchFilter = function () { return this.getStorage("spriteNameFilter") };
    Utils.getSpriteSearchNameFilter = function () { var arr = []; var spriteList = Utils.getStorage("SpriteList"); for (var i = spriteList.length; i--;)if (spriteList[i].Checked) arr.push(spriteList[i].Id); return arr }; Utils.getTempResults = function () { return this.tempResults }; Utils.formatTime = function (timeStr) {
      var time = Number(timeStr); var hour = parseInt((time / 3600).toString()); time = time % 3600; var minute = parseInt((time / 60).toString()); time = time % 60; var second = parseInt(time.toString()); return [hour, minute, second].map(function (n) {
        var num =
          n.toString(); return num[1] ? num : "0" + num
      }).join(":")
    }; Utils.getLeftTime = function (gentime, lifetime) { var time = gentime + lifetime; var leftTime = time - (new Date).getTime() / 1E3; return this.formatTime(leftTime.toFixed(0)) }; Utils.setFileName = function (filename) { this.setStorage("filename", filename) }; Utils.getFileName = function () { return this.getStorage("filename") }; Utils.getHeadImagePath = function (sprite) { if (sprite) return this.petUrl + sprite.SmallImgPath; else return "/image/default-head.png" }; Utils.getMarkerInfo = function (e) {
      var kv1 =
        e.split(":"); var id = kv1[0]; var location = kv1[1]; return location.split(" ")
    }; Utils.setCoordinate = function (coordinate) { this.coordinate = coordinate; Utils.setStorage("coordinate", coordinate) }; Utils.getLocation = function (lng, lat) { var that = this; if (!that.coordinate) that.coordinate = Utils.getStorage("coordinate") || "GCJ02"; switch (that.coordinate) { case "GCJ02": return [lng, lat]; case "BD09": return ZhuoYao.LocationTrans.gcj02tobd09(lng, lat); case "WGS84": return ZhuoYao.LocationTrans.gcj02towgs84(lng, lat) } }; Utils.setSplitSign =
      function (sign) { var that = this; if (sign == "spacesplit") that.splitSign = " "; else that.splitSign = ","; that.splitSign = sign; Utils.setStorage("splitsign", sign) }; Utils.getSplitSign = function () { var that = this, sign = Utils.getStorage("splitsign") || "spacesplit"; if (sign == "spacesplit") that.splitSign = " "; else that.splitSign = ","; return that.splitSign }; Utils.setLonfront = function (bool) { var that = this; that.lonfront = bool; Utils.setStorage("lonfront", bool) }; Utils.getLonfront = function () {
        var that = this; that.lonfront = Utils.getStorage("lonfront");
        return that.lonfront
      }; Utils.setPageSize = function (size) { Utils.setStorage("pagesize", size || 20) }; Utils.getPageSize = function () { var that = this; that.pageSize = Utils.getStorage("pagesize") || 20; return that.pageSize }; Utils.tempResults = new HashMap; Utils.I64BIT_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split(""); Utils.spriteIdFilter = []; Utils.petUrl = "https://hy.gwgo.qq.com/sync/pet/"; Utils.spriteImage = []; return Utils
  }(); ZhuoYao.Utils = Utils
})(ZhuoYao || (ZhuoYao = {})); var ZhuoYao;
(function (ZhuoYao) {
  var Socket = function () {
    function Socket(worker) { this.requestIds = []; this.isOpen = false; this.isConnecting = false; this.messageQueue = []; this.isIOS = false; this.requestResult = new RequestResult; this.worker = worker; var info = wx.getSystemInfoSync(); if (info.brand.toLocaleLowerCase().indexOf("iphone") != -1) this.isIOS = true } Socket.prototype.initSocket = function () {
      var that = this; this.initSocketChecker(); that.connectSocket(); wx["onSocketOpen"](function (t) {
        console.log("WebSocket\u8fde\u63a5\u5df2\u6253\u5f00\uff01"); that.isOpen =
          true; that.getSettingFileName(); wx["hideLoading"]()
      }); wx["onSocketError"](function (e) { console.log("WebSocket\u8fde\u63a5\u6253\u5f00\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\uff01"); that.isOpen = false }); wx["onSocketClose"](function (e) { console.log("WebSocket \u5df2\u5173\u95ed\uff01"); that.isOpen = false }); wx["onSocketMessage"](function (t) { that.recMessage(t) })
    }; Socket.prototype.initSocketChecker = function () { var that = this; setInterval(function () { if (!that.isOpen) that.connectSocket() }, 500) }; Socket.prototype.connectSocket =
      function () { if (this.isOpen) return; console.log("\u5f00\u59cbWebSocket\u8fde\u63a5"); wx.showLoading({ title: "\u8fde\u63a5\u4e2d" }); wx["connectSocket"]({ url: "wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0" }) }; Socket.prototype.sendMessage = function (str) { var that = this; that.sendSocketMessage(str) }; Socket.prototype.sendSocketMessage = function (str, callback) {
        var that = this; wx["sendSocketMessage"]({
          data: ZhuoYao.Utils.str2ab(str), success: function (n) { console.log("\u53d1\u9001\u670d\u52a1\u5668\u6210\u529f") },
          fail: function (n) { console.log("\u53d1\u9001\u670d\u52a1\u5668\u5931\u8d25") }
        })
      }; Socket.prototype.recMessage = function (e) {
        var that = this; var str = ZhuoYao.Utils.utf8ByteToUnicodeStr((new Uint8Array(e.data)).slice(4)); if (str.length > 0) {
          console.log("\u6536\u5230\u670d\u52a1\u5668\u6d88\u606f"); var obj = JSON.parse(str); if (obj["retcode"] != 0) wx["hideLoading"](); var id = that.getRequestTypeFromId(obj["requestid"]); if (id == "10041") this.getVersionFileName(obj["filename"]); else {
          obj.filter = ZhuoYao.Utils.getSpriteSearchNameFilter();
            ZhuoYao.SpritesAPI.post(obj["sprite_list"]); if (that.isIOS) {
              if (obj.sprite_list) for (var i = obj.sprite_list.length; i--;) {
                var aliveSprite = obj.sprite_list[i]; var spriteNameFilter = obj.filter; if (spriteNameFilter.length > 0) if (spriteNameFilter.indexOf(aliveSprite.sprite_id) != -1) {
                  var sprite = ZhuoYao.Utils.getSpriteList().get(aliveSprite.sprite_id); var latitude = (aliveSprite.latitude / 1E6).toFixed(6); var longitude = (aliveSprite.longtitude / 1E6).toFixed(6); var location = ZhuoYao.Utils.getLocation(longitude, latitude);
                  var resultObj = { "name": sprite.Name, "latitude": location[1], "longitude": location[0], "lefttime": ZhuoYao.Utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime), "iconPath": sprite.HeadImage, "id": sprite.Id + ":" + latitude + " " + longitude, "width": 40, "height": 40 }; var hashStr = "" + aliveSprite.sprite_id + aliveSprite.latitude + aliveSprite.longtitude + aliveSprite.gentime + aliveSprite.lifetime; var hashValue = ZhuoYao.Utils.hash(hashStr); ZhuoYao.Utils.getTempResults().put(hashStr, resultObj)
                }
              }
            } else that.worker.postMessage(obj);
            that.lastTime = (new Date).getTime()
          }
        }
      }; Socket.prototype.isSearching = function () { var time = (new Date).getTime(); if (!this.lastTime) return false; if (time - this.lastTime > 5E3) return false; return true }; Socket.prototype.genRequestId = function (n) { var that = this; var g = (new Date).getTime() % 1234567; switch (n) { case "1001": that.requestIds[0] = g; break; case "1002": that.requestIds[1] = g; break; case "1003": that.requestIds[2] = g; break; case "10040": that.requestIds[3] = g; break; case "10041": that.requestIds[4] = g }return g }; Socket.prototype.getRequestId =
        function (n) { var that = this; switch (n) { case "1001": return that.requestIds[0]; case "1002": return that.requestIds[1]; case "1003": return that.requestIds[2]; case "10040": return that.requestIds[3]; case "10041": return that.requestIds[4] } }; Socket.prototype.getRequestTypeFromId = function (n) {
          var that = this; if (that.requestIds[0] == n) return "1001"; else if (that.requestIds[1] == n) return "1002"; else if (that.requestIds[2] == n) return "1003"; else if (that.requestIds[3] == n) return "10040"; else if (that.requestIds[4] == n) return "10041";
          else return 0
        }; Socket.prototype.getSettingFileName = function () { var that = this; var e = { request_type: "1004", cfg_type: 1, requestid: that.genRequestId("10041"), platform: 0 }; that.sendMessage(e) }; Socket.prototype.getVersionFileName = function (e) { console.log("fileName", e); if (ZhuoYao.Utils.getFileName() != e) { console.log("\u5b58\u5728\u65b0\u7248\uff0c\u5f00\u59cb\u4e0b\u8f7d"); this.downloadFile(e) } }; Socket.prototype.downloadFile = function (i) {
          var that = this; wx["downloadFile"]({
            "url": "https://hy.gwgo.qq.com/sync/pet/config/" +
              i, "success": function (s) { if (200 === s["statusCode"]) { console.log("\u4e0b\u8f7d\u6210\u529f" + i); var n = wx["getFileSystemManager"]()["readFileSync"](s["tempFilePath"], "utf8"), l = JSON.parse(n); var spriteList = l["Data"]; ZhuoYao.Utils.setSpriteList(spriteList); ZhuoYao.Utils.setSpriteHash(spriteList); ZhuoYao.Utils.setFileName(i) } else that.downloadFailed(i) }, "fail": function () { that.downloadFailed(i) }
          })
        }; Socket.prototype.downloadFailed = function (e) {
          var that = this; console.log(e); setTimeout(function () { that.downloadFile(e) },
            3E3)
        }; Socket.prototype.getSpriteNameFilter = function () { return ZhuoYao.Utils.getStorage("spriteName") || [] }; return Socket
  }(); ZhuoYao.Socket = Socket; var RequestResult = function () { function RequestResult() { } RequestResult.prototype.getSpriteResult = function (result) { return new SpriteResult(result) }; return RequestResult }(); var AliveSprite = function () {
    function AliveSprite(obj) {
    this.gentime = obj["gentime"]; this.latitude = obj["latitude"]; this.lifetime = obj["lifetime"]; this.longtitude = obj["longtitude"]; this.sprite_id =
      obj["sprite_id"]; this.initSprite()
    } AliveSprite.prototype.getLeftTime = function () { var that = this; var time = that.gentime + that.lifetime; var leftTime = time - (new Date).getTime() / 1E3; return that.formatTime(leftTime.toFixed(0)) }; AliveSprite.prototype.initSprite = function () { var spriteList = ZhuoYao.Utils.getSpriteList(); this.sprite = spriteList.get(this.sprite_id) }; AliveSprite.prototype.formatTime = function (timeStr) {
      var time = Number(timeStr); var hour = parseInt((time / 3600).toString()); time = time % 3600; var minute = parseInt((time /
        60).toString()); time = time % 60; var second = parseInt(time.toString()); return [hour, minute, second].map(function (n) { var num = n.toString(); return num[1] ? num : "0" + num }).join(":")
    }; return AliveSprite
  }(); ZhuoYao.AliveSprite = AliveSprite; var SpriteResult = function () {
    function SpriteResult(obj) {
    this.end = obj["end"]; this.packageNO = obj["packageNO"]; this.requestid = obj["requestid"]; this.retcode = obj["retcode"]; this.retmsg = obj["retmsg"]; this.sprite_list = []; for (var i = obj["sprite_list"].length; i--;) {
    this.sprite_list[i] = new AliveSprite(obj["sprite_list"][i]);
      if (!this.sprite_list[i]) console.log(1)
    }
    } return SpriteResult
  }(); ZhuoYao.SpriteResult = SpriteResult
})(ZhuoYao || (ZhuoYao = {})); var ZhuoYao; (function (ZhuoYao) { var Sprite = function () { function Sprite() { } return Sprite }(); ZhuoYao.Sprite = Sprite })(ZhuoYao || (ZhuoYao = {})); var ZhuoYao;
(function (ZhuoYao) {
  var SpritesAPI = function () {
    function SpritesAPI() { } SpritesAPI.post = function (obj) { var that = this; var url = that.url + that.setAPI; wx["request"]({ url: url, method: "POST", data: obj, header: { "content-type": "application/json" }, success: function (res) { console.log(res) }, failed: function (res) { console.log(res) } }) }; SpritesAPI.get = function (id) { var that = this; var url = that.url + that.getAPI + id; wx["request"]({ url: url, method: "GET", success: function (res) { console.log(res) }, failed: function (res) { console.log(res) } }) }; SpritesAPI.url =
      "https://zhuoyao.wangandi.com/"; SpritesAPI.getAPI = "api/sprites/get/"; SpritesAPI.setAPI = "api/sprites/set/"; return SpritesAPI
  }(); ZhuoYao.SpritesAPI = SpritesAPI
})(ZhuoYao || (ZhuoYao = {})); var ZhuoYao;
(function (ZhuoYao) {
  var LocationTrans = function () {
    function LocationTrans() { } LocationTrans.gcj02tobd09 = function (lng, lat) { var z = Math.sqrt(lng * lng + lat * lat) + 2E-5 * Math.sin(lat * this.x_PI); var theta = Math.atan2(lat, lng) + 3E-6 * Math.cos(lng * this.x_PI); var bd_lng = z * Math.cos(theta) + .0065; var bd_lat = z * Math.sin(theta) + .006; return [bd_lng.toFixed(6), bd_lat.toFixed(6)] }; LocationTrans.gcj02towgs84 = function (lng, lat) {
      if (this.out_of_china(lng, lat)) return [lng, lat]; else {
        var dlat = this.transformlat(lng - 105, lat - 35); var dlng =
          this.transformlng(lng - 105, lat - 35); var radlat = lat / 180 * this.PI; var magic = Math.sin(radlat); magic = 1 - this.ee * magic * magic; var sqrtmagic = Math.sqrt(magic); dlat = dlat * 180 / (this.a * (1 - this.ee) / (magic * sqrtmagic) * this.PI); dlng = dlng * 180 / (this.a / sqrtmagic * Math.cos(radlat) * this.PI); var mglat = Number(lat) + dlat; var mglng = Number(lng) + dlng; return [(lng * 2 - mglng).toFixed(6), (lat * 2 - mglat).toFixed(6)]
      }
    }; LocationTrans.transformlat = function (lng, lat) {
      var ret = -100 + 2 * lng + 3 * lat + .2 * lat * lat + .1 * lng * lat + .2 * Math.sqrt(Math.abs(lng)); ret +=
        (20 * Math.sin(6 * lng * this.PI) + 20 * Math.sin(2 * lng * this.PI)) * 2 / 3; ret += (20 * Math.sin(lat * this.PI) + 40 * Math.sin(lat / 3 * this.PI)) * 2 / 3; ret += (160 * Math.sin(lat / 12 * this.PI) + 320 * Math.sin(lat * this.PI / 30)) * 2 / 3; return ret
    }; LocationTrans.transformlng = function (lng, lat) {
      var ret = 300 + lng + 2 * lat + .1 * lng * lng + .1 * lng * lat + .1 * Math.sqrt(Math.abs(lng)); ret += (20 * Math.sin(6 * lng * this.PI) + 20 * Math.sin(2 * lng * this.PI)) * 2 / 3; ret += (20 * Math.sin(lng * this.PI) + 40 * Math.sin(lng / 3 * this.PI)) * 2 / 3; ret += (150 * Math.sin(lng / 12 * this.PI) + 300 * Math.sin(lng /
        30 * this.PI)) * 2 / 3; return ret
    }; LocationTrans.out_of_china = function (lng, lat) { return lng < 72.004 || lng > 137.8347 || (lat < .8293 || lat > 55.8271 || false) }; LocationTrans.x_PI = 3.141592653589793 * 3E3 / 180; LocationTrans.PI = 3.141592653589793; LocationTrans.a = 6378245; LocationTrans.ee = .006693421622965943; LocationTrans.coordinate = "GCJ02"; return LocationTrans
  }(); ZhuoYao.LocationTrans = LocationTrans
})(ZhuoYao || (ZhuoYao = {}));
export default ZhuoYao;
