"use client";

import { useState } from "react";

import {
  AC_PEAK_MAX,
  AC_PEAK_MIN,
  DEFAULT_AC_FREQUENCY,
  DEFAULT_AC_PEAK_VOLTAGE,
  DEFAULT_AC_RESISTANCE,
  FREQUENCY_MAX,
  FREQUENCY_MIN,
  RESISTANCE_MAX,
  RESISTANCE_MIN,
} from "./logic";
import { AcCircuit, AcWaveform } from "./AcVoltageCircuit";
import { Pause, Play, RotateCcw } from "./icons";
import { ControlCard, Measurements, RangeControl, VoltageTypeCard } from "./ui";

function AcControls({
  peakVoltage,
  frequency,
  resistance,
  onPeakVoltageChange,
  onFrequencyChange,
  onResistanceChange,
  onPlay,
  onPause,
  onReset,
}: {
  peakVoltage: number;
  frequency: number;
  resistance: number;
  onPeakVoltageChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}) {
  return (
    <ControlCard
      title="Try the AC signal"
      tone="blue"
      description="Change the peak voltage, frequency, and resistance to see how AC keeps alternating."
    >
      <RangeControl label="Peak Voltage" unit="V" value={peakVoltage} min={AC_PEAK_MIN} max={AC_PEAK_MAX} step={1} onChange={onPeakVoltageChange} tone="blue" />
      <RangeControl label="Frequency" unit="Hz" value={frequency} min={FREQUENCY_MIN} max={FREQUENCY_MAX} step={0.5} onChange={onFrequencyChange} tone="blue" />
      <RangeControl label="Resistance" unit="Ohm" value={resistance} min={RESISTANCE_MIN} max={RESISTANCE_MAX} step={1} onChange={onResistanceChange} tone="blue" />
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button type="button" onClick={onPlay} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-2"><Play className="h-4 w-4" /> Play</span>
        </button>
        <button type="button" onClick={onPause} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-2"><Pause className="h-4 w-4" /> Pause</span>
        </button>
        <button type="button" onClick={onReset} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-2"><RotateCcw className="h-4 w-4" /> Reset</span>
        </button>
      </div>
    </ControlCard>
  );
}

export function AcVoltageSection({
  acPeakVoltage,
  acFrequency,
  acResistance,
  acRmsVoltage,
  acRmsCurrent,
  isPlaying,
  onPeakVoltageChange,
  onFrequencyChange,
  onResistanceChange,
}: {
  acPeakVoltage: number;
  acFrequency: number;
  acResistance: number;
  acRmsVoltage: number;
  acRmsCurrent: number;
  isPlaying: boolean;
  onPeakVoltageChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
  onResistanceChange: (value: number) => void;
}) {
  const [isAcPlaying, setIsAcPlaying] = useState(true);

  const acControls = (
    <AcControls
      peakVoltage={acPeakVoltage}
      frequency={acFrequency}
      resistance={acResistance}
      onPeakVoltageChange={onPeakVoltageChange}
      onFrequencyChange={onFrequencyChange}
      onResistanceChange={onResistanceChange}
      onPlay={() => setIsAcPlaying(true)}
      onPause={() => setIsAcPlaying(false)}
      onReset={() => {
        setIsAcPlaying(true);
        onPeakVoltageChange(DEFAULT_AC_PEAK_VOLTAGE);
        onFrequencyChange(DEFAULT_AC_FREQUENCY);
        onResistanceChange(DEFAULT_AC_RESISTANCE);
      }}
    />
  );

  return (
    <VoltageTypeCard
      tone="blue"
      number="2"
      title="AC Voltage"
      subtitle="Alternating Current"
      description="Voltage changes direction periodically and creates an alternating current pattern."
      preTitle={acControls}
      circuit={<AcCircuit peakVoltage={acPeakVoltage} frequency={acFrequency} current={acRmsCurrent} isPlaying={isAcPlaying} />}
      graph={<AcWaveform peakVoltage={acPeakVoltage} frequency={acFrequency} resistance={acResistance} />}
      controls={null}
      measurements={
        <Measurements
          voltageLabel="Voltage RMS"
          voltageValue={`${acRmsVoltage.toFixed(2)} V`}
          currentLabel="Current RMS"
          currentValue={`${acRmsCurrent.toFixed(2)} A`}
          observation="The voltage push keeps changing with time, so the current pattern also keeps changing."
          tone="blue"
        />
      }
    />
  );
}
