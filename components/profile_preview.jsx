import { useState, useEffect } from 'react'

import { Avatar, Subtitle1, Subtitle2, Spinner } from '@fluentui/react-components'
import { Card, CardHeader } from '@fluentui/react-components/unstable'

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
    }, [])

    return (
        <Card orientation='horizontal'>
            {
                loading === false
                    ?
                        <>
                            <Avatar
                                image={{
                                    src: profile.icon + '?size=' + 32 * 2,
                                    alt: profile.username + '\'s avatar'
                                }}
                                name={profile.username}
                                size={32}
                            />
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