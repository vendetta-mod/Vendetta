import { NavigationNative, i18n } from "@metro/common";
import { findByName } from "@metro/filters";
import { after } from "@lib/patcher";
import { installPlugin } from "@lib/plugins";
import { installTheme } from "@lib/themes";
import findInReactTree from "@utils/findInReactTree";
import without from "@utils/without";
import ErrorBoundary from "@ui/components/ErrorBoundary";
import SettingsSection from "@ui/settings/components/SettingsSection";
import InstallButton from "@ui/settings/components/InstallButton";
import General from "@ui/settings/pages/General";
import Plugins from "@ui/settings/pages/Plugins";
import Themes from "@ui/settings/pages/Themes";
import Developer from "@ui/settings/pages/Developer";
import AssetBrowser from "@ui/settings/pages/AssetBrowser";
import { Forms } from "@ui/components";

const screensModule = findByName("getScreens", false);
const settingsModule = findByName("UserSettingsOverviewWrapper", false);

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
                render: Plugins,
                headerRight: () => <InstallButton alertTitle="Install Plugin" installFunction={installPlugin} />,
            },
            VendettaThemes: {
                title: "Themes",
                render: Themes,
                headerRight: () => <InstallButton alertTitle="Install Theme" installFunction={installTheme} />,
            },
            VendettaDeveloper: {
                title: "Developer",
                render: Developer,
            },
            VendettaAssetBrowser: {
                title: "Asset Browser",
                render: AssetBrowser,
            },
            VendettaCustomPage: {
                title: "Vendetta Page",
                render: ({ render: PageView, noErrorBoundary, ...options }: { render: React.ComponentType, noErrorBoundary: boolean } & Record<string, object>) => {
                    const navigation = NavigationNative.useNavigation();
                    React.useEffect(() => options && navigation.setOptions(without(options, "render", "noErrorBoundary")), []);
                    return noErrorBoundary ? <PageView /> : <ErrorBoundary><PageView /></ErrorBoundary>;
                }
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
            //! Fix for Android 174201 and iOS 42188
            children = findInReactTree(children, (tree) => tree.children[1].type === Forms.FormSection).children;
            const index = children.findIndex((c: any) => titles.includes(c?.props.label));
            children.splice(index === -1 ? 4 : index, 0, <SettingsSection />);
        }));
    }, true);

    return () => patches.forEach(p => p());
}
