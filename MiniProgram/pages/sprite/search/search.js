import ZhuoYao from '../../../utils/zhuoyao.js'

const app = getApp();
var socket;
const worker = wx.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径
// worker.postMessage({
//   msg: 'hello worker'
// })
worker.onMessage(function (res) {
  // console.log(res)
  if (res.length > 0) {
    for (var i = res.length; i--;) {
      var aliveSprite = res[i];
      var sprite = app.globalData.zhuoyao.utils.getSpriteList().get(aliveSprite.sprite_id);
      var latitude = (aliveSprite.latitude / 1000000).toFixed(6);
      var longitude = (aliveSprite.longtitude / 1000000).toFixed(6);
      var location = app.globalData.zhuoyao.utils.getLocation(longitude, latitude);
      var resultObj = {
        "name": sprite.Name,
        "latitude": location[1],
        "longitude": location[0],
        "lefttime": app.globalData.zhuoyao.utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime),
        "iconPath": sprite.HeadImage,
        "id": sprite.Id + ":" + latitude + " " + longitude,
        "width": 40,
        "height": 40
      };
      var hashStr = "" + aliveSprite.sprite_id + aliveSprite.latitude + aliveSprite.longtitude + aliveSprite.gentime + aliveSprite.lifetime;
      var hashValue = app.globalData.zhuoyao.utils.hash(hashStr);
      app.globalData.zhuoyao.utils.getTempResults().put(hashStr, resultObj);
    }
  }
})
Page({
  data: {
    mapInfo: {},
    spriteName: null,
    result: [],
    xIndex: 2,
    yIndex: 2,
    speed: 0,
    polygons: [],
    allPoints: []
  },
  onLoad() {
    var that = this;
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
    socket = new ZhuoYao.Socket(worker);
  },
  onShow() {
    var that = this;
    socket.initSocket();
  },
  markertap(e) {
    var markerId = e.markerId;
    var loc = app.globalData.zhuoyao.utils.getMarkerInfo(markerId);
    var splitSign = app.globalData.zhuoyao.utils.getSplitSign();
    var lonfront = app.globalData.zhuoyao.utils.getLonfront();
    var data;
    if (lonfront) {
      data = loc[1] + splitSign + loc[0]
    } else {
      data = loc[0] + splitSign + loc[1]
    }
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  tapview(e) {
    var content = e.currentTarget.dataset.content;
    var splitSign = app.globalData.zhuoyao.utils.getSplitSign();
    var lonfront = app.globalData.zhuoyao.utils.getLonfront();
    var data;
    if (lonfront) {
      data = content.longitude + splitSign + content.latitude
    } else {
      data = content.latitude + splitSign + content.longitude
    }
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
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
  // bindSpeed(e) {
  //   this.setData({
  //     speed: e.detail.value
  //   })
  // },
  selectLocation() {
    var that = this;
    this.confim('scope.userLocation',
      wx.chooseLocation({
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
    );

  },
  confim(str, callback) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[str]) {
          wx.authorize({
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
      platform: 0
    };
    that.sendMessage(e, "10041")
  },
  getBossLevelConfig: function () {
    var that = this;
    var e = {
      request_type: "1004",
      cfg_type: 0,
      requestid: socket.genRequestId("10040"),
      platform: 0
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
        platform: 0
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
      platform: 0
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