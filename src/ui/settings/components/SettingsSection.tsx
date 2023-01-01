import { Forms } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";

const { FormRow, FormSection } = Forms;

interface SettingsSectionProps {
    navigation: any;
}

export default function SettingsSection({ navigation }: SettingsSectionProps) {
    return ( 
        <FormSection key="Vendetta" title="Vendetta">
            <FormRow
                label="General"
                leading={() => <FormRow.Icon source={getAssetIDByName("settings")} />}
                trailing={FormRow.Arrow}
                onPress={() => navigation.push("VendettaSettings")}
            />
            <FormRow
                label="Asset Browser"
                leading={() => <FormRow.Icon source={getAssetIDByName("grid")} />}
                trailing={FormRow.Arrow}
                onPress={() => navigation.push("VendettaAssetBrowser")}
            />
        </FormSection>
    )
}