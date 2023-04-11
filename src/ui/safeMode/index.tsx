import { findByName } from "@metro/filters";
import { after } from "@lib/patcher";
import { getAssetIDByName } from "@ui/assets";
import { ErrorBoundary as _EB } from "@ui/components";

_EB.getDerivedStateFromError

const ErrorBoundary = findByName("ErrorBoundary");

export default function initSafeMode() {
    const patches = new Array<Function>;

    patches.push(after("render", ErrorBoundary.prototype, function (this: any, _, ret) {
        if (!this.state.error) return;

        ret.props.darkSource = { uri: "https://cdn.discordapp.com/emojis/1093803211783143504.gif", height: 256, width: 256 };
        ret.props.title = "Looks like Discord has exploded...";
        ret.props.body = this.state.error.toString();
    }));
}