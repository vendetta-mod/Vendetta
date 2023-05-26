import { DiscordStyleSheet } from "@types";
import { find, findByProps } from "@metro/filters";

// Discord
export const constants = findByProps("Fonts", "Permissions");
export const channels = findByProps("getVoiceChannelId");
export const i18n = findByProps("Messages");
export const url = findByProps("openURL", "openDeeplink");
export const toasts = find(m => m.open && m.close && !m.startDrag && !m.init && !m.openReplay && !m.setAlwaysOnTop);
export const stylesheet = findByProps("createThemedStyleSheet") as DiscordStyleSheet;
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