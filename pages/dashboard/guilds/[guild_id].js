import { useRouter } from 'next/router'

import { LargeTitle, Spinner } from '@fluentui/react-components'

import GuildSettings from '/components/guild/settings/index'
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
            ? <Spinner />
            : <GuildSettings guild_id={guild_id} />
        }
      </main>
    </>
  )
}