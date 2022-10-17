import API from '/tools/serverside/API'
import DiscordUser from '/tools/serverside/Discord/User'

export default async function handler(req, res) {

  if (!await API.isValidRequest(req, res))
    return

  const { id, encryption_key } = req.body

  let guilds

  try {
    guilds = await DiscordUser.getGuilds(id, encryption_key)
  } catch (code) {
    API.returnError(res, code)
    return
  }

  API.returnSuccess(res, { guilds: guilds })

}