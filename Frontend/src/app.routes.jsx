import { Outlet } from "react-router";
import TopLoadingBar from "./components/ui/TopLoadingBar";
import { useAuth } from "./features/auth/hooks/useAuth";

const RootLayout = () => {
    const { loading } = useAuth();
    return (
        <>
            <TopLoadingBar loading={loading} />
            <Outlet />
        </>
    );
};

export default RootLayout