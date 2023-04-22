import { findByName, findByProps } from "@metro/filters";
import { DISCORD_SERVER_ID, PLUGINS_CHANNEL_ID, THEMES_CHANNEL_ID, HTTP_REGEX_MULTI, PROXY_PREFIX } from "@lib/constants";
import { after } from "@lib/patcher";
import { installPlugin } from "@lib/plugins";
import { installTheme } from "@lib/themes";
import { findInReactTree } from "@lib/utils";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { Forms } from "@ui/components";

const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet", false);
const { FormRow } = Forms;
// Discord uses this Icon in action sheets. FormRow.Icon is too dark.
const Icon = findByName("Icon");

const { useFirstForumPostMessage } = findByProps("useFirstForumPostMessage");
const { hideActionSheet } = findByProps("openLazy", "hideActionSheet");

export default () => after("default", ForumPostLongPressActionSheet, ([{ thread }], res) => {
    if (thread.guild_id !== DISCORD_SERVER_ID) return;

    // Determine what type of addon this is.
    let postType: "Plugin" | "Theme";
    if (thread.parent_id === PLUGINS_CHANNEL_ID) {
        postType = "Plugin";
    } else if (thread.parent_id === THEMES_CHANNEL_ID && window.__vendetta_loader?.features.themes) {
        postType = "Theme";
    } else return;

    const { firstMessage } = useFirstForumPostMessage(thread);

    let urls = firstMessage?.content?.match(HTTP_REGEX_MULTI);
    if (!urls) return;

    if (postType === "Plugin") {
        urls = urls.filter((url: string) => url.startsWith(PROXY_PREFIX));
    } else {
        urls = urls.filter((url: string) => url.endsWith(".json"));
    };

    const url = urls[0];
    if (!url) return;

    /* Assuming that the actions array is at index 1
       could break in the future, but I doubt Discord
       will add more to the post action sheet and
       index 0 will either be quick add reactions or false.
    */
    const actions = findInReactTree(res, (t) => t.props?.bottom === true).props.children.props.children[1];
    const ActionsSection = actions[0].type;

    actions.unshift(<ActionsSection key="install">
        <FormRow
            leading={<Icon source={getAssetIDByName("ic_download_24px")} />}
            label={`Install ${postType}`}
            onPress={() =>
                (postType === "Plugin" ? installPlugin : installTheme)(url).then(() => {
                    showToast(`Successfully installed ${thread.name}`, getAssetIDByName("Check"));
                }).catch((e: Error) => {
                    showToast(e.message, getAssetIDByName("Small"));
                }).finally(() => hideActionSheet())
            }
        />
    </ActionsSection>);
});
