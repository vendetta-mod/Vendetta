import { ReactNative as RN, stylesheet, navigation } from "@metro/common";
import { Forms, General } from "@ui/components";
import { Plugin } from "@types";
import { getAssetIDByName } from "@ui/assets";
import { getSettings, removePlugin, startPlugin, stopPlugin } from "@lib/plugins";
import { showToast } from "@ui/toasts";
import PluginSettings from "@ui/settings/components/PluginSettings";

const { FormRow, FormSwitch } = Forms;
const { TouchableOpacity, Image } = General;

const styles = stylesheet.createThemedStyleSheet({
    card: {
        backgroundColor: stylesheet.ThemeColorMap.BACKGROUND_SECONDARY,
        borderRadius: 5,
        margin: 10,
    },
    header: {
        backgroundColor: stylesheet.ThemeColorMap.BACKGROUND_TERTIARY,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    actions: {
        justifyContent: "flex-end",
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: 22,
        height: 22,
        marginLeft: 5,
        tintColor: stylesheet.ThemeColorMap.INTERACTIVE_NORMAL,
    }
})

interface PluginCardProps {
    plugin: Plugin;
}

export default function PluginCard({ plugin }: PluginCardProps) {
    const [enabled, setEnabled] = React.useState(plugin.enabled);
    const [update, setUpdate] = React.useState(plugin.update);
    const [removed, setRemoved] = React.useState(false);
    const Settings = getSettings(plugin.id);

    // This is bad, but I don't think I have much choice - Beef
    // Once the user re-renders the page, this is not taken into account anyway.
    if (removed) return <></>;

    return ( 
        <RN.View style={styles.card}>
            <FormRow
                style={styles.header}
                label={`${plugin.manifest.name} by ${plugin.manifest.authors.map(i => i.name).join(", ")}`}
                leading={<FormRow.Icon source={getAssetIDByName(plugin.manifest.vendetta.icon || "ic_application_command_24px")} />}
                trailing={
                    <FormSwitch
                        value={plugin.enabled}
                        onValueChange={(v: boolean) => {
                            if (v) startPlugin(plugin.id); else stopPlugin(plugin.id);
                            setEnabled(v);
                        }}
                    />
                }
            />
            <FormRow
                label={plugin.manifest.description}
                trailing={
                    <RN.View style={styles.actions}>
                        <TouchableOpacity
                            onPress={() => {
                                removePlugin(plugin.id);
                                setRemoved(true);
                            }}
                        >
                            <Image style={styles.icon} source={getAssetIDByName("ic_message_delete")} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                plugin.update = !plugin.update;
                                setUpdate(plugin.update);
                                showToast(`${plugin.update ? "Enabled" : "Disabled"} updates for ${plugin.manifest.name}.`, getAssetIDByName("toast_image_saved"));
                            }}
                        >
                            <Image style={styles.icon} source={getAssetIDByName(plugin.update ? "Check" : "Small")} />
                        </TouchableOpacity>
                        {Settings && <TouchableOpacity
                            onPress={() => {
                                navigation.push(PluginSettings, {
                                    plugin: plugin,
                                    children: Settings,
                                });
                            }}
                        >
                            <Image style={styles.icon} source={getAssetIDByName("settings")} />
                        </TouchableOpacity>}
                    </RN.View>
                }
            />
        </RN.View>
    )
}