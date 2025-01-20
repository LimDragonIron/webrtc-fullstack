const isClient = typeof window !== "undefined"
const SessionStoreManager = {
    local: {
        get: (key: string) => {
            return isClient ? window.sessionStorage.getItem(key) : null
        },
        set: (key: string, value: string) => {
            if (isClient) {
                return window.sessionStorage.setItem(key, value)
            }
        },
        remove: (key: string) => {
            if (isClient) {
                return window.sessionStorage.removeItem(key)
            }
        },
    },
}

export default SessionStoreManager
