"use client";

import { InfoIcon } from "./icons";
import { ConceptCard, IndustrialHeader } from "./ui";

export function BeginnerExplanationSection() {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <IndustrialHeader
        code="LEARN-01"
        title="Beginner Explanation"
        subtitle="Simple meaning for absolute beginners."
        icon={<InfoIcon className="h-5 w-5 text-cyan-700" />}
      />
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ConceptCard title="Current" detail="Current means how fast electric charge moves through a wire or circuit." />
        <ConceptCard title="Unit" detail="Current is measured in ampere (A). We use the symbol I in formulas." />
        <ConceptCard title="Closed Path" detail="Current flows only when the circuit path is complete from one terminal to the other." />
      </div>
    </section>
  );
}
