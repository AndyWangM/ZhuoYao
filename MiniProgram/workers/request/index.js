import ZhuoYao from './zhuoyao.js'

// 在 Worker 线程执行上下文会全局暴露一个 worker 对象，直接调用 worker.onMeesage/postMessage 即可
worker.onMessage(function (obj) {
  // console.log(obj);
  var arr = []
  var serverFilterResult = [];
  if (obj.sprite_list) {

    for (var i = obj.sprite_list.length; i--;) {
      var aliveSprite = obj.sprite_list[i];
      // for (const aliveSprite of obj.sprite_list) {
      // if (sprite) {
      var serverFilter = obj.serverFilter;
      if (serverFilter && serverFilter[aliveSprite.sprite_id]) {
          serverFilterResult.push(aliveSprite);
      }

      var spriteNameFilter = obj.filter;
      if (spriteNameFilter.length > 0) {
        if (spriteNameFilter.indexOf(aliveSprite.sprite_id) != -1) {
          arr.push(aliveSprite);
        }
      }
    }
  }
  // console.log(wx)
  worker.postMessage({ sprites: arr, serverSprites: serverFilterResult});
})