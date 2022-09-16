import Link from 'next/link'

import { Button } from '@fluentui/react-components'
import { bundleIcon, HomeRegular, HomeFilled } from '@fluentui/react-icons'

import ProfilePreview from '/components/profile_preview.jsx'
import Styles from '/styles/components/navbar.module.css'

export default function GuildPicker() {
    const HomeIcon = bundleIcon(HomeFilled, HomeRegular)

    return (
        <div className={Styles.navbar}>
            <div className={Styles.titles}>
                <Link href='/'>
                    <a>
                        <Button icon={<HomeIcon />}></Button>
                    </a>
                </Link>
                <Link href='/invite'>
                    <a>
                        <Button>Invite</Button>
                    </a>
                </Link>
            </div>
            <ProfilePreview />
        </div>
    )
}