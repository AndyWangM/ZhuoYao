import ZhuoYao from '../../../utils/zhuoyao.js'

const App = getApp()

Page({
  data: {
    height: 0
  },
  tapview: function (e) {
    var content = e.currentTarget.dataset.content;
    var data = wx.getStorageSync("SpriteList");
    for (var i = 0; i < data.length; i++) {
      if (data[i].Id == content.Id) {
        data[i].Checked = !data[i].Checked;
      }
    }
    ZhuoYao.Utils.setSpriteList(data);
  },
  touchS: function (e) { // touchstart
    let startX = App.Touches.getClientX(e)
    startX && this.setData({
      startX
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      },
    });
  },
  onShow() {
    var that = this;
    let itemData = ZhuoYao.Utils.getSpriteByName();
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
    let itemData = ZhuoYao.Utils.getSpriteByName(this.data.inputVal);
    this.setData({
      itemData: itemData
    });
  },
  onShareAppMessage() {

  }
})