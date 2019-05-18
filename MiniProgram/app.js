import Touches from './utils/Touches.js'
import ZhuoYao from './utils/zhuoyao.js'

const updateManager = wx.getUpdateManager()
const worker = wx.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径
worker.postMessage({
  msg: 'hello worker'
})
worker.onMessage(function (res) {
  console.log(res)
  // if (res.length > 0) {
  //   for (var i = res.length; i--;) {
  //     var aliveSprite = res[i];
  //     var sprite = ZhuoYao.Utils.getSpriteList().get(aliveSprite.sprite_id);
  //     var latitude = (aliveSprite.latitude / 1000000).toFixed(6);
  //     var longitude = (aliveSprite.longtitude / 1000000).toFixed(6);
  //     var location = ZhuoYao.Utils.getLocation(longitude, latitude);
  //     var resultObj = {
  //       "name": sprite.Name,
  //       "latitude": location[1],
  //       "longitude": location[0],
  //       "lefttime": ZhuoYao.Utils.getLeftTime(aliveSprite.gentime, aliveSprite.lifetime),
  //       "iconPath": sprite.HeadImage,
  //       "id": sprite.Id + ":" + latitude + " " + longitude,
  //       "width": 40,
  //       "height": 40
  //     };
  //     var hashStr = "" + aliveSprite.sprite_id + aliveSprite.latitude + aliveSprite.longtitude + aliveSprite.gentime + aliveSprite.lifetime;
  //     var hashValue = ZhuoYao.Utils.hash(hashStr);
  //     ZhuoYao.Utils.getTempResults().put(hashStr, resultObj);
  //   }
  // }
})
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
  },
  onLaunch() {
    console.log(worker);
    // var socket = new ZhuoYao.Socket(worker);
  },
  onShow() {
    if (!wx.getStorageSync('isfirst')) {
      wx.showModal({
        title: '注意事项',
        content: '首次使用务必先看全局设置中的使用说明，并根据自己的需求进行配置，点击确认后不再显示',
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
    worker: worker
  },
  Touches: new Touches()
})