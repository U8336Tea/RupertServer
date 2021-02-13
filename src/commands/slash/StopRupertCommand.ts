import { SlashCommand } from "slash-create";
import type { SlashCreator, CommandContext } from "slash-create";

import { hasPermission } from "../common.js";
import { rand } from "../../common.js";

export default class StopRupertCommand extends SlashCommand{
    private readonly response = "https://c.tenor.com/eeTJcCf-aMsAAAAM/mad-angry-grr-mr-krabs-kick-slam-smash-scream-ahh-sponge-bob.gif";

    constructor(creator: SlashCreator) {
        super(creator, {
            name: "crapnaked", // May change often.
            description: "nakked mr. crap 🥵"
        });

        this.filePath = __filename;
    }

    async run(ctx: CommandContext) {
        if (!(await hasPermission(ctx.member.id))) {
            ctx.send(`From ${ctx.member.mention}:`);
            return this.response;
        }

        const responder = global.responders.get(ctx.channelID);
        if (!responder) {
            ctx.send("Rupert not running", { ephemeral: true });
            return;
        }

        responder.destroy();
        global.responders.delete(ctx.channelID);
        ctx.send("stopped", { ephemeral: true });

        if (rand(64) == 0) return this.response;
    }
}
