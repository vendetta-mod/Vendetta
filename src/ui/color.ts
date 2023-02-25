import { findByProps } from "@metro/filters";
import { constants } from "@metro/hoist";

//! This module is only found on 165.0+, under the assumption that iOS 165.0 is the same as Android 165.0.
//* In 167.1, most if not all traces of the old color modules were removed.
//* In 168.6, Discord restructured EVERYTHING again. SemanticColor on this module no longer works when passed to a stylesheet. We must now use what you see below.
//? However, this is not all bad. The changes made in 168.6 do allow for better native-less theming.
const colorModule = findByProps("SemanticColor");

//* For both below, SemanticColor and RawColor are seemingly not used. Once again, what are Discord doing?

//? SemanticColor and default.colors are effectively ThemeColorMap
export const semanticColors = (constants.ThemeColorMap ?? colorModule?.default?.colors ?? colorModule?.SemanticColor);

//? RawColor and default.unsafe_rawColors are effectively Colors
//* Note that constants.Colors does still appear to exist on newer versions despite Discord not internally using it - what the fuck?
export const rawColors = (constants.Colors ?? colorModule?.default?.unsafe_rawColors ?? colorModule?.RawColor);