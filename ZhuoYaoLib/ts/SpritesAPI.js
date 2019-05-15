var ZhuoYao;
(function (ZhuoYao) {
    var SpritesAPI = /** @class */ (function () {
        function SpritesAPI() {
        }
        SpritesAPI.post = function (obj) {
            var that = this;
            var url = that.url + that.setAPI;
            wx["request"]({
                url: url,
                method: "POST",
                data: obj,
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    console.log(res);
                },
                failed: function (res) {
                    console.log(res);
                }
            });
        };
        SpritesAPI.get = function (id) {
            var that = this;
            var url = that.url + that.getAPI + id;
            wx["request"]({
                url: url,
                method: "GET",
                success: function (res) {
                    console.log(res);
                },
                failed: function (res) {
                    console.log(res);
                }
            });
        };
        SpritesAPI.url = "https://zhuoyao.wangandi.com/";
        SpritesAPI.getAPI = "api/sprites/get/";
        SpritesAPI.setAPI = "api/sprites/set/";
        return SpritesAPI;
    }());
    ZhuoYao.SpritesAPI = SpritesAPI;
})(ZhuoYao || (ZhuoYao = {}));
