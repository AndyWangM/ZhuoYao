namespace ZhuoYao {

    export interface ISocket {
        url: string;
        onOpen(msg: Object, callback: Function): void;
        onError(msg: Object, callback: Function): void;
        onClose(msg: Object, callback: Function): void;
        onMessage(msg: Object, callback: Function): void;
    }

}