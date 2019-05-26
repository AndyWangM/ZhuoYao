using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationAPI.Models
{
    public class SpriteConfig
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string[] FiveEle { get; set; }
        public string PrefabName { get; set; }
        public string ImgName { get; set; }
        public string BigImgPath { get; set; }
        public string SmallImgPath { get; set; }
        public int Level { get; set; }

        public string GetHeadImageUrl()
        {
            return "https://hy.gwgo.qq.com/sync/pet/" + SmallImgPath;
        }
    }
}
