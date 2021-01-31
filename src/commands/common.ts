import { RuleMember } from "../Rule.js";

export function hasPermission(id: string): boolean {
    const guild = global.discord.guilds.resolve(global.config.slashConfig.allowGuild);
    const discordMember = guild.members.resolve(id);
    if (!discordMember) return false;

    const member = RuleMember.fromDiscordJS(discordMember);
    const allowedRules = global.config.slashConfig.allowedMembers;
    for (const rule of allowedRules) {
        if (rule.isMatch(member)) {
            return true;
        }
    }

    return false;
}