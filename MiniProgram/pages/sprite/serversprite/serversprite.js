import ZhuoYao from '../../../utils/zhuoyao.js'

// const url = "http://127.0.0.1:3585/";
// const url = "http://192.168.3.25:3585/";
const url = "https://www.wangandi.com/";
const getAPI = "api/sprites/get/";
const getTypeAPI = "api/sprites/get/type/";
const getAllAPI = "api/sprites/getall/";
// const setAPI = "api/sprites/set/";

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickedObj: {},
    result: [],
    inputVal: "",
    currentPage: 0,
    totalPage: -1,
    geturl: null,
    hasNextPage: true,
    provinceInputVal: null,
    cityInputVal: null,
    spriteType: [
      // {
      //   spriteType: "null",
      //   displayName: "全部"
      // }, 
      {
        spriteType: "rare",
        displayName: "稀有"
      }, {
        spriteType: "den",
        displayName: "巢穴"
      }, {
        spriteType: "region",
        displayName: "地域"
      }, {
        spriteType: "kun",
        displayName: "鲲"
      }, {
        spriteType: "ghost",
        displayName: "黑白鬼"
      }, {
        spriteType: "winner",
        displayName: "人生赢家"
      }, {
        spriteType: "once",
        displayName: "一觉"
      }, {
        spriteType: "twice",
        displayName: "二觉"
      }, {
        spriteType: "other",
        displayName: "其他"
      }
    ],
    spriteTypeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      clickedObj: app.globalData.clickedObj || {}
    })
    setInterval(function () {
      that.setData({
        clickedObj: app.globalData.clickedObj || {}
      })
    }, 1000);
  },
  getLatestSprite() {
    this.setData({
      currentPage: 0,
      totalPage: -1,
      hasNextPage: true
    });
    var spriteId = app.globalData.zhuoyao.utils.getSpriteNameHash().get(this.data.inputVal);
    var spriteType = this.data.spriteType[this.data.spriteTypeIndex].spriteType;
    var getUrl;
    if (this.data.inputVal && !spriteId) {
      wx.showModal({
        title: '提示',
        content: '没有该妖灵，请重新输入',
      })
      return;
    }
    if (!this.data.inputVal && spriteType == "null") {
      getUrl = url + getAllAPI;
    } else if (spriteId) {
      getUrl = url + getAPI + spriteId;
    } else {
      getUrl = url + getTypeAPI + spriteType;
    }
    this.setData({
      getUrl: getUrl
    })
    this.getSprites();
  },
  tapview(e) {
    var content = e.currentTarget.dataset.content;
    var hashid = content.hashid;
    var temp = this.data.result;
    for (var res of temp) {
      if (res.hashid == hashid) {
        res.iconPath = "/images/all.png";
      }
    }
    var a = app.globalData.clickedObj;
    a[hashid] = content.totaltime;
    // clickedObj.put(this.hash(hashStr), content.totaltime);
    this.setData({
      result: temp,
      clickedObj: a
    })
    wx.setStorageSync("clickedObj", this.data.clickedObj)
    app.globalData.clickedObj = this.data.clickedObj;
    var splitSign = app.globalData.zhuoyao.utils.getSplitSign();
    var lonfront = app.globalData.zhuoyao.utils.getLonfront();
    var data;
    if (lonfront) {
      data = content.rlongitude + splitSign + content.rlatitude
    } else {
      data = content.rlatitude + splitSign + content.rlongitude
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
  hash(input) {
    var I64BIT_TABLE =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('')
    var hash = 5381;
    var i = input.length - 1;

    if (typeof input == 'string') {
      for (; i > -1; i--)
        hash += (hash << 5) + input.charCodeAt(i);
    } else {
      for (; i > -1; i--)
        hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7FFFFFFF;

    var retValue = '';
    do {
      retValue += I64BIT_TABLE[value & 0x3F];
    }
    while (value >>= 6);

    return retValue;
  },
  getSprites() {
    var that = this;
    var getUrl = that.data.getUrl;
    wx.showLoading({
      title: '请稍后'
    })
    var data = {
      currentPage: that.data.currentPage,
      pageSize: app.globalData.zhuoyao.utils.getPageSize()
    };
    if (that.data.provinceInputVal) {
      data.province = that.data.provinceInputVal;
    }
    if (that.data.cityInputVal) {
      data.city = that.data.cityInputVal;
    }
    wx["request"]({
      url: getUrl,
      data: data,
      method: "GET",
      success(res) {
        wx.hideLoading();
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
            if (totalPage <= 1) {
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
            var totaltime = aliveSprite.gentime + aliveSprite.lifetime;
            var hashStr = sprite.Name + aliveSprite.latitude + aliveSprite.longtitude + totaltime;
            var hashid = that.hash(hashStr); 
            var iconPath = sprite.HeadImage;
            if (app.globalData.clickedObj[hashid]) {
              iconPath = "/images/all.png";
            }
            var resultObj = {
              "hashid": hashid,
              "name": sprite.Name,
              "latitude": latitude,
              "longitude": longitude,
              "rlatitude": location[1],
              "rlongitude": location[0],
              "lefttime": app.globalData.zhuoyao.utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime),
              "totaltime": totaltime,
              "iconPath": iconPath,
              "id": hashid + ":" + totaltime + ":" + latitude + " " + longitude,
              "width": 40,
              "height": 40,
              "callout": {
                "content": sprite.Name
              }
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
        wx.hideLoading();
        wx.showModal({
          title: "提示",
          content: "请求超时，请稍后再试"
        })
      }
    })
  },
  bindPickerChange(e) {
    var index = e.detail.value;
    this.setData({
      spriteTypeIndex: index
    });
    console.log(this.data.spriteType[index])
  },
  markertap(e) {
    var markerId = e.markerId;
    var obj = app.globalData.zhuoyao.utils.getMarkerInfo(markerId);
    var hashid = obj.hashid;
    var temp = this.data.result;
    for (var res of temp) {
      if (res.hashid == hashid) {
        res.iconPath = "/images/all.png";
      }
    }
    var a = app.globalData.clickedObj;
    a[hashid] = obj.totaltime;
    // clickedObj.put(this.hash(hashStr), content.totaltime);
    this.setData({
      result: temp,
      clickedObj: a
    })
    wx.setStorageSync("clickedObj", this.data.clickedObj)
    app.globalData.clickedObj = this.data.clickedObj;
    var location = app.globalData.zhuoyao.utils.getLocation(obj.longitude, obj.latitude);
    var splitSign = app.globalData.zhuoyao.utils.getSplitSign();
    var lonfront = app.globalData.zhuoyao.utils.getLonfront();
    var data;
    if (lonfront) {
      data = location[0] + splitSign + location[1]
    } else {
      data = location[1] + splitSign + location[0]
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
  bindProvinceInput: function (e) {
    e && this.setData({
      provinceInputVal: e.detail.value
    })
    // this.bindGoSearch();
  },
  bindCityInput: function (e) {
    e && this.setData({
      cityInputVal: e.detail.value
    })
    // this.bindGoSearch();
  },
  nextPage() {
    var currentPage = this.data.currentPage + 1;
    if (this.data.totalPage != -1 && currentPage >= this.data.totalPage - 1) {
      currentPage = this.data.totalPage - 1;
      this.setData({
        hasNextPage: false
      });
    }
    this.setData({
      currentPage: currentPage
    });
    this.getSprites();
  },
  frontPage() {
    var currentPage = this.data.currentPage - 1;
    if (this.data.totalPage != -1 && currentPage < this.data.totalPage - 1) {
      this.setData({
        hasNextPage: true
      });
    }
    if (currentPage < 0) {
      currentPage = 0;
    }
    this.setData({
      currentPage: currentPage
    });
    this.getSprites();
  },
  onShareAppMessage(res) {
    return {
      title: '捉妖工具',
      path: '/pages/sprite/search/search'
    }
  }
})