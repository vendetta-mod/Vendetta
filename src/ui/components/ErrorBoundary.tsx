import { ErrorBoundaryProps } from "@types";
import { React, ReactNative as RN, stylesheet } from "@metro/common";
import { Forms, Button, Codeblock } from "@ui/components";

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
                <Codeblock selectable style={{ marginBottom: 5 }}>{this.state.errText}</Codeblock>
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