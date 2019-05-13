namespace ZhuoYao {
    export class AliveSprite {
        gentime: number;
        public latitude: number;
        lifetime: number;
        public longtitude: number;
        sprite_id: number;
        sprite: Sprite;

        constructor(obj: Object) {
            this.gentime = obj["gentime"];
            this.latitude = obj["latitude"];
            this.lifetime = obj["lifetime"];
            this.longtitude = obj["longtitude"];
            this.sprite_id = obj["sprite_id"];
            this.initSprite();
        }

        public getLeftTime() {
            var that = this;
            var time = that.gentime + that.lifetime;
            var leftTime = time - (new Date).getTime() / 1000;
            return that.formatTime(leftTime.toFixed(0));
        }

        public initSprite() {
            var spriteList: HashMap<Sprite> = Utils.getSpriteList();
            this.sprite = spriteList.get(this.sprite_id);
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