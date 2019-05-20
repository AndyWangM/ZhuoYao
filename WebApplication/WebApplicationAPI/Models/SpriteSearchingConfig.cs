using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationAPI.Models
{
    public class SpriteSearchingConfig
    {
        [JsonProperty("region")]
        public string Region { get; set; }
        [JsonProperty("latitude")]
        public long Latitude { get; set; }
        [JsonProperty("longitude")]
        public long Longitude { get; set; }
        [JsonProperty("xIndex")]
        public int XIndex { get; set; }
        [JsonProperty("yIndex")]
        public int YIndex { get; set; }

        public string GetKey()
        {
            return "search_config_" + Region;
        }
    }
}
