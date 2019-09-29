var getHeadImagePath = function(path) {
  if (path) {
    return "https://hy.gwgo.qq.com/sync/pet/" + path;
  }
  return "/images/default-head.png";
}
module.exports.getHeadImagePath = getHeadImagePath;