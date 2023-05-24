import { SettingsItem, SettingsScreen, SettingsPressable, SettingsSwitch } from "@types";
import { ReactNative as RN, NavigationNative } from "@metro/common";
import { sections } from "@ui/settings";
import { ErrorBoundary, Forms } from "@ui/components";

const { FormRow, FormSwitchRow, FormSection, FormDivider } = Forms;

export default function SettingsSection() {
    const navigation = NavigationNative.useNavigation();

    // TODO: Deduplicate code
    // TODO: This is bad and we probably should find another way
    const typeToComponent: Record<SettingsItem["type"], React.ComponentType<any>> = {
        screen: ({ item }: { item: SettingsScreen }) => <FormRow 
            label={item.label}
            subLabel={item.description}
            leading={item.icon ? typeof item.icon === "number" ? <FormRow.Icon source={item.icon} /> : <RN.Image source={item.icon} /> : undefined}
            trailing={FormRow.Arrow}
            onPress={() => navigation.push(item.route)}
        />,
        pressable: ({ item }: { item: SettingsPressable }) => <FormRow 
            label={item.label}
            subLabel={item.description}
            leading={item.icon ? typeof item.icon === "number" ? <FormRow.Icon source={item.icon} /> : <RN.Image source={item.icon} /> : undefined}
            onPress={item.onPress}
        />,
        switch: ({ item }: { item: SettingsSwitch }) => <FormSwitchRow
            label={item.label}
            subLabel={item.description}
            leading={item.icon ? typeof item.icon === "number" ? <FormRow.Icon source={item.icon} /> : <RN.Image source={item.icon} /> : undefined}
            value={item.value}
            onValueChange={item.onValueChange}
        />
    }

    return (
        <ErrorBoundary>
            {sections.map(section => (
                <FormSection title={section.title}>
                    {section.items.filter(item => item.renderCondition?.() ?? true).map((item, index) => {
                        const RowComponent = typeToComponent[item.type];

                        return (<>
                            <RowComponent item={item} />
                            {index !== section.items.length - 1 && <FormDivider />}
                        </>)
                    })}
                </FormSection>
            ))}
        </ErrorBoundary>
    )
}