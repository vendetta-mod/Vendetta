import { findByProps } from "@metro/filters";

// Discord
export const Constants = findByProps("API_HOST");
export const channels = findByProps("getVoiceChannelId");
export const i18n = findByProps("Messages");

// React
export const React = findByProps("createElement") as typeof import("react");
export const ReactNative = findByProps("Text", "Image") as typeof import("react-native");