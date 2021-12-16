import fs from "fs";
import path from "path";

import { TextChannel } from "discord.js";

import BVG from "../bvg/index.js";
import { rand, randElement } from "../../../common.js";
import { MessageProvider } from "../../MessageProvider.js";
import { McDConfig, parseConfig } from "./McDConfig.js";
import { McDMessageQueue } from "./McDMessageQueue.js";

const MAX_QUEUE = 10;

export default class implements MessageProvider {
    private fallback = new BVG(); // In case we can't get any suitable messages
    private config?: McDConfig = null;
    private channel?: TextChannel = null;
    private queue: McDMessageQueue;

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

                    this.queue = new McDMessageQueue(MAX_QUEUE,
                                                        config.earliest,
                                                        config.latest,
                                                        channel,
                                                        config.blacklist);

                    this.channel = channel;
                })

                .catch(_ => this.config = null);
        });
    }

    initialMessage(): Promise<string> {
        // TODO: Consider getting initials another way.
        return this.fallback.initialMessage();
    }

    async response(message: string): Promise<string> {
        if (!this.config || !this.channel) return await this.fallback.response(message);
        switch (rand(64)) {
            case 0:
                return await this.fallback.response(message);
            case 1:
                return await this.fallback.initialMessage();
        }

        if (message.length == 0 && rand(8) != 0) {
            return null;
        } else if (message.includes("kill myself")) {
            return await this.fallback.response(message);
        } else if (message.includes("bot") && rand(256) != 0) {
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