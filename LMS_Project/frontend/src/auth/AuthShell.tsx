import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  asideTitle: string;
  asideItems: string[];
};

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  asideTitle,
  asideItems,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero-copy">
          <Link href="/" className="auth-brand">
            <span className="auth-brand-badge">ET</span>
            <span>
              <strong>Electrical Training Platform</strong>
              <small>Training portal + LMS access</small>
            </span>
          </Link>

          <p className="auth-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-description">{description}</p>

          <div className="auth-link-row">
            <Link href="/login" className="auth-ghost-link">
              Login
            </Link>
            <Link href="/register" className="auth-ghost-link">
              Register
            </Link>
            <Link href="/dashboard" className="auth-ghost-link">
              Dashboard
            </Link>
          </div>
        </div>

        <aside className="auth-aside">
          <p className="auth-aside-kicker">Current flow</p>
          <h2>{asideTitle}</h2>
          <div className="auth-aside-list">
            {asideItems.map((item) => (
              <div key={item} className="auth-aside-item">
                <span className="auth-aside-dot" aria-hidden="true" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="auth-panel">{children}</section>
    </main>
  );
}
