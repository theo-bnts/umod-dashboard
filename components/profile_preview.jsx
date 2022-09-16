import Image from 'next/image'
import { useState, useEffect } from 'react'

import { Subtitle1, Subtitle2, Spinner } from '@fluentui/react-components'
import { Card, CardPreview, CardHeader, CardFooter } from '@fluentui/react-components/unstable'

import Styles from '/styles/components/profile_preview.module.css'
import API from '/tools/clientside/API'
import Page from '/tools/clientside/Page'

export default function ProfilePreview() {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState([])

    useEffect(() => {
        (async () => {
            const keys = Page.getKeys()

            const data = await API.request('api/user/profile', keys)

            setProfile(data)
            setLoading(false)
        })()
    })

    return (
        <Card orientation='horizontal'>
            {
                loading === false
                    ?
                        <>
                            <CardPreview className={Styles.card_preview}>
                                <img
                                    className={Styles.icon}
                                    src={profile.icon + '?size=32'}
                                    alt={profile.username + '\'s icon'}
                                    width='100%'
                                    height='100%'
                                />
                            </CardPreview>
                            <CardHeader
                                header={<Subtitle1>{profile.username}</Subtitle1>}
                                description={<Subtitle2>{'#' + profile.discriminator}</Subtitle2>}
                            />
                        </>
                    :
                        <Spinner />
            }
        </Card>
    )
}