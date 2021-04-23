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

    async response(message: string): Promise<string> {
        if (message.length < 4 || rand(128) == 0) {
            return null;
        } else if (message.includes("kill myself")) {
            // Send then exit.
            throw new ErrorMessage("If you are really suicidal, please leave here and seek professional help. It is not fair to us or to yourself to put that on us.");
        } else if (message.includes("reply if") && !message.includes("don't reply if")) {
            if (rand(64) == 0) return randElement(constants.LINK_RESPONSE); // Just to shake it up.
            return null;
        } else if (message.includes(" bot")) {
            if (rand(8) == 0) return randElement(constants.RESPONSES);
            if (this.botCount >= constants.BOT_RESPONSES.length) return randElement(constants.BOT_RESPONSES);
            return constants.BOT_RESPONSES[this.botCount++];
        } else if (!message.match(/[a-zA-Z]/)) { // User sent a message like "..."
            return "Please try to speak American. You know I can't understand that!";
        } else if (message.includes("valid argument") || message.includes("actual argument")) {
            return "Okay. " + randElement(constants.RESPONSES);
        } else if (message.includes(" troll") || message.includes(" satire")) {
            if (rand(4) == 0) return randElement(constants.RESPONSES);
    
            // Time spent "looking up the copypasta"
            await sleep(8000);
            return constants.TROLL_PASTA;
        } else if (message.match(/http(s)?:\/\//g)) {
            if (rand(128) == 0) return randElement(constants.RESPONSES);
            return randElement(constants.LINK_RESPONSE);
        } else if (message.includes("proof")) {
            if (rand(128) == 0) return randElement(constants.INITIAL_MESSAGES); // Shake it up a little.
            return randElement(constants.PROOF_RESPONSE);
        } else {
            if (rand(64) == 0) return randElement(constants.INITIAL_MESSAGES);
            return randElement(constants.RESPONSES);
        }
    }
}