namespace ZhuoYao {
    export class SpriteResult {
        end: number;
        packageNO: number;
        requestid: number;
        retcode: number;
        retmsg: string;
        sprite_list: AliveSprite[];
    
        constructor(obj: Object) {
            this.end = obj["end"];
            this.packageNO = obj["packageNO"];
            this.requestid = obj["requestid"];
            this.retcode = obj["retcode"];
            this.retmsg = obj["retmsg"];
            this.sprite_list = [];
            for (var i: number = 0; i < obj["sprite_list"].length; i++) {
                this.sprite_list[i] = new AliveSprite(obj["sprite_list"][i]);
                if (!this.sprite_list[i]) {
                    console.log(1)
                }
            }
        }
    }
}