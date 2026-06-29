export function KeyDifferenceCard() {
  return (
    <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
      <p className="font-semibold text-purple-700">Key Difference</p>
      <p className="mt-1">
        Polarized capacitors are mainly for DC filtering and need correct polarity.
        Non-polarized capacitors work well with AC and high-frequency signals.
      </p>
    </div>
  );
}
