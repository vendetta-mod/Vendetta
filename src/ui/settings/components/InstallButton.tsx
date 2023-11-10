import { ReactNative as RN, clipboard, stylesheet } from "@metro/common";
import { HTTP_REGEX_MULTI } from "@lib/constants";
import { showInputAlert } from "@ui/alerts";
import { getAssetIDByName } from "@ui/assets";
import { semanticColors } from "@ui/color";

interface InstallButtonProps {
    alertTitle: string;
    installFunction: (id: string) => Promise<void>;
}

const useStyles = stylesheet.createStyles({
    icon: {
        marginRight: 10,
        tintColor: semanticColors.HEADER_PRIMARY,
    },
});

export default function InstallButton({ alertTitle, installFunction: fetchFunction }: InstallButtonProps) {
    const styles = useStyles();

    return (
        <RN.TouchableOpacity onPress={() =>
            clipboard.getString().then((content) =>
                showInputAlert({
                    title: alertTitle,
                    initialValue: content.match(HTTP_REGEX_MULTI)?.[0] ?? "",
                    placeholder: "https://example.com/",
                    onConfirm: (input: string) => fetchFunction(input),
                    confirmText: "Install",
                    cancelText: "Cancel",
                })
            )
        }>
            <RN.Image style={styles.icon} source={getAssetIDByName("ic_add_24px")} />
        </RN.TouchableOpacity>
    );
}
