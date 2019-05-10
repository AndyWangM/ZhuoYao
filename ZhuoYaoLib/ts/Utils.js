/// <reference path="./Sprite.ts" />
var ZhuoYao;
(function (ZhuoYao) {
    var Common = /** @class */ (function () {
        function Common() {
        }
        // 判断两个对象是否相等
        Common.prototype.isObjectValueEqual = function (a, b) {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        };
        /*
         * @description:弱判断两个对象是否相等（忽略属性的先后顺序，只要值相等 @example:A.x=1,A.y=2与A.x=2,A.y=1视为相等
         *
         */
        Common.prototype.isObjectValueEqualIgnoreSequence = function (a, b) {
            var flag = true;
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                if (!this.isPropertyInObject(b, a[aProps[i]])) {
                    flag = false;
                }
            }
            return flag;
        };
        // 判断一个属性值是不是在一个对象里
        Common.prototype.isPropertyInObject = function (object, value) {
            for (var i in object) {
                if (object[i] == value) {
                    return true;
                }
            }
            return false;
        };
        // 判断一个属性值是不是与一个对象的指定属性值相等
        Common.prototype.isPropertyValueInAndEqualObjectPropertyValue = function (object, prop, value) {
            if (prop in object) {
                if (object[prop] == value) {
                    return true;
                }
            }
            return false;
        };
        // 根据一个属性值找对象中另外一个属性值
        Common.prototype.findPropertyValueInObjectWithOtherPropertyValue = function (object, prop1, prop2, value) {
            if (prop1 in object) {
                if (object[prop1] == value) {
                    return object[prop2];
                }
            }
            return false;
        };
        return Common;
    }());
    var HashMap = /** @class */ (function () {
        function HashMap() {
            this.mapSize = 0; // Map大小
            this.entry = new Object(); // 对象
            this.common = new Common(); //取得common的通用方法 
        }
        // Map的存put方法
        HashMap.prototype.put = function (key, value) {
            if (!this.containsKey(key)) {
                this.mapSize++;
                this.entry[key] = value;
            }
        };
        // Map取get方法
        HashMap.prototype.get = function (key) {
            return this.containsKey(key) ? this.entry[key] : null;
        };
        // Map删除remove
        HashMap.prototype.remove = function (key) {
            if (this.containsKey(key) && (delete this.entry[key])) {
                this.mapSize--;
            }
        };
        // 是否包含Key
        HashMap.prototype.containsKey = function (key) {
            return (key in this.entry);
        };
        // 是否包含Value
        HashMap.prototype.containsValue = function (value) {
            for (var prop in this.entry) {
                if (this.common.isObjectValueEqual(this.entry[prop], value)) {
                    return true;
                }
            }
            return false;
        };
        // 所有的Value
        HashMap.prototype.values = function () {
            var values = new Array();
            for (var prop in this.entry) {
                values.push(this.entry[prop]);
            }
            return values;
        };
        // 所有的 Key
        HashMap.prototype.keys = function () {
            var keys = new Array();
            for (var prop in this.entry) {
                keys.push(prop);
            }
            return keys;
        };
        // Map size
        HashMap.prototype.size = function () {
            return this.mapSize;
        };
        // 清空Map
        HashMap.prototype.clear = function () {
            this.mapSize = 0;
            this.entry = new Object();
        };
        // 获取key By value
        HashMap.prototype.getKeyByValue = function (value) {
            for (var prop in this.entry) {
                if (this.common.isObjectValueEqual(this.entry[prop], value)) {
                    console.log("getKeyByValue is ok");
                    return prop;
                }
            }
            return null;
        };
        // 包含特定字段对象的所有keys
        HashMap.prototype.specialKeys = function (containsID) {
            var keys = new Array();
            var object_container = new Array();
            var values = this.values();
            for (var i = 0; i < values.length; i++) {
                console.log(this.common.isPropertyInObject(values[i], containsID));
                if (this.common.isPropertyInObject(values[i], containsID)) {
                    object_container.push(values[i]);
                }
            }
            console.log("object_container.length", object_container.length);
            for (var j = 0; j < object_container.length; j++) {
                keys.push(this.getKeyByValue(object_container[j]));
            }
            return keys;
        };
        // 查找一个弱对象是否存在于哈希表中
        HashMap.prototype.findWeekObjectInHash = function (obj) {
            var values = this.values();
            for (var i = 0; i < values.length; i++) {
                if (this.common.isObjectValueEqualIgnoreSequence(obj, values[i])) {
                    return true;
                }
            }
            return false;
        };
        // 包含对象特定字段的所有keys
        HashMap.prototype.specialKeysSequence = function (containsID, start_end) {
            var keys = new Array();
            var object_container = new Array();
            var values = this.values();
            for (var i = 0; i < values.length; i++) {
                if (this.common.isPropertyValueInAndEqualObjectPropertyValue(values[i], start_end, containsID)) {
                    object_container.push(values[i]);
                }
            }
            for (var j = 0; j < object_container.length; j++) {
                keys.push(this.getKeyByValue(object_container[j]));
            }
            return keys;
        };
        // 根据对象中是否包含某一属性值去查找hashmap的该value（即该对象）
        HashMap.prototype.findObjectByPropety = function (ID) {
            var value = this.values();
            for (var i = 0; i < value.length; i++) {
                if (this.common.isPropertyInObject(value[i], ID)) {
                    return value[i];
                }
            }
            return null;
        };
        return HashMap;
    }());
    ZhuoYao.HashMap = HashMap;
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.utf8ByteToUnicodeStr = function (utf8Bytes) {
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
        Utils.str2abUint16Array = function (str) {
            var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
            var bufView = new Uint16Array(buf);
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return bufView;
        };
        // 字符串转为ArrayBuffer，参数为字符串
        Utils.str2ab = function (str) {
            var uint16array = Utils.str2abUint16Array(JSON.stringify(str));
            var arrayLength = uint16array.length;
            var buf = new ArrayBuffer(4);
            new DataView(buf).setUint32(0, arrayLength);
            var uint8array = new Uint8Array(4 + arrayLength);
            uint8array.set(new Uint8Array(buf), 0);
            uint8array.set(uint16array, 4);
            // console.log(uint8array, uint8array.buffer, arrayLength)
            return uint8array.buffer;
        };
        Utils.convertLocation = function (num) {
            var numStr = num.toFixed(6);
            return Number(numStr) * 1000000;
        };
        Utils.setStorage = function (key, value) {
            wx["setStorage"]({
                key: key,
                data: value
            });
        };
        Utils.getStorage = function (key) {
            return wx["getStorageSync"](key);
        };
        Utils.setSpriteList = function (spriteList) {
            Utils.setStorage("SpriteList", spriteList);
        };
        Utils.setSpriteHash = function (spriteList) {
            this.spriteHash = new HashMap();
            this.spriteNameHash = new HashMap();
            for (var _i = 0, spriteList_1 = spriteList; _i < spriteList_1.length; _i++) {
                var spriteInfo = spriteList_1[_i];
                this.spriteHash.put(spriteInfo.Id, spriteInfo);
                this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
            }
        };
        Utils.getSpriteList = function () {
            if (!this.spriteHash || !this.spriteNameHash) {
                this.spriteHash = new HashMap();
                this.spriteNameHash = new HashMap();
                var spriteList = Utils.getStorage("SpriteList");
                for (var _i = 0, spriteList_2 = spriteList; _i < spriteList_2.length; _i++) {
                    var spriteInfo = spriteList_2[_i];
                    this.spriteHash.put(spriteInfo.Id, spriteInfo);
                    this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
                }
            }
            return this.spriteHash;
        };
        Utils.getSpriteNameHash = function () {
            if (!this.spriteHash || !this.spriteNameHash) {
                this.spriteHash = new HashMap();
                this.spriteNameHash = new HashMap();
                var spriteList = Utils.getStorage("SpriteList");
                for (var _i = 0, spriteList_3 = spriteList; _i < spriteList_3.length; _i++) {
                    var spriteInfo = spriteList_3[_i];
                    this.spriteHash.put(spriteInfo.Id, spriteInfo);
                    this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
                }
            }
            return this.spriteNameHash;
        };
        Utils.getSpriteByName = function (name) {
            var sprite = Utils.getStorage("SpriteList") || [];
            var itemData = [];
            if (sprite.length > 0) {
                for (var i = 0; i < sprite.length; i++) {
                    if (name) {
                        if (sprite[i].Name.indexOf(name) != -1) {
                            itemData.push(sprite[i]);
                        }
                    }
                    else {
                        itemData.push(sprite[i]);
                    }
                }
            }
            return itemData;
        };
        Utils.setSpriteSearchFilter = function (name) {
            this.setStorage("spriteNameFilter", name);
        };
        Utils.getSpriteSearchFilter = function () {
            return this.getStorage("spriteNameFilter");
        };
        Utils.getSpriteSearchNameFilter = function () {
            var spriteList = this.getStorage("SpriteList");
            var arr = [];
            for (var i = 0; i < spriteList.length; i++) {
                if (spriteList[i].Checked) {
                    arr.push(spriteList[i].Name);
                }
            }
            return arr;
        };
        return Utils;
    }());
    ZhuoYao.Utils = Utils;
})(ZhuoYao || (ZhuoYao = {}));
