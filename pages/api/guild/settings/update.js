import API from '/tools/serverside/API'
import DiscordUser from '/tools/serverside/Discord/User'
import { Settings as GuildSettings } from '/tools/serverside/Guild'

export default async function handler(req, res) {

    if (!await API.isValidRequest(req, res))
        return

    const { id, encryption_key, guild_id, type, object } = req.body

    let settings

    try {

        if (await DiscordUser.canManageGuild(guild_id, id, encryption_key)) {
            const parsedObject = JSON.parse(object)
            await GuildSettings.update(guild_id, type, parsedObject)
        } else
            throw 403

    } catch (code) {
        API.returnError(res, code)
        return
    }

    API.returnSuccess(res, { settings })

}