import { React, ReactNative as RN } from "@metro/common";
import { Forms } from "@ui/components";
import { all } from "@ui/assets";
import AssetDisplay from "@ui/settings/components/AssetDisplay";

const { FormInput } = Forms

export default function AssetBrowser() {
    const [searchName, setSearchName] = React.useState("");

    return (
        <>
            <FormInput 
                value={searchName}
                onChange={(v: string) => setSearchName(v)}
                title="SEARCH"
            />
            <RN.FlatList
                data={Object.values(all).filter(a => a.name.includes(searchName))}
                renderItem={({ item }) => (
                    <AssetDisplay asset={item} />
                )}
                keyExtractor={item => item.name}
            />
        </>
    )
}