"use client";

import { useState } from "react";

import {
  DC_VOLTAGE_MAX,
  DC_VOLTAGE_MIN,
  DEFAULT_DC_RESISTANCE,
  DEFAULT_DC_VOLTAGE,
  RESISTANCE_MAX,
  RESISTANCE_MIN,
  voltagePresets,
} from "./logic";
import { DcCircuit, DcWaveform } from "./DcVoltageCircuit";
import { Pause, Play, RotateCcw } from "./icons";
import { ControlCard, Measurements, RangeControl, VoltageTypeCard } from "./ui";

function DcControls({
  voltage,
  resistance,
  onVoltageChange,
  onResistanceChange,
  onPlay,
  onPause,
  onReset,
}: {
  voltage: number;
  resistance: number;
  onVoltageChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}) {
  return (
    <ControlCard
      title="Try the DC voltage"
      tone="green"
      description="Adjust the steady DC source and see how the push and current stay stable."
    >
      <RangeControl label="Voltage" unit="V" value={voltage} min={DC_VOLTAGE_MIN} max={DC_VOLTAGE_MAX} step={1} onChange={onVoltageChange} tone="green" />
      <RangeControl label="Resistance" unit="Ohm" value={resistance} min={RESISTANCE_MIN} max={RESISTANCE_MAX} step={1} onChange={onResistanceChange} tone="green" />
      <div className="mt-3 flex flex-wrap gap-2">
        {voltagePresets.map((preset) => (
          <button key={preset} type="button" onClick={() => onVoltageChange(preset)} className="rounded-lg border border-green-200 bg-white px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-50">
            {preset}V
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button type="button" onClick={onPlay} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-green-500 hover:bg-green-50">
          <span className="flex items-center justify-center gap-2"><Play className="h-4 w-4" /> Play</span>
        </button>
        <button type="button" onClick={onPause} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-green-500 hover:bg-green-50">
          <span className="flex items-center justify-center gap-2"><Pause className="h-4 w-4" /> Pause</span>
        </button>
        <button type="button" onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-green-500 hover:bg-green-50">
          <span className="flex items-center justify-center gap-2"><RotateCcw className="h-4 w-4" /> Reset</span>
        </button>
      </div>
    </ControlCard>
  );
}

export function DcVoltageSection({
  dcVoltage,
  dcResistance,
  dcCurrent,
  isPlaying,
  onVoltageChange,
  onResistanceChange,
}: {
  dcVoltage: number;
  dcResistance: number;
  dcCurrent: number;
  isPlaying: boolean;
  onVoltageChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
}) {
  const [isDcPlaying, setIsDcPlaying] = useState(true);

  const dcControls = (
    <DcControls
      voltage={dcVoltage}
      resistance={dcResistance}
      onVoltageChange={onVoltageChange}
      onResistanceChange={onResistanceChange}
      onPlay={() => setIsDcPlaying(true)}
      onPause={() => setIsDcPlaying(false)}
      onReset={() => {
        setIsDcPlaying(true);
        onVoltageChange(DEFAULT_DC_VOLTAGE);
        onResistanceChange(DEFAULT_DC_RESISTANCE);
      }}
    />
  );

  return (
    <VoltageTypeCard
      tone="green"
      number="1"
      title="DC Voltage"
      subtitle="Direct Current"
      description="Voltage stays constant and current flows in one direction."
      preTitle={dcControls}
      circuit={<DcCircuit voltage={dcVoltage} current={dcCurrent} isPlaying={isDcPlaying} />}
      graph={<DcWaveform voltage={dcVoltage} current={dcCurrent} />}
      controls={null}
      measurements={
        <Measurements
          voltageLabel="Voltage"
          voltageValue={`${dcVoltage.toFixed(2)} V`}
          currentLabel="Current"
          currentValue={`${dcCurrent.toFixed(2)} A`}
          observation="The voltage push stays steady, so the current also stays steady with time."
          tone="green"
        />
      }
    />
  );
}
