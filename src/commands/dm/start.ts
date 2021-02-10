import { Channel, TextChannel, Message } from "discord.js";

import { pathSafe, findConfig, startResponder } from "../common.js";

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

    const perms = channel.permissionsFor(global.discord.user);
    if (!(perms.has("VIEW_CHANNEL") && perms.has("SEND_MESSAGES"))) {
        message.reply("rupper can't talk in this channel");
        return;
    }

    let config = findConfig(channel.guild.id, channel.id);
    if (length >= 3) {
        const vocabulary = command[2];
        if (!pathSafe(vocabulary)) {
            const member = message.author;
            console.log(`Possible directory traversal attempt from ${member.username}#${member.discriminator}`);
            console.log(`Path: ${vocabulary}`);
            message.reply("Invalid vocabulary.");
            return;
        }

        config.vocabulary = vocabulary;
    }

    message.reply("Starting.");
    startResponder(config, channel.id);
}
