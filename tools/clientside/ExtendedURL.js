class ExtendedURL extends URL {
    static setParameters(url, parameters) {
        const URL_ = new URL(url)

        for (const [key, value] of Object.entries(parameters)) {
            URL_.searchParams.set(key, value)
        }

        return URL_.toString()
    }
}

export default ExtendedURL