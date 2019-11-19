using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using StaticApplication.Models;

namespace StaticApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {

        [Route("set")]
        [HttpPost]
        public ActionResult<string> Post([FromBody]TokenModel value)
        {
            using(FileStream fileStream = new FileStream("./wwwroot/accountInfo1.json", FileMode.Create))
            {
                var str = JsonConvert.SerializeObject(value);
                byte[] info = new UTF8Encoding(true).GetBytes(str);
                fileStream.Write(info, 0, info.Length);
                return "a";
            }
        }

        [Route("delete")]
        [HttpGet]
        public ActionResult<string> Delete()
        {
            System.IO.File.Delete("./wwwroot/accountInfo1.json");
            return "a";
        }
    }
}
