import type { Message } from "discord.js";

import { Rule, RuleType } from "../../Rule";

const USAGE = "target <channel id> <rule type (user or role)> <id>"

export default function(message: Message, command: string[]) {
    if (command.length < 4) {
        message.reply(`Usage: ${USAGE}`);
        return;
    }

    let [ _, channelID, ruleType, ruleID ] = command;
    
    if (!global.responders.has(channelID)) {
        message.reply("Not running on this channel.");
        return;
    }

    ruleType = ruleType[0].toUpperCase() + ruleType.substr(1).toLowerCase();
    const type = RuleType[ruleType];
    if (type == null) {
        message.reply("Invalid rule type.");
        return;
    }

    const rule = new Rule(type, ruleID);
    global.responders.get(channelID).targetRules = [rule];
    message.reply("Rule added.");
}