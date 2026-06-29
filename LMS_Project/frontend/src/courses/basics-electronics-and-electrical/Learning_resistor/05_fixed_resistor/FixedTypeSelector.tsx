"use client";

import type { FixedType, FixedTypeKey } from "./types";

export function FixedTypeSelector({
  fixedTypes,
  selectedKey,
  onTypeChange,
}: {
  fixedTypes: FixedType[];
  selectedKey: FixedTypeKey;
  onTypeChange: (key: FixedTypeKey) => void;
}) {
  return (
    <div className="mb-5 grid gap-2">
      {fixedTypes.map((item) => (
        <button
          key={item.key}
          onClick={() => onTypeChange(item.key)}
          className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${
            selectedKey === item.key
              ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="font-semibold text-slate-900">{item.bn}</p>
          <p className="text-xs text-slate-600">{item.description}</p>
        </button>
      ))}
    </div>
  );
}
