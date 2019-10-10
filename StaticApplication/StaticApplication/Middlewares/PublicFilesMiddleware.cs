using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using StaticApplication.Models;
using StaticApplication.Utilities;

namespace StaticApplication.Middlewares
{

    public class PublicFilesMiddleware
    {
        private readonly RequestDelegate _next;

        public PublicFilesMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            if (httpContext.Request.Path.Equals("/accountInfo1.json"))
            {
                TokenModel token;
                try
                {
                    var result = HttpUtility.Get("http://gt.buxingxing.com/api/v1/token");
                    var thirdToken = JsonConvert.DeserializeObject<ThirdToken>(result);
                    token = thirdToken.Data;
                }
                catch (Exception e)
                {
                    token = null;
                }
                if (token == null || string.IsNullOrEmpty(token.OpenId) || string.IsNullOrEmpty(token.Token))
                {
                    token = null;
                }
                if (token != null)
                {
                    await httpContext.Response.WriteAsync(JsonConvert.SerializeObject(token));
                } else
                {
                    await _next(httpContext);
                }
            } else
            {
                await _next(httpContext);
            }
        }
    }

    public static class PublicFilesMiddlewareExtensions
    {
        public static IApplicationBuilder UsePublicFiles(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<PublicFilesMiddleware>();
        }
    }
}
