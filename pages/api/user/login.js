import API from '/tools/serverside/API'
import User from '/tools/serverside/User'

class ExtendedUser extends User {
    getKeys() {
        return {
            id: this.id,
            encryption_key: this.encryption_key
        }
    }
}

async function getUser(req) {
    const user = new ExtendedUser()

    if (req.body.oauth_code)
        await user.from(req.body.oauth_code)
    else
        await user.from(req.body.id, req.body.encryption_key)

    return user
}

export default async function handler(req, res) {

    if (req.method === 'POST') {
        let user

        try {
            user = await getUser(req)
        } catch (code) {
            API.returnError(res, code)
            return
        }

        API.returnSuccess(res, user.getKeys())
    } else
        API.returnError(res, 405)

}