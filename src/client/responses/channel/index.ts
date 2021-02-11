import fs from "fs";
import path from "path";

import { TextChannel, SnowflakeUtil } from "discord.js";
import type { Message } from "discord.js";

import BVG from "../bvg/index.js";
import { rand, randElement } from "../../../common.js";
import { MessageProvider } from "../../MessageProvider.js";
import { ChannelConfig, parseConfig } from "./ChannelConfig.js";
import { hasPermission } from "../../../commands/common.js";

export default class implements MessageProvider {
    private fallback = new BVG(); // In case we can't get any suitable messages
    private config?: ChannelConfig = null;
    private channel?: TextChannel = null;

    constructor() {
        const configPath = path.join(__dirname, "config.json");
        fs.readFile(configPath, (err, data) => {
            if (err) return;

            const json = JSON.parse(data.toString());
            const config = parseConfig(json);
            this.config = config;
            if (!config) return;

            global.discord.channels.fetch(config.channelID)
                .then(channel => {
                    if (!(channel instanceof TextChannel)) {
                        this.config = null;
                        return;
                    }

                    this.channel = channel;
                })

                .catch(_ => this.config = null);
        });
    }

    initialMessage(): Promise<string> {
        // TODO: Consider getting initials another way.
        return this.fallback.initialMessage();
    }

    async response(message: Message): Promise<string> {
        if (!this.config || !this.channel) return await this.fallback.response(message);
        if (rand(64) == 0) return await this.fallback.response(message);

        const content = message.content.toLowerCase();
        if (content.length < 4 || rand(128) == 0) {
            return null;
        } else if (content.includes("kill myself")) {
            return await this.fallback.response(message);
        } else if (content.includes("bot") && rand(256) != 0) {
            return await this.fallback.response(message);
        }

        try {
            // Find a random message within the channel.
            const timestamp = rand(Date.now(), this.config.earliest.getTime());
            const date = new Date(timestamp);
            const snowflake = SnowflakeUtil.generate(date);

            const messages = await this.channel.messages.fetch(
                { around: snowflake },
                false);
            
            if (messages.size == 0) return await this.fallback.response(message);

            const array = messages.filter(msg => 
                hasPermission(msg.author.id) && (msg.content != null))
                .array();

            if (array.length == 0) return await this.fallback.response(message);
            let response = randElement(array).content;
            response = response.replaceAll(/<@.?\d+>/g, "");

            // If response is empty, not including spaces
            if (response.replaceAll(" ", "").length == 0) return await this.fallback.response(message);
            return response;
        } catch {
            return await this.fallback.response(message);
        }
    }
}