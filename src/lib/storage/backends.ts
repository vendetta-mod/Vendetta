import { DCDFileManager, MMKVManager, StorageBackend } from "@types";
import { ReactNative as RN } from "@metro/hoist";

const MMKVManager = RN.NativeModules.MMKVManager as MMKVManager;
const DCDFileManager = RN.NativeModules.DCDFileManager as DCDFileManager;

const filePathFixer: (file: string) => string = RN.Platform.select({
    default: (f) => f,
    ios: (f) => `Documents/${f}`,
});

export const createMMKVBackend = (store: string): StorageBackend => ({
    get: async () => JSON.parse((await MMKVManager.getItem(store)) ?? "{}"),
    set: (data) => MMKVManager.setItem(store, JSON.stringify(data)),
});

export const createFileBackend = (file: string): StorageBackend => {
    let created: boolean;
    return {
        get: async () => {
            const path = `${DCDFileManager.getConstants().DocumentsDirPath}/${file}`;
            if (!created && !(await DCDFileManager.fileExists(path))) return (created = true), DCDFileManager.writeFile("documents", filePathFixer(file), "{}", "utf8");
            return JSON.parse(await DCDFileManager.readFile(path, "utf8"));
        },
        set: (data) => void DCDFileManager.writeFile("documents", filePathFixer(file), JSON.stringify(data), "utf8"),
    };
};