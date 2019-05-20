var ZhuoYao;
(function (ZhuoYao) {
    var AliveSprite = /** @class */ (function () {
        function AliveSprite(obj) {
            this.gentime = obj["gentime"];
            this.latitude = obj["latitude"];
            this.lifetime = obj["lifetime"];
            this.longtitude = obj["longtitude"];
            this.sprite_id = obj["sprite_id"];
        }
        AliveSprite.prototype.getLeftTime = function () {
            var that = this;
            var time = that.gentime + that.lifetime;
            var leftTime = time - (new Date).getTime() / 1000;
            return that.formatTime(leftTime.toFixed(0));
        };
        AliveSprite.prototype.formatTime = function (timeStr) {
            var time = Number(timeStr);
            var hour = parseInt((time / 3600).toString());
            time = time % 3600;
            var minute = parseInt((time / 60).toString());
            time = time % 60;
            var second = parseInt(time.toString());
            return ([hour, minute, second]).map(function (n) {
                var num = n.toString();
                return num[1] ? num : '0' + num;
            }).join(':');
        };
        return AliveSprite;
    }());
    ZhuoYao.AliveSprite = AliveSprite;
})(ZhuoYao || (ZhuoYao = {}));
