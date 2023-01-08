import { useState, useEffect, useRef } from 'react'

import { Subtitle1, Switch } from '@fluentui/react-components'
import { Card } from '@fluentui/react-components/unstable'
import { isEqual, cloneDeep } from 'lodash'

import GuildSettingInteger from '/components/guild/settings/integer'
import GuildSettingString from '/components/guild/settings/string'
import GuildSettingArray from '/components/guild/settings/array'
import Styles from '/styles/components/guild/settings/index.module.css'
import API from '/tools/clientside/API'
import Page from '/tools/clientside/Page'

export default function GuildSettingsModule({ guildId, moduleName, defaultValues }) {
    const [backValues, setBackValues] = useState(cloneDeep(defaultValues))
    const [frontValues, setFrontValues] = useState(cloneDeep(defaultValues))

    const [displaySavedNotification, setDisplaySavedNotification] = useState(false)

    let precedentTimeoutId = useRef(null)

    useEffect(() => {
        clearTimeout(precedentTimeoutId.current)
        
        precedentTimeoutId.current = setTimeout(async () => {
            if (!isEqual(frontValues, backValues)) {
                const { id, encryption_key } = Page.getKeys()

                await API.request('api/guild/settings/update', {
                    id,
                    encryption_key,
                    guild_id: guildId,
                    type: moduleName,
                    object: JSON.stringify(frontValues)
                })

                setBackValues(cloneDeep(frontValues))

                setDisplaySavedNotification(true)
                setTimeout(() => {
                    setDisplaySavedNotification(false)
                }, 3 * 1000)
            }
        }, 3 * 1000)
    }, [frontValues, backValues, guildId, moduleName])

    return (
        <>
            <Card>
                <div className={Styles.setting_header}>
                    <Subtitle1>{frontValues.display}</Subtitle1>
                    {
                        frontValues.enabled !== undefined
                            ?
                                <Switch
                                    checked={frontValues.enabled.value}
                                    onChange={(event, data) => {
                                        const copy = cloneDeep(frontValues)
                                        copy.enabled.value = data.checked
                                        setFrontValues(copy)
                                    }}
                                />
                            :
                                null
                    }
                </div>

                {
                    frontValues.enabled === undefined || frontValues.enabled.value === true
                        ?
                            Object.entries(frontValues)
                                .filter(([settingName, settingData]) => settingName !== 'enabled')
                                .map(([settingName, settingData]) => {
                                    switch (settingData.type) {
                                        case 'integer':
                                            return (
                                                <GuildSettingInteger
                                                    key={settingName}
                                                    moduleName={moduleName}
                                                    moduleData={frontValues}
                                                    setModuleData={setFrontValues}
                                                    settingName={settingName}
                                                />
                                            )
                                        case 'string':
                                            return (
                                                <GuildSettingString
                                                    key={settingName}
                                                    moduleName={moduleName}
                                                    moduleData={frontValues}
                                                    setModuleData={setFrontValues}
                                                    settingName={settingName}
                                                />
                                            )
                                        case 'array':
                                            return (
                                                <GuildSettingArray
                                                    key={settingName}
                                                    moduleName={moduleName}
                                                    moduleData={frontValues}
                                                    setModuleData={setFrontValues}
                                                    settingName={settingName}
                                                />
                                            )
                                    }
                                })
                        :
                            null
                }
            </Card>
            {
                displaySavedNotification === true
                    ?
                        <div className={Styles.saved_notification}>
                            <span>Saved</span>
                        </div>
                    : null
            }
        </>
    )
}