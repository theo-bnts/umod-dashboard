import Crypto from '/tools/serverside/Crypto'
import Database from '/tools/serverside/Database'
import User from '/tools/serverside/User'

class Cache {
    static async get(path, user_id, encryption_key) {
        let rows = null
        
        if (user_id === undefined || encryption_key === undefined)
            rows = await Database.Website.runQuery({
                sql: `
                    SELECT data
                    FROM discord_cache
                    WHERE path = ?
                    AND user_id IS NULL
                    AND date >= SUBDATE(NOW(), INTERVAL ? MINUTE)
                    ORDER BY date DESC
                `,
                values: [
                    path,
                    process.env.DISCORD_CACHE_EXPIRATION_MINUTES
                ]
            })
        else
            rows = await Database.Website.runQuery({
                sql: `
                    SELECT data
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
            data = rows.at().data

            if (user_id !== undefined || encryption_key !== undefined) {
                data = Crypto.decryptData(data, encryption_key)

                if (data.length === 0)
                    throw 401
            }

            data = JSON.parse(data)
        }

        return data
    }


    static async put(path, data, user_id, encryption_key) {
        const stringified_data = JSON.stringify(data)

        if (user_id === undefined && encryption_key === undefined)
            await this.putWithoutEncryption(path, stringified_data)
        else
            await this.putWithEncryption(path, stringified_data, user_id, encryption_key)
    }

    static async putWithoutEncryption(path, stringified_data) {
        await Database.Website.runQuery({
            sql: `
                INSERT INTO discord_cache
                (path, data)
                VALUES
                (?, ?)
            `,
            values: [
                path,
                stringified_data
            ]
        })
    }
    
    static async putWithEncryption(path, stringified_data, user_id, encryption_key) {
        await User.isValidKeys(user_id, encryption_key)

        const encrypted_data = Crypto.encryptData(stringified_data, encryption_key)

        await Database.Website.runQuery({
            sql: `
                INSERT INTO discord_cache
                (path, user_id, data)
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
}

export default Cache