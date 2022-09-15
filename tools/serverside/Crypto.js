import CryptoJS from 'crypto-js'

class Crypto {
    static generateKey() {
        return CryptoJS.lib.WordArray
            .random(128 / 8)
            .toString()
    }

    static encryptData(data, encryption_key) {
        return CryptoJS.AES
            .encrypt(data, encryption_key)
            .toString()
    }

    static decryptData(data, encryption_key) {
        return CryptoJS.AES
            .decrypt(data, encryption_key)
            .toString(CryptoJS.enc.Utf8)
    }
}

export default Crypto