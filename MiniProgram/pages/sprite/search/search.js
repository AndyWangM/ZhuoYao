import ZhuoYao from '../../../utils/zhuoyao.js'

const app = getApp();
var socket;

Page({
  data: {
    mapInfo: {},
    spriteName: null,
    result: [],
    xIndex: 2,
    yIndex: 2
  },
  onLoad() {
    var that = this;
    setInterval(function () {
      // var 
      // for(var i = 0; i< that.data.tempresult.length;i++) {
        
      // }
      that.setData({
        result: ZhuoYao.Utils.getTempResults().values() || []
      })
    }, 1000)
  },
  onShow() {
    var that = this;
    socket = new ZhuoYao.Socket(that);
    socket.initSocket();
  },
  tapview(e) {
    var content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content.longtitude + " " + content.latitude,
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
      "xIndex":e.detail.value
    })
  },
  bindYInput(e) {
    this.setData({
      "yIndex": e.detail.value
    })
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
          console.log(mapInfo)
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
  getYaojingInfo: function () {
    var that = this;
    var mapInfo = that.data.mapInfo;
    var latStep = 0.017860;
    var longStep = 0.015182;
    var a = [];
    var aindex = this.data.xIndex;
    var bindex = this.data.yIndex;
    for (var i = 0; i < aindex; i++) {
      var lat = mapInfo.latitude + i * latStep;
      var b = [];
      for (var j = 0; j < bindex; j++) {
        var lon = mapInfo.longitude + j * longStep;
        b[j] = [lat.toFixed(6), lon.toFixed(6)];
      }
      a[i] = b;
    }
    // console.log(a);
    var count = 0;
    for (var m = 0; m < aindex; m++) {
      for (var n = 0; n < bindex; n++) {
        (function (a, m, n, count) {
          setTimeout(function () {
            var e = {
              request_type: "1001",
              longtitude: ZhuoYao.Utils.convertLocation(Number(a[m][n][1])),
              latitude: ZhuoYao.Utils.convertLocation(Number(a[m][n][0])),
              requestid: socket.genRequestId("1001"),
              platform: 0
            };
            that.sendMessage(e, "1001")
          }, 3000 * (count));
          console.log(count)
        })(a, m, n, count)
        count++;
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
  }
});