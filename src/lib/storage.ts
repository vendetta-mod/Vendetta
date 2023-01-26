import { Emitter, MMKVManager } from "@types";
import { ReactNative as RN } from "@metro/hoist";
import createEmitter from "./emitter";

const MMKVManager = RN.NativeModules.MMKVManager as MMKVManager;

function createProxy(target: any): { proxy: any, emitter: Emitter } {
  const emitter = createEmitter();

  function createProxy(target: any, path: string[]): any {
    return new Proxy(target, {
      get(target, prop: string) {
        const newPath = [...path, prop];
        const value = target[prop];

        if (value !== undefined && value !== null) {
          emitter.emit("GET", {
            path: newPath,
            value,
          });
          if (typeof value === "object") {
            return createProxy(value, newPath);
          }
          return value;
        }

        return createProxy((target[prop] = {}), newPath);
      },

      set(target, prop: string, value) {
        target[prop] = value;
        emitter.emit("SET", {
          path: [...path, prop],
          value
        });
        // we do not care about success, if this actually does fail we have other problems
        return true;
      },

      deleteProperty(target, prop: string) {
        const success = delete target[prop];
        if (success) emitter.emit("DEL", { 
          path: [...path, prop],
        });
        return success;
      },
    });
  }

  return {
    proxy: createProxy(target, []),
    emitter,
  }
}

export async function createStorage<T>(storeName: string): Promise<Awaited<T>> {
  const data = JSON.parse(await MMKVManager.getItem(storeName) ?? "{}");
  const { proxy, emitter } = createProxy(data);

  emitter.on("SET", () => MMKVManager.setItem(storeName, JSON.stringify(proxy)));

  return proxy;
}
