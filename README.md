A Discord bot to argue with people. Currently configured to argue for the r/BanVideoGames server. Vocabulary can easily be changed. Currently configured to start with the command `/crapsing` and end with `/crapnaked`.

# USAGE
This project requires a list of configuration files:
- config.json
- configs/default.json
- configs/{SERVER ID}/default.json
- configs/{SERVER ID}/{CHANNEL ID}.json

More will be discussed in the next session. In addition, the following files are necessary:
- tls/cert.pem: the full chain certificate
- tls/key.pem: the key

The bot listens for Discord slash command interactions on HTTPS port 7900.

# CONFIGURATION
## config.json
This is the configuration for the entire server. Format:
```json
{
    "discordConfig": { // Configuration for the chat bot account.
        "botType": "User", // or "Bot"
        "token": ""
    },

    "slashConfig": { // Configuration for the slash command interaction server.
        "appID": "",
        "publicKey": "",
        "secret": "",
        "allowGuild": "", // Guild ID on which to check if the user has permission to run the command.
        "allowedMembers": [
            {
                "type": "Role", // Or "User"
                "id": "794001861937463327"
            }
        ]
    }
}
```

## configs directory
```json
{
    "responderName": "bvg", // Currently this does nothing.
    "timeoutInterval": 0000000, // The time in milliseconds which the responder can be idle before it destroys itself
    
    "rules": [ // The rules to which the responder responds, without being mentioned.
        { "type": "Role", "id": "" },
        { "type": "User", "id": "" }
    ],

    "blacklist": [ // The rules to which the responder never responds, even if it's mentioned.
        { "type": "Role", "id": "" },
        { "type": "User", "id": "" }
    ]
}
```
