import type { Message } from "discord.js";

import { rand } from "../../../common.js";
import type { ErrorMessage, MessageProvider } from "../../MessageProvider.js";

export default class implements MessageProvider {
    initialMessage(): Promise<string> {
        return Promise.resolve("yo");
    }

    response(msg: string): Promise<string> {
        const message = msg.toLowerCase();
        if (message.includes("reply if") || message.includes("reply to me")) return Promise.resolve(null);

        if (rand(64) == 0) return Promise.resolve("shut the fuck up");
        return Promise.resolve("shut up");
    }
}