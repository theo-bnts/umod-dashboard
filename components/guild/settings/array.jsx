import { Dropdown, Option } from '@fluentui/react-components/unstable'
import { cloneDeep } from 'lodash'

import GuildSettingModuleLabel from '/components/guild/settings/label'

export default function GuildSettingArray({ moduleName, moduleData, setModuleData, settingName }) {
    const settingData = cloneDeep(moduleData[settingName])

    return (
        <>
            <GuildSettingModuleLabel moduleName={moduleName} settingName={settingName} settingData={settingData} />
            <Dropdown
                id={moduleName + '_' + settingName}
                selectedOptions={settingData.value}
                multiselect={settingData.multiselect}
                onOptionSelect={(event, data) => {

                    settingData.value = data.selectedOptions.map(display => {
                        return settingData.available?.find(subValue => subValue.display === display).id || display
                    })

                    const copy = cloneDeep(moduleData)
                    copy[settingName] = settingData
                    setModuleData(copy)
                }}
            >
                {
                    settingData.available?.map(({id, display}) =>
                        <Option
                            key={id}
                            value={display}
                        >
                            {display}
                        </Option>
                    )
                }
            </Dropdown>
        </>
    )
}