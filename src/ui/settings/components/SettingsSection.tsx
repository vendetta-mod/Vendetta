import { React } from "@metro/common";
import { findByProps } from "@metro/filters";

const { FormRow, FormSection } = findByProps("FormSection");

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
        </FormSection>
    )
}