"use client";

import { InfoIcon } from "./icons";
import { ConceptCard, IndustrialHeader } from "./ui";

export function BeginnerSummarySection({ definition }: { definition: string }) {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <IndustrialHeader
        code="Summary"
        title="Beginner summary"
        subtitle="Keep these basic ideas in mind while you explore the lesson."
        icon={<InfoIcon className="h-5 w-5 text-cyan-700" />}
      />
      <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-900">
        {definition}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <ConceptCard title="Charge" detail="Electric charge is a property of particles like electrons and protons." />
        <ConceptCard title="Electron" detail="Electron is a negatively charged particle that can move through a conductor." />
        <ConceptCard title="Voltage" detail="Voltage is the electrical pressure that pushes charges." />
        <ConceptCard title="Current" detail="Current is the rate of charge flow in a circuit." />
      </div>
    </section>
  );
}
