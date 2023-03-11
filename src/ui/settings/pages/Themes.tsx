import { ReactNative as RN } from "@metro/common";
import { useProxy } from "@lib/storage";
import ErrorBoundary from "@ui/components/ErrorBoundary";
import { themes } from "@/lib/themes";
import ThemeCard from "../components/ThemeCard";

export default function Themes() {
    useProxy(themes);

    return (
        <ErrorBoundary>
            <RN.View style={{ flex: 1 }}>
                <RN.FlatList
                    data={Object.values(themes)}
                    renderItem={({ item, index }) => <ThemeCard theme={item} index={index} />}
                    keyExtractor={item => item.id}
                />
            </RN.View>
        </ErrorBoundary>
    )
}