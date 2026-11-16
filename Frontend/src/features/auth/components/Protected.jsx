import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"

const Protected = ({ children }) => {
    const { loading, checked, user } = useAuth()

    if (!checked || loading) {
        return (
            <div className="fixed inset-0 z-9998 flex items-center justify-center bg-white">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected
