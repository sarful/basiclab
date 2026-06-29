import { Info } from "lucide-react";

export function ExplanationSection() {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <Info className="h-5 w-5 text-cyan-700" />
        </div>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Summary
          </div>
          <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-slate-950">
            Beginner summary
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep these quick ideas in mind while you compare AC and DC on the
            screen.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm leading-7 text-cyan-900">
        DC stays steady in one direction. AC changes direction again and again.
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">DC Basics</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Direct current flows one way only. Batteries are a common DC source.
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">AC Basics</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Alternating current changes direction back and forth. Home wall power
            is the most common AC example.
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Key Difference</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            DC is steady and one-way. AC varies with time and reverses direction
            again and again.
          </p>
        </article>
      </div>
    </section>
  );
}
