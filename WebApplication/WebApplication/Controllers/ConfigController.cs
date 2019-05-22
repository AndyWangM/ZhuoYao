using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebApplication.Models;
using WebApplication.Redis;


namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class ConfigController : Controller
    {
        private readonly SpriteCache _distributedCache;

        public ConfigController(IConfiguration config)
        {
            RedisClient _redisClient = RedisClientSingleton.GetInstance(config);
            _distributedCache = new SpriteCache(_redisClient, "Redis_Config");
        }

        [HttpPost("setSearchConfig")]
        public async Task<IActionResult> GetAllSpriteSearchingConfig([FromBody] SpriteSearchingConfig[] configs)
        {
            try
            {
                var isValid = CheckValid();
                if (isValid)
                {
                    foreach (var config in configs)
                    {
                        byte[] value = null;
                        var str = JsonConvert.SerializeObject(config);
                        if (str != "")
                        {
                            value = Encoding.UTF8.GetBytes(str);
                        }
                        var key = config.GetKey();
                        await _distributedCache.Add(key, value);
                    }
                }
                return new OkObjectResult(new RequestResult() { ErrorCode = 0, Data = new CommonData() { Info = "插入成功" } });
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpGet("getSearchConfig")]
        public async Task<IActionResult> GetSpriteSearchingConfig()
        {
            try
            {
                List<SpriteSearchingConfig> result = new List<SpriteSearchingConfig>();
                var isValid = CheckValid();
                if (isValid)
                {
                    var keys = await _distributedCache.GetKeys("search_config_*");
                    var random = new Random().Next(0, keys.Count);
                    var value = await _distributedCache.StringGetAsync(keys[random].ToString());
                    if (!string.IsNullOrEmpty(value))
                    {
                        var config = JsonConvert.DeserializeObject<SpriteSearchingConfig>(value.ToString());
                        result.Add(config);
                    }
                }
                return new OkObjectResult(SearchingConfigDTO(result));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        [HttpGet("getAllSearchConfig")]
        public async Task<IActionResult> GetAllSpriteSearchingConfig()
        {
            try
            {
                List<SpriteSearchingConfig> result = new List<SpriteSearchingConfig>();
                var isValid = CheckValid();
                if (isValid)
                {
                    var keys = await _distributedCache.GetKeys("search_config_*");
                    foreach (var key in keys)
                    {
                        var value = await _distributedCache.StringGetAsync(key.ToString());
                        if (!string.IsNullOrEmpty(value))
                        {
                            var config = JsonConvert.DeserializeObject<SpriteSearchingConfig>(value.ToString());
                            result.Add(config);
                        }
                    }
                }
                return new OkObjectResult(SearchingConfigDTO(result));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new RequestResult() { ErrorCode = 3, Data = new CommonData() { Info = "服务器错误，请稍后再试" } });
            }
        }

        private RequestResult SearchingConfigDTO(List<SpriteSearchingConfig> configs)
        {
            var data = new SearchingConfigResult()
            {
                Info = "请求成功",
                SpriteSearchingConfigs = configs
            };
            return new RequestResult()
            {
                ErrorCode = 0,
                Data = data
            };
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
