import { Channel, TextChannel, Message } from "discord.js";

import start from "../startCommand.js";

const USAGE = "start <channel id> [vocabulary name]"

export default function(message: Message, command: string[]) {
    const length = command.length;
    if (length < 2) {
        message.reply(`Usage: ${USAGE}`);
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

    const response = start(channel.guild.id, channel.id, `${message.author.username}#${message.author.discriminator}`, vocabulary);
    message.reply(response);
}
