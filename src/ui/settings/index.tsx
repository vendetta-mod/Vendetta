import { i18n } from "@metro/common";
import { findByDisplayName } from "@metro/filters";
import { after } from "@lib/patcher";
import findInReactTree from "@utils/findInReactTree";
import SettingsSection from "@ui/settings/components/SettingsSection";
import General from "@ui/settings/pages/General";
import Plugins from "@ui/settings/pages/Plugins";
import Developer from "@ui/settings/pages/Developer";

const screensModule = findByDisplayName("getScreens", false);
const settingsModule = findByDisplayName("UserSettingsOverviewWrapper", false);

export default function initSettings() {
    const patches = new Array<Function>;

    patches.push(after("default", screensModule, (args, existingScreens) => {
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
            VendettaDeveloper: {
                title: "Developer",
                render: Developer
            }
        }
    }));

    after("default", settingsModule, (_, ret) => {
        const Overview = findInReactTree(ret.props.children, i => i.type && i.type.name === "UserSettingsOverview");

        // Upload logs button gone
        patches.push(after("renderSupportAndAcknowledgements", Overview.type.prototype, (_, { props: { children } }) => {
            const index = children.findIndex((c: any) => c?.type?.name === "UploadLogsButton");
            if (index !== -1) children.splice(index, 1);
        }));

        patches.push(after("render", Overview.type.prototype, (_, { props: { children } }) => {
            const titles = [i18n.Messages["BILLING_SETTINGS"], i18n.Messages["PREMIUM_SETTINGS"]];
            const index = children.findIndex((c: any) => titles.includes(c.props.title));
            children.splice(index === -1 ? 4 : index, 0, <SettingsSection />);
        }));
    }, true);

    return () => patches.forEach(p => p());
}