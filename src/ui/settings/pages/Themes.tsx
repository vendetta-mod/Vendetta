import { themes } from "@/lib/themes";
import { useProxy } from "@lib/storage";
import { ReactNative as RN } from "@metro/common";
import settings from "@lib/settings";
import ErrorBoundary from "@ui/components/ErrorBoundary";
import ThemeCard from "@ui/settings/components/ThemeCard";

export default function Themes() {
    useProxy(themes);
    useProxy(settings)

    return (
        <ErrorBoundary>
            <RN.View style={{ flex: 1, ...(settings.flip && { transform: [{ rotate: "180deg" }] }) }}>
                <RN.FlatList
                    data={Object.values(themes)}
                    renderItem={({ item, index }) => <ThemeCard theme={item} index={index} />}
                    keyExtractor={item => item.id}
                />
            </RN.View>
        </ErrorBoundary>
    )
}