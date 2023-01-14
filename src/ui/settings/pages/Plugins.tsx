import { ReactNative as RN } from "@metro/common";
import { Forms } from "@ui/components";
import { showToast } from "@ui/toasts";
import { getAssetIDByName } from "@ui/assets";
import { fetchPlugin, plugins } from "@lib/plugins";
import PluginCard from "@ui/settings/components/PluginCard";

const { FormInput, FormRow } = Forms;

export default function Plugins() {
    const [pluginUrl, setPluginUrl] = React.useState("");
    const [pluginList, setPluginList] = React.useState(plugins);

    return (
        <RN.View style={{ flex: 1 }}>
            <FormInput 
                value={pluginUrl}
                onChange={(v: string) => setPluginUrl(v)}
                title="PLUGIN URL"
            />
            <FormRow
                label="Install plugin"
                leading={<FormRow.Icon source={getAssetIDByName("ic_add_perk_24px")} />}
                onPress={() => {
                        fetchPlugin(pluginUrl).then(() => {
                            setPluginUrl("");
                            setPluginList(plugins);
                        }).catch((e: Error) => {
                            showToast(e.message, getAssetIDByName("Small"));
                        });
                    }
                }
            />
            <RN.FlatList
                style={{ marginTop: 10 }}
                data={Object.values(pluginList)}
                renderItem={({ item }) => <PluginCard plugin={item} />}
                keyExtractor={item => item.id}
            />
        </RN.View>
    )
}