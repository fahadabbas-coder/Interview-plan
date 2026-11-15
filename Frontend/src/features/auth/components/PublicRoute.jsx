import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loader from "../../../components/ui/Loader";

const PublicRoute = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return <Loader title="Checking session" />;
    }

    if (user && user.verified) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute
