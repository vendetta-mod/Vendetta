import { after } from "@lib/patcher";
import { commands as commandsModule } from "@metro/common";
import { ApplicationCommand } from "@types";

import evalCommand from "@lib/commands/eval";
import debugCommand from "@lib/commands/debug";

let commands: ApplicationCommand[] = [];

export function patchCommands() {
	const unpatch = after("getBuiltInCommands", commandsModule, (_, res) => res.concat(commands));

	// Register core commands
	[evalCommand, debugCommand].forEach(registerCommand);

	return () => {
		commands = [];
		unpatch();
	}
}

export function registerCommand(command: ApplicationCommand): () => void {
	// Get built in commands
	const builtInCommands = commandsModule.getBuiltInCommands(1, true, false) as ApplicationCommand[];
	builtInCommands.sort((a, b) => parseInt(b.id!) - parseInt(a.id!));

	const lastCommand = builtInCommands[builtInCommands.length - 1];

	// Override the new command's id to the last command id - 1
	command.id = (Number(lastCommand.id!) - 1).toString();

	// Add it to the commands array
	commands.push(command);

	// Return command id so it can be unregistered
	return () => commands = commands.filter(({ id }) => id !== command.id);
}
