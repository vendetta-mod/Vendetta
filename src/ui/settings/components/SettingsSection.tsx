import { React } from "@metro/common";
import { Forms } from "@ui/components";

const { FormRow, FormSection } = Forms;

interface SettingsSectionProps {
    navigation: any;
}

export default function SettingsSection({ navigation }: SettingsSectionProps) {
    return ( 
        <FormSection key="Vendetta" title="Vendetta">
            <FormRow
                label="Settings"
                trailing={FormRow.Arrow}
                onPress={() => navigation.push("VendettaSettings")}
            />
            <FormRow
                label="Asset Browser"
                trailing={FormRow.Arrow}
                onPress={() => navigation.push("VendettaAssetBrowser")}
            />
        </FormSection>
    )
}