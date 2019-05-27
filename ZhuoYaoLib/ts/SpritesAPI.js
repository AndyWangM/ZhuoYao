var ZhuoYao;
(function (ZhuoYao) {
    var SpritesAPI = /** @class */ (function () {
        function SpritesAPI() {
        }
        SpritesAPI.setSpriteList = function (obj) {
            var that = this;
            var url = that.url + that.setAPI;
            this.httpUtils.post(url, obj);
        };
        SpritesAPI.getSpriteConfig = function (callback) {
            this.httpUtils.get(this.spriteConfigUrl, null, callback);
        };
        SpritesAPI.getSpriteFilter = function (callback) {
            this.httpUtils.get(this.spriteFilterUrl, null, callback);
        };
        SpritesAPI.get = function (id) {
            var that = this;
            var url = that.url + that.getAPI + id;
            this.httpUtils.get(url);
        };
        SpritesAPI.url = "https://zhuoyao.wangandi.com/";
        // private static url: string = "http://127.0.0.1:3585/";
        SpritesAPI.spriteConfigUrl = "https://zhuoyao.wangandi.com/api/config/getSearchConfig";
        SpritesAPI.spriteFilterUrl = "https://zhuoyao.wangandi.com/api/sprites/filter/get";
        // private static spriteConfigUrl: string = "http://127.0.0.1:3585/api/config/getSearchConfig";
        SpritesAPI.getAPI = "api/sprites/get/";
        SpritesAPI.setAPI = "api/sprites/set/";
        SpritesAPI.httpUtils = new ZhuoYao.HttpUtils();
        return SpritesAPI;
    }());
    ZhuoYao.SpritesAPI = SpritesAPI;
})(ZhuoYao || (ZhuoYao = {}));
