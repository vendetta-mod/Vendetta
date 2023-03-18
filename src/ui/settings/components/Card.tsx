import { ReactNative as RN, stylesheet } from "@metro/common";
import { Forms } from "@ui/components";
import { getAssetIDByName } from "@ui/assets";
import { semanticColors } from "@ui/color";

const { FormRow, FormSwitch, FormRadio } = Forms;

// TODO: These styles work weirdly. iOS has cramped text, Android with low DPI probably does too. Fix?
const styles = stylesheet.createThemedStyleSheet({
    card: {
        backgroundColor: semanticColors?.BACKGROUND_SECONDARY,
        borderRadius: 5,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    header: {
        padding: 0,
        backgroundColor: semanticColors?.BACKGROUND_TERTIARY,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    actions: {
        flexDirection: "row-reverse",
        alignItems: "center",
    },
    icon: {
        width: 22,
        height: 22,
        marginLeft: 5,
        tintColor: semanticColors?.INTERACTIVE_NORMAL,
    },
})

interface Action {
    icon: string;
    onPress: () => void;
}

interface CardProps {
    index?: number;
    headerLabel: string | React.ComponentType | (string | JSX.Element)[];
    headerIcon?: string;
    toggleType: "switch" | "radio";
    toggleValue?: boolean;
    onToggleChange?: (v: boolean) => void;
    descriptionLabel?: string | React.ComponentType;
    actions?: Action[];
}

export default function Card(props: CardProps) {
    let pressableState = props.toggleValue ?? false;

    return ( 
        <RN.View style={[styles.card, {marginTop: props.index === 0 ? 10 : 0}]}>
            <FormRow
                style={styles.header}
                label={props.headerLabel}
                leading={props.headerIcon && <FormRow.Icon source={getAssetIDByName(props.headerIcon)} />}
                trailing={props.toggleType === "switch" ? 
                    (<FormSwitch
                        style={RN.Platform.OS === "android" && { marginVertical: -15 }}
                        value={props.toggleValue}
                        onValueChange={props.onToggleChange}
                    />)
                    :
                    (<RN.Pressable onPress={() => {
                        pressableState = !pressableState;
                        props.onToggleChange?.(pressableState)
                    }}>
                        {/* TODO: Look into making this respect brand color */}
                        <FormRadio selected={props.toggleValue} />
                    </RN.Pressable>)
                }
            />
            <FormRow
                label={props.descriptionLabel}
                trailing={
                    <RN.View style={styles.actions}>
                        {props.actions?.map(({ icon, onPress }) => (
                            <RN.TouchableOpacity
                                onPress={onPress}
                            >
                                <RN.Image style={styles.icon} source={getAssetIDByName(icon)} />
                            </RN.TouchableOpacity>
                        ))}
                    </RN.View>
                }
            />
        </RN.View>
    )
}
