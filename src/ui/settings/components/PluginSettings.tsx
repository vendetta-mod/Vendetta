import { Plugin } from "@types";
import { navigation, navigationStack, NavigationNative, stylesheet, constants } from "@metro/common";
import { General } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";

interface PluginSettingsProps {
    plugin: Plugin;
    children: JSX.Element;
}

const styles = stylesheet.createThemedStyleSheet({
    container: {
        backgroundColor: stylesheet.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
        flex: 1,
    },
    card: {
        backgroundColor: stylesheet.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
        color: stylesheet.ThemeColorMap.TEXT_NORMAL,
    },
    header: {
        backgroundColor: stylesheet.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
        shadowColor: "transparent",
        elevation: 0,
    },
    headerTitleContainer: {
        color: stylesheet.ThemeColorMap.HEADER_PRIMARY,
    },
    headerTitle: {
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        color: stylesheet.ThemeColorMap.HEADER_PRIMARY,
    },
    backIcon: {
        tintColor: stylesheet.ThemeColorMap.INTERACTIVE_ACTIVE,
        marginLeft: 15,
        marginRight: 20,
    }
});

export const Settings = navigationStack.createStackNavigator();
const { TouchableOpacity, Image } = General;

export default function PluginSettings({ plugin, children }: PluginSettingsProps) {
    return (
        <NavigationNative.NavigationContainer>
            <Settings.Navigator
                initialRouteName={plugin.manifest.name}
                style={styles.container}
                screenOptions={{
                    cardOverlayEnabled: false,
                    cardShadowEnabled: false,
                    cardStyle: styles.card,
                    headerStyle: styles.header,
                    headerTitleContainerStyle: styles.headerTitleContainer,
                }}
            >
                <Settings.Screen 
                    name={plugin.manifest.name}
                    component={children}
                    options={{
                        headerTitleStyle: styles.headerTitle,
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => navigation.pop()}
                            >
                                <Image style={styles.backIcon} source={getAssetIDByName("back-icon")} />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Settings.Navigator>
        </NavigationNative.NavigationContainer>
    )
}