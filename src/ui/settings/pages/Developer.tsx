import { ReactNative as RN } from "@metro/common";
import { Forms } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { connectToDebugger } from "@lib/debug";
import { all } from "@ui/assets";
import settings from "@lib/settings";
import AssetDisplay from "@ui/settings/components/AssetDisplay";

const { FormSection, FormRow, FormInput, FormDivider } = Forms;

export default function Developer() {
    const [debuggerUrl, setDebuggerUrl] = React.useState(settings.debuggerUrl || "");
    const [searchName, setSearchName] = React.useState("");

    return (
        <>
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
            </FormSection>
            <FormSection title="Assets">
                <FormInput 
                    value={searchName}
                    onChange={(v: string) => setSearchName(v)}
                    title="SEARCH"
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
        </>
    )
}