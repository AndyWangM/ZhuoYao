import ZhuoYao from '../../../utils/zhuoyao.js'

const url = "https://zhuoyao.wangandi.com/";
const getAPI = "api/sprites/get/";
const setAPI = "api/sprites/set/";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    inputVal: ""
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
    var splitSign = ZhuoYao.Utils.getSplitSign();
    var lonfront = ZhuoYao.Utils.getLonfront();
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
            var latitude = aliveSprite.latitude.toString().substr(0, 2) + "." + aliveSprite.latitude.toString().substr(2);
            var longitude = aliveSprite.longtitude.toString().substr(0, 3) + "." + aliveSprite.longtitude.toString().substr(3);
            var location = ZhuoYao.Utils.getLocation(longitude, latitude);
            var resultObj = {
              "name": sprite.Name,
              "latitude": location[1],
              "longitude": location[0],
              "lefttime": ZhuoYao.Utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime),
              "iconPath": sprite.HeadImage,
              "id": sprite.Id + ":" + latitude + " " + longitude,
              "width": 40,
              "height": 40
            };
            result.push(resultObj);
          }
          that.setData({
            result: result
          })
          // console.log(result)
        }
      },
      failed(res) {
        console.log(res)
      }
    })
  },
  markertap(e) {
    var markerId = e.markerId;
    var loc = ZhuoYao.Utils.getMarkerInfo(markerId);
    var splitSign = ZhuoYao.Utils.getSplitSign();
    var lonfront = ZhuoYao.Utils.getLonfront();
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
  bindInput: function (e) {
    e && this.setData({
      inputVal: e.detail.value
    })
    // this.bindGoSearch();
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