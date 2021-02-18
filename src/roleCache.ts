import { Collection } from "discord.js";

global.roleCache = new Collection();

export function setEvents() {
    global.discord.ws.on("GUILD_CREATE", data => {
        for (const role of data.roles) {
            global.roleCache.set(role.id, data.id);
        }
    });

    global.discord.on("roleCreate", role => {
        global.roleCache.set(role.id, role.guild.id);
    });

    global.discord.on("roleDelete", role => {
        global.roleCache.delete(role.id);
    });
}