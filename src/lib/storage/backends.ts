import { DCDFileManager, MMKVManager, StorageBackend } from "@types";
import { ReactNative as RN } from "@lib/preinit";

const MMKVManager = window.nativeModuleProxy.MMKVManager as MMKVManager;
const DCDFileManager = window.nativeModuleProxy.DCDFileManager as DCDFileManager;

export const createMMKVBackend = (store: string): StorageBackend => ({
    get: async () => JSON.parse((await MMKVManager.getItem(store)) ?? "{}"),
    set: (data) => MMKVManager.setItem(store, JSON.stringify(data)),
});

export const createFileBackend = (file: string): StorageBackend => {
    // TODO: Creating this function in every file backend probably isn't ideal.
    const filePathFixer: (file: string) => string = RN.Platform.select({
        default: (f) => f,
        ios: (f) => `Documents/${f}`,
    });

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