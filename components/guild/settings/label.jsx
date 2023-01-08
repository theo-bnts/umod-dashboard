import { Label } from '@fluentui/react-components'
import { QuestionCircleFilled } from '@fluentui/react-icons'

import Styles from '/styles/components/guild/settings/module.module.css'

export default function GuildSettingModuleLabel({ moduleName, settingName, settingData }) {
    return (
        <div className={Styles.label_parent}>
            <Label htmlFor={moduleName + '_' + settingName}>{settingData.display}</Label>
            {
                settingData.help_url !== undefined
                    ?
                        <a href={settingData.help_url} target="_blank" rel='noreferrer' className={Styles.help_icon}>
                            <QuestionCircleFilled />
                        </a>
                    :
                        null
            }
        </div>
    )
}