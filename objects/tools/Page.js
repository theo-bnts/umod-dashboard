import Cookies from 'js-cookie'

class Page {
    static getKeys() {
        return {
            id: Cookies.get('id'),
            encryption_key: Cookies.get('encryption_key')
        }
    }

    static setKeys(id, encryption_key) {
        Cookies.set('id', id)
        Cookies.set('encryption_key', encryption_key)
    }
}

export default Page