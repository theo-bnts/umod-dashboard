//https://discord.com/api/oauth2/authorize?client_id=750297984645988472&redirect_uri=http://localhost:3000/dashboard/login&response_type=code&scope=identify%20guilds

import API from '/objects/tools/API'
import User from '/objects/User'

class ExtendedUser extends User {
    getKeys() {
        return {
            id: this.id,
            encryption_key: this.encryption_key
        }
    }
}

async function createUser(req) {
    const user = new ExtendedUser()

    if (req.body.oauth_code)
        await user.create(req.body.oauth_code)
    else
        await user.create(req.body.id, req.body.encryption_key)

    return user
}

export default async function handler(req, res) {

    if (req.method === 'POST') {
        let user

        try {
            user = await createUser(req)
        } catch (code) {
            API.returnError(res, code)
            return
        }

        API.returnSuccess(res, user.getKeys())
    } else
        API.returnError(res, 405)

}