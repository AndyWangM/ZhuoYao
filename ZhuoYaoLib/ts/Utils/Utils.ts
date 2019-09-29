/// <reference path="../Models/Sprite.ts" />
/// <reference path="./HashMap.ts" />
/// <reference path="./LocationTrans.ts" />

namespace ZhuoYao {

    declare var wx: any;

    export class Utils {
        public spriteHash: HashMap<Sprite>;
        public spriteNameHash: HashMap<Object>;
        public tempResults: HashMap<Object> = new HashMap<Object>();
        public I64BIT_TABLE: string[] =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
        public spriteIdFilter: number[] = [];
        public petUrl: string = "https://hy.gwgo.qq.com/sync/pet/";
        public spriteImage: string[] = [];
        coordinate: string;
        splitSign: string;
        lonfront: boolean;
        pageSize: number;
        storage: Storage;
        stringUtils: StringUtils;

        constructor() {
            this.storage = new Storage();
            this.stringUtils = new StringUtils();
        }

        public hash(input) {
            return this.stringUtils.hash(input);
        }

        public utf8ByteToUnicodeStr(utf8Bytes) {
            return this.stringUtils.utf8ByteToUnicodeStr(utf8Bytes);
        }

        // 字符串转为ArrayBuffer，参数为字符串
        public str2ab(str: Object): ArrayBuffer {
            return this.stringUtils.str2ab(str);
        }

        public convertLocation(num: number): number {
            var numStr: string = num.toFixed(6);
            return Number(numStr) * 1000000;
        }

        public setSpriteConfig(spriteList) {
            this.storage.setItem("SpriteList", spriteList);
        }

        public setSpriteList(spriteList: Sprite[]) {
            this.spriteHash = new HashMap<Sprite>()
            this.spriteNameHash = new HashMap<Sprite>()
            for (var i = spriteList.length; i--;) {
                var spriteInfo = spriteList[i];
                spriteInfo.HeadImage = this.getHeadImagePath(spriteInfo);
                this.spriteHash.put(spriteInfo.Id, spriteInfo);
                this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
            }
        }

        private initHash() {
            if (!this.spriteHash || !this.spriteNameHash) {
                this.spriteHash = new HashMap<Sprite>()
                this.spriteNameHash = new HashMap<Sprite>()
                var spriteList: Sprite[] = this.storage.getItem("SpriteList")
                for (var i = spriteList.length; i--;) {
                    var spriteInfo = spriteList[i];
                    if (!spriteInfo.HeadImage) {
                        spriteInfo.HeadImage = this.getHeadImagePath(spriteInfo);
                    }
                    this.spriteHash.put(spriteInfo.Id, spriteInfo);
                    this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
                }
            }
        }
        /**
         * 获取id和妖灵配置的hash表
         */
        public getSpriteList(): HashMap<Sprite> {
            this.initHash();
            return this.spriteHash;
        }

        /**
         * 获取名字和id的hash表
         */
        public getSpriteNameHash(): HashMap<Object> {
            this.initHash();
            return this.spriteNameHash;
        }

        /**
         * 根据名字在列表中检索
         * @param name 
         */
        public getSpriteByName(name) {
            var sprite: Sprite[] = this.storage.getItem("SpriteList") || [];
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

        public getSpriteSearchNameFilter() {
            var arr: number[] = [];
            var spriteList: Sprite[] = this.storage.getItem("SpriteList");
            for (var i = spriteList.length; i--;) {
                if (spriteList[i].Checked) {
                    arr.push(spriteList[i].Id);
                }
            }
            return arr;
        }

        /**
         * 获取搜索缓存
         */
        public getTempResults() {
            return this.tempResults;
        }

        public formatTime(timeStr: string) {
            var time: number = Number(timeStr);

            var hour = parseInt((time / 3600).toString());
            time = time % 3600;
            var minute = parseInt((time / 60).toString());
            time = time % 60;
            var second = parseInt(time.toString());

            return ([hour, minute, second]).map(function (n) {
                var num: string = n.toString();
                return num[1] ? num : '0' + num;
            }).join(':');
        }

        public getLeftTime(gentime, lifetime) {
            var time = gentime + lifetime;
            var leftTime = time - (new Date).getTime() / 1000;
            return this.formatTime(leftTime.toFixed(0));
        }

        /**
         * 
         * @param sprite 获取图标头
         */
        private getHeadImagePath(sprite: Sprite) {
            if (sprite) {
                if (sprite.SmallImgPath) {
                    return this.petUrl + sprite.SmallImgPath;
                }
            } 
            return "/images/default-head.png";
        }

        /**
         * 获取markerId中的经纬度信息
         * @param e 
         */
        public getMarkerInfo(e) {
            var kv1 = e.split(":");
            var hashid = kv1[0];
            var time = kv1[1];
            var location = kv1[2].split(" ");
            var obj = {
                "hashid": hashid,
                "totaltime": time,
                "latitude": location[0],
                "longitude": location[1]
            }
            return obj;
        }

        /**
         * 设置经纬度坐标系
         * @param coordinate 
         */
        public setCoordinate(coordinate) {
            this.coordinate = coordinate;
            this.storage.setItem("coordinate", coordinate);
        }
        public getLocation(lng, lat) {
            var that = this;
            if (!that.coordinate) {
                that.coordinate = this.storage.getItem("coordinate") || "GCJ02";
            }
            switch (that.coordinate) {
                case "GCJ02":
                    return [lng, lat];
                case "BD09":
                    return LocationTrans.gcj02tobd09(lng, lat);
                case "WGS84":
                    return LocationTrans.gcj02towgs84(lng, lat);
            }
        }
        /**
         * 复制结果分隔符
         * @param sign 复制结果分隔符
         */
        public setSplitSign(sign) {
            var that = this;
            if (sign == "spacesplit") {
                that.splitSign = " ";
            } else {
                that.splitSign = ",";
            }
            that.splitSign = sign;
            this.storage.setItem("splitsign", sign);
        }
        public getSplitSign() {
            var that = this, sign = this.storage.getItem("splitsign") || "spacesplit";
            if (sign == "spacesplit") {
                that.splitSign = " ";
            } else {
                that.splitSign = ",";
            }
            return that.splitSign;
        }
        /**
         * 复制结果经纬度顺序
         */
        public setLonfront(bool) {
            var that = this;
            that.lonfront = bool;
            this.storage.setItem("lonfront", bool);
        }
        public getLonfront() {
            var that = this;
            that.lonfront = this.storage.getItem("lonfront");
            return that.lonfront;
        }
        /**
         * 分页数量
         */
        public setPageSize(size) {
            this.storage.setItem("pagesize", size || 20);
        }
        public getPageSize() {
            var that = this;
            that.pageSize = this.storage.getItem("pagesize") || 20;
            return that.pageSize;
        }
        public getOpenId() {
            return this.storage.getItem("offical_openid") || this.storage.getItem("own_v1_openid");
        }
        public getToken() {
            return this.storage.getItem("offical_gwgo_token") || this.storage.getItem("own_v1_token");
        }
    }


}