"use client";

export default function DiodeTypesEmptyState() {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-rose-600">No Match</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">No diode types matched the current filter.</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">Try a different search term or switch the category back to All.</p>
    </section>
  );
}
