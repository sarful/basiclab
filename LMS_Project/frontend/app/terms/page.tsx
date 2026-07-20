import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | Electrical Training Platform",
  description: "Terms and conditions for using the Electrical Training Platform.",
};

const sections = [
  {
    title: "Account and eligibility",
    body: "Provide accurate registration information and keep your login details secure. You are responsible for activity performed through your account.",
  },
  {
    title: "Course access",
    body: "Course access depends on your account type. Free accounts cannot open protected lessons. Trial and paid accounts can open protected course lessons directly while their account access is active.",
  },
  {
    title: "Trial and paid access",
    body: "Trial duration is set by the platform administrator. When a trial ends, access may return to the free level. Paid access starts after the administrator approves the payment request.",
  },
  {
    title: "Payments and upgrades",
    body: "Submit correct payment and transaction information. Upgrade requests remain pending until reviewed and may be rejected if the submitted information cannot be verified.",
  },
  {
    title: "Acceptable use",
    body: "Do not share accounts, disrupt the platform, bypass access controls, upload harmful material, or use course resources for unlawful purposes.",
  },
  {
    title: "Learning content",
    body: "Lessons, simulations, projects, downloads, and other course materials are provided for personal learning. They may not be copied, resold, or redistributed without permission.",
  },
  {
    title: "Progress and certificates",
    body: "Progress and certificate eligibility depend on recorded course activity and the active rules configured by the platform. Incorrect or abusive activity may be removed.",
  },
  {
    title: "Account management",
    body: "The administrator may suspend or remove accounts that violate these terms, misuse course access, or provide false information.",
  },
  {
    title: "Updates to these terms",
    body: "These terms may be updated when platform features or access rules change. Continued use after an update means you accept the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="terms-page">
      <section className="terms-shell">
        <header className="terms-hero">
          <Link href="/" className="terms-brand" aria-label="Electrical Training Platform home">
            <span>ET</span>
            <strong>Electrical Training Platform</strong>
          </Link>
          <p className="terms-kicker">Legal</p>
          <h1>Terms and Conditions</h1>
          <p>These terms explain the rules for accounts, course access, payments, and learning content.</p>
          <div className="terms-meta">
            <span>Effective 15 July 2026</span>
            <span>Version 1.0</span>
          </div>
        </header>

        <div className="terms-content">
          <aside className="terms-summary">
            <strong>Before you continue</strong>
            <p>Read these terms before creating an account. Registration requires your acceptance.</p>
            <Link href="/register">Return to registration</Link>
          </aside>

          <article className="terms-document">
            <section className="terms-intro">
              <h2>Agreement</h2>
              <p>By creating an account or using this platform, you agree to follow these Terms and Conditions.</p>
            </section>

            {sections.map((section, index) => (
              <section key={section.title} className="terms-section">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </div>
              </section>
            ))}

            <footer className="terms-footer">
              <p>Questions about these terms can be submitted to the platform administrator.</p>
              <div>
                <Link href="/register" className="terms-primary-link">Create Account</Link>
                <Link href="/login" className="terms-secondary-link">Log In</Link>
              </div>
            </footer>
          </article>
        </div>
      </section>
    </main>
  );
}
