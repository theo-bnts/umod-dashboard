import Link from 'next/link'
import { Button, Subtitle1, Subtitle2 } from '@fluentui/react-components'
import { Card, CardPreview, CardHeader, CardFooter } from '@fluentui/react-components/unstable'

import styles from '../styles/components/guild_preview.module.css'

export default function GuildPreview({ id, icon, name, user_role }) {
    return (
        <Card orientation='horizontal'>
            <CardPreview className={styles.card_part}>
                <img
                    src={icon}
                    alt={name + '\'s icon'}
                    width='100%'
                    height='100%'
                />
            </CardPreview>
            <CardHeader
                className={styles.card_part}
                header={<Subtitle1>{name}</Subtitle1>}
                description={<Subtitle2>{user_role}</Subtitle2>}
            />
            <CardFooter className={styles.card_part + ' ' + styles.card_footer}>
                <Link href={'./guilds/' + id}>
                    <a>
                        <Button appearance='primary'>Manage</Button>
                    </a>
                </Link>
            </CardFooter>
        </Card>
    )
}