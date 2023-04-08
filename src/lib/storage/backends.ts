import { StorageBackend } from "@types";
import { ReactNative as RN } from "@metro/common";
import { MMKVManager, FileManager } from "@lib/native";

export const createMMKVBackend = (store: string): StorageBackend => ({
    get: async () => JSON.parse((await MMKVManager.getItem(store)) ?? "{}"),
    set: (data) => MMKVManager.setItem(store, JSON.stringify(data)),
});

export const createFileBackend = (file: string): StorageBackend => {
    const filePathFixer: (file: string) => string = RN.Platform.select({
        default: (f) => f,
        ios: (f) => FileManager.saveFileToGallery ?  f : `Documents/${f}`,
    });

    let created: boolean;
    return {
        get: async () => {
            const path = `${FileManager.getConstants().DocumentsDirPath}/${file}`;
            if (!created && !(await FileManager.fileExists(path))) return (created = true), FileManager.writeFile("documents", filePathFixer(file), "{}", "utf8");
            return JSON.parse(await FileManager.readFile(path, "utf8"));
        },
        set: async (data) => void await FileManager.writeFile("documents", filePathFixer(file), JSON.stringify(data), "utf8"),
    };
};
