import type { Message } from "discord.js";

import { Rule, RuleType } from "../../Rule";

const HELP = `
Usage: \`blacklist [channel id] [rule type] [id]\`

Prevents Rupert from responding to anyone who matches the specified rule. Rule type can be either user or role.
`;

export default function(message: Message, command: string[]) {
    if (command.length < 4) {
        message.reply(HELP);
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
    global.responders.get(channelID).blacklistRules.push(rule);
    message.reply("Rule added.");
}