import { ReactNative as RN, stylesheet } from "@metro/common";
import { Forms } from "@ui/components";
import { Plugin } from "@types";
import { getAssetIDByName } from "@/ui/assets";
import { startPlugin, stopPlugin } from "@/lib/plugins";

const { FormRow, FormSwitch } = Forms;

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
    }
})

interface PluginCardProps {
    plugin: Plugin;
}

export default function PluginCard({ plugin }: PluginCardProps) {
    const [enabled, setEnabled] = React.useState(plugin.enabled);

    return ( 
        <RN.View style={styles.card}>
            <FormRow
                style={styles.header}
                label={`${plugin.manifest.name} by ${plugin.manifest.author}`}
                leading={<FormRow.Icon source={getAssetIDByName(plugin.manifest.icon || "ic_application_command_24px")} />}
                trailing={
                    <FormSwitch
                        value={plugin.enabled}
                        onValueChange={(v: boolean) => {
                            alert(v);
                            if (v) startPlugin(plugin.id); else stopPlugin(plugin.id);
                            setEnabled(v);
                        }}
                    />
                }
            />
            <FormRow
                label={plugin.manifest.description}
            />
        </RN.View>
    )
}