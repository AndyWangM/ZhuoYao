import ZhuoYao from '../../../utils/zhuoyao.js'

const app = getApp();
var socket;

const worker = qq.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径
// worker.postMessage({
//   msg: 'hello worker'
// })
worker.onMessage(function (res) {
  console.log(res)
  var sprites = res.sprites;
  var serverSprites = res.serverSprites;
  if (serverSprites && serverSprites.length > 0) {
    ZhuoYao.SpritesAPI.setSpriteList(serverSprites);
  }
  if (sprites.length > 0) {
    for (var i = sprites.length; i--;) {
      var aliveSprite = sprites[i];
      var sprite = app.globalData.zhuoyao.utils.getSpriteList().get(aliveSprite.sprite_id);
      var latitude = (aliveSprite.latitude / 1000000).toFixed(6);
      var longitude = (aliveSprite.longtitude / 1000000).toFixed(6);
      var location = app.globalData.zhuoyao.utils.getLocation(longitude, latitude);
      var totaltime = aliveSprite.gentime + aliveSprite.lifetime;
      var hashStr = sprite.Name + aliveSprite.latitude + aliveSprite.longtitude + totaltime;
      var hashid = app.globalData.zhuoyao.utils.hash(hashStr);
      var iconPath = sprite.HeadImage;
      if (app.globalData.clickedObj[hashid]) {
        iconPath = "/images/all.png";
      }
      var resultObj = {
        "hashid": hashid,
        "name": sprite.Name,
        "latitude": latitude,
        "longitude": longitude,
        "rlatitude": location[1],
        "rlongitude": location[0],
        "lefttime": app.globalData.zhuoyao.utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime),
        "totaltime": totaltime,
        "iconPath": iconPath,
        "id": hashid + ":" + totaltime + ":" + latitude + " " + longitude,
        "width": 40,
        "height": 40,
        "callout": {
          "content": sprite.Name
        }
      };
      app.globalData.zhuoyao.utils.getTempResults().put(hashid, resultObj);
    }
  }
})
Page({
  data: {
    clickedObj: {},
    mapInfo: {},
    spriteName: null,
    result: [],
    xIndex: 2,
    yIndex: 2,
    speed: 0,
    polygons: [],
    allPoints: []
  },
  onLoad(e) {
    if (e.isRelaunch && socket) {
      socket = null;
    }
    qq.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          qq.authorize({
            scope: 'scope.userLocation',
            success() {
              qq.getLocation({
                type: 'gcj02',
                success(res) {
                  var mapInfo = {
                    address: res.address,
                    latitude: res.latitude,
                    longitude: res.longitude
                  }
                  that.setData({
                    mapInfo: mapInfo
                  });
                  that.getPoints()
                }
              })
            }
          })
        } else {

          qq.getLocation({
            type: 'gcj02',
            success(res) {
              var mapInfo = {
                address: res.address,
                latitude: res.latitude,
                longitude: res.longitude
              }
              that.setData({
                mapInfo: mapInfo
              });
              that.getPoints()
            }
          })
        }
      }
    })

    var that = this;
    this.setData({
      clickedObj: app.globalData.clickedObj || {}
    })
    setInterval(function () {
      that.setData({
        clickedObj: app.globalData.clickedObj || {}
      })
    }, 1000);
    setInterval(function () {
      if (socket.isSearching()) {
        that.setData({
          isSearching: true
        })
      } else {
        that.setData({
          isSearching: false
        })
      }
      that.setData({
        result: app.globalData.zhuoyao.utils.getTempResults().values() || []
      })
    }, 1000);
    socket = new ZhuoYao.Socket(worker, app);
    app.globalData.zhuoyao.utils = socket.utils;
  },
  onShow(e) {
    var that = this;
    socket.initSocket();
  },
  markertap(e) {
    var markerId = e.markerId;
    var obj = app.globalData.zhuoyao.utils.getMarkerInfo(markerId);
    var hashid = obj.hashid;
    var temp = this.data.result;
    for (var res of temp) {
      if (res.hashid == hashid) {
        res.iconPath = "/images/all.png";
        app.globalData.zhuoyao.utils.getTempResults().remove(hashid)
        app.globalData.zhuoyao.utils.getTempResults().put(hashid, res);
      }
    }
    var a = app.globalData.clickedObj;
    a[hashid] = obj.totaltime;
    // clickedObj.put(this.hash(hashStr), content.totaltime);
    this.setData({
      result: app.globalData.zhuoyao.utils.getTempResults().values(),
      clickedObj: a
    })
    qq.setStorageSync("clickedObj", this.data.clickedObj)
    app.globalData.clickedObj = this.data.clickedObj;
    var location = app.globalData.zhuoyao.utils.getLocation(obj.longitude, obj.latitude);
    var splitSign = app.globalData.zhuoyao.utils.getSplitSign();
    var lonfront = app.globalData.zhuoyao.utils.getLonfront();
    var data;
    if (lonfront) {
      data = location[0] + splitSign + location[1]
    } else {
      data = location[1] + splitSign + location[0]
    }
    qq.setClipboardData({
      data: data,
      success(res) {
        qq.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  tapview(e) {
    var content = e.currentTarget.dataset.content;
    var hashid = content.hashid;
    var temp = this.data.result;
    for (var res of temp) {
      if (res.hashid == hashid) {
        res.iconPath = "/images/all.png";
        app.globalData.zhuoyao.utils.getTempResults().put(hashid, res);
      }
    }
    var a = app.globalData.clickedObj;
    a[hashid] = content.totaltime;
    // clickedObj.put(this.hash(hashStr), content.totaltime);
    this.setData({
      result: app.globalData.zhuoyao.utils.getTempResults().values(),
      clickedObj: a
    })
    qq.setStorageSync("clickedObj", this.data.clickedObj)
    app.globalData.clickedObj = this.data.clickedObj;
    var splitSign = app.globalData.zhuoyao.utils.getSplitSign();
    var lonfront = app.globalData.zhuoyao.utils.getLonfront();
    var data;
    if (lonfront) {
      data = content.rlongitude + splitSign + content.rlatitude
    } else {
      data = content.rlatitude + splitSign + content.rlongitude
    }
    qq.setClipboardData({
      data: data,
      success(res) {
        qq.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  hash(input) {
    var I64BIT_TABLE =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('')
    var hash = 5381;
    var i = input.length - 1;

    if (typeof input == 'string') {
      for (; i > -1; i--)
        hash += (hash << 5) + input.charCodeAt(i);
    } else {
      for (; i > -1; i--)
        hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7FFFFFFF;

    var retValue = '';
    do {
      retValue += I64BIT_TABLE[value & 0x3F];
    }
    while (value >>= 6);

    return retValue;
  },
  getConfig() {
    this.getSettingFileName()
  },
  bindXInput(e) {
    this.setData({
      "xIndex": e.detail.value
    })
    if (e.detail.value) {
      this.getPoints()
    }
  },
  bindYInput(e) {
    this.setData({
      "yIndex": e.detail.value
    })
    if (e.detail.value) {
      this.getPoints()
    }
  },
  selectLocation() {
    var that = this;
    qq.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          qq.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 qq.startRecord 接口不会弹窗询问
              qq.chooseLocation({
                success: function (obj) {
                  console.log(obj)
                  var mapInfo = {
                    address: obj.address,
                    latitude: obj.latitude,
                    longitude: obj.longitude
                  }
                  that.setData({
                    mapInfo: mapInfo
                  });
                  that.getPoints()
                }
              })
            }
          })
        } else {
          qq.chooseLocation({
            success: function (obj) {
              console.log(obj)
              var mapInfo = {
                address: obj.address,
                latitude: obj.latitude,
                longitude: obj.longitude
              }
              that.setData({
                mapInfo: mapInfo
              });
              that.getPoints()
            }
          })
        }
      }
    })

  },
  confim(str, callback) {
    qq.getSetting({
      success(res) {
        if (!res.authSetting[str]) {
          qq.authorize({
            scope: str,
            success() {
              callback();
            }
          })
        }
      }
    })
  },
  // spriteInput(e) {
  //   this.setData({
  //     spriteName: e.detail.value
  //   })
  //   var spriteNames = [e.detail.value];
  //   socket.setSpriteName(spriteNames);
  // },
  searchLeitai() {
    var that = this;
    var convertLocation = function (num) {
      var numStr = num.toFixed(6);
      return parseInt(1e6 * numStr);
    }
    var mapInfo = that.data.mapInfo;
    that.getLeitaiInfo();
  },
  searchYaojing() {
    var that = this;
    if (!socket.utils.getOpenId() || !socket.utils.getToken()) {
      qq.showModal({
        title: '注意事项',
        content: '全局设置中的官方小程序OpenID或Token没有配置，无法进行搜索，仅可使用已知妖灵。',
        success(res) {
          if (res.confirm) {
            qq.switchTab({
              url: '/pages/user/user'
            })
          }
        }
      })
    }
    var convertLocation = function (num) {
      var numStr = num.toFixed(6);
      return parseInt(1e6 * numStr);
    }
    var mapInfo = that.data.mapInfo;
    app.globalData.zhuoyao.utils.getTempResults().clear();
    socket.clearMessageQueue();
    this.data.result = [];
    // that.setData({
    //   isSearching: false
    // })
    that.getYaojingInfo();
  },
  getSettingFileName: function () {
    var that = this;
    var e = {
      request_type: "1004",
      cfg_type: 1,
      requestid: socket.genRequestId("10041"),
      platform: 0,
      appid: "wx19376645db21af08",
      openid: socket.utils.getOpenId(),
      gwgo_token: socket.utils.getToken()
    };
    that.sendMessage(e, "10041")
  },
  getBossLevelConfig: function () {
    var that = this;
    var e = {
      request_type: "1004",
      cfg_type: 0,
      requestid: socket.genRequestId("10040"),
      platform: 0,
      appid: "wx19376645db21af08",
      openid: socket.utils.getOpenId(),
      gwgo_token: socket.utils.getToken()
    };
    that.sendMessage(e, "10040")
  },
  getPoints() {
    var that = this;
    var mapInfo = that.data.mapInfo;
    var latStep = 0.016;
    var longStep = 0.019;
    var allPoints = [];
    var aindex = this.data.xIndex;
    var bindex = this.data.yIndex;
    var l1, l2, r1, r2;
    for (var i = 0; i < aindex; i++) {
      var lat = mapInfo.latitude + i * latStep;
      var b = [];
      for (var j = 0; j < bindex; j++) {
        var lon = mapInfo.longitude + j * longStep;
        var obj = {
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lon.toFixed(6))
        };
        if (i == 0) {
          if (j == 0) {
            var l1 = {}
            l1.latitude = obj.latitude - latStep;
            l1.longitude = obj.longitude - longStep;
          }
          if (j == bindex - 1) {
            var r1 = {}
            r1.latitude = obj.latitude - latStep;
            r1.longitude = obj.longitude + longStep;
          }
        }
        if (i == aindex - 1) {
          if (j == 0) {
            var l2 = {}
            l2.latitude = obj.latitude + latStep;
            l2.longitude = obj.longitude - longStep;
          }
          if (j == bindex - 1) {
            var r2 = {}
            r2.latitude = obj.latitude + latStep;
            r2.longitude = obj.longitude + longStep;
          }
        }
        allPoints.push(obj);
      }
      // console.log(allPoints)
    }
    var points = [];
    points.push(l1);
    points.push(r1);
    points.push(r2);
    points.push(l2);
    // console.log(points)

    this.setData({
      polygons: [{
        points: points,
        fillColor: "#FF0000AA",
        strokeColor: "#000000DD",
        strokeWidth: 1
      }],
      allPoints: allPoints
    })
  },
  getYaojingInfo: function () {
    var that = this;
    // console.log(a);
    var count = 0;
    var count2 = 0;
    var points = that.data.allPoints;
    for (var m = 0; m < points.length; m++) {
      // (function (a, m, count) {
      //   var timeout;
      //   if (that.data.speed) {
      //     timeout = that.data.speed * 1000 * count;
      //   } else {
      //     timeout = 2000 * count + 1000 * count2;
      //   }
      // setTimeout(function () {
      var e = {
        request_type: "1001",
        longtitude: app.globalData.zhuoyao.utils.convertLocation(Number(points[m]["longitude"])),
        latitude: app.globalData.zhuoyao.utils.convertLocation(Number(points[m]["latitude"])),
        requestid: socket.genRequestId("1001"),
        platform: 0, 
        appid: "wx19376645db21af08",
        openid: socket.utils.getOpenId(),
        gwgo_token: socket.utils.getToken()
      };
      that.sendMessage(e, "1001")
      // }, timeout);
      // }, that.data.speed * 1000 * count);
      // console.log(timeout / 1000)
      // console.log(that.data.speed * count)
      // })(points, m, count)
      // count++;
      // if (count != 0 && count % 3 == 0) {
      //   count2++;
      // }
    }
  },
  getLeitaiInfo: function () {
    var that = this;
    var mapInfo = that.data.mapInfo;
    // console.log(app.globalData.zhuoyao.utils.convertLocation(mapInfo.longitude));
    // console.log(app.globalData.zhuoyao.utils.convertLocation(mapInfo.latitude));
    var e = {
      request_type: "1002",
      longtitude: app.globalData.zhuoyao.utils.convertLocation(mapInfo.longitude),
      latitude: app.globalData.zhuoyao.utils.convertLocation(mapInfo.latitude),
      requestid: socket.genRequestId("1002"),
      platform: 0, 
      appid: "wx19376645db21af08",
      openid: socket.utils.getOpenId(),
      gwgo_token: socket.utils.getToken()
    };
    that.sendMessage(e, "1002")
  },
  sendMessage: function (e, t) {
    var a = this;
    socket.sendMessage(e);
  },
  onShareAppMessage(res) {
    return {
      title: '捉妖工具',
      path: '/pages/sprite/search/search'
    }
  }
});