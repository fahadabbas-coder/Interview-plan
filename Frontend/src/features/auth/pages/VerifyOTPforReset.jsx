import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Button from "../../../components/ui/Button";
import Logo from "../../../components/ui/Logo";
import { toastSuccess, toastError } from "../../../utils/toast";
import "../auth.form.css";

const VerifyOTPforReset = () => {
  const { handleVerifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from state (passed from forget password)
  const { email = "" } = location.state || {};

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const data = await handleVerifyOtp({ email, otp });
      if (data) {
        toastSuccess(data);
        // Store email in location state for reset password page
        navigate("/reset-password", { state: { email } });
      } else {
        toastError(null, "Invalid OTP. Please try again.");
      }
    } catch (error) {
      toastError(error, "Unable to verify OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Logo />
          <h1 className="auth-title">Verify OTP</h1>
          <p className="auth-subtitle">
            We've sent an OTP to <strong>{email}</strong>. Enter it below to verify.
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
              {submitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </form>

        <p className="auth-footnote">
          Didn't receive the code?{" "}
          <button className="text-link" onClick={() => navigate("/forget-password")}>
            Resend OTP
          </button>
        </p>
      </div>
    </main>
  );
};

export default VerifyOTPforReset;