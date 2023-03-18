import { ButtonColors, Plugin } from "@types";
import { NavigationNative, clipboard, users, profiles, stylesheet, ReactNative as RN } from "@metro/common";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { showConfirmationAlert } from "@ui/alerts";
import { removePlugin, startPlugin, stopPlugin, getSettings } from "@lib/plugins";
import Card from "@ui/settings/components/Card";
import { findByProps } from "@/lib/metro/filters";
import { semanticColors } from "@/ui/color";

interface PluginCardProps {
    plugin: Plugin;
    index: number;
}

const styles = stylesheet.createThemedStyleSheet({
    link: {
        color: semanticColors?.TEXT_LINK
    }
});

const asyncUsers = findByProps("getUser", "fetchProfile");
async function showUserProfile(id: string) {
    if (!users.getUser(id)) await asyncUsers.fetchProfile(id);
    profiles.showUserProfile({ userId: id });
};

export default function PluginCard({ plugin, index }: PluginCardProps) {
    const settings = getSettings(plugin.id);
    const navigation = NavigationNative.useNavigation();
    const [removed, setRemoved] = React.useState(false);

    // This is needed because of React™
    if (removed) return null;
    const authors = plugin.manifest.authors;

    return (
        <Card 
            index={index}
            // TODO: Find a method to add seperators to authors
            headerLabel={[plugin.manifest.name, ...(authors ? ["by ", ...(authors ? authors.map(i => i.id ?
                <RN.Text
                    style={styles.link}
                    onPress={() => showUserProfile(i.id!!)}
                >
                    {i.name}
                </RN.Text> : i.name) : [])] : "")]}
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
                        clipboard.setString(plugin.id);
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
