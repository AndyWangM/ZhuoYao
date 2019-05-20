var ZhuoYao;
(function (ZhuoYao) {
    var HttpUtils = /** @class */ (function () {
        function HttpUtils() {
        }
        HttpUtils.prototype.get = function (url, data) {
            wx["request"]({
                url: url,
                data: data,
                method: "GET",
                success: function (res) {
                    console.log(res);
                },
                failed: function (res) {
                    console.log(res);
                }
            });
        };
        HttpUtils.prototype.post = function (url, data) {
            wx["request"]({
                url: url,
                method: "POST",
                data: data,
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
        return HttpUtils;
    }());
    ZhuoYao.HttpUtils = HttpUtils;
})(ZhuoYao || (ZhuoYao = {}));
