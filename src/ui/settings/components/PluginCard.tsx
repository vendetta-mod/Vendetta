import { ReactNative as RN, stylesheet } from "@metro/common";
import { Forms, General } from "@ui/components";
import { Plugin } from "@types";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { removePlugin, startPlugin, stopPlugin, showSettings, getSettings } from "@lib/plugins";
import copyText from "@lib/utils/copyText";

const { FormRow, FormSwitch } = Forms;
const { TouchableOpacity, Image } = General;

const styles = stylesheet.createThemedStyleSheet({
    card: {
        backgroundColor: stylesheet.ThemeColorMap.BACKGROUND_SECONDARY,
        borderRadius: 5,
        margin: 10,
        marginTop: 0,
    },
    header: {
        backgroundColor: stylesheet.ThemeColorMap.BACKGROUND_TERTIARY,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    actions: {
        justifyContent: "flex-end",
        flexDirection: "row-reverse",
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
    const [removed, setRemoved] = React.useState(false);
    // This is needed because of React™
    if (removed) return null;

    return ( 
        <RN.View style={styles.card}>
            <FormRow
                style={styles.header}
                label={`${plugin.manifest.name} by ${plugin.manifest.authors.map(i => i.name).join(", ")}`}
                leading={<FormRow.Icon source={getAssetIDByName(plugin.manifest.vendetta?.icon || "ic_application_command_24px")} />}
                trailing={
                    <FormSwitch
                        value={plugin.enabled}
                        onValueChange={(v: boolean) => {
                            if (v) startPlugin(plugin.id); else stopPlugin(plugin.id);
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
                        {getSettings(plugin.id) && <TouchableOpacity onPress={() => showSettings(plugin)}>
                            <Image style={styles.icon} source={getAssetIDByName("settings")} />
                        </TouchableOpacity>}
                    </RN.View>
                }
            />
        </RN.View>
    )
}
