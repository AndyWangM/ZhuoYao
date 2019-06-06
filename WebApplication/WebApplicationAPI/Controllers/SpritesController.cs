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
using WebApplicationAPI.Utils;

namespace WebApplicationAPI.Controllers
{
    [Route("api/[controller]")]
    public class SpritesController : Controller
    {
        private readonly Dictionary<int, string> GAODE_MAP_REGEO = new Dictionary<int, string>
        {
            {1, "https://restapi.amap.com/v3/geocode/regeo?key=abd14aafdd67e4f82e5314b26f0b912d&radius=0"},
            {2, "https://restapi.amap.com/v3/geocode/regeo?key=a5f595eed0b2b5486844cf1f685ddf6e&radius=0"},
            {3, "https://restapi.amap.com/v3/geocode/regeo?key=2b932c27ff7c7efcefd7feba59178f5b&radius=0"},
            {4, "https://restapi.amap.com/v3/geocode/regeo?key=44cc8e9f1184eeac0c1608c2979a56f4&radius=0"},
            {5, "https://restapi.amap.com/v3/geocode/regeo?key=adc000cb8cca58032eb095d4e91da624&radius=0"},
            {6, "https://restapi.amap.com/v3/geocode/regeo?key=e38826c62d7665de6cb72153a25d3d93&radius=0"},
            {7, "https://restapi.amap.com/v3/geocode/regeo?key=62a1dcc018621b39e7431e77d486e408&radius=0"},
            {8, "https://restapi.amap.com/v3/geocode/regeo?key=68d85c120415fe56b10e3cfc090c70f8&radius=0"},
            {9, "https://restapi.amap.com/v3/geocode/regeo?key=30bf8d67c8604ba04d012c61ecf09b76&radius=0"},
            {10, "https://restapi.amap.com/v3/geocode/regeo?key=83a35dd82f6180453e1df28052047b5c&radius=0"}
        };
        private readonly RedisCache _distributedCache;
        private readonly RedisCache _spriteConfigCache;
        private readonly RedisCache _spriteFilterCache;
        private readonly RedisCache _spriteKeyCache;
        private readonly int _maxPageSize = 200;
        private readonly ILogger _logger;
        private static Dictionary<int, SpriteFilter> _spriteFilters = new Dictionary<int, SpriteFilter>();
        private static Dictionary<int, SpriteConfig> _spriteConfig = new Dictionary<int, SpriteConfig>();

        public SpritesController(IConfiguration config, ILoggerFactory loggerFactory)
        {
            RedisClient _redisClient = RedisClientSingleton.GetInstance(config);
            _distributedCache = new RedisCache(_redisClient, "Redis_Sprite");
            _spriteFilterCache = new RedisCache(_redisClient, "Redis_Sprite_Filter");
            _spriteConfigCache = new RedisCache(_redisClient, "Redis_Sprite_Config");
            _spriteKeyCache = new RedisCache(_redisClient, "Redis_Sprite_Key");
            _logger = loggerFactory.CreateLogger<SpritesController>();
            InitFilter().Wait();
            InitConfig().Wait();
        }

        [HttpGet()]
        public IActionResult GetEmpty()
        {
            _logger.Log(LogLevel.Warning, "start");
            return new OkObjectResult("Welcome");
        }

        [HttpGet("get/{key}")]
        public async Task<IActionResult> GetById([FromRoute]string key,
            [FromQuery] string province = null, [FromQuery] string city = null,
            [FromQuery] int currentPage = 0, [FromQuery] int pageSize = 200)
        {
            try
            {
                var isValid = CheckValid();
                List<AliveSprite> result = new List<AliveSprite>();
                if (!string.IsNullOrEmpty(key))
                {
                    var pattern = "*" + key + "_*";
                    if (!string.IsNullOrEmpty(province))
                    {
                        pattern = pattern + MD5Helper.EncryptString(province) + "_";
                    }
                    else
                    {
                        pattern = pattern + "*_";
                    }
                    if (!string.IsNullOrEmpty(city))
                    {
                        pattern = pattern + MD5Helper.EncryptString(city) + "_";
                    }
                    pattern = pattern + "*";
                    var keys = await _distributedCache.GetKeys(pattern);
                    //var keys = _distributedCache.GetScanKeys("*" + key + "_*");
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
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpGet("get/type/{spriteType}")]
        public async Task<IActionResult> GetByType([FromRoute]SpriteType spriteType, 
            [FromQuery] string province = null, [FromQuery] string city = null, 
            [FromQuery] int currentPage = 0, [FromQuery] int pageSize = 200)
        {
            try
            {
                var isValid = CheckValid();
                List<AliveSprite> result = new List<AliveSprite>();
                if (!string.IsNullOrEmpty(spriteType.ToString()))
                {
                    var pattern = spriteType + "_*_";
                    if (!string.IsNullOrEmpty(province))
                    {
                        pattern = pattern + MD5Helper.EncryptString(province) + "_";
                    }
                    else
                    {
                        pattern = pattern + "*_";
                    }
                    if (!string.IsNullOrEmpty(city))
                    {
                        pattern = pattern + MD5Helper.EncryptString(city) + "_";
                    }
                    pattern = pattern + "*";
                    var keys = await _distributedCache.GetKeys(pattern);
                    //var keys = _distributedCache.GetScanKeys("*" + spriteType + "_*");
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
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll([FromQuery] int currentPage = 0, [FromQuery] int pageSize = 200)
        {
            try
            {
                var isValid = CheckValid();
                List<AliveSprite> result = new List<AliveSprite>();
                var keys = await _distributedCache.GetKeys("*");
                //var keys = _distributedCache.GetScanKeys("*");
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

        [HttpGet("config")]
        public async Task<IActionResult> GetConfig()
        {
            try
            {
                List<SpriteConfig> result = new List<SpriteConfig>();
                var isValid = CheckValid();
                var keys = await _spriteConfigCache.GetKeys("*");
                //var keys = _spriteConfigCache.GetScanKeys("*");
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
                    return new OkObjectResult(new RequestResult() { ErrorCode = 1, Data = new CommonData() { Info = "当前暂无配置" } });
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
            //var keys = _spriteFilterCache.GetScanKeys("*");
            var keys = await _spriteFilterCache.GetKeys("*");
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
            //var keys = _spriteFilterCache.GetScanKeys("*");
            var keys = await _spriteFilterCache.GetKeys("*");
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
                return new OkObjectResult(new RequestResult() { ErrorCode = 0, Data = new CommonData() { Info = "更新成功" } });
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpGet("filter/get")]
        public async Task<IActionResult> GetFilter()
        {
            try
            {
                if (_spriteFilters.Keys.Count == 0)
                {
                    await InitFilter();
                }
                return new OkObjectResult(SpritFilterDTO(_spriteFilters));
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
                    var filterSprites = sprites.Where(x => _spriteFilters.ContainsKey(x.SpriteId));
                    if (filterSprites.Any())
                    {
                        sprites = filterSprites.ToList();
                        GaodeRegeo gaodeRegeo = null;
                        foreach (var sprite in sprites)
                        {
                            if (_spriteFilters.TryGetValue(sprite.SpriteId, out var filter))
                            {
                                var random = new Random().Next(0, filter.SampleTotalCount);
                                if (random <= filter.SampleCount)
                                {
                                    var spriteType = filter.SpriteType.ToString() + "_";
                                    var spriteKey = sprite.GetSpriteKey();
                                    if (!_spriteKeyCache.KeyExists(spriteKey).Result)
                                    {
                                        _spriteConfig.TryGetValue(sprite.SpriteId, out var config);
                                        sprite.Name = config.Name;
                                        sprite.HeadImage = config.SmallImgPath;
                                        sprite.Level = config.Level;

                                        var expiredTime = sprite.GetExpiredTime();
                                        if (expiredTime > 0)
                                        {
                                            var randomRegeoIndex = new Random().Next(1, GAODE_MAP_REGEO.Keys.Count + 1);
                                            if (gaodeRegeo == null)
                                            {
                                                GAODE_MAP_REGEO.TryGetValue(randomRegeoIndex, out var regeoUrl);
                                                var location = "location=" + sprite.Longitude / 1000000 + "," + sprite.Latitude / 1000000;
                                                var url = string.Join("&", regeoUrl, location);
                                                var res = await HttpRequestHelper.HttpGetRequestAsync(url);
                                                gaodeRegeo = JsonConvert.DeserializeObject<GaodeRegeo>(res);
                                            }
                                            if (gaodeRegeo.InfoCode == "10000")
                                            {
                                                sprite.Province = gaodeRegeo.Regeocode.AddressComponent.Province;
                                                sprite.City = gaodeRegeo.Regeocode.AddressComponent.City as string;
                                            }
                                            else
                                            {
                                                _logger.Log(LogLevel.Error, "geo_error with code: " + gaodeRegeo.InfoCode);
                                            }
                                            byte[] value = null;
                                            var str = JsonConvert.SerializeObject(sprite);
                                            if (str != "")
                                            {
                                                value = Encoding.UTF8.GetBytes(str);
                                            }
                                            var spriteLocationKey = spriteType + sprite.GetLocationKey();
                                            await _spriteKeyCache.Add(spriteKey, "", expiredTime);
                                            await _distributedCache.Add(spriteLocationKey, value, expiredTime);
                                        }
                                    }
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
            var cookies = HttpContext.Request.Cookies;
            var regex = new Regex("micromessenger");
            if (regex.Match(userAgent).Success)
            {
                return true;
            }
            else if (cookies.ContainsKey("config"))
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

        private RequestResult SpritFilterDTO(Dictionary<int, SpriteFilter> filters)
        {
            var data = new SpriteFilterResultData()
            {
                Info = "Request sucess.",
                Filters = filters
            };
            return new RequestResult()
            {
                ErrorCode = 0,
                Data = data
            };
        }

        private async Task<List<AliveSprite>> GetData(List<RedisKey> keys, bool isValid)
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
