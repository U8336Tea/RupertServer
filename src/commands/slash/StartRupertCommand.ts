import type { TextChannel } from "discord.js";
import { CommandOptionType, SlashCommand } from "slash-create";
import type { SlashCreator, CommandContext } from "slash-create";

import { findConfig, hasPermission, startResponder, vocabValid } from "../common.js";
import { rand } from "../../common.js";

export default class StartRupertCommand extends SlashCommand {
    private readonly response = "https://tenor.com/view/mr-krabs-singing-spongebob-christmas-mr-krabs-gif-19652806";
    private readonly vocabularyKey = "name";

    constructor(creator: SlashCreator) {
        super(creator, {
            name: "crapsing", // May change often.
            description: "Hear Mr. Crap sing! 🤗",
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: "name",
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

        ctx.send("startig ruppert", {ephemeral: true});
        if (rand(64) == 0) ctx.send(this.response);

        let config = findConfig(ctx.guildID, ctx.channelID);
        const vocabulary = ctx.options[this.vocabularyKey].toString();
        if (vocabulary) {
            if (!vocabValid(vocabulary)) {
                const member = ctx.member.user;
                console.log(`Possible directory traversal attempt from ${member.username}#${member.discriminator}`);
                console.log(`Path: ${vocabulary}`);
                return;
            }

            config.vocabulary = vocabulary;
        }

        startResponder(config, ctx.channelID);
    }
}
