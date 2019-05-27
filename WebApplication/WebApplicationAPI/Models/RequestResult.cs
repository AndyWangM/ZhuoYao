using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationAPI.Models
{
    public class RequestResult
    {
        [JsonProperty("error_code")]
        public int ErrorCode { get; set; }
        [JsonProperty("data")]
        public CommonData Data { get; set; }
    }

    public class CommonData
    {
        [JsonProperty("info")]
        public string Info;
    }

    public class SpriteResultData : CommonData
    {
        [JsonProperty("total_page")]
        public int TotalPage { get; set; }
        [JsonProperty("sprites")]
        public List<AliveSprite> Sprites { get; set; }
    }

    public class SpriteConfigResultData : CommonData
    {
        [JsonProperty("configs")]
        public List<SpriteConfig> Configs { get; set; }
    }

    public class SpriteFilterResultData : CommonData
    {
        [JsonProperty("filters")]
        public Dictionary<int, SpriteFilter> Filters { get; set; }
    }
}
