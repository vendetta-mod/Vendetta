import { findByProps } from "@metro/filters";
import { messageUtil } from "@metro/common";
import { ApplicationCommand, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "@types";

const util = findByProps("inspect");
const AsyncFunction = (async () => void 0).constructor;

function wrapInJSCodeblock(resString: string) {
    return "```js\n" + resString + "\n```";
}

export default <ApplicationCommand>{
    name: "eval",
    displayName: "eval",
    description: "Evaluate JavaScript code.",
    displayDescription: "Evaluate JavaScript code.",
    options: [
        {
            name: "code",
            displayName: "code",
            type: ApplicationCommandOptionType.STRING,
            description: "The code to evaluate.",
            displayDescription: "The code to evaluate.",
            required: true
        },
        {
            name: "async",
            displayName: "async",
            type: ApplicationCommandOptionType.BOOLEAN,
            description: "Whether to support 'await' in code. Must explicitly return for result (default: false)",
            displayDescription: "Whether to support 'await' in code. Must explicitly return for result (default: false)"
        }
    ],
    applicationId: "-1",
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT,
    type: ApplicationCommandType.CHAT,
    async execute([code, async], ctx) {
        try {
            const res = util.inspect(async?.value ? await AsyncFunction(code.value)() : eval?.(code.value));
            const trimmedRes = res.length > 2000 ? res.slice(0, 2000) + "..." : res;

            messageUtil.sendBotMessage(ctx.channel.id, wrapInJSCodeblock(trimmedRes));
        } catch (err: any) {
            messageUtil.sendBotMessage(ctx.channel.id, wrapInJSCodeblock(err?.stack ?? err));
        }
    }
}
