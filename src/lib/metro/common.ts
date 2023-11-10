import { find, findByProps, findByPropsAll, findByStoreName } from "@metro/filters";
import type { StyleSheet } from "react-native";
import { ReactNative as RN } from "./common";

const ThemeStore = findByStoreName("ThemeStore");
const colorResolver = findByProps("colors", "meta").meta;

// Reimplementation of Discord's createThemedStyleSheet, which was removed since 204201
// Not exactly a 1:1 reimplementation, but sufficient to keep compatibility with existing plugins
function createThemedStyleSheet<T extends StyleSheet.NamedStyles<T>>(sheet: Styles<T>) {
    Object.values(sheet).forEach(s => {
        const style = RN.StyleSheet.flatten(s);

        Object.keys(style).forEach((key) => {
            if (colorResolver.isSemanticColor(style[key])) {
                const symbol = style[key];

                // Listen to theme changes
                ThemeStore.addChangeListener(() => {
                    style[key] = colorResolver.resolveSemanticColor(ThemeStore.theme, symbol);
                });

                style[key] = colorResolver.resolveSemanticColor(ThemeStore.theme, symbol);
            }
        });
    });

    return sheet;
}

// Discord
export const constants = findByProps("Fonts", "Permissions");
export const channels = findByProps("getVoiceChannelId");
export const i18n = findByProps("Messages");
export const url = findByProps("openURL", "openDeeplink");
export const toasts = find(m => m.open && m.close && !m.startDrag && !m.init && !m.openReplay && !m.setAlwaysOnTop);

type Styles<T> = T | StyleSheet.NamedStyles<T> | (() => T | StyleSheet.NamedStyles<T>);

export const stylesheet = {
    ...find(m => m.createStyles && !m.ActionSheet),
    createThemedStyleSheet: findByProps("createThemedStyleSheet")?.createThemedStyleSheet ?? createThemedStyleSheet
} as unknown as {
    createStyles: <T extends StyleSheet.NamedStyles<T>>(sheet: Styles<T>) => () => T,
    [index: string]: any
}

export const clipboard = findByProps("setString", "getString", "hasString") as typeof import("@react-native-clipboard/clipboard").default;
export const assets = findByProps("registerAsset");
export const invites = findByProps("acceptInviteAndTransitionToInviteChannel");
export const commands = findByProps("getBuiltInCommands");
export const navigation = findByProps("pushLazy");
export const navigationStack = findByProps("createStackNavigator");
export const NavigationNative = findByProps("NavigationContainer");

// Flux
export const Flux = findByProps("connectStores");
export const FluxDispatcher = findByProps("_currentDispatchActionType");

// React
export const React = window.React as typeof import("react");
export { ReactNative } from "@lib/preinit";

// Moment
export const moment = findByProps("isMoment") as typeof import("moment");

// chroma.js
export { chroma } from "@lib/preinit";

// Lodash
export const lodash = findByProps("forEachRight") as typeof import("lodash");