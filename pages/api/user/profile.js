import API from '/tools/serverside/API'
import DiscordUser from '/tools/serverside/Discord/User'

export default async function handler(req, res) {

    if (!await API.isValidRequest(req, res))
        return
    
    const { id, encryption_key } = req.body

    let profile

    try {
        profile = await DiscordUser.getProfile(id, encryption_key)
    } catch (code) {
        API.returnError(res, code)
        return
    }

    API.returnSuccess(res, profile)
    
}