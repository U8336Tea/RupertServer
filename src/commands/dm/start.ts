import { Channel, TextChannel, Message } from "discord.js";

import start from "../startCommand.js";

const HELP = `
Usage: \`start [channel id] (vocabulary name)\`

Starts Rupert on a channel.
`;

export default function(message: Message, command: string[]) {
    const length = command.length;
    if (length < 2) {
        message.reply(HELP);
        return;
    }
    
    const discord = global.discord;
    let channel: Channel;

    if (!(channel = discord.channels.resolve(command[1]))) {
        message.reply("This isn't a channel in a server I'm in.");
        return;
    };

    if (!(channel instanceof TextChannel)) {
        message.reply("This isn't a text channel.");
        return;
    }

    let vocabulary = null;
    if (length >= 3) vocabulary = command[2];

    const response = start(channel.guild.id, channel.id, message.author.tag, vocabulary);
    message.reply(response);
}
