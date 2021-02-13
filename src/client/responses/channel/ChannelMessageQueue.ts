import { SnowflakeUtil } from "discord.js";
import type { Message, TextChannel } from "discord.js";

import { rand, sleep } from "../../../common.js";
import { hasPermission } from "../../../commands/common.js";
import type { ChannelConfig } from "./ChannelConfig.js";

export class ChannelMessageQueue {
    maxLength: number;
    earliest: number;
    channel: TextChannel;

    private internal: Message[][] = [];
    private filling: boolean = false;

    constructor(maxLength: number,
        earliest: number,
        channel: TextChannel,
        fill: boolean = true) {

        this.maxLength = maxLength;
        this.earliest = earliest;
        this.channel = channel;
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
        if (!this.internal.length) return null;

        const messages = this.internal.pop();
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
                msg.content != null                &&
                msg.attachments.size == 0          &&
                !msg.system                        &&
                !msg.author.bot);

            if (condition) potentials.push(msg);
        }

        return potentials.length ? potentials : null;
    }
}