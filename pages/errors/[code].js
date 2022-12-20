import Error from 'next/error'
import { useRouter } from 'next/router'

import Page from '/tools/clientside/Page'

export default function Guild() {
    const router = useRouter()

    const code = router.query.code

    setTimeout(() => {
        router.push('/dashboard/login')
    }, 5000)

    return <Error
        statusCode={code}
        title={Page.getErrorMessage(code)}
    />
}