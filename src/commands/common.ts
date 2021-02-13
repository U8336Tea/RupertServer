import fs from "fs";

import type { TextChannel } from "discord.js";

import { RuleMember } from "../Rule.js";
import { Responder } from "../client/Responder.js";
import { getResponderConfig } from "../client/ResponderConfig.js";
import type { ResponderConfig } from "../client/ResponderConfig.js";

export async function hasPermission(id: string): Promise<boolean> {
    const guild = await global.discord.guilds.fetch(global.config.slashConfig.allowGuild);
    const discordMember = await guild.members.fetch(id);
    if (!discordMember) return false;

    const member = RuleMember.fromDiscordJS(discordMember);
    const allowedRules = global.config.slashConfig.allowedMembers;
    for (const rule of allowedRules) {
        if (rule.isMatch(member)) {
            return true;
        }
    }

    return false;
}

export function findConfig(guildID: string, channelID: string): ResponderConfig {
    function load(url: URL): string {
        return fs.existsSync(url)            ?
            fs.readFileSync(url).toString()  :
            null;
    }

    const dir = new URL(`file://${process.cwd()}/configs/`);
    let file: string;

    if (file = load(new URL(`${guildID}/${channelID}.json`, dir))) return getResponderConfig(file);
    if (file = load(new URL(`${guildID}/default.json`, dir))) return getResponderConfig(file);

    file = load(new URL("default.json", dir));
    if (!file) throw new Error("No config files found."); // TODO: Actual error maybe? idk
    return getResponderConfig(file);
}

export function startResponder(config: ResponderConfig, channelID: string) {
    const { default: ResponseProvider } = require(`../client/responses/${config.vocabulary}/index.js`);

    const responder = new Responder(global.discord, new ResponseProvider(), config.timeoutInterval, config.rules, config.blacklist);
    global.responders.set(channelID, responder);
    responder.on("log", console.log);
    responder.on("destroy", () => global.responders.delete(channelID));
    return responder.listen(global.discord.channels.resolve(channelID) as TextChannel);
}

export function pathSafe(path: fs.PathLike): boolean {
    const str = path.toString();
    if (str.length > 16) return false;
    if (str.indexOf("\0") !== -1) return false;
    if (!/^[a-zA-Z0-9_!\-\?]+$/.test(str)) return false;
    return true;
}
