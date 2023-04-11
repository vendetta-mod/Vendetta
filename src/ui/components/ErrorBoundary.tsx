import { ErrorBoundaryProps } from "@types";
import { React, ReactNative as RN, stylesheet, constants } from "@metro/common";
import { Forms, Button } from "@ui/components";
import { semanticColors } from "@ui/color";

interface ErrorBoundaryState {
    hasErr: boolean;
    errText?: string;
}

const styles = stylesheet.createThemedStyleSheet({
    view: {
        flex: 1,
        flexDirection: "column",
        margin: 10,
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 5,
    },
    codeblock: {
        fontFamily: constants.Fonts.CODE_SEMIBOLD,
        includeFontPadding: false,
        fontSize: 12,
        backgroundColor: semanticColors.BACKGROUND_SECONDARY,
        padding: 5,
        borderRadius: 5,
        marginBottom: 5,
    }
});

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasErr: false };
    }

    static getDerivedStateFromError = (error: Error) => ({ hasErr: true, errText: error.message });

    render() {
        if (!this.state.hasErr) return this.props.children;

        return (
            <RN.ScrollView style={styles.view}>
                <Forms.FormText style={styles.title}>Uh oh.</Forms.FormText>
                <Forms.FormText style={styles.codeblock}>{this.state.errText}</Forms.FormText>
                <Button
                    color={Button.Colors.RED}
                    size={Button.Sizes.MEDIUM}
                    look={Button.Looks.FILLED}
                    onPress={() => this.setState({ hasErr: false, errText: undefined })}
                    text="Retry"
                />
            </RN.ScrollView>
        )
    }
}