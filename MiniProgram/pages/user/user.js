import ZhuoYao from '../../utils/zhuoyao.js'

const app = getApp();
var defaultAvatar = "data:image/jpg;base64,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";
let interstitialAd = null
let videoAd = null

var defaultUserInfo = {
  avatarUrl: defaultAvatar,
  nickName: "点击头像登录"
}

Page({
  data: {
    userInfo: {},
    list: [{
      icon: 'images/help.png',
      text: '使用说明',
      type: 'help',
    },
    {
      icon: 'images/setting.png',
      text: '坐标系设置',
      type: 'location'
    },
    {
      icon: 'images/setting.png',
      text: '复制结果格式设置',
      type: 'copyformatter'
    },
    {
      icon: 'images/setting.png',
      text: '分页数量设置',
      type: 'page'
    },
    {
      icon: 'images/setting.png',
      text: '观看广告',
      type: 'ad'
    },
    {
      icon: 'images/tel.png',
      text: 'QQ群: 7672057',
      type: 'none'
    }]
  },
  onLoad() {
    this.setData({
      userInfo: defaultUserInfo
    });
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-c4353499034a807a'
      })
      videoAd.onLoad(() => { })
      videoAd.onError((err) => { })
      videoAd.onClose((res) => { })
    }
  },
  onShow() {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data
        });
      }
    })
  },
  getUserInfo(e) {
    if (this.data.userInfo.avatarUrl != defaultAvatar) {
      return;
    }
    wx.login({
      success: res => {
        wx.login({
          success(res) {
            console.log(res)
          }
        })
      }
    })
    if (e.detail.userInfo) {
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
      })
      this.setData({
        userInfo: e.detail.userInfo
      });
    }
  },
  getHelp: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['注意事项', '妖灵搜索', '已知妖灵', '经纬度坐标系', '省/市过滤'],
      success(res) {
        switch (res.tapIndex) {
          case 0:
            that.showInfo('注意事项', '1. 首次使用出现连接中的弹窗时，妖灵过滤中列表为空，请耐心等待弹窗消失再选择过滤\r\n2. 出现连接中的弹窗时，妖灵搜索没有结果，请耐心等待弹窗消失后再搜索\r\n3. 处于连接中时，已知妖灵功能仍可使用\r\n4. 有任何问题请加QQ群');
            break;
          case 1:
            that.showInfo('妖灵搜索', '1. 注意勾选需要搜索的妖灵，若不选中则搜索结果为空\r\n2. 在地理位置选择目标位置\r\n3. 输入搜索的经纬度范围，若不输入则默认都为2，具体范围会在地图中展示\r\n4. 上述操作完毕后，点击妖灵搜索，范围越大搜索时间越长，若切到后台则停止搜索\r\n5. 搜索结果会在地图和列表中同时展示，点击列表中的单项或地图标注可以复制经纬度\r\n6. 范围为纬度*经度，默认为2*2')
            break;
          case 2:
            that.showInfo('已知妖灵', '1. 已知妖灵与妖灵过滤无关，妖灵过滤不会对已知妖灵起效\r\n2. 处于连接中时，已知妖灵功能仍可使用\r\n3. 点击获取最新妖灵可以获取已知妖灵\r\n4. 结果会在地图和列表中同时展示，点击列表中的单项或地图标注可以复制经纬度')
            break;
          case 3:
            that.showInfo('经纬度坐标系', '1. 默认是火星坐标系，如需使用其他坐标系，请在坐标系中切换，然后重新搜索和获取已知妖灵')
            break;
          case 4:
            that.showInfo('省市过滤', '1. 不填则全国搜索，填入则按省/市全名过滤，如浙江省、南昌市、上海市。若想搜索浙江省杭州市，则直接填入杭州市即可，若您的省/市妖灵过少，可以在QQ群反馈。')
            break;
        }
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  setCoordinate: function (coordinate) {
    app.globalData.zhuoyao.utils.setCoordinate(coordinate)
  },
  setLocation: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['火星坐标系', '百度坐标系', '地球坐标系'],
      success(res) {
        switch (res.tapIndex) {
          case 0:
            that.showInfo('火星坐标系', 'GCJ02坐标系，WGS84坐标系加密后的坐标系，如Google国内地图、高德、腾讯地图，点击确定后切换，重新搜索后生效', that.setCoordinate, "GCJ02");
            break;
          case 1:
            that.showInfo('百度坐标系', 'BD09坐标系，GCJ02坐标系加密后的坐标系，点击确定后切换，重新搜索后生效', that.setCoordinate, "BD09")
            break;
          case 2:
            that.showInfo('地球坐标系', 'WGS84坐标系，国际通用坐标系，点击确定后切换，重新搜索后生效', that.setCoordinate, "WGS84")
            break;
        }
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  setPageSize(size) {
    app.globalData.zhuoyao.utils.setPageSize(size);
  },
  setPage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['每页20个', '每页50个', '每页100个'],
      success(res) {
        switch (res.tapIndex) {
          case 0:
            that.showInfo('每页20个', '点击确定后切换', that.setPageSize, 20);
            break;
          case 1:
            that.showInfo('每页50个', '点击确定后切换', that.setPageSize, 50);
            break;
          case 2:
            that.showInfo('每页100个', '点击确定后切换', that.setPageSize, 100);
            break;
          case 3:
            that.showInfo('每页200个', '点击确定后切换', that.setPageSize, 200);
            break;
        }
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  setFormatter(type) {
    switch (type) {
      case "spacesplit":
        app.globalData.zhuoyao.utils.setSplitSign("spacesplit");
        break;
      case "commasplit":
        app.globalData.zhuoyao.utils.setSplitSign("commasplit");
        break;
      case "lonfront":
        app.globalData.zhuoyao.utils.setLonfront(true);
        break;
      case "latfront":
        app.globalData.zhuoyao.utils.setLonfront(false);
        break;
    }
  },
  setCopyFormatter() {
    var that = this;
    wx.showActionSheet({
      itemList: ['空格分隔', '逗号分隔', "纬度在前", "经度在前"],
      success(res) {
        switch (res.tapIndex) {
          case 0:
            that.showInfo('确认后切换', '如31.123456 123.123456', that.setFormatter, "spacesplit");
            break;
          case 1:
            that.showInfo('确认后切换', '如31.123456,123.123456', that.setFormatter, "commasplit")
            break;
          case 2:
            that.showInfo('确认后切换', '如31.123456,123.123456', that.setFormatter, "latfront")
            break;
          case 3:
            that.showInfo('确认后切换', '如123.123456,31.123456', that.setFormatter, "lonfront")
            break;
        }
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  showInfo: function (title, content, callback, arg) {
    wx.showModal({
      title: title,
      content: content,
      success(res) {
        if (res.confirm) {
          if (callback) {
            callback(arg);
          }
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  navigateTo(e) {
    var that = this;
    const type = e.currentTarget.dataset.type
    if (type) {
      switch (type) {
        case "help":
          that.getHelp();
          break;
        case "location":
          that.setLocation();
          break;
        case "copyformatter":
          that.setCopyFormatter();
          break;
        case "page":
          that.setPage();
          break;
        case "ad":
          if (videoAd) {
            videoAd.show().catch(() => {
              // 失败重试
              videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                  console.log('激励视频 广告显示失败')
                })
            })
          }
          break;
        case "none":
          break;
      }
    } else {
      const url = e.currentTarget.dataset.url;
      if (url) {
        wx.navigateTo({
          url
        });
      }
    }
  },
  onShareAppMessage(res) {
    return {
      title: '捉妖工具',
      path: '/pages/sprite/search/search'
    }
  }
});