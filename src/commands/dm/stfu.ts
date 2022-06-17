import type { Message } from "discord.js";
import { exit } from "process";

export default function(message: Message, command: string[]) {
    message.reply("Restarting ig").then(_ => exit(0));
}