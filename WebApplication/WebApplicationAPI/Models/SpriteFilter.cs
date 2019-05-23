using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationAPI.Models
{
    public class SpriteFilter
    {
        [JsonProperty("sprite_id")]
        public int SpriteId { get; set; }
        [JsonProperty("sprite_type")]
        public SpriteType SpriteType { get; set; }
        [JsonProperty("sample_count")]
        public int SampleCount { get; set; }
        [JsonProperty("sample_total_count")]
        public int SampleTotalCount { get; set; }
    }

    public enum SpriteType
    {
        [JsonProperty("rare")]
        Rare = 0,
        [JsonProperty("den")]
        Den = 1,
        [JsonProperty("region")]
        Region = 2,
        [JsonProperty("kun")]
        Kun = 3,
        [JsonProperty("ghost")]
        Ghost = 4,
        [JsonProperty("other")]
        Other = 90,
        [JsonProperty("null")]
        Null = 100
    }
}
