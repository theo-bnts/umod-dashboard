import { useRouter } from 'next/router'

export default function Guild() {
    const { id } = useRouter().query

    return (
        <main>
            <h1>Guild: {id}</h1>
        </main>
    )
}
