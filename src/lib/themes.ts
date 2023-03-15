import { after } from "@lib/patcher";
import { createFileBackend, createMMKVBackend, createStorage, wrapSync, awaitSyncWrapper } from "@lib/storage";
import { DCDFileManager, Indexable, Theme, ThemeData } from "@types";
import { safeFetch } from "@utils";
import { ReactNative } from "@lib/preinit";

// TODO: New theme format

const DCDFileManager = window.nativeModuleProxy.DCDFileManager as DCDFileManager;
export const themes = wrapSync(createStorage<Indexable<Theme>>(createMMKVBackend("VENDETTA_THEMES")));

async function writeTheme(theme: Theme | {}) {
    if (typeof theme !== "object") throw new Error("Theme must be an object");

    // Save the current theme as vendetta_theme.json. When supported by loader,
    // this json will be written to window.__vendetta_theme and be used to theme the native side.
    await createFileBackend("vendetta_theme.json").set(theme);
}

function convertToRGBAString(hexString: string): string {
    const color = Number(ReactNative.processColor(hexString));

    const alpha = (color >> 24 & 0xff).toString(16).padStart(2, "0");
    const red = (color >> 16 & 0xff).toString(16).padStart(2, "0");
    const green = (color >> 8 & 0xff).toString(16).padStart(2, "0");
    const blue = (color & 0xff).toString(16).padStart(2, "0");

    return `#${red}${green}${blue}${alpha !== "ff" ? alpha : ""}`;
}

// Process data for some compatiblity with native side
function processData(data: ThemeData) {
    // entmy compat real ??
    data.colors ||= data.colours;
    data.theme_color_map.CHAT_BACKGROUND ||= data.theme_color_map.BACKGROUND_PRIMARY;

    if (data.theme_color_map) {
        const themeColorMap = data.theme_color_map;

        for (const key in themeColorMap) {
            for (const index in themeColorMap[key]) {
                themeColorMap[key][index] = convertToRGBAString(themeColorMap[key][index]);
            }
        }
    }

    if (data.colors) {
        for (const key in data.colors) {
            data.colors[key] = convertToRGBAString(data.colors[key]);
        }
    }

    return data;
}

export async function fetchTheme(id: string, selected = false) {
    let themeJSON: any;

    try {
        themeJSON = await (await safeFetch(id, { cache: "no-store" })).json();
    } catch {
        throw new Error(`Failed to fetch theme at ${id}`);
    }

    themes[id] = {
        id: id,
        selected: selected,
        data: processData(themeJSON),
    };
}

export async function installTheme(id: string) {
    if (typeof id !== "string" || id in themes) throw new Error("Theme already installed");
    await fetchTheme(id);
}

export async function selectTheme(id: string) {
    if (id === "default") return await writeTheme({});
    const selectedThemeId = Object.values(themes).find(i => i.selected)?.id;

    if (selectedThemeId) themes[selectedThemeId].selected = false;
    themes[id].selected = true;
    await writeTheme(themes[id]);
}

export async function removeTheme(id: string) {
    const theme = themes[id];
    if (theme.selected) await selectTheme("default");
    delete themes[id];
    
    return theme.selected;
}

export function getCurrentTheme(): Theme | null {
    const themeProp = window.__vendetta_loader?.features?.themes?.prop;
    if (!themeProp) return null;
    return window[themeProp] || null;
}

export async function updateThemes() {
    await awaitSyncWrapper(themes);
    const currentTheme = getCurrentTheme();
    await Promise.allSettled(Object.keys(themes).map(id => fetchTheme(id, currentTheme?.id === id)));
}

export async function initThemes(color: any) {
    //! Native code is required here!
    // Awaiting the sync wrapper is too slow, to the point where semanticColors are not correctly overwritten.
    // We need a workaround, and it will unfortunately have to be done on the native side.
    // await awaitSyncWrapper(themes);

    const selectedTheme = getCurrentTheme();
    if (!selectedTheme) return;

    const keys = Object.keys(color.default.colors);
    const refs = Object.values(color.default.colors);
    const oldRaw = color.default.unsafe_rawColors;

    color.default.unsafe_rawColors = new Proxy(oldRaw, {
        get: (_, colorProp: string) => {
            if (!selectedTheme) return Reflect.get(oldRaw, colorProp);

            // damn britlanders
            const themeColors = (selectedTheme?.data?.colors ?? selectedTheme?.data?.colours)!;
            return themeColors?.[colorProp] ?? Reflect.get(oldRaw, colorProp);
        }
    });

    after("resolveSemanticColor", color.default.meta, (args, ret) => {
        if (!selectedTheme) return ret;

        const colorSymbol = args[1] ?? ret;
        const colorProp = keys[refs.indexOf(colorSymbol)];
        const themeIndex = args[0] === "dark" ? 0 : 1;

        return selectedTheme?.data?.theme_color_map?.[colorProp]?.[themeIndex] ?? ret;
    });

    await updateThemes();
}