"use client";

export function KnowledgeSection() {
  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">
          What Is a Parallel Resistor Circuit?
        </h2>
        <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
          <p className="font-semibold text-purple-700">Definition</p>
          <p className="mt-1">
            A parallel resistor circuit connects multiple resistors across the same
            two supply nodes in separate current paths.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Main Rule</p>
          <p className="mt-1">
            In a parallel circuit, each resistor has the same voltage, but current
            divides based on resistance.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
            <p className="font-semibold text-purple-700">
              Adding a branch reduces equivalent resistance
            </p>
            <p className="mt-1">
              When a new resistor branch is added in parallel, the equivalent
              resistance becomes smaller.
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
            <p className="font-semibold text-green-700">
              Lower resistance gets more current
            </p>
            <p className="mt-1">
              The branch with lower resistance carries more current than the
              higher-resistance branches.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">
              One open branch does not stop the whole circuit
            </p>
            <p className="mt-1">
              If one branch opens, the other branches can still continue to carry
              current.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
