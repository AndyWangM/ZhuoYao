namespace ZhuoYao {
    export class MessageHandler {
        config: Config;

        constructor(config: Config) {
            this.config = config;
        }

        messageQueue: Object[] = [];

        post(msg: Object) {
            this.messageQueue.push(msg);
        }

        consume() {
            var that: MessageHandler = this;
            var str: string = that.serializer.utf8ByteToUnicodeStr(new Uint8Array(msg["data"]).slice(4));
            if (str.length > 0) {
                // console.log("收到服务器消息",str.substring(0, 200))
                // console.log("收到服务器消息", str.substring(0, 100));
                var obj = JSON.parse(str);
                if (obj["retcode"] != 0) {
                    // wx["hideLoading"]();
                }
                var id = that.getRequestTypeFromId(obj["requestid"]);
                if (id == "10041") {
                    that.config.spriteConfig = new SpriteConfig(that.config, obj["filename"]);
                } else {
                    if (obj.sprite_list) {
                        var spriteResult: SpriteResult = that.requestResult.getSpriteResult(obj);
                        for (const aliveSprite of spriteResult.sprite_list) {
                            if (!aliveSprite.sprite) {
                                // 无效妖灵
                                // console.log(aliveSprite)
                                continue;
                            }
                            var sprite: Sprite = aliveSprite.sprite;
                            if (sprite) {
                                var spriteNameFilter = Utils.getSpriteSearchNameFilter();
                                if (spriteNameFilter.length > 0) {
                                    for (const spriteName of spriteNameFilter) {
                                        if (sprite.Name == spriteName) {
                                            // console.log(aliveSprite);
                                            var latitude = aliveSprite.latitude.toString().substr(0, 2) + "." + aliveSprite.latitude.toString().substr(2)
                                            var longtitude = aliveSprite.longtitude.toString().substr(0, 3) + "." + aliveSprite.longtitude.toString().substr(3)
                                            // console.log([aliveSprite.sprite.Name, latitude,longtitude,aliveSprite.getLeftTime()])
                                            var resultObj = {
                                                "name": aliveSprite.sprite.Name,
                                                "latitude": latitude,
                                                "longtitude": longtitude,
                                                "lefttime": aliveSprite.getLeftTime()
                                            };
                                            var hashStr = "" + aliveSprite.sprite_id + aliveSprite.latitude + aliveSprite.longtitude + aliveSprite.gentime + aliveSprite.lifetime;
                                            var hashValue = Utils.hash(hashStr);
                                            if (!Utils.getTempResults().containsKey(hashValue)) {
                                                Utils.getTempResults().put(hashStr, resultObj);
                                            }
                                        }
                                    }
                                } else {
                                    console.log(sprite);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}