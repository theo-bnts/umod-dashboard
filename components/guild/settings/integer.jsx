import { Label, Slider } from '@fluentui/react-components'
import { cloneDeep } from 'lodash'

import GuildSettingModuleLabel from '/components/guild/settings/label'
import Styles from '/styles/components/guild/settings/index.module.css'

export default function GuildSettingInteger({ moduleName, moduleData, setModuleData, settingName }) {
    const settingData = cloneDeep(moduleData[settingName])

    return (
        <>
            <GuildSettingModuleLabel moduleName={moduleName} settingName={settingName} settingData={settingData} />
            <Slider
                id={moduleName + '_' + settingName}
                value={settingData.value}
                min={settingData.min}
                max={settingData.max}
                onChange={(event, data) => {
                    settingData.value = data.value

                    const copy = cloneDeep(moduleData)
                    copy[settingName] = settingData
                    setModuleData(copy)
                }}
            />
            <div className={Styles.slider_values}>
                <Label>{settingData.min}</Label>
                <Label>Current : {settingData.value}</Label>
                <Label>{settingData.max}</Label>
            </div>
        </>
    )
}