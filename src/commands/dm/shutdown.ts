import type { Message } from "discord.js";

function destroy(id: string): Boolean {
    const responder = global.responders.get(id);
    if (!responder) return false;
    responder.destroy();
    global.responders.delete(id);
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
