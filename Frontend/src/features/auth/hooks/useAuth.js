import { AuthContext } from "../AuthContext";
import { useContext, useCallback, useMemo } from "react";
import { register, verifyEmail, reSendOtp, login, forgetPassword, verifyOtp, resetPassword, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading, checked } = context

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    const handleRegister = useCallback(async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            return data
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    const handleVerifyEmail = useCallback(async ({ email, otp }) => {
        setLoading(true)
        try {
            const data = await verifyEmail({ email, otp })
            return data
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    const handleReSendOtp = useCallback(async ({ email }) => {
        setLoading(true)
        try {
            const data = await reSendOtp({ email })
            return data
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    const handleLogin = useCallback(async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data?.user && data.user.verified) {
                setUser(data.user)
            }
            return data
        } finally {
            setLoading(false)
        }
    }, [setLoading, setUser])

    const handleForgetPassword = useCallback(async ({ email }) => {
        setLoading(true)
        try {
            const data = await forgetPassword({ email })
            return data
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    const handleVerifyOtp = useCallback(async ({ email, otp }) => {
        setLoading(true)
        try {
            const data = await verifyOtp({ email, otp })
            return data
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    const handleRestPassword = useCallback(async ({ newPassword, confirmPassword }) => {
        setLoading(true)
        try {
            const data = await resetPassword({ newPassword, confirmPassword })
            return data
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    const handleLogout = useCallback(async () => {
        setLoading(true)
        try {
            const data = await logout()
            return data
        } finally {
            setUser(null)
            setLoading(false)
        }
    }, [setLoading, setUser])

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
