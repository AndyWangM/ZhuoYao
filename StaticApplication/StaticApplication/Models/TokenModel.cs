using System;
using Newtonsoft.Json;

namespace StaticApplication.Models
{
    public class TokenModel
    {
        [JsonProperty("token")]
        public string Token { get; set; }
        [JsonProperty("openid")]
        public string OpenId { get; set; }
    }
}
