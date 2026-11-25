import { createBrowserRouter, Outlet } from "react-router";
import Register from "./features/auth/pages/Register";
import VerifyEmail from "./features/auth/pages/VerifyEmail";
import Login from "./features/auth/pages/Login";
import ForgetPassword from "./features/auth/pages/ForgetPassword";
import VerifyOTPforReset from "./features/auth/pages/VerifyOTPforReset";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Protected from "./features/auth/components/Protected";
import PublicRoute from "./features/auth/components/PublicRoute";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import NotFound from "./components/ui/NotFound";
import RootLayout from "./app.routes";

export const router = createBrowserRouter([
    {
        element: <RootLayout />, 
        children: [
            // Public / Auth routes
            {
                element: (
                    <PublicRoute>
                        <Outlet />
                    </PublicRoute>
                ),
                children: [
                    { path: "/login", element: <Login /> },
                    { path: "/register", element: <Register /> },
                    { path: "/verify-email", element: <VerifyEmail /> },
                    { path: "/forget-password", element: <ForgetPassword /> },
                    { path: "/verify-otp-reset", element: <VerifyOTPforReset /> },
                    { path: "/reset-password", element: <ResetPassword /> },
                ],
            },
            // Protected routes
            {
                path: "/",
                element: (
                    <Protected>
                        <Outlet />
                    </Protected>
                ),
                children: [
                    { index: true, element: <Home /> },
                    { path: "interview/:interviewId", element: <Interview /> },
                ],
            },
            // 404 fallback
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);
