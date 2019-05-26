using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebApplicationAPI.Models;
using WebApplicationAPI.Redis;

namespace WebApplicationAPI.Controllers
{
    [Route("api/[controller]")]
    public class SpritesController : Controller
    {
        private readonly RedisCache _distributedCache;
        private readonly RedisCache _spriteConfigCache;
        private readonly RedisCache _spriteFilterCache;
        private readonly int _maxPageSize = 200;
        private static Dictionary<int, SpriteFilter> _spriteFilters = new Dictionary<int, SpriteFilter>();
        private static Dictionary<int, SpriteConfig> _spriteConfig = new Dictionary<int, SpriteConfig>();
        private readonly ILogger _logger;

        public SpritesController(IConfiguration config, ILoggerFactory loggerFactory)
        {
            RedisClient _redisClient = RedisClientSingleton.GetInstance(config);
            _distributedCache = new RedisCache(_redisClient, "Redis_Sprite");
            _spriteFilterCache = new RedisCache(_redisClient, "Redis_Sprite_Filter");
            _spriteConfigCache = new RedisCache(_redisClient, "Redis_Sprite_Config");
            _logger = loggerFactory.CreateLogger<SpritesController>();
            InitFilter().Wait(5000);
            InitConfig().Wait(5000);
        }

        [HttpGet()]
        public IActionResult GetEmpty()
        {
            _logger.Log(LogLevel.Warning, "start");
            return new OkObjectResult("Welcome");
        }

        [HttpGet("get/{key}")]
        public async Task<IActionResult> GetById([FromRoute]string key, [FromQuery] int currentPage = 0, [FromQuery] int pageSize = 200, [FromQuery] bool isWeb = false)
        {
            try
            {
                var isValid = CheckValid();
                List<AliveSprite> result = new List<AliveSprite>();
                if (!string.IsNullOrEmpty(key))
                {
                    //var keys = await _distributedCache.GetKeys(key + "_*");
                    var keys = _distributedCache.GetScanKeys("*" + key + "_*");
                    if (keys.Count > 0)
                    {
                        if (pageSize > _maxPageSize)
                        {
                            pageSize = _maxPageSize;
                        }
                        int totalPage = (keys.Count + pageSize - 1) / pageSize;
                        keys = keys.Skip(currentPage * pageSize).Take(pageSize).ToList();
                        result = await GetData(keys, isValid, isWeb);
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
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpGet("get/type/{spriteType}")]
        public async Task<IActionResult> GetByType([FromRoute]SpriteType spriteType, [FromQuery] int currentPage = 0, [FromQuery] int pageSize = 200, [FromQuery] bool isWeb = false)
        {
            try
            {
                var isValid = CheckValid();
                List<AliveSprite> result = new List<AliveSprite>();
                if (spriteType != null)
                {
                    //var keys = await _distributedCache.GetKeys(key + "_*");
                    var keys = _distributedCache.GetScanKeys("*" + spriteType + "_*");
                    if (keys.Count > 0)
                    {
                        if (pageSize > _maxPageSize)
                        {
                            pageSize = _maxPageSize;
                        }
                        int totalPage = (keys.Count + pageSize - 1) / pageSize;
                        keys = keys.Skip(currentPage * pageSize).Take(pageSize).ToList();
                        result = await GetData(keys, isValid, isWeb);
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
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll([FromQuery] int currentPage = 0, [FromQuery] int pageSize = 200, [FromQuery] bool isWeb = false)
        {
            try
            {
                var isValid = CheckValid();
                List<AliveSprite> result = new List<AliveSprite>();
                //var keys = await _distributedCache.GetKeys("*");
                var keys = _distributedCache.GetScanKeys("*");
                if (keys.Count > 0)
                {
                    if (pageSize > _maxPageSize)
                    {
                        pageSize = _maxPageSize;
                    }
                    int totalPage = (keys.Count + pageSize - 1) / pageSize;
                    keys = keys.Skip(currentPage * pageSize).Take(pageSize).ToList();
                    result = await GetData(keys, isValid, isWeb);
                    return new OkObjectResult(SpriteDTO(totalPage, result));
                }
                else
                {
                    return new OkObjectResult(new RequestResult() { ErrorCode = 1, Data = new CommonData() { Info = "当前暂无妖灵" } });
                }
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }
        [HttpPost("config/update")]
        public async Task<IActionResult> UpdateConfig([FromBody]List<SpriteConfig> spriteConfigs)
        {
            try
            {
                var isValid = CheckValid();
                if (isValid)
                {
                    foreach (var spriteConfig in spriteConfigs)
                    {
                        byte[] value = null;
                        var str = JsonConvert.SerializeObject(spriteConfig);
                        if (str != "")
                        {
                            value = Encoding.UTF8.GetBytes(str);
                        }
                        var key = spriteConfig.Id.ToString();
                        await _spriteConfigCache.Add(key, value);
                    }
                    await InitConfig();
                }
                return new OkObjectResult(new RequestResult() { ErrorCode = 0, Data = new CommonData() { Info = "插入成功" } });
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpGet("/config")]
        public async Task<IActionResult> GetConfig()
        {
            try
            {
                List<SpriteConfig> result = new List<SpriteConfig>();
                var isValid = CheckValid();
                var keys = await _spriteConfigCache.GetKeys("*");
                if (keys.Count > 0)
                {
                    foreach (var key in keys)
                    {
                        var value = await _spriteConfigCache.StringGetAsync(key.ToString());
                        if (!string.IsNullOrEmpty(value))
                        {
                            var str = value.ToString();
                            var spriteConfig = JsonConvert.DeserializeObject<SpriteConfig>(str);
                            result.Add(spriteConfig);
                        }
                    }
                    return new OkObjectResult(SpriteConfigDTO(result));
                }
                else
                {
                    return new OkObjectResult(new RequestResult() { ErrorCode = 1, Data = new CommonData() { Info = "当前暂无妖灵" } });
                }
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        private async Task InitFilter()
        {
            var keys = _spriteFilterCache.GetScanKeys("*");
            Dictionary<int, SpriteFilter> result = new Dictionary<int, SpriteFilter>();
            foreach (var key in keys)
            {
                var value = await _spriteFilterCache.StringGetAsync(key.ToString());
                if (!string.IsNullOrEmpty(value))
                {
                    var str = value.ToString();
                    var filter = JsonConvert.DeserializeObject<SpriteFilter>(str);
                    result[filter.SpriteId] = filter;
                }
            }
            _spriteFilters = result;
        }

        private async Task InitConfig()
        {
            var keys = _spriteConfigCache.GetScanKeys("*");
            Dictionary<int, SpriteConfig> result = new Dictionary<int, SpriteConfig>();
            foreach (var key in keys)
            {
                var value = await _spriteConfigCache.StringGetAsync(key.ToString());
                if (!string.IsNullOrEmpty(value))
                {
                    var str = value.ToString();
                    var config = JsonConvert.DeserializeObject<SpriteConfig>(str);
                    result[config.Id] = config;
                }
            }
            _spriteConfig = result;
        }

        [HttpPost("filter/update")]
        public async Task<IActionResult> UpdateFilter([FromBody]List<SpriteFilter> filters)
        {
            try
            {
                var isValid = CheckValid();
                if (isValid)
                {
                    foreach (var filter in filters)
                    {
                        byte[] value = null;
                        var str = JsonConvert.SerializeObject(filter);
                        if (str != "")
                        {
                            value = Encoding.UTF8.GetBytes(str);
                        }
                        var key = filter.SpriteId.ToString();
                        await _spriteFilterCache.Add(key, value);
                    }
                    await InitFilter();
                }
                return new OkObjectResult(new RequestResult() { ErrorCode = 0, Data = new CommonData() { Info = "插入成功" } });
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }


        [HttpPost("set")]
        public async Task<IActionResult> SetSprite([FromBody]List<AliveSprite> sprites)
        {
            try
            {
                var isValid = CheckValid();
                if (isValid)
                {
                    //var filter = new int[] { 2000238, 2000265, 2000106, 2000313, 2000268, 2000327 };
                    sprites = sprites.Where(x => _spriteFilters.ContainsKey(x.SpriteId)).ToList();
                    foreach (var sprite in sprites)
                    {
                        if (_spriteFilters.TryGetValue(sprite.SpriteId, out var filter))
                        {
                            var random = new Random().Next(0, filter.SampleTotalCount);
                            if (random <= filter.SampleCount)
                            {
                                byte[] value = null;
                                var str = JsonConvert.SerializeObject(sprite);
                                if (str != "")
                                {
                                    value = Encoding.UTF8.GetBytes(str);
                                }
                                var expiredTime = sprite.GetExpiredTime();
                                if (expiredTime > 0)
                                {
                                    var spriteType = filter.SpriteType.ToString() + "_";
                                    var key = spriteType + sprite.GetKey();
                                    await _distributedCache.Add(key, value, expiredTime);
                                }
                            }
                        }

                    }
                }
                return new OkObjectResult(new RequestResult() { ErrorCode = 0, Data = new CommonData() { Info = "插入成功" } });
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        public bool CheckValid()
        {
            var userAgent = HttpContext.Request.Headers[HeaderNames.UserAgent].FirstOrDefault().ToLower();
            var host = HttpContext.Request.Host.Value;
            var regex = new Regex("micromessenger");
            if (regex.Match(userAgent).Success)
            {
                return true;
            } 
            else if (host == "127.0.0.1:3585")
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

        private RequestResult SpriteConfigDTO(List<SpriteConfig> configs)
        {
            var data = new SpriteConfigResultData()
            {
                Info = "Request sucess.",
                Configs = configs
            };
            return new RequestResult()
            {
                ErrorCode = 0,
                Data = data
            };
        }

        private async Task<List<AliveSprite>> GetData(List<RedisKey> keys, bool isValid, bool isWeb)
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
                    if (isWeb)
                    {
                        _spriteConfig.TryGetValue(aliveSprite.SpriteId, out var config);
                        aliveSprite.SpriteConfig = config;
                    }
                    result.Add(aliveSprite);
                }
            }
            result.Sort();
            return result;
        }
    }
}
