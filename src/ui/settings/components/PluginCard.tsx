import { ButtonColors, Plugin } from "@types";
import { NavigationNative, clipboard } from "@metro/common";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { showConfirmationAlert } from "@ui/alerts";
import { removePlugin, startPlugin, stopPlugin, getSettings } from "@lib/plugins";
import Card from "@ui/settings/components/Card";

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
        <Card
            index={index}
            // TODO: Actually make use of user IDs
            headerLabel={`${plugin.manifest.name} by ${plugin.manifest.authors.map(i => i.name).join(", ")}`}
            headerIcon={plugin.manifest.vendetta?.icon || "ic_application_command_24px"}
            toggleType="switch"
            toggleValue={plugin.enabled}
            onToggleChange={(v: boolean) => {
                try {
                    if (v) startPlugin(plugin.id); else stopPlugin(plugin.id);
                } catch (e) {
                    showToast((e as Error).message, getAssetIDByName("Small"));
                }
            }}
            descriptionLabel={plugin.manifest.description}
            overflowTitle={plugin.manifest.name}
            overflowActions={[
                {   
                    icon: "ic_download_24px",
                    label: plugin.update ? "Disable updates" : "Enable updates",
                    onPress: () => {
                        plugin.update = !plugin.update;
                        showToast(`${plugin.update ? "Enabled" : "Disabled"} updates for ${plugin.manifest.name}.`, getAssetIDByName("toast_image_saved"));
                    }
                },
                {
                    icon: "copy",
                    label: "Copy plugin URL",
                    onPress: () => {
                        clipboard.setString(plugin.id);
                        showToast("Copied plugin URL to clipboard.", getAssetIDByName("toast_copy_link"));
                    }
                },
                {
                    icon: "ic_message_delete",
                    label: "Delete plugin",
                    isDestructive: true,
                    onPress: () => showConfirmationAlert({
                        title: "Wait!",
                        content: `Are you sure you wish to delete ${plugin.manifest.name}? This will remove all of the plugin's data.`,
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
                    }),
                },
            ]}
            actions={[
                ...(settings ? [{
                    icon: "settings",
                    onPress: () => navigation.push("VendettaCustomPage", {
                        title: plugin.manifest.name,
                        render: settings,
                    })
                }] : []),
            ]}
        />
    )
}
