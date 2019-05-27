using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplicationAPI.Redis
{
    public class RedisCache
    {
        //private readonly RedisClient _redisClient;
        private readonly IDatabase _redisDatabase;
        private readonly IServer _redisServer;

        public RedisCache(RedisClient redisClient, string configString)
        {
            _redisDatabase = redisClient.GetDatabase(configString);
            _redisServer = redisClient.GetServer(configString);
        }

        public async Task<RedisValue> StringGetAsync(string key)
        {
            return await _redisDatabase.StringGetAsync(key);
        }

        public async Task Add(string key, RedisValue value, long expiredTime = 0)
        {
            //var isKeyExists = await _redisDatabase.KeyExistsAsync(key);
            //if (!isKeyExists)
            //{
            if (expiredTime > 0)
            {
                await _redisDatabase.StringSetAsync(key, value, TimeSpan.FromSeconds(expiredTime));
            }
            else
            {
                await _redisDatabase.StringSetAsync(key, value);
            }
            //}

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
        public async Task<List<RedisKey>> GetKeys(string key)
        {
            var result = await _redisDatabase.ScriptEvaluateAsync(LuaScript.Prepare("return redis.call('KEYS',@keypattern)"), new { keypattern = key });
            var list = new List<RedisKey>((RedisKey[])result);
            return list;
        }

        public List<RedisKey> GetScanKeys(string key)
        {
            var result = _redisServer.Keys(_redisDatabase.Database, key);
            return result.ToList();
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
