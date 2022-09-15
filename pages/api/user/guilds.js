import API from '/tools/serverside/API'
import Discord, { API as DiscordAPI } from '/tools/serverside/Discord'
import User from '/tools/serverside/User'

class ExtendedUser extends User {
  async getGuilds() {
    const response = await DiscordAPI.request('users/@me/guilds', this.access_token)

    return response
      .map(guild => ({
        id: guild.id,
        name: guild.name,
        icon: 'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.webp?size=512',
        user: {
          role: Discord.getRole(guild.permissions, guild.owner)
        }
      }))
      .filter(guild => guild.user.role !== null)
  }
}

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const user = new ExtendedUser()

    try {
      await user.from(req.body.id, req.body.encryption_key)
    } catch (code) {
      API.returnError(res, code)
      return
    }

    let guilds

    try {
      guilds = await user.getGuilds()
    } catch (code) {
      API.returnError(res, code)
      return
    }

    API.returnSuccess(res, { guilds: guilds })
  } else
    API.returnError(res, 405)

}