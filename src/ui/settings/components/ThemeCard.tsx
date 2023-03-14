import { ButtonColors, Theme } from "@types";
import { clipboard } from "@metro/common";
import { getCurrentThemeData, removeTheme, selectTheme } from "@lib/themes";
import { getAssetIDByName } from "@ui/assets";
import { showConfirmationAlert } from "@ui/alerts";
import { showToast } from "@ui/toasts";
import Card from "@ui/settings/components/Card";

interface ThemeCardProps {
    theme: Theme;
    index: number;
}

async function selectAndReload(value: boolean, id: string) {
    await selectTheme(value ? id : "default");
    window.nativeModuleProxy.BundleUpdaterManager.reload();
}

export default function ThemeCard({ theme, index }: ThemeCardProps) {
    const currentTheme = getCurrentThemeData();
    const [enabled, setEnabled] = React.useState(currentTheme?.name === theme.data.name);
    const [removed, setRemoved] = React.useState(false);

    // This is needed because of React™
    if (removed) return null;

    return (
        <Card 
            index={index}
            headerLabel={theme.data.name}
            descriptionLabel={theme.data.description}
            toggleType="radio"
            toggleValue={enabled}
            onToggleChange={(v: boolean) => {
                setEnabled(v);
                selectAndReload(v, theme.id)
            }}
            actions={[
                {
                    icon: "ic_message_delete",
                    onPress: () => showConfirmationAlert({
                        title: "Wait!",
                        content: `Are you sure you wish to delete ${theme.data.name}?`,
                        confirmText: "Delete",
                        cancelText: "Cancel",
                        confirmColor: ButtonColors.RED,
                        onConfirm: () => {
                            removeTheme(theme.id).then((wasSelected) => {
                                setRemoved(true);
                                if (wasSelected) selectAndReload(false, theme.id);
                            }).catch((e) => {
                                showToast((e as Error).message, getAssetIDByName("Small"))
                            })
                        }
                    }),
                },
                {
                    icon: "copy",
                    onPress: () => {
                        clipboard.setString(theme.id);
                        showToast("Copied theme URL to clipboard.", getAssetIDByName("toast_copy_link"));
                    },
                },
            ]}
        />
    )
}
