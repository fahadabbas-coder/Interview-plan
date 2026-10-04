import { createBrowserRouter } from "react-router";
import Register from "./features/auth/pages/Register";
import VerifyEmail from "./features/auth/pages/VerifyEmail";
import Login from "./features/auth/pages/Login";
import ForgetPassword from "./features/auth/pages/ForgetPassword";
import VerifyOTPforReset from "./features/auth/pages/VerifyOTPforReset";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
    {
        path: "/login", element: <Login />
    },
    {
        path: "/register", element: <Register />
    },
    {
        path: "/", element: <Protected> <Home /> </Protected>
    }, {
        path: "/interview/:interviewId",
        element: <Protected> <Interview /> </Protected>
    }, {
        path: "/verify-email", element: <VerifyEmail />
    },
    {
        path: "/forget-password", element: <ForgetPassword />
    },
    {
        path: "/verify-otp-reset", element: <VerifyOTPforReset />
    },
    {
        path: "/reset-password", element: <ResetPassword />
    }

])