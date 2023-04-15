import { Indexable } from "@types";
import { ReactNative as RN } from "@metro/common";
import { useProxy } from "@lib/storage";
import { HelpMessage, ErrorBoundary, Search } from "@ui/components";
import { CardWrapper } from "@ui/settings/components/Card";
import settings from "@lib/settings";

interface AddonPageProps<T> {
    items: Indexable<T & { id: string }>;
    safeModeMessage: string;
    safeModeExtras?: JSX.Element | JSX.Element[];
    card: React.ComponentType<CardWrapper<T>>;
}

export default function AddonPage<T>({ items, safeModeMessage, safeModeExtras, card: CardComponent }: AddonPageProps<T>) {
    useProxy(settings)
    useProxy(items);
    const [search, setSearch] = React.useState("");

    return (
        <ErrorBoundary>
            <RN.ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                {settings.safeMode?.enabled && <RN.View style={{ marginBottom: 10 }}>
                    <HelpMessage messageType={0}>{safeModeMessage}</HelpMessage>
                    {safeModeExtras}
                </RN.View>}
                <Search
                    style={{ marginBottom: 10 }}
                    onChangeText={(v: string) => setSearch(v.toLowerCase())}
                    placeholder="Search"
                />
                {/* TODO: When I am more awake, implement better searching than just by ID */}
                {/* TODO: Also when I am more awake, make the search bar not scroll with the cards */}
                {Object.values(items).filter(i => i.id?.toLowerCase().includes(search)).map((i, id) => <CardComponent item={i} index={id} />)}
            </RN.ScrollView>
        </ErrorBoundary>
    )
}