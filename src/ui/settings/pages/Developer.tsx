import { ReactNative as RN, navigation } from "@metro/common";
import { Forms } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { connectToDebugger } from "@lib/debug";
import { useProxy } from "@lib/storage";
import settings from "@lib/settings";
import logger from "@lib/logger";
import Subpage from "@ui/settings/components/Subpage";
import AssetBrowser from "@ui/settings/pages/AssetBrowser";

const { FormSection, FormRow, FormInput, FormDivider } = Forms;

export default function Developer() {
    useProxy(settings);

    return (
        <RN.ScrollView style={{ flex: 1 }}>
            <FormSection title="Debug" titleStyleType="no_border">
                <FormInput 
                    value={settings.debuggerUrl}
                    onChange={(v: string) => settings.debuggerUrl = v}
                    placeholder="127.0.0.1:9090"
                    title="DEBUGGER URL"
                />
                <FormDivider />
                <FormRow
                    label="Connect to debug websocket"
                    leading={<FormRow.Icon source={getAssetIDByName("copy")} />}
                    onPress={() => connectToDebugger(settings.debuggerUrl)}
                />
                <FormDivider />
                {window.__vendetta_rdc && <FormRow
                    label="Connect to React DevTools"
                    leading={<FormRow.Icon source={getAssetIDByName("ic_badge_staff")} />}
                    onPress={() => {
                        try {
                            window.__vendetta_rdc?.connectToDevTools({
                                host: settings.debuggerUrl.split(":")?.[0],
                                resolveRNStyle: RN.StyleSheet.flatten,
                            });
                        } catch(e) {
                            // TODO: Check if this ever actually catches anything
                            logger.error("Failed to connect to React DevTools!", e);
                            showToast("Failed to connect to React DevTools!", getAssetIDByName("Small"));
                        }
                    }}
                />}
            </FormSection>
            <FormSection title="Other">
                <FormRow
                    label="Asset Browser"
                    leading={<FormRow.Icon source={getAssetIDByName("ic_media_upload")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => navigation.push(Subpage, {
                        name: "Asset Browser",
                        children: AssetBrowser,
                    })}
                />
            </FormSection>
        </RN.ScrollView>
    )
}