import { findByProps } from "@metro/filters";
import { PROXY_PREFIX } from "@lib/constants";
import { after } from "@lib/patcher";
import { installPlugin } from "@lib/plugins";
import { installTheme } from "@lib/themes";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";

const showSimpleActionSheet = findByProps("showSimpleActionSheet");

export default () => after("showSimpleActionSheet", showSimpleActionSheet, ([{ key, header: { title: url }, options }]) => {
    if (key !== "LongPressUrl") return;

    let urlType: string;
    if (url.startsWith(PROXY_PREFIX)) {
        urlType = "Plugin";
    } else if (url.endsWith(".json")) {
        urlType = "Theme";
    } else return;

    options.push({
        label: `Install ${urlType}`, onPress: () =>
            (urlType === "Plugin" ? installPlugin : installTheme)(url).then(() => {
                showToast("Successfully installed", getAssetIDByName("Check"));
            }).catch((e: Error) => {
                showToast(e.message, getAssetIDByName("Small"));
            }),
    });
});