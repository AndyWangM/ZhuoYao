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
}
