import type { Message } from "discord.js";

import BVG from "../tr/index.js";
import type { MessageProvider } from "../../MessageProvider.js";

export default class implements MessageProvider {
    private lyrics?: string[] = null;
    private fallback?: MessageProvider = null;
    private counter = 0;

    initialMessage(): Promise<string> {
        const lyric = this.getMessage();
        if (!lyric) return this.fallback.initialMessage();
        return lyric;
    }

    response(message: string): Promise<string> {
        const lyric = this.getMessage();
        if (!lyric) return this.fallback.response(message);
        return lyric;
    }

    private async getMessage(): Promise<string> {
        if (this.fallback) return null;
        if (!this.lyrics) await this.getLyrics();
        if (!this.lyrics) return null;

        if (this.counter >= this.lyrics.length) this.counter = 0;
        return this.lyrics[this.counter++];
    }

    private async getLyrics() {
        // Don't include the lyrics in source in case of copyright violations.
        try {
            const getLyrics = require("lyrics-finder");
            const lyrics: string = await getLyrics("stacy's mom", "fountains of wayne");

            if (!lyrics) return;

            this.lyrics = lyrics
                .replaceAll(/\n{2,}/g, "\n")
                .replaceAll(/stacy/gi, "Shannon")
                .split("\n");

            if (this.lyrics[0].toLowerCase() === "stacy's mom") {
                this.lyrics = this.lyrics.slice(1);
            }
        } catch {
            this.lyrics = null;
            this.fallback = new BVG();
        }
    }
}
