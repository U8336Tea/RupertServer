import { DMChannel, Message, User } from "discord.js";

import { hasPermission, pathSafe } from "../common.js";

export default function(message: Message) {
    if (!(message.channel instanceof DMChannel)) return;
    if (!hasPermission(message.author.id)) return;

    const command = message.content.split(" ").map(s => s.toLowerCase());
    if (command.length < 1) return;

    const commandName = command[0];
    if (!pathSafe(commandName)) return;

    try {
        const commandFunction: (message: Message, command: string[]) => void = require(`./${commandName}.js`)?.default
        commandFunction(message, command);
    } catch (e: unknown) {
        if (!(e instanceof Error)) throw e;
        if (e["code"] == "MODULE_NOT_FOUND") return; // Typescript doesn't have Error.code but it's definitely on the object.
        throw e;
    }
}