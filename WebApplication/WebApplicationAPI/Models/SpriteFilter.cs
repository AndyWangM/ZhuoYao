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
        // 稀有
        [JsonProperty("rare")]
        Rare = 0,
        // 巢穴
        [JsonProperty("den")]
        Den = 1,
        // 地域
        [JsonProperty("region")]
        Region = 2,
        // 鲲
        [JsonProperty("kun")]
        Kun = 3,
        // 黑白鬼
        [JsonProperty("ghost")]
        Ghost = 4,
        // 人生赢家
        [JsonProperty("winner")]
        Winner = 5,
        // 一觉
        [JsonProperty("once")]
        Once = 6,
        // 二觉
        [JsonProperty("twice")]
        Twice = 7,
        // 其他
        [JsonProperty("other")]
        Other = 90,
        [JsonProperty("null")]
        Null = 100
    }
}
