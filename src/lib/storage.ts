import { Indexable, MMKVManager } from "@types";
import { ReactNative as RN } from "@metro/hoist";

// Discord's custom special storage sauce
const MMKVManager = RN.NativeModules.MMKVManager as MMKVManager;

// TODO: React hook?
// TODO: Clean up types, if necessary
export default function createStorage<T>(storeName: string, onRestore?: (parsed: T) => void): T {
    const internalStore: Indexable<any> = {};

    const proxyValidator = {
        get(target: object, key: string | symbol): any {
            const orig = Reflect.get(target, key);
    
            if (typeof orig === "object" && orig !== null) {
                return new Proxy(orig, proxyValidator);
            } else {
                return orig;
            }
        },
    
        set(target: object, key: string | symbol, value: any) {
            Reflect.set(target, key, value);
            MMKVManager.setItem(storeName, JSON.stringify(internalStore));
            return true;
        },
    
        deleteProperty(target: object, key: string | symbol) {
            Reflect.deleteProperty(target, key);
            MMKVManager.setItem(storeName, JSON.stringify(internalStore));
            return true;
        }
    }

    MMKVManager.getItem(storeName).then(async function (v) {
        if (!v) return;
        const parsed: T & Indexable<any> = JSON.parse(v);

        if (onRestore && typeof onRestore === "function") {
            onRestore(parsed);
        } else {
            for (let p of Object.keys(parsed)) internalStore[p] = parsed[p];
        }
    })

    return new Proxy(internalStore, proxyValidator) as T;
}
