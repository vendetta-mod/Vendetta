import { ButtonColors } from "@types";
import { ReactNative as RN } from "@metro/common";
import { themes } from "@lib/themes";
import { useProxy } from "@lib/storage";
import { ErrorBoundary, Button, HelpMessage } from "@ui/components";
import settings from "@lib/settings";
import ThemeCard from "@ui/settings/components/ThemeCard";

export default function Themes() {
    useProxy(settings);
    useProxy(themes);

    return (
        <ErrorBoundary>
            <RN.View style={{ flex: 1 }}>
                {settings.safeMode?.enabled && <RN.View style={{ margin: 10 }}>
                    <HelpMessage messageType={0}>You are in Safe Mode, meaning themes have been temporarily disabled.{settings.safeMode?.currentThemeId && " If a theme appears to be causing the issue, you can press below to disable it persistently."}</HelpMessage>
                    {settings.safeMode?.currentThemeId && <Button
                        text="Disable Theme"
                        color={ButtonColors.BRAND}
                        size="small"
                        onPress={() => {
                            delete settings.safeMode?.currentThemeId;
                        }}
                        style={{ marginTop: 8 }}
                    />}
                </RN.View>}
                <RN.FlatList
                    data={Object.values(themes)}
                    renderItem={({ item, index }) => <ThemeCard theme={item} index={index} />}
                    keyExtractor={item => item.id}
                />
            </RN.View>
        </ErrorBoundary>
    )
}