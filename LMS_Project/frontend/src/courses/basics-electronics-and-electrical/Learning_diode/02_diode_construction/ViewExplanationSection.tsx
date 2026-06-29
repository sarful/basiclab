"use client";

import type { LayerView } from "./types";

const VIEW_CONTENT: Record<
  LayerView,
  {
    badge: string;
    title: string;
    bullets: string[];
  }
> = {
  basic: {
    badge: "Structure",
    title: "Material setup",
    bullets: [
      "The diode starts as one P-type block and one N-type block.",
      "No depletion barrier exists until the two regions interact.",
    ],
  },
  doping: {
    badge: "Doping",
    title: "Carrier balance",
    bullets: [
      "P-type material holds majority holes.",
      "N-type material holds majority electrons.",
    ],
  },
  junction: {
    badge: "Junction",
    title: "Barrier starting point",
    bullets: [
      "At the center boundary, opposite carriers begin to recombine.",
      "That removes free carriers and starts the depletion layer.",
    ],
  },
  formation: {
    badge: "Formation",
    title: "Complete diode barrier",
    bullets: [
      "Diffusion and recombination leave fixed ions near the junction.",
      "The electric field and depletion region create one-way diode behavior.",
    ],
  },
};

export function ViewExplanationSection({ view }: { view: LayerView }) {
  const content = VIEW_CONTENT[view];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-emerald-700">
            Teaching Support
          </p>
          <h3 className="mt-2 text-lg font-black text-slate-950">
            {content.title}
          </h3>
        </div>
        <span className="self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-700">
          {content.badge}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {content.bullets.map((bullet) => (
          <div
            key={bullet}
            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
          >
            {bullet}
          </div>
        ))}
      </div>
    </section>
  );
}
