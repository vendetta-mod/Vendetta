import { clipboard, stylesheet } from "@metro/common";
import { HTTP_REGEX } from "@lib/constants";
import { installPlugin } from "@lib/plugins";
import { showInputAlert } from "@ui/alerts";
import { getAssetIDByName } from "@ui/assets";
import { semanticColors } from "@ui/color";
import { General } from "@ui/components";
import { fetchTheme } from "@lib/themes";

const { TouchableOpacity, Image } = General;

const styles = stylesheet.createThemedStyleSheet({
    icon: {
        marginRight: 10,
        tintColor: semanticColors.HEADER_PRIMARY,
    }
});

export function InstallButton({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Image style={styles.icon} source={getAssetIDByName("ic_add_24px")} />
        </TouchableOpacity >
    );
}

export function InstallThemeButton() {
    return (
        <InstallButton onPress={() =>
            clipboard.getString().then((content) =>
                showInputAlert({
                    title: "Install Theme",
                    initialValue: HTTP_REGEX.test(content) ? content : "",
                    placeholder: "https://example.com/",
                    onConfirm: (input: string) => {
                        fetchTheme(input)
                    },
                    confirmText: "Install",
                    confirmColor: undefined,
                    cancelText: "Cancel"
                }))
        } />
    );
}

export function InstallPluginButton() {
    return (
        <InstallButton onPress={() =>
            clipboard.getString().then((content) =>
                showInputAlert({
                    title: "Install Plugin",
                    initialValue: HTTP_REGEX.test(content) ? content : "",
                    placeholder: "https://example.com/",
                    onConfirm: installPlugin,
                    confirmText: "Install",
                    confirmColor: undefined,
                    cancelText: "Cancel"
                }))
        } />
    );
};