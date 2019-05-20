/// <reference path="./Utils/Utils.ts" />
/// <reference path="./SpritesAPI.ts" />
/// <reference path="./Models/AliveSprite.ts" />

namespace ZhuoYao {

    declare var wx: any;

    export class Socket {

        requestIds: number[] = [];
        // requestResult: RequestResult;
        worker: any;
        isOpen: boolean = false;
        isConnecting: boolean = false;
        messageQueue: Object[] = [];
        lastTime: number;
        isIOS: boolean = false;
        utils: Utils;

        constructor(worker) {
            this.utils = new Utils();
            this.worker = worker;
            var info = wx["getSystemInfoSync"]();
            if (info["brand"].toLocaleLowerCase().indexOf("iphone") != -1) {
                this.isIOS = true;
            }
        }

        public initSocket(): void {
            var that: Socket = this;
            this.initSocketChecker();
            that.connectSocket();
            wx["onSocketOpen"](function (t) {
                console.log("WebSocket连接已打开！");
                that.isOpen = true;
                // 初始化配置文件
                that.getSettingFileName();
                wx["hideLoading"]();
            });
            wx["onSocketError"](function (e) {
                console.log("WebSocket连接打开失败，请检查！")
                that.isOpen = false;
            });
            wx["onSocketClose"](function (e) {
                console.log("WebSocket 已关闭！");;
                that.isOpen = false;
            });
            wx["onSocketMessage"](function (t) {
                that.recMessage(t)
            });
        }

        initSocketChecker() {
            var that = this;
            setInterval(function () {
                if (!that.isOpen) {
                    that.connectSocket()
                }
            }, 500);
        }
        private connectSocket() {
            if (this.isOpen) return;
            // this.isConnecting = true;
            console.log("开始WebSocket连接");
            wx["showLoading"]({
                title: '连接中',
            });
            wx["connectSocket"]({
                url: 'wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0'
            })
        }

        public sendMessage(str) {
            var that = this;
            that.sendSocketMessage(str);

        }
        private sendSocketMessage(str?: Object, callback?: Function) {
            var that: Socket = this;
            wx["sendSocketMessage"]({
                data: that.utils.str2ab(str),
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
            var str: string = that.utils.utf8ByteToUnicodeStr(new Uint8Array(e.data).slice(4));
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
                    obj.filter = that.utils.getSpriteSearchNameFilter();
                    SpritesAPI.post(obj["sprite_list"]);
                    if (that.isIOS) {
                        if (obj.sprite_list) {
                            for (var i = obj.sprite_list.length; i--;) {
                                var aliveSprite: AliveSprite = obj.sprite_list[i];
                                var sprite: Sprite = that.utils.getSpriteList().get(aliveSprite.sprite_id);
                                var spriteNameFilter = obj.filter;
                                if (spriteNameFilter.length > 0) {
                                    if (spriteNameFilter.indexOf(aliveSprite.sprite_id) != -1) {
                                        var sprite = that.utils.getSpriteList().get(aliveSprite.sprite_id);
                                        var latitude = (aliveSprite.latitude / 1000000).toFixed(6);
                                        var longitude = (aliveSprite.longtitude / 1000000).toFixed(6);
                                        var location = that.utils.getLocation(longitude, latitude);
                                        var resultObj = {
                                            "name": sprite.Name,
                                            "latitude": location[1],
                                            "longitude": location[0],
                                            "lefttime": that.utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime),
                                            "iconPath": sprite.HeadImage,
                                            "id": sprite.Id + ":" + latitude + " " + longitude,
                                            "width": 40,
                                            "height": 40
                                        };
                                        var hashStr = "" + aliveSprite.sprite_id + aliveSprite.latitude + aliveSprite.longtitude + aliveSprite.gentime + aliveSprite.lifetime;
                                        var hashValue = that.utils.hash(hashStr);
                                        that.utils.getTempResults().put(hashStr, resultObj);
                                    }
                                }
                            }
                        }
                    } else {
                        that.worker.postMessage(obj);
                    }
                    that.lastTime = (new Date()).getTime();
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

        private getSettingFileName() {
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
            if (this.getFileName() != e) {
                console.log("存在新版，开始下载");
                this.downloadFile(e);
            }
        }
        public setFileName(filename) {
            this.utils.storage.setItem("filename", filename);
        }
        public getFileName() {
            return this.utils.storage.getItem("filename");
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
                        that.utils.setSpriteConfig(spriteList);
                        that.utils.setSpriteList(spriteList);
                        that.setFileName(i);
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
            setTimeout(function () {
                that.downloadFile(e)
            }, 3e3)
        }

    }
}