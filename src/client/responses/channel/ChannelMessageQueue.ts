import { SnowflakeUtil } from "discord.js";
import type { GuildMember, Message, TextChannel } from "discord.js";

import { rand, sleep } from "../../../common.js";
import { hasPermission } from "../../../commands/common.js";
import { Rule, RuleMember } from "../../../Rule.js";

export class ChannelMessageQueue {
    maxLength: number;
    earliest: number;
    channel: TextChannel;
    blacklist: Rule[];

    private internal: Message[][] = [];
    private filling: boolean = false;

    constructor(maxLength: number,
        earliest: number,
        channel: TextChannel,
        blacklist: Rule[],
        fill: boolean = true) {

        this.maxLength = maxLength;
        this.earliest = earliest;
        this.channel = channel;
        this.blacklist = blacklist;
        if (fill) this.fill();
    }

    async fill() {
        if (this.filling) return;
        this.filling = true;

        try {
            while (this.internal.length < this.maxLength) {
                const potentials = await this.getPotentials();
                if (potentials) this.internal.push(potentials);
                await sleep(5000); // Avoid getting rate-limited.
            }
        } catch(e: unknown) {
            console.error(e);
            return;
        } finally {
            this.filling = false;
        }
    }

    pop(refill: boolean = true): Message[] {
        if (!this.internal.length) {
            if (refill) this.fill();
            return null;
        }

        const messages = this.internal.shift();
        if (refill) this.fill();
        return messages;
    }

    private async getPotentials(): Promise<Message[]> {
        // Find a random message within the channel.
        const timestamp = rand(Date.now(), this.earliest);
        const date = new Date(timestamp);
        const snowflake = SnowflakeUtil.generate(date);

        const messages = await this.channel.messages.fetch(
            { around: snowflake },
            false);
        
        if (messages.size == 0) return null;

        const potentials: Message[] = [];

        for (const msg of messages.values()) { // Can't use filter because an async function is called.
            const condition = (msg.content != null &&
                await hasPermission(msg.author.id) &&
                await this.allowedUsage(msg)       &&
                msg.content != null                &&
                msg.attachments.size == 0          &&
                !msg.system                        &&
                !msg.author.bot);

            if (condition) potentials.push(msg);
        }

        return potentials.length ? potentials : null;
    }

    private async allowedUsage(msg: Message): Promise<boolean> {
        let member: GuildMember
        try {
            member = msg.member ?? await msg.guild.members.fetch(msg.author.id);
            if (!member) return false;
        } catch {
            return false;
        }
        
        const ruleMember = RuleMember.fromDiscordJS(member);
        for (const rule of this.blacklist) {
            if (rule.isMatch(ruleMember)) return false;
        }

        return true;
    }
}
