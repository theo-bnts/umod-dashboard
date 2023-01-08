import Image from 'next/image'
import { useState, useEffect } from 'react'

import { Avatar, Subtitle1, Subtitle2, Spinner } from '@fluentui/react-components'
import { Card, CardHeader } from '@fluentui/react-components/unstable'

import API from '/tools/clientside/API'
import Page from '/tools/clientside/Page'
import Styles from '/styles/components/navbar.module.css'

export default function ProfilePreview() {
    const [loading, setLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)
    const [profile, setProfile] = useState([])

    useEffect(() => {
        (async () => {
            const { id, encryption_key } = Page.getKeys(false)

            if (id !== undefined || encryption_key !== undefined) {
                setLoggedIn(true)

                const data = await API.request('api/user/profile', { id, encryption_key })

                setProfile(data)
            }

            setLoading(false)
        })()
    }, [])

    return (
        loggedIn === true
            ?
                loading === false
                    ?
                        <Card orientation='horizontal'>
                            <Avatar
                                image={{
                                    src: profile.icon + '?size=' + 32,
                                    alt: profile.username + '\'s avatar'
                                }}
                                name={profile.username}
                                size={32}
                            />
                            <CardHeader
                                header={<Subtitle1>{profile.username}</Subtitle1>}
                                description={<Subtitle2>{'#' + profile.discriminator}</Subtitle2>}
                            />
                        </Card>
                    :
                        <Spinner />
            :
                <Image
                    src='/icon.webp'
                    alt='Service icon'
                    width={64}
                    height={64}
                    className={Styles.service_icon}
                />
    )
}