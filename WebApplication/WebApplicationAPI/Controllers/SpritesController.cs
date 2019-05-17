using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebApplicationAPI.Models;
using WebApplicationAPI.Redis;

namespace WebApplicationAPI.Controllers
{
    [Route("api/[controller]")]
    public class SpritesController : Controller
    {
        private readonly SpriteCache _distributedCache;

        public SpritesController(IConfiguration config)
        {
            RedisClient _redisClient = RedisClientSingleton.GetInstance(config);
            _distributedCache = new SpriteCache(_redisClient);
        }

        [HttpGet()]
        public IActionResult GetEmpty()
        {
            return new OkObjectResult("Welcome");
        }

        [HttpGet("get/{key}")]
        public async Task<IActionResult> Get([FromRoute]string key)
        {
            var isValid = CheckValid();
            var value = await _distributedCache.Get(key, isValid);
            return new OkObjectResult(value);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            var isValid = CheckValid();
            var value = await _distributedCache.Get("*", isValid);
            return new OkObjectResult(value);
        }

        [HttpPost("set")]
        public async Task<IActionResult> SetSprite([FromBody]AliveSprite[] sprites)
        {
            var isValid = CheckValid();
            if (isValid)
            {
                var filter = new int[] { 2000238, 2000265, 2000106, 2000313, 2000268, 2000327 };
                sprites = sprites.Where(x => filter.Contains(x.SpriteId)).ToArray();
                foreach (var sprite in sprites)
                {
                    await _distributedCache.Add(sprite);
                }
            }
            return new OkObjectResult("ok");
        }

        public bool CheckValid()
        {
            var userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].FirstOrDefault().ToLower();
            var regex = new Regex("micromessenger");
            if (regex.Match(userAgent).Success)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
