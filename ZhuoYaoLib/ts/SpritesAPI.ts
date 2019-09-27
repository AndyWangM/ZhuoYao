namespace ZhuoYao {
    declare var wx;

    export class SpritesAPI {
        private static url: string = "https://www.wangandi.com/";
        // private static url: string = "http://127.0.0.1:3585/";
        private static spriteConfigUrl: string = "https://www.wangandi.com/api/config/getSearchConfig";
        private static spriteFilterUrl: string = "https://www.wangandi.com/api/sprites/filter/get";
        private static configUrl: string = "http://www.wangandi.com/api/sprites/config";
        // private static spriteConfigUrl: string = "http://127.0.0.1:3585/api/config/getSearchConfig";
        private static getAPI: string = "api/sprites/get/"
        private static setAPI: string = "api/sprites/set/"
        private static httpUtils: HttpUtils = new HttpUtils();

        public static setSpriteList(obj: Object) {
            var that = this;
            var url = that.url + that.setAPI;
            this.httpUtils.post(url, obj);
        }

        public static getSpriteConfig(callback) {
            this.httpUtils.get(this.spriteConfigUrl, null, callback);
        }

        public static getSpriteFilter(callback) {
            this.httpUtils.get(this.spriteFilterUrl, null, callback);
        }

        public static getConfig(callback) {
            this.httpUtils.get(this.configUrl, null, callback);
        }

        public static get(id: string) {
            var that = this;
            var url = that.url + that.getAPI + id;
            this.httpUtils.get(url);
        }
    }
}