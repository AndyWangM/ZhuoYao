import Touches from './utils/Touches.js'
import ZhuoYao from './utils/zhuoyao.js'
const mtjwxsdk = require('./utils/mtj-wx-sdk.js');

const updateManager = wx.getUpdateManager()

updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})

App({
  onLaunch: function () {
    var that = this;
    setInterval(function() {
      var obj = wx.getStorageSync("clickedObj");
      var newObj = {};
      if (obj) {
        var now = new Date().getTime() / 1000;
        for(var i in obj) {
          if (obj[i] > now) {
            newObj[i] = obj[i];
          }
        }
      }
      wx.setStorageSync("clickedObj", newObj);
      that.globalData.clickedObj = newObj
      // console.log(that.globalData.clickedObj)
    }, 1000);
    wx["request"]({
      "url": "https://static.wangandi.com/accountInfo.json",
      "method": "GET",
      "success"(res) {
        wx.setStorageSync("own_openid", res["data"]["openid"]);
        wx.setStorageSync("own_token", res["data"]["token"]);
      },
      "failed"(res) {
        console.log(res)
      }
    })
  },
  onShow() {
    if (!wx.getStorageSync('isfirst')) {
      wx.showModal({
        title: '注意事项',
        content: '首次使用务必先看全局设置中的使用说明，并根据自己的需求进行相关配置，点击确认后不再显示',
        success(res) {
          if (res.confirm) {
            wx.setStorageSync("isfirst", true)
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    clickedObj: wx.getStorageSync("clickedObj") || {},
    zhuoyao: new ZhuoYao.Socket()
  },
  Touches: new Touches()
})