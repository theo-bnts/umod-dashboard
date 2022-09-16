import User from '/tools/serverside/User'

class API {
    static returnSuccess(res, data) {
        res
            .status(200)
            .json({
                result: true,
                data: data
            })
    }

    static returnError(res, code) {
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
            case 500:
                message = 'Internal server error'
                break
            default:
                message = 'Unknown error'
                break
        }
        
        res
            .status(code)
            .json({
                result: false,
                error: {
                    code: code,
                    message: message
                }
            })
    }

    static async isValidRequest(req, res, oauth_accepted = false) {
        if (req.method !== 'POST') {
            API.returnError(res, 405)
            return false
        }

        const { id, encryption_key, oauth_code } = req.body

        if (
            !await User.isValidKeys(id, encryption_key)
            && (
                !oauth_accepted
                || typeof oauth_code !== 'string'
                || oauth_code.length !== 32
            )
        ) {
            API.returnError(res, 401)
            return false
        }

        return true
    }
}

export default API