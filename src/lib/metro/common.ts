import { find, findByProps } from "@metro/filters";

// Discord
export const constants = findByProps("API_HOST");
export const channels = findByProps("getVoiceChannelId");
export const i18n = findByProps("Messages");
export const url = findByProps("openURL");
export const toasts = find(m => m.open && m.close && !m.startDrag && !m.init && !m.openReplay && !m.setAlwaysOnTop);
export const stylesheet = findByProps("createThemedStyleSheet");
export const clipboard = findByProps("setString", "getString");
export const assets = findByProps("registerAsset");
export const navigation = findByProps("pushLazy");
export const navigationStack = findByProps("createStackNavigator");
export const NavigationNative = findByProps("NavigationContainer");

// React
export const React = findByProps("createElement") as typeof import("react");
export const ReactNative = findByProps("Text", "Image") as typeof import("react-native");

// AsyncStorage
export const AsyncStorage = findByProps("setItem") as typeof import("@react-native-async-storage/async-storage").default;