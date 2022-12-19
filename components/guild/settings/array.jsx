import { Label } from '@fluentui/react-components'
import { Dropdown, Option } from '@fluentui/react-components/unstable'

export default function GuildSettingArray({ moduleName, moduleData, setModuleData, settingName }) {
    const settingData = moduleData[settingName]

    return (
        <>
            <Label htmlFor={moduleName + '_' + settingName}>{moduleData[settingName].display}</Label>
            <Dropdown
                id={moduleName + '_' + settingName}
                selectedOptions={settingData.value}
                multiselect={settingData.multiselect}
                onOptionSelect={(event, data) => {
                    settingData.value = data.selectedOptions.map(display => {
                        return settingData.available?.find(subValue => subValue.display === display).id || display
                    })

                    const copy = { ...moduleData }
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