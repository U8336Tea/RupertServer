import { SnowflakeUtil } from "discord.js";
import type { Snowflake } from "discord.js";

import { Rule } from "../../../Rule.js";
import { parseRules } from "../../../config.js";

export function parseConfig(data: any): ChannelConfig {
    if (!data.channelID) return null;

    if (data.earliest) data.earliest = new Date(data.earliest);
    else data.earliest = SnowflakeUtil.deconstruct(data.channelID).date;

    if (data.latest) data.latest = new Date(data.latest);
    data.blacklist = parseRules(data.blacklist ?? []);
    data.log = data.log ?? false;

    return data;
}

export interface ChannelConfig {
    channelID: Snowflake;
    earliest?: Date;
    latest?: Date;
    blacklist: Rule[];
    log: boolean;
}