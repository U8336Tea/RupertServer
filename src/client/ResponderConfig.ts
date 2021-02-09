import { Rule } from "../Rule.js";
import { ruleFromObject } from "../config.js";

export interface ResponderConfig {
    responderName: string;
    timeoutInterval: number;

    rules: Rule[];
    blacklist: Rule[];
}

export function getResponderConfig(json: string): ResponderConfig {
    const configObject = JSON.parse(json);
    const rules = [];
    const blacklist = [];

    for (const rule of configObject["rules"] || []) rules.push(ruleFromObject(rule));
    for (const rule of configObject["blacklist"] || []) blacklist.push(ruleFromObject(rule));

    return {
        responderName: configObject["responderName"] || "bvg",
        timeoutInterval: configObject["timeoutInterval"],
        rules: rules,
        blacklist: blacklist
    };
}
