"use client";

import type { ProbeTarget } from "./types";

const PROBE_COPY: Record<
  ProbeTarget,
  {
    tag: string;
    title: string;
    summary: string;
    detail: string;
  }
> = {
  anode: {
    tag: "Terminal Check",
    title: "Anode Terminal",
    summary: "This is the P-side external connection of the diode.",
    detail:
      "In practical circuits, conventional current enters the diode through the anode when the device is forward biased.",
  },
  cathode: {
    tag: "Terminal Check",
    title: "Cathode Terminal",
    summary: "This is the N-side external connection of the diode.",
    detail:
      "The cathode is the side where conventional current exits during forward conduction and where reverse blocking is referenced.",
  },
  "p-region": {
    tag: "Material Zone",
    title: "P-Type Region",
    summary: "The P-side contains holes as majority carriers.",
    detail:
      "Acceptor doping creates many mobile holes, so the density shading here emphasizes positive carrier concentration.",
  },
  "n-region": {
    tag: "Material Zone",
    title: "N-Type Region",
    summary: "The N-side contains electrons as majority carriers.",
    detail:
      "Donor doping creates many free electrons, so the density shading here emphasizes negative carrier concentration.",
  },
  "pn-junction": {
    tag: "Boundary Check",
    title: "PN Junction",
    summary: "This boundary is where the P-type and N-type materials meet.",
    detail:
      "Carrier diffusion starts here, recombination removes mobile charge near the center, and the barrier region begins forming.",
  },
  "depletion-region": {
    tag: "Barrier Zone",
    title: "Depletion Region",
    summary: "This center zone loses mobile carriers and becomes the diode barrier.",
    detail:
      "Fixed ions remain after recombination, creating the electric field that opposes further free diffusion across the junction.",
  },
};

export default function DiodeProbeReadout({
  selectedProbe,
}: {
  selectedProbe: ProbeTarget;
}) {
  const probe = PROBE_COPY[selectedProbe];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-emerald-700">
            Probe Readout
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-950">{probe.title}</h3>
        </div>
        <span className="self-start rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-800">
          {probe.tag}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Quick Check
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
            {probe.summary}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Teaching Note
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{probe.detail}</p>
        </div>
      </div>
    </section>
  );
}
