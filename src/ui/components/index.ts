import { findByName, findByProps } from "@metro/filters";

// Discord
export const Forms = findByProps("Form", "FormSection");
export const General = findByProps("Button", "Text", "View");
export const Search = findByName("StaticSearchBarContainer");
export const Alert = findByProps("alertDarkStyles", "alertLightStyles").default;
export const Button = findByProps("Looks", "Colors", "Sizes") as React.ComponentType<any> & { Looks: any, Colors: any, Sizes: any };

// Vendetta
export { default as Summary } from "@ui/components/Summary";
export { default as ErrorBoundary } from "@ui/components/ErrorBoundary";
export { default as Codeblock } from "@ui/components/Codeblock";