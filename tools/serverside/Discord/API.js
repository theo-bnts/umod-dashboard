import Cache from '/tools/serverside/Cache'
import User from '/tools/serverside/User'

class API {
    static async get(path, user_id, encryption_key) {
        let data = await Cache.get(path, user_id, encryption_key)

        if (data === null) {
            if (user_id === undefined && encryption_key === undefined)
                data = await this.getAsBot(path)
            else
                data = await this.getAsUser(path, user_id, encryption_key)

            if (!data.ok)
                throw data.status
            
            data = await data.json()

            await Cache.put(path, data, user_id, encryption_key)
        }

        return data
    }

    static async getAsBot(path) {
        return await fetch(process.env.DISCORD_API_BASE_URL + path, {
            method: 'GET',
            headers: {
                Authorization: 'Bot ' + process.env.DISCORD_BOT_TOKEN
            }
        })
    }

    static async getAsUser(path, user_id, encryption_key) {
        const access_token = await User.getAccessToken(user_id, encryption_key)

        return await fetch(process.env.DISCORD_API_BASE_URL + path, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })
    }

    static async post(path, body) {
        const response =  await fetch(process.env.DISCORD_API_BASE_URL + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(body)
        })

        if (!response.ok)
            throw response.status

        return await response.json()
    }
}

export default API