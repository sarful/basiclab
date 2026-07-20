"use client";

import React from "react";

export interface LegendPanelProps {
  className?: string;
}

export default function LegendPanel({
  className = "",
}: LegendPanelProps) {
  const legendItems = [
    {
      color: "#ef4444",
      label: "L1 Phase",
      description: "Phase 1 power line",
    },
    {
      color: "#eab308",
      label: "L2 Phase",
      description: "Phase 2 power line",
    },
    {
      color: "#2563eb",
      label: "L3 Phase",
      description: "Phase 3 power line",
    },
    {
      color: "#22c55e",
      label: "Current Flow",
      description: "Electrical current is flowing",
    },
    {
      color: "#38bdf8",
      label: "Magnetic Field",
      description: "Coil-generated magnetic flux",
    },
    {
      color: "#f59e0b",
      label: "Contact Point",
      description: "Electrical contact terminal",
    },
    {
      color: "#64748b",
      label: "Iron Core",
      description: "Magnetic core structure",
    },
    {
      color: "#fb923c",
      label: "Spring",
      description: "Return spring mechanism",
    },
  ];

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">
          Legend
        </h3>
        <p className="text-sm text-slate-500">
          Component and color reference
        </p>
      </div>

      <div className="space-y-3">
        {legendItems.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3"
          >
            <div
              className="mt-1 h-4 w-4 rounded-sm border border-slate-300"
              style={{ backgroundColor: item.color }}
            />

            <div>
              <div className="text-sm font-semibold text-slate-800">
                {item.label}
              </div>

              <div className="text-xs text-slate-500">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-3">
        <h4 className="mb-2 text-sm font-bold text-slate-700">
          Contact States
        </h4>

        <div className="space-y-1 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-green-600">
              NO Closed
            </span>{" "}
            = Coil Energized
          </div>

          <div>
            <span className="font-semibold text-red-600">
              NO Open
            </span>{" "}
            = Coil OFF
          </div>

          <div>
            <span className="font-semibold text-green-600">
              NC Closed
            </span>{" "}
            = Coil OFF
          </div>

          <div>
            <span className="font-semibold text-red-600">
              NC Open
            </span>{" "}
            = Coil Energized
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-blue-50 p-3 text-xs text-blue-800">
        <strong>Operation:</strong> A1-A2 coil energizes → magnetic field
        forms → armature moves → main contacts close → motor receives power.
      </div>
    </div>
  );
}