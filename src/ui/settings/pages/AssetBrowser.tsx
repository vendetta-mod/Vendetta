import { useProxy } from "@/lib/storage";
import { ReactNative as RN, stylesheet } from "@metro/common";
import { all } from "@ui/assets";
import { Forms, Search } from "@ui/components";
import settings from "@lib/settings";
import ErrorBoundary from "@ui/components/ErrorBoundary";
import AssetDisplay from "@ui/settings/components/AssetDisplay";

const { FormDivider } = Forms;

const styles = stylesheet.createThemedStyleSheet({
    search: {
        margin: 0,
        padding: 15,
        borderBottomWidth: 0,
        background: "none",
        backgroundColor: "none",
    }
});

export default function AssetBrowser() {
    const [search, setSearch] = React.useState("");
    useProxy(settings);

    return (
        <ErrorBoundary>
            <RN.View style={{ flex: 1, ...(settings.flip && { transform: [{ rotate: "180deg" }] }) }}>
                <Search
                    style={styles.search}
                    onChangeText={(v: string) => setSearch(v)}
                    placeholder="Search"
                />
                <RN.FlatList
                    data={Object.values(all).filter(a => a.name.includes(search) || a.id.toString() === search)}
                    renderItem={({ item }) => (
                        <>
                            <AssetDisplay asset={item} />
                            <FormDivider />
                        </>
                    )}
                    keyExtractor={item => item.name}
                />
            </RN.View>
        </ErrorBoundary>
    )
}