// Hoist required modules
// This used to be in filters.ts, but things became convoluted

import { initThemes } from "@lib/themes";

// Early find logic
const basicFind = (prop: string) => Object.values(window.modules).find(m => m?.publicModule.exports?.[prop])?.publicModule?.exports;

// Hoist React on window
window.React = basicFind("createElement") as typeof import("react");

// Export ReactNative
export const ReactNative = basicFind("AppRegistry") as typeof import("react-native");

// Export Discord's constants
export const constants = basicFind("AbortCodes");

// Export Discord's color module
export const color = basicFind("SemanticColor");

// Themes
try {
    initThemes(color);
} catch (e) {
    console.error("Vendetta themes failed to initialize!", e);
}