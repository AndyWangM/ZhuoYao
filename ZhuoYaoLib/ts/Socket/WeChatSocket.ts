/// <reference path="./ISocket.ts" />

namespace ZhuoYao {

    declare var wx;

    export class WeChatSocket implements ISocket {

        config: Config;
        serializer: Serializer;
        messageHandler: MessageHandler;

        constructor(config: Config) {
            this.config = config;
            this.config.serializer = config.serializer;
            this.messageHandler = new MessageHandler();
        }

        public url: 'wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0'

        public onOpen(msg: Object, callback: Function): void {
            console.log("open");
        }

        public onError(msg: Object, callback: Function): void {
            console.log("error");
        }

        public onClose(msg: Object, callback: Function): void {
            console.log("close");
        }

        public onMessage(msg: Object, callback: Function): void {
            this.messageHandler.post(msg);
        }
    }

}