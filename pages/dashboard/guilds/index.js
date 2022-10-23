import { LargeTitle } from '@fluentui/react-components'

import GuildPicker from '/components/guild_picker'
import Navbar from '/components/navbar'
import Styles from '/styles/pages/dashboard/global.module.css'

export default function Guilds() {
  return (
    <>
      <Navbar />
      <main>
        <LargeTitle className={Styles.title}>Choice a guild you want to manage</LargeTitle>
        <GuildPicker />
      </main>
    </>
  )
}