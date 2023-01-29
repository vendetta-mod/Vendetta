import { Emitter, MMKVManager } from "@types";
import { ReactNative as RN } from "@metro/hoist";
import createEmitter from "./emitter";

const MMKVManager = RN.NativeModules.MMKVManager as MMKVManager;

const emitterSymbol = Symbol("emitter accessor");

export function createProxy(target: any = {}): { proxy: any, emitter: Emitter } {
  const emitter = createEmitter();

  function createProxy(target: any, path: string[]): any {
    return new Proxy(target, {
      get(target, prop: string) {
        if ((prop as unknown) === emitterSymbol)
          return emitter;

        const newPath = [...path, prop];
        const value: any = target[prop];

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

        return value;
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

export function useProxy<T>(storage: T): T {
  const emitter = (storage as any)[emitterSymbol] as Emitter;

  const [, forceUpdate] = React.useReducer((n) => ~n, 0);

  React.useEffect(() => {
    const listener = () => forceUpdate();

    emitter.on("SET", listener);
    emitter.on("DEL", listener);

    return () => {
      emitter.off("SET", listener);
      emitter.off("DEL", listener);
    }
  }, []);

  return storage;
}

export async function createStorage<T>(storeName: string): Promise<Awaited<T>> {
  const data = JSON.parse(await MMKVManager.getItem(storeName) ?? "{}");
  const { proxy, emitter } = createProxy(data);

  emitter.on("SET", () => MMKVManager.setItem(storeName, JSON.stringify(proxy)));

  return proxy;
}

export function wrapSync<T extends Promise<any>>(store: T): Awaited<T> {
    let awaited: any = undefined;
    store.then((v) => (awaited = v));
    return new Proxy({} as Awaited<T>, {
        get: (target, prop) => Reflect.get(awaited ?? target, prop),
        set: (target, prop, value) => Reflect.set(awaited ?? target, prop, value),
        has: (target, prop) => Reflect.has(awaited ?? target, prop),
    });
}
