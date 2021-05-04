import type { Message } from "discord.js";

import Channel from "../channel/index.js";
import { MessageProvider } from "../../MessageProvider.js";

export default class implements MessageProvider {
    private provider = new Channel();

    async initialMessage(): Promise<string> {
        return this.rectify(await this.provider.initialMessage());
    }

    async response(message: string): Promise<string> {
        return this.rectify(await this.provider.response(message));
    }

    rectify(message: string): string {
        if (message == null || message == "") return null;

        message = message.replaceAll(/g\\*mer/ig, "conservative");
        message = message.replaceAll(/g*mer/ig, "trump supporter");
        message = message.replaceAll(/gamer/ig, "trumper");

        message = message.replaceAll(/g\\*ming/ig, "conservatism");
        message = message.replaceAll(/g*ming/ig, "trump loving");
        message = message.replaceAll(/gaming/ig, "support for trump");

        return message;
    }
}
