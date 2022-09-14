import axios from 'axios'

import API from '/objects/tools/API'
import User from '/objects/User'

class ExtendedUser extends User {
  async getGuilds() {
    let data

    try {

      const response = await axios({
        method: 'get',
        baseURL: process.env.DISCORD_API_BASE_URL,
        url: 'users/@me/guilds',
        headers: {
          Authorization: `Bearer ${this.access_token}`
        }
      })

      data = response.data

    } catch (error) {
      throw error.response.status
    }

    const guilds = data.map(guild => {
      let role = null

      if (guild.owner)
        role = {
          name: 'owner',
          display_name: 'Owner'
        }
      else if (guild.permissions & 0x00000008)
        role = {
          name: 'admin',
          display_name: 'Administrator'
        }
      else if (guild.permissions & 0x00000020)
        role = {
          name: 'manager',
          display_name: 'Manager'
        }

      return {
        id: guild.id,
        name: guild.name,
        icon: 'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.webp?size=128',
        user: {
          role: role
        }
      }
    })

    return guilds.filter(guild => guild.user.role !== null)
  }
}

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const user = new ExtendedUser()

    try {
      await user.create(req.body.id, req.body.encryption_key)
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
