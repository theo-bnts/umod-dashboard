import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Spinner } from '@fluentui/react-components'
import axios from 'axios'

import Page from '/objects/tools/Page'

export default function Login() {

    const router = useRouter()
    
    useEffect(() => {
        (async () => {
            const { code } = router.query

            if (typeof code === 'string' && code.length > 0) {
                let data

                try {
                    const response = await axios({
                        method: 'post',
                        baseURL: '/',
                        url: 'api/user/login',
                        data: (
                            new URLSearchParams({
                                oauth_code: code
                            })
                                .toString()
                        )
                    })

                    data = response.data.data
                } catch (error) {
                    console.error(error)
                    return
                }

                Page.setKeys(data.id, data.encryption_key)

                router.push('./')
            } else {
                const url = new URL('http://example.com')
                url.protocol = 'https:'
                url.host = 'discord.com'
                url.pathname = '/api/oauth2/authorize'
                url.searchParams.set('client_id', process.env.DISCORD_CLIENT_ID)
                url.searchParams.set('redirect_uri', process.env.DISCORD_REDIRECT_URI)
                url.searchParams.set('response_type', 'code')
                url.searchParams.set('scope', 'identify guilds')

                router.push(url.toString())
            }
        })()
    }, [router])

    return (
        <main>
            <Spinner />
        </main>
    )

}

export function getServerSideProps({ req, query }) {
    return {
        props: {
            initQuery: query
        }
    }
}
