"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import AuthShell from "./AuthShell";
import { register } from "./api";
import { registerVariants, type UserRole } from "./types";

export default function RegisterView() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("LEARNER_EN");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedVariant = useMemo(
    () => registerVariants.find((variant) => variant.key === role) ?? registerVariants[0],
    [role],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await register({ fullName, email, password }, selectedVariant);
      setSuccess(
        `${response.data.user.role} account created. Redirecting to dashboard...`,
      );
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to register right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Create account"
      title="Register a new admin or learner account."
      description="Choose the role you need, submit the form, and the backend will create the right account type and sign you in immediately."
      asideTitle="Role mapping"
      asideItems={[
        "Admin registration uses the admin backend route.",
        "Learner English and Learner Bangla use separate learner backend routes.",
        "Registration also creates the login session for immediate dashboard access.",
      ]}
    >
      <div className="auth-card-grid">
        <article className="auth-form-card">
          <div className="auth-form-head">
            <p className="auth-section-kicker">Registration</p>
            <h2>Choose account type</h2>
            <p>Select the account type first, then fill in your name, email, and password.</p>
          </div>

          <div className="auth-role-grid">
            {registerVariants.map((variant) => (
              <button
                key={variant.key}
                type="button"
                className={`auth-role-card ${variant.key === role ? "is-active" : ""}`}
                onClick={() => setRole(variant.key)}
              >
                <strong>{variant.label}</strong>
                <span>{variant.description}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Full name</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Electrical Training Admin"
                minLength={2}
                required
              />
            </label>

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@example.com"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="password123"
                minLength={8}
                required
              />
            </label>

            {error ? <p className="auth-feedback is-error">{error}</p> : null}
            {success ? <p className="auth-feedback is-success">{success}</p> : null}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creating account..." : `Register ${selectedVariant.label}`}
            </button>
          </form>
        </article>

        <article className="auth-info-card">
          <p className="auth-section-kicker">After registration</p>
          <h2>What happens next</h2>
          <div className="auth-note-list">
            <div className="auth-note-card">
              <strong>Instant session</strong>
              <span>The backend sets your auth cookies during registration.</span>
            </div>
            <div className="auth-note-card">
              <strong>Dashboard redirect</strong>
              <span>You move straight into the frontend dashboard after success.</span>
            </div>
            <div className="auth-note-card">
              <strong>Verification support</strong>
              <span>Email verification and OTP routes exist in backend for future UI expansion.</span>
            </div>
          </div>

          <Link href="/login" className="auth-secondary-action">
            Already have an account? Login
          </Link>
        </article>
      </div>
    </AuthShell>
  );
}
