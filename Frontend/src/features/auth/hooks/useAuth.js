import { AuthContext } from "../AuthContext";
import { useContext, useCallback, useMemo } from "react";
import { register, verifyEmail, reSendOtp, login, forgetPassword, verifyOtp, resetPassword, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, checked } = context

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    const handleRegister = useCallback(async ({ username, email, password }) => {
        return await register({ username, email, password })
    }, [])

    const handleVerifyEmail = useCallback(async ({ email, otp }) => {
        return await verifyEmail({ email, otp })
    }, [])

    const handleReSendOtp = useCallback(async ({ email }) => {
        return await reSendOtp({ email })
    }, [])

    const handleLogin = useCallback(async ({ email, password }) => {
        const data = await login({ email, password })
        if (data?.user && data.user.verified) {
            setUser(data.user)
        }
        return data
    }, [setUser])

    const handleForgetPassword = useCallback(async ({ email }) => {
        return await forgetPassword({ email })
    }, [])

    const handleVerifyOtp = useCallback(async ({ email, otp }) => {
        return await verifyOtp({ email, otp })
    }, [])

    const handleRestPassword = useCallback(async ({ newPassword, confirmPassword }) => {
        return await resetPassword({ newPassword, confirmPassword })
    }, [])

    const handleLogout = useCallback(async () => {
        try {
            const data = await logout()
            return data
        } finally {
            setUser(null)
        }
    }, [setUser])

    const value = useMemo(() => ({
        user,
        loading,
        checked,
        handleRegister,
        handleVerifyEmail,
        handleReSendOtp,
        handleLogin,
        handleForgetPassword,
        handleVerifyOtp,
        handleRestPassword,
        handleLogout,
    }), [user, loading, checked, handleRegister, handleVerifyEmail, handleReSendOtp, handleLogin, handleForgetPassword, handleVerifyOtp, handleRestPassword, handleLogout])

    return value
}
