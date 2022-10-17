import DiscordAPI from '/tools/serverside/Discord/API'
import DiscordBot from '/tools/serverside/Discord/Bot'
import DiscordPermissions from '/tools/serverside/Discord/Permissions'

class User {
    static async getProfile(id, encryption_key) {
        const response = await DiscordAPI.get(`users/@me`, id, encryption_key)

        return {
            username: response.username,
            discriminator: response.discriminator,
            icon: 'https://cdn.discordapp.com/avatars/' + response.id + '/' + response.avatar + '.webp',
            accent_color: '#' + response.accent_color.toString(16)
        }
    }

    static async getGuilds(id, encryption_key) {
        const guilds = await DiscordAPI.get('users/@me/guilds', id, encryption_key)

        for (const guild of guilds) {
            guild.bot_in = await DiscordBot.isInGuild(guild.id)
        }

        return guilds
            .map(guild => ({
                    id: guild.id,
                    name: guild.name,
                    icon: 'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.webp',
                    user: {
                        role: DiscordPermissions.getTitle(guild.permissions, guild.owner)
                    },
                    bot: {
                        in: guild.bot_in
                    }
            }))
            .filter(guild => guild.user.role.can_manage_guild === true)
            .sort((a, b) => b.bot.in - a.bot.in || b.id - a.id)
    }

    static async canManageGuild(guild_id, id, encryption_key) {
        const guilds = await User.getGuilds(id, encryption_key)

        return guilds.some(guild => guild.id === guild_id) && guilds.find(guild => guild.id === guild_id).bot.in
    }
}

export default User