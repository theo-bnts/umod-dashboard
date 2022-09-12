import Image from 'next/image'
import Link from 'next/link'
import { PrimaryButton, Text } from '@fluentui/react'

import styles from '../styles/components/Guild.module.css'

export default function Guild({ id, icon, name, user_role }) {
    return (
        <div className={styles.guild}>
            <Image className={styles.icon} width='100%' height='100%' src={icon} alt={name + "'s icon"} />
            <div className={styles.informations}>
                <Text variant='xLarge'>{name}</Text>
                <Text>{user_role}</Text>
            </div>
            <Link href={`/guilds/${id}`}>
                <a className={styles.configure_button}>
                    <PrimaryButton text='Configure' />
                </a>
            </Link>
        </div>
    );
}