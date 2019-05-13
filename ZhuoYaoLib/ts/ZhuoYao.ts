namespace ZhuoYao {
    export class ZhuoYao {
        socket: ISocket;
        storage: IStorage;
        config: SpriteConfig;

        constructor() {
            this.socket = new WeChatSocket();
            this.storage = new WeChatStorage();
        }
        
    }
}