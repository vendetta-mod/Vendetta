import { SettingsScreen, SettingsSection } from "@types";
import { NavigationNative } from "@metro/common";
import { showToast } from "@ui/toasts";
import { getAssetIDByName } from "@ui/assets";
import patchPanels from "@ui/settings/patches/panels";
import General from "@ui/settings/pages/General";
import Plugins from "@ui/settings/pages/Plugins";
import Themes from "@ui/settings/pages/Themes";
import Developer from "@ui/settings/pages/Developer";
import CustomPage from "@ui/settings/pages/CustomPage";
import AssetBrowser from "@ui/settings/pages/AssetBrowser";
import settings from "@lib/settings";

// TODO: Reactivity?
export const sections = new Array<SettingsSection>();

export function registerSection(section: SettingsSection) {
    sections.push(section);

    return () => {
        const i = sections.indexOf(section);
        if (i !== -1) sections.splice(i, 1);
    }
}

export const registerSections = (...sections: SettingsSection[]) => sections.forEach(registerSection);

export const getScreens = () => sections.map(s => s.items.filter(s => s.type === "screen")).flat() as SettingsScreen[];

export function initSettings() {
    const patches = [
        patchPanels(),
        // TODO: Support the You Tab again, some details below
        // This module only exists on version 180+ from some basic checking, and that's what we're compatible with.
        // ...(findByProps("getSettingSearchListItems") ? [patchYou()] : []),
    ]

    registerSections(
        {
            title: "Vendetta",
            items: [
                {
                    type: "screen",
                    route: "VendettaSettings",
                    label: "General",
                    icon: getAssetIDByName("settings"),
                    component: General,
                },
                {
                    type: "screen",
                    route: "VendettaPlugins",
                    label: "Plugins",
                    icon: getAssetIDByName("debug"),
                    component: Plugins,
                },
                {
                    type: "screen",
                    route: "VendettaThemes",
                    label: "Themes",
                    icon: getAssetIDByName("ic_theme_24px"),
                    renderCondition: () => window.__vendetta_loader?.features.hasOwnProperty("themes") ?? false,
                    component: Themes,
                },
                {
                    type: "screen",
                    route: "VendettaDeveloper",
                    label: "Developer",
                    icon: getAssetIDByName("ic_progress_wrench_24px"),
                    renderCondition: () => settings.developerSettings ?? false,
                    component: Developer,
                },
                {
                    type: "screen",
                    route: "VendettaCustomPage",
                    label: "Vendetta Page",
                    renderCondition: () => false,
                    component: CustomPage,
                }
            ]
        },
        // TODO: ENSURE THIS IS REMOVED BEFORE FINAL PUSH :nyaboom:
        {
            title: "Playground",
            items: [
                {
                    type: "screen",
                    route: "VendettaTestScreen",
                    label: "I am a screen!",
                    description: "Look at my icon. You can tap me to look at more icons.",
                    icon: getAssetIDByName("ic_image"),
                    component: AssetBrowser,
                },
                {
                    type: "pressable",
                    label: "I'm a pressable.",
                    description: "You can press me. Also, look, we support ImageURISource from React Native!",
                    icon: {
                        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Twemoji_1f633.svg/240px-Twemoji_1f633.svg.png",
                        width: 24,
                        height: 24,
                    },
                    onPress: () => showToast("😳"),
                },
                {
                    type: "switch",
                    label: "And lastly, I'm a switch!",
                    description: "I don't have an icon, or proper behaviour (yet™️)",
                    value: true,
                    onValueChange: (v) => showToast(v.toString()),
                }
            ]
        },
    );

    return () => patches.forEach(p => p());
}
