import type { Message } from "discord.js";

import Channel from "../channel/index.js";
import { MessageProvider } from "../../MessageProvider.js";

export default class implements MessageProvider {
    private provider = new Channel();

    async initialMessage(): Promise<string> {
        return this.rectify(await this.provider.initialMessage());
    }

    async response(message: Message): Promise<string> {
        return this.rectify(await this.provider.response(message));
    }

    rectify(message: string): string {
        message = message.replaceAll(/g\\*mer/i, "conservative");
        message = message.replaceAll(/g*mer/i, "trump supporter");
        message = message.replaceAll(/gamer/i, "trumper");

        message = message.replaceAll(/g\\*ming/i, "conservatism");
        message = message.replaceAll(/g*ming/i, "trump loving");
        message = message.replaceAll(/gaming/i, "support for trump");

        return message;
    }
}
