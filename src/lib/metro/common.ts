import { find, findByProps } from "@metro/filters";

// Discord
export { constants } from "@metro/hoist";
export const channels = findByProps("getVoiceChannelId");
export const i18n = findByProps("Messages");
export const url = findByProps("openURL");
export const toasts = find(m => m.open && m.close && !m.startDrag && !m.init && !m.openReplay && !m.setAlwaysOnTop);
export const stylesheet = findByProps("createThemedStyleSheet");
export const clipboard = findByProps("setString", "getString", "hasString");
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
export { ReactNative } from "@metro/hoist";