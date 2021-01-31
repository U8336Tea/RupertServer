import fs from "fs";

import { DiscordAPIError } from "discord.js";
import type { TextChannel } from "discord.js";
import { SlashCommand } from "slash-create";
import type { SlashCreator, CommandContext } from "slash-create";

import { hasPermission } from "../common.js";
import { Responder } from "../../client/Responder.js";
import BVG from "../../client/responses/bvg/bvg.js";
import { getResponderConfig } from "../../client/ResponderConfig.js";
import { rand } from "../../common.js";

export default class StartRupertCommand extends SlashCommand {
    private readonly response = "https://tenor.com/view/mr-krabs-singing-spongebob-christmas-mr-krabs-gif-19652806";

    constructor(creator: SlashCreator) {
        super(creator, {
            name: "crapsing", // May change often.
            description: "Hear Mr. Crap sing! 🤗"
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

        const dir = new URL(`file://${process.cwd()}/configs/`);

        const channel = global.discord.channels.resolve(ctx.channelID) as TextChannel;
        const perms = channel.permissionsFor(global.discord.user);
        if (!(perms.has("VIEW_CHANNEL") && perms.has("SEND_MESSAGES"))) {
            ctx.send("rupper can't talk in this channel", { ephemeral: true });
            return;
        }

        ctx.send("startig ruppert", {ephemeral: true});
        if (rand(64) == 0) ctx.send(this.response);
        
        if (this.startResponder(new URL(`${ctx.guildID}/${ctx.channelID}.json`, dir), ctx.channelID)) return;
        if (this.startResponder(new URL(`${ctx.guildID}/default.json`, dir), ctx.channelID)) return;
        this.startResponder(new URL(`default.json`, dir), ctx.channelID);
    }

    private startResponder(configPath: fs.PathLike, channelID: string): Promise<void> {
        if (!fs.existsSync(configPath)) return null;

        const config = getResponderConfig(fs.readFileSync(configPath).toString());
        const responder = new Responder(global.discord, new BVG(), config.timeoutInterval, config.rules, config.blacklist);
        global.responders.set(channelID, responder);
        responder.on("log", console.log);
        responder.on("destroy", () => global.responders.delete(channelID));
        return responder.listen(global.discord.channels.resolve(channelID) as TextChannel);
    }
}
