import type { Message } from "discord.js";

import * as constants from "./constants.js";
import { rand, randElement, sleep } from "../../../common.js";
import { ErrorMessage, MessageProvider } from "../../MessageProvider.js";

export default class implements MessageProvider {
    private botCount = 0;

    initialMessage(): Promise<string> {
        return new Promise(resolve => {
            resolve(randElement(constants.INITIAL_MESSAGES));
        });
    }

    async response(message: Message): Promise<string> {
        const content = message.content.toLowerCase();
        if (content.length < 4 || rand(128) == 0) {
            return null;
        } else if (content.includes("kill myself")) {
            // Send then exit.
            throw new ErrorMessage("If you are really suicidal, please leave here and seek professional help. It is not fair to us or to yourself to put that on us.");
        } else if (content.includes("reply if") && !content.includes("don't reply if")) {
            if (rand(64) == 0) return randElement(constants.INITIAL_MESSAGES); 
            return null;
        } else if (content.includes(" bot")) {
            if (rand(8) == 0) return randElement(constants.RESPONSES);
            if (this.botCount >= constants.BOT_RESPONSES.length) return randElement(constants.BOT_RESPONSES);
            return constants.BOT_RESPONSES[this.botCount++];
        } else if (!content.match(/[a-zA-Z]/)) { // User sent a message like "..."
            return "Speak American. You're virtually incoherent.";
        } else if (content.includes("valid argument") || content.includes("actual argument")) {
            return "Okay. " + randElement(constants.INITIAL_MESSAGES);
        } else if (content.includes(" troll") || content.includes(" satire")) {
            if (rand(4) == 0) return randElement(constants.RESPONSES);
    
            // Time spent "looking up the copypasta"
            await sleep(8000);
            return constants.TROLL_PASTA;
        } else {
            if (rand(64) == 0) return randElement(constants.INITIAL_MESSAGES);
            return randElement(constants.RESPONSES);
        }
    }
}