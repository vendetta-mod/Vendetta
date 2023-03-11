import { Indexable, Theme, ThemeData, DCDFileManager } from "@types";
import { createMMKVBackend, createStorage, wrapSync, awaitSyncWrapper, createFileBackend } from "@lib/storage";
import { after } from "@lib/patcher";
import { safeFetch } from "@utils";

const DCDFileManager = window.nativeModuleProxy.DCDFileManager as DCDFileManager;
export const themes = wrapSync(createStorage<Indexable<Theme>>(createMMKVBackend("VENDETTA_THEMES")));

async function writeTheme(data: ThemeData | {}, processedData: ThemeData<number> | {}) {
    if (typeof data !== "object" || typeof processedData !== "object") {
        throw new Error("Theme data must be an object of type ThemeData");
    }

    // Save the current theme data as vendetta_theme.json. When supported by loader,
    // this json will be written to window.__vendetta_theme.
    await createFileBackend("vendetta_theme.json").set(data);

    // Processed theme for native side
    await createFileBackend("vendetta_processed_theme.json").set(processedData);
}

// Process data for native side, and some compatiblity
function processData(data: ThemeData): ThemeData<number> {
    // entmy compat real ??
    data.colors ||= data.colours;
    data.theme_color_map.CHAT_BACKGROUND ||= data.theme_color_map.BACKGROUND_PRIMARY;

    data = JSON.parse(JSON.stringify(data));

    if (data.theme_color_map) {
        const themeColorMap = data.theme_color_map;

        for (const key in themeColorMap) {
            for (const index in themeColorMap[key]) {
                themeColorMap[key][index] = window.ReactNative.processColor(themeColorMap[key][index]);
            }
        }
    }

    if (data.colors) {
        for (const key in data.colors) {
            data.colors[key] = window.ReactNative.processColor(data.colors[key]);
        }
    }

    return data as unknown as ThemeData<number>;
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
        processedData: processData(themeJSON)
    };
}

export async function selectTheme(id: string) {
    if (id === "default") {
        await writeTheme({}, {});
        return;
    }

    await awaitSyncWrapper(themes);
    const selectedThemeId = Object.values(themes).find(i => i.selected)?.id;

    if (selectedThemeId) themes[selectedThemeId].selected = false;
    themes[id].selected = true;
    await writeTheme(themes[id].data, themes[id].processedData);
}

export function getCurrentThemeData(): ThemeData | null {
    return window[window.__vendetta_loader?.features?.themes?.prop ?? undefined!] || null
}

export async function initThemes(color: any) {
    //! Native code is required here!
    // Awaiting the sync wrapper is too slow, to the point where semanticColors are not correctly overwritten.
    // We need a workaround, and it will unfortunately have to be done on the native side.
    // await awaitSyncWrapper(themes);
    // const selectedThemeId = Object.values(themes).find(i => i.selected)?.id;
    // const selectedTheme = selectedThemeId ? themes[selectedThemeId] : undefined;

    const selectedTheme = getCurrentThemeData();
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