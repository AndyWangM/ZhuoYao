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
      function (spriteList) { this.spriteHash = new HashMap; this.spriteNameHash = new HashMap; for (var i = spriteList.length; i--;) { var spriteInfo = spriteList[i]; this.spriteHash.put(spriteInfo.Id, spriteInfo); this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id) } }; Utils.getSpriteList = function () {
        if (!this.spriteHash || !this.spriteNameHash) {
        this.spriteHash = new HashMap; this.spriteNameHash = new HashMap; var spriteList = Utils.getStorage("SpriteList"); for (var i = spriteList.length; i--;) {
          var spriteInfo = spriteList[i]; this.spriteHash.put(spriteInfo.Id,
            spriteInfo); this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id)
        }
        } return this.spriteHash
      }; Utils.getSpriteNameHash = function () { if (!this.spriteHash || !this.spriteNameHash) { this.spriteHash = new HashMap; this.spriteNameHash = new HashMap; var spriteList = Utils.getStorage("SpriteList"); for (var i = spriteList.length; i--;) { var spriteInfo = spriteList[i]; this.spriteHash.put(spriteInfo.Id, spriteInfo); this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id) } } return this.spriteNameHash }; Utils.getSpriteByName = function (name) {
        var sprite =
          Utils.getStorage("SpriteList") || []; var itemData = []; if (sprite.length > 0) for (var i = 0; i < sprite.length; i++)if (name) { if (sprite[i].Name.indexOf(name) != -1) itemData.push(sprite[i]) } else itemData.push(sprite[i]); return itemData
      }; Utils.setSpriteSearchFilter = function (name) { this.setStorage("spriteNameFilter", name) }; Utils.getSpriteSearchFilter = function () { return this.getStorage("spriteNameFilter") }; Utils.getSpriteSearchNameFilter = function () {
        var arr = []; var spriteList = Utils.getStorage("SpriteList"); for (var i = spriteList.length; i--;)if (spriteList[i].Checked) arr.push(spriteList[i].Id);
        return arr
      }; Utils.getTempResults = function () { return this.tempResults }; Utils.formatTime = function (timeStr) { var time = Number(timeStr); var hour = parseInt((time / 3600).toString()); time = time % 3600; var minute = parseInt((time / 60).toString()); time = time % 60; var second = parseInt(time.toString()); return [hour, minute, second].map(function (n) { var num = n.toString(); return num[1] ? num : "0" + num }).join(":") }; Utils.getLeftTime = function (gentime, lifetime) { var time = gentime + lifetime; var leftTime = time - (new Date).getTime() / 1E3; return this.formatTime(leftTime.toFixed(0)) };
    Utils.tempResults = new HashMap; Utils.I64BIT_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split(""); Utils.spriteIdFilter = []; return Utils
  }(); ZhuoYao.Utils = Utils
})(ZhuoYao || (ZhuoYao = {})); var ZhuoYao;
(function (ZhuoYao) {
  var Socket = function () {
    function Socket(worker) { this.requestIds = []; this.isOpen = false; this.messageQueue = []; this.requestResult = new RequestResult; this.worker = worker } Socket.prototype.initSocket = function () {
      var that = this; that.connectSocket(); wx["onSocketOpen"](function (t) { that.socketConnectedCallback(t) }); wx["onSocketError"](function (e) { console.log("WebSocket\u8fde\u63a5\u6253\u5f00\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\uff01"); setTimeout(function () { that.connectSocket() }, 1E3) }); wx["onSocketClose"](function (e) {
        console.log("WebSocket \u5df2\u5173\u95ed\uff01");
        setTimeout(function () { that.connectSocket() }, 500)
      }); wx["onSocketMessage"](function (t) { that.recMessage(t) })
    }; Socket.prototype.connectSocket = function () { wx["connectSocket"]({ url: "wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0" }) }; Socket.prototype.socketConnectedCallback = function (t) { console.log("WebSocket\u8fde\u63a5\u5df2\u6253\u5f00\uff01"); this.isOpen = true }; Socket.prototype.sendMessage = function (str) { var that = this; that.sendSocketMessage(str) }; Socket.prototype.sendSocketMessage =
      function (str, callback) { var that = this; wx["sendSocketMessage"]({ data: ZhuoYao.Utils.str2ab(str), success: function (n) { console.log("\u53d1\u9001\u670d\u52a1\u5668\u6210\u529f", str) }, fail: function (n) { console.log("\u53d1\u9001\u670d\u52a1\u5668\u5931\u8d25") } }) }; Socket.prototype.recMessage = function (e) {
        var that = this; var str = ZhuoYao.Utils.utf8ByteToUnicodeStr((new Uint8Array(e.data)).slice(4)); if (str.length > 0) {
          console.log("\u6536\u5230\u670d\u52a1\u5668\u6d88\u606f"); var obj = JSON.parse(str); if (obj["retcode"] !=
            0) wx["hideLoading"](); var id = that.getRequestTypeFromId(obj["requestid"]); if (id == "10041") this.getVersionFileName(obj["filename"]); else { obj.filter = ZhuoYao.Utils.getSpriteSearchNameFilter(); that.worker.postMessage(obj); that.lastTime = (new Date).getTime() }
        }
      }; Socket.prototype.isSearching = function () { var time = (new Date).getTime(); if (!this.lastTime) return false; if (time - this.lastTime > 5E3) return false; return true }; Socket.prototype.genRequestId = function (n) {
        var that = this; var g = (new Date).getTime() % 1234567; switch (n) {
          case "1001": that.requestIds[0] =
            g; break; case "1002": that.requestIds[1] = g; break; case "1003": that.requestIds[2] = g; break; case "10040": that.requestIds[3] = g; break; case "10041": that.requestIds[4] = g
        }return g
      }; Socket.prototype.getRequestId = function (n) { var that = this; switch (n) { case "1001": return that.requestIds[0]; case "1002": return that.requestIds[1]; case "1003": return that.requestIds[2]; case "10040": return that.requestIds[3]; case "10041": return that.requestIds[4] } }; Socket.prototype.getRequestTypeFromId = function (n) {
        var that = this; if (that.requestIds[0] ==
          n) return "1001"; else if (that.requestIds[1] == n) return "1002"; else if (that.requestIds[2] == n) return "1003"; else if (that.requestIds[3] == n) return "10040"; else if (that.requestIds[4] == n) return "10041"; else return 0
      }; Socket.prototype.getVersionFileName = function (e) { console.log("fileName", e); this.downloadFile(e) }; Socket.prototype.downloadFile = function (i) {
        var that = this; console.log("\u5b58\u5728\u65b0\u7248\uff0c\u4e0b\u8f7d\u6210\u529f" + i); wx["downloadFile"]({
          "url": "https://hy.gwgo.qq.com/sync/pet/config/" + i, "success": function (s) {
            if (200 ===
              s["statusCode"]) { var n = wx["getFileSystemManager"]()["readFileSync"](s["tempFilePath"], "utf8"), l = JSON.parse(n); var spriteList = l["Data"]; ZhuoYao.Utils.setSpriteList(spriteList); ZhuoYao.Utils.setSpriteHash(spriteList) } else that.downloadFailed(i)
          }, "fail": function () { that.downloadFailed(i) }
        })
      }; Socket.prototype.downloadFailed = function (e) { var that = this; console.log(e); setTimeout(function () { that.downloadFile(e) }, 3E3) }; Socket.prototype.getSpriteNameFilter = function () {
        return ZhuoYao.Utils.getStorage("spriteName") ||
          []
      }; return Socket
  }(); ZhuoYao.Socket = Socket; var RequestResult = function () { function RequestResult() { } RequestResult.prototype.getSpriteResult = function (result) { return new SpriteResult(result) }; return RequestResult }(); var AliveSprite = function () {
    function AliveSprite(obj) { this.gentime = obj["gentime"]; this.latitude = obj["latitude"]; this.lifetime = obj["lifetime"]; this.longtitude = obj["longtitude"]; this.sprite_id = obj["sprite_id"]; this.initSprite() } AliveSprite.prototype.getLeftTime = function () {
      var that = this; var time =
        that.gentime + that.lifetime; var leftTime = time - (new Date).getTime() / 1E3; return that.formatTime(leftTime.toFixed(0))
    }; AliveSprite.prototype.initSprite = function () { var spriteList = ZhuoYao.Utils.getSpriteList(); this.sprite = spriteList.get(this.sprite_id) }; AliveSprite.prototype.formatTime = function (timeStr) {
      var time = Number(timeStr); var hour = parseInt((time / 3600).toString()); time = time % 3600; var minute = parseInt((time / 60).toString()); time = time % 60; var second = parseInt(time.toString()); return [hour, minute, second].map(function (n) {
        var num =
          n.toString(); return num[1] ? num : "0" + num
      }).join(":")
    }; return AliveSprite
  }(); ZhuoYao.AliveSprite = AliveSprite; var SpriteResult = function () { function SpriteResult(obj) { this.end = obj["end"]; this.packageNO = obj["packageNO"]; this.requestid = obj["requestid"]; this.retcode = obj["retcode"]; this.retmsg = obj["retmsg"]; this.sprite_list = []; for (var i = obj["sprite_list"].length; i--;) { this.sprite_list[i] = new AliveSprite(obj["sprite_list"][i]); if (!this.sprite_list[i]) console.log(1) } } return SpriteResult }(); ZhuoYao.SpriteResult =
    SpriteResult
})(ZhuoYao || (ZhuoYao = {})); var ZhuoYao; (function (ZhuoYao) { var Sprite = function () { function Sprite() { } return Sprite }(); ZhuoYao.Sprite = Sprite })(ZhuoYao || (ZhuoYao = {}));
export default ZhuoYao;