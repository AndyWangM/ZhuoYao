using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models
{
    public class AliveSpriteDesc: IComparable<AliveSprite>
    {
        public string SpriteId { get; set; }
        public string Name { get; set; }
        public string HeadImageUrl { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public int LeftTime { get; set; }

        public int CompareTo(AliveSprite other)
        {
            if (other == null)
            {
                return 1;
            }
            int ret = SpriteId.CompareTo(other.SpriteId);
            if (ret == 0)
            {
                return other.GetExpiredTime().CompareTo(LeftTime);
            }
            return ret;
        }
    }
}
