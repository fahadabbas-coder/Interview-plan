import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"
import Button from "../../../components/ui/Button"
import Logo from "../../../components/ui/Logo"
import { toastSuccess, toastError } from "../../../utils/toast"
import "../auth.form.css"

const Login = () => {
    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)

        try {
            const data = await handleLogin({ email, password })
            if (data?.user) {
                const isVerified = data.user?.verified
                toastSuccess(data)
                navigate(isVerified ? "/" : "/verify-email", {
                    state: { email },
                });
            }
            else {
                toastError(null, "Unable to sign in. Check your email and password.")
            }
        } catch (error) {
            toastError(error, "Unable to sign in. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Logo />
                    <h1 className="auth-title">Sign in</h1>
                    <p className="auth-subtitle">Use your account to open your interview plans.</p>
                </div>

                <form className="panel auth-form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="field__label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            className="input"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter Email"
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            className="input"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter password"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        loading={submitting}
                        disabled={!email || !password}
                    >
                        {submitting ? "Signing in" : "Sign in"}
                    </Button>
                </form>

                <p className="auth-footnote">
                    New here?{" "}
                    <Link className="text-link" to="/register">
                        Create an account
                    </Link>
                </p>
                <p className="auth-footnote">
                    <Link className="text-link" to="/forget-password">
                        Forget Password?
                    </Link>
                </p>
            </div>
        </main>
    )
}

export default Login

