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

        message = message.replaceAll(/g\\\*mer/ig, "liberal");
        message = message.replaceAll(/g\*mer/ig, "biden supporter");
        message = message.replaceAll(/gamer/ig, "lib");

        message = message.replaceAll(/g\\\*ming/ig, "liberalism");
        message = message.replaceAll(/g\\*ming/ig, "clinton loving");
        message = message.replaceAll(/gaming/ig, "support for hillary");

        message = message.replaceAll(/g\\\*mes/ig, "obamaism");
        message = message.replaceAll(/g\*mes/ig, "liberal values");
        message = message.replaceAll(/games/ig, "joe biden");

        return message;
    }
}
