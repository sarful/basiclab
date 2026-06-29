"use client";

export function HowToReadCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">How to Read</h2>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Step 1</p>
          <p>The first two or three bands are the significant digits.</p>
        </div>
        <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
          <p className="font-semibold text-yellow-700">Step 2</p>
          <p>The multiplier band sets the decimal scale or number of zeros.</p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Step 3</p>
          <p>The tolerance band shows how much the real value may vary from nominal.</p>
        </div>
      </div>
    </div>
  );
}
