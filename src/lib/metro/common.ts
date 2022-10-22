import { find, findByProps } from "@metro/filters";

// Discord
export const constants = findByProps("API_HOST");
export const channels = findByProps("getVoiceChannelId");
export const i18n = findByProps("Messages");
export const toasts = find(m => m.open && m.close && !m.startDrag && !m.init && !m.openReplay && !m.setAlwaysOnTop);

// React
export const React = findByProps("createElement") as typeof import("react");
export const ReactNative = findByProps("Text", "Image") as typeof import("react-native");

// AsyncStorage
export const AsyncStorage = findByProps("setItem") as typeof import("@react-native-async-storage/async-storage").default;