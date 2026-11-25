import { useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { getMe } from "./services/auth.api"

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data?.user) {
                    setUser(data.user)
                }
            } catch (error) {
                const status = error?.response?.status

                if (status && status !== 401 && status !== 403) {
                    console.error("Auth session check failed:", error.message)
                }
            } finally {
                setLoading(false)
                setChecked(true)
            }
        }
        getAndSetUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, checked }}>
            {children}
        </AuthContext.Provider>
    )
}
