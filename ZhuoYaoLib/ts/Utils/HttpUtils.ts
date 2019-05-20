namespace ZhuoYao {

    declare var wx;

    export class HttpUtils {

        public get(url: string, data?: Object, callback?, params?) {
            wx["request"]({
                "url": url,
                "data": data,
                "method": "GET",
                "success"(res) {
                    callback(res, params);
                    // console.log(res)
                },
                "failed"(res) {
                    console.log(res)
                }
            })
        }

        public post(url: string, data: Object) {
            wx["request"]({
                "url": url,
                "method": "POST",
                "data": data,
                "header": {
                    'content-type': 'application/json' // 默认值
                },
                "success"(res) {
                    // console.log(res)
                },
                "failed"(res) {
                    console.log(res)
                }
            })
        }
    }
    
}