using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebApplicationAPI.Models;
using WebApplicationAPI.Redis;
using static WebApplicationAPI.Models.RequestResult;

namespace WebApplicationAPI.Controllers
{
    [Route("api/[controller]")]
    public class SpritesController : Controller
    {
        private readonly SpriteCache _distributedCache;
        private readonly int _maxPageSize = 200;

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
        public async Task<IActionResult> Get([FromRoute]string key, [FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            try
            {
                var isValid = CheckValid();
                List<AliveSprite> result = new List<AliveSprite>();
                if (!string.IsNullOrEmpty(key))
                {
                    var keys = await _distributedCache.GetKeys(key + "_*");
                    if (keys.Count > 0)
                    {
                        if (pageSize > _maxPageSize)
                        {
                            pageSize = _maxPageSize;
                        }
                        int totalPage = (keys.Count + pageSize - 1) / pageSize;
                        keys = keys.Skip(currentPage * pageSize).Take(pageSize).ToList();
                        result = await GetData(keys, isValid);
                        return new OkObjectResult(SpriteDTO(totalPage, result));
                    }
                    else
                    {
                        return new OkObjectResult(new RequestResult() { ErrorCode = 1, Data = new CommonData() { Info = "当前暂无妖灵或该妖灵未入库" } });
                    }
                }
                return new OkObjectResult(new RequestResult() { ErrorCode = 1, Data = new CommonData() { Info = "请输入妖灵名称" } });
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll([FromQuery] int currentPage = 0, [FromQuery] int pageSize = 200)
        {
            try
            {
                var isValid = CheckValid(); List<AliveSprite> result = new List<AliveSprite>();
                var keys = await _distributedCache.GetKeys("*");
                if (keys.Count > 0)
                {
                    if (pageSize > _maxPageSize)
                    {
                        pageSize = _maxPageSize;
                    }
                    int totalPage = (keys.Count + pageSize - 1) / pageSize;
                    keys = keys.Skip(currentPage * pageSize).Take(pageSize).ToList();
                    result = await GetData(keys, isValid);
                    return new OkObjectResult(SpriteDTO(totalPage, result));
                }
                else
                {
                    return new OkObjectResult(new RequestResult() { ErrorCode = 1, Data = new CommonData() { Info = "当前暂无妖灵" } });
                }
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpPost("set")]
        public async Task<IActionResult> SetSprite([FromBody]AliveSprite[] sprites)
        {
            try
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
                return new OkObjectResult(new RequestResult() { ErrorCode = 0, Data = new CommonData() { Info = "插入成功" } });
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
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

        private RequestResult SpriteDTO(int totalPage, List<AliveSprite> sprites)
        {
            var data = new SpriteResultData()
            {
                Info = "Request sucess.",
                TotalPage = totalPage,
                Sprites = sprites
            };
            return new RequestResult()
            {
                ErrorCode = 0,
                Data = data
            };
        }

        private async Task<List<AliveSprite>> GetData(List<RedisValue> keys, bool isValid)
        {
            List<AliveSprite> result = new List<AliveSprite>();
            foreach (var key in keys)
            {
                var value = await _distributedCache.StringGetAsync(key.ToString());
                if (!string.IsNullOrEmpty(value))
                {
                    var str = value.ToString();
                    var aliveSprite = JsonConvert.DeserializeObject<AliveSprite>(str);
                    if (!isValid)
                    {
                        var random = new Random().Next(1, 100);
                        if (random <= 10)
                        {
                            continue;
                        }
                        aliveSprite.Latitude = aliveSprite.Latitude + (new Random().Next(100, 1000)) * 1000;
                        aliveSprite.Longitude = aliveSprite.Longitude + (new Random().Next(100, 1000)) * 1000;
                    }
                    result.Add(aliveSprite);
                }
            }
            result.Sort();
            return result;
        }
    }
}
