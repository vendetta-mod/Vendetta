// Based on https://github.com/Aliucord/AliucordRN/blob/main/src/ui/patchTheme.ts
// Literally could not figure this out, many thanks

import { findByProps, findByStoreName } from "@metro/filters";
import { FluxDispatcher } from "@metro/common";
import logger from "@lib/logger";

const ThemeManager = findByProps("updateTheme", "overrideTheme");
const AMOLEDThemeManager = findByProps("setAMOLEDThemeEnabled");
const ThemeStore = findByStoreName("ThemeStore");
const UnsyncedUserSettingsStore = findByStoreName("UnsyncedUserSettingsStore");

function override() {
    const theme = ThemeStore.theme || "dark";
    ThemeManager.overrideTheme(theme);
    
    if (AMOLEDThemeManager && UnsyncedUserSettingsStore.useAMOLEDTheme === 2) AMOLEDThemeManager.setAMOLEDThemeEnabled(true);
    FluxDispatcher.unsubscribe("I18N_LOAD_START", override);
}

export default function fixTheme() {
    try {
        if (ThemeStore) FluxDispatcher.subscribe("I18N_LOAD_START", override);
    } catch(e) {
        logger.error("Failed to fix theme...", e)
    }
}