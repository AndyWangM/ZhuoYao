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
        [JsonProperty("city")]
        public string City { get; set; }
        [JsonProperty("province")]
        public string Province { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("headimage")]
        public string HeadImage { get; set; }
        [JsonProperty("level")]
        public int Level { get; set; }

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

        public string GetSpriteHash()
        {
            var str = "" + SpriteId + GenTime + LifeTime + Latitude + Longitude;
            return Utils.MD5Helper.EncryptString(str);
        }

        public string GetLocationHash()
        {
            if (string.IsNullOrEmpty(Province))
            {
                return "unknown";
            }
            var provinceHash = Utils.MD5Helper.EncryptString(Province);
            if (!string.IsNullOrEmpty(City))
            {
                var cityHash = Utils.MD5Helper.EncryptString(City);
                return provinceHash + "_" + cityHash;
            }
            else
            {
                return provinceHash;
            }
        }

        public string GetSpriteKey()
        {
            return SpriteId + "_" + GetSpriteHash();
        }

        public string GetLocationKey()
        {
            var locationHash = GetLocationHash();
            var spriteHash = GetSpriteHash();
            return SpriteId + "_" + locationHash + "_" + spriteHash;
        }
    }
}
