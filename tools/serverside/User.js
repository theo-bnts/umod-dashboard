import Crypto from '/tools/serverside/Crypto'
import Database from '/tools/serverside/Database'
import DiscordAPI from '/tools/serverside/Discord/API'

class User {
    static async createKeys(oauth_code) {
        if (typeof oauth_code !== 'string' || oauth_code.length === 0)
            throw 400

        const { access_token, expires_in: seconds_of_validity } = await DiscordAPI.post('oauth2/token', {
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            redirect_uri: process.env.DISCORD_REDIRECT_URI,
            grant_type: 'authorization_code',
            scope: 'identify guilds',
            code: oauth_code
        })

        const id = Crypto.generateKey()
        const encryption_key = Crypto.generateKey()

        await Database.Website.runQuery({
            sql: `
                INSERT INTO credentials (user_id, encrypted_access_token, expiration)
                VALUES (
                    ?,
                    ?,
                    ADDDATE(NOW(), INTERVAL ? SECOND)
                )
            `,
            values: [
                id,
                Crypto.encryptData(access_token, encryption_key),
                seconds_of_validity
            ]
        })

        return { id, encryption_key }
    }

    static async isValidKeys(id, encryption_key) {
        try {
            await this.getAccessToken(id, encryption_key)
        } catch (code) {
            return false
        }

        return true
    }

    static async getAccessToken(id, encryption_key) {
        if (typeof id !== 'string' || id.length === 0 || typeof encryption_key !== 'string' || encryption_key.length === 0)
            throw 400

        const rows = await Database.Website.runQuery({
            sql: `
                SELECT encrypted_access_token
                FROM credentials
                WHERE user_id = ?
                AND expiration > ADDDATE(NOW(), INTERVAL 1 HOUR)
            `,
            values: [id]
        })

        if (rows.length === 0)
            throw 401

        const encrypted_access_token = rows.at(0).encrypted_access_token
        const access_token = Crypto.decryptData(encrypted_access_token, encryption_key)

        if (access_token.length === 0)
            throw 401

        return access_token
    }
}

export default User