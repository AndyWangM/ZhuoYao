/// <reference path="./Utils.ts" />
/// <reference path="./SpritesAPI.ts" />

namespace ZhuoYao {

    declare var wx: any;

    export class Socket {

        requestIds: number[] = [];
        requestResult: RequestResult;
        app: any;
        isOpen: boolean = false;
        isConnecting: boolean = false;
        messageQueue: Object[] = [];
        lastTime: number;

        constructor(app) {
            this.requestResult = new RequestResult();
            this.app = app;
        }

        public initSocket(): void {
            var that: Socket = this;
            this.initSocketChecker();
            that.connectSocket();
            wx["onSocketOpen"](function (t) {
                console.log("WebSocket连接已打开！");
                that.isOpen = true;
                that.getSettingFileName();
                // that.isConnecting = false;
                wx["hideLoading"]();
                // that.socketConnectedCallback(t)
            });
            wx["onSocketError"](function (e) {
                console.log("WebSocket连接打开失败，请检查！")
                that.isOpen = false;
                // wx["hideLoading"]();
                // that.isConnecting = false;
                // setTimeout(function () {
                //     that.connectSocket()
                // }, 500);
            });
            wx["onSocketClose"](function (e) {
                console.log("WebSocket 已关闭！");;
                that.isOpen = false;
                // that.isConnecting = false;
                // setTimeout(function () {
                //     that.connectSocket()
                // }, 1000);
            });
            wx["onSocketMessage"](function (t) {
                that.recMessage(t)
            });
        }

        initSocketChecker() {
            var that = this;
            setInterval(function(){ 
                if (!that.isOpen) {
                    that.connectSocket()
                }
            }, 500);
        }
        private connectSocket() {
            if (this.isOpen) return;
            // this.isConnecting = true;
            console.log("开始WebSocket连接");
            wx.showLoading({
                title: '连接中',
            });
            wx["connectSocket"]({
                url: 'wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0'
            })
        }

        // private socketConnectedCallback(t) {
        //     this.isOpen = true;
        // }

        public sendMessage(str) {
            var that = this;
            // if (str) {
            //     that.messageQueue.push(str);
            // }
            that.sendSocketMessage(str);
        }

        // public sendSocketMessage(str?: string, callback?: Function) {
        //     var that: Socket = this;
        //     if (that.isReceiving || that.messageQueue.length ==0) {
        //         return;
        //     }
        //     that.isReceiving = true;
        //     var obj: any = that.messageQueue.shift();
        //     wx["sendSocketMessage"]({
        //         data: Utils.str2ab(obj),
        //         success: function (n) {
        //             // console.log("发送服务器成功");
        //             console.log("发送服务器成功", str);
        //         },
        //         fail: function (n) {
        //             console.log("发送服务器失败");
        //             that.messageQueue.unshift(obj);
        //             that.sendSocketMessage();
        //             // console.log("发送服务器失败", str), callback && callback();
        //         }
        //     });
        // }
        public sendSocketMessage(str?: Object, callback?: Function) {
            var that: Socket = this;
            wx["sendSocketMessage"]({
                data: Utils.str2ab(str),
                success: function (n) {
                    console.log("发送服务器成功");
                    // console.log("发送服务器成功", str);
                },
                fail: function (n) {
                    console.log("发送服务器失败");
                    // console.log("发送服务器失败", str), callback && callback();
                }
            });
        }

        private recMessage(e) {
            var that: Socket = this;
            var str: string = Utils.utf8ByteToUnicodeStr(new Uint8Array(e.data).slice(4));
            if (str.length > 0) {
                console.log("收到服务器消息")
                // console.log("收到服务器消息", str.substring(0, 100));
                var obj = JSON.parse(str);
                if (obj["retcode"] != 0) {
                    wx["hideLoading"]();
                }
                var id = that.getRequestTypeFromId(obj["requestid"]);
                if (id == "10041") {
                    this.getVersionFileName(obj["filename"]);
                } else {
                    // console.log(obj.sprite_list);
                    obj.filter = Utils.getSpriteSearchNameFilter();
                    SpritesAPI.post(obj["sprite_list"]);
                    that.app.globalData.postMessage(obj);
                    that.lastTime = (new Date()).getTime();
                    // if (obj.sprite_list) {
                    //     for (var i = obj.sprite_list.length; i--;) {
                    //         var aliveSprite = obj.sprite_list[i];
                    //     // for (const aliveSprite of obj.sprite_list) {
                    //         // if (sprite) {
                    //             var spriteNameFilter = Utils.getSpriteSearchNameFilter();
                    //             if (spriteNameFilter.length > 0) {
                    //                 if (spriteNameFilter.indexOf(aliveSprite.sprite_id) != -1) {
                    //                     var sprite: Sprite = Utils.getSpriteList().get(aliveSprite.sprite_id);
                    //                     var latitude = aliveSprite.latitude.toString().substr(0, 2) + "." + aliveSprite.latitude.toString().substr(2)
                    //                     var longtitude = aliveSprite.longtitude.toString().substr(0, 3) + "." + aliveSprite.longtitude.toString().substr(3)
                    //                     var resultObj = {
                    //                         "name": sprite.Name,
                    //                         "latitude": latitude,
                    //                         "longtitude": longtitude,
                    //                         "lefttime": Utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime)
                    //                     };
                    //                     var hashStr = "" + aliveSprite.sprite_id + aliveSprite.latitude + aliveSprite.longtitude + aliveSprite.gentime + aliveSprite.lifetime;
                    //                     var hashValue = Utils.hash(hashStr);
                    //                     // if (!Utils.getTempResults().containsKey(hashValue)) {
                    //                     Utils.getTempResults().put(hashStr, resultObj);
                    //                     // }
                    //                 }
                    //             // } else {
                    //             //     console.log(sprite);
                    //             // }
                    //         }
                    //     }
                    // }
                    // if (obj.sprite_list) {
                    //     var spriteResult: SpriteResult = that.requestResult.getSpriteResult(obj);
                    //     for (var i = spriteResult.sprite_list.length; i--;) {
                    //         // for (const aliveSprite of spriteResult.sprite_list) {
                    //         var aliveSprite = spriteResult.sprite_list[i];
                    //         // if (!aliveSprite.sprite) {
                    //         //     continue;
                    //         // }
                    //         var sprite: Sprite = aliveSprite.sprite;
                    //         if (sprite) {
                    //             var spriteNameFilter = Utils.getSpriteSearchNameFilter();
                    //             if (spriteNameFilter.length > 0) {
                    //                 if (spriteNameFilter.indexOf(sprite.Name) != -1) {
                    //                     var latitude = aliveSprite.latitude.toString().substr(0, 2) + "." + aliveSprite.latitude.toString().substr(2)
                    //                     var longtitude = aliveSprite.longtitude.toString().substr(0, 3) + "." + aliveSprite.longtitude.toString().substr(3)
                    //                     var resultObj = {
                    //                         "name": aliveSprite.sprite.Name,
                    //                         "latitude": latitude,
                    //                         "longtitude": longtitude,
                    //                         "lefttime": aliveSprite.getLeftTime()
                    //                     };
                    //                     var hashStr = "" + aliveSprite.sprite_id + aliveSprite.latitude + aliveSprite.longtitude + aliveSprite.gentime + aliveSprite.lifetime;
                    //                     var hashValue = Utils.hash(hashStr);
                    //                     // if (!Utils.getTempResults().containsKey(hashValue)) {
                    //                     Utils.getTempResults().put(hashStr, resultObj);
                    //                     // }
                    //                 }
                    //             } else {
                    //                 console.log(sprite);
                    //             }
                    //         }
                    //     }

                    // }
                }
            }
        }

        public isSearching() {
            var time = (new Date()).getTime();
            if (!this.lastTime) {
                return false;
            }
            if (time - this.lastTime > 5000) {
                return false;
            }
            return true;
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

        private getSettingFileName () {
            var that = this;
            var e = {
              request_type: "1004",
              cfg_type: 1,
              requestid: that.genRequestId("10041"),
              platform: 0
            };
            that.sendMessage(e);
        }

        private getVersionFileName(e) {
            console.log("fileName", e);
            if (Utils.getFileName() != e) {
                console.log("存在新版，开始下载");
                this.downloadFile(e);
            }
        }

        private downloadFile(i) {
            var that = this;
            wx["downloadFile"]({
                "url": "https://hy.gwgo.qq.com/sync/pet/config/" + i,
                "success": function (s) {
                    if (200 === s["statusCode"]) {
                        console.log("下载成功" + i);
                        var n = wx["getFileSystemManager"]()["readFileSync"](s["tempFilePath"], "utf8"),
                            l = JSON.parse(n);
                        var spriteList: Sprite[] = l["Data"];
                        // console.log(spriteHash);
                        // e.globalData.iconList = l.Switch,
                        Utils.setSpriteList(spriteList);
                        Utils.setSpriteHash(spriteList);
                        Utils.setFileName(i);
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

    export class AliveSprite {
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

    export class SpriteResult {
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
            for (var i = obj["sprite_list"].length; i--;) {
                // for (var i: number = 0; i < obj["sprite_list"].length; i++) {
                this.sprite_list[i] = new AliveSprite(obj["sprite_list"][i]);
                if (!this.sprite_list[i]) {
                    console.log(1)
                }
            }
        }
    }
}