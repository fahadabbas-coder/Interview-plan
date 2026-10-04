import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"
import Loader from "../../../components/ui/Loader"

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return <Loader title="Checking session" />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected
