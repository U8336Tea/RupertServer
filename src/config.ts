import fs from "fs"

import type { Snowflake } from "discord.js";

import { Rule, RuleType } from "./Rule.js";

const configJson: object = JSON.parse(fs.readFileSync("./config.json").toString());

export function parseRules(array: object[]): Rule[] {
    return array.map(ruleFromObject);
}

configJson["slashConfig"]["allowedMembers"] = parseRules(configJson["slashConfig"]["allowedMembers"]);

export const config: ConfigFile = configJson as ConfigFile;

export function ruleFromObject(json: object): Rule {
    const type: string | number = json["type"];
    const id: string = json["id"];

    let ruleType: RuleType;

    if (!id || !type) throw new Error("Improperly written rule.");

    if (typeof type === 'string') {
        ruleType = RuleType[type];

        if (ruleType == null) throw new Error("Unknown rule type.");
    } else {
        ruleType = type;
    }

    return new Rule(ruleType, id);
}

export interface ConfigFile {
    discordConfig: DiscordConfig;
    slashConfig: SlashConfig;
}

export interface DiscordConfig {
    botType: "User" | "Bot";
    token: string;
}

export interface SlashConfig {
    appID: string;
    publicKey: string;
    secret: string;

    allowedMembers: Rule[];
    port: number;
}
