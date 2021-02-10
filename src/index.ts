import fs from "fs";
import { join } from "path";

import { Client } from "discord.js";
import { SlashCreator, FastifyServer } from "slash-create";

import oauth from "./oauth.js";
import { config } from "./config.js";
import onMessage from "./commands/dm/onMessage.js";

const slashConfig = config.slashConfig;
const discordConfig = config.discordConfig;

// Initialize globals (see global.d.ts)
global.config = config;
global.discord = new Client({tokenType: discordConfig.botType});
global.responders = new Map();

const fastifyOpts = {
    https: {
        key: fs.readFileSync('tls/key.pem'),
        cert: fs.readFileSync('tls/cert.pem')
    }
}

oauth(slashConfig.appID, slashConfig.secret, "applications.commands").then(token => {
    const creator = new SlashCreator({
        applicationID: slashConfig.appID,
        publicKey: slashConfig.publicKey,
        token: "Bearer " + token,
        serverHost: "0.0.0.0",
        serverPort: 7900
    });

    creator
      .withServer(new FastifyServer(fastifyOpts))
      .registerCommandsIn(join(__dirname, "commands/slash"))
      .syncCommands({ deleteCommands: true })
      .startServer();
});

global.discord.ws.on("READY", (data, _) => { // onMessage will not be triggered if the private channel isn't cached.
    const channels = global.discord.channels;
    for (const channel of data["private_channels"]) {
        if (channels.cache.has(channel.id)) return;
        channels.fetch(channel.id, true);
    }
});

global.discord.on("ready", () => {
    console.log("Discord ready.");
    global.discord.user.setStatus("dnd");
    global.discord.on("message", onMessage);
});

global.discord.login(discordConfig.token);
