import ExtendedURL from '/tools/clientside/ExtendedURL'
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
            accent_color: response.accent_color !== null ? '#' + response.accent_color.toString(16) : undefined
        }
    }

    static async getGuilds(id, encryption_key) {
        const guilds = await DiscordAPI.get('users/@me/guilds', id, encryption_key)

        for (const guild of guilds) {
            guild.bot_in = await DiscordBot.isInGuild(guild.id)
        }

        return guilds
            .map(guild => {
                if (guild.icon !== null) {
                    guild.icon = 'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.webp'
                } else {
                    guild.icon = ExtendedURL.setParameters('https://ui-avatars.com/api/', {
                        background: '36393f',
                        color: 'fff',
                        name: guild.name
                    })
                }
                
                return {
                    id: guild.id,
                    name: guild.name,
                    icon: guild.icon,
                    user: {
                        role: DiscordPermissions.getTitle(guild.permissions, guild.owner)
                    },
                    bot: {
                        in: guild.bot_in
                    }
                }
            })
            .sort((a, b) => b.bot.in - a.bot.in || b.id - a.id)
    }

    static async canManageGuild(guild_id, id, encryption_key) {
        const guilds = await User.getGuilds(id, encryption_key)

        return guilds.find(guild => guild.id === guild_id && guild.user.role.can_manage_guild === true)?.bot.in === true
    }
}

export default User