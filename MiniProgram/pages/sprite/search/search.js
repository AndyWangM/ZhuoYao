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
      var sprite = ZhuoYao.Utils.getSpriteList().get(aliveSprite.sprite_id);
      var latitude = aliveSprite.latitude.toString().substr(0, 2) + "." + aliveSprite.latitude.toString().substr(2)
      var longtitude = aliveSprite.longtitude.toString().substr(0, 3) + "." + aliveSprite.longtitude.toString().substr(3)
      var resultObj = {
        "name": sprite.Name,
        "latitude": latitude,
        "longtitude": longtitude,
        "lefttime": ZhuoYao.Utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime)
      };
      var hashStr = "" + aliveSprite.sprite_id + aliveSprite.latitude + aliveSprite.longtitude + aliveSprite.gentime + aliveSprite.lifetime;
      var hashValue = ZhuoYao.Utils.hash(hashStr);
      ZhuoYao.Utils.getTempResults().put(hashStr, resultObj);
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
        result: ZhuoYao.Utils.getTempResults().values() || []
      })
    }, 1000);
    socket = new ZhuoYao.Socket(worker);
  },
  onShow() {
    var that = this;
    socket.initSocket();
  },
  tapview(e) {
    var content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content.latitude + " " + content.longtitude,
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
    ZhuoYao.Utils.getTempResults().clear();
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
    var latStep = 0.017860;
    var longStep = 0.015182;
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
            l1 = obj;
          }
          if (j == bindex - 1) {
            r1 = obj
          }
        }
        if (i == aindex - 1) {
          if (j == 0) {
            l2 = obj
          }
          if (j == bindex - 1) {
            r2 = obj
          }
        }
        allPoints.push(obj);
      }
    }
    var points = [];
    points.push(l1);
    points.push(r1);
    points.push(r2);
    points.push(l2);
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
      (function (a, m, count) {
        var timeout = 1000;
        setTimeout(function () {
          var e = {
            request_type: "1001",
            longtitude: ZhuoYao.Utils.convertLocation(Number(a[m]["longitude"])),
            latitude: ZhuoYao.Utils.convertLocation(Number(a[m]["latitude"])),
            requestid: socket.genRequestId("1001"),
            platform: 0
          };
          that.sendMessage(e, "1001")
        }, 2000 * count + 3000 * count2);
        console.log(2 * count + 1 * count2)
      })(points, m, count)
      count++;
      if (count != 0 && count % 3 == 0) {
        count2++;
      }
    }
  },
  getLeitaiInfo: function () {
    var that = this;
    var mapInfo = that.data.mapInfo;
    // console.log(ZhuoYao.Utils.convertLocation(mapInfo.longitude));
    // console.log(ZhuoYao.Utils.convertLocation(mapInfo.latitude));
    var e = {
      request_type: "1002",
      longtitude: ZhuoYao.Utils.convertLocation(mapInfo.longitude),
      latitude: ZhuoYao.Utils.convertLocation(mapInfo.latitude),
      requestid: socket.genRequestId("1002"),
      platform: 0
    };
    that.sendMessage(e, "1002")
  },
  sendMessage: function (e, t) {
    var a = this;
    socket.sendMessage(e);
  },
  onShareAppMessage() {

  }
});