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
using WebApplicationAPI.Models;
using WebApplicationAPI.Redis;
using System.Text;
using Microsoft.Extensions.Logging;
using WebApplicationAPI.Serializer;

namespace WebApplicationAPI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger _logger;

        public HomeController(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<SpritesController>();
        }

        public IActionResult Index()
        {
            //var result = await GetAll();
            //ViewData["Result"] = JsonConvert.SerializeObject(result);
            return View();
        }

        public IActionResult Setting()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
