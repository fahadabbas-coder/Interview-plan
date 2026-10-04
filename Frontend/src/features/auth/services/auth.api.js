import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function register({ username, email, password }) {

    const response = await api.post('/api/auth/register', { username, email, password })
    return response.data
}

export async function verifyEmail({ email, otp }) {
    const response = await api.post("/api/auth/verify-email", { email, otp })
    return response.data
}

export async function reSendOtp({ email }) {
    const response = await api.get('/api/auth/resend-otp', { params: { email } })
    return response.data
}

export async function login({ email, password }) {

    const response = await api.post('/api/auth/login', { email, password })
    return response.data

}

export async function forgetPassword({ email }) {
    const response = await api.post('/api/auth/forget-password', { email })
    return response.data
}

export async function verifyOtp({ email, otp }) {
    const response = await api.post('/api/auth/verify-otp', { email, otp })
    return response.data
}

export async function resetPassword({ newPassword, confirmPassword }) {
    const response = await api.post('/api/auth/reset-password', { newPassword, confirmPassword })
    return response.data
}

export async function logout() {
    const response = await api.get('/api/auth/logout')
    return response.data
}

export async function getMe() {
    const response = await api.post('/api/auth/get-me')
    return response.data
}