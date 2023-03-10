import { Indexable, Theme, ThemeData } from "@types";
import { createMMKVBackend, createStorage, wrapSync, awaitSyncWrapper } from "@lib/storage";
import { after } from "@lib/patcher";
import { safeFetch } from "@utils";

export const themes = wrapSync(createStorage<Indexable<Theme>>(createMMKVBackend("VENDETTA_THEMES")));

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
}

export async function initThemes(color: any) {
    //! Native code is required here!
    // Awaiting the sync wrapper is too slow, to the point where semanticColors are not correctly overwritten.
    // We need a workaround, and it will unfortunately have to be done on the native side.
    await awaitSyncWrapper(themes);
    const selectedThemeId = Object.values(themes).find(i => i.selected)?.id;
    const selectedTheme = selectedThemeId ? themes[selectedThemeId] : undefined;

    const keys = Object.keys(color.default.colors);
    const refs = Object.values(color.default.colors);
    const oldRaw = color.default.unsafe_rawColors;

    color.default.unsafe_rawColors = new Proxy(oldRaw, {
        get: (_, colorProp: string) => {
            if (!selectedTheme) return Reflect.get(oldRaw, colorProp);

            // damn britlanders
            const themeColors = (selectedTheme?.data.colors ?? selectedTheme?.data.colours)!;
            return themeColors[colorProp] ?? Reflect.get(oldRaw, colorProp);
        }
    });

    after("resolveSemanticColor", color.default.meta, (args, ret) => {
        if (!selectedTheme) return ret;

        const colorSymbol = args[1] ?? ret;
        const colorProp = keys[refs.indexOf(colorSymbol)];
        const themeIndex = args[0] === "dark" ? 0 : 1;
        return selectedTheme?.data.theme_color_map[colorProp]?.[themeIndex] ?? ret;
    });
}