import { ReactNative as RN, stylesheet } from "@metro/common";
import { Forms, Search } from "@ui/components";
import { all } from "@ui/assets";
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
    const [searchName, setSearchName] = React.useState("");

    return (
        <RN.View style={{ flex: 1 }}>
            <Search
                style={styles.search}
                onChangeText={(v: string) => setSearchName(v)}
                placeholder="Search..."
            />
            <RN.FlatList
                data={Object.values(all).filter(a => a.name.includes(searchName))}
                renderItem={({ item }) => (
                    <>
                        <AssetDisplay asset={item} />
                        <FormDivider />
                    </>
                )}
                keyExtractor={item => item.name}
            />
        </RN.View>
    )
}