declare module NodeJS {
    export interface Global {
        config: import("../config.js").ConfigFile;
        discord: import("discord.js").Client;
        responders: Map<import("discord.js").Snowflake, import("../client/Responder").Responder>;
        roleCache: import("discord.js").Collection<import("discord.js").Snowflake, import("discord.js").Snowflake>;
    }
}