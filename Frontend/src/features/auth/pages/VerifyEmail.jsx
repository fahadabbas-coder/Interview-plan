import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router"
import { useAuth } from "../hooks/useAuth"
import Button from "../../../components/ui/Button"
import Logo from "../../../components/ui/Logo"
import { toastSuccess, toastError } from "../../../utils/toast"
import "../auth.form.css"

const VerifyEmail = () => {
    const { handleVerifyEmail, handleReSendOtp } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Get email from state (passed from register) or use empty string
    const { email = "" } = location.state || {}

    const [otp, setOtp] = useState("")
    const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'resending' | 'verified'
    const [countdown, setCountdown] = useState(0)

    //  countdown for resend button
    useEffect(() => {
        if (countdown > 0 && status !== 'resending') {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown, status])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setStatus('submitting')

        try {
            const data = await handleVerifyEmail({ email, otp })
            if (data?.user) {
                toastSuccess(data)
                navigate("/login")
            } else {
                toastError(null, "Invalid OTP. Please try again.")
            }
        } catch (error) {
            toastError(error, "Unable to verify email. Please try again.")
        } finally {
            setStatus('idle')
        }
    }

    const handleResend = async () => {
        setStatus('resending')
        try {
            const data = await handleReSendOtp({ email })
            toastSuccess(data)
            setCountdown(60)
            setStatus('idle')
        } catch (error) {
            toastError(error, "Failed to resend OTP. Please try again.")
            setStatus('idle')
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Logo />
                    <h1 className="auth-title">Verify Email</h1>
                    <p className="auth-subtitle">
                        Send to <strong>{email}</strong>
                    </p>
                </div>

                <form className="panel auth-form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="field__label" htmlFor="otp">OTP Code</label>
                        <input
                            id="otp"
                            name="otp"
                            className="input"
                            type="text"
                            autoComplete="otp"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit code"
                            maxLength="6"
                        />
                    </div>

                    <div className="field">
                        <Button
                            type="submit"
                            variant="primary"
                            loading={status === 'submitting'}
                            disabled={!otp || status === 'submitting'}
                        >
                            {status === 'submitting' ? "Verifying..." : "Verify Email"}
                        </Button>
                    </div>
                </form>

                <p className="auth-footnote">
                    Didn't get it?{" "}
                    {status !== 'resending' && countdown === 0 ? (
                        <button
                            className="text-link"
                            onClick={handleResend}
                            style={{
                                border: 'none',
                                boxShadow: 'none',
                                background: 'transparent',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Resend OTP
                        </button>
                    ) : (
                        <span className="text-link" style={{ opacity: 0.7 }}>
                            {status === 'resending' ? "Resending..." : `Resend in ${countdown}s`}
                        </span>
                    )}
                </p>
            </div>
        </main>
    )
}

export default VerifyEmail