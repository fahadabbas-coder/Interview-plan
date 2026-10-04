import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Button from "../../../components/ui/Button";
import Logo from "../../../components/ui/Logo";
import { toastSuccess, toastError } from "../../../utils/toast";
import "../auth.form.css";

const ForgetPassword = () => {
  const { handleForgetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await handleForgetPassword({ email });
      if (res) {
        toastSuccess(res);
        navigate("/verify-otp-reset", { state: { email } });
      } else {
        toastError(null, "Unable to send a reset code. Please try again.");
      }
    } catch (error) {
      toastError(error, "Unable to send a reset code. Please try again.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Logo />
          <h1 className="auth-title">Forgot password</h1>
          <p className="auth-subtitle">
            Enter your account email and we'll send you a one-time reset code.
          </p>
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!email}
          >
            {loading ? "Sending code" : "Send reset code"}
          </Button>
        </form>

        <p className="auth-footnote">
          <Link className="text-link" to="/login">Back to sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default ForgetPassword;