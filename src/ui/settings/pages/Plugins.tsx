import { ReactNative as RN } from "@metro/common";
import { Forms } from "@ui/components";
import { showToast } from "@ui/toasts";
import { getAssetIDByName } from "@ui/assets";
import { useProxy } from "@lib/storage";
import { plugins, fetchPlugin, startPlugin } from "@lib/plugins";
import PluginCard from "@ui/settings/components/PluginCard";

const { FormInput, FormRow } = Forms;

export default function Plugins() {
    useProxy(plugins);
    const [pluginUrl, setPluginUrl] = React.useState("");

    return (
        <RN.View style={{ flex: 1 }}>
            <FormInput 
                value={pluginUrl}
                onChange={(v: string) => setPluginUrl(v)}
                placeholder="https://example.com/"
                title="PLUGIN URL"
            />
            <FormRow
                label="Install plugin"
                leading={<FormRow.Icon source={getAssetIDByName("ic_add_18px")} />}
                onPress={() => {
                        fetchPlugin(pluginUrl).then(() => {
                            setPluginUrl("");
                        }).catch((e: Error) => {
                            showToast(e.message, getAssetIDByName("Small"));
                        });
                    }
                }
            />
            <RN.FlatList
                style={{ marginTop: 10 }}
                data={Object.values(plugins)}
                renderItem={({ item }) => <PluginCard plugin={item} />}
                keyExtractor={item => item.id}
            />
        </RN.View>
    )
}