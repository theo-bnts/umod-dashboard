class Discord {
    static getRole(permissions, owner = false) {
        if (owner)
            return {
                name: 'owner',
                display_name: 'Owner'
            }

        if (permissions & 0x00000008)
            return {
                name: 'admin',
                display_name: 'Administrator'
            }

        if (permissions & 0x00000020)
            return {
                name: 'manager',
                display_name: 'Manager'
            }

        return null
    }
}

class API {
    static async request(...args) {
        let response

        switch (args.length) {
            case 2:
                response = await this.get(...args)
                break
            case 3:
                response = await this.post(...args)
                break
        }

        if (!response.ok)
            throw response.status

        return await response.json()
    }

    static async get(path, access_token) {
        return await fetch(process.env.DISCORD_API_BASE_URL + path, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
    }

    static async post(path, access_token, data) {
        return await fetch(process.env.DISCORD_API_BASE_URL + path, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        })
    }
}

export {
    Discord as default,
    API
}