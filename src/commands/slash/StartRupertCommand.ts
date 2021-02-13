import { CommandOptionType, SlashCommand } from "slash-create";
import type { SlashCreator, CommandContext } from "slash-create";

import { hasPermission } from "../common.js";
import start from "../startCommand.js";
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
        if (!(await hasPermission(ctx.member.id))) {
            ctx.send(`From ${ctx.member.mention}:`);
            return this.response;
        }

        const vocabulary = ctx.options[VOCABULARY_KEY]?.toString();
        const response = start(ctx.guildID, ctx.channelID, `${ctx.member.user.username}#${ctx.member.user.discriminator}`, vocabulary);

        ctx.send(response, { ephemeral: true });
        if (rand(64) == 0) ctx.send(this.response);
    }
}
