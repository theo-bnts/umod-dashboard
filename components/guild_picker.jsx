import { useState, useEffect } from 'react'
import { Subtitle1, Spinner } from '@fluentui/react-components'
import { Card } from '@fluentui/react-components/unstable'

import Guild from '/components/guild_preview'

export default function GuildPicker() {
    const [loading, setLoading] = useState(true)
    const [guilds, setGuilds] = useState([])

    useEffect(() => {
        fetch('/api/user/guilds')
            .then(result => result.json())
            .then(data => {
                setGuilds(data.data)
                setLoading(false)
            })
    })

    return (
        <Card>
            {
                loading === false
                    ?
                        (
                            guilds.length > 0
                                ?
                                    guilds.map(guild =>
                                        <Guild key={guild.id} id={guild.id} icon={guild.icon} name={guild.name} user_role={guild.user.role.display_name} />
                                    )
                                :
                                    <div className="no-guilds">
                                        <Subtitle1>You are not a moderator on any guild</Subtitle1>
                                    </div>
                        )
                    :
                        <Spinner />
            }
        </Card>
    )
}