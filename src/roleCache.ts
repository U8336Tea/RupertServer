import { Collection } from "discord.js";

global.roleCache = new Collection();

interface IDObject {
    id: string;
}

function registerRoles(roles: Iterable<IDObject>, guild: IDObject) {
    for (const role of roles) {
        global.roleCache.set(role.id, guild.id);
    }
}

export function setEvents() {
    global.discord.on("ready", () => {
        for (const guild of global.discord.guilds.cache.values()) {
            registerRoles(guild.roles.cache.values(), guild);
        }
    });

    global.discord.ws.on("GUILD_CREATE", data => {
        registerRoles(data.roles, data);
    });

    global.discord.on("roleCreate", role => {
        global.roleCache.set(role.id, role.guild.id);
    });

    global.discord.on("roleDelete", role => {
        global.roleCache.delete(role.id);
    });
}