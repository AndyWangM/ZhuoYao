/// <reference path="./Utils/Utils.ts" />
/// <reference path="./SpritesAPI.ts" />
/// <reference path="./Models/AliveSprite.ts" />
var ZhuoYao;
(function (ZhuoYao) {
    var Socket = /** @class */ (function () {
        function Socket(worker, app) {
            this.requestIds = [];
            this.isOpen = false;
            this.isConnecting = false;
            this.messageQueue = [];
            this.isIOS = false;
            this.backendMessageQueue = [];
            this.spriteServerFilter = [];
            this.utils = new ZhuoYao.Utils();
            this.worker = worker;
            this.app = app;
            var info = wx["getSystemInfoSync"]();
            if (info["brand"].toLocaleLowerCase().indexOf("iphone") != -1) {
                this.isIOS = true;
            }
        }
        Socket.prototype.getBackendMessage = function () {
            var that = this;
            ZhuoYao.SpritesAPI.getSpriteConfig(function (res) {
                var result = res["data"];
                if (result) {
                    ZhuoYao.SpritesAPI.getSpriteFilter(function (res) {
                        var data = res["data"];
                        if (data) {
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
        };
        Socket.prototype.getPoints = function (config) {
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
        };
        Socket.prototype.initSocket = function () {
            var that = this;
            this.initSocketChecker();
            this.initMessageQueueChecker();
            that.connectSocket();
            wx["onSocketOpen"](function (t) {
                console.log("WebSocket连接已打开！");
                that.isOpen = true;
                // 初始化配置文件
                for (var i = 0; i < that.messageQueue.length; i++) {
                    that.sendSocketMessage(that.messageQueue[i]);
                }
                that.getSettingFileName();
                wx["hideLoading"]();
            });
            wx["onSocketError"](function (e) {
                console.log("WebSocket连接打开失败，请检查！");
                that.isOpen = false;
            });
            wx["onSocketClose"](function (e) {
                console.log("WebSocket 已关闭！");
                ;
                that.isOpen = false;
            });
            wx["onSocketMessage"](function (t) {
                that.recMessage(t);
            });
        };
        Socket.prototype.initSocketChecker = function () {
            var that = this;
            setInterval(function () {
                if (!that.isOpen) {
                    that.connectSocket();
                }
            }, 5000);
        };
        Socket.prototype.initMessageQueueChecker = function () {
            var that = this;
            setInterval(function () {
                if (that.messageQueue.length > 0) {
                    var message = that.messageQueue[0];
                    that.isBackMessage = false;
                    that.sendSocketMessage(message);
                }
                else if (that.backendMessageQueue.length > 0) {
                    var message = that.buildRequest(that.backendMessageQueue[0]);
                    that.isBackMessage = true;
                    that.sendSocketMessage(message);
                }
                else {
                    that.getBackendMessage();
                }
            }, 2000);
        };
        Socket.prototype.buildRequest = function (location) {
            var that = this;
            var obj = {
                "request_type": "1001",
                "longtitude": location.longitude,
                "latitude": location.latitude,
                "requestid": that.genRequestId("1001"),
                "platform": 0
            };
            return obj;
        };
        Socket.prototype.connectSocket = function () {
            if (this.isOpen)
                return;
            // this.isConnecting = true;
            console.log("开始WebSocket连接");
            wx["showLoading"]({
                title: '连接中'
            });
            wx["connectSocket"]({
                url: 'wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0'
            });
        };
        Socket.prototype.sendMessage = function (str) {
            var that = this;
            that.messageQueue.push(str);
            // that.sendSocketMessage(str);
        };
        Socket.prototype.clearMessageQueue = function () {
            this.messageQueue = [];
        };
        Socket.prototype.sendSocketMessage = function (str, callback) {
            var that = this;
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
        };
        Socket.prototype.recMessage = function (e) {
            var that = this;
            var str = that.utils.utf8ByteToUnicodeStr(new Uint8Array(e.data).slice(4));
            if (str.length > 0) {
                if (that.messageQueue.length > 0 && !that.isBackMessage) {
                    console.log("收到服务器消息", new Date());
                    var obj = JSON.parse(str);
                    // console.log(obj)
                    if (obj["retcode"] != 0) {
                        wx["hideLoading"]();
                    }
                    var id = that.getRequestTypeFromId(obj["requestid"]);
                    if (id == "10041") {
                        this.getVersionFileName(obj["filename"]);
                        that.messageQueue.shift();
                    }
                    else {
                        if ((obj["packageNO"] && obj["packageNO"] == 1) || (!obj["sprite_list"] || obj["sprite_list"].length == 0)) {
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
                                    var aliveSprite = list[i];
                                    var sprite = that.utils.getSpriteList().get(aliveSprite.sprite_id);
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
                                            var totaltime = aliveSprite.gentime + aliveSprite.lifetime;
                                            var hashStr = sprite.Name + aliveSprite.latitude + aliveSprite.longtitude + totaltime;
                                            var hashid = that.utils.hash(hashStr);
                                            var iconPath = sprite.HeadImage;
                                            if (that.app["globalData"]["clickedObj"][hashid]) {
                                                iconPath = "/images/all.png";
                                            }
                                            var resultObj = {
                                                "hashid": hashid,
                                                "name": sprite.Name,
                                                "latitude": latitude,
                                                "longitude": longitude,
                                                "rlatitude": location[1],
                                                "rlongitude": location[0],
                                                "lefttime": that.utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime),
                                                "totaltime": totaltime,
                                                "iconPath": iconPath,
                                                "id": hashid + ":" + totaltime + ":" + latitude + " " + longitude,
                                                "width": 40,
                                                "height": 40,
                                                "callout": {
                                                    "content": sprite.Name
                                                }
                                            };
                                            that.utils.getTempResults().put(hashid, resultObj);
                                        }
                                    }
                                }
                                ZhuoYao.SpritesAPI.setSpriteList(serverFilterResult);
                            }
                        }
                        else {
                            // console.log("android")
                            that.worker["postMessage"](obj);
                        }
                        that.lastTime = (new Date()).getTime();
                    }
                }
                else if (that.backendMessageQueue.length > 0) {
                    that.backendMessageQueue.shift();
                    console.log("收到后台任务消息", new Date());
                    var obj = JSON.parse(str);
                    obj["filter"] = [];
                    obj["serverFilter"] = that.spriteServerFilter;
                    that.worker["postMessage"](obj);
                    // SpritesAPI.setSpriteList(obj["sprite_list"]);
                }
            }
        };
        Socket.prototype.isSearching = function () {
            var time = (new Date()).getTime();
            if (!this.lastTime) {
                return false;
            }
            if (time - this.lastTime > 5000) {
                return false;
            }
            return true;
        };
        Socket.prototype.genRequestId = function (n) {
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
                    that.requestIds[4] = g;
            }
            return g;
        };
        Socket.prototype.getRequestId = function (n) {
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
                    return that.requestIds[4];
            }
        };
        Socket.prototype.getRequestTypeFromId = function (n) {
            var that = this;
            if (that.requestIds[0] == n) {
                return "1001";
            }
            else if (that.requestIds[1] == n) {
                return "1002";
            }
            else if (that.requestIds[2] == n) {
                return "1003";
            }
            else if (that.requestIds[3] == n) {
                return "10040";
            }
            else if (that.requestIds[4] == n) {
                return "10041";
            }
            else {
                return 0;
            }
        };
        Socket.prototype.getSettingFileName = function () {
            var that = this;
            var e = {
                "request_type": "1004",
                "cfg_type": 1,
                "requestid": that.genRequestId("10041"),
                "platform": 0
            };
            that.sendMessage(e);
        };
        Socket.prototype.getVersionFileName = function (e) {
            console.log("fileName", e);
            if (this.getFileName() != e) {
                console.log("存在新版，开始下载");
                this.downloadFile(e);
            }
            // var list: any = this.utils.storage.getItem("SpriteList");
            // var isUpdated;
            // if (list) {
            //     if (!this.utils.getSpriteNameHash().get("柠檬精")) {
            //         list.push({
            //             "Id": 2004040,
            //             "Name": "柠檬精",
            //             "FiveEle": [
            //                 "无"
            //             ],
            //             "PrefabName": "4040_NingMeng",
            //             "ImgName": "4040",
            //             "BigImgPath": "512_head/4040_NingMeng_big.png",
            //             "SmallImgPath": "128_head/4040_NingMeng_head.png",
            //             "Level": 1
            //         });
            //         isUpdated = true;
            //     }
            //     if (!this.utils.getSpriteNameHash().get("复读鸡")) {
            //         list.push({
            //             "Id": 2004041,
            //             "Name": "复读鸡",
            //             "FiveEle": [
            //                 "无"
            //             ],
            //             "PrefabName": "4041_FuDuJi",
            //             "ImgName": "4041",
            //             "BigImgPath": "512_body/4041_FuDuJi.png",
            //             "SmallImgPath": "128_head/4041_FuDuJi_head.png",
            //             "Level": 1
            //         });
            //         isUpdated = true;
            //     }
            //     if (!this.utils.getSpriteNameHash().get("鸽了")) {
            //         list.push({
            //             "Id": 2004042,
            //             "Name": "鸽了",
            //             "FiveEle": [
            //                 "无"
            //             ],
            //             "PrefabName": "4042_GeZi_head",
            //             "ImgName": "4042",
            //             "BigImgPath": "512_body/4042_GeZi_big.png",
            //             "SmallImgPath": "128_head/4042_GeZi_head.png",
            //             "Level": 1
            //         });
            //         isUpdated = true;
            //     }
            //     if (!this.utils.getSpriteNameHash().get("真香")) {
            //         list.push({
            //             "Id": 2004043,
            //             "Name": "真香",
            //             "FiveEle": [
            //                 "无"
            //             ],
            //             "PrefabName": "4043_ZhenXiang",
            //             "ImgName": "4043",
            //             "BigImgPath": "512_body/4043_ZhenXiang.png",
            //             "SmallImgPath": "128_head/4043_ZhenXiang_head.png",
            //             "Level": 1
            //         });
            //         isUpdated = true;
            //     }
            //     if (!this.utils.getSpriteNameHash().get("全员恶人")) {
            //         list.push({
            //             "Id": 2004044,
            //             "Name": "全员恶人",
            //             "FiveEle": [
            //                 "空"
            //             ],
            //             "PrefabName": "4044_QuanYuanERen_head",
            //             "ImgName": "4044",
            //             "BigImgPath": "512_body/4044_QuanYuanERen_big.png",
            //             "SmallImgPath": "128_head/4044_QuanYuanERen_head.png",
            //             "Level": 1
            //         });
            //         isUpdated = true;
            //     }
            //     if (isUpdated) {
            // this.utils.setSpriteConfig(list);
            // this.utils.setSpriteList(list);
            // }
            // }
        };
        Socket.prototype.setFileName = function (filename) {
            this.utils.storage.setItem("filename", filename);
        };
        Socket.prototype.getFileName = function () {
            return this.utils.storage.getItem("filename");
        };
        Socket.prototype.downloadFile = function (i) {
            var that = this;
            wx["downloadFile"]({
                "url": "https://hy.gwgo.qq.com/sync/pet/config/" + i,
                "success": function (s) {
                    if (200 === s["statusCode"]) {
                        console.log("下载成功" + i);
                        var n = wx["getFileSystemManager"]()["readFileSync"](s["tempFilePath"], "utf8"), l = JSON.parse(n);
                        var spriteList = l["Data"];
                        // console.log(spriteHash);
                        // e.globalData.iconList = l.Switch,
                        that.utils.setSpriteConfig(spriteList);
                        that.utils.setSpriteList(spriteList);
                        // var isUpdated;
                        // var list: any = that.utils.storage.getItem("SpriteList");
                        // if (list) {
                        //     if (!this.utils.getSpriteNameHash().get("柠檬精")) {
                        //         list.push({
                        //             "Id": 2004040,
                        //             "Name": "柠檬精",
                        //             "FiveEle": [
                        //                 "无"
                        //             ],
                        //             "PrefabName": "4040_NingMeng",
                        //             "ImgName": "4040",
                        //             "BigImgPath": "512_head/4040_NingMeng_big.png",
                        //             "SmallImgPath": "128_head/4040_NingMeng_head.png",
                        //             "Level": 1
                        //         });
                        //         isUpdated = true;
                        //     }
                        //     if (!that.utils.getSpriteNameHash().get("复读鸡")) {
                        //         list.push({
                        //             "Id": 2004041,
                        //             "Name": "复读鸡",
                        //             "FiveEle": [
                        //                 "无"
                        //             ],
                        //             "PrefabName": "4041_FuDuJi",
                        //             "ImgName": "4041",
                        //             "BigImgPath": "512_body/4041_FuDuJi.png",
                        //             "SmallImgPath": "128_head/4041_FuDuJi_head.png",
                        //             "Level": 1
                        //         });
                        //         isUpdated = true;
                        //     }
                        //     if (!this.utils.getSpriteNameHash().get("鸽了")) {
                        //         list.push({
                        //             "Id": 2004042,
                        //             "Name": "鸽了",
                        //             "FiveEle": [
                        //                 "无"
                        //             ],
                        //             "PrefabName": "4042_GeZi_head",
                        //             "ImgName": "4042",
                        //             "BigImgPath": "512_body/4042_GeZi_big.png",
                        //             "SmallImgPath": "128_head/4042_GeZi_head.png",
                        //             "Level": 1
                        //         });
                        //         isUpdated = true;
                        //     }
                        //     if (!that.utils.getSpriteNameHash().get("真香")) {
                        //         list.push({
                        //             "Id": 2004043,
                        //             "Name": "真香",
                        //             "FiveEle": [
                        //                 "无"
                        //             ],
                        //             "PrefabName": "4043_ZhenXiang",
                        //             "ImgName": "4043",
                        //             "BigImgPath": "512_body/4043_ZhenXiang.png",
                        //             "SmallImgPath": "128_head/4043_ZhenXiang_head.png",
                        //             "Level": 1
                        //         });
                        //         isUpdated = true;
                        //     }
                        //     if (isUpdated) {
                        //         that.utils.setSpriteConfig(list);
                        //         that.utils.setSpriteList(list);
                        //     }
                        //     if (!this.utils.getSpriteNameHash().get("全员恶人")) {
                        //         list.push({
                        //             "Id": 2004044,
                        //             "Name": "全员恶人",
                        //             "FiveEle": [
                        //                 "空"
                        //             ],
                        //             "PrefabName": "4044_QuanYuanERen_head",
                        //             "ImgName": "4044",
                        //             "BigImgPath": "512_body/4044_QuanYuanERen_big.png",
                        //             "SmallImgPath": "128_head/4044_QuanYuanERen_head.png",
                        //             "Level": 1
                        //         });
                        //         isUpdated = true;
                        //     }
                        // }
                        that.setFileName(i);
                        // t.changeSetting("iconList", e.globalData.iconList)
                        // a.saveVersion(i)
                    }
                    else
                        that.downloadFailed(i);
                },
                "fail": function () {
                    that.downloadFailed(i);
                }
            });
        };
        Socket.prototype.downloadFailed = function (e) {
            var that = this;
            console.log(e);
            setTimeout(function () {
                that.downloadFile(e);
            }, 3e3);
        };
        return Socket;
    }());
    ZhuoYao.Socket = Socket;
})(ZhuoYao || (ZhuoYao = {}));
