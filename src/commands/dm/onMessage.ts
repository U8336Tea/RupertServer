import { DMChannel, Message } from "discord.js";

import { sleep } from "../../common.js";
import { hasPermission, pathSafe } from "../common.js";

export default async function(message: Message) {
    if (!(message.channel instanceof DMChannel)) return;
    if (!(await hasPermission(message.author.id))) {
        if (message.author.id == global.discord.user.id) return;
        try {
            await sleep(5000);
            message.channel.startTyping().catch();
            await sleep(2000);
            await message.reply("tldr");
            message.channel.stopTyping();
        } catch {}
        return;
    }

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