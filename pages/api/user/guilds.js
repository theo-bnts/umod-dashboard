import API from '/tools/serverside/API'
import User from '/tools/serverside/User'

export default async function handler(req, res) {

  if (!API.isValidRequest(req, res))
    return

  const { id, encryption_key } = req.body

  let guilds

  try {
    guilds = await User.getGuilds(id, encryption_key)
  } catch (code) {
    API.returnError(res, code)
    return
  }

  API.returnSuccess(res, { guilds: guilds })

}