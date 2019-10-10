using System;
using Newtonsoft.Json;

namespace StaticApplication.Models
{
    public class ThirdToken
    {
        [JsonProperty("errno")]
        public int ErrNo { get; set; }
        [JsonProperty("errmsg")]
        public string ErrMsg { get; set; }
        [JsonProperty("data")]
        public TokenModel Data { get; set; }
    }
}
