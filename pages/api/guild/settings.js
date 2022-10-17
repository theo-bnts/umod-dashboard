import API from '/tools/serverside/API'
import DiscordGuild from '/tools/serverside/Discord/Guild'
import DiscordUser from '/tools/serverside/Discord/User'

export default async function handler(req, res) {

    if (!await API.isValidRequest(req, res))
        return

    const { id, encryption_key, guild_id } = req.body

    let settings

    try {

        if (await DiscordUser.canManageGuild(guild_id, id, encryption_key))
            settings = await DiscordGuild.getSettings(guild_id, id, encryption_key)
        else
            throw 403

    } catch (code) {
        API.returnError(res, code)
        return
    }

    API.returnSuccess(res, { settings })

}