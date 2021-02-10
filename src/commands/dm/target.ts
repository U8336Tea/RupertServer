import type { Message } from "discord.js";

import { Rule, RuleType } from "../../Rule";

export default function(message: Message, command: string[]) {
    if (command.length < 4) return;
    let [ _, channelID, ruleType, ruleID ] = command;
    
    if (!global.responders.has(channelID)) {
        message.reply("Not running on this channel.");
        return;
    }

    ruleType = ruleType[0].toUpperCase() + ruleType.substr(1).toLowerCase();
    const type = RuleType[ruleType];
    if (!type) {
        message.reply("Invalid rule type.");
        return;
    }

    const rule = new Rule(type, ruleID);
    global.responders.get(channelID).targetRules = [rule];
    message.reply("Rule added.");
}