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
    ZhuoYao.Common = Common;
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
            else {
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
})(ZhuoYao || (ZhuoYao = {}));
