using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using WebApplicationAPI.Utils;

namespace WebApplicationAPI.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        //DistributedCache _distributedCache;
        IDistributedCache _distributedCache;
        public ValuesController(IDistributedCache distributedCache)
        {
            //_distributedCache = new DistributedCache(distributedCache);
            _distributedCache = distributedCache;
        }

        // GET api/values/5
        [HttpGet("get/{key}")]
        public string Get([FromRoute]string key)
        {
            //var value = _distributedCache.Get(key).ToString();
            var value = _distributedCache.GetString(key);
            return value;
        }

        [HttpGet("set/{key}/{value}")]
        public void Set([FromRoute]string key, [FromRoute]string value)
        {
            //_distributedCache.Add(key, value);
            _distributedCache.SetString(key, value);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
