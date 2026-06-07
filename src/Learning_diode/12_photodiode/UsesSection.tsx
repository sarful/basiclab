"use client";

export function UsesSection() {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-black">Use</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 sm:text-base">
        <li>Light sensor</li>
        <li>Remote control receiver</li>
        <li>Optical communication</li>
        <li>Light meter and automation system</li>
      </ul>
    </section>
  );
}
