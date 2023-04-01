import { ReactNative as RN } from "@metro/common";
import { useProxy } from "@lib/storage";
import { plugins } from "@lib/plugins";
import settings from "@lib/settings";
import PluginCard from "@ui/settings/components/PluginCard";
import ErrorBoundary from "@ui/components/ErrorBoundary";

export default function Plugins() {
    useProxy(plugins);
    useProxy(settings)

    return (
        <ErrorBoundary>
            <RN.View style={{ flex: 1, ...(settings.flip && { transform: [{ rotate: "180deg" }] }) }}>
                <RN.FlatList
                    data={Object.values(plugins)}
                    renderItem={({ item, index }) => <PluginCard plugin={item} index={index} />}
                    keyExtractor={item => item.id}
                />
            </RN.View>
        </ErrorBoundary>
    )
}