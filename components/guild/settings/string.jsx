import { Input, Label } from '@fluentui/react-components'

export default function GuildSettingString({ moduleName, moduleData, setModuleData, settingName }) {
    const settingData = moduleData[settingName]

    return (
        <>
            <Label htmlFor={moduleName + '_' + settingName}>{settingData.display}</Label>
            <Input
                id={moduleName + '_' + settingName}
                value={settingData.value}
                onChange={(event, data) => {
                    settingData.value = data.value

                    const copy = { ...moduleData }
                    copy[settingName] = settingData
                    setModuleData(copy)
                }}
            />
        </>
    )
}