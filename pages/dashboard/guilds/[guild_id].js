import { useRouter } from 'next/router'

import { LargeTitle } from '@fluentui/react-components'

import GuildSettings from '/components/guild_settings'
import Loading from '/components/loading'
import Navbar from '/components/navbar'
import Styles from '/styles/pages/dashboard/global.module.css'

export default function Guild() {
  const { guild_id } = useRouter().query

  return (
    <>
      <Navbar />
      <main>
        <LargeTitle className={Styles.title}>Configure your guild</LargeTitle>
        {
          guild_id === undefined
            ? <Loading />
            : <GuildSettings guild_id={guild_id} />
        }
      </main>
    </>
  )
}