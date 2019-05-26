using Newtonsoft.Json;
using System;

namespace WebApplicationAPI.Models
{
    public class AliveSprite : IComparable<AliveSprite>
    {
        [JsonProperty("sprite_id")]
        public int SpriteId { get; set; }
        [JsonProperty("gentime")]
        public long GenTime { get; set; }
        [JsonProperty("lifetime")]
        public int LifeTime { get; set; }
        [JsonProperty("latitude")]
        public double Latitude { get; set; }
        [JsonProperty("longtitude")]
        public double Longitude { get; set; }
        [JsonProperty("sprite_config")]
        public SpriteConfig SpriteConfig { get; set; }

        public int CompareTo(AliveSprite other)
        {
            if (other == null)
            {
                return 1;
            }
            int ret = SpriteId.CompareTo(other.SpriteId);
            if (ret == 0)
            {
                return other.GetExpiredTime().CompareTo(GetExpiredTime());
            }
            return ret;
        }

        public long GetExpiredTime()
        {
            DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1)); // 当地时区
            long timeStamp = (long)(DateTime.Now - startTime).TotalSeconds; // 相差毫秒数
            var dispareTime = GenTime + LifeTime;
            return dispareTime - timeStamp;
        }

        public long GetExpiredDate()
        {
            return GenTime + LifeTime;
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
    }
}
