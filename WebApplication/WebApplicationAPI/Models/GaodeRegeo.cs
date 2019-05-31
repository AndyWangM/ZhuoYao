using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationAPI.Models
{
    public class GaodeRegeo
    {
        [JsonProperty("status")]
        public string Status { get; set; }
        [JsonProperty("regeocode")]
        public RegeoCode Regeocode { get; set; }
        [JsonProperty("info")]
        public string Info { get; set; }
        [JsonProperty("infocode")]
        public string InfoCode { get; set; }

    }

    public class RegeoCode
    {
        [JsonProperty("addressComponent")]
        public AddressComponent AddressComponent { get; set; }
        [JsonProperty("formatted_address")]
        public string Address { get; set; }
    }

    public class AddressComponent {
        [JsonProperty("country")]
        public string Country { get; set; }
        [JsonProperty("city")]
        public object City { get; set; }
        [JsonProperty("province")]
        public string Province { get; set; }
        //[JsonProperty("district")]
        //public string District { get; set; }
    }

}
