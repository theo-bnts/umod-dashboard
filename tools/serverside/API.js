import User from '/tools/serverside/User'
import Database from '/tools/serverside/Database'

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
        let status = 200

        const url = new URL('http://example.com' + req.url)

        if (req.method !== 'POST')
            status = 405

        if (status === 200 && req.body.id !== undefined) {
            const [{ user_ids_count_except_current }] = await Database.Website.runQuery({
                sql: `
                    SELECT COUNT(DISTINCT(user_id)) AS 'user_ids_count_except_current'
                    FROM requests
                    WHERE ip = ?
                    AND validity_status != 429
                    AND user_id != ?
                    AND date >= SUBDATE(NOW(), INTERVAL 1 HOUR)
                `,
                values: [
                    req.connection.remoteAddress,
                    req.body.id || null
                ]
            })

            if (user_ids_count_except_current + 1 > 5)
                status = 429
        }
        
        if (status === 200) {
            const [{ endpoint_requests_count_except_current }] = await Database.Website.runQuery({
                sql: `
                    SELECT COUNT(*) AS 'endpoint_requests_count_except_current'
                    FROM requests
                    WHERE validity_status != 429
                    AND endpoint_path = ?
                    AND (
                        ip = ?
                        OR (user_id IS NOT NULL AND user_id = ?)
                    )
                    AND date >= SUBDATE(NOW(), INTERVAL 1 HOUR)
                `,
                values: [
                    url.pathname,
                    req.connection.remoteAddress,
                    req.body.id || null
                ]
            })

            const [{ allowed_requests_per_hour }] = await Database.Website.runQuery({
                sql: `
                    SELECT
                        IFNULL(
                            (
                                SELECT allowed_requests_per_hour
                                FROM reference_endpoints
                                WHERE path = ?
                            ),
                            0
                        ) AS 'allowed_requests_per_hour'
                    FROM reference_endpoints
                    LIMIT 1;
                `,
                values: [url.pathname]
            })

            if (endpoint_requests_count_except_current + 1 > allowed_requests_per_hour)
                status = 429
        }

        if (status === 200) {
            const { id, encryption_key, oauth_code } = req.body

            if (
                !await User.isValidKeys(id, encryption_key)
                && (
                    !oauth_accepted
                    || typeof oauth_code !== 'string'
                    || oauth_code.length !== 30
                )
            )
                status = 401
        }

        await Database.Website.runQuery({
            sql: `
                INSERT INTO requests (endpoint_path, ip, user_id, validity_status)
                VALUES (?, ?, ?, ?)
            `,
            values: [
                url.pathname,
                req.connection.remoteAddress,
                req.body.id || null,
                status
            ]
        })

        if (status !== 200) {
            API.returnError(res, status)

            return false
        }

        return true
    }
}

export default API