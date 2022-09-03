import { findByProps, find } from "@metro/filters";

// Discord
export const Constants = findByProps("API_HOST");
export const channels = findByProps("getVoiceChannelId");
export const i18n = findByProps("Messages");

// Flux
export const Flux = findByProps("connectStores");
export const FluxDispatcher = findByProps("_currentDispatchActionType");

// React
export const React = findByProps("createElement") as typeof import("react");
export const ReactNative = findByProps("Text", "Image") as typeof import("react-native");

// Redux
export const Redux = findByProps("createStore") as typeof import("redux");

// Zustand
export const zustand = find(
    (m) =>
        typeof m == "function" &&
        m.toString().includes("[useStore, api] = create() is deprecated and will be removed in v4"),
);

// HighlightJS
export const highlightjs = findByProps("initHighlighting");

// UUID
export const uuid = {
    v4: findByProps("v1")
}