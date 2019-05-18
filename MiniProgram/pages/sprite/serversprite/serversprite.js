import ZhuoYao from '../../../utils/zhuoyao.js'

// const url = "http://127.0.0.1:3585/";
const url = "http://zhuoyao.wangandi.com/";
const getAPI = "api/sprites/get/";
const getAllAPI = "api/sprites/getall/";
const setAPI = "api/sprites/set/";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    inputVal: "",
    currentPage: 0,
    pageSize: 100,
    geturl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getLatestSprite() {
    this.setData({
      currentPage: 0
    });
    var spriteId = ZhuoYao.Utils.getSpriteNameHash().get(this.data.inputVal);
    var getUrl;
    if (spriteId) {
      getUrl = url + getAPI + spriteId;
    } else {
      getUrl = url + getAllAPI;
    }
    this.setData({
      getUrl: getUrl
    })
    this.getSprites();
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
  getSprites() {
    var that = this;
    var getUrl = this.data.getUrl;
    wx["request"]({
      url: getUrl,
      data: {
        currentPage: that.data.currentPage,
        pageSize: that.data.pageSize
      },
      method: "GET",
      success(res) {
        var data = res.data;
        if (data.length > 0) {
          var result = [];
          for (var i = data.length; i--;) {
            var aliveSprite = data[i];
            var sprite = ZhuoYao.Utils.getSpriteList().get(aliveSprite.sprite_id);
            var latitude = (aliveSprite.latitude / 1000000).toFixed(6);
            var longitude = (aliveSprite.longtitude / 1000000).toFixed(6);
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
  nextPage() {
    var currentPage = this.data.currentPage + 1;
    this.setData({
      currentPage: currentPage
    });
    this.getSprites();
  },
  frontPage() {
    var currentPage = this.data.currentPage - 1;
    if (currentPage < 0) {
      currentPage = 0;
    }
    this.setData({
      currentPage: currentPage
    });
    this.getSprites();
  },
  onShareAppMessage() {

  }
})