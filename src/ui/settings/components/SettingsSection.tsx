import { findByProps } from "@metro/filters";
import { React } from "@metro/common";

const { FormRow, FormSection } = findByProps("FormSection");

interface SettingsSectionProps {
    navigation: any;
}

export default function SettingsSection({ navigation }: SettingsSectionProps) {
    return ( 
        <FormSection key="Vendetta" title="Vendetta">
            <FormRow
                label="About"
                trailing={FormRow.Arrow}
                onPress={() => navigation.push("Vendetta")}
            />
        </FormSection>
    )
}