/// <reference path="./Sprite.ts" />

namespace ZhuoYao {

    declare var wx: any;

    class Common {

        // 判断两个对象是否相等
        public isObjectValueEqual(a, b) {
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
        }

        /*
         * @description:弱判断两个对象是否相等（忽略属性的先后顺序，只要值相等 @example:A.x=1,A.y=2与A.x=2,A.y=1视为相等
         * 
         */
        public isObjectValueEqualIgnoreSequence(a, b) {
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
        }

        // 判断一个属性值是不是在一个对象里
        public isPropertyInObject(object, value) {
            for (var i in object) {
                if (object[i] == value) {
                    return true;
                }
            }
            return false;
        }

        // 判断一个属性值是不是与一个对象的指定属性值相等
        public isPropertyValueInAndEqualObjectPropertyValue(object, prop, value) {
            if (prop in object) {
                if (object[prop] == value) {
                    return true;
                }
            }
            return false;
        }

        // 根据一个属性值找对象中另外一个属性值
        public findPropertyValueInObjectWithOtherPropertyValue(object, prop1,
            prop2, value) {
            if (prop1 in object) {
                if (object[prop1] == value) {
                    return object[prop2];
                }
            }
            return false;
        }
    }

    export class HashMap<T> {

        private mapSize = 0;// Map大小
        private entry = new Object();// 对象
        private common = new Common(); //取得common的通用方法 

        // Map的存put方法
        public put(key, value: T): void {
            if (!this.containsKey(key)) {
                this.mapSize++;
                this.entry[key] = value;
            }
        }

        // Map取get方法
        public get(key): T {
            return this.containsKey(key) ? this.entry[key] : null;
        }

        // Map删除remove
        public remove(key): void {
            if (this.containsKey(key) && (delete this.entry[key])) {
                this.mapSize--;
            }
        }

        // 是否包含Key
        public containsKey(key): boolean {
            return (key in this.entry);
        }

        // 是否包含Value
        public containsValue(value: T): boolean {
            for (var prop in this.entry) {
                if (this.common.isObjectValueEqual(this.entry[prop], value)) {
                    return true;
                }
            }
            return false;
        }

        // 所有的Value
        public values(): T[] {
            var values = new Array<T>();
            for (var prop in this.entry) {
                values.push(this.entry[prop]);
            }
            return values;
        }

        // 所有的 Key
        public keys() {
            var keys = new Array();
            for (var prop in this.entry) {
                keys.push(prop);
            }
            return keys;
        }

        // Map size
        public size(): number {
            return this.mapSize;
        }

        // 清空Map
        public clear(): void {
            this.mapSize = 0;
            this.entry = new Object();
        }

        // 获取key By value
        public getKeyByValue(value: T) {
            for (var prop in this.entry) {
                if (this.common.isObjectValueEqual(this.entry[prop], value)) {
                    console.log("getKeyByValue is ok");
                    return prop;
                }
            }
            return null;
        }

        // 包含特定字段对象的所有keys
        public specialKeys(containsID) {
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
        }

        // 查找一个弱对象是否存在于哈希表中
        public findWeekObjectInHash(obj): boolean {
            var values = this.values();
            for (var i = 0; i < values.length; i++) {
                if (this.common.isObjectValueEqualIgnoreSequence(obj, values[i])) {
                    return true;
                }
            }
            return false;
        }

        // 包含对象特定字段的所有keys
        public specialKeysSequence(containsID, start_end) {
            var keys = new Array();
            var object_container = new Array();
            var values = this.values();
            for (var i = 0; i < values.length; i++) {
                if (this.common.isPropertyValueInAndEqualObjectPropertyValue(values[i],
                    start_end, containsID)) {
                    object_container.push(values[i]);
                }
            }
            for (var j = 0; j < object_container.length; j++) {
                keys.push(this.getKeyByValue(object_container[j]));
            }
            return keys;
        }

        // 根据对象中是否包含某一属性值去查找hashmap的该value（即该对象）
        public findObjectByPropety(ID) {
            var value = this.values();
            for (var i = 0; i < value.length; i++) {
                if (this.common.isPropertyInObject(value[i], ID)) {
                    return value[i];
                }
            }
            return null;
        }
    }

    export class Utils {
        public static spriteHash: HashMap<Sprite>;
        public static spriteNameHash: HashMap<Object>;

        public static utf8ByteToUnicodeStr(utf8Bytes) {
            var unicodeStr = "";
            for (var pos = 0; pos < utf8Bytes.length;) {
                var flag = utf8Bytes[pos];
                var unicode = 0;
                if ((flag >>> 7) === 0) {
                    unicodeStr += String.fromCharCode(utf8Bytes[pos]);
                    pos += 1;
                } else if ((flag & 0xFC) === 0xFC) {
                    unicode = (utf8Bytes[pos] & 0x3) << 30;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
                    unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
                    unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
                    unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 5] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 6;

                } else if ((flag & 0xF8) === 0xF8) {
                    unicode = (utf8Bytes[pos] & 0x7) << 24;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
                    unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
                    unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 4] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 5;

                } else if ((flag & 0xF0) === 0xF0) {
                    unicode = (utf8Bytes[pos] & 0xF) << 18;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
                    unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 3] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 4;

                } else if ((flag & 0xE0) === 0xE0) {
                    unicode = (utf8Bytes[pos] & 0x1F) << 12;;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 2] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 3;

                } else if ((flag & 0xC0) === 0xC0) { //110
                    unicode = (utf8Bytes[pos] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 2;

                } else {
                    unicodeStr += String.fromCharCode(utf8Bytes[pos]);
                    pos += 1;
                }
            }
            return unicodeStr;
        }
        // 字符串转为Uint16Array，参数为字符串
        public static str2abUint16Array(str: string): Uint16Array {
            var buf: ArrayBuffer = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
            var bufView: Uint16Array = new Uint16Array(buf);
            for (var i: number = 0, strLen: number = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return bufView;
        }

        // 字符串转为ArrayBuffer，参数为字符串
        public static str2ab(str: string): ArrayBuffer {
            var uint16array: Uint16Array = Utils.str2abUint16Array(JSON.stringify(str));
            var arrayLength: number = uint16array.length;
            var buf: ArrayBuffer = new ArrayBuffer(4);
            new DataView(buf).setUint32(0, arrayLength);
            var uint8array = new Uint8Array(4 + arrayLength);
            uint8array.set(new Uint8Array(buf), 0);
            uint8array.set(uint16array, 4);
            // console.log(uint8array, uint8array.buffer, arrayLength)
            return uint8array.buffer;
        }

        public static convertLocation(num: number): number {
            var numStr: string = num.toFixed(6);
            return Number(numStr) * 1000000;
        }

        public static setStorage(key, value) {
            wx["setStorage"]({
                key: key,
                data: value
            })
        }

        public static getStorage(key): any {
            return wx["getStorageSync"](key);
        }

        public static setSpriteList(spriteList) {
            Utils.setStorage("SpriteList", spriteList);
        }

        public static setSpriteHash(spriteList: Sprite[]) {
            this.spriteHash = new HashMap<Sprite>()
            this.spriteNameHash = new HashMap<Sprite>()
            for (const spriteInfo of spriteList) {
                this.spriteHash.put(spriteInfo.Id, spriteInfo);
                this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
            }
        }

        public static getSpriteList(): HashMap<Sprite> {
            if (!this.spriteHash || !this.spriteNameHash) {
                this.spriteHash = new HashMap<Sprite>()
                this.spriteNameHash = new HashMap<Sprite>()
                var spriteList: Sprite[] = Utils.getStorage("SpriteList")
                for (const spriteInfo of spriteList) {
                    this.spriteHash.put(spriteInfo.Id, spriteInfo);
                    this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
                }
            }
            return this.spriteHash;
        }

        public static getSpriteNameHash(): HashMap<Object> {
            if (!this.spriteHash || !this.spriteNameHash) {
                this.spriteHash = new HashMap<Sprite>()
                this.spriteNameHash = new HashMap<Sprite>()
                var spriteList: Sprite[] = Utils.getStorage("SpriteList")
                for (const spriteInfo of spriteList) {
                    this.spriteHash.put(spriteInfo.Id, spriteInfo);
                    this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
                }
            }
            return this.spriteNameHash;
        }

        public static getSpriteByName(name) {
            var sprite: Sprite[] = Utils.getStorage("SpriteList")||[];
            var itemData = [];
            if (sprite.length > 0) {
              for (var i = 0; i < sprite.length; i++) {
                if (name) {
                  if (sprite[i].Name.indexOf(name) != -1) {
                    itemData.push(sprite[i]);
                  }
                } else {
                  itemData.push(sprite[i]);
                }
              }
            }
            return itemData;
        }

        public static setSpriteSearchFilter(name: string[]) {
            this.setStorage("spriteNameFilter", name);
        }

        public static getSpriteSearchFilter() {
            return this.getStorage("spriteNameFilter");
        }

        public static getSpriteSearchNameFilter() {
            var spriteList: Sprite[] = this.getStorage("SpriteList");
            var arr: string[] = [];
            for (var i = 0; i< spriteList.length; i++) {
                if (spriteList[i].Checked) {
                    arr.push(spriteList[i].Name);
                }
            }
            return arr;
        }
    }


}