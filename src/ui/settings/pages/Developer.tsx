import { ReactNative as RN, NavigationNative, stylesheet, constants } from "@metro/common";
import { Forms, General } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { connectToDebugger } from "@lib/debug";
import { useProxy } from "@lib/storage";
import settings, { loaderConfig } from "@lib/settings";
import logger from "@lib/logger";

const { FormSection, FormRow, FormSwitchRow, FormInput, FormDivider } = Forms;
const { Text } = General;

const styles = stylesheet.createThemedStyleSheet({
    code: {
        fontFamily: constants.Fonts.CODE_SEMIBOLD,
        includeFontPadding: false,
        fontSize: 12,
    }
});

export default function Developer() {
    const navigation = NavigationNative.useNavigation();

    useProxy(settings);
    useProxy(loaderConfig);

    return (
        <RN.ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
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
            {window.__vendetta_loader?.features.loaderConfig && <FormSection title="Loader config">
                <FormSwitchRow
                    label="Load from custom url"
                    subLabel={"Load Vendetta from a custom endpoint."}
                    leading={<FormRow.Icon source={getAssetIDByName("copy")} />}
                    value={loaderConfig.customLoadUrl.enabled}
                    onValueChange={(v: boolean) => {
                        loaderConfig.customLoadUrl.enabled = v;
                    }}
                />
                {loaderConfig.customLoadUrl.enabled && <FormInput
                    value={loaderConfig.customLoadUrl.url}
                    onChange={(v: string) => loaderConfig.customLoadUrl.url = v}
                    placeholder="http://localhost:4040/vendetta.js"
                    title="VENDETTA URL"
                />}
                {window.__vendetta_loader.features.devtools && <FormSwitchRow
                    label="Load React DevTools"
                    subLabel={`Version: ${window.__vendetta_loader.features.devtools.version}`}
                    leading={<FormRow.Icon source={getAssetIDByName("ic_badge_staff")} />}
                    value={loaderConfig.loadReactDevTools}
                    onValueChange={(v: boolean) => {
                        loaderConfig.loadReactDevTools = v;
                    }}
                />}
            </FormSection>}
            <FormSection title="Other">
                <FormRow
                    label="Asset Browser"
                    leading={<FormRow.Icon source={getAssetIDByName("ic_media_upload")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => navigation.push("VendettaAssetBrowser")}
                />
            </FormSection>
        </RN.ScrollView>
    )
}
