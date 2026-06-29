"use client";

import { SeriesCircuitVisual } from "./SeriesCircuitVisual";
import { ControlPanelSection } from "./ControlPanelSection";
import type { ResistorItem } from "./types";

export function SeriesCircuitVisualSection({
  supplyVoltage,
  resistors,
  onSupplyVoltageChange,
  onUpdateResistor,
  onAddResistor,
  onRemoveResistor,
  onResetCircuit,
}: {
  supplyVoltage: number;
  resistors: ResistorItem[];
  onSupplyVoltageChange: (value: number) => void;
  onUpdateResistor: (id: number, value: number) => void;
  onAddResistor: () => void;
  onRemoveResistor: (id: number) => void;
  onResetCircuit: () => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ControlPanelSection
        supplyVoltage={supplyVoltage}
        resistors={resistors}
        onSupplyVoltageChange={onSupplyVoltageChange}
        onUpdateResistor={onUpdateResistor}
        onAddResistor={onAddResistor}
        onRemoveResistor={onRemoveResistor}
        onResetCircuit={onResetCircuit}
      />

      <div className="lg:col-span-2">
        <SeriesCircuitVisual supplyVoltage={supplyVoltage} resistors={resistors} />
      </div>
    </div>
  );
}
