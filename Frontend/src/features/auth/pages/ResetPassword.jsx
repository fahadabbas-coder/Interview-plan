import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Button from "../../../components/ui/Button";
import Logo from "../../../components/ui/Logo";
import { toastSuccess, toastError } from "../../../utils/toast";
import "../auth.form.css";

const ResetPassword = () => {
  const { handleRestPassword, loading } = useAuth();
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await handleRestPassword({ newPassword, confirmPassword });
      if (res?.message) {
        toastSuccess(res);

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);

      } else {
        toastError(null, "Unable to reset your password. Please try again.");
      }
    } catch (error) {
      toastError(error, "Unable to reset your password. Please try again.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Logo />
          <h1 className="auth-title">Create a new password</h1>
          <p className="auth-subtitle">
            Choose a new password for your account.
          </p>
        </div>

        <form className="panel auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              name="newPassword"
              className="input"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!newPassword || !confirmPassword}
          >
            {loading ? "Resetting password" : "Reset password"}
          </Button>

        </form>

        <p className="auth-footnote">
          <Link className="text-link" to="/login">Back to sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default ResetPassword;