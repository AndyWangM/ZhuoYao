
namespace ZhuoYao {

    export class LocationTrans {
        static x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        static PI = 3.1415926535897932384626;
        static a = 6378245.0;
        static ee = 0.00669342162296594323;
        static coordinate = "GCJ02";
        // /**
        //  * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
        //  * 即 百度 转 谷歌、高德
        //  * @param bd_lon
        //  * @param bd_lat
        //  * @returns {*[]}
        //  */
        // public bd09togcj02(bd_lon, bd_lat) {
        //     var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        //     var x = bd_lon - 0.0065;
        //     var y = bd_lat - 0.006;
        //     var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        //     var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        //     var gg_lng = z * Math.cos(theta);
        //     var gg_lat = z * Math.sin(theta);
        //     return [gg_lng, gg_lat]
        // }

        /**
         * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
         * 即谷歌、高德 转 百度
         * @param lng
         * @param lat
         * @returns {*[]}
         */
        public static gcj02tobd09(lng, lat) {
            var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * this.x_PI);
            var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.x_PI);
            var bd_lng = z * Math.cos(theta) + 0.0065;
            var bd_lat = z * Math.sin(theta) + 0.006;
            return [bd_lng.toFixed(6), bd_lat.toFixed(6)]
        }

        // /**
        //  * WGS84转GCj02
        //  * @param lng
        //  * @param lat
        //  * @returns {*[]}
        //  */
        // public wgs84togcj02(lng, lat) {
        //     if (out_of_china(lng, lat)) {
        //         return [lng, lat]
        //     }
        //     else {
        //         var dlat = transformlat(lng - 105.0, lat - 35.0);
        //         var dlng = transformlng(lng - 105.0, lat - 35.0);
        //         var radlat = lat / 180.0 * PI;
        //         var magic = Math.sin(radlat);
        //         magic = 1 - ee * magic * magic;
        //         var sqrtmagic = Math.sqrt(magic);
        //         dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        //         dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        //         var mglat = lat + dlat;
        //         var mglng = lng + dlng;
        //         return [mglng, mglat]
        //     }
        // }

        /**
         * GCJ02 转换为 WGS84
         * @param lng
         * @param lat
         * @returns {*[]}
         */
        public static gcj02towgs84(lng, lat) {
            if (this.out_of_china(lng, lat)) {
                return [lng, lat]
            }
            else {
                var dlat = this.transformlat(lng - 105.0, lat - 35.0);
                var dlng = this.transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * this.PI;
                var magic = Math.sin(radlat);
                magic = 1 - this.ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
                dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
                var mglat = Number(lat) + dlat;
                var mglng = Number(lng) + dlng;
                return [(lng * 2 - mglng).toFixed(6), (lat * 2 - mglat).toFixed(6)]
            }
        }

        private static transformlat(lng, lat) {
            var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin(lat / 3.0 * this.PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(lat / 12.0 * this.PI) + 320 * Math.sin(lat * this.PI / 30.0)) * 2.0 / 3.0;
            return ret
        }

        private static transformlng(lng, lat) {
            var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin(lng / 3.0 * this.PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(lng / 12.0 * this.PI) + 300.0 * Math.sin(lng / 30.0 * this.PI)) * 2.0 / 3.0;
            return ret
        }

        /**
         * 判断是否在国内，不在国内则不做偏移
         * @param lng
         * @param lat
         * @returns {boolean}
         */
        private static out_of_china(lng, lat) {
            return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
        }
    }
}
