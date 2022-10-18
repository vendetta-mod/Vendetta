import { findByProps } from "@metro/filters";

// Discord
export const Constants = findByProps("API_HOST");
export const channels = findByProps("getVoiceChannelId");
export const i18n = findByProps("Messages");