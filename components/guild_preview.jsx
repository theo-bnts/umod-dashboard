import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { Button, Subtitle1, Subtitle2 } from '@fluentui/react-components'
import { Card, CardPreview, CardHeader, CardFooter } from '@fluentui/react-components/unstable'
import { bundleIcon, SettingsRegular, SettingsFilled } from '@fluentui/react-icons'

import Styles from '/styles/components/guild_preview.module.css'

export default function GuildPreview({ id, icon, name, user_role }) {
    const SettingsIcon = bundleIcon(SettingsFilled, SettingsRegular)

    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', () => setWidth(window.innerWidth))
    })

    return (
        <Card orientation={width <= 768 ? 'vertical' : 'horizontal'}>
            <CardPreview>
                <img
                    src={icon + (width <= 768 ? '?size=512' : '?size=128')}
                    alt={name + '\'s icon'}
                    width='100%'
                    height='100%'
                />
            </CardPreview>
            <CardHeader
                header={<Subtitle1>{name}</Subtitle1>}
                description={<Subtitle2>{user_role}</Subtitle2>}
            />
            <CardFooter className={Styles.card_part + ' ' + Styles.card_footer}>
                <Link href={'/dashboard/guilds/' + id}>
                    <a>
                        <Button
                            appearance='primary'
                            icon={<SettingsIcon />}
                        >
                            Manage
                        </Button>
                    </a>
                </Link>
            </CardFooter>
        </Card>
    )
}