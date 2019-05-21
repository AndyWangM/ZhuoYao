namespace ZhuoYao {
    export class AliveSprite {
        gentime: number;
        public latitude: number;
        lifetime: number;
        longtitude: number;
        sprite_id: number;

        constructor(obj: Object) {
            this.gentime = obj["gentime"];
            this.latitude = obj["latitude"];
            this.lifetime = obj["lifetime"];
            this.longtitude = obj["longtitude"];
            this.sprite_id = obj["sprite_id"];
        }

        public getLeftTime() {
            var that = this;
            var time = that.gentime + that.lifetime;
            var leftTime = time - (new Date).getTime() / 1000;
            return that.formatTime(leftTime.toFixed(0));
        }

        formatTime(timeStr: string) {
            var time: number = Number(timeStr);

            var hour = parseInt((time / 3600).toString());
            time = time % 3600;
            var minute = parseInt((time / 60).toString());
            time = time % 60;
            var second = parseInt(time.toString());

            return ([hour, minute, second]).map(function (n) {
                var num: string = n.toString();
                return num[1] ? num : '0' + num;
            }).join(':');
        }
    }
}