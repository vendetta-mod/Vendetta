import { ReactNative as RN, constants, stylesheet } from "@metro/common";
import { findByName, findByProps, findByStoreName } from "@metro/filters";
import { after } from "@lib/patcher";
import { semanticColors } from "@ui/color";
import { Button, Codeblock, ErrorBoundary as _ErrorBoundary } from "@ui/components";

const ErrorBoundary = findByName("ErrorBoundary");

// React Native's included SafeAreaView only adds padding on iOS.
const { SafeAreaView } = findByProps("useSafeAreaInsets");
// Let's just pray they have this.
const { BadgableTabBar } = findByProps("BadgableTabBar");

const ThemeStore = findByStoreName("ThemeStore");

const { TextStyleSheet } = findByProps("TextStyleSheet");
const styles = stylesheet.createThemedStyleSheet({
    container: {
        flex: 1,
        backgroundColor: semanticColors.BACKGROUND_PRIMARY,
    },
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerTitle: {
        ...TextStyleSheet["heading-md/semibold"],
        textAlign: "center",
        textTransform: "uppercase",
        color: semanticColors.HEADER_PRIMARY,
    },
    headerDescription: {
        ...TextStyleSheet["text-sm/medium"],
        textAlign: "center",
        color: semanticColors.TEXT_MUTED,
    },
    main: {
        flex: 6,
        paddingHorizontal: 16,
    },
    footer: {
        justifyContent: "flex-end",
        paddingHorizontal: 32,
        paddingVertical: 8,
    },
});

export default function initSafeMode() {
    const patches = new Array<Function>;

    patches.push(after("render", ErrorBoundary.prototype, function (this: any, _, ret) {
        if (!this.state.error) return;

        return (
            <_ErrorBoundary>
                <SafeAreaView style={styles.container}>
                    <RN.View style={styles.header}>
                        <RN.Image style={{ flex: 1, resizeMode: "contain", paddingRight: 4 }} source={ThemeStore.theme === "light" ? ret.props.lightSource : ret.props.darkSource} />
                        <RN.View style={{ flex: 2, paddingLeft: 4 }}>
                            <RN.Text style={styles.headerTitle}>{ret.props.title}</RN.Text>
                            <RN.Text style={styles.headerDescription}>{ret.props.body}</RN.Text>
                        </RN.View>
                    </RN.View>
                    <RN.View style={styles.main}>
                        <RN.View style={{ paddingBottom: 8 }}>
                            {/* Perhaps tabs should be moved out of this, and we should set the default active tab instead of falling back to messages.
                            Are errors caught by errorboundary guaranteed to have component stack? */}
                            <BadgableTabBar
                                tabs={[{ id: "message", title: "Message" }, { id: "stack", title: "Stack Trace" }, { id: "componentStack", title: "Component" }]}
                                activeTab={this.state.activeTab ?? "message"}
                                onTabSelected={(tab: string) => { this.setState({ activeTab: tab }) }}
                            />
                        </RN.View>
                        <Codeblock selectable style={{ flex: 1, textAlignVertical: "top" }}>{this.state.error[this.state.activeTab ?? "message"]}</Codeblock>
                    </RN.View>
                    <RN.View style={styles.footer}>
                        <Button text="Restart Discord" size="small" onPress={this.handleReload} />
                        {/* <Button style={{ marginTop: 8 }} text="Enter Safe Mode" size="small" color="red" onPress={() => {}}} /> */}
                    </RN.View>
                </SafeAreaView>
            </_ErrorBoundary>
        )
    }));
};
