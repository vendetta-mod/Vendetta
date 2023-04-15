import { ReactNative as RN } from "@metro/common";
import { all } from "@ui/assets";
import { Forms, Search } from "@ui/components";
import ErrorBoundary from "@ui/components/ErrorBoundary";
import AssetDisplay from "@ui/settings/components/AssetDisplay";

const { FormDivider } = Forms;

export default function AssetBrowser() {
    const [search, setSearch] = React.useState("");

    return (
        <ErrorBoundary>
            <RN.View style={{ flex: 1 }}>
                <Search
                    style={{ margin: 10 }}
                    onChangeText={(v: string) => setSearch(v)}
                    placeholder="Search"
                />
                <RN.FlatList
                    data={Object.values(all).filter(a => a.name.includes(search) || a.id.toString() === search)}
                    renderItem={({ item }) => <AssetDisplay asset={item} />}
                    ItemSeparatorComponent={FormDivider}
                    keyExtractor={item => item.name}
                />
            </RN.View>
        </ErrorBoundary>
    )
}