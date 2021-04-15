import fs from "fs";
import path from "path";

import { TextChannel, SnowflakeUtil } from "discord.js";
import type { Message } from "discord.js";

import BVG from "../bvgold/index.js";
import { rand, randElement } from "../../../common.js";
import { MessageProvider } from "../../MessageProvider.js";
import { ChannelConfig, parseConfig } from "./ChannelConfig.js";
import { ChannelMessageQueue } from "./ChannelMessageQueue.js";

const MAX_QUEUE = 10;

export default class implements MessageProvider {
    private fallback = new BVG(); // In case we can't get any suitable messages
    private config?: ChannelConfig = null;
    private channel?: TextChannel = null;
    private queue: ChannelMessageQueue;

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

                    this.queue = new ChannelMessageQueue(MAX_QUEUE,
                                                        config.earliest.getTime(),
                                                        channel,
                                                        this.config.blacklist);

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
        const content = message.content.toLowerCase();
        if (content.includes("reply if") || content.includes("reply to me")) return;

        if (!this.config || !this.channel) return await this.fallback.response(message);
        switch (rand(16)) {
            case 0:
                return await this.fallback.response(message);
            case 1:
                return await this.fallback.initialMessage();
        }

        if (content.length < 4) {
            return null;
        } else if (!message.content.match(/[a-zA-Z]/) || rand(128) == 0) {
            return "speak american, i cant understand you";
        } else if (content.includes("kill myself")) {
            return await this.fallback.response(message);
        } else if (content.includes("bot") && rand(256) != 0) {
            return await this.fallback.response(message);
        }

        try {
            const potentials = this.queue.pop();
            if (!potentials) return await this.fallback.response(message);

            const responseMessage = randElement(potentials);
            if (this.config.log) {
                console.log(`Sending message from ${responseMessage.author.tag}`)
                console.log(`at https://discord.com/channels/${responseMessage.guild.id}/` +
                    `${responseMessage.channel.id}/${responseMessage.id}`);
            }

            const response = responseMessage.content.replaceAll(/<@.?\d+>/g, "");

            // If response is empty, not including spaces
            if (response.replaceAll(" ", "").length == 0) return await this.fallback.response(message);
            return response;
        } catch(e) {
            console.error(e);
            return await this.fallback.response(message);
        }
    }
}