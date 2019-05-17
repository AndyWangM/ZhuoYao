using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WebApplicationAPI.Models;

namespace WebApplicationAPI.Redis
{
    public class SpriteCache
    {
        //private readonly RedisClient _redisClient;
        private readonly IDatabase _redisDatabase;
        //private readonly IServer _redisServer;

        public SpriteCache(RedisClient redisClient)
        {
            _redisDatabase = redisClient.GetDatabase("Redis_Sprite");
            //_redisServer = redisClient.GetServer("Redis_Sprite");
        }

        public async Task<List<AliveSprite>> Get(string key, bool isValid)
        {
            List<AliveSprite> result = new List<AliveSprite>();
            if (!string.IsNullOrEmpty(key))
            {
                var resultValues = await GetKeys(key + "_*");
                if (resultValues.Length > 0)
                {
                    foreach (var resultValue in resultValues)
                    {
                        var value = _redisDatabase.StringGet(resultValue.ToString()).ToString();
                        if (!string.IsNullOrEmpty(value))
                        {
                            var random = new Random().Next(1, 100);
                            if (random <= 10)
                            {
                                continue;
                            }
                            var aliveSprite = JsonConvert.DeserializeObject<AliveSprite>(value);
                            if (!isValid)
                            {
                                aliveSprite.Latitude = aliveSprite.Latitude + (new Random().Next(100, 1000)) * 1000;
                                aliveSprite.Longitude = aliveSprite.Longitude + (new Random().Next(100, 1000)) * 1000;
                            }
                            result.Add(aliveSprite);
                        }
                    }
                }
            }
            return result;
        }

        public async Task Add(AliveSprite sprite)
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
                //DistributedCacheEntryOptions options = new DistributedCacheEntryOptions();
                //options.AbsoluteExpiration = DateTime.Now.AddMinutes(60);
                //options.SlidingExpiration = TimeSpan.FromSeconds(expiredTime);
                var key = sprite.GetKey();
                await _redisDatabase.StringSetAsync(key, value, TimeSpan.FromSeconds(expiredTime));
                //_database.refre(key);
            }

        }

        /// <summary>
        /// 验证是否存在
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public bool Exists(string key)
        {
            bool ReturnBool = true;
            byte[] val = _redisDatabase.StringGet(key);
            if (val == null || val.Length == 0)
            {
                ReturnBool = false;
            }
            return ReturnBool;
        }

        //public RedisResult GetKeys(string pattern)
        //{
        //    var _server = _redisServer; //默认一个服务器
        //    var keys = _server.Keys(database: _redisDatabase.Database, pattern: pattern); //StackExchange.Redis 会根据redis版本决定用keys还是   scan(>2.8) 
        //    return null;
        //}

        //使用Keys *模糊匹配Key
        public async Task<RedisValue[]> GetKeys(string key)
        {
            var result = await _redisDatabase.ScriptEvaluateAsync(LuaScript.Prepare("return redis.call('KEYS',@keypattern)"), new { keypattern = key });
            return (RedisValue[])result;
        }

        ////使用SCAN模糊匹配Key
        //public RedisResult GetKeys(string key)
        //{
        //    var result = _redisDatabase.ScriptEvaluate(
        //        LuaScript.Prepare("local dbsize=redis.call('dbsize') local res=redis.call('scan',0,'match',KEYS[1],'count',dbsize) return res[2]"),
        //        new RedisKey[] { key });
        //    return result;
        //}
    }
}
