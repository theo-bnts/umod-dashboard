import Page from '/tools/clientside/Page'
import Database from '/tools/serverside/Database'
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
        const message = Page.getErrorMessage(code)
        
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

        if (req.method !== 'POST')
            status = 405

        let ip = req.connection.remoteAddress

        if (req.headers['x-forwarded-for'] !== undefined)
            ip = req.headers['x-forwarded-for']

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
                    ip,
                    req.body.id || null
                ]
            })

            if (user_ids_count_except_current + 1 > 5)
                status = 429
        }

        const url = new URL('http://example.com' + req.url)
        
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
                    ip,
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
                ip,
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