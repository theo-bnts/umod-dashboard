import { useState } from 'react'

import { Input, Label } from '@fluentui/react-components'
import { cloneDeep } from 'lodash'

import GuildSettingModuleLabel from '/components/guild/settings/label'
import Styles from '/styles/components/guild/settings/module.module.css'

export default function GuildSettingString({ moduleName, moduleData, setModuleData, settingName }) {
    const settingData = cloneDeep(moduleData[settingName])

    const [value, setValue] = useState(settingData.value)
    const [match, setMatch] = useState(true)

    return (
        <>
            <GuildSettingModuleLabel moduleName={moduleName} settingName={settingName} settingData={settingData} />
            <Input
                id={moduleName + '_' + settingName}
                value={value}
                onChange={(event, data) => {
                    settingData.value = data.value

                    setValue(settingData.value)

                    if (new RegExp(settingData.regex).test(settingData.value) === false) {
                        setMatch(false)
                    } else {
                        setMatch(true)

                        const copy = cloneDeep(moduleData)
                        copy[settingName] = settingData
                        setModuleData(copy)
                    }
                }}
            />
            {
                match === false
                    ?
                        <Label
                            htmlFor={moduleName + '_' + settingName}
                            className={Styles.error_label}
                        >
                            Invalid value
                        </Label>
                    :
                        null
            }
        </>
    )
}