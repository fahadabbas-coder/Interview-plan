import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"

const Protected = ({ children }) => {
    const { loading, checked, user } = useAuth()

    if (!checked || loading) {
        return (
            <div className="fixed inset-0 z-9998 flex items-center justify-center" style={{ backgroundColor: "var(--bg-subtle)" }}>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected
