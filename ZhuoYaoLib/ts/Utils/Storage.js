var ZhuoYao;
(function (ZhuoYao) {
    var Storage = /** @class */ (function () {
        function Storage() {
        }
        Storage.prototype.setItem = function (key, value) {
            wx["setStorage"]({
                key: key,
                data: value
            });
        };
        Storage.prototype.getItem = function (key) {
            return wx["getStorageSync"](key);
        };
        Storage.prototype.deleteItem = function (key) {
            wx.removeStorageSync(key);
        };
        return Storage;
    }());
    ZhuoYao.Storage = Storage;
})(ZhuoYao || (ZhuoYao = {}));
