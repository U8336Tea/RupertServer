import { Rule } from "../Rule.js";
import { ruleFromObject } from "../config.js";

export interface ResponderConfig {
    vocabulary: string;
    timeoutInterval?: number;
    minTypeTime?: number;
    maxTypeTime?: number;

    rules: Rule[];
    blacklist: Rule[];
}

export function getResponderConfig(json: string): ResponderConfig {
    const configObject = JSON.parse(json);
    const rules = [];
    const blacklist = [];

    for (const rule of configObject["rules"] ?? []) rules.push(ruleFromObject(rule));
    for (const rule of configObject["blacklist"] ?? []) blacklist.push(ruleFromObject(rule));

    configObject.rules = rules;
    configObject.blacklist = blacklist;
    return configObject;
}
