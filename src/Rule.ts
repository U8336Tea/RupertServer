import type { Snowflake, GuildMember } from "discord.js";
import type { Member } from "slash-create";

export class RuleMember {
    id: string;
    roles: string[];

    static fromDiscordJS(member: GuildMember) {
        const roles = member.roles.cache.array().map(role => role.id);
        return new this(member.id, roles);
    }

    static fromSlashCreate(member: Member) {
        return new this(member.id, member.roles);
    }

    private constructor(id: string, roles: string[]) {
        this.id = id;
        this.roles = roles;
    }
}

export enum RuleType {
    User, Role
}

export class Rule {
    type: RuleType;
    id: Snowflake;

    constructor(type: RuleType, id: Snowflake) {
        this.type = type;
        this.id = id;
    }

    isMatch(user: RuleMember): boolean {
        switch (this.type) {
        case RuleType.User:
            return user.id == this.id;
        
        case RuleType.Role:
            return user.roles.includes(this.id);
        }
    }

    toString() {
        return `${this.type} ${this.id}`;
    }
}