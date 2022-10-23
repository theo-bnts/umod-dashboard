import { useState, useEffect } from 'react'

import { Label, Slider, Subtitle1, Spinner, Switch } from '@fluentui/react-components'
import { Card, Dropdown, Option } from '@fluentui/react-components/unstable'

import API from '/tools/clientside/API'
import Page from '/tools/clientside/Page'
import Styles from '/styles/components/guild_settings.module.css'

export default function GuildSettings({ guild_id }) {
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState(null)

    const [logsChannel, setLogsChannel] = useState(null)
    const [timeout, setTimeout] = useState(null)

    useEffect(() => {
        (async () => {
            const { id, encryption_key } = Page.getKeys()

            const data = await API.request('api/guild/settings', {
                id,
                encryption_key,
                guild_id
            })

            setSettings(data.settings)
        })()
    }, [guild_id])

    useEffect(() => {
        if (settings === null)
            return

        setLogsChannel(settings.logs_channel)    
        setTimeout(settings.timeout)

        setLoading(false)
    }, [settings])

    return (
        <Card>
            {
                loading === true
                    ?
                        <Spinner />
                    :
                        <>
                            <Card>
                                <Subtitle1>Logs channel</Subtitle1>
                                <Dropdown
                                    placeholder='Select a channel'
                                    defaultSelectedOptions={logsChannel.current !== null ? [logsChannel.current.id] : []}
                                    onOptionSelect={(event, data) => setLogsChannel({
                                        ...logsChannel,
                                        current: logsChannel.available.find(channel => channel.id === data.optionValue)
                                    })}
                                >
                                    {
                                        logsChannel.available.map(channel =>
                                            <Option
                                                value={channel.id}
                                                key={channel.id}
                                            >
                                                {channel.name}
                                            </Option>
                                        )
                                    }
                                </Dropdown>
                            </Card>

                            <Card>
                            <div className={Styles.setting_header}>
                                <Subtitle1>Timeout on infraction</Subtitle1>
                                <Switch
                                    defaultChecked={timeout.enabled}
                                    onChange={(event, data) => setTimeout({...timeout, enabled: data.checked})}
                                />
                            </div>
                            {
                                timeout.enabled === true
                                    ?
                                        <>
                                            <Label htmlFor='timeout_seconds_slider'>Timeout duration in seconds</Label>
                                            <Slider
                                                id='timeout_seconds_slider'
                                                defaultValue={timeout.params.seconds.current}
                                                min={timeout.params.seconds.min}
                                                max={timeout.params.seconds.max}
                                                onChange={(event, data) => {
                                                    setTimeout({
                                                        ...timeout,
                                                        params: {
                                                            ...timeout.params,
                                                            seconds: {
                                                                ...timeout.params.seconds,
                                                                current: data.value
                                                            }
                                                        }
                                                    })
                                                }}
                                            />
                                        </>
                                    :
                                        null
                            }
                        </Card>
                    </>
            }
        </Card>
    )
}