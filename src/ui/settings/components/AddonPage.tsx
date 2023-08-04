import { PluginManifest, ThemeData } from "@types";
import { ReactNative as RN } from "@metro/common";
import { useProxy } from "@lib/storage";
import { HelpMessage, ErrorBoundary, Search } from "@ui/components";
import { CardWrapper } from "@ui/settings/components/Card";
import settings from "@lib/settings";

interface AddonPageProps<T> {
    items: Record<string, T & { id: string, manifest?: PluginManifest, data?: ThemeData }>;
    safeModeMessage: string;
    safeModeExtras?: JSX.Element | JSX.Element[];
    card: React.ComponentType<CardWrapper<T>>;
}

export default function AddonPage<T>({ items, safeModeMessage, safeModeExtras, card: CardComponent }: AddonPageProps<T>) {
    useProxy(settings);
    useProxy(items);
    const [search, setSearch] = React.useState("");

    return (
        <ErrorBoundary>
            <RN.FlatList
                ListHeaderComponent={<>
                    {settings.safeMode?.enabled && <RN.View style={{ marginBottom: 10 }}>
                        <HelpMessage messageType={0}>{safeModeMessage}</HelpMessage>
                        {safeModeExtras}
                    </RN.View>}
                    <Search
                        style={{ marginBottom: 10 }}
                        onChangeText={(v: string) => setSearch(v.toLowerCase().replace(/\s/g, ""))}
                        placeholder="Search"
                    />
                </>}
                style={{ paddingHorizontal: 10, paddingTop: 10 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                data={Object.values(items).filter(i =>
                    i.id?.toLowerCase().replace(/\s/g, "").includes(search) ||
                    i.manifest?.name.toLowerCase().replace(/\s/g, "").includes(search) ||
                    i.data?.name.toLowerCase().replace(/\s/g, "").includes(search)
                )}
                renderItem={({ item, index }) => <CardComponent item={item} index={index} />}
            />
        </ErrorBoundary>
    );
}