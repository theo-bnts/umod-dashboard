import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Spinner } from '@fluentui/react-components'

import API from '/tools/clientside/API'
import Discord from '/tools/clientside/Discord'
import Page from '/tools/clientside/Page'

export default function Login() {
    const router = useRouter()
    
    useEffect(() => {
        (async () => {
            const { code } = router.query

            if (typeof code === 'string' && code.length > 0) {
                const { id, encryption_key } = await API.request('api/user/login', { oauth_code: code })

                Page.setKeys(id, encryption_key)

                router.push('/dashboard/guilds')
            } else {
                router.push(Discord.getOAuthURL())
            }
        })()
    }, [router])

    return (
        <main>
            <Spinner />
        </main>
    )
}

export function getServerSideProps({ query }) {
    return {
        props: {
            initQuery: query
        }
    }
}