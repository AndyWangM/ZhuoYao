import Touches from './utils/Touches.js'

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
  },
  globalData: {
    userInfo: null
  },
  Touches: new Touches()
})