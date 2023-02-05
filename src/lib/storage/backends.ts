import { DCDFileManager, MMKVManager, StorageBackend } from "@types";
import { ReactNative as RN } from "@metro/hoist";

const MMKVManager = RN.NativeModules.MMKVManager as MMKVManager;
const DCDFileManager = RN.NativeModules.DCDFileManager as DCDFileManager;

const filePathFixer: (file: string) => string = RN.Platform.select({
  default: (f) => f,
  ios: (f) => `Documents/${f}`,
});

export const createMMKVBackend = (store: string): StorageBackend => ({
  get: async function() {
    return JSON.parse((await MMKVManager.getItem(store)) ?? "{}");
  },
  set: (data) => MMKVManager.setItem(store, JSON.stringify(data)),
});

export const createFileBackend = (file: string): StorageBackend => ({
  get: async function() {
    return JSON.parse((await DCDFileManager.readFile(`${DCDFileManager.getConstants().DocumentsDirPath}/${file}`, "utf8")) ?? "{}");
  },
  set: (data) => void DCDFileManager.writeFile("documents", filePathFixer(file), JSON.stringify(data), "utf8"),
});
