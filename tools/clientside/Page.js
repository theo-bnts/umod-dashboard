import Cookies from 'js-cookie'

class Page {
    static getKeys() {
        const id = Cookies.get('id')
        const encryption_key = Cookies.get('encryption_key')

        if (typeof id !== 'string' || id.length === 0 || typeof encryption_key !== 'string' || encryption_key.length === 0)
            throw 400

        return {
            id,
            encryption_key
        }
    }

    static setKeys(id, encryption_key) {
        if (typeof id !== 'string' || id.length === 0 || typeof encryption_key !== 'string' || encryption_key.length === 0)
            throw 400

        Cookies.set('id', id)
        Cookies.set('encryption_key', encryption_key)
    }
}

export default Page