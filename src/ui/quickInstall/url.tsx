import { PROXY_PREFIX, THEMES_CHANNEL_ID } from "@lib/constants";
import { findByProps } from "@metro/filters";
import { ReactNative as RN, channels, url } from "@metro/common";
import { after, instead } from "@lib/patcher";
import { installPlugin } from "@lib/plugins";
import { installTheme } from "@lib/themes";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { showConfirmationAlert } from "../alerts";

const showSimpleActionSheet = findByProps("showSimpleActionSheet");
const handleClick = findByProps("handleClick");
const { openURL } = url;
const { getChannelId } = channels;
const { getChannel } = findByProps("getChannel");

const { TextStyleSheet } = findByProps("TextStyleSheet");

function typeFromUrl(url: string) {
    if (url.startsWith(PROXY_PREFIX)) {
        return "Plugin";
    } else if (url.endsWith(".json") && window.__vendetta_loader?.features.themes) {
        return "Theme";
    } else return;
}

function installWithToast(type: "Plugin" | "Theme", url: string) {
    (type === "Plugin" ? installPlugin : installTheme)(url).then(() => {
        showToast("Successfully installed", getAssetIDByName("Check"));
    }).catch((e: Error) => {
        showToast(e.message, getAssetIDByName("Small"));
    });
}

export default () => {
    const patches = new Array<Function>;
    
    patches.push(after("showSimpleActionSheet", showSimpleActionSheet, (args) => {
        if (args[0].key !== "LongPressUrl") return;
        const { header: { title: url }, options } = args[0];

        const urlType = typeFromUrl(url);
        if (!urlType) return;

        options.push({
            label: `Install ${urlType}`,
            onPress: () => installWithToast(urlType, url),
        });
    }));

    patches.push(instead("handleClick", handleClick, async function (this: any, args, orig) {
        const { href: url } = args[0];

        const urlType = typeFromUrl(url);
        if (!urlType) return orig.apply(this, args);

        // Make clicking on theme links only work in #themes, should there be a theme proxy in the future, this can be removed.
        if (urlType === "Theme" && getChannel(getChannelId())?.parent_id !== THEMES_CHANNEL_ID)
            return orig.apply(this, args);

        showConfirmationAlert({
            title: "Hold Up",
            content: [`This link is a `, <RN.Text style={TextStyleSheet["text-md/semibold"]}>{urlType}</RN.Text>, `, would you like to install it?`],
            onConfirm: () => installWithToast(urlType, url),
            confirmText: "Install",
            cancelText: "Cancel",
            secondaryConfirmText: "Open in Browser",
            onConfirmSecondary: () => openURL(url),
        });
    }));

    return () => patches.forEach((p) => p());
};
