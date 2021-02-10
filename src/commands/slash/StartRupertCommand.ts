import type { TextChannel } from "discord.js";
import { CommandOptionType, SlashCommand } from "slash-create";
import type { SlashCreator, CommandContext } from "slash-create";

import { findConfig, hasPermission, startResponder, pathSafe } from "../common.js";
import { rand } from "../../common.js";

const VOCABULARY_KEY = "name";

export default class StartRupertCommand extends SlashCommand {
    private readonly response = "https://tenor.com/view/mr-krabs-singing-spongebob-christmas-mr-krabs-gif-19652806";

    constructor(creator: SlashCreator) {
        super(creator, {
            name: "crapsing", // May change often.
            description: "Hear Mr. Crap sing! 🤗",
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: VOCABULARY_KEY,
                    description: "The name of the person Mr. Crap sings to! 🥰",
                    required: false
                }
            ]
        });

        this.filePath = __filename;
    }

    async run(ctx: CommandContext) {
        if (!hasPermission(ctx.member.id)) {
            ctx.send(`From ${ctx.member.mention}:`);
            return this.response;
        }

        const currentResponder = global.responders.get(ctx.channelID);
        if (currentResponder && !currentResponder.destroyed) return;

        const channel = global.discord.channels.resolve(ctx.channelID) as TextChannel;
        const perms = channel.permissionsFor(global.discord.user);
        if (!(perms.has("VIEW_CHANNEL") && perms.has("SEND_MESSAGES"))) {
            ctx.send("rupper can't talk in this channel", { ephemeral: true });
            return;
        }

        if (rand(64) == 0) ctx.send(this.response);

        let config = findConfig(ctx.guildID, ctx.channelID);
        const vocabulary = ctx.options[VOCABULARY_KEY]?.toString();
        if (vocabulary) {
            if (!pathSafe(vocabulary)) {
                const member = ctx.member.user;
                console.log(`Possible directory traversal attempt from ${member.username}#${member.discriminator}`);
                console.log(`Path: ${vocabulary}`);
                ctx.send("Invalid vocabulary.", { ephemeral: true });
                return;
            }

            config.vocabulary = vocabulary;
        }

        try {
            startResponder(config, channel.id);
            ctx.send("startig ruppert", {ephemeral: true})
        } catch (e: unknown) {
            if (!(e instanceof Error)) throw e;
            if (e["code"] == "MODULE_NOT_FOUND") { // Typescript doesn't have Error.code but it's definitely on the object.
                ctx.send("Invalid vocabulary.", { ephemeral: true });
                return;
            }
    
            throw e;
        }
    }
}
