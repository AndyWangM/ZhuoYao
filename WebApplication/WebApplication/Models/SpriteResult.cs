using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models
{

    public class SpriteResultData: CommonData
    {
        [JsonProperty("total_page")]
        public int TotalPage { get; set; }
        [JsonProperty("sprites")]
        public List<AliveSprite> Sprites { get; set; }
    }
}
