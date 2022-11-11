import { useState, useEffect } from 'react'

import { Subtitle1, Spinner } from '@fluentui/react-components'
import { Card } from '@fluentui/react-components/unstable'

import Guild from '/components/guild/preview'
import API from '/tools/clientside/API'
import Page from '/tools/clientside/Page'

export default function GuildPicker() {
    const [loading, setLoading] = useState(true)
    const [guilds, setGuilds] = useState([])

    useEffect(() => {
        (async () => {
            const keys = Page.getKeys()

            const data = await API.request('api/user/guilds', keys)

            setGuilds(data.guilds)
            setLoading(false)
        })()
    }, [])

    return (
        <Card>
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
                                    <div className='no-guilds'>
                                        <Subtitle1>You are not a manager, administrator or owner of any guild</Subtitle1>
                                    </div>
                        )
                    :
                        <Spinner />
            }
        </Card>
    )
}