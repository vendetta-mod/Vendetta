import { ApplicationCommand, ApplicationCommandType } from "@types";
import { commands as commandsModule } from "@metro/common";
import { after } from "@lib/patcher";

import evalCommand from "@lib/commands/eval";
import debugCommand from "@lib/commands/debug";
import pluginCommand from "@lib/commands/plugins";

let commands: ApplicationCommand[] = [];

export function patchCommands() {
    const unpatch = after("getBuiltInCommands", commandsModule, ([type], res: ApplicationCommand[]) => {
        if (type === ApplicationCommandType.CHAT) return res.concat(commands);
    });

    // Register core commands
    [evalCommand, debugCommand, pluginCommand].forEach(registerCommand);

    return () => {
        commands = [];
        unpatch();
    };
}

export function registerCommand(command: ApplicationCommand): () => void {
    // Get built in commands
    const builtInCommands = commandsModule.getBuiltInCommands(ApplicationCommandType.CHAT, true, false);
    builtInCommands.sort((a: ApplicationCommand, b: ApplicationCommand) => parseInt(b.id!) - parseInt(a.id!));

    const lastCommand = builtInCommands[builtInCommands.length - 1];

    // Override the new command's id to the last command id - 1
    command.id = (parseInt(lastCommand.id, 10) - 1).toString();

    // Add it to the commands array
    commands.push(command);

    // Return command id so it can be unregistered
    return () => (commands = commands.filter(({ id }) => id !== command.id));
}
