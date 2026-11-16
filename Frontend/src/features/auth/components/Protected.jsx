import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"

const Protected = ({ children }) => {
    const { loading, checked, user } = useAuth()

    if (!checked || loading) {

    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected
