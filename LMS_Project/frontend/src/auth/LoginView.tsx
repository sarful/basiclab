"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import AuthShell from "./AuthShell";
import { useBackendMode } from "./backend-mode";
import { login } from "./api";

export default function LoginView() {
  const router = useRouter();
  const { isDisconnected, setMode } = useBackendMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to login right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePreviewMode() {
    setMode("disconnected");
    router.push("/dashboard");
    router.refresh();
  }

  function handleBackendMode() {
    setMode("connected");
    setError("");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Access portal"
      title="Login to the training platform dashboard."
      description="Use the LMS backend account you created from the backend API. After login, you will land on the correct admin or learner dashboard automatically."
      asideTitle="What works now"
      asideItems={[
        "Admin and learner registration are live in the backend.",
        "Login sets secure HTTP-only cookies on localhost.",
        "Dashboard data is pulled from the real backend APIs.",
      ]}
    >
      <div className="auth-card-grid">
        <article className="auth-form-card">
          <div className="auth-form-head">
            <p className="auth-section-kicker">Login form</p>
            <h2>Sign in</h2>
            <p>Use the same email and password from your registered account.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
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

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Signing in..." : "Login to dashboard"}
            </button>
          </form>
        </article>

        <article className="auth-info-card">
          <p className="auth-section-kicker">Need an account?</p>
          <h2>Create one first</h2>
          <p>
            You can register as an admin, English learner, or Bangla learner from the new
            registration page.
          </p>

          <div className="auth-note-list">
            <div className="auth-note-card">
              <strong>Admin account</strong>
              <span>Use for dashboard, files, analytics, announcements, and reports.</span>
            </div>
            <div className="auth-note-card">
              <strong>Learner account</strong>
              <span>Use for course access, quiz performance, and learner-side progress.</span>
            </div>
          </div>

          <Link href="/register" className="auth-secondary-action">
            Open registration page
          </Link>

          <div className="auth-note-list">
            <div className="auth-note-card">
              <strong>Frontend preview mode</strong>
              <span>
                {isDisconnected
                  ? "Backend is disconnected. All frontend routes are unlocked with a preview admin session."
                  : "Switch off backend access to preview routes without login while the API is unavailable."}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="auth-secondary-action"
            onClick={isDisconnected ? handleBackendMode : handlePreviewMode}
          >
            {isDisconnected ? "Reconnect backend mode" : "Disconnect backend and unlock routes"}
          </button>
        </article>
      </div>
    </AuthShell>
  );
}
