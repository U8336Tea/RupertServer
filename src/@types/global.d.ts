declare module NodeJS {
    export interface Global {
        config: import("../config.js").ConfigFile;
        discord: import("discord.js").Client;
        responders: Map<import("discord.js").Snowflake, import("../client/discord/DiscordResponder").DiscordResponder>;
        roleCache: import("discord.js").Collection<import("discord.js").Snowflake, import("discord.js").Snowflake>;
    }
}