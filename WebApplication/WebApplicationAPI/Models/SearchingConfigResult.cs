using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationAPI.Models
{
    public class SearchingConfigResult: CommonData
    {
        [JsonProperty("sprite_searching_config")]
        public List<SpriteSearchingConfig> SpriteSearchingConfigs { get; set; }
    }
}
