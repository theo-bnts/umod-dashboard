import Link from 'next/link'

import { Button } from '@fluentui/react-components'
import { bundleIcon, HomeRegular, HomeFilled, BotAddRegular, BotAddFilled } from '@fluentui/react-icons'

import ProfilePreview from '/components/profile_preview.jsx'
import Styles from '/styles/components/navbar.module.css'
import Page from '/tools/clientside/Page'

export default function GuildPicker() {
    const { width } = Page.useWindowDimensions()

    const HomeIcon = bundleIcon(HomeFilled, HomeRegular)
    const BotAddIcon = bundleIcon(BotAddFilled, BotAddRegular)

    return (
        <div className={Styles.navbar}>
            <div className={Styles.titles}>
                <Link href='/'>
                    <a>
                        <Button icon={<HomeIcon />}>{width <= 768 ? null : 'Home'}</Button>
                    </a>
                </Link>
                <Link href='/invite'>
                    <a>
                        <Button icon={<BotAddIcon />}>{width <= 768 ? null : 'Add bot'}</Button>
                    </a>
                </Link>
            </div>
            <ProfilePreview />
        </div>
    )
}