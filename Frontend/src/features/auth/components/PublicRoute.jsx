import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
    const { loading, checked, user } = useAuth();

    if (!checked || loading) {

    }

    if (user && user.verified) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute
