class API {
    static async request(path, data) {
        const response = await fetch('/' + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        })

        if (!response.ok)
            throw response.status

        const json = await response.json()

        return json.data
    }
}

export default API