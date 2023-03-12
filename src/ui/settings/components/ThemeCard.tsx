// Temporary: This is directly taken from PluginCard

import { getCurrentThemeData, selectTheme } from "@/lib/themes";
import { ReactNative as RN, stylesheet } from "@metro/common";
import { Theme } from "@types";
import { semanticColors } from "@ui/color";
import { Forms, General } from "@ui/components";

const { FormRow, FormSwitch } = Forms;

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

interface ThemeCardProps {
    theme: Theme;
    index: number;
}

export default function ThemeCard({ theme, index }: ThemeCardProps) {
    const currentTheme = getCurrentThemeData();
    const [enabled, setEnabled] = React.useState(currentTheme?.name === theme.data.name);

    return (
        <RN.View style={[styles.card, { marginTop: index === 0 ? 10 : 0 }]}>
            <FormRow
                style={styles.header}
                label={theme.data.name}
                trailing={
                    <FormSwitch
                        style={RN.Platform.OS === "android" && { marginVertical: -15 }}
                        value={enabled}
                        onValueChange={(v: boolean) => {
                            setEnabled(v);
                            selectTheme(v ? theme.id : "default");
                            setImmediate(() => window.nativeModuleProxy.BundleUpdaterManager.reload())
                        }}
                    />
                }
            />
        </RN.View>
    )
}
