export function parseConfig(data: object): ChannelConfig {
    if (!data["channelID"] || !data["earliest"]) return null;

    return {
        channelID: data["channelID"],
        earliest: new Date(data["earliest"])
    };
}

export interface ChannelConfig {
    channelID: string;
    earliest: Date
}