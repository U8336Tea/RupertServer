import { Rule } from "../../../Rule.js";
import { parseRules } from "../../../config.js";

export function parseConfig(data: object): ChannelConfig {
    if (!data["channelID"] || !data["earliest"]) return null;

    const blacklist = data["blacklist"] ?? [];
    if (!blacklist) return null;

    const rules: Rule[] = parseRules(blacklist);

    return {
        channelID: data["channelID"],
        earliest: new Date(data["earliest"]),
        blacklist: rules,
        log: data["log"] ?? false
    };
}

export interface ChannelConfig {
    channelID: string;
    earliest: Date;
    blacklist: Rule[];
    log: boolean;
}