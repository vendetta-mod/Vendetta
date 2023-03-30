// Hoist required modules
// This used to be in filters.ts, but things became convoluted

import { initThemes } from "@lib/themes";

// Early find logic
const basicFind = (prop: string) => Object.values(window.modules).find(m => m?.publicModule.exports?.[prop])?.publicModule?.exports;

// Hoist React on window
window.React = basicFind("createElement") as typeof import("react");

// Export ReactNative
export const ReactNative = basicFind("AppRegistry") as typeof import("react-native");

// Export chroma.js
export const chroma = basicFind("brewer") as typeof import("chroma-js");

// Themes
if (window.__vendetta_loader?.features.themes) {
    try {
        initThemes();
    } catch (e) {
        console.error("[Vendetta] Failed to initialize themes...", e);
    }
}