import type { Message } from "discord.js";

import { rand } from "../../../common.js";
import type { MessageProvider } from "../../MessageProvider.js";

export default class implements MessageProvider {
    initialMessage(): Promise<string> {
        return Promise.resolve("yo");
    }

    response(message: Message): Promise<string> {
        if (rand(64) == 0) return Promise.resolve("shut the fuck up");

        return Promise.resolve("shut up");
    }
}