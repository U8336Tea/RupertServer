import fs from "fs"
import { Rule, RuleType } from "./Rule.js";

const configJson: object = JSON.parse(fs.readFileSync("./config.json").toString());

export function parseRules(array: object[]): Rule[] {
    const rules: Rule[] = [];

    for (const json of array) {
        rules.push(ruleFromObject(json));
    }

    return rules;
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

    allowGuild: string;
    allowedMembers: Rule[];
}
