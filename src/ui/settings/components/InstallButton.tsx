import { ReactNative as RN, clipboard, stylesheet } from "@metro/common";
import { HTTP_REGEX } from "@lib/constants";
import { showInputAlert } from "@ui/alerts";
import { getAssetIDByName } from "@ui/assets";
import { semanticColors } from "@ui/color";

const styles = stylesheet.createThemedStyleSheet({
    icon: {
        marginRight: 10,
        tintColor: semanticColors.HEADER_PRIMARY,
    }
});

interface InstallButtonProps {
    alertTitle: string;
    installFunction: (id: string) => Promise<void>;
}

export default function InstallButton({ alertTitle, installFunction: fetchFunction }: InstallButtonProps) {
    return (
        <RN.TouchableOpacity onPress={() =>
            clipboard.getString().then((content) =>
                showInputAlert({
                    title: alertTitle,
                    initialValue: HTTP_REGEX.test(content) ? content : "",
                    placeholder: "https://example.com/",
                    onConfirm: (input: string) => fetchFunction(input),
                    confirmText: "Install",
                    confirmColor: undefined,
                    cancelText: "Cancel"
                })
            )
        }>
            <RN.Image style={styles.icon} source={getAssetIDByName("ic_add_24px")} />
        </RN.TouchableOpacity>
    );
}