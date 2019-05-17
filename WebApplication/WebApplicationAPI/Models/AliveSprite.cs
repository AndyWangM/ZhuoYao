using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationAPI.Models
{
    public class AliveSprite
    {
        [JsonProperty("sprite_id")]
        public int SpriteId { get; set; }
        [JsonProperty("gentime")]
        public long GenTime {get;set;}
        [JsonProperty("lifetime")]
        public int LifeTime { get; set; }
        [JsonProperty("latitude")]
        public double Latitude { get; set; }
        [JsonProperty("longtitude")]
        public double Longitude { get; set; }

        public long GetExpiredTime()
        {
            DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1)); // 当地时区
            long timeStamp = (long)(DateTime.Now - startTime).TotalSeconds; // 相差毫秒数
            var dispareTime = GenTime + LifeTime;
            return dispareTime - timeStamp;
        }

        public string GetHash()
        {
            var str = "" + SpriteId + GenTime + LifeTime + Latitude + Longitude;
            return Utils.MD5Helper.EncryptString(str);
        }

        public string GetKey()
        {
            return SpriteId + "_" + GetHash();
        }
        //public string sprite { get; set; }

        //public GetLeftTime()
        //{
        //    var that = this;
        //    var time = that.gentime + that.lifetime;
        //    var leftTime = time - (new Date).getTime() / 1000;
        //    return that.formatTime(leftTime.toFixed(0));
        //}

        //public initSprite()
        //{
        //    var spriteList: HashMap < Sprite > = Utils.getSpriteList();
        //    // for (const sprite of spriteList) {
        //    //     if (sprite.Id == this.sprite_id) {
        //    //         this.sprite = sprite;
        //    //     }
        //    // }
        //    this.sprite = spriteList.get(this.sprite_id);
        //}

        //formatTime(timeStr: string)
        //{
        //    var time: number = Number(timeStr);

        //    var hour = parseInt((time / 3600).toString());
        //    time = time % 3600;
        //    var minute = parseInt((time / 60).toString());
        //    time = time % 60;
        //    var second = parseInt(time.toString());

        //    return ([hour, minute, second]).map(function(n) {
        //        var num: string = n.toString();
        //        return num[1] ? num : '0' + num;
        //    }).join(':');
        //}
    }
}
