import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
    const { loading, checked, user } = useAuth();

    if (!checked || loading) {
        return (
            <div className="fixed inset-0 z-9998 flex items-center justify-center" style={{ backgroundColor: "var(--bg-subtle)" }}>
            </div>
        )
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute
