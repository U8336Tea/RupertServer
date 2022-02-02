import type { Message } from "discord.js";

import BVG from "../bvgold/index.js";
import { MessageProvider } from "../../MessageProvider.js";

export default class implements MessageProvider {
    private provider = new BVG();

    async initialMessage(): Promise<string> {
        return this.rectify(await this.provider.initialMessage());
    }

    async response(message: string): Promise<string> {
        return this.rectify(await this.provider.response(message));
    }

    rectify(message: string): string {
        if (message == null || message == "") return null;

        message = message.replaceAll(/g\\\*mer/ig, "conservative");
        message = message.replaceAll(/g\*mer/ig, "trump supporter");
        message = message.replaceAll(/gamer/ig, "trumper");

        message = message.replaceAll(/g\\\*ming/ig, "conservatism");
        message = message.replaceAll(/g\\*ming/ig, "trump loving");
        message = message.replaceAll(/gaming/ig, "support for trump");

        message = message.replaceAll(/g\\\*mes/ig, "the art of the deal");
        message = message.replaceAll(/g\*mes/ig, "conservative values");
        message = message.replaceAll(/games/ig, "trump");

        return message;
    }
}
