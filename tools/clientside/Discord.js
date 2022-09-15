class Discord {
    static getOAuthURL() {
        const url = new URL('http://example.com')
        url.protocol = 'https:'
        url.host = 'discord.com'
        url.pathname = '/api/oauth2/authorize'
        url.searchParams.set('client_id', process.env.DISCORD_CLIENT_ID)
        url.searchParams.set('redirect_uri', process.env.DISCORD_REDIRECT_URI)
        url.searchParams.set('response_type', 'code')
        url.searchParams.set('scope', 'identify guilds')

        return url.toString()
    }
}

export default Discord