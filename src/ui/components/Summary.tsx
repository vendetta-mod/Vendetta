import { getAssetIDByName } from "@ui/assets";
import { ReactNative as RN } from "@metro/common";
import { Forms } from "@ui/components";

// TODO: Animated would be awesome
// TODO: Destructuring Forms doesn't work here. Why?

interface SummaryProps {
    label: string;
    icon?: string;
    noPadding?: boolean;
    children: JSX.Element | JSX.Element[];
}

export default function Summary({ label, icon, noPadding = false, children }: SummaryProps) {
    const [hidden, setHidden] = React.useState(true);

    return (
        <>
            <Forms.FormRow
                label={label}
                leading={icon && <Forms.FormRow.Icon source={getAssetIDByName(icon)} />}
                trailing={<Forms.FormRow.Arrow style={{ transform: [{ rotate: `${hidden ? 180 : 90}deg` }] }} source={getAssetIDByName("down_arrow")} />}
                onPress={() => setHidden(!hidden)}
            />
            {!hidden && <>
                <Forms.FormDivider />
                <RN.View style={!noPadding && { paddingHorizontal: 15 }}>{children}</RN.View>
            </>}
        </>
    )
}