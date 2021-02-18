import fs from "fs";

import { DiscordAPIError, Guild, GuildMember, TextChannel } from "discord.js";
import type { Snowflake } from "discord.js";

import { Rule, RuleMember, RuleType } from "../Rule.js";
import { Responder } from "../client/Responder.js";
import { getResponderConfig } from "../client/ResponderConfig.js";
import type { ResponderConfig } from "../client/ResponderConfig.js";

async function roleRuleMatch(id: Snowflake, rule: Rule): Promise<boolean> {
    const guildID = global.roleCache.get(rule.id);
    if (!guildID) return false;

    let discordMember: GuildMember;

    try {
        const guild = await global.discord.guilds.fetch(guildID);
        discordMember = await guild.members.fetch(id);
    } catch (e: unknown) {
        if (!(e instanceof DiscordAPIError)) throw e;
        if (e.code == 10004) throw e; // Unknown guild.
        if (e.code >= 10000 && e.code <= 10099) return false; // Other unknown.
        throw e;
    }

    return discordMember.roles.cache.has(rule.id);
}

export async function hasPermission(id: Snowflake): Promise<boolean> {
    const allowedRules = global.config.slashConfig.allowedMembers;
    for (const rule of allowedRules) {
        switch (rule.type) {
            case RuleType.User:
            if (id == rule.id) return true;
            break;

            case RuleType.Role:
            if(roleRuleMatch(id, rule)) return true;
            break;
        }
    }

    return false;
}

export function findConfig(guildID: Snowflake, channelID: Snowflake): ResponderConfig {
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

export function startResponder(config: ResponderConfig, channelID: Snowflake) {
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
