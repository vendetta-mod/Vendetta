// Hoist required modules
// This used to be in filters.ts, but things became convoluted

// Early find logic
const basicFind = (prop: string) => Object.values(window.modules).find(m => m?.publicModule.exports?.[prop])?.publicModule?.exports;

// Hoist React on window
window.React = basicFind("createElement") as typeof import("react");

// Export ReactNative
export const ReactNative = basicFind("AppRegistry") as typeof import("react-native");

// Export Discord's constants
export const constants = basicFind("AbortCodes");

// Export moment
export const moment = basicFind("isMoment") as typeof import("moment");
