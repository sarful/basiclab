"use client";

import Link from "next/link";

const workspaceLinks = [
  {
    href: "/library",
    title: "Reusable Symbol Library",
    description:
      "Browse push buttons, contactors, overloads, motors, and standard reusable circuit symbols.",
    tag: "Library",
  },
  {
    href: "/resistor-learning",
    title: "Resistor Learning",
    description:
      "Build core understanding of resistance, resistor types, color code, power rating, and circuit behavior.",
    tag: "Core Basics",
  },
  {
    href: "/current-voltage-learning/1",
    title: "Current & Voltage Learning",
    description:
      "Study electricity, voltage, current flow, and electrical relationships through guided lessons.",
    tag: "Core Basics",
  },
  {
    href: "/capacitor-learning/1",
    title: "Capacitor Learning",
    description:
      "Open lessons covering capacitance, construction, working principle, and common capacitor types.",
    tag: "Components",
  },
  {
    href: "/diode-learning/1",
    title: "Diode Learning",
    description:
      "Learn rectifiers, LEDs, zener diodes, and diode behavior in guided training workspaces.",
    tag: "Components",
  },
  {
    href: "/transformer-learning/1",
    title: "Transformer Learning",
    description:
      "Review transformer concepts, operation, and lesson-based simulation flow.",
    tag: "Power",
  },
  {
    href: "/relay-learning/1",
    title: "Relay Learning",
    description:
      "Study relay basics and relay-controlled circuit behavior through embedded lessons.",
    tag: "Control",
  },
  {
    href: "/transistor-learning/1",
    title: "Transistor Learning",
    description:
      "Follow transistor lessons covering structure, terminals, and switching use cases.",
    tag: "Control",
  },
  {
    href: "/voltage-regulator-learning/1",
    title: "Voltage Regulator Learning",
    description:
      "Understand voltage regulation, ripple control, and common regulator families.",
    tag: "Power",
  },
  {
    href: "/fuse-learning/1",
    title: "Fuse Learning",
    description:
      "Explore fuse protection behavior with lesson content and guided circuit simulation.",
    tag: "Protection",
  },
  {
    href: "/optocoupler-learning/1",
    title: "Optocoupler Learning",
    description:
      "Review isolation concepts and input-output behavior inside a lesson-based workspace.",
    tag: "Control",
  },
  {
    href: "/pushbutton-learning/1",
    title: "Pushbutton Learning",
    description:
      "Practice pushbutton switch behavior and simple control interactions.",
    tag: "Control",
  },
  {
    href: "/dol-project",
    title: "DOL Starter Project",
    description:
      "Review theory, power circuit, and control circuit for a direct-on-line starter project.",
    tag: "Motor Starter",
  },
  {
    href: "/ster_delta_with_timer",
    title: "Star-Delta With Timer",
    description:
      "Explore timer sequence, control logic, and starter behavior in a guided project workspace.",
    tag: "Motor Starter",
  },
  {
    href: "/reverse-forward-project",
    title: "Reverse Forward Control",
    description:
      "Study reverse-forward motor control flow with guided project layout and logic panels.",
    tag: "Motor Starter",
  },
  {
    href: "/linear-power-supply-project",
    title: "Linear Power Supply Project",
    description:
      "Review rectification, filtering, and regulation in a project-oriented training workspace.",
    tag: "Project",
  },
  {
    href: "/npn-transistor-switching-project",
    title: "NPN Switching Project",
    description:
      "Open the low-side switching workspace for animation-based circuit study.",
    tag: "Project",
  },
  {
    href: "/pnp-transistor-switching-project",
    title: "PNP Switching Project",
    description:
      "Open the high-side switching workspace for guided simulation and logic review.",
    tag: "Project",
  },
  {
    href: "/mosfet-n-channel-switch-circuit-project",
    title: "MOSFET N-Channel Project",
    description:
      "Practice low-side MOSFET switching with embedded circuit workspace panels.",
    tag: "Project",
  },
  {
    href: "/mosfet-p-channel-switch-circuit-project",
    title: "MOSFET P-Channel Project",
    description:
      "Practice high-side MOSFET switching with guided simulation and control layout.",
    tag: "Project",
  },
];

const featuredTracks = workspaceLinks.slice(0, 6);
const additionalTracks = workspaceLinks.slice(6);

const platformStats = [
  { value: "20+", label: "training modules" },
  { value: "3", label: "starter project flows" },
  { value: "1", label: "shared learning portal" },
];

const trainingPillars = [
  {
    title: "Structured Learning Paths",
    description:
      "Learners move from fundamentals to motor control projects in a sequence that is easy to follow.",
  },
  {
    title: "Diagram-First Practice",
    description:
      "Every workspace combines theory, circuit visuals, and simulation-style interaction for faster understanding.",
  },
  {
    title: "Professional Training Delivery",
    description:
      "The platform supports classroom explanation, self-study, and technical demonstrations in one place.",
  },
];

const workflowSteps = [
  {
    title: "Choose a topic",
    description:
      "Start from a core concept like current, voltage, resistor, diode, or capacitor lessons.",
  },
  {
    title: "Open the guided workspace",
    description:
      "Review the lesson, inspect the electrical diagram, and follow the control or logic layout clearly.",
  },
  {
    title: "Advance into projects",
    description:
      "Apply the same understanding in starter circuits, switching projects, and power-control examples.",
  },
];

const portalCapabilities = [
  "Reusable diagram symbols for faster lesson and circuit preparation",
  "Component learning modules for theory, behavior, and application",
  "Starter and switching projects for industrial control training",
];

export default function HomeLanding() {
  return (
    <main className="home-page">
      <header className="home-header">
        <Link href="/" className="home-brand" aria-label="Electrical Training Platform home">
          <span className="home-brand-badge">ET</span>
          <span className="home-brand-copy">
            <strong>Electrical Training Platform</strong>
            <small>Industrial electrical learning portal</small>
          </span>
        </Link>

        <nav className="home-nav" aria-label="Primary">
          <Link href="/library">Symbol Library</Link>
          <Link href="/resistor-learning">Basics</Link>
          <Link href="/diode-learning/1">Components</Link>
          <Link href="/dol-project">Projects</Link>
        </nav>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker">Industrial Electrical Training Portal</p>
          <h1>Clear electrical training from basic components to starter control circuits.</h1>
          <p className="home-hero-text">
            A simple, professional homepage for learning electrical concepts, reviewing circuit
            behavior, and opening guided industrial training workspaces without confusion.
          </p>

          <div className="home-hero-actions">
            <Link href="/current-voltage-learning/1" className="home-primary-link">
              Start Learning Basics
            </Link>
            <Link href="/dol-project" className="home-secondary-link">
              Open Starter Projects
            </Link>
          </div>

          <div className="home-stat-row" aria-label="Platform statistics">
            {platformStats.map((item) => (
              <article key={item.label} className="home-stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>

        <aside className="home-hero-panel">
          <div className="home-panel-block">
            <p className="home-panel-eyebrow">Training Focus</p>
            <h2>Built for classroom, workshop, and self-paced electrical study.</h2>
          </div>

          <div className="home-panel-stack">
            {portalCapabilities.map((item) => (
              <div key={item} className="home-panel-item">
                <span className="home-panel-marker" aria-hidden="true" />
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="home-panel-grid">
            <div>
              <span>Best for</span>
              <strong>Electrical fundamentals and motor control training</strong>
            </div>
            <div>
              <span>Format</span>
              <strong>Lessons, diagrams, simulations, and project workspaces</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <p className="home-section-kicker">Why This Platform</p>
          <h2>Everything is organized to help learners understand faster.</h2>
        </div>

        <div className="home-pillar-grid">
          {trainingPillars.map((pillar) => (
            <article key={pillar.title} className="home-pillar-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section-alt">
        <div className="home-section-head">
          <p className="home-section-kicker">Featured Learning Paths</p>
          <h2>Start with the most useful training modules.</h2>
        </div>

        <div className="home-card-grid">
          {featuredTracks.map((item) => (
            <Link key={item.href} href={item.href} className="home-card">
              <span className="home-card-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="home-card-link">Open module</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <p className="home-section-kicker">Learning Flow</p>
          <h2>A simple path from theory to industrial circuit application.</h2>
        </div>

        <div className="home-step-grid">
          {workflowSteps.map((step, index) => (
            <article key={step.title} className="home-step-card">
              <span className="home-step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head home-section-head-inline">
          <div>
            <p className="home-section-kicker">All Modules</p>
            <h2>Quick access to the full training library.</h2>
          </div>
          <Link href="/library" className="home-directory-link">
            Open symbol library
          </Link>
        </div>

        <div className="home-directory-grid">
          {additionalTracks.map((item) => (
            <Link key={item.href} href={item.href} className="home-directory-item">
              <span>{item.title}</span>
              <small>{item.tag}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p className="home-section-kicker">Ready To Begin</p>
          <h2>Open a lesson now and move directly into guided electrical training.</h2>
        </div>
        <div className="home-hero-actions">
          <Link href="/resistor-learning" className="home-primary-link">
            Launch Core Lessons
          </Link>
          <Link href="/ster_delta_with_timer" className="home-secondary-link">
            Launch Starter Training
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <strong>Electrical Training Platform</strong>
          <p>Professional electrical learning, diagrams, and guided circuit workspaces.</p>
        </div>

        <div className="home-footer-links">
          <Link href="/library">Library</Link>
          <Link href="/current-voltage-learning/1">Basics</Link>
          <Link href="/diode-learning/1">Components</Link>
          <Link href="/dol-project">Projects</Link>
        </div>
      </footer>
    </main>
  );
}
