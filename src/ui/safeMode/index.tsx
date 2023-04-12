import { findByName, findByProps, findByStoreName } from "@metro/filters";
import { after } from "@lib/patcher";
import { ReactNative, constants, stylesheet } from "@metro/common";
import { semanticColors } from "@ui/color";

const ErrorBoundary = findByName("ErrorBoundary");

const { View, Image, Text, TextInput } = ReactNative;
// React Native's included SafeAreaView only adds padding on iOS.
const { SafeAreaView } = findByProps("useSafeAreaInsets");
// We should be safe to use this, considering Discord themselves use it.
const { default: Button } = findByProps("ButtonColors");
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
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        textAlign: 'center',
        ...TextStyleSheet["heading-md/semibold"],
        color: semanticColors.HEADER_PRIMARY,
        textTransform: "uppercase",
    },
    headerDescription: {
        textAlign: 'center',
        ...TextStyleSheet["text-sm/medium"],
        color: semanticColors.TEXT_MUTED,
    },
    main: {
        flex: 6,
        paddingHorizontal: 16,
    },
    codeBlock: {
        flex: 1,
        fontFamily: constants.Fonts.CODE_SEMIBOLD,
        fontSize: 12,
        backgroundColor: semanticColors.BACKGROUND_SECONDARY,
        color: semanticColors.TEXT_NORMAL,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: semanticColors.BACKGROUND_TERTIARY,
        padding: 10,
    },
    footer: {
        paddingHorizontal: 32,
        paddingVertical: 8,
        justifyContent: 'flex-end',
    },
});

export default function initSafeMode() {
    const patches = new Array<Function>;

    patches.push(after("render", ErrorBoundary.prototype, function (this: any, _, ret) {
        if (!this.state.error) return;

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Image style={{ flex: 1, resizeMode: "contain", paddingRight: 4 }} source={ThemeStore.theme === "light" ? ret.props.lightSource : ret.props.darkSource} />
                    <View style={{ flex: 2, paddingLeft: 4 }}>
                        <Text style={styles.headerTitle}>{ret.props.title}</Text>
                        <Text style={styles.headerDescription}>{ret.props.body}</Text>
                    </View>
                </View>
                <View style={styles.main}>
                    <View style={{ paddingBottom: 8 }}>
                        {/* Perhaps tabs should be moved out of this, and we should set the default active tab instead of falling back to messages.
                            Are errors caught by errorboundary guaranteed to have component stack? */}
                        <BadgableTabBar
                            tabs={[{ id: "message", title: "Message" }, { id: "stack", title: "Stack Trace" }, { id: "componentStack", title: "Component" }]}
                            activeTab={this.state.activeTab ?? "message"}
                            onTabSelected={(tab: string) => { this.setState({ activeTab: tab }) }}
                        />
                    </View>
                    {/* This is what we must do for text selection on both platforms */}
                    {ReactNative.Platform.select({
                        ios: <TextInput editable={false} multiline style={styles.codeBlock} value={this.state.error[this.state.activeTab ?? "message"]} />,
                        default: <Text selectable style={styles.codeBlock}>{this.state.error[this.state.activeTab ?? "message"]}</Text>,
                    })}
                </View>
                <View style={styles.footer}>
                    <Button text="Restart Discord" size="small" onPress={this.handleReload} />
                    {/* <Button style={{ marginTop: 8 }} text="Enter Safe Mode" size="small" color="red" onPress={() => {}}} /> */}

                </View>
            </SafeAreaView>
        )
    }));
};
