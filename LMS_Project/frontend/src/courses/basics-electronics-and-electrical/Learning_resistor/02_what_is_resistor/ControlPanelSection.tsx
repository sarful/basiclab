"use client";

import { LedSelector } from "./LedSelector";
import { LessonModeSelector } from "./LessonModeSelector";
import { PowerRatingSelector } from "./PowerRatingSelector";
import { RecommendationCard } from "./RecommendationCard";
import { ResistanceSelector } from "./ResistanceSelector";
import { VoltageSlider } from "./VoltageSlider";
import type { ResistorLessonMode } from "./types";

export function ControlPanelSection({
  mode,
  voltage,
  outputVoltage,
  voltageDrop,
  ledVoltageDrop,
  resistance,
  rating,
  ledId,
  selectedLedLabel,
  selectedPackageLabel,
  statusMessage,
  recommendedLabel,
  onModeChange,
  onVoltageChange,
  onResistanceChange,
  onRatingChange,
  onLedChange,
}: {
  mode: ResistorLessonMode;
  voltage: number;
  outputVoltage: number;
  voltageDrop: number;
  ledVoltageDrop: number;
  resistance: number;
  rating: number;
  ledId: string;
  selectedLedLabel: string;
  selectedPackageLabel: string;
  statusMessage: string;
  recommendedLabel: string;
  onModeChange: (value: ResistorLessonMode) => void;
  onVoltageChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
  onRatingChange: (value: number) => void;
  onLedChange: (value: string) => void;
}) {
  const isLedMode = mode === "led";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <LessonModeSelector mode={mode} onModeChange={onModeChange} />
      <VoltageSlider voltage={voltage} onVoltageChange={onVoltageChange} />
      <ResistanceSelector
        resistance={resistance}
        onResistanceChange={onResistanceChange}
      />
      {isLedMode ? (
        <LedSelector ledId={ledId} onLedChange={onLedChange} />
      ) : null}
      <PowerRatingSelector
        rating={rating}
        selectedPackageLabel={selectedPackageLabel}
        onRatingChange={onRatingChange}
      />
      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <p className="font-bold text-slate-900">
          {isLedMode ? "Series Voltage Split" : "Basic Voltage Drop"}
        </p>
        <p className="mt-2 text-slate-700">
          Input Voltage: <b>{voltage}V</b>
        </p>
        {isLedMode ? (
          <p className="text-slate-700">
            {selectedLedLabel}: <b>{ledVoltageDrop}V</b> forward drop
          </p>
        ) : null}
        <p className="text-slate-700">
          Resistor Drop: <b>{voltageDrop}V</b>
        </p>
        <p className="text-slate-700">
          Output Voltage: <b>{outputVoltage}V</b>{" "}
          {isLedMode ? "after resistor + LED return" : "after the resistor"}
        </p>
      </div>
      <RecommendationCard
        mode={mode}
        statusMessage={statusMessage}
        recommendedLabel={recommendedLabel}
        voltageDrop={voltageDrop}
        ledVoltageDrop={ledVoltageDrop}
        selectedLedLabel={selectedLedLabel}
      />
    </div>
  );
}
