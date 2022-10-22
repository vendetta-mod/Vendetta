import { Asset } from "@types";
import { React, ReactNative as RN } from "@metro/common";
import { Forms } from "@ui/components";

interface AssetDisplayProps {
    asset: Asset;
}

const { FormRow } = Forms;

const styles = RN.StyleSheet.create({
    asset: {
        width: 32,
        height: 32,
    }
});

export default function AssetDisplay({ asset }: AssetDisplayProps) {
    return (
        <FormRow
            label={`${asset.name} - ${asset.id}`}
            trailing={() => <RN.Image source={asset.id} style={styles.asset} />}
        />
    )
}