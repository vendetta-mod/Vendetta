// Hoist required modules
// This used to be in filters.ts, but things became convoluted

// Early find logic
const basicFind = (prop: string) => Object.values(window.modules).find(m => m.publicModule.exports?.[prop]).publicModule.exports;

// Hoist React on window
window.React = basicFind("createElement") as typeof import("react");;

// Export ReactNative
export const ReactNative = basicFind("Text") as typeof import("react-native");

// Export moment
export const moment = basicFind("isMoment");