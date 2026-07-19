"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, type ReactNode } from "react";

import { login } from "./api";
import { getDefaultRouteForRole } from "./routes";

type IconName = "arrow" | "eye" | "eyeOff" | "lock" | "mail" | "user" | "zap";

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

    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),

    eyeOff: (
      <>
        <path d="m3 3 18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.2 18.2 0 0 1-2.2 3.2" />
        <path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 8 10 8a10.4 10.4 0 0 0 4.1-.8" />
      </>
    ),

    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
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

export default function LoginView() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      router.push(getDefaultRouteForRole(response.data.user.role));

      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-background-grid" />
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <header className="login-header">
        <div className="login-container login-header-inner">
          <Link href="/" className="login-brand" aria-label="ET LMS homepage">
            <span className="login-brand-icon">
              <Icon name="zap" size={20} />
            </span>

            <span className="login-brand-copy">
              <strong>ET LMS</strong>

              <small>Electrical Training</small>
            </span>
          </Link>

          <Link href="/" className="login-home-link">
            Back to home
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </header>

      <section className="login-main">
        <div className="login-container login-single-layout">
          <section className="login-card">
            <div className="login-card-header">
              <span className="login-user-icon">
                <Icon name="user" size={23} />
              </span>

              <div>
                <h1>Sign in</h1>

                <p>Enter your account details to continue.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <label className="login-field">
                <span className="login-field-label">Email address</span>

                <span className="login-input-wrapper">
                  <span className="login-input-icon">
                    <Icon name="mail" size={18} />
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    required
                    disabled={loading}
                  />
                </span>
              </label>

              <label className="login-field">
                <span className="login-password-row">
                  <span className="login-field-label">Password</span>

                  <Link href="/forgot-password" className="login-forgot-link">
                    Forgot password?
                  </Link>
                </span>

                <span className="login-input-wrapper">
                  <span className="login-input-icon">
                    <Icon name="lock" size={18} />
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    minLength={8}
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
                  </button>
                </span>
              </label>

              {error ? (
                <p className="login-feedback" role="alert">
                  {error}
                </p>
              ) : null}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <Icon name="arrow" size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="login-register-row">
              <span>Don&apos;t have an account?</span>

              <Link href="/register">Create account</Link>
            </div>
          </section>
        </div>
      </section>

      <footer className="login-footer">
        <div className="login-container">
          <p>
            © {new Date().getFullYear()} ET LMS. Electrical Training Platform.
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
          scroll-behavior: smooth;
        }

        body {
          min-width: 320px;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          color: #ffffff;
          background: #061518;
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

        button {
          margin: 0;
        }

        svg {
          display: block;
        }

        .login-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 18% 20%,
              rgba(20, 184, 166, 0.14),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 80%,
              rgba(13, 148, 136, 0.12),
              transparent 28%
            ),
            linear-gradient(135deg, #041315, #071d21);
          isolation: isolate;
        }

        .login-background-grid {
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

        .login-glow {
          position: absolute;
          z-index: -2;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .login-glow-one {
          top: -180px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: rgba(20, 184, 166, 0.14);
        }

        .login-glow-two {
          right: -180px;
          bottom: -220px;
          width: 540px;
          height: 540px;
          background: rgba(13, 148, 136, 0.17);
        }

        .login-container {
          width: min(1160px, calc(100% - 64px));
          margin: 0 auto;
        }

        .login-header {
          position: relative;
          z-index: 20;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(4, 18, 21, 0.78);
          backdrop-filter: blur(18px);
        }

        .login-header-inner {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .login-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
        }

        .login-brand-icon {
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

        .login-brand-copy {
          display: grid;
          line-height: 1;
        }

        .login-brand-copy strong {
          color: #ffffff;
          font-size: 17px;
          letter-spacing: -0.02em;
        }

        .login-brand-copy small {
          margin-top: 6px;
          color: #73dace;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .login-home-link {
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

        .login-home-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .login-main {
          position: relative;
          z-index: 2;
          flex: 1;
          display: grid;
          align-items: center;
          padding: 64px 0;
        }

        .login-single-layout {
          display: grid;
          place-items: center;
        }

        .login-card {
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

        .login-card::before {
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

        .login-card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .login-user-icon {
          width: 49px;
          height: 49px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: #22d3bd;
          background: rgba(34, 211, 189, 0.11);
        }

        .login-card-header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        .login-card-header p {
          margin: 8px 0 0;
          color: #91aaae;
          font-size: 13px;
          line-height: 1.55;
        }

        .login-form {
          margin-top: 29px;
          display: grid;
          gap: 20px;
        }

        .login-field {
          display: grid;
          gap: 9px;
        }

        .login-field-label {
          color: #dce9eb;
          font-size: 12px;
          font-weight: 750;
        }

        .login-password-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .login-forgot-link {
          color: #5eead4;
          font-size: 11px;
          font-weight: 750;
        }

        .login-forgot-link:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .login-input-wrapper {
          position: relative;
          width: 100%;
          display: block;
        }

        .login-input-icon {
          position: absolute;
          top: 50%;
          left: 15px;
          z-index: 2;
          color: #789397;
          pointer-events: none;
          transform: translateY(-50%);
        }

        .login-input-wrapper input {
          width: 100%;
          min-height: 51px;
          padding: 0 48px 0 46px;
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

        .login-input-wrapper input::placeholder {
          color: #607b7f;
        }

        .login-input-wrapper input:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .login-input-wrapper input:focus {
          border-color: #2dd4bf;
          background: rgba(2, 17, 20, 0.92);
          box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.1);
        }

        .login-input-wrapper input:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-password-toggle {
          position: absolute;
          top: 50%;
          right: 8px;
          z-index: 2;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 9px;
          color: #8aa1a5;
          background: transparent;
          cursor: pointer;
          transform: translateY(-50%);
        }

        .login-password-toggle:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .login-feedback {
          margin: -4px 0 0;
          padding: 11px 13px;
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 10px;
          color: #fecaca;
          background: rgba(127, 29, 29, 0.18);
          font-size: 12px;
          font-weight: 650;
          line-height: 1.5;
        }

        .login-submit {
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

        .login-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 38px rgba(34, 211, 189, 0.28);
        }

        .login-submit:disabled {
          opacity: 0.68;
          cursor: not-allowed;
          transform: none;
        }

        .login-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(3, 22, 20, 0.25);
          border-top-color: #031614;
          border-radius: 50%;
          animation: loginSpin 0.75s linear infinite;
        }

        .login-register-row {
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

        .login-register-row a {
          color: #5eead4;
          font-weight: 800;
        }

        .login-register-row a:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .login-footer {
          position: relative;
          z-index: 2;
          padding: 19px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .login-footer p {
          margin: 0;
          color: #718a8f;
          font-size: 10px;
          text-align: center;
        }

        @keyframes loginSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 720px) {
          .login-container {
            width: min(100% - 28px, 1160px);
          }

          .login-header-inner {
            min-height: 68px;
          }

          .login-main {
            align-items: start;
            padding: 42px 0;
          }

          .login-card {
            padding: 27px 22px;
            border-radius: 20px;
          }
        }

        @media (max-width: 520px) {
          .login-brand-copy small {
            display: none;
          }

          .login-home-link {
            width: 42px;
            height: 42px;
            padding: 0;
            justify-content: center;
            font-size: 0;
          }

          .login-home-link svg {
            width: 19px;
            height: 19px;
          }

          .login-card-header {
            align-items: center;
          }

          .login-card-header h1 {
            font-size: 25px;
          }

          .login-user-icon {
            width: 44px;
            height: 44px;
          }

          .login-password-row {
            align-items: flex-start;
          }
        }

        @media (max-width: 400px) {
          .login-card {
            padding: 23px 17px;
          }

          .login-card-header p {
            font-size: 12px;
          }

          .login-register-row {
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
    </main>
  );
}
