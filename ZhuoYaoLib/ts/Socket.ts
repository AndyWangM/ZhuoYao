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
        backendMessageQueue: Object[] = [];
        spriteServerFilter: Object[] = [];

        constructor(worker) {
            this.utils = new Utils();
            this.worker = worker;
            var info = wx["getSystemInfoSync"]();
            if (info["brand"].toLocaleLowerCase().indexOf("iphone") != -1) {
                this.isIOS = true;
            }
        }

        private getBackendMessage() {
            var that = this;
            SpritesAPI.getSpriteConfig(function (res) {
                var result = res["data"];
                if (result) {
                    SpritesAPI.getSpriteFilter(function (res) {
                        var data = res["data"];
                        if (data){
                            var filters = data["data"]["filters"];
                            that.spriteServerFilter = filters;
                        }
                    });
                    var configs = result["data"]["sprite_searching_config"];
                    for (var i = 0; i < configs.length; i++) {
                        var searchPoints = that.getPoints(configs[i]);
                        console.log(configs[i]["region"]);
                        that.backendMessageQueue = searchPoints;
                    }
                }
            });
        }

        private getPoints(config) {
            var latStep = 0.016 * 1000000;
            var longStep = 0.019 * 1000000;
            var allPoints = [];
            var aindex = config["xIndex"];
            var bindex = config["yIndex"];
            for (var i = 0; i < aindex; i++) {
                var lat = config["latitude"] + i * latStep;
                for (var j = 0; j < bindex; j++) {
                    var lon = config["longitude"] + j * longStep;
                    var obj = {
                        latitude: lat,
                        longitude: lon
                    };
                    allPoints.push(obj);
                }
            }
            return allPoints;
        }

        public initSocket(): void {
            var that: Socket = this;
            this.initSocketChecker();
            this.initMessageQueueChecker();
            that.connectSocket();
            wx["onSocketOpen"](function (t) {
                console.log("WebSocket连接已打开！");
                that.isOpen = true;
                // 初始化配置文件
                for (var i = 0; i < that.messageQueue.length; i++) {
                    that.sendSocketMessage(that.messageQueue[i])
                }
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

        initMessageQueueChecker() {
            var that = this;
            setInterval(function () {
                if (that.messageQueue.length > 0) {
                    var message = that.messageQueue[0];
                    that.sendSocketMessage(message);
                } else if (that.backendMessageQueue.length > 0) {
                    var message = that.buildRequest(that.backendMessageQueue[0]);
                    that.sendSocketMessage(message);
                } else {
                    that.getBackendMessage();
                }
            }, 2000)
        }

        buildRequest(location) {
            var that = this;
            var obj: Object = {
                "request_type": "1001",
                "longtitude": location.longitude,
                "latitude": location.latitude,
                "requestid": that.genRequestId("1001"),
                "platform": 0
            };
            return obj;
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
            that.messageQueue.push(str);
            // that.sendSocketMessage(str);
        }

        public clearMessageQueue() {
            this.messageQueue = [];
        }

        private sendSocketMessage(str?: Object, callback?: Function) {
            var that: Socket = this;
            wx["sendSocketMessage"]({
                "data": that.utils.str2ab(str),
                "success": function (n) {
                    // console.log("发送服务器成功");
                    // console.log("发送服务器成功", str);
                },
                "fail": function (n) {
                    console.log("发送服务器失败");
                    // console.log("发送服务器失败", str), callback && callback();
                }
            });
        }

        private recMessage(e) {
            var that: Socket = this;
            var str: string = that.utils.utf8ByteToUnicodeStr(new Uint8Array(e.data).slice(4));
            if (str.length > 0) {
                if (that.messageQueue.length > 0) {
                    console.log("收到服务器消息", new Date())
                    var obj = JSON.parse(str);
                    // console.log(obj)
                    if (obj["retcode"] != 0) {
                        wx["hideLoading"]();
                    }
                    var id = that.getRequestTypeFromId(obj["requestid"]);
                    if (id == "10041") {
                        this.getVersionFileName(obj["filename"]);
                        that.messageQueue.shift();
                    } else {
                        if (obj["packageNO"] && obj["packageNO"] == 1) {
                            that.messageQueue.shift();
                        }
                        // console.log(obj.sprite_list);
                        obj["filter"] = that.utils.getSpriteSearchNameFilter();
                        obj["serverFilter"] = that.spriteServerFilter;
                        if (that.isIOS) {
                            // console.log(obj)
                            if (obj["sprite_list"]) {
                                var list = obj["sprite_list"];
                                var serverFilterResult = [];
                                for (var i = list.length; i--;) {
                                    var aliveSprite: AliveSprite = list[i];
                                    var sprite: Sprite = that.utils.getSpriteList().get(aliveSprite.sprite_id);
                                    if (that.spriteServerFilter && that.spriteServerFilter[aliveSprite.sprite_id]) {
                                        serverFilterResult.push(aliveSprite);
                                    }
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
                                            // console.log(resultObj);
                                            var hashStr = "" + aliveSprite.sprite_id + aliveSprite.latitude + aliveSprite.longtitude + aliveSprite.gentime + aliveSprite.lifetime;
                                            // var hashValue = that.utils.hash(hashStr);
                                            that.utils.getTempResults().put(hashStr, resultObj);
                                        }
                                    }
                                }
                                SpritesAPI.setSpriteList(serverFilterResult);
                            }
                        } else {
                            // console.log("android")
                            that.worker["postMessage"](obj);
                        }
                        that.lastTime = (new Date()).getTime();
                    }
                } else if (that.backendMessageQueue.length > 0) {
                    that.backendMessageQueue.shift();
                    console.log("收到后台任务消息", new Date())
                    var obj = JSON.parse(str);
                    obj["filter"] = [];
                    obj["serverFilter"] = that.spriteServerFilter;
                    that.worker["postMessage"](obj);
                    // SpritesAPI.setSpriteList(obj["sprite_list"]);
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
                "request_type": "1004",
                "cfg_type": 1,
                "requestid": that.genRequestId("10041"),
                "platform": 0
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