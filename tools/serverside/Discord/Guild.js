import DiscordAPI from '/tools/serverside/Discord/API'

class Guild {
    static async getChannels(guild_id) {
        const channels = await DiscordAPI.get('guilds/' + guild_id + '/channels')

        return channels
            .filter(channel => channel.type === 0)
            .sort((a, b) => a.position - b.position)
            .map(channel => {
                return {
                    id: channel.id,
                    display: channel.name
                }
            })
    }

    static async getRoles(guild_id) {
        const roles = await DiscordAPI.get('guilds/' + guild_id + '/roles')

        return roles
            .sort((a, b) => b.position - a.position)
            .map(role => {
                return {
                    id: role.id,
                    display: role.name
                }
            })
    }
}

export default Guild