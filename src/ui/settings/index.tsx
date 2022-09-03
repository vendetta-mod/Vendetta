import { React, i18n } from "@metro/common";
import { findByDisplayName } from "@metro/filters";
import { after } from "@lib/patcher";
import Settings from "./components/Settings";
import SettingsSection from "./components/SettingsSection";

const screensModule = findByDisplayName("getScreens", false);
const settingsModule = findByDisplayName("UserSettingsOverviewWrapper", false);

export default function initSettings() {
    const screensPatch = after("default", screensModule, (args, ret) => {
        return {
            ...ret,
            Vendetta: {
                title: "Vendetta",
                render: Settings
            }   
        }
    });

    const settingsPatch = after("default", settingsModule, (args, _ret) => {
        settingsPatch();
        const toPatch = _ret.props.children.find((i: any) => i.type && typeof i.type === "function");

        // Upload logs button gone
        after("renderSupportAndAcknowledgements", toPatch.type.prototype, (args, { props: { children } }) => {
            const index = children.findIndex((c: any) => c?.type?.name === "UploadLogsButton");
            if (index !== -1) children.splice(index, 1);
        });

        after("render", toPatch.type.prototype, (args, { props: { children } }) => {
            const titles = [i18n.Messages["BILLING_SETTINGS"], i18n.Messages["PREMIUM_SETTINGS"]];
            const index = children.findIndex((c: any) => titles.includes(c.props.title));
            children.splice(index === -1 ? 4 : index, 0, <SettingsSection navigation={toPatch.props.navigation} />);
        });
    });
}