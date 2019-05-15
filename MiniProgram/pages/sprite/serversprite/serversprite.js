import ZhuoYao from '../../../utils/zhuoyao.js'

const url = "https://zhuoyao.wangandi.com/";
const getAPI = "api/sprites/get/";
const setAPI = "api/sprites/set/";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getLatestSprite() {
    this.get("*");
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
  get(id) {
    var that = this;
    wx["request"]({
      url: url + getAPI + id,
      method: "GET",
      success(res) {
        var data = res.data;
        if (data.length > 0) {
          var result = [];
          for (var i = data.length; i--;) {
            var aliveSprite = data[i];
            var sprite = ZhuoYao.Utils.getSpriteList().get(aliveSprite.sprite_id);
            var latitude = aliveSprite.latitude.toString().substr(0, 2) + "." + aliveSprite.latitude.toString().substr(2)
            var longtitude = aliveSprite.longtitude.toString().substr(0, 3) + "." + aliveSprite.longtitude.toString().substr(3)
            var resultObj = {
              "name": sprite.Name,
              "latitude": latitude,
              "longtitude": longtitude,
              "lefttime": ZhuoYao.Utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime)
            };
            result.push(resultObj);
          }
          that.setData({
            result: result
          })
        }
      },
      failed(res) {
        console.log(res)
      }
    })
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