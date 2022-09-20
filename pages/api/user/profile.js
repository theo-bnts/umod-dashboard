import API from '/tools/serverside/API'
import User from '/tools/serverside/User'

export default async function handler(req, res) {

    if (!await API.isValidRequest(req, res))
        return
    
    const { id, encryption_key } = req.body

    let profile

    try {
        profile = await User.getProfile(id, encryption_key)
    } catch (code) {
        API.returnError(res, code)
        return
    }

    API.returnSuccess(res, profile)
    
}