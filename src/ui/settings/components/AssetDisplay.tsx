import { Asset } from "@types";
import { ReactNative as RN, clipboard } from "@metro/common";
import { showToast } from "@ui/toasts";
import { getAssetIDByName } from "@ui/assets";
import { Forms } from "@ui/components";

interface AssetDisplayProps {
    asset: Asset;
}

const { FormRow } = Forms;

export default function AssetDisplay({ asset }: AssetDisplayProps) {
    return (
        <FormRow
            label={`${asset.name} - ${asset.id}`}
            trailing={<RN.Image source={asset.id} style={{ width: 32, height: 32 }} />}
            onPress={() => {
                clipboard.setString(asset.name);
                showToast("Copied asset name to clipboard.", getAssetIDByName("toast_copy_link"));
            }}
        />
    )
}