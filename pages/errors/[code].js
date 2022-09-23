import Error from 'next/error'
import { useRouter } from 'next/router'

export default function Guild() {
    const { code } = useRouter().query

    return <Error statusCode={code} />
}