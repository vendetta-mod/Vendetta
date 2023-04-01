import { ReactNative as RN } from "@metro/common";
import { useProxy } from "@lib/storage";
import { plugins } from "@lib/plugins";
import PluginCard from "@ui/settings/components/PluginCard";
import ErrorBoundary from "@ui/components/ErrorBoundary";

export default function Plugins() {
    useProxy(plugins);

    return (
        <ErrorBoundary>
            <RN.View style={{ flex: 1 }}>
                <RN.FlatList
                    data={Object.values(plugins)}
                    renderItem={({ item, index }) => <PluginCard plugin={item} index={index} />}
                    keyExtractor={item => item.id}
                />
            </RN.View>
        </ErrorBoundary>
    )
}