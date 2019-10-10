using System;
using System.IO;
using System.Net;
using System.Text;
using Newtonsoft.Json;

namespace StaticApplication.Utilities
{
    /// <summary>
    ///HttpRequest 的摘要说明
    /// </summary>
    public class HttpUtility
    {
        public static string Post(string Url, string postDataStr, string cookies)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "POST";
            if (cookies != null)
                request.Headers.Add("Cookie", cookies);
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = postDataStr.Length;
            StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.ASCII);
            writer.Write(postDataStr);
            writer.Close();
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            string encoding = response.ContentEncoding;
            if (encoding == null || encoding.Length < 1)
            {
                encoding = "UTF-8"; //默认编码  
            }
            StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.GetEncoding(encoding));
            string retString = reader.ReadToEnd();
            return retString;
        }

        public static string Get(string Url, string cookies = null)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "GET";
            request.Timeout = 5000;
            request.UserAgent = "Dalvik/2.1.0 (Linux; U; Android 9; HWI-AL00 Build/HUAWEIHWI-AL00)";
            if (cookies != null)
                request.Headers.Add("Cookie", cookies);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            string encoding = response.ContentEncoding;
            if (encoding == null || encoding.Length < 1)
            {
                encoding = "UTF-8"; //默认编码  
            }
            StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.GetEncoding(encoding));
            string retString = reader.ReadToEnd();
            return retString;
        }
    }
}
