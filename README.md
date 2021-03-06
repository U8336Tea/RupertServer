A Discord bot to argue with people. Currently configured to argue for the
r/BanVideoGames server. Vocabulary can easily be changed. Currently
configured to start with the command `/crapsing` and end with `/crapnaked`.

# USAGE
This project requires a list of configuration files:
- config.json
- configs/default.json
- configs/{SERVER ID}/default.json
- configs/{SERVER ID}/{CHANNEL ID}.json

More will be discussed in the next section. In addition, the following files are necessary:
- tls/cert.pem: the full chain certificate
- tls/key.pem: the key

The bot listens for Discord slash command interactions over HTTPS.

# VOCABULARIES
Vocabularies are swappable classes which can be used to change the way that
Rupert speaks. At the moment, the `name` argument to `/crapsing` can be
used to change out vocabularies.

Vocabularies are loaded from `client/responses/{name}/index.js`.

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
        "port": 7900,
        "allowedMembers": [
            { // Since role IDs are universal, this will work in any server.
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
    "timeoutInterval": 1000000, // The time in milliseconds which the responder can be idle before it destroys itself
    
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

## channel (client/responses/channel/config.json)
```json
{
    "channelID": "",
    "earliest": "", // The earliest we can query from the channel. ISO 8601 format. Default: the date the channel was created.
    "latest": "", // The latest we can query from this channel. ISO 8601 format. Optional.
    "log": true, // Whether to log these messages to console. Default: false
    "blacklist": [ // The messages not to send.
        { "type": "User", "id": "0" },
        { "type": "Role", "id": "0" }
    ]
}
```
