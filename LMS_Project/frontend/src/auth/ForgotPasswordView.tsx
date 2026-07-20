"use client";

import Link from "next/link";
import { FormEvent, useState, type ReactNode } from "react";

import { requestPasswordReset } from "./api";
import { useBackendMode } from "./backend-mode";

type IconName = "arrow" | "check" | "mail" | "key" | "zap";

type IconProps = {
  name: IconName;
  size?: number;
};

function Icon({ name, size = 20 }: IconProps) {
  const icons: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    key: (
      <>
        <circle cx="8" cy="15" r="4" />
        <path d="m11 12 8-8" />
        <path d="m15 8 2 2" />
        <path d="m17 6 2 2" />
      </>
    ),

    zap: <path d="M13 2 3 14h9l-1 8 10-12h-9Z" />,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

export default function ForgotPasswordView() {
  const { isSupabase, setMode } = useBackendMode();

  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    setLoading(true);
    setNotice("");
    setError("");

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      if (!isSupabase) {
        setMode("supabase");
      }

      await requestPasswordReset(normalizedEmail);

      setNotice(
        "Password reset email sent. Check your inbox and open the reset link.",
      );
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Unable to send the password reset email.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="forgot-page">
      <div className="forgot-grid" />
      <div className="forgot-glow forgot-glow-left" />
      <div className="forgot-glow forgot-glow-right" />

      <header className="forgot-header">
        <div className="forgot-container forgot-header-inner">
          <Link href="/" className="forgot-brand" aria-label="MechatronicsLAB homepage">
            <span className="forgot-brand-icon">
              <Icon name="zap" size={20} />
            </span>

            <span className="forgot-brand-copy">
              <strong>MechatronicsLAB</strong>
              <small>Electrical Training</small>
            </span>
          </Link>

          <Link href="/login" className="forgot-header-link">
            Back to login
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </header>

      <section className="forgot-main">
        <div className="forgot-container forgot-content">
          <article className="forgot-card">
            <div className="forgot-card-header">
              <span className="forgot-card-icon">
                <Icon name="key" size={23} />
              </span>

              <div>
                <h1>Forgot password</h1>

                <p>
                  Enter your email address to receive a password reset link.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="forgot-form">
              <label className="forgot-field">
                <span className="forgot-field-label">Email address</span>

                <span className="forgot-input-wrapper">
                  <span className="forgot-input-icon">
                    <Icon name="mail" size={18} />
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    disabled={loading}
                    required
                  />
                </span>
              </label>

              {notice ? (
                <p className="forgot-feedback forgot-success" role="status">
                  <Icon name="check" size={17} />

                  <span>{notice}</span>
                </p>
              ) : null}

              {error ? (
                <p className="forgot-feedback forgot-error" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="forgot-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="forgot-spinner" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send reset link
                    <Icon name="arrow" size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="forgot-login-row">
              <span>Remembered it?</span>

              <Link href="/login">Sign in</Link>
            </div>
          </article>
        </div>
      </section>

      <footer className="forgot-footer">
        <div className="forgot-container">
          <p>
            © {new Date().getFullYear()} MechatronicsLAB. Electrical lessons and simulations.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html {
          min-width: 320px;
          margin: 0;
          padding: 0;
        }

        body {
          min-width: 320px;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          color: #ffffff;
          background: #041315;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        svg {
          display: block;
        }

        .forgot-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 18% 18%,
              rgba(20, 184, 166, 0.14),
              transparent 31%
            ),
            radial-gradient(
              circle at 88% 82%,
              rgba(13, 148, 136, 0.12),
              transparent 29%
            ),
            linear-gradient(135deg, #041315, #071d21);
          isolation: isolate;
        }

        .forgot-grid {
          position: absolute;
          inset: 0;
          z-index: -3;
          opacity: 0.17;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(45, 212, 191, 0.05) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(45, 212, 191, 0.05) 1px,
              transparent 1px
            );
          background-size: 46px 46px;
        }

        .forgot-glow {
          position: absolute;
          z-index: -2;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .forgot-glow-left {
          top: -180px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: rgba(20, 184, 166, 0.14);
        }

        .forgot-glow-right {
          right: -180px;
          bottom: -220px;
          width: 540px;
          height: 540px;
          background: rgba(13, 148, 136, 0.17);
        }

        .forgot-container {
          width: min(1160px, calc(100% - 64px));
          margin: 0 auto;
        }

        .forgot-header {
          position: relative;
          z-index: 20;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(4, 18, 21, 0.78);
          backdrop-filter: blur(18px);
        }

        .forgot-header-inner {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .forgot-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
        }

        .forgot-brand-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: #031614;
          background: #2dd4bf;
          box-shadow: 0 10px 28px rgba(45, 212, 191, 0.22);
        }

        .forgot-brand-copy {
          display: grid;
          line-height: 1;
        }

        .forgot-brand-copy strong {
          color: #ffffff;
          font-size: 17px;
          letter-spacing: -0.02em;
        }

        .forgot-brand-copy small {
          margin-top: 6px;
          color: #73dace;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .forgot-header-link {
          min-height: 42px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          color: #b7cbce;
          font-size: 13px;
          font-weight: 750;
          transition:
            color 0.2s ease,
            background 0.2s ease;
        }

        .forgot-header-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .forgot-main {
          position: relative;
          z-index: 2;
          flex: 1;
          display: grid;
          align-items: center;
          padding: 64px 0;
        }

        .forgot-content {
          display: grid;
          place-items: center;
        }

        .forgot-card {
          position: relative;
          width: min(100%, 470px);
          padding: 34px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 24px;
          background: rgba(7, 29, 33, 0.9);
          box-shadow:
            0 32px 75px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(22px);
        }

        .forgot-card::before {
          content: "";
          position: absolute;
          top: 0;
          right: 28px;
          left: 28px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(94, 234, 212, 0.5),
            transparent
          );
        }

        .forgot-card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .forgot-card-icon {
          width: 49px;
          height: 49px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: #22d3bd;
          background: rgba(34, 211, 189, 0.11);
        }

        .forgot-card-header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        .forgot-card-header p {
          margin: 8px 0 0;
          color: #91aaae;
          font-size: 13px;
          line-height: 1.55;
        }

        .forgot-form {
          margin-top: 29px;
          display: grid;
          gap: 20px;
        }

        .forgot-field {
          display: grid;
          gap: 9px;
        }

        .forgot-field-label {
          color: #dce9eb;
          font-size: 12px;
          font-weight: 750;
        }

        .forgot-input-wrapper {
          position: relative;
          width: 100%;
          display: block;
        }

        .forgot-input-icon {
          position: absolute;
          top: 50%;
          left: 15px;
          z-index: 2;
          color: #789397;
          pointer-events: none;
          transform: translateY(-50%);
        }

        .forgot-input-wrapper input {
          width: 100%;
          min-height: 51px;
          padding: 0 16px 0 46px;
          outline: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 11px;
          color: #ffffff;
          background: rgba(2, 17, 20, 0.72);
          font-size: 14px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .forgot-input-wrapper input::placeholder {
          color: #607b7f;
        }

        .forgot-input-wrapper input:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .forgot-input-wrapper input:focus {
          border-color: #2dd4bf;
          background: rgba(2, 17, 20, 0.92);
          box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.1);
        }

        .forgot-input-wrapper input:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .forgot-feedback {
          margin: -4px 0 0;
          padding: 11px 13px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 650;
          line-height: 1.5;
        }

        .forgot-feedback svg {
          flex: 0 0 auto;
          margin-top: 1px;
        }

        .forgot-success {
          border: 1px solid rgba(52, 211, 153, 0.28);
          color: #bbf7d0;
          background: rgba(6, 78, 59, 0.22);
        }

        .forgot-error {
          border: 1px solid rgba(248, 113, 113, 0.3);
          color: #fecaca;
          background: rgba(127, 29, 29, 0.18);
        }

        .forgot-submit {
          min-height: 52px;
          padding: 0 22px;
          border: 0;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #031614;
          background: linear-gradient(135deg, #22d3bd, #48e7cf);
          box-shadow: 0 14px 32px rgba(34, 211, 189, 0.2);
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .forgot-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 38px rgba(34, 211, 189, 0.28);
        }

        .forgot-submit:disabled {
          opacity: 0.68;
          cursor: not-allowed;
          transform: none;
        }

        .forgot-spinner {
          width: 16px;
          height: 16px;
          flex: 0 0 auto;
          border: 2px solid rgba(3, 22, 20, 0.25);
          border-top-color: #031614;
          border-radius: 50%;
          animation: forgotSpin 0.75s linear infinite;
        }

        .forgot-login-row {
          margin-top: 23px;
          padding-top: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #8fa7aa;
          font-size: 12px;
        }

        .forgot-login-row a {
          color: #5eead4;
          font-weight: 800;
        }

        .forgot-login-row a:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .forgot-footer {
          position: relative;
          z-index: 2;
          padding: 19px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .forgot-footer p {
          margin: 0;
          color: #718a8f;
          font-size: 10px;
          text-align: center;
        }

        @keyframes forgotSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 720px) {
          .forgot-container {
            width: min(100% - 28px, 1160px);
          }

          .forgot-header-inner {
            min-height: 68px;
          }

          .forgot-main {
            align-items: start;
            padding: 42px 0;
          }

          .forgot-card {
            padding: 27px 22px;
            border-radius: 20px;
          }
        }

        @media (max-width: 520px) {
          .forgot-brand-copy small {
            display: none;
          }

          .forgot-header-link {
            width: 42px;
            height: 42px;
            padding: 0;
            justify-content: center;
            font-size: 0;
          }

          .forgot-header-link svg {
            width: 19px;
            height: 19px;
          }

          .forgot-card-header {
            align-items: center;
          }

          .forgot-card-header h1 {
            font-size: 25px;
          }

          .forgot-card-icon {
            width: 44px;
            height: 44px;
          }
        }

        @media (max-width: 400px) {
          .forgot-card {
            padding: 23px 17px;
          }

          .forgot-card-header p {
            font-size: 12px;
          }

          .forgot-login-row {
            flex-direction: column;
            gap: 7px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
      <style jsx global>{`
        body {
          color: #14213d;
          background: #ffffff;
        }

        .forgot-page {
          color: #14213d;
          background:
            linear-gradient(rgba(37, 99, 235, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 118, 110, 0.045) 1px, transparent 1px),
            linear-gradient(180deg, #ffffff, #f7fbff 54%, #ffffff);
          background-size: 44px 44px, 44px 44px, auto;
        }

        .forgot-grid,
        .forgot-glow {
          display: none;
        }

        .forgot-header {
          border-bottom: 1px solid #e6edf3;
          background: rgba(255, 255, 255, 0.94);
        }

        .forgot-brand-icon {
          color: #ffffff;
          background: linear-gradient(135deg, #0f766e, #2563eb);
          box-shadow: 0 10px 26px rgba(37, 99, 235, 0.18);
        }

        .forgot-brand-copy strong {
          color: #102033;
          letter-spacing: 0;
        }

        .forgot-brand-copy small,
        .forgot-login-row a {
          color: #0f766e;
        }

        .forgot-header-link {
          color: #52677d;
        }

        .forgot-header-link:hover {
          color: #0f766e;
          background: #e8f7f4;
        }

        .forgot-card {
          border: 1px solid #dfeaf2;
          border-radius: 16px;
          color: #14213d;
          background: #ffffff;
          box-shadow: 0 26px 70px rgba(37, 99, 235, 0.12);
          backdrop-filter: none;
        }

        .forgot-card::before {
          background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.28), transparent);
        }

        .forgot-card-icon {
          color: #2563eb;
          background: #eef4ff;
        }

        .forgot-card-header h1 {
          color: #14213d;
          letter-spacing: 0;
        }

        .forgot-card-header p,
        .forgot-input-icon,
        .forgot-login-row,
        .forgot-footer p {
          color: #64788c;
        }

        .forgot-field-label {
          color: #34475d;
        }

        .forgot-input-wrapper input {
          border-color: #c9d8e4;
          border-radius: 11px;
          color: #14213d;
          background: #ffffff;
        }

        .forgot-input-wrapper input::placeholder {
          color: #8aa0b5;
        }

        .forgot-input-wrapper input:hover {
          border-color: #93c5fd;
        }

        .forgot-input-wrapper input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .forgot-success {
          border-color: #99f6e4;
          color: #0f766e;
          background: #ecfdf5;
        }

        .forgot-error {
          border-color: #fecaca;
          color: #b91c1c;
          background: #fff1f2;
        }

        .forgot-submit {
          color: #ffffff;
          background: linear-gradient(135deg, #0f766e, #2563eb);
          box-shadow: 0 14px 32px rgba(37, 99, 235, 0.18);
        }

        .forgot-submit:hover:not(:disabled) {
          box-shadow: 0 18px 38px rgba(37, 99, 235, 0.24);
        }

        .forgot-spinner {
          border-color: rgba(255, 255, 255, 0.42);
          border-top-color: #ffffff;
        }

        .forgot-login-row,
        .forgot-footer {
          border-color: #e8eef5;
        }

        @media (max-width: 720px) {
          .forgot-container {
            width: min(100% - 28px, 1160px);
          }

          .forgot-main {
            padding: 42px 0;
          }

          .forgot-card {
            border-radius: 12px;
          }
        }
      `}</style>
    </main>
  );
}
