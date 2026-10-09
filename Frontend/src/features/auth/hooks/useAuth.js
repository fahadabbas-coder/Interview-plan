import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import { register, verifyEmail, reSendOtp, login, forgetPassword, verifyOtp, resetPassword, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data?.user) {
                setUser(data.user)
            }
            return data
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyEmail = async ({ email, otp }) => {
        setLoading(true)
        try {
            const data = await verifyEmail({ email, otp })
            if (data?.user) {
                setUser(data.user)
            }
            return data
        } finally {
            setLoading(false)
        }
    }

    const handleReSendOtp = async ({ email }) => {
        setLoading(true)
        try {
            const data = await reSendOtp({ email })
            return data
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data?.user) {
                setUser(data.user)
            }
            return data
        } finally {
            setLoading(false)
        }
    }

    const handleForgetPassword = async ({ email }) => {
        setLoading(true)
        try {
            const data = await forgetPassword({ email })
            if (data?.user) {
                setUser(data.user)
            }
            return data
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async ({ email, otp }) => {
        setLoading(true)
        try {
            const data = await verifyOtp({ email, otp })
            return data
        }
        finally {
            setLoading(false)
        }
    }

    const handleRestPassword = async ({ newPassword, confirmPassword }) => {
        setLoading(true)
        try {
            const data = await resetPassword({ newPassword, confirmPassword })
            return data
        }
        finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            return data
        } finally {
            setUser(null)
            setLoading(false)
        }
    }

    return { user, loading, handleRegister, handleVerifyEmail, handleReSendOtp, handleLogin, handleForgetPassword, handleVerifyOtp, handleRestPassword, handleLogout }
}
