import { ReactNative as RN, NavigationNative } from "@metro/common";
import { Forms } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { connectToDebugger } from "@lib/debug";
import { useProxy } from "@lib/storage";
import settings, { loaderConfig } from "@lib/settings";
import ErrorBoundary from "@ui/components/ErrorBoundary";

const { FormSection, FormRow, FormSwitchRow, FormInput, FormDivider } = Forms;

export default function Developer() {
    const navigation = NavigationNative.useNavigation();

    useProxy(settings);
    useProxy(loaderConfig);

    return (
        <ErrorBoundary>
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
                    {window.__vendetta_rdc && <>
                        <FormDivider />
                        <FormRow
                            label="Connect to React DevTools"
                            leading={<FormRow.Icon source={getAssetIDByName("ic_badge_staff")} />}
                            onPress={() => window.__vendetta_rdc?.connectToDevTools({
                                host: settings.debuggerUrl.split(":")?.[0],
                                resolveRNStyle: RN.StyleSheet.flatten,
                            })}
                        />
                    </>}
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
                    <FormDivider />
                    {loaderConfig.customLoadUrl.enabled && <>
                        <FormInput
                            value={loaderConfig.customLoadUrl.url}
                            onChange={(v: string) => loaderConfig.customLoadUrl.url = v}
                            placeholder="http://localhost:4040/vendetta.js"
                            title="VENDETTA URL"
                        />
                        <FormDivider />
                    </>}
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
                        leading={<FormRow.Icon source={getAssetIDByName("ic_image")} />}
                        trailing={FormRow.Arrow}
                        onPress={() => navigation.push("VendettaAssetBrowser")}
                    />
                </FormSection>
            </RN.ScrollView>
        </ErrorBoundary>
    )
}
