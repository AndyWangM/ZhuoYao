namespace ZhuoYao {

    declare var wx;

    export class SpriteConfig {
        config: Object;
        fileName: string;
        storage: IStorage;
        spriteHash: HashMap<Sprite>;
        spriteNameHash: HashMap<Object>;
        version: string;

        constructor(config: Config, fileName: string) {
            this.fileName = fileName;
            this.storage = config.storage;
            this.init();
        }

        init() {
            var version = this.getVersion();
            if (this.version != version) {
                this.downloadConfig();
            }
        }

        downloadConfig() {
            var that = this;
            wx["downloadFile"]({
                "url": "https://hy.gwgo.qq.com/sync/pet/config/" + that.fileName,
                "success": function (s) {
                    if (200 === s["statusCode"]) {
                        var n = wx["getFileSystemManager"]()["readFileSync"](s["tempFilePath"], "utf8"),
                            l = JSON.parse(n);
                        var spriteList: Sprite[] = l["Data"];
                        that.saveSpriteListConfig(spriteList);
                        that.setSpriteList(spriteList);
                    } else { that.downloadFailed() }
                },
                "fail": function () {
                    that.downloadFailed()
                }
            })
        }

        private downloadFailed() {
            var that = this;
            setTimeout(function () {
                that.downloadConfig()
            }, 3000)
        }

        private setVersion(version) {
            this.storage.setItem("version", version);
        }

        private getVersion() {
            return this.storage.getItem("version");
        }

        public saveSpriteListConfig(value: Object) {
            this.storage.setItem("spriteList", value);
        }

        public getSpriteListConfig() {
            return this.storage.getItem("spriteList");
        }

        public setSpriteList(spriteList: Sprite[]) {
            this.spriteHash = new HashMap<Sprite>()
            this.spriteNameHash = new HashMap<Sprite>()
            for (const spriteInfo of spriteList) {
                this.spriteHash.put(spriteInfo.Id, spriteInfo);
                this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
            }
        }

        public getSpriteList(): HashMap<Sprite> {
            if (!this.spriteHash || !this.spriteNameHash) {
                this.spriteHash = new HashMap<Sprite>()
                this.spriteNameHash = new HashMap<Sprite>()
                var spriteList: Sprite[] = this.getSpriteListConfig();
                for (const spriteInfo of spriteList) {
                    this.spriteHash.put(spriteInfo.Id, spriteInfo);
                    this.spriteNameHash.put(spriteInfo.Name, spriteInfo.Id);
                }
            }
            return this.spriteHash;
        }
    }

}