import { ApplicationCommand, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "@types";
import { getDebugInfo } from "@lib/debug";
import { messageUtil } from "@metro/common";

export default <ApplicationCommand>{
    name: "debug",
    displayName: "debug",
    description: "Send Vendetta debug info.",
    displayDescription: "Send Vendetta debug info.",
    options: [
        {
            name: "ephemeral",
            displayName: "ephemeral",
            type: ApplicationCommandOptionType.BOOLEAN,
            description: "Send debug info ephemerally.",
            displayDescription: "Send debug info ephemerally.",
        }
    ],
    applicationId: "-1",
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT,
    type: ApplicationCommandType.CHAT,
    execute([ephemeral], ctx) {
        const info = getDebugInfo();
        const content = [
            "**__Vendetta Debug Info__**",
            `> Vendetta: ${info.vendetta.version} (${info.vendetta.loader})`,
            `> Discord: ${info.discord.version} (${info.discord.build})`,
            `> React: ${info.react.version} (RN ${info.react.nativeVersion})`,
            `> Hermes: ${info.hermes.version} (bcv${info.hermes.bytecodeVersion})`,
            `> System: ${info.os.name} ${info.os.version} (SDK ${info.os.sdk})`,
            `> Device: ${info.device.model} (${info.device.codename})`,
        ].join("\n");

        if (ephemeral?.value) {
            messageUtil.sendBotMessage(ctx.channel.id, content);
        } else {
            return { content };
        }
    }
}
