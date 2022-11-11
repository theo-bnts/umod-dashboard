import { useState, useEffect } from 'react'

import { Subtitle1, Switch } from '@fluentui/react-components'
import { Card } from '@fluentui/react-components/unstable'
import { isEqual } from 'lodash'

import GuildSettingInteger from '/components/guild/settings/integer'
import GuildSettingString from '/components/guild/settings/string'
import GuildSettingArray from '/components/guild/settings/array'
import Styles from '/styles/components/guild/settings.module.css'

export default function GuildSettingsModule({ name, defaultValues }) {
    const [backValues, setBackValues] = useState(defaultValues)
    const [frontValues, setFrontValues] = useState(defaultValues)

    const [precedentTimeoutId, setPrecedentTimeoutId] = useState(null)

    useEffect(() => {
        clearTimeout(precedentTimeoutId)

        setPrecedentTimeoutId(
            setTimeout(() => {
                console.log('frontValues', frontValues)
                console.log('backValues', backValues)

                if (!isEqual(frontValues, backValues)) {
                    console.log('Calling API ..')
                    //setBackValues(frontValues)
                }
            }, 3 * 1000)
        )
    }, [frontValues, backValues, precedentTimeoutId])

    return (
        <Card>
            <div className={Styles.setting_header}>
                <Subtitle1>{frontValues.display}</Subtitle1>
                {
                    frontValues.enabled !== undefined
                        ?
                            <Switch
                                checked={frontValues.enabled.value}
                                onChange={(event, data) => {
                                    const copy = { ...frontValues }
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
                                                moduleName={name}
                                                moduleData={frontValues}
                                                setModuleData={setFrontValues}
                                                settingName={settingName}
                                            />
                                        )
                                    case 'string':
                                        return (
                                            <GuildSettingString
                                                moduleName={name}
                                                moduleData={frontValues}
                                                setModuleData={setFrontValues}
                                                settingName={settingName}
                                            />
                                        )
                                    case 'array':
                                        return (
                                            <GuildSettingArray
                                                moduleName={name}
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
    )
}