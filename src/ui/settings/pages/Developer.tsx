import { ReactNative as RN, navigation } from "@metro/common";
import { Forms } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@/ui/toasts";
import { connectToDebugger } from "@lib/debug";
import settings from "@lib/settings";
import logger from "@lib/logger";
import Subpage from "@ui/settings/components/Subpage";
import AssetBrowser from "@ui/settings/pages/AssetBrowser";

const { FormSection, FormRow, FormInput, FormDivider } = Forms;

export default function Developer() {
    const [debuggerUrl, setDebuggerUrl] = React.useState(settings.debuggerUrl || "");

    return (
        <RN.View style={{ flex: 1 }}>
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
                    onPress={() => connectToDebugger(debuggerUrl)}
                />
                <FormDivider />
                {window.__vendetta_rdc && <FormRow
                    label="Connect to React DevTools"
                    leading={() => <FormRow.Icon source={getAssetIDByName("ic_badge_staff")} />}
                    onPress={() => {
                        try {
                            window.__vendetta_rdc?.connectToDevTools({
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
            <FormSection title="Other">
                <FormRow
                    label="Asset Browser"
                    leading={() => <FormRow.Icon source={getAssetIDByName("ic_media_upload")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => navigation.push(Subpage, {
                        name: "Asset Browser",
                        children: AssetBrowser,
                    })}
                />
            </FormSection>
        </RN.View>
    )
}