import type { Message } from "discord.js";

import { MESSAGES } from "./constants.js";
import { randElement } from "../../../common.js";
import type { MessageProvider } from "../../MessageProvider.js";

export default class implements MessageProvider {
    private getMessage(): string {
        return randElement(MESSAGES);
    }

    async initialMessage(): Promise<string> { return this.getMessage(); }
    async response(_: Message): Promise<string> { return this.getMessage(); }
}