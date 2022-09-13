import { LargeTitle } from '@fluentui/react-components'

import GuildPicker from '/components/guild_picker'

import styles from '/styles/pages/dashboard/guilds/index.module.css'

export default function Guilds() {
  return (
    <main>
      <LargeTitle className={styles.title}>Choice a guild you want to manage</LargeTitle>
      <GuildPicker/>
    </main>
  )
}
