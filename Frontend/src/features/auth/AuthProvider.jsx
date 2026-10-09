import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { getMe } from "./services/auth.api"

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await getMe()
                if (data?.user) {
                    setUser(data.user)
                }
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        restoreSession()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
