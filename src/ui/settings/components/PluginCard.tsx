import { ButtonColors, Plugin } from "@types";
import { ReactNative as RN, stylesheet, NavigationNative } from "@metro/common";
import { Forms, General } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { showConfirmationAlert } from "@ui/alerts";
import { semanticColors } from "@ui/color";
import { removePlugin, startPlugin, stopPlugin, getSettings } from "@lib/plugins";
import copyText from "@utils/copyText";

const { FormRow, FormSwitch } = Forms;
const { TouchableOpacity, Image } = General;

// TODO: These styles work weirdly. iOS has cramped text, Android with low DPI probably does too. Fix?
const styles = stylesheet.createThemedStyleSheet({
    card: {
        backgroundColor: semanticColors?.BACKGROUND_SECONDARY,
        borderRadius: 5,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    header: {
        padding: 0,
        backgroundColor: semanticColors?.BACKGROUND_TERTIARY,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    actions: {
        flexDirection: "row-reverse",
        alignItems: "center",
    },
    icon: {
        width: 22,
        height: 22,
        marginLeft: 5,
        tintColor: semanticColors?.INTERACTIVE_NORMAL,
    }
})

interface PluginCardProps {
    plugin: Plugin;
    index: number;
}

export default function PluginCard({ plugin, index }: PluginCardProps) {
    const settings = getSettings(plugin.id);
    const navigation = NavigationNative.useNavigation();
    const [removed, setRemoved] = React.useState(false);

    // This is needed because of React™
    if (removed) return null;

    return ( 
        <RN.View style={[styles.card, {marginTop: index === 0 ? 10 : 0}]}>
            <FormRow
                style={styles.header}
                // TODO: Actually make use of user IDs
                label={`${plugin.manifest.name} by ${plugin.manifest.authors.map(i => i.name).join(", ")}`}
                leading={<FormRow.Icon source={getAssetIDByName(plugin.manifest.vendetta?.icon || "ic_application_command_24px")} />}
                trailing={
                    <FormSwitch
                        style={RN.Platform.OS === "android" && { marginVertical: -15 }}
                        value={plugin.enabled}
                        onValueChange={(v: boolean) => {
                            try {
                                if (v) startPlugin(plugin.id); else stopPlugin(plugin.id);
                            } catch (e) {
                                showToast((e as Error).message, getAssetIDByName("Small"));
                            }
                        }}
                    />
                }
            />
            <FormRow
                label={plugin.manifest.description}
                trailing={
                    <RN.View style={styles.actions}>
                        <TouchableOpacity
                            onPress={() => showConfirmationAlert({
                                title: "Wait!",
                                content: `Are you sure you wish to delete ${plugin.manifest.name}?`,
                                confirmText: "Delete",
                                cancelText: "Cancel",
                                confirmColor: ButtonColors.RED,
                                onConfirm: () => {
                                    try {
                                        removePlugin(plugin.id);
                                        setRemoved(true);
                                    } catch (e) {
                                        showToast((e as Error).message, getAssetIDByName("Small"));
                                    }
                                }
                            })}
                        >
                            <Image style={styles.icon} source={getAssetIDByName("ic_message_delete")} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                copyText(plugin.id);
                                showToast("Copied plugin URL to clipboard.", getAssetIDByName("toast_copy_link"));
                            }}
                        >
                            <Image style={styles.icon} source={getAssetIDByName("copy")} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                plugin.update = !plugin.update;
                                showToast(`${plugin.update ? "Enabled" : "Disabled"} updates for ${plugin.manifest.name}.`, getAssetIDByName("toast_image_saved"));
                            }}
                        >
                            <Image style={styles.icon} source={getAssetIDByName(plugin.update ? "Check" : "Small")} />
                        </TouchableOpacity>
                        {settings && <TouchableOpacity onPress={() => navigation.push("VendettaCustomPage", {
                            title: plugin.manifest.name,
                            render: settings,
                        })}>
                            <Image style={styles.icon} source={getAssetIDByName("settings")} />
                        </TouchableOpacity>}
                    </RN.View>
                }
            />
        </RN.View>
    )
}
