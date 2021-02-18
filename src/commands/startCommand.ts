import type { TextChannel, Snowflake } from "discord.js";

import { findConfig, pathSafe, startResponder } from "./common.js";

export default function(guildID: Snowflake, channelID: Snowflake, name: string, vocabulary: string = null): string {
    const currentResponder = global.responders.get(channelID);
    if (currentResponder && !currentResponder.destroyed) return;

    const channel = global.discord.channels.resolve(channelID) as TextChannel;
    const perms = channel.permissionsFor(global.discord.user);
    if (!(perms.has("VIEW_CHANNEL") && perms.has("SEND_MESSAGES"))) return "rupper can't talk in this channel";

    let config = findConfig(guildID, channelID);
    if (vocabulary) {
        if (!pathSafe(vocabulary)) {
            console.log(`Possible directory traversal attempt from ${name}`);
            console.log(`Path: ${vocabulary}`);
            return "Invalid vocabulary.";
        }

        config.vocabulary = vocabulary;
    }

    try {
        startResponder(config, channel.id);
        return "startig ruppert";
    } catch (e: unknown) {
        if (!(e instanceof Error)) throw e;
        if (e["code"] == "MODULE_NOT_FOUND") return "Invalid vocabulary.";
        throw e;
    }
}