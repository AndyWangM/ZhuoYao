namespace ZhuoYao {
    export interface IStorage {
        setItem(key:string, value: any);
        getItem(key:string): any;
        removeItem(key): void;
    }
}