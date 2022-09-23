import Router from 'next/router'
import { useState, useEffect } from 'react'

import Cookies from 'js-cookie'

class Page {
    static getKeys() {
        const id = Cookies.get('id')
        const encryption_key = Cookies.get('encryption_key')

        if (typeof id !== 'string' || id.length === 0 || typeof encryption_key !== 'string' || encryption_key.length === 0) {
            Router.push('/errors/' + 401)
            throw 401
        }

        return {
            id,
            encryption_key
        }
    }

    static setKeys(id, encryption_key) {
        if (typeof id !== 'string' || id.length === 0 || typeof encryption_key !== 'string' || encryption_key.length === 0) {
            Router.push('/errors/' + 401)
            throw 401
        }

        Cookies.set('id', id)
        Cookies.set('encryption_key', encryption_key)
    }

    static useWindowDimensions() {
        const hasWindow = typeof window !== 'undefined'

        function getWindowDimensions() {
            const width = hasWindow ? window.innerWidth : null
            const height = hasWindow ? window.innerHeight : null
            return {
                width,
                height,
            }
        }

        const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

        useEffect(() => {
            if (hasWindow) {
                function handleResize() {
                    setWindowDimensions(getWindowDimensions())
                }

                window.addEventListener('resize', handleResize)
                return () => window.removeEventListener('resize', handleResize)
            }
        }, [hasWindow])

        return windowDimensions
    }
}

export default Page