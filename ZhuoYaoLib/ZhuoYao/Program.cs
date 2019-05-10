using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ZhuoYao
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var thread = new Thread(RunSocket);
            thread.Start();
            var str = "asdf";
            byte[] byteArray = System.Text.Encoding.Default.GetBytes(str);
            var a = BitConverter.ToUInt16(byteArray);
            Console.WriteLine(a);
            //CreateWebHostBuilder(args).Build().Run();

        }

        public static void RunSocket()
        {
            Socket socket;
            CancellationTokenSource cancellationTokenSource;
            socket = new Socket();
            cancellationTokenSource = new CancellationTokenSource();
            var completed = false;
            while (!completed)
            {
                try
                {
                    var task = socket.Connect(cancellationTokenSource);
                    task.Wait();
                    completed = true;
                }
                catch (Exception e)
                {
                    completed = false;
                    Thread.Sleep(500);

                }
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
