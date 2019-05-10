using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace ZhuoYao
{
    class Socket
    {
        const int bufferSize = 1024 * 4;

        string webSocketUri = @"wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0";

        public Socket() {
            //Init();
        }

        public void Init()
        {
            Task doJob;
            using (var cts = new CancellationTokenSource())
            {
                var token = cts.Token;

                doJob = Task.Run(async () => {
                    try
                    {
                        await Connect(cts).ConfigureAwait(false);
                    }
                    catch (OperationCanceledException)
                    {
                        //do nothing
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine(ex);
                    }
                });

                doJob.ContinueWith((_) => {
                    Console.WriteLine("Press any key to exit.");
                });

                var stopKey = ConsoleKey.A;
                Console.WriteLine("press \"" + stopKey + "\" to exit.");
                while (!IsKeyPressed(stopKey))
                {
                    //loop 
                    Thread.Sleep(new TimeSpan(0, 0, 1));
                }
                cts.Cancel();
            }
            if (doJob != null)
            {
                Console.WriteLine("Ending program...");
                doJob.Wait();
                Console.ReadKey();
            }
        }

        public async Task Connect(CancellationTokenSource tokenSource)
        {

            using (var webSocket = new ClientWebSocket())
            {
                try
                {

                    await webSocket.ConnectAsync(new Uri(webSocketUri), tokenSource.Token);

                    var sendTask = Task.Run(async () => {
                        await Send(webSocket, new TimeSpan(0, 0, 1), tokenSource.Token);
                    }, tokenSource.Token);

                    var recvTask = Task.Run(async () => {
                        await Receive(webSocket, tokenSource.Token);
                    }, tokenSource.Token);

                    await Task.WhenAll(sendTask, recvTask).ConfigureAwait(false);
                }
                finally
                {
                    if (webSocket.State != WebSocketState.Aborted &&
                        webSocket.State != WebSocketState.Closed)
                    {
                        Console.WriteLine("closing connection...");
                        await Task.WhenAny(
                            webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "client initiate closing", CancellationToken.None),
                            Task.Delay(new TimeSpan(0, 1, 0)));
                    }
                }
            }
        }

        //send string periodically
        public async Task Send(ClientWebSocket webSocket, TimeSpan period, CancellationToken token)
        {
            while (webSocket.State == WebSocketState.Open)
            {
                if (token.IsCancellationRequested)
                {
                    Console.WriteLine("stop sending...");
                    token.ThrowIfCancellationRequested();
                }

                string sendStr = @"hello ClientWebSocket!";
                try
                {
                    var sendBuffer = StringToByteArray(sendStr);
                    var sendTask = webSocket.SendAsync(new ArraySegment<byte>(sendBuffer), WebSocketMessageType.Text, true, CancellationToken.None);
                    var awaitResult = await Task.WhenAny(
                        sendTask,
                        Task.Delay(new TimeSpan(0, 1, 0), token)
                    );
                    if (awaitResult != sendTask)
                    {
                        Console.WriteLine($"send {sendStr} failed.");
                    }
                }
                catch (OperationCanceledException)
                {
                    Console.WriteLine("cancel current sending operation...");
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine(ex);
                }
                await Task.Delay(period);
            }
        }

        async Task Receive(ClientWebSocket webSocket, CancellationToken token)
        {
            while (webSocket.State == WebSocketState.Open)
            {
                if (token.IsCancellationRequested)
                {
                    Console.WriteLine("stop receiving...");
                    token.ThrowIfCancellationRequested();
                }

                try
                {
                    var recvBuffer = new byte[bufferSize];
                    var receiveTask = webSocket.ReceiveAsync(new ArraySegment<byte>(recvBuffer), CancellationToken.None);
                    var resultResult = await Task.WhenAny(
                        receiveTask,
                        Task.Delay(new TimeSpan(0, 1, 0), token));

                    if (resultResult == receiveTask)
                    {
                        #region Remote Initiated Closing
                        if (receiveTask.Result.MessageType == WebSocketMessageType.Close)
                        {

                            Console.WriteLine("receive close connection request");
                            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "server initiate closing", token);
                            break;

                        }
                        #endregion

                        Console.WriteLine("Receive: " + GetReadableString(recvBuffer));
                    }
                }
                catch (OperationCanceledException)
                {
                    Console.WriteLine("cancel current receiving operation...");
                    //await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure,"client shutdown", CancellationToken.None);
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine(ex);
                }
            }
        }

        #region Util functions

        Task CreateLongRunningTask(Func<Task> worker, CancellationToken token)
        {
            var task = Task.Factory.StartNew(
                function: worker,
                cancellationToken: token,
                creationOptions: TaskCreationOptions.LongRunning,
                scheduler: TaskScheduler.Default
            );
            return task.Unwrap();
        }

        static byte[] StringToByteArray(string input)
        {
            return System.Text.Encoding.Default.GetBytes(input);
        }

        static string GetReadableString(byte[] buffer)
        {
            var nullStart = Array.IndexOf(buffer, (byte)0);
            nullStart = (nullStart == -1) ? buffer.Length : nullStart;
            return System.Text.Encoding.Default.GetString(buffer, 0, nullStart);
        }

        static bool IsKeyPressed(ConsoleKey kbKey)
        {
            if (Console.KeyAvailable)
            {
                if (Console.ReadKey(true).Key == kbKey)
                {
                    return true;
                }
            }
            return false;
        }

        #endregion
    }
}
