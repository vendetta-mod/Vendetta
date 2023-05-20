import { findByProps } from "@metro/filters";
import patchPanels from "@ui/settings/patches/panels";
import patchYou from "@ui/settings/patches/you";

export default function initSettings() {
    const patches = [
        patchPanels(),
        ...(findByProps("useOverviewSettings") ? [patchYou()] : []),
    ]

    return () => patches.forEach(p => p());
}
