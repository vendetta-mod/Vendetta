import { findByDisplayName, findByProps } from "@metro/filters";

export const Forms = findByProps("Form", "FormSection");
export const General = findByProps("Button", "Text", "View");
export const Search = findByDisplayName("StaticSearchBarContainer");