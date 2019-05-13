namespace ZhuoYao {

    declare var wx;

    export class WeChatStorage implements IStorage{
        setItem(key: string, value: any): any {
            wx["setStorage"]({
                key: key,
                data: value
            });
        }       
        getItem(key: string): any {
            return wx["getStorageSync"](key);
        }
        removeItem(key: any): void {
            wx["removeStorageSync"](key);
        }

    }
}