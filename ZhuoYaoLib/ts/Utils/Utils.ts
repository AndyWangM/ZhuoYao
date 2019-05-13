namespace ZhuoYao {
    export class Utils {
        public static spriteHash: HashMap<Sprite>;
        public static spriteNameHash: HashMap<Object>;
        public static tempResults: HashMap<Object> = new HashMap<Object>();
        public static I64BIT_TABLE: string[] =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

        public static hash(input) {
            var hash = 5381;
            var i = input.length - 1;

            if (typeof input == 'string') {
                for (; i > -1; i--)
                    hash += (hash << 5) + input.charCodeAt(i);
            }
            else {
                for (; i > -1; i--)
                    hash += (hash << 5) + input[i];
            }
            var value = hash & 0x7FFFFFFF;

            var retValue = '';
            do {
                retValue += this.I64BIT_TABLE[value & 0x3F];
            }
            while (value >>= 6);

            return retValue;
        }

        public static convertLocation(num: number): number {
            var numStr: string = num.toFixed(6);
            return Number(numStr) * 1000000;
        }

        public static setStorage(key, value) {
            window.localStorage.setItem(key, value);
            // wx["setStorage"]({
            //     key: key,
            //     data: value
            // })
        }

        public static getStorage(key): any {
            return window.localStorage.getItem(key);
            // return wx["getStorageSync"](key);
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
            var sprite: Sprite[] = Utils.getStorage("SpriteList") || [];
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
            for (var i = 0; i < spriteList.length; i++) {
                if (spriteList[i].Checked) {
                    arr.push(spriteList[i].Name);
                }
            }
            return arr;
        }

        public static getTempResults() {
            return this.tempResults;
        }
    }
}
