import { ButtonColors, Plugin } from "@types";
import { NavigationNative } from "@metro/common";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { showConfirmationAlert } from "@ui/alerts";
import { removePlugin, startPlugin, stopPlugin, getSettings } from "@lib/plugins";
import copyText from "@utils/copyText";
import Card from "./Card";

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
            actions={[
                {
                    icon: "ic_message_delete",
                    onPress: () => showConfirmationAlert({
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
                    }),
                },
                {
                    icon: "copy",
                    onPress: () => {
                        copyText(plugin.id);
                        showToast("Copied plugin URL to clipboard.", getAssetIDByName("toast_copy_link"));
                    },
                },
                {
                    icon: plugin.update ? "Check" : "Small",
                    onPress: () => {
                        plugin.update = !plugin.update;
                        showToast(`${plugin.update ? "Enabled" : "Disabled"} updates for ${plugin.manifest.name}.`, getAssetIDByName("toast_image_saved"));
                    }
                },
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
