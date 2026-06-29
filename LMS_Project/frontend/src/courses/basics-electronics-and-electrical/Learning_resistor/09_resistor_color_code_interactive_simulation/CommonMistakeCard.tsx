"use client";

export function CommonMistakeCard({
  firstDigitValue,
}: {
  firstDigitValue: number;
}) {
  const valid = firstDigitValue !== 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Common Mistake Warning</h2>
      <div
        className={`rounded-2xl p-4 text-sm ring-1 ${
          valid
            ? "bg-green-50 text-green-700 ring-green-100"
            : "bg-red-50 text-red-700 ring-red-100"
        }`}
      >
        <p className="font-bold">{valid ? "Band selection looks valid" : "Invalid first band"}</p>
        <p className="mt-1">
          {valid
            ? "The first band is non-zero, so the leading value is readable."
            : "The first digit band should not be black because a leading zero causes confusion."}
        </p>
      </div>
    </div>
  );
}
