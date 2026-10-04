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
    const [submitting, setSubmitting] = useState(false)
    const [resending, setResending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [countdown, setCountdown] = useState(0)

    //  countdown for resend button
    useEffect(() => {
        if (countdown > 0 && !resending) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown, resending])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)

        try {
            const data = await handleVerifyEmail({ email, otp })
            if (data?.user) {
                toastSuccess(data)
                setSuccess(true)
                setTimeout(() => {
                    navigate("/")
                }, 1500)
            } else {
                toastError(null, "Invalid OTP. Please try again.")
            }
        } catch (error) {
            toastError(error, "Unable to verify email. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleResend = async () => {
        setResending(true)
        try {
            const data = await handleReSendOtp({ email })
            toastSuccess(data)
            setCountdown(60)
        } catch (error) {
            toastError(error, "Failed to resend OTP. Please try again.")
        } finally {
            setResending(false)
        }
    }

    if (success) {
        return (
            <main className="auth-page">
                <div className="auth-card">
                    <div className="auth-header">
                        <Logo />
                        <h1 className="auth-title">Email Verified!</h1>
                        <p className="auth-subtitle">
                            Your email has been successfully verified. Redirecting...
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Logo />
                    <h1 className="auth-title">Verify Email</h1>
                    <p className="auth-subtitle">
                        We've sent an OTP to <strong>{email}</strong>. Enter it below to verify your account.
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
                            loading={submitting}
                            disabled={!otp || submitting}
                        >
                            {submitting ? "Verifying..." : "Verify Email"}
                        </Button>
                    </div>

                    <div className="field">
                        {!resending && countdown > 0 ? (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleResend}
                                disabled={countdown > 0}
                            >
                                Resend OTP ({countdown}s)
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleResend}
                                disabled={resending}
                            >
                                {resending ? "Resending..." : "Resend OTP"}
                            </Button>
                        )}
                    </div>
                </form>

                <p className="auth-footnote">
                    Didn't receive the code?{" "}
                    {!resending && countdown === 0 ? (
                        <button className="text-link" onClick={handleResend}>
                            Resend OTP
                        </button>
                    ) : (
                        <span className="text-link">Please wait...</span>
                    )}
                </p>
            </div>
        </main>
    )
}

export default VerifyEmail
