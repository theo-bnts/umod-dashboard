import Router from 'next/router'
import { useState, useEffect } from 'react'

import Cookies from 'js-cookie'

class Page {
    static getKeys(required = true) {
        const id = Cookies.get('id')
        const encryption_key = Cookies.get('encryption_key')

        if (required === true && typeof id !== 'string' || id.length === 0 || typeof encryption_key !== 'string' || encryption_key.length === 0) {
            Router.push('/errors/' + 401)
            throw 401
        }

        return {
            id,
            encryption_key
        }
    }

    static setKeys(id, encryption_key) {
        Cookies.set('id', id, { secure: true, sameSite: 'strict', expires: parseInt(process.env.COOKIES_EXPIRATION_DAYS) })
        Cookies.set('encryption_key', encryption_key, { secure: true, sameSite: 'strict', expires: parseInt(process.env.COOKIES_EXPIRATION_DAYS) })
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

    static getErrorMessage(code) {
        code = parseInt(code)
        
        let message

        switch (code) {
            case 400:
                message = 'Bad request'
                break
            case 401:
                message = 'Unauthorized'
                break
            case 403:
                message = 'Forbidden'
                break
            case 404:
                message = 'Not found'
                break
            case 405:
                message = 'Method not allowed'
                break
            case 429:
                message = 'Too many requests'
                break
            case 500:
                message = 'Internal server error'
                break
            default:
                message = 'Unknown error'
                break
        }

        return message
    }
}

export default Page