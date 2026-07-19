"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import AuthShell from "./AuthShell";
import { preparePasswordResetSession, updatePassword } from "./api";

function friendlyResetError(message: string) {
  if (message.toLowerCase().includes("code verifier")) {
    return "This reset link was opened in a different browser or has expired. Request a new password reset link and open it in the same browser.";
  }

  return message;
}

export default function ResetPasswordView() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("Checking your password reset link.");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function prepareSession() {
      try {
        await preparePasswordResetSession();

        if (!isMounted) {
          return;
        }

        setReady(true);
        setStatus("Reset link verified. Enter your new password.");
      } catch (prepareError) {
        if (!isMounted) {
          return;
        }

        const message =
          prepareError instanceof Error
            ? friendlyResetError(prepareError.message)
            : "Password reset link is invalid or expired.";
        setError(message);
        setStatus("Password reset link could not be verified.");
      }
    }

    prepareSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!ready) {
      setError("Request a new password reset link before updating your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setStatus("Password updated successfully. Redirecting to login...");
      router.push("/login?reset=1");
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? friendlyResetError(updateError.message)
          : "Unable to update password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset password"
      description={status}
      asideTitle="Secure reset"
      asideItems={[
        "Use at least 8 characters.",
        "Choose a password you do not use elsewhere.",
        "After updating, login with your new password.",
      ]}
    >
      <div className="auth-card-grid">
        <article className="auth-form-card">
          <div className="auth-form-head">
            <p className="auth-section-kicker">New password</p>
            <h2>Create a new password</h2>
            <p>Complete this step from the same browser where you opened the reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                disabled={!ready || loading}
                required
              />
            </label>

            <label className="auth-field">
              <span>Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                disabled={!ready || loading}
                required
              />
            </label>

            {error ? <p className="auth-feedback is-error">{error}</p> : null}

            <button type="submit" className="auth-submit" disabled={!ready || loading}>
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        </article>

        <article className="auth-info-card">
          <p className="auth-section-kicker">Need a new link?</p>
          <h2>Start again safely</h2>
          <p>If the link expired or was opened in another browser, request a new reset email.</p>
          <Link href="/forgot-password" className="auth-secondary-action">
            Request reset link
          </Link>
        </article>
      </div>
    </AuthShell>
  );
}
