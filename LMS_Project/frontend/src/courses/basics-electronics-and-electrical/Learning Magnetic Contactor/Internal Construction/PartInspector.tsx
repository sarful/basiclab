"use client";

import React from "react";

export type ContactorPartKey =
  | "cover"
  | "coil"
  | "ironCore"
  | "armature"
  | "returnSpring"
  | "fixedContacts"
  | "movingContacts"
  | "contactBridge"
  | "auxiliaryContacts"
  | "magneticField";

export type PartInspectorItem = {
  key: ContactorPartKey;
  title: string;
  subtitle?: string;
  functionText: string;
  stateText?: string;
  learningNote?: string;
  terminals?: string[];
};

export interface PartInspectorProps {
  selectedPart?: ContactorPartKey | null;
  energized?: boolean;
  onSelectPart?: (part: ContactorPartKey) => void;
  className?: string;
}

const partInfo: Record<ContactorPartKey, PartInspectorItem> = {
  cover: {
    key: "cover",
    title: "Protective Cover",
    subtitle: "Outer safety housing",
    functionText:
      "Protects the internal coil, armature, spring, and contacts from dust, touch, and mechanical damage.",
    stateText: "Used in normal operation; removed or transparent in cutaway learning mode.",
    learningNote: "In real contactors, never remove the cover while the circuit is live.",
  },
  coil: {
    key: "coil",
    title: "Coil Assembly",
    subtitle: "A1 / A2 electromagnetic coil",
    functionText:
      "When voltage is applied to A1 and A2, the coil produces a magnetic field that pulls the armature.",
    stateText: "OFF: no magnetic pull. ON: magnetic field is generated.",
    learningNote: "The coil is the control part of the contactor.",
    terminals: ["A1", "A2"],
  },
  ironCore: {
    key: "ironCore",
    title: "Iron Core",
    subtitle: "Magnetic flux path",
    functionText:
      "Concentrates the magnetic field created by the coil and improves the pulling force on the armature.",
    stateText: "Becomes magnetized only when the coil is energized.",
    learningNote: "The core makes the electromagnetic action stronger and faster.",
  },
  armature: {
    key: "armature",
    title: "Moving Armature",
    subtitle: "Magnetic moving plate",
    functionText:
      "Moves toward the iron core when the coil is energized and returns back when the coil turns off.",
    stateText: "OFF: released. ON: pulled toward the core.",
    learningNote: "Armature movement changes the contact condition.",
  },
  returnSpring: {
    key: "returnSpring",
    title: "Return Spring",
    subtitle: "Mechanical reset part",
    functionText:
      "Pushes the armature and moving contacts back to their normal position after the coil is de-energized.",
    stateText: "Compressed when energized; extended when de-energized.",
    learningNote: "The spring gives the contactor its default OFF position.",
  },
  fixedContacts: {
    key: "fixedContacts",
    title: "Fixed Contacts",
    subtitle: "Stationary power terminals",
    functionText:
      "Stationary contact points connected to the line and load terminals of the contactor.",
    stateText: "They do not move; moving contacts touch them to complete the circuit.",
    learningNote: "Main fixed contacts are usually connected with L1/L2/L3 and T1/T2/T3.",
    terminals: ["L1", "L2", "L3", "T1", "T2", "T3"],
  },
  movingContacts: {
    key: "movingContacts",
    title: "Moving Contacts",
    subtitle: "Contact carrier system",
    functionText:
      "Moves with the armature and physically closes or opens the main power path.",
    stateText: "OFF: separated from fixed contacts. ON: pressed against fixed contacts.",
    learningNote: "This is where the main switching action happens.",
  },
  contactBridge: {
    key: "contactBridge",
    title: "Contact Bridge",
    subtitle: "Conductive bridge link",
    functionText:
      "Connects each input fixed contact to its matching output fixed contact when the contactor closes.",
    stateText: "Raised/open when OFF; lowered/closed when ON.",
    learningNote: "The bridge carries load current, so it is made from conductive metal.",
  },
  auxiliaryContacts: {
    key: "auxiliaryContacts",
    title: "Auxiliary Contacts",
    subtitle: "NO / NC control contacts",
    functionText:
      "Provides extra control signals for holding circuits, indicator lamps, interlocks, and PLC inputs.",
    stateText: "NO closes when energized; NC opens when energized.",
    learningNote: "Common labels are 13-14 for NO and 21-22 for NC.",
    terminals: ["13", "14", "21", "22"],
  },
  magneticField: {
    key: "magneticField",
    title: "Magnetic Field Lines",
    subtitle: "Electromagnetic force visualizer",
    functionText:
      "Shows the invisible magnetic field created around the coil and iron core during energizing.",
    stateText: "Visible and strongest when the coil is ON.",
    learningNote: "This field is the reason the armature gets pulled inward.",
  },
};

const partOrder: ContactorPartKey[] = [
  "coil",
  "ironCore",
  "armature",
  "returnSpring",
  "fixedContacts",
  "movingContacts",
  "contactBridge",
  "auxiliaryContacts",
  "magneticField",
  "cover",
];

export default function PartInspector({
  selectedPart = "coil",
  energized = false,
  onSelectPart,
  className = "",
}: PartInspectorProps) {
  const activeKey = selectedPart ?? "coil";
  const active = partInfo[activeKey];

  return (
    <aside
      className={`w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Part Inspector
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{active.title}</h2>
          {active.subtitle && (
            <p className="text-sm text-slate-500">{active.subtitle}</p>
          )}
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            energized
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {energized ? "COIL ON" : "COIL OFF"}
        </div>
      </div>

      <div className="space-y-3">
        <section className="rounded-xl bg-slate-50 p-3">
          <h3 className="text-sm font-bold text-slate-800">Function</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{active.functionText}</p>
        </section>

        {active.stateText && (
          <section className="rounded-xl bg-blue-50 p-3">
            <h3 className="text-sm font-bold text-blue-900">Operation State</h3>
            <p className="mt-1 text-sm leading-6 text-blue-800">{active.stateText}</p>
          </section>
        )}

        {active.terminals && active.terminals.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-bold text-slate-800">Related Terminals</h3>
            <div className="flex flex-wrap gap-2">
              {active.terminals.map((terminal) => (
                <span
                  key={terminal}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700"
                >
                  {terminal}
                </span>
              ))}
            </div>
          </section>
        )}

        {active.learningNote && (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <h3 className="text-sm font-bold text-amber-900">Learning Note</h3>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              {active.learningNote}
            </p>
          </section>
        )}
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4">
        <h3 className="mb-2 text-sm font-bold text-slate-800">Select Part</h3>
        <div className="grid grid-cols-2 gap-2">
          {partOrder.map((key) => {
            const item = partInfo[key];
            const isActive = key === activeKey;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectPart?.(key)}
                className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
