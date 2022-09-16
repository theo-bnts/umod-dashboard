import API from '/tools/serverside/API'
import User from '/tools/serverside/User'

export default async function handler(req, res) {

    if (!API.isValidRequest(req, res, true))
        return

    let { id, encryption_key, oauth_code } = req.body

    try {
        if (oauth_code) {
            const keys = await User.createKeys(oauth_code)

            id = keys.id
            encryption_key = keys.encryption_key
        }
    } catch (code) {
        API.returnError(res, code)
        return
    }

    API.returnSuccess(res, { id, encryption_key })

}