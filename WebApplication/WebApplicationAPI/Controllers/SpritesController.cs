using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using WebApplicationAPI.Models;
using WebApplicationAPI.Redis;

namespace WebApplicationAPI.Controllers
{
    [Route("api/[controller]")]
    public class SpritesController : Controller
    {
        //DistributedCache _distributedCache;
        SpriteCache _distributedCache;

        public SpritesController(IConfiguration config)
        {
            //_distributedCache = new DistributedCache(distributedCache);
            RedisClient _redisClient = RedisClientSingleton.GetInstance(config);
            _distributedCache = new SpriteCache(_redisClient);
        }


        [HttpGet()]
        public IActionResult GetEmpty()
        {
            return new OkObjectResult("Empty");
        }

        // GET api/values/5
        [HttpGet("get/{key}")]
        public IActionResult Get([FromRoute]string key)
        {
            //var value = _distributedCache.Get(key).ToString();
            var value = _distributedCache.Get(key);
            return new OkObjectResult(value);
        }

        //[HttpGet("set/{key}/{value}")]
        //public void Set([FromRoute]string key, [FromRoute]string value)
        //{
        //    //_distributedCache.Add(key, value);
        //    _distributedCache.SetString(key, value);
        //}

        [HttpPost("set")]
        public IActionResult SetSprite([FromBody]AliveSprite[] sprites)
        {
            var filter = new int[] { 2000238, 2000265, 2000106, 2000313, 2000268, 2000327 };
            sprites = sprites.Where(x => filter.Contains(x.SpriteId)).ToArray();
            foreach (var sprite in sprites)
            {
                _distributedCache.Add(sprite);
            }
            return new OkObjectResult("200");
        }

        //// POST api/values
        //[HttpPost]
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT api/values/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/values/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
