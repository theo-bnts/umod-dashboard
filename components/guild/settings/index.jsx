import { useState, useEffect } from 'react'

import { Spinner } from '@fluentui/react-components'
import { Card } from '@fluentui/react-components/unstable'

import GuildSettingsModule from '/components/guild/settings/module'
import API from '/tools/clientside/API'
import Page from '/tools/clientside/Page'
import Styles from '/styles/components/guild/settings/index.module.css'

export default function GuildSettings({ guild_id }) {
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState(null)

    useEffect(() => {
        (async () => {
            const { id, encryption_key } = Page.getKeys()

            const data = await API.request('api/guild/settings/get', {
                id,
                encryption_key,
                guild_id
            })

            setSettings(data.settings)
            setLoading(false)
        })()
    }, [guild_id])

    return (
        <div className={Styles.settings}>
            {
                loading === true
                    ?
                        <Spinner />
                    :
                        Object.entries(settings)
                            .map(([moduleName, moduleData]) => {
                                return (
                                    <GuildSettingsModule
                                        key={moduleName}
                                        guildId={guild_id}
                                        moduleName={moduleName}
                                        defaultValues={moduleData}
                                    />
                                )
                            })
            }
        </div>
    )
}