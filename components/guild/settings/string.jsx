import { useState } from 'react'

import { Input, Label } from '@fluentui/react-components'

import Styles from '/styles/components/module.module.css'

export default function GuildSettingString({ moduleName, moduleData, setModuleData, settingName }) {
    const settingData = moduleData[settingName]

    const [value, setValue] = useState(settingData.value)
    const [match, setMatch] = useState(true)

    return (
        <>
            <Label htmlFor={moduleName + '_' + settingName}>{settingData.display}</Label>
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

                        const copy = { ...moduleData }
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