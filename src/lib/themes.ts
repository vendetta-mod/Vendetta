import { DCDFileManager, Indexable, Theme, ThemeData } from "@types";
import { ReactNative } from "@metro/common";
import { after, instead } from "@lib/patcher";
import { createFileBackend, createMMKVBackend, createStorage, wrapSync, awaitSyncWrapper } from "@lib/storage";
import { safeFetch } from "@utils";
import { color } from "./preinit";

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
    if (data.semanticColors) {
        const semanticColors = data.semanticColors;

        for (const key in semanticColors) {
            for (const index in semanticColors[key]) {
                semanticColors[key][index] = convertToRGBAString(semanticColors[key][index]);
            }
        }
    }

    if (data.rawColors) {
        const rawColors = data.rawColors;

        for (const key in rawColors) {
            data.rawColors[key] = convertToRGBAString(rawColors[key]);
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

    // TODO: Should we prompt when the selected theme is updated?
    if (selected) writeTheme(themes[id]);
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

function extractInfo(themeMode: string, colorObj: any): [name: string, colorDef: any] {
    // @ts-ignore - assigning to extract._sym
    const propName = colorObj[extractInfo._sym ??= Object.getOwnPropertySymbols(colorObj)[0]];
    const colorDef = color.SemanticColor[propName];

    return [propName, colorDef[themeMode.toLowerCase()]];
}

export async function initThemes(color: any) {
    //! Native code is required here!
    // Awaiting the sync wrapper is too slow, to the point where semanticColors are not correctly overwritten.
    // We need a workaround, and it will unfortunately have to be done on the native side.
    // await awaitSyncWrapper(themes);

    const selectedTheme = getCurrentTheme();
    if (!selectedTheme) return;

    // const keys = Object.keys(color.default.colors);
    // const refs = Object.values(color.default.colors);
    const oldRaw = color.default.unsafe_rawColors;

    color.default.unsafe_rawColors = new Proxy(oldRaw, {
        get: (_, colorProp: string) => {
            if (!selectedTheme) return Reflect.get(oldRaw, colorProp);

            return selectedTheme.data?.rawColors?.[colorProp] ?? Reflect.get(oldRaw, colorProp);
        }
    });

    instead("resolveSemanticColor", color.default.meta, (args, orig) => {
        if (!selectedTheme) return orig(...args);

        const [theme, propIndex] = args;
        const [name, colorDef] = extractInfo(theme, propIndex);

        const themeIndex = theme === "amoled" ? 2 : theme === "light" ? 1 : 0;

        if (selectedTheme.data?.semanticColors?.[name]?.[themeIndex]) {
            return selectedTheme.data.semanticColors[name][themeIndex];
        }

        if (selectedTheme.data?.rawColors?.[colorDef.raw]) {
            // TODO: handle opacity
            return selectedTheme.data.rawColors[colorDef.raw];
        }

        return orig(...args);
    });

    await updateThemes();
}