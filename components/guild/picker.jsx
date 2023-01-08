import { useState, useEffect } from 'react'

import { Subtitle1, Spinner } from '@fluentui/react-components'

import Guild from '/components/guild/preview'
import API from '/tools/clientside/API'
import Page from '/tools/clientside/Page'
import Styles from '/styles/components/guild/picker.module.css'

export default function GuildPicker() {
    const [loading, setLoading] = useState(true)
    const [guilds, setGuilds] = useState([])

    useEffect(() => {
        (async () => {
            const { id, encryption_key } = Page.getKeys()

            const data = await API.request('api/user/guilds', { id, encryption_key })

            setGuilds(data.guilds.filter(guild => guild.user.role.can_manage_guild === true))
            setLoading(false)
        })()
    }, [])

    return (
        <div className={Styles.picker}>
            {
                loading === false
                    ?
                        (
                            guilds.length > 0
                                ?
                                    guilds.map(guild =>
                                        <Guild key={guild.id} id={guild.id} icon={guild.icon} name={guild.name} user_role={guild.user.role.display_name} bot_in={guild.bot.in} />
                                    )
                                :
                                    <div className={Styles.no_guilds}>
                                        <Subtitle1>You are not a manager, administrator or owner of any guild</Subtitle1>
                                    </div>
                        )
                    :
                        <Spinner />
            }
        </div>
    )
}