import { NavigationNative } from "@metro/common";
import { ErrorBoundary, Forms } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { useProxy } from "@lib/storage";
import settings from "@lib/settings";

const { FormRow, FormSection, FormDivider } = Forms;

export default function SettingsSection() {
    const navigation = NavigationNative.useNavigation();
    useProxy(settings);

    return (
        <ErrorBoundary>
            <FormSection key="Vendetta" title="Vendetta">
                <FormRow
                    label="General"
                    leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => navigation.push("VendettaSettings")}
                />
                <FormDivider />
                <FormRow
                    label="Plugins"
                    leading={<FormRow.Icon source={getAssetIDByName("debug")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => navigation.push("VendettaPlugins")}
                />
                {window.__vendetta_loader?.features.themes && (
                    <>
                        <FormDivider />
                        <FormRow
                            label="Themes"
                            leading={<FormRow.Icon source={getAssetIDByName("ic_theme_24px")} />}
                            trailing={FormRow.Arrow}
                            onPress={() => navigation.push("VendettaThemes")}
                        />
                    </>
                )}
                {settings.developerSettings && (
                    <>
                        <FormDivider />
                        <FormRow
                            label="Developer"
                            leading={<FormRow.Icon source={getAssetIDByName("ic_progress_wrench_24px")} />}
                            trailing={FormRow.Arrow}
                            onPress={() => navigation.push("VendettaDeveloper")}
                        />
                    </>
                )}
                <FormDivider />
                <FormRow
                    label="This will trigger Discord's ErrorBoundary"
                    leading={<FormRow.Icon source={getAssetIDByName("ic_warning_24px")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => navigation.push("VendettaErrorBoundaryTriggerer")}
                />
            </FormSection>
        </ErrorBoundary>
    )
}