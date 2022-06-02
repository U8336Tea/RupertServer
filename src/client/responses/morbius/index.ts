import type { Message } from "discord.js";

import BVG from "../channel/index.js";
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

        message = message.replaceAll(/g\\\*mer/ig, "morbius");
        message = message.replaceAll(/g\*mer/ig, "morbius watcher");
        message = message.replaceAll(/gamer/ig, "morbiuser");

        message = message.replaceAll(/g\\\*ming/ig, "morbiusism");
        message = message.replaceAll(/g\\*ming/ig, "morbius loving");
        message = message.replaceAll(/gaming/ig, "support for morbius");

        message = message.replaceAll(/g\\\*mes/ig, "morbius movie");
        message = message.replaceAll(/g\*mes/ig, "morbian values");
        message = message.replaceAll(/games/ig, "morbius");

        return message;
    }
}
