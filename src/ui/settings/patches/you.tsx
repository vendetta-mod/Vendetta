import { i18n } from "@metro/common";
import { findByProps } from "@metro/filters";
import { after } from "@lib/patcher";
import { getRenderableScreens, getScreens, getYouData } from "@ui/settings/data";

const layoutModule = findByProps("useOverviewSettings");
const titleConfigModule = findByProps("getSettingTitleConfig");
const gettersModule = findByProps("getSettingSearchListItems");
const miscModule = findByProps("SETTING_RELATIONSHIPS", "SETTING_RENDERER_CONFIGS");

export default function patchYou() {
    const patches = new Array<Function>;
    const screens = getScreens(true);
    const renderableScreens = getRenderableScreens(true);
    const data = getYouData();

    patches.push(after("useOverviewSettings", layoutModule, (_, ret) => {
        // Add our settings
        const accountSettingsIndex = ret.findIndex((i: any) => i.title === i18n.Messages.ACCOUNT_SETTINGS);
        ret.splice(accountSettingsIndex + 1, 0, data.layout);

        // Upload Logs button be gone
        const supportCategory = ret.find((i: any) => i.title === i18n.Messages.SUPPORT);
        supportCategory.settings = supportCategory.settings.filter((s: string) => s !== "UPLOAD_DEBUG_LOGS");
    }));

    patches.push(after("getSettingTitleConfig", titleConfigModule, (_, ret) => ({
        ...ret,
        ...data.titleConfig,
    })));

    patches.push(after("getSettingSearchListItems", gettersModule, ([settings], ret) => [
        ...(renderableScreens.filter(s => settings.includes(s.key))).map(s => ({
            type: "setting_search_result",
            ancestorRendererData: data.rendererConfigs[s.key],
            setting: s.key,
            title: data.titleConfig[s.key],
            breadcrumbs: ["Vendetta"],
            icon: data.rendererConfigs[s.key].icon,
        })),
        ...ret.filter((i: any) => !screens.map(s => s.key).includes(i.setting)),
    ].map((item, index, parent) => ({ ...item, index, total: parent.length }))));

    // TODO: We could use a proxy for these
    const oldRelationships = miscModule.SETTING_RELATIONSHIPS;
    miscModule.SETTING_RELATIONSHIPS = { ...oldRelationships, ...data.relationships };

    const oldRendererConfigs = miscModule.SETTING_RENDERER_CONFIGS;
    miscModule.SETTING_RENDERER_CONFIGS = { ...oldRendererConfigs, ...data.rendererConfigs };

    return () => {
        miscModule.SETTING_RELATIONSHIPS = oldRelationships;
        miscModule.SETTING_RENDERER_CONFIGS = oldRendererConfigs;
        patches.forEach(p => p());
    };
}
