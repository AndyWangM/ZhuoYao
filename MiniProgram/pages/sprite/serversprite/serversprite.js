import ZhuoYao from '../../../utils/zhuoyao.js'

// const url = "http://127.0.0.1:3585/";
// const url = "http://192.168.3.25:3585/";
const url = "https://zhuoyao.wangandi.com/";
const getAPI = "api/sprites/get/";
const getAllAPI = "api/sprites/getall/";
const setAPI = "api/sprites/set/";

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    inputVal: "",
    currentPage: 0,
    totalPage:-1,
    geturl: null,
    hasNextPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getLatestSprite() {
    this.setData({
      currentPage: 0,
      totalPage:-1,
      hasNextPage:true
    });
    var spriteId = app.globalData.zhuoyao.utils.getSpriteNameHash().get(this.data.inputVal);
    var getUrl;
    if (spriteId) {
      getUrl = url + getAPI + spriteId;
    } else if (!this.data.inputVal) {
      getUrl = url + getAllAPI;
    } else {
      wx.showModal({
        title: '提示',
        content: '没有该妖灵，请重新输入',
      })
      return;
    }
    this.setData({
      getUrl: getUrl
    })
    this.getSprites();
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
  getSprites() {
    var that = this;
    var getUrl = this.data.getUrl;
    wx["request"]({
      url: getUrl,
      data: {
        currentPage: that.data.currentPage,
        pageSize: app.globalData.zhuoyao.utils.getPageSize()
      },
      method: "GET",
      success(res) {
        var request = res.data;
        var data;
        if (request.error_code != undefined) {
          if (request.error_code != 0) {
            wx.showModal({
              title: "提示",
              content: request.data.info
            })
            return;
          } else {
            data = request.data.sprites;
            var totalPage = request.data.total_page;
            if(totalPage <= 1) {
              that.setData({
                hasNextPage: false
              })
            }
            that.setData({
              totalPage: totalPage
            })
          }
        }
        if (data && data.length > 0) {
          var result = [];
          for (var i = data.length; i--;) {
            var aliveSprite = data[i];
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
  bindInput: function (e) {
    e && this.setData({
      inputVal: e.detail.value
    })
    // this.bindGoSearch();
  },
  nextPage() {
    var currentPage = this.data.currentPage + 1;
    if (this.data.totalPage != -1 && currentPage >= this.data.totalPage-1) {
      currentPage = this.data.totalPage-1;
      this.setData({hasNextPage:false});
    }
    this.setData({
      currentPage: currentPage
    });
    this.getSprites();
  },
  frontPage() {
    var currentPage = this.data.currentPage - 1;
    if (this.data.totalPage != -1 && currentPage < this.data.totalPage-1) {
      this.setData({ hasNextPage: true });
    }
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