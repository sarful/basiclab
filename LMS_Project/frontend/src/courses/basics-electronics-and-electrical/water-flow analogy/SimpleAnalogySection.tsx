"use client";

import { analogyCards } from "./logic";
import { toneTextClass } from "./ui";

export function SimpleAnalogySection() {
  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-black text-blue-700">SIMPLE ANALOGY</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {analogyCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <h3 className={`font-black ${toneTextClass(card.tone)}`}>{card.title}</h3>
            <p className="mt-2 text-sm font-semibold text-slate-700">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SimpleAnalogyLessonBlock() {
  return (
    <section className="rounded-3xl border border-cyan-200 bg-cyan-50/70 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">
            Simple Analogy
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Electricity is like water moving through a pipe
          </h3>
        </div>
        <div className="rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
          Voltage = push, Current = flow, Resistance = blockage
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <strong className="text-slate-950">Voltage:</strong> like the pump pressure
          that starts movement.
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <strong className="text-slate-950">Current:</strong> like the amount of
          water moving through the pipe.
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <strong className="text-slate-950">Resistance:</strong> like the narrow
          part of the pipe that slows flow.
        </div>
      </div>
    </section>
  );
}
