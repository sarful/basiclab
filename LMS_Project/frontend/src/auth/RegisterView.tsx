"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { register, resendVerificationEmail } from "./api";
import { getDefaultRouteForRole } from "./routes";
import { registerVariants, type EngineeringDiscipline, type Occupation } from "./types";

export default function RegisterView() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "", username: "", email: "", mobileNumber: "", dateOfBirth: "", gender: "",
    country: "", preferredLanguage: "en" as "en" | "bn", address: "", occupation: "" as Occupation | "",
    engineeringDiscipline: "" as EngineeringDiscipline | "", institutionOrCompanyName: "",
    identityNumber: "", password: "", confirmPassword: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendingVerification, setResendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setRegisteredEmail("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.occupation || !form.engineeringDiscipline) {
      setError("Complete the required academic information.");
      return;
    }

    setLoading(true);
    try {
      const registrationVariant = registerVariants.find(({ key }) =>
        key === (form.preferredLanguage === "bn" ? "LEARNER_BN" : "LEARNER_EN"),
      ) ?? registerVariants[0];
      const normalizedEmail = form.email.trim();
      const response = await register({
        fullName: form.fullName.trim(), username: form.username.trim(), email: normalizedEmail,
        mobileNumber: form.mobileNumber.trim(), dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined, country: form.country.trim(),
        preferredLanguage: form.preferredLanguage, address: form.address.trim() || undefined,
        occupation: form.occupation, engineeringDiscipline: form.engineeringDiscipline,
        institutionOrCompanyName: form.institutionOrCompanyName.trim(),
        identityNumber: form.identityNumber.trim() || undefined, password: form.password,
      }, registrationVariant);

      if (!response.data.user.isEmailVerified) {
        setRegisteredEmail(normalizedEmail);
        setSuccess("Account created. Check your email to verify your account.");
        return;
      }
      router.push(getDefaultRouteForRole(response.data.user.role));
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!registeredEmail) {
      return;
    }

    setResendingVerification(true);
    setError("");

    try {
      await resendVerificationEmail(registeredEmail);
      setSuccess("Verification email sent again. Check inbox and spam folder.");
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Unable to resend verification email.");
    } finally {
      setResendingVerification(false);
    }
  }

  return (
    <main className="auth-page registration-only-page">
      <article className="auth-form-card registration-card">
        <div className="auth-form-head"><p className="auth-section-kicker">Registration</p><h2>Account information</h2><p>Fields marked with * are required.</p></div>
        <form onSubmit={handleSubmit} className="auth-form registration-form">
          <div className="registration-language registration-language-primary">
            <span className="registration-field-label">Preferred Language *</span>
            <div className="registration-language-grid">
              <label className={`registration-language-option${form.preferredLanguage === "en" ? " is-selected" : ""}`}>
                <input type="radio" name="preferredLanguage" value="en" checked={form.preferredLanguage === "en"} onChange={(e) => updateField("preferredLanguage", e.target.value)} />
                <span><strong>English</strong><small>Course and dashboard in English</small></span>
              </label>
              <label className={`registration-language-option${form.preferredLanguage === "bn" ? " is-selected" : ""}`}>
                <input type="radio" name="preferredLanguage" value="bn" checked={form.preferredLanguage === "bn"} onChange={(e) => updateField("preferredLanguage", e.target.value)} />
                <span><strong>বাংলা</strong><small>কোর্স এবং ড্যাশবোর্ড বাংলায়</small></span>
              </label>
            </div>
          </div>

          <fieldset className="registration-section"><legend>Personal Information</legend><div className="registration-grid">
            <Field label="Full Name *"><input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} autoComplete="name" minLength={2} required /></Field>
            <Field label="Username *"><input value={form.username} onChange={(e) => updateField("username", e.target.value)} autoComplete="username" minLength={3} pattern="[A-Za-z0-9._-]+" title="Use letters, numbers, dots, underscores or hyphens." required /></Field>
            <Field label="Email Address *"><input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} autoComplete="email" required /></Field>
            <Field label="Mobile Number *"><input type="tel" value={form.mobileNumber} onChange={(e) => updateField("mobileNumber", e.target.value)} autoComplete="tel" minLength={7} required /></Field>
            <Field label="Date of Birth"><input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} /></Field>
            <Field label="Gender"><select value={form.gender} onChange={(e) => updateField("gender", e.target.value)}><option value="">Select gender</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option><option value="PREFER_NOT_TO_SAY">Prefer not to say</option></select></Field>
            <Field label="Country *"><input value={form.country} onChange={(e) => updateField("country", e.target.value)} autoComplete="country-name" required /></Field>
            <Field label="Address" wide><textarea value={form.address} onChange={(e) => updateField("address", e.target.value)} autoComplete="street-address" rows={3} /></Field>
          </div></fieldset>

          <fieldset className="registration-section"><legend>Academic or Professional Information</legend><div className="registration-grid">
            <Field label="Occupation *"><select value={form.occupation} onChange={(e) => updateField("occupation", e.target.value)} required><option value="">Select occupation</option><option value="STUDENT">Student</option><option value="PROFESSIONAL">Professional</option></select></Field>
            <Field label="Engineering Background / Discipline *"><select value={form.engineeringDiscipline} onChange={(e) => updateField("engineeringDiscipline", e.target.value)} required><option value="">Select discipline</option><option value="ELECTRICAL_AND_ELECTRONIC_ENGINEERING">Electrical and Electronic Engineering</option><option value="MECHANICAL_ENGINEERING">Mechanical Engineering</option><option value="MECHATRONICS_ENGINEERING">Mechatronics Engineering</option><option value="AUTOMATION_ENGINEERING">Automation Engineering</option><option value="ROBOTICS_ENGINEERING">Robotics Engineering</option></select></Field>
            <Field label="Institution or Company Name *"><input value={form.institutionOrCompanyName} onChange={(e) => updateField("institutionOrCompanyName", e.target.value)} required /></Field>
            <Field label={form.occupation === "PROFESSIONAL" ? "Employee ID" : "Student ID"}><input value={form.identityNumber} onChange={(e) => updateField("identityNumber", e.target.value)} /></Field>
          </div></fieldset>

          <fieldset className="registration-section"><legend>Account Security</legend><div className="registration-grid">
            <Field label="Password *"><input type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} autoComplete="new-password" minLength={8} required /></Field>
            <Field label="Confirm Password *"><input type="password" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} autoComplete="new-password" minLength={8} required /></Field>
          </div><label className="registration-terms"><input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} required /><span>I accept the <Link href="/terms">Terms and Conditions</Link> *</span></label></fieldset>

          {error ? <p className="auth-feedback is-error">{error}</p> : null}
          {success ? <p className="auth-feedback is-success">{success}</p> : null}
          {registeredEmail ? (
            <div className="registration-resend">
              <span>{`No email received for ${registeredEmail}?`}</span>
              <button type="button" onClick={handleResendVerification} disabled={resendingVerification}>
                {resendingVerification ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          ) : null}
          <button type="submit" className="auth-submit" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>
          <p className="registration-login">Already have an account? <Link href="/login">Log in</Link></p>
        </form>
      </article>
    </main>
  );
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`auth-field${wide ? " registration-span-full" : ""}`}><span>{label}</span>{children}</label>;
}
