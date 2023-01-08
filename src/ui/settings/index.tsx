import { i18n } from "@metro/common";
import { findByDisplayName } from "@metro/filters";
import { after } from "@lib/patcher";
import findInReactTree from "@utils/findInReactTree";
import SettingsSection from "@ui/settings/components/SettingsSection";
import General from "@ui/settings/pages/General";
import Plugins from "@ui/settings/pages/Plugins";
import AssetBrowser from "@ui/settings/pages/AssetBrowser";

const screensModule = findByDisplayName("getScreens", false);
const settingsModule = findByDisplayName("UserSettingsOverviewWrapper", false);
let prevPatches: Function[] = [];

export default function initSettings() {
    after("default", screensModule, (args, existingScreens) => {
        return {
            ...existingScreens,
            VendettaSettings: {
                title: "Vendetta",
                render: General,
            },
            VendettaPlugins: {
                title: "Plugins",
                render: Plugins
            },
            VendettaAssetBrowser: {
                title: "Asset Browser",
                render: AssetBrowser,
            },
        }
    });

    after("default", settingsModule, (args, ret) => {
        for (let p of prevPatches) p();
        prevPatches = [];

        const Overview = findInReactTree(ret.props.children, i => i.type && i.type.name === "UserSettingsOverview");

        // Upload logs button gone
        prevPatches.push(after("renderSupportAndAcknowledgements", Overview.type.prototype, (args, { props: { children } }) => {
            const index = children.findIndex((c: any) => c?.type?.name === "UploadLogsButton");
            if (index !== -1) children.splice(index, 1);
        }));

        prevPatches.push(after("render", Overview.type.prototype, (args, { props: { children } }) => {
            const titles = [i18n.Messages["BILLING_SETTINGS"], i18n.Messages["PREMIUM_SETTINGS"]];
            const index = children.findIndex((c: any) => titles.includes(c.props.title));
            children.splice(index === -1 ? 4 : index, 0, <SettingsSection navigation={Overview.props.navigation} />);
        }));
    });
}