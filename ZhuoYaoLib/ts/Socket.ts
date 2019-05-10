/// <reference path="./Utils.ts" />

namespace ZhuoYao {

    declare var wx: any;

    export class Socket {

        requestIds: number[] = [];
        requestResult: RequestResult;
        content: any;
        isOpen: boolean;

        constructor(content) {
            this.requestResult = new RequestResult();
            this.content = content;
        }

        public initSocket(): void {
            var that: Socket = this;
            that.connectSocket();
            wx["onSocketOpen"](function (t) {
                that.socketConnectedCallback(t)
            });
            wx["onSocketError"](function (e) {
                console.log("WebSocket连接打开失败，请检查！")
            });
            wx["onSocketClose"](function (e) {
                console.log("WebSocket 已关闭！");
                setTimeout(function () {
                    that.connectSocket()
                }, 1000);
            });
            wx["onSocketMessage"](function (t) {
                that.recMessage(t)
            });
        }

        private connectSocket() {
            wx["connectSocket"]({
                url: 'wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0'
            })
        }

        private socketConnectedCallback(t) {
            console.log("WebSocket连接已打开！");
            this.isOpen = true;
        }

        public sendSocketMessage(str: string, callback: Function) {
            var that: Socket = this;
            wx["sendSocketMessage"]({
                data: Utils.str2ab(str),
                success: function (n) {
                    console.log("发送服务器成功", str);
                },
                fail: function (n) {
                    console.log("发送服务器失败", str), callback && callback();
                }
            });
        }

        private recMessage(e) {
            var that: Socket = this;
            var str: string = Utils.utf8ByteToUnicodeStr(new Uint8Array(e.data).slice(4));
            if (str.length > 0) {
                // console.log("收到服务器消息", str);
                var obj = JSON.parse(str);
                if (obj["retcode"] != 0) {
                    wx["hideLoading"]();
                }
                var id = that.getRequestTypeFromId(obj["requestid"]);
                if (id == "10041") {
                    this.getVersionFileName(obj["filename"]);
                } else {
                    var spriteResult: SpriteResult = that.requestResult.getSpriteResult(obj);
                    var minLat = 1000000000;
                    var maxLat = 0;
                    var minLong = 1000000000;
                    var maxLong = 0;
                    for (const aliveSprite of spriteResult.sprite_list) {
                        if (aliveSprite.latitude < minLat) {
                            minLat = aliveSprite.latitude;
                        }
                        if (aliveSprite.latitude > maxLat) {
                            maxLat = aliveSprite.latitude;
                        }
                        if (aliveSprite.longtitude < minLong) {
                            minLong = aliveSprite.longtitude;
                        }
                        if (aliveSprite.longtitude > maxLong) {
                            maxLong = aliveSprite.longtitude;
                        }
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
                                        }
                                        that.content.data.result.push(resultObj);
                                        // console.log("名称: " + aliveSprite.sprite.Name,aliveSprite.getLeftTime());
                                        // console.log("纬度: " + latitude);
                                        // console.log("经度: " + longtitude);
                                        // console.log("消失时间: " + aliveSprite.getLeftTime())
                                    }
                                }
                            } else {
                                console.log(sprite);
                            }
                        }
                    }
                    // console.log("最小纬度: "+ minLat);
                    // console.log("最大纬度: "+ maxLat);
                    // console.log("最小经度: "+ minLong);
                    // console.log("最大经度: "+ maxLong);
                    // console.log("纬度差值: " + (maxLat - minLat));
                    // console.log("经度差值: " + (maxLong - minLong));
                }
                // switch (id) {
                //     case "10041":
                //         this.getVersionFileName(obj["filename"]);
                //         break;
                //     case "1001":
                //         var spriteResult: SpriteResult = that.requestResult.getSpriteResult(obj);
                //         var minLat = 1000000000;
                //         var maxLat = 0;
                //         var minLong = 1000000000;
                //         var maxLong = 0;
                //         for (const aliveSprite of spriteResult.sprite_list) {
                //             if (aliveSprite.latitude < minLat) {
                //                 minLat = aliveSprite.latitude;
                //             }
                //             if (aliveSprite.latitude > maxLat) {
                //                 maxLat = aliveSprite.latitude;
                //             }
                //             if (aliveSprite.longtitude < minLong) {
                //                 minLong = aliveSprite.longtitude;
                //             }
                //             if (aliveSprite.longtitude > maxLong) {
                //                 maxLong = aliveSprite.longtitude;
                //             }
                //             if (!aliveSprite.sprite) {
                //                 // 无效妖灵
                //                 // console.log(aliveSprite)
                //                 continue;
                //             }
                //             var sprite: Sprite = aliveSprite.sprite;
                //             if (sprite) {
                //                 var spriteName = that.getSpriteNameFilter();
                //                 if (spriteName.length > 0) {
                //                     for (const spriteName of that.getSpriteNameFilter()) {
                //                         if (sprite.Name == spriteName) {
                //                             // console.log(aliveSprite);
                //                             var latitude = aliveSprite.latitude.toString().substr(0, 2) + "." + aliveSprite.latitude.toString().substr(2)
                //                             var longtitude = aliveSprite.longtitude.toString().substr(0, 3) + "." + aliveSprite.longtitude.toString().substr(3)
                //                             console.log([aliveSprite.sprite.Name, latitude,longtitude,aliveSprite.getLeftTime()])
                //                             // console.log("名称: " + aliveSprite.sprite.Name,aliveSprite.getLeftTime());
                //                             // console.log("纬度: " + latitude);
                //                             // console.log("经度: " + longtitude);
                //                             // console.log("消失时间: " + aliveSprite.getLeftTime())
                //                         }
                //                     }
                //                 } else {
                //                     console.log(sprite);
                //                 }
                //             }
                //         }
                //         // console.log("最小纬度: "+ minLat);
                //         // console.log("最大纬度: "+ maxLat);
                //         // console.log("最小经度: "+ minLong);
                //         // console.log("最大经度: "+ maxLong);
                //         // console.log("纬度差值: " + (maxLat - minLat));
                //         // console.log("经度差值: " + (maxLong - minLong));
                //         break;
                // }
            }
        }

        public genRequestId(n) {
            var that = this;
            var g = (new Date).getTime() % 1234567;
            switch (n) {
                case "1001":
                    that.requestIds[0] = g;
                    break;
                case "1002":
                    that.requestIds[1] = g;
                    break;
                case "1003":
                    that.requestIds[2] = g;
                    break;
                case "10040":
                    that.requestIds[3] = g;
                    break;
                case "10041":
                    that.requestIds[4] = g
            }
            return g
        }

        public getRequestId(n) {
            var that = this;
            switch (n) {
                case "1001":
                    return that.requestIds[0];
                case "1002":
                    return that.requestIds[1];
                case "1003":
                    return that.requestIds[2];
                case "10040":
                    return that.requestIds[3];
                case "10041":
                    return that.requestIds[4]
            }
        }

        getRequestTypeFromId(n) {
            var that = this;
            if (that.requestIds[0] == n) {
                return "1001";
            } else if (that.requestIds[1] == n) {
                return "1002";
            } else if (that.requestIds[2] == n) {
                return "1003";
            } else if (that.requestIds[3] == n) {
                return "10040";
            } else if (that.requestIds[4] == n) {
                return "10041";
            } else {
                return 0;
            }
        }

        private getVersionFileName(e) {
            console.log("fileName", e);
            this.downloadFile(e);
        }

        private downloadFile(i) {
            var that = this;
            console.log("存在新版，下载成功" + i);
            wx["downloadFile"]({
                "url": "https://hy.gwgo.qq.com/sync/pet/config/" + i,
                "success": function (s) {
                    if (200 === s["statusCode"]) {
                        var n = wx["getFileSystemManager"]()["readFileSync"](s["tempFilePath"], "utf8"),
                            l = JSON.parse(n);
                        var spriteList: Sprite[] = l["Data"];
                        // console.log(spriteHash);
                        // e.globalData.iconList = l.Switch,
                        Utils.setSpriteList(spriteList);
                        Utils.setSpriteHash(spriteList);
                        // t.changeSetting("iconList", e.globalData.iconList)
                        // a.saveVersion(i)
                    } else that.downloadFailed(i)
                },
                "fail": function () {
                    that.downloadFailed(i)
                }
            })
        }

        private downloadFailed(e) {
            var that = this;
            console.log(e)
            // wx["showToast"]({
            //     title: "网络异常!",
            //     icon: "none"
            // }),
            setTimeout(function () {
                that.downloadFile(e)
            }, 3e3)
        }

        public getSpriteNameFilter(): string[] {
            return Utils.getStorage("spriteName") || [];
        }
    }

    class RequestResult {
        getSpriteResult(result: Object) {
            return new SpriteResult(result);
        }
    }

    class AliveSprite {
        gentime: number;
        public latitude: number;
        lifetime: number;
        public longtitude: number;
        sprite_id: number;
        sprite: Sprite;

        constructor(obj: Object) {
            this.gentime = obj["gentime"];
            this.latitude = obj["latitude"];
            this.lifetime = obj["lifetime"];
            this.longtitude = obj["longtitude"];
            this.sprite_id = obj["sprite_id"];
            this.initSprite();
        }

        public getLeftTime() {
            var that = this;
            var time = that.gentime + that.lifetime;
            var leftTime = time - (new Date).getTime() / 1000;
            return that.formatTime(leftTime.toFixed(0));
        }

        public initSprite() {
            var spriteList: HashMap<Sprite> = Utils.getSpriteList();
            // for (const sprite of spriteList) {
            //     if (sprite.Id == this.sprite_id) {
            //         this.sprite = sprite;
            //     }
            // }
            this.sprite = spriteList.get(this.sprite_id);
        }

        formatTime(timeStr: string) {
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
    }

    class SpriteResult {
        end: number;
        packageNO: number;
        requestid: number;
        retcode: number;
        retmsg: string;
        sprite_list: AliveSprite[];

        constructor(obj: Object) {
            this.end = obj["end"];
            this.packageNO = obj["packageNO"];
            this.requestid = obj["requestid"];
            this.retcode = obj["retcode"];
            this.retmsg = obj["retmsg"];
            this.sprite_list = [];
            for (var i: number = 0; i < obj["sprite_list"].length; i++) {
                this.sprite_list[i] = new AliveSprite(obj["sprite_list"][i]);
                if (!this.sprite_list[i]) {
                    console.log(1)
                }
            }
        }
    }
}