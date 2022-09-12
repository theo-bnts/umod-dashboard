import { useState, useEffect } from 'react'
import { Text, Spinner } from '@fluentui/react'

import Guild from './guild'
import styles from '../styles/components/Guilds.module.css'

export default function Guilds() {
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
        <div className={styles.guilds}>
            <Text variant='xxLarge'>Your guilds</Text>
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
                                        <Text>You are not a moderator on any guild</Text>
                                    </div>
                        )
                    :
                        <Spinner />
            }
        </div>
    )
}