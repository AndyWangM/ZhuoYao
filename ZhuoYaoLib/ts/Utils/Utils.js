/// <reference path="../Models/Sprite.ts" />
/// <reference path="./HashMap.ts" />
/// <reference path="./LocationTrans.ts" />
var ZhuoYao;
(function (ZhuoYao) {
    var Utils = /** @class */ (function () {
        function Utils() {
            this.tempResults = new ZhuoYao.HashMap();
            this.I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
            this.spriteIdFilter = [];
            this.petUrl = "https://hy.gwgo.qq.com/sync/pet/";
            this.spriteImage = [];
            this.storage = new ZhuoYao.Storage();
            this.stringUtils = new ZhuoYao.StringUtils();
        }
        Utils.prototype.hash = function (input) {
            return this.stringUtils.hash(input);
        };
        Utils.prototype.utf8ByteToUnicodeStr = function (utf8Bytes) {
            return this.stringUtils.utf8ByteToUnicodeStr(utf8Bytes);
        };
        // 字符串转为ArrayBuffer，参数为字符串
        Utils.prototype.str2ab = function (str) {
            return this.stringUtils.str2ab(str);
        };
        Utils.prototype.convertLocation = function (num) {
            var numStr = num.toFixed(6);
            return Number(numStr) * 1000000;
        };
        Utils.prototype.setSpriteConfig = function (spriteList) {
            this.storage.setItem("SpriteList", spriteList);
        };
        Utils.prototype.setSpriteList = function (spriteList) {
            this.spriteHash = new ZhuoYao.HashMap();
            this.spriteNameHash = new ZhuoYao.HashMap();
            for (var i = spriteList.length; i--;) {
                var spriteInfo = spriteList[i];
                spriteInfo.HeadImage = this.getHeadImagePath(spriteInfo);
                this.spriteHash.put(spriteInfo.Id, spriteInfo);
                this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
            }
        };
        Utils.prototype.initHash = function () {
            if (!this.spriteHash || !this.spriteNameHash) {
                this.spriteHash = new ZhuoYao.HashMap();
                this.spriteNameHash = new ZhuoYao.HashMap();
                var spriteList = this.storage.getItem("SpriteList");
                for (var i = spriteList.length; i--;) {
                    var spriteInfo = spriteList[i];
                    if (!spriteInfo.HeadImage) {
                        spriteInfo.HeadImage = this.getHeadImagePath(spriteInfo);
                    }
                    this.spriteHash.put(spriteInfo.Id, spriteInfo);
                    this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
                }
            }
        };
        /**
         * 获取id和妖灵配置的hash表
         */
        Utils.prototype.getSpriteList = function () {
            this.initHash();
            return this.spriteHash;
        };
        /**
         * 获取名字和id的hash表
         */
        Utils.prototype.getSpriteNameHash = function () {
            this.initHash();
            return this.spriteNameHash;
        };
        /**
         * 根据名字在列表中检索
         * @param name
         */
        Utils.prototype.getSpriteByName = function (name) {
            var sprite = this.storage.getItem("SpriteList") || [];
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
        Utils.prototype.getSpriteSearchNameFilter = function () {
            var arr = [];
            var spriteList = this.storage.getItem("SpriteList");
            for (var i = spriteList.length; i--;) {
                if (spriteList[i].Checked) {
                    arr.push(spriteList[i].Id);
                }
            }
            return arr;
        };
        /**
         * 获取搜索缓存
         */
        Utils.prototype.getTempResults = function () {
            return this.tempResults;
        };
        Utils.prototype.formatTime = function (timeStr) {
            var time = Number(timeStr);
            var hour = parseInt((time / 3600).toString());
            time = time % 3600;
            var minute = parseInt((time / 60).toString());
            time = time % 60;
            var second = parseInt(time.toString());
            return ([hour, minute, second]).map(function (n) {
                var num = n.toString();
                return num[1] ? num : '0' + num;
            }).join(':');
        };
        Utils.prototype.getLeftTime = function (gentime, lifetime) {
            var time = gentime + lifetime;
            var leftTime = time - (new Date).getTime() / 1000;
            return this.formatTime(leftTime.toFixed(0));
        };
        /**
         *
         * @param sprite 获取图标头
         */
        Utils.prototype.getHeadImagePath = function (sprite) {
            if (sprite) {
                return this.petUrl + sprite.SmallImgPath;
            }
            else {
                return "/image/default-head.png";
            }
        };
        /**
         * 获取markerId中的经纬度信息
         * @param e
         */
        Utils.prototype.getMarkerInfo = function (e) {
            var kv1 = e.split(":");
            var id = kv1[0];
            var location = kv1[1];
            return location.split(" ");
        };
        /**
         * 设置经纬度坐标系
         * @param coordinate
         */
        Utils.prototype.setCoordinate = function (coordinate) {
            this.coordinate = coordinate;
            this.storage.setItem("coordinate", coordinate);
        };
        Utils.prototype.getLocation = function (lng, lat) {
            var that = this;
            if (!that.coordinate) {
                that.coordinate = this.storage.getItem("coordinate") || "GCJ02";
            }
            switch (that.coordinate) {
                case "GCJ02":
                    return [lng, lat];
                case "BD09":
                    return ZhuoYao.LocationTrans.gcj02tobd09(lng, lat);
                case "WGS84":
                    return ZhuoYao.LocationTrans.gcj02towgs84(lng, lat);
            }
        };
        /**
         * 复制结果分隔符
         * @param sign 复制结果分隔符
         */
        Utils.prototype.setSplitSign = function (sign) {
            var that = this;
            if (sign == "spacesplit") {
                that.splitSign = " ";
            }
            else {
                that.splitSign = ",";
            }
            that.splitSign = sign;
            this.storage.setItem("splitsign", sign);
        };
        Utils.prototype.getSplitSign = function () {
            var that = this, sign = this.storage.getItem("splitsign") || "spacesplit";
            if (sign == "spacesplit") {
                that.splitSign = " ";
            }
            else {
                that.splitSign = ",";
            }
            return that.splitSign;
        };
        /**
         * 复制结果经纬度顺序
         */
        Utils.prototype.setLonfront = function (bool) {
            var that = this;
            that.lonfront = bool;
            this.storage.setItem("lonfront", bool);
        };
        Utils.prototype.getLonfront = function () {
            var that = this;
            that.lonfront = this.storage.getItem("lonfront");
            return that.lonfront;
        };
        /**
         * 分页数量
         */
        Utils.prototype.setPageSize = function (size) {
            this.storage.setItem("pagesize", size || 20);
        };
        Utils.prototype.getPageSize = function () {
            var that = this;
            that.pageSize = this.storage.getItem("pagesize") || 20;
            return that.pageSize;
        };
        return Utils;
    }());
    ZhuoYao.Utils = Utils;
})(ZhuoYao || (ZhuoYao = {}));
