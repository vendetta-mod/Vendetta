import { findByProps } from "@metro/filters";
import { constants } from "@metro/hoist";

//! This module is only found on 165.0+, under the assumption that iOS 165.0 is the same as Android 165.0.
//* In 167.1, most if not all traces of the old color modules were removed.
const colorModule = findByProps("SemanticColorsByThemeTable");

//? SemanticColor is effectively ThemeColorMap
export const semanticColors = (constants.ThemeColorMap ?? colorModule?.SemanticColor);

//? RawColor is effectively Colors
export const rawColors = (constants.Colors ?? colorModule?.RawColor);