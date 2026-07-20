"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import DOLStarterPowerDiagram from "../src/courses/basics-electronics-and-electrical/Project/dol-project/DOLStarterPowerDiagram";

type DiagramMode = "power";

const diagramContent: Record<
  DiagramMode,
  { title: string; description: string; component: ReactNode }
> = {
  power: {
    title: "DOL Starter Power Diagram",
    description:
      "TSX version of the reference 3-phase motor direct on/off power wiring diagram using a 3-pole breaker, contactor, overload relay, and motor.",
    component: <DOLStarterPowerDiagram />,
  },
};

export default function DiagramShowcase() {
  const [mode, setMode] = useState<DiagramMode>("power");
  const current = diagramContent[mode];

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Electrical Training Platform</p>
        <div className="switcher" role="tablist" aria-label="DOL starter diagrams">
          <button
            type="button"
            className={`switcher-button ${mode === "power" ? "is-active" : ""}`}
            onClick={() => setMode("power")}
            aria-pressed={mode === "power"}
          >
            Power Diagram
          </button>
        </div>
        <h1>{current.title}</h1>
        <p className="description">{current.description}</p>
      </section>

      <section className="diagram-card">{current.component}</section>
    </main>
  );
}
