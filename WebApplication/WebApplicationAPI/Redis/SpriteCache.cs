using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using WebApplicationAPI.Models;

namespace WebApplicationAPI.Redis
{
    public class SpriteCache
    {
        RedisClient _redisClient;
        IDatabase _redisDatabase;
        IServer _redisServer;

        public SpriteCache(RedisClient redisClient)
        {
            _redisClient = redisClient;
            _redisDatabase = redisClient.GetDatabase("Redis_Sprite");
            _redisServer = redisClient.GetServer("Redis_Sprite");
        }

        public List<AliveSprite> Get(string key)
        {
            List<AliveSprite> result = new List<AliveSprite>();
            if (!string.IsNullOrEmpty(key))
            {
                var resultValues = GetKeys(key + "_*");
                if (resultValues.Length > 0)
                {
                    foreach(var resultValue in resultValues)
                    {
                        var value = _redisDatabase.StringGet(resultValue.ToString()).ToString();
                        if (!string.IsNullOrEmpty(value))
                        {
                            var aliveSprite = JsonConvert.DeserializeObject<AliveSprite>(value);
                            result.Add(aliveSprite);
                        }
                    }
                }
            }
            return result;
        }

        //public List<AliveSprite> GetAll()
        //{
        //    List<AliveSprite> result = new List<AliveSprite>();
        //    _redisDatabase.ge
        //        var resultValues = GetKeys(key + "_*");
        //        if (resultValues.Length > 0)
        //        {
        //            foreach (var resultValue in resultValues)
        //            {
        //                var value = _redisDatabase.StringGet(resultValue.ToString()).ToString();
        //                if (!string.IsNullOrEmpty(value))
        //                {
        //                    var aliveSprite = JsonConvert.DeserializeObject<AliveSprite>(value);
        //                    result.Add(aliveSprite);
        //                }
        //            }
        //        }
        //    return result;
        //}

        public void Add(AliveSprite sprite)
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
                _redisDatabase.StringSet(key, value, TimeSpan.FromSeconds(expiredTime));
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
        public RedisValue[] GetKeys(string key)
        {
            var result = _redisDatabase.ScriptEvaluateAsync(LuaScript.Prepare("return redis.call('KEYS',@keypattern)"), new { keypattern = key });
            result.Wait();
            return (RedisValue[])result.Result;
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
