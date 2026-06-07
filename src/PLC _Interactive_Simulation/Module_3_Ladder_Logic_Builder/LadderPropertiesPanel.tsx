"use client";

import React from "react";
import type { LadderToolType } from "./LadderToolbar";

export interface LadderElementProperties {
  id?: string;
  type?: LadderToolType;
  tag?: string;
  address?: string;
  description?: string;
  preset?: number;
  currentValue?: number;
  enabled?: boolean;
}

export interface LadderPropertiesPanelProps {
  selectedElement?: LadderElementProperties | null;
  onChange?: (props: LadderElementProperties) => void;
  onDelete?: () => void;
}

export default function LadderPropertiesPanel({
  selectedElement = null,
  onChange,
  onDelete,
}: LadderPropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Properties</h2>
        <p className="mt-2 text-sm text-slate-500">
          Select a ladder element to edit its properties.
        </p>
      </div>
    );
  }

  const update = (key: keyof LadderElementProperties, value: string | number | boolean) => {
    onChange?.({
      ...selectedElement,
      [key]: value,
    });
  };

  const isTimerOrCounter =
    selectedElement.type === "TIMER_TON" ||
    selectedElement.type === "TIMER_TOF" ||
    selectedElement.type === "COUNTER_CTU" ||
    selectedElement.type === "COUNTER_CTD";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">Properties</h2>
        <p className="text-sm text-slate-500">Edit selected ladder element</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Element Type
          </label>
          <input
            value={selectedElement.type ?? ""}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Tag Name
          </label>
          <input
            value={selectedElement.tag ?? ""}
            onChange={(e) => update("tag", e.target.value)}
            placeholder="Start_Button"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            PLC Address
          </label>
          <input
            value={selectedElement.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
            placeholder="I0.0 / Q0.0 / M0.0"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Description
          </label>
          <textarea
            value={selectedElement.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe element function..."
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>

        {isTimerOrCounter && (
          <>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Preset Value
              </label>
              <input
                type="number"
                value={selectedElement.preset ?? 0}
                onChange={(e) => update("preset", Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Current Value
              </label>
              <input
                type="number"
                value={selectedElement.currentValue ?? 0}
                onChange={(e) => update("currentValue", Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </>
        )}

        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-sm font-semibold text-slate-700">Enabled</span>
          <input
            type="checkbox"
            checked={selectedElement.enabled ?? true}
            onChange={(e) => update("enabled", e.target.checked)}
            className="h-4 w-4"
          />
        </label>

        <button
          onClick={onDelete}
          className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
        >
          Delete Element
        </button>
      </div>
    </div>
  );
}