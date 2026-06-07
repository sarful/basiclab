"use client";

import { formatNumber, formatResistance } from "./logic";
import type { LedOption } from "./types";

export function LedSelectorSection({
  selectedLed,
  ledOptions,
  ledStatusLabel,
  ledStatusTone,
  ledStatusBg,
  ledStatusMessage,
  ledSupplyVoltage,
  requiredLedResistor,
  roundedLedResistor,
  onLedChange,
}: {
  selectedLed: LedOption;
  ledOptions: LedOption[];
  ledStatusLabel: string;
  ledStatusTone: string;
  ledStatusBg: string;
  ledStatusMessage: string;
  ledSupplyVoltage: number;
  requiredLedResistor: number;
  roundedLedResistor: number;
  onLedChange: (led: LedOption) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">LED Color & Safe Current</h2>
          <p className="text-sm text-slate-600">Select LED color to update the circuit color, voltage drop, safe current, and warning state.</p>
        </div>
        <div className={`rounded-2xl px-4 py-3 ${ledStatusBg}`}>
          <p className={`text-sm font-bold ${ledStatusTone}`}>
            {selectedLed.emoji} {selectedLed.label}: {ledStatusLabel}
          </p>
          <p className="text-xs text-slate-700">{ledStatusMessage}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {ledOptions.map((led) => (
          <button
            key={led.color}
            onClick={() => onLedChange(led)}
            className={`rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${led.buttonClass} ${selectedLed.color === led.color ? "ring-2 ring-blue-500" : ""}`}
          >
            <p className="text-lg font-bold">
              {led.emoji} {led.label}
            </p>
            <p className="mt-1 text-sm text-slate-700">Vf: {led.ledDrop}V</p>
            <p className="text-sm font-semibold text-slate-900">Safe current: {led.safeCurrentMa}mA</p>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
        <p className="font-semibold text-slate-900">For the selected {selectedLed.label} with live supply voltage {formatNumber(ledSupplyVoltage, 2)}V</p>
        {ledSupplyVoltage <= selectedLed.ledDrop ? (
          <p className="text-red-600">Supply voltage is too low for this LED to turn on properly.</p>
        ) : (
          <p>
            R = (Vs - Vled) / I = ({formatNumber(ledSupplyVoltage, 2)} - {selectedLed.ledDrop}) / {selectedLed.safeCurrentMa / 1000} = {formatNumber(requiredLedResistor, 0)}Ω
            <br />
            Nearest standard resistor: <b>{formatResistance(roundedLedResistor)}</b>
          </p>
        )}
      </div>
    </div>
  );
}
