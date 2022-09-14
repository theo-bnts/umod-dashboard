import axios from 'axios'

import Crypto from '/objects/tools/Crypto'
import Database from '/objects/tools/Database'

class User {
    id
    encryption_key
    access_token
    expiration

    async create(...args) {
        if (args.length === 1)
            await this.createFromOAuthCode(...args)
        else if (args.length === 2)
            await this.createFromCredentials(...args)
    }

    async createFromOAuthCode(oauth_code) {
        if (typeof oauth_code !== 'string' || oauth_code.length === 0)
            throw 400

        this.id = Crypto.generateKey()
        this.encryption_key = Crypto.generateKey()

        try {
            const { data } = await axios({
                method: 'post',
                baseURL: process.env.DISCORD_API_BASE_URL,
                url: 'oauth2/token',
                data: (
                    new URLSearchParams({
                        client_id: process.env.DISCORD_CLIENT_ID,
                        client_secret: process.env.DISCORD_CLIENT_SECRET,
                        redirect_uri: process.env.DISCORD_REDIRECT_URI,
                        grant_type: 'authorization_code',
                        scope: 'identify guilds',
                        code: oauth_code
                    })
                    .toString()
                )
            })

            this.access_token = data.access_token
            this.expiration = new Date(new Date().getTime() + data.expires_in * 1000)
        } catch (error) {
            throw error.response.status
        }

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

    async createFromCredentials(id, encryption_key) {
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