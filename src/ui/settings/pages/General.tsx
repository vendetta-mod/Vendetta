import { ReactNative as RN, url, invites } from "@metro/common";
import { DISCORD_SERVER, GITHUB } from "@lib/constants";
import { getAssetIDByName } from "@ui/assets";
import { Forms } from "@ui/components";
import { getDebugInfo } from "@lib/debug";
import { useProxy } from "@lib/storage";
import settings from "@lib/settings";
import Version from "@ui/settings/components/Version";

const { FormRow, FormSwitchRow, FormSection, FormDivider } = Forms;
const debugInfo = getDebugInfo();

export default function General() {
    useProxy(settings);

    const versions = [
        {
            label: "Vendetta",
            version: debugInfo.vendetta.version,
            icon: "ic_progress_wrench_24px"
        },
        {
            label: "Discord",
            version: `${debugInfo.discord.version} (${debugInfo.discord.build})`,
            icon: "Discord",
        },
        {
            label: "React",
            version: debugInfo.react.version,
            icon: "ic_category_16px",
        },
        {
            label: "React Native",
            version: debugInfo.react.nativeVersion,
            icon: "mobile",
        },
        {
            label: "Hermes",
            version: `${debugInfo.hermes.version} ${debugInfo.hermes.buildType} (Bytecode ${debugInfo.hermes.bytecodeVersion})`,
            icon: "ic_server_security_24px",
        },
    ];

    const platformInfo = [
        {
            label: "Operating System",
            version: `${debugInfo.os.name} ${debugInfo.os.version}`,
            icon: "ic_cog_24px"
        },
        ...(debugInfo.os.sdk ? [{
            label: "SDK",
            version: debugInfo.os.sdk,
            icon: "ic_profile_badge_verified_developer_color"
        }] : []),
        {
            label: "Manufacturer",
            version: debugInfo.device.manufacturer,
            icon: "ic_hammer_and_chisel_24px"
        },
        {
            label: "Brand",
            version: debugInfo.device.brand,
            icon: "ic_settings_boost_24px"
        },
        {
            label: "Model",
            version: debugInfo.device.model,
            icon: "ic_phonelink_24px"
        },
        {
            label: RN.Platform.select({ android: "Codename", ios: "Machine ID" })!,
            version: debugInfo.device.codename,
            icon: "ic_compose_24px"
        }
    ];

    return (
        <RN.ScrollView>
            <FormSection title="Links">
                <FormRow
                    label="Discord Server"
                    leading={<FormRow.Icon source={getAssetIDByName("Discord")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => invites.acceptInviteAndTransitionToInviteChannel({ inviteKey: DISCORD_SERVER })}
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
            <FormSection title="Platform Info">
                {platformInfo.map((p) => (
                    <>
                        <Version label={p.label} version={p.version} icon={p.icon} />
                        <FormDivider />
                    </>
                ))}
            </FormSection>
            <FormSection title="Actions">
                <FormRow
                    label="Reload Discord"
                    leading={<FormRow.Icon source={getAssetIDByName("ic_message_retry")} />}
                    onPress={() => RN.NativeModules.BundleUpdaterManager.reload()}
                />
                <FormDivider />
                <FormSwitchRow
                    label="Developer Settings"
                    leading={<FormRow.Icon source={getAssetIDByName("ic_progress_wrench_24px")} />}
                    value={settings.developerSettings}
                    onValueChange={(v: boolean) => {
                        settings.developerSettings = v;
                    }}
                />
            </FormSection>
        </RN.ScrollView>
    )
}