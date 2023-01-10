import { ReactNative as RN, stylesheet } from "@metro/common";
import { Forms, Search } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@/ui/toasts";
import { connectToDebugger } from "@lib/debug";
import { all } from "@ui/assets";
import settings from "@lib/settings";
import logger from "@lib/logger";
import AssetDisplay from "@ui/settings/components/AssetDisplay";

const { FormSection, FormRow, FormInput, FormDivider } = Forms;
const { connectToDevTools } = window.__vendetta_rdc;

const styles = stylesheet.createThemedStyleSheet({
    search: {
        margin: 0,
        padding: 0,
        paddingRight: 15,
        paddingLeft: 15,
        borderBottomWidth: 0,
        backgroundColor: "none"
    }
})

export default function Developer() {
    const [debuggerUrl, setDebuggerUrl] = React.useState(settings.debuggerUrl || "");
    const [searchName, setSearchName] = React.useState("");

    return (
        <RN.View>
            <FormSection title="Debug">
                <FormInput 
                    value={debuggerUrl}
                    onChange={(v: string) => {
                        settings.debuggerUrl = v;
                        setDebuggerUrl(v);
                    }}
                    title="DEBUGGER URL"
                />
                <FormDivider />
                <FormRow
                    label="Connect to debug websocket"
                    leading={() => <FormRow.Icon source={getAssetIDByName("copy")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => connectToDebugger(debuggerUrl)}
                />
                <FormDivider />
                {connectToDevTools && <FormRow
                    label="Connect to React DevTools"
                    leading={() => <FormRow.Icon source={getAssetIDByName("ic_badge_staff")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => {
                        try {
                            connectToDevTools({
                                host: debuggerUrl.split(":")[0],
                                resolveRNStyle: RN.StyleSheet.flatten,
                            });
                        } catch(e) {
                            logger.error("Failed to connect to React DevTools!", e);
                            showToast("Failed to connect to React DevTools!", getAssetIDByName("Small"));
                        }
                    }}
                />}
            </FormSection>
            <FormSection title="Assets">
                <Search
                    style={styles.search}
                    onChangeText={(v: string) => setSearchName(v)}
                    placeholder="Search..."
                />
                <RN.FlatList
                    data={Object.values(all).filter(a => a.name.includes(searchName))}
                    renderItem={({ item }) => (
                        <>
                            <AssetDisplay asset={item} />
                            <FormDivider />
                        </>
                    )}
                    keyExtractor={item => item.name}
                />
            </FormSection>
        </RN.View>
    )
}