import { Indexable, Theme, ThemeData, DCDFileManager } from "@types";
import { createMMKVBackend, createStorage, wrapSync, awaitSyncWrapper, createFileBackend } from "@lib/storage";
import { after } from "@lib/patcher";
import { safeFetch } from "@utils";

const DCDFileManager = window.nativeModuleProxy.DCDFileManager as DCDFileManager;
export const themes = wrapSync(createStorage<Indexable<Theme>>(createMMKVBackend("VENDETTA_THEMES")));

async function writeTheme(data: ThemeData) {
    if (typeof data !== "object") {
        throw new Error("Theme data must be an object of type ThemeData");
    }

    // Make an evalable string that will assign window.__vendetta_themes to the data
    // This string will be evaluated in the native side (loader), acts as a storage for themes
    const evalString = `window.__vendetta_themes=${JSON.stringify(data)}`;
    DCDFileManager.writeFile("documents", "vendetta_themes.js", evalString, "utf8");
}

export async function fetchTheme(id: string) {
    let themeJSON: ThemeData;

    try {
        themeJSON = await (await safeFetch(id, { cache: "no-store" })).json();
    } catch {
        throw new Error(`Failed to fetch theme at ${id}`);
    }

    themes[id] = {
        id: id,
        selected: false,
        data: themeJSON,
    };
}

export async function selectTheme(id: string) {
    const selectedThemeId = Object.values(themes).find(i => i.selected)?.id;

    if (selectedThemeId) themes[selectedThemeId].selected = false;
    themes[id].selected = true;
    await writeTheme(themes[id].data);
}

export async function initThemes(color: any) {
    //! Native code is required here!
    // Awaiting the sync wrapper is too slow, to the point where semanticColors are not correctly overwritten.
    // We need a workaround, and it will unfortunately have to be done on the native side.
    // await awaitSyncWrapper(themes);
    // const selectedThemeId = Object.values(themes).find(i => i.selected)?.id;
    // const selectedTheme = selectedThemeId ? themes[selectedThemeId] : undefined;

    const selectedTheme = window.__vendetta_themes as ThemeData | undefined;
    if (!selectedTheme) return;

    const keys = Object.keys(color.default.colors);
    const refs = Object.values(color.default.colors);
    const oldRaw = color.default.unsafe_rawColors;

    color.default.unsafe_rawColors = new Proxy(oldRaw, {
        get: (_, colorProp: string) => {
            if (!selectedTheme) return Reflect.get(oldRaw, colorProp);

            // damn britlanders
            const themeColors = (selectedTheme.colors ?? selectedTheme.colours)!;
            return themeColors?.[colorProp] ?? Reflect.get(oldRaw, colorProp);
        }
    });

    after("resolveSemanticColor", color.default.meta, (args, ret) => {
        if (!selectedTheme) return ret;

        const colorSymbol = args[1] ?? ret;
        const colorProp = keys[refs.indexOf(colorSymbol)];
        const themeIndex = args[0] === "dark" ? 0 : 1;
        return selectedTheme.theme_color_map?.[colorProp]?.[themeIndex] ?? ret;
    });
}