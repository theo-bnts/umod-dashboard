import { API as DiscordAPI } from '/tools/serverside/Discord'
import Crypto from '/tools/serverside/Crypto'
import Database from '/tools/serverside/Database'

class User {
    id
    encryption_key
    access_token
    expiration

    async from(...args) {
        if (args.length === 1)
            await this.fromOAuthCode(...args)
        else if (args.length === 2)
            await this.fromCredentials(...args)
    }

    async fromOAuthCode(oauth_code) {
        if (typeof oauth_code !== 'string' || oauth_code.length === 0)
            throw 400

        this.id = Crypto.generateKey()
        this.encryption_key = Crypto.generateKey()

        const response = await DiscordAPI.request('oauth2/token', undefined, {
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            redirect_uri: process.env.DISCORD_REDIRECT_URI,
            grant_type: 'authorization_code',
            scope: 'identify guilds',
            code: oauth_code
        })

        this.access_token = response.access_token
        this.expiration = new Date(new Date().getTime() + response.expires_in * 1000)

        await Database.runQuery({
            sql: `
                INSERT INTO credentials (user_id, encrypted_access_token, expiration)
                VALUES (?, ?, ?)
            `,
            values: [
                this.id,
                Crypto.encryptData(this.access_token, this.encryption_key),
                this.expiration
            ]
        })
    }

    async fromCredentials(id, encryption_key) {
        if (typeof id !== 'string' || id.length === 0 || typeof encryption_key !== 'string' || encryption_key.length === 0)
            throw 400

        this.id = id
        this.encryption_key = encryption_key

        const rows = await Database.runQuery({
            sql: `
                SELECT encrypted_access_token, expiration
                FROM credentials
                WHERE user_id = ?
                AND expiration > ADDDATE(NOW(), INTERVAL 1 HOUR)
            `,
            values: [this.id]
        })

        if (rows.length === 1) {
            this.access_token = Crypto.decryptData(rows.at(0).encrypted_access_token, this.encryption_key)
            this.expiration = rows.at(0).expiration
        } else
            throw 401
        
        if (this.access_token.length === 0)
            throw 401
    }
    
}

export default User