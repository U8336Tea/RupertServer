import type { Message, Snowflake } from "discord.js";

function destroy(id: Snowflake): Boolean {
    const responder = global.responders.get(id);
    if (!responder) return false;
    responder.destroy();
    global.responders.delete(id);
    return true;
}

export default function(message: Message, command: string[]) {
    if (command.length < 2) {
        for (const id of global.responders.keys()) {
            destroy(id);
        }

        message.reply("All Ruperts stopped.");
    } else {
        if (!destroy(command[1])) {
            message.reply("Rupert not running");
            return;
        }

        message.reply("Rupert stopped.");
    }
}
