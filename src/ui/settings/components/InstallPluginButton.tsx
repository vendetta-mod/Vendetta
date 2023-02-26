import { HTTP_REGEX } from "@/lib/constants";
import { semanticColors } from "@ui/color";
import { installPlugin } from "@lib/plugins";
import { clipboard, stylesheet } from "@metro/common";
import { showInputAlert } from "@ui/alerts";
import { getAssetIDByName } from "@ui/assets";
import { General } from "@ui/components";

const { TouchableOpacity, Image } = General;

const styles = stylesheet.createThemedStyleSheet({
	icon: {
		marginRight: 10,
		tintColor: semanticColors.HEADER_PRIMARY,
	}
});

export default function InstallPluginButton() {
	return (
		<TouchableOpacity onPress={() =>
			clipboard.getString().then((content) =>
				showInputAlert({
					title: "Install Plugin",
					initialValue: HTTP_REGEX.test(content) ? content : "",
					placeholder: "https://example.com/",
					onConfirm: installPlugin,
					confirmText: "Install",
					confirmColor: undefined,
					cancelText: "Cancel"
				}))
		}>
			<Image style={styles.icon} source={getAssetIDByName("ic_add_24px")} />
		</TouchableOpacity >
	);
};