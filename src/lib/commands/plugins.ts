import { ApplicationCommand, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Plugin } from "@types";
import { messageUtil } from "@metro/common";
import { plugins as pluginStorage } from "../plugins";

export default <ApplicationCommand>{
    name: "plugins",
    displayName: "plugins",
    description: "Send list of installed plugins.",
    displayDescription: "Send list of installed plugins.",
    options: [
        {
            name: "ephemeral",
            displayName: "ephemeral",
            type: ApplicationCommandOptionType.BOOLEAN,
            description: "Send plugins list ephemerally.",
            displayDescription: "Send plugins list ephemerally.",
        }
    ],
    applicationId: "-1",
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT,
    type: ApplicationCommandType.CHAT,
    execute([ephemeral], ctx) {
        const plugins = Object.values(pluginStorage).sort((a, b) => a.manifest.name.localeCompare(b.manifest.name));

        const enabled = plugins.filter(p => p.enabled).map(p => p.manifest.name);
        const disabled = plugins.filter(p => !p.enabled).map(p => p.manifest.name);

        const content = [
            `**__Installed Plugins (${plugins.length})__**`,
            `Enabled (${enabled.length}):`,
            "> " + enabled.join(", "),
            `Disabled (${disabled.length}):`,
            "> " + disabled.join(", "),
        ].join("\n");

        if (ephemeral?.value) {
            messageUtil.sendBotMessage(ctx.channel.id, content);
        } else {
            return { content };
        }
    }
}
