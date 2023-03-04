import { SummaryProps } from "@types";
import { Forms } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { ReactNative as RN } from "@metro/common";

// TODO: Destructuring Forms doesn't work here. Why?

export default function Summary({ label, icon, noPadding = false, noAnimation = false, children }: SummaryProps) {
    const [hidden, setHidden] = React.useState(true);

    return (
        <>
            <Forms.FormRow
                label={label}
                leading={icon && <Forms.FormRow.Icon source={getAssetIDByName(icon)} />}
                trailing={<Forms.FormRow.Arrow style={{ transform: [{ rotate: `${hidden ? 180 : 90}deg` }] }} />}
                onPress={() => {
                    setHidden(!hidden);
                    if (!noAnimation) RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
                }}
            />
            {!hidden && <>
                <Forms.FormDivider />
                <RN.View style={!noPadding && { paddingHorizontal: 15 }}>{children}</RN.View>
            </>}
        </>
    )
}