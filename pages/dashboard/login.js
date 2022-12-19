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
                let data

                // TODO: rm try - catch ?
                try {
                    data = await API.request('api/user/login', { oauth_code: code })
                } catch (error) {
                    console.error(error)
                    return
                }

                Page.setKeys(data.id, data.encryption_key)

                router.push('./guilds')
            } else
                router.push(Discord.getOAuthURL())
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