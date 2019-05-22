using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using StackExchange.Redis;
using WebApplication.Models;
using WebApplication.Redis;

namespace WebApplication.Controllers
{
    public class HomeController : Controller
    {
        private readonly SpriteCache _distributedCache;
        private readonly int _maxPageSize = 200;

        public HomeController(IConfiguration config)
        {
            RedisClient _redisClient = RedisClientSingleton.GetInstance(config);
            _distributedCache = new SpriteCache(_redisClient, "Redis_Sprite");
        }
        public async Task<IActionResult> Index()
        {
            var result = await GetAll();
            ViewData["Result"] = JsonConvert.SerializeObject(result);
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public async Task<List<AliveSprite>> GetAll(int currentPage = 0, int pageSize = 200)
        {
            List<AliveSprite> result = new List<AliveSprite>();
            try
            {
                var isValid = CheckValid();
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
                }
            }
            catch (Exception ex)
            {
                return result;
            }
            return result;
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
