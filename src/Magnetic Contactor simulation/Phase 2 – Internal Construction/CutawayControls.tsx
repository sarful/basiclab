"use client";

import React from "react";

export interface CutawayControlsProps {
  energized?: boolean;
  coverVisible?: boolean;
  labelsVisible?: boolean;
  magneticFieldVisible?: boolean;
  explodedView?: boolean;
  currentFlowVisible?: boolean;
  onEnergizedChange?: (value: boolean) => void;
  onCoverVisibleChange?: (value: boolean) => void;
  onLabelsVisibleChange?: (value: boolean) => void;
  onMagneticFieldVisibleChange?: (value: boolean) => void;
  onExplodedViewChange?: (value: boolean) => void;
  onCurrentFlowVisibleChange?: (value: boolean) => void;
  className?: string;
}

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (value: boolean) => void;
};

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40"
      aria-pressed={checked}
    >
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="block text-xs text-slate-500">{description}</span>
      </span>

      <span
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

export default function CutawayControls({
  energized = false,
  coverVisible = false,
  labelsVisible = true,
  magneticFieldVisible = true,
  explodedView = false,
  currentFlowVisible = false,
  onEnergizedChange,
  onCoverVisibleChange,
  onLabelsVisibleChange,
  onMagneticFieldVisibleChange,
  onExplodedViewChange,
  onCurrentFlowVisibleChange,
  className = "",
}: CutawayControlsProps) {
  return (
    <aside
      className={`w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm ${className}`}
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Cutaway Controls</h2>
        <p className="mt-1 text-sm text-slate-500">
          Control the internal construction view of the magnetic contactor.
        </p>
      </div>

      <div className="space-y-3">
        <ToggleRow
          label="Energize Coil"
          description="Turns A1-A2 coil ON/OFF"
          checked={energized}
          onChange={onEnergizedChange}
        />

        <ToggleRow
          label="Show Cover"
          description="Display or hide the outer contactor cover"
          checked={coverVisible}
          onChange={onCoverVisibleChange}
        />

        <ToggleRow
          label="Show Labels"
          description="Display part names and leader lines"
          checked={labelsVisible}
          onChange={onLabelsVisibleChange}
        />

        <ToggleRow
          label="Magnetic Field"
          description="Visualize the field around coil and core"
          checked={magneticFieldVisible}
          onChange={onMagneticFieldVisibleChange}
        />

        <ToggleRow
          label="Exploded View"
          description="Separate parts for easier learning"
          checked={explodedView}
          onChange={onExplodedViewChange}
        />

        <ToggleRow
          label="Current Flow"
          description="Animate current through main contacts"
          checked={currentFlowVisible}
          onChange={onCurrentFlowVisibleChange}
        />
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Status</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              energized
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {energized ? "COIL ON" : "COIL OFF"}
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {energized
            ? "The coil creates magnetism, pulls the armature, closes NO contacts, and opens NC contacts."
            : "The return spring keeps the armature released, NO contacts open, and NC contacts closed."}
        </p>
      </div>
    </aside>
  );
}
