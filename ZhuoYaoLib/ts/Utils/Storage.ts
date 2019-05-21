namespace ZhuoYao {
    declare var wx;

    export class Storage {
        public setItem(key: string, value: any) {
            wx["setStorage"]({
                key: key,
                data: value
            })
        }
        public getItem(key): any {
            return wx["getStorageSync"](key);

        }
        public deleteItem(key) {
            wx.removeStorageSync(key)
        }
    }
}