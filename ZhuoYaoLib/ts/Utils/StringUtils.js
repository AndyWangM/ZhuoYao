var ZhuoYao;
(function (ZhuoYao) {
    var StringUtils = /** @class */ (function () {
        function StringUtils() {
            this.I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
        }
        StringUtils.prototype.hash = function (input) {
            var hash = 5381;
            var i = input.length - 1;
            if (typeof input == 'string') {
                for (; i > -1; i--)
                    hash += (hash << 5) + input.charCodeAt(i);
            }
            else {
                for (; i > -1; i--)
                    hash += (hash << 5) + input[i];
            }
            var value = hash & 0x7FFFFFFF;
            var retValue = '';
            do {
                retValue += this.I64BIT_TABLE[value & 0x3F];
            } while (value >>= 6);
            return retValue;
        };
        StringUtils.prototype.utf8ByteToUnicodeStr = function (utf8Bytes) {
            var unicodeStr = "";
            for (var pos = 0; pos < utf8Bytes.length;) {
                var flag = utf8Bytes[pos];
                var unicode = 0;
                if ((flag >>> 7) === 0) {
                    unicodeStr += String.fromCharCode(utf8Bytes[pos]);
                    pos += 1;
                }
                else if ((flag & 0xFC) === 0xFC) {
                    unicode = (utf8Bytes[pos] & 0x3) << 30;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
                    unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
                    unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
                    unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 5] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 6;
                }
                else if ((flag & 0xF8) === 0xF8) {
                    unicode = (utf8Bytes[pos] & 0x7) << 24;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
                    unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
                    unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 4] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 5;
                }
                else if ((flag & 0xF0) === 0xF0) {
                    unicode = (utf8Bytes[pos] & 0xF) << 18;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
                    unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 3] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 4;
                }
                else if ((flag & 0xE0) === 0xE0) {
                    unicode = (utf8Bytes[pos] & 0x1F) << 12;
                    ;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 2] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 3;
                }
                else if ((flag & 0xC0) === 0xC0) { //110
                    unicode = (utf8Bytes[pos] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos + 1] & 0x3F);
                    unicodeStr += String.fromCharCode(unicode);
                    pos += 2;
                }
                else {
                    unicodeStr += String.fromCharCode(utf8Bytes[pos]);
                    pos += 1;
                }
            }
            return unicodeStr;
        };
        // 字符串转为Uint16Array，参数为字符串
        StringUtils.prototype.str2abUint16Array = function (str) {
            var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
            var bufView = new Uint16Array(buf);
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return bufView;
        };
        // 字符串转为ArrayBuffer，参数为字符串
        StringUtils.prototype.str2ab = function (str) {
            var uint16array = this.str2abUint16Array(JSON.stringify(str));
            var arrayLength = uint16array.length;
            var buf = new ArrayBuffer(4);
            new DataView(buf).setUint32(0, arrayLength);
            var uint8array = new Uint8Array(4 + arrayLength);
            uint8array.set(new Uint8Array(buf), 0);
            uint8array.set(uint16array, 4);
            // console.log(uint8array, uint8array.buffer, arrayLength)
            return uint8array.buffer;
        };
        return StringUtils;
    }());
    ZhuoYao.StringUtils = StringUtils;
})(ZhuoYao || (ZhuoYao = {}));
