import Database from '/tools/serverside/Database.js'
import Crypto from '/tools/serverside/Crypto.js'
import User from '/tools/serverside/User.js'

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
    static async get(path, user_id, encryption_key) {
        let data = await this.getFromCache(path, user_id, encryption_key)

        if (data === null) {
            data = await this.getWithoutCache(path, user_id, encryption_key)

            await this.saveToCache(path, user_id, encryption_key, data)
        }

        return data
    }

    static async getFromCache(path, user_id, encryption_key) {
        const rows = await Database.Website.runQuery({
            sql: `
                SELECT encrypted_data
                FROM discord_cache
                WHERE path = ?
                AND user_id = ?
                AND date >= SUBDATE(NOW(), INTERVAL ? MINUTE)
                ORDER BY date DESC
            `,
            values: [
                path,
                user_id,
                process.env.DISCORD_CACHE_EXPIRATION_MINUTES
            ]
        })

        let data = null

        if (rows.length > 0) {
            const encrypted_data = rows.at(0).encrypted_data
            const decrypted_data = Crypto.decryptData(encrypted_data, encryption_key)

            if (decrypted_data.length === 0)
                throw 401

            data = JSON.parse(decrypted_data)
        }

        return data
    }

    static async getWithoutCache(path, user_id, encryption_key) {
        const access_token = await User.getAccessToken(user_id, encryption_key)

        const response = await fetch(process.env.DISCORD_API_BASE_URL + path, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        })

        if (!response.ok)
            throw response.status

        return await response.json()
    }

    static async saveToCache(path, user_id, encryption_key, data) {
        await User.isValidKeys(user_id, encryption_key)

        const stringified_data = JSON.stringify(data)
        const encrypted_data = Crypto.encryptData(stringified_data, encryption_key)

        await Database.Website.runQuery({
            sql: `
                INSERT INTO discord_cache
                (path, user_id, encrypted_data)
                VALUES
                (?, ?, ?)
            `,
            values: [
                path,
                user_id,
                encrypted_data
            ]
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

export {
    Discord as default,
    API
}