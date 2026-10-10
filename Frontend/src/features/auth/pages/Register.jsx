import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"
import Button from "../../../components/ui/Button"
import Logo from "../../../components/ui/Logo"
import { toastError } from "../../../utils/toast"
import "../auth.form.css"

const Register = () => {
    const { handleRegister } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)

        try {
            const data = await handleRegister({ username, email, password })
            if (data?.user) {
                navigate("/verify-email", { state: { email } }) // Pass email to verification page
            } else {
                toastError(null, "Unable to create your account. Try again.")
            }
        } catch (error) {
            toastError(error, "Unable to create your account. Try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Logo />
                    <h1 className="auth-title">Create account</h1>
                    <p className="auth-subtitle">Set up access to your interview preparation plans.</p>
                </div>

                <form className="panel auth-form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="field__label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            className="input"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Enter username"
                        />
                    </div>

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
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Create password"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        loading={submitting}
                        disabled={!username || !email || !password}
                    >
                        {submitting ? "Creating account" : "Create account"}
                    </Button>
                </form>

                <p className="auth-footnote">
                    Already registered?{" "}
                    <Link className="text-link" to="/login">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    )
}

export default Register
