import { ReactNative as RN, url } from "@metro/common";
import { DISCORD_SERVER, GITHUB } from "@lib/constants";
import { getAssetIDByName } from "@ui/assets";
import { Forms } from "@ui/components";
import Version from "@ui/settings/components/Version";
import settings from "@lib/settings";

const { FormRow, FormSection, FormDivider, FormSwitch } = Forms;
const InfoDictionaryManager = RN.NativeModules.InfoDictionaryManager;
const hermesProps = window.HermesInternal.getRuntimeProperties();
const rnVer = RN.Platform.constants.reactNativeVersion;

export default function General() {
    const [devSettings, setDevSettings] = React.useState(settings.developerSettings || false);

    const versions = [
        {
            label: "Discord",
            version: `${InfoDictionaryManager.Version} (${InfoDictionaryManager.Build})`,
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
            icon: "ic_badge_staff",
        },
    ];

    return ( 
        <RN.ScrollView>
            <FormSection title="Links">
                <FormRow
                    label="Discord Server"
                    leading={<FormRow.Icon source={getAssetIDByName("Discord")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => url.openURL(DISCORD_SERVER)}
                />
                <FormDivider />
                <FormRow
                    label="GitHub"
                    leading={<FormRow.Icon source={getAssetIDByName("img_account_sync_github_white")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => url.openURL(GITHUB)}
                />
            </FormSection>
            <FormSection title="Versions">
                {versions.map((v) => (
                    <>
                        <Version label={v.label} version={v.version} icon={v.icon} />
                        <FormDivider />
                    </>
                ))}
            </FormSection>
            <FormSection title="Actions">
                <FormRow
                    label="Reload Discord"
                    leading={<FormRow.Icon source={getAssetIDByName("ic_message_retry")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => RN.NativeModules.BundleUpdaterManager.reload()}
                />
                <FormDivider />
                <FormRow 
                    label="Developer Settings"
                    leading={<FormRow.Icon source={getAssetIDByName("ic_progress_wrench_24px")} />}
                    trailing={<FormSwitch 
                        value={devSettings}
                        onValueChange={(v: boolean) => {
                            settings.developerSettings = v;
                            setDevSettings(v);
                        }}
                    />}
                />
            </FormSection>
        </RN.ScrollView>
    )
}