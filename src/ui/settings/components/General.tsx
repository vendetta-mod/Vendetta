import { React, ReactNative as RN, url } from "@metro/common";
import { DISCORD_SERVER, GITHUB } from "@lib/constants";
import { connectToDebugWS } from "@lib/debug";
import { getAssetIDByName } from "@ui/assets";
import { Forms } from "@ui/components";
import Version from "./Version";

const { FormRow, FormSection, FormInput } = Forms;
const hermesProps = window.HermesInternal.getRuntimeProperties();
const rnVer = RN.Platform.constants.reactNativeVersion;

export default function General() {
    const [debuggerUrl, setDebuggerUrl] = React.useState("");

    const versions = [
        {
            label: "Discord",
            version: RN.NativeModules.InfoDictionaryManager.Version,
            icon: "Discord",
        },
        {
            label: "React",
            version: React.version,
            icon: "ic_category_16px",
        },
        {
            label: "React Native",
            version: `${rnVer.major || 0}.${rnVer.minor || 0}.${rnVer.patch || 0}`,
            icon: "mobile",
        },
        {
            label: "Hermes",
            version: `${hermesProps["OSS Release Version"]} ${hermesProps["Build"]} | Bytecode ${hermesProps["Bytecode Version"]}`,
            icon: "ic_hammer_and_chisel_24px",
        },
    ];

    return ( 
        <RN.ScrollView>
            {/* Why is there still a divider? */}
            <FormSection title="Links" android_noDivider>
                <FormRow
                    label="Discord Server"
                    leading={() => <FormRow.Icon source={getAssetIDByName("Discord")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => url.openURL(DISCORD_SERVER)}
                />
                <FormRow
                    label="GitHub"
                    leading={() => <FormRow.Icon source={getAssetIDByName("img_account_sync_github_white")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => url.openURL(GITHUB)}
                />
            </FormSection>
            <FormSection title="Debug">
                <FormInput 
                    value={debuggerUrl}
                    onChange={(v: string) => setDebuggerUrl(v)}
                    title="DEBUGGER URL"
                />
                <FormRow
                    label="Connect to debug websocket"
                    leading={() => <FormRow.Icon source={getAssetIDByName("copy")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => connectToDebugWS(debuggerUrl)}
                />
                <FormRow
                    label="Reload Discord"
                    leading={() => <FormRow.Icon source={getAssetIDByName("ic_message_retry")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => RN.NativeModules.BundleUpdaterManager.reload()}
                />
            </FormSection>
            <FormSection title="Versions">
                {versions.map((v) => <Version label={v.label} version={v.version} icon={v.icon} /> )}
            </FormSection>
        </RN.ScrollView>
    )
}