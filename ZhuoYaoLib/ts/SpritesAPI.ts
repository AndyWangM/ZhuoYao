namespace ZhuoYao {
    declare var wx;

    export class SpritesAPI {
        private static url: string = "https://zhuoyao.wangandi.com/";
        private static getAPI: string = "api/sprites/get/"
        private static setAPI: string = "api/sprites/set/"

        public static post(obj: Object) {
            var that = this;
            var url = that.url + that.setAPI;
            wx["request"]({
                url: url,
                method: "POST",
                data: obj,
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    console.log(res)
                },
                failed(res) {
                    console.log(res)
                }
            })
        }

        public static get(id: string) {
            var that = this;
            var url = that.url + that.getAPI + id;
            wx["request"]({
                url: url,
                method: "GET",
                success(res) {
                    console.log(res)
                },
                failed(res) {
                    console.log(res)
                }
            })
        }
    }
}