"use client";

const scriptBlocks = [
  {
    title: "Opening",
    lines: [
      "In this lesson, we will learn what a capacitor is and why it is one of the most important components in electronics.",
      "A capacitor is a component that stores electric charge and electrical energy for a short time.",
      "It is usually made from two conductive plates separated by a dielectric insulating material.",
    ],
  },
  {
    title: "Main Explanation",
    lines: [
      "When we apply voltage across the capacitor, charge starts building on the plates.",
      "One plate becomes more positive and the other plate becomes more negative.",
      "As more charge is stored, the capacitor voltage rises.",
      "Because of that rising capacitor voltage, the charging current gradually becomes smaller.",
      "After enough time in a DC circuit, the capacitor becomes almost fully charged and the current becomes nearly zero.",
    ],
  },
  {
    title: "Core Rules",
    lines: [
      "The first important formula is Q equals C times V.",
      "This means stored charge depends on capacitance and voltage.",
      "The second important formula is E equals one half C V squared.",
      "This tells us the capacitor stores energy in its electric field.",
      "The RC time constant, tau equals R times C, tells us how fast the capacitor charges or discharges.",
    ],
  },
  {
    title: "Applications",
    lines: [
      "Capacitors are used in filter circuits, timing circuits, decoupling circuits, and signal coupling circuits.",
      "In power supplies, capacitors help smooth ripple voltage.",
      "In timing circuits, capacitors create useful delays.",
    ],
  },
  {
    title: "Closing",
    lines: [
      "So the key idea is simple: a capacitor stores charge, stores energy, and changes voltage over time while charging or discharging.",
      "In the next lessons, we will explore charging, discharging, and practical capacitor applications in more detail.",
    ],
  },
];

export default function UdemyScriptNoteEnglishTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Udemy English Script
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Lesson 01 Script: What Is a Capacitor?
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          This version is written as a clean voiceover-style teaching script.
        </p>
      </section>

      {scriptBlocks.map((block) => (
        <section
          key={block.title}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {block.title}
          </h2>
          <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
            {block.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
