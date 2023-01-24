import { ApplicationCommand } from "@/def";
import { after } from "spitroast";
import { findByProps } from "./metro/filters";

const BuiltInCommands = findByProps("getBuiltInCommands")

let commands: ApplicationCommand[] = []

after("getBuiltInCommands", BuiltInCommands, (args, res) => {
	return res.concat(commands)
})

export function registerCommand(command: ApplicationCommand): string {
	// Get built in commands
	const builtInCommands = BuiltInCommands.getBuiltInCommands(1, true, false)
	builtInCommands.sort(function (a: ApplicationCommand, b: ApplicationCommand) { return parseInt(b.id!) - parseInt(a.id!) })

	const lastCommand = builtInCommands[builtInCommands.length - 1]

	// Override the new command's id to the last command id - 1
	command.id = (parseInt(lastCommand.id, 10) - 1).toString()

	// Add it to the commands array
	commands.push(command)

	// Return command id so it can be unregistered
	return command.id
}

export function unregisterCommand(id: string) {
	// Filter out the custom command with the id given
	commands = commands.filter((command) => command.id !== id)
}