import EventEmitter from "events";

import { Channel, Client, DiscordAPIError, Message, MessageOptions, TextChannel } from "discord.js";
import { Mutex } from "async-mutex";

import { rand, sleep } from "../common.js";
import { ErrorMessage } from "./MessageProvider.js";
import type { MessageProvider } from "./MessageProvider.js";
import { Rule, RuleMember } from "../Rule.js";

type MessageHandler = (message: Message) => (void);

export declare interface Responder {
    on(event: 'ready', handler: () => void): this;
    once(event: 'ready', handler: () => void): this;
    emit(event: 'ready'): boolean;
    off(event: 'ready', handler: () => void): this;

    on(event: 'log', handler: (argument: string) => void): this;
    once(event: 'log', handler: (argument: string) => void): this;
    emit(event: 'log', argument: string): boolean;
    off(event: 'log', handler: (argument: string) => void): this;

    on(event: 'timeout', handler: () => void): this;
    once(event: 'timeout', handler: () => void): this;
    emit(event: 'timeout'): boolean;
    off(event: 'destroy', handler: () => void): this;

    on(event: 'destroy', handler: () => void): this;
    once(event: 'destroy', handler: () => void): this;
    emit(event: 'destroy'): boolean;
    off(event: 'destroy', handler: () => void): this;
}

export class Responder extends EventEmitter {
    targetRules: Rule[];
    blacklistRules: Rule[];

    private _destroyed: boolean = false;
    get destroyed() { return this._destroyed }

    private client: Client;
    private timeoutInterval?: number;
    private timeoutObject: NodeJS.Timeout;
    private provider: MessageProvider;
    private handlers: MessageHandler[] = [];
    private readonly typeMutex: Mutex = new Mutex();

    constructor(client: Client, provider: MessageProvider, timeoutInterval: number = null, target: Rule[], blacklist: Rule[]) {
        super();
        
        this.client = client;
        this.timeoutInterval = timeoutInterval;
        this.provider = provider;
        this.targetRules = target;
        this.blacklistRules = blacklist;
    }

    async listen(channel: TextChannel) {
        await this.sendInitial(channel);

        const handler = this.getMessageHandler(channel);
        this.client.on("message", handler);
        this.handlers.push(handler);

        if (this.timeoutInterval) this.timeoutObject = setTimeout(this.timedOut, this.timeoutInterval);

        this.emit("ready");
    }

    private async sendInitial(channel: TextChannel) {
        const message = await this.provider.initialMessage();
        this.emit("log", "Initial message: " + message);

        channel.startTyping().catch(e => this.handleAPIError(e));
        await sleep(rand(7, 2) * 1000);
        channel.stopTyping();

        try{
            await channel.send(message);
        } catch (e: unknown) {
            if (e instanceof DiscordAPIError) return this.handleAPIError(e);

            this.emit("log", e.toString());
        }
    }

    private resetTimer() {
        clearTimeout(this.timeoutObject);
        this.timeoutObject = setTimeout(this.timedOut, this.timeoutInterval);
    }

    private getMessageHandler(channel: Channel): MessageHandler {
        return (message: Message) => {
            if (this.timeoutInterval) this.resetTimer();

            if (message.channel.id !== channel.id) return;
            if (message.author.id === this.client.user.id) return;

            if (message.mentions.users.has(this.client.user.id)) this.respond(message);
            else this.onMiscMessage(message);
        }
    }

    private async respond(message: Message) {
        const author = message.member;
        for (const rule of this.blacklistRules) {
            if (rule.isMatch(RuleMember.fromDiscordJS(author))) {
                const user = author.user;
                this.emit("log", `\nBlacklisted from ${user.tag}`);
                return;
            }
        }

        const channel = message.channel;
        try {
            var reply = await this.provider.response(message);
            this.emit("log", `\nMessage received: ${message.content}`);
            this.emit("log", `Reply: ${reply}`);
        } catch (e: unknown) {
            if (e instanceof ErrorMessage) {
                // Final response for this object.
                channel.send(e.toString());
                this.destroy();
                return;
            }

            console.log(e);
        }
        
        if (!reply) return;

        const opts: MessageOptions = {
            tts: true,
            allowedMentions: { 
                parse: ["roles", "users", "everyone"],
                repliedUser: true
            }
        };

        await this.typeMutex.runExclusive(async () => {
            // Typing and reading time to "humanize" Rupert.
            await sleep(rand(3, 1) * 1000);

            channel.startTyping().catch(e => this.handleAPIError(e));
            await sleep(rand(5, 2) * 1000);
            await sleep(rand(2, 0) * 1000);
            channel.stopTyping();

            try {
                await message.reply(reply, opts);
            } catch (e: unknown) {
                if (e instanceof DiscordAPIError) {
                    switch (e.code) {
                    case 160002:
                        await channel.send(reply, opts);
                        return;
                    default:
                        this.handleAPIError(e);
                        return;
                    }
                }
    
                this.emit("log", e.toString());
            }
        });
    }

    private handleAPIError(e: DiscordAPIError) {
        switch(e.code) {
        case 50001:
            this.destroy();
            return;
        case 50035:
            return;
        }

        this.emit("log", e.toString());
    }

    private async onMiscMessage(message: Message) {
        const author = message.member;
        if (!author) return;

        for (const rule of this.targetRules) {
            if (rule.isMatch(RuleMember.fromDiscordJS(author))) return this.respond(message);
        }
    }

    private timedOut() {
        this.emit("timeout");
        this.destroy();
    }

    destroy() {
        this.emit("destroy");
        for (const handler of this.handlers) {
            this.client.off("message", handler);
        }

        this._destroyed = true;
    }
}
