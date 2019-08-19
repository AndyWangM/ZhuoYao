import ZhuoYao from '../../../utils/zhuoyao.js'

const app = getApp()

Page({
  data: {
    height: 0
  },
  tapview: function (e) {
    var content = e.currentTarget.dataset.content;
    var data = qq.getStorageSync("SpriteList");
    for (var i = 0; i < data.length; i++) {
      if (data[i].Id == content.Id) {
        data[i].Checked = !data[i].Checked;
      }
    }
    app.globalData.zhuoyao.utils.setSpriteConfig(data);
  },
  touchS: function (e) { // touchstart
    let startX = app.Touches.getClientX(e)
    startX && this.setData({
      startX
    })
  },
  onLoad: function (options) {
    var that = this;
    qq.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      },
    });
  },
  onShow() {
    var that = this;
    let itemData = app.globalData.zhuoyao.utils.getSpriteByName();
    that.setData({
      itemData: itemData,
      inputVal: ""
    });
  },
  bindInput: function (e) {
    e && this.setData({
      inputVal: e.detail.value
    })
    this.bindGoSearch();
  },
  bindGoSearch: function (e) {
    let itemData = app.globalData.zhuoyao.utils.getSpriteByName(this.data.inputVal);
    this.setData({
      itemData: itemData
    });
  },
  onShareAppMessage(res) {
    return {
      title: '捉妖工具',
      path: '/pages/sprite/search/search'
    }
  }
})