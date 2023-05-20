import { ReactNative as RN, NavigationNative, stylesheet, lodash } from "@metro/common";
import { installPlugin } from "@lib/plugins";
import { installTheme } from "@lib/themes";
import { without } from "@lib/utils";
import { semanticColors } from "@ui/color";
import { getAssetIDByName } from "@ui/assets";
import settings from "@lib/settings";
import ErrorBoundary from "@ui/components/ErrorBoundary";
import InstallButton from "@ui/settings/components/InstallButton";
import General from "@ui/settings/pages/General";
import Plugins from "@ui/settings/pages/Plugins";
import Themes from "@ui/settings/pages/Themes";
import Developer from "@ui/settings/pages/Developer";

interface Screen {
    [index: string]: any;
    key: string,
    title: string;
    icon?: string;
    shouldRender?: boolean;
    options?: Record<string, any>;
    render: React.ComponentType<any>;
}

const styles = stylesheet.createThemedStyleSheet({ container: { flex: 1, backgroundColor: semanticColors.BACKGROUND_MOBILE_PRIMARY } });
const formatKey = (key: string, youKeys: boolean) => youKeys ? lodash.snakeCase(key).toUpperCase() : key;

export const getScreens = (youKeys = false): Screen[] => [
    {
        key: formatKey("VendettaSettings", youKeys),
        title: "General",
        icon: "settings",
        render: General,
    },
    {
        key: formatKey("VendettaPlugins", youKeys),
        title: "Plugins",
        icon: "debug",
        options: {
            headerRight: () => <InstallButton alertTitle="Install Plugin" installFunction={installPlugin} />,
        },
        render: Plugins,
    },
    {
        key: formatKey("VendettaThemes", youKeys),
        title: "Themes",
        icon: "ic_theme_24px",
        shouldRender: window.__vendetta_loader?.features.hasOwnProperty("themes"),
        options: {
            headerRight: () => !settings.safeMode?.enabled && <InstallButton alertTitle="Install Theme" installFunction={installTheme} />,
        },
        render: Themes,
    },
    {
        key: formatKey("VendettaDeveloper", youKeys),
        title: "Developer",
        icon: "ic_progress_wrench_24px",
        shouldRender: settings.developerSettings,
        render: Developer,
    },
    {
        key: formatKey("VendettaCustomPage", youKeys),
        title: "Vendetta Page",
        shouldRender: false,
        render: ({ render: PageView, noErrorBoundary, ...options }: { render: React.ComponentType, noErrorBoundary: boolean } & Record<string, object>) => {
            const navigation = NavigationNative.useNavigation();

            navigation.addListener("focus", () => navigation.setOptions(without(options, "render", "noErrorBoundary")));
            return noErrorBoundary ? <PageView /> : <ErrorBoundary><PageView /></ErrorBoundary>;
        }
    }
]

export const getPanelsScreens = () => Object.fromEntries(getScreens().map(s => [s.key, {
    title: s.title,
    render: s.render,
    ...s.options,
}]));

export const getYouData = () => {
    const screens = getScreens(true);

    return {
        layout: { title: "Vendetta", settings: screens.filter(s => s.shouldRender ?? true).map(s => s.key) },
        titleConfig: Object.fromEntries(screens.map(s => [s.key, s.title])),
        relationships: Object.fromEntries(screens.map(s => [s.key, null])),
        rendererConfigs: Object.fromEntries(screens.map(s => [s.key, {
            type: "route",
            icon: s.icon ? getAssetIDByName(s.icon) : null,
            screen: {
                // TODO: This is bad, we should not re-convert the key casing
                // For some context, just using the key here would make the route key be VENDETTA_CUSTOM_PAGE in you tab, which breaks compat with panels UI navigation
                route: lodash.chain(s.key).camelCase().upperFirst().value(),
                getComponent: () => ({ navigation, route }: any) => {
                    navigation.addListener("focus", () => navigation.setOptions(s.options));
                    // TODO: Some ungodly issue causes the keyboard to automatically close in TextInputs. Why?!
                    return <RN.View style={styles.container}><s.render {...route.params} /></RN.View>;
                }
            }
        }]))
    }
}