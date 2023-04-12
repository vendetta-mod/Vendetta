import { ReactNative as RN } from "@metro/common";
import { useProxy } from "@lib/storage";
import { plugins } from "@lib/plugins";
import { HelpMessage } from "@ui/components";
import settings from "@lib/settings";
import PluginCard from "@ui/settings/components/PluginCard";
import ErrorBoundary from "@ui/components/ErrorBoundary";

export default function Plugins() {
    useProxy(settings)
    useProxy(plugins);

    return (
        <ErrorBoundary>
            <RN.View style={{ flex: 1 }}>
                {settings.safeMode?.enabled && <RN.View style={{ margin: 10 }}>
                    <HelpMessage messageType={0}>You are in Safe Mode, so plugins cannot be loaded. Disable any misbehaving plugins, then return to Normal Mode from the General settings page. </HelpMessage>
                </RN.View>}
                <RN.FlatList
                    data={Object.values(plugins)}
                    renderItem={({ item, index }) => <PluginCard plugin={item} index={index} />}
                    keyExtractor={item => item.id}
                />
            </RN.View>
        </ErrorBoundary>
    )
}