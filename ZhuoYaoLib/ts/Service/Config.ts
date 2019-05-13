namespace ZhuoYao {
    
    export class Config {
        spriteConfig: SpriteConfig;
        storage: IStorage;
        socket: ISocket;
        serializer: Serializer;

        constructor() {
            this.storage = new WeChatStorage();
            this.serializer = new Serializer();
        }
    }
}