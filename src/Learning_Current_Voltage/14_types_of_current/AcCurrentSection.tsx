"use client";

import { useState } from "react";

import {
  DEFAULT_AC_PEAK_CURRENT,
  DEFAULT_FREQUENCY,
  MAX_AC_PEAK_CURRENT,
  MAX_FREQUENCY,
  MIN_AC_PEAK_CURRENT,
  MIN_FREQUENCY,
} from "./logic";
import { Pause, Play, RotateCcw } from "./icons";
import { AcCurrentCircuit, AcCurrentWaveform } from "./AcCurrentCircuit";
import { ControlCard, CurrentTypeCard, Measurements, RangeControl } from "./ui";

export function AcCurrentSection({
  acPeakCurrent,
  acRmsCurrent,
  acStrength,
  frequency,
  onAcPeakCurrentChange,
  onFrequencyChange,
}: {
  acPeakCurrent: number;
  acRmsCurrent: number;
  acStrength: number;
  frequency: number;
  onAcPeakCurrentChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
}) {
  const [isAcPlaying, setIsAcPlaying] = useState(true);

  const acControls = (
    <ControlCard
      title="Try the AC signal"
      tone="blue"
      description="Change the peak current and frequency to see how AC keeps alternating."
    >
      <RangeControl
        label="Peak Current"
        unit="A"
        value={acPeakCurrent}
        min={MIN_AC_PEAK_CURRENT}
        max={MAX_AC_PEAK_CURRENT}
        step={0.1}
        onChange={onAcPeakCurrentChange}
        tone="blue"
      />
      <RangeControl
        label="Frequency"
        unit="Hz"
        value={frequency}
        min={MIN_FREQUENCY}
        max={MAX_FREQUENCY}
        step={0.5}
        onChange={onFrequencyChange}
        tone="blue"
      />
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button type="button" onClick={() => setIsAcPlaying(true)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-2"><Play className="h-4 w-4" /> Play</span>
        </button>
        <button type="button" onClick={() => setIsAcPlaying(false)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50">
          <span className="flex items-center justify-center gap-2"><Pause className="h-4 w-4" /> Pause</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAcPlaying(true);
            onAcPeakCurrentChange(DEFAULT_AC_PEAK_CURRENT);
            onFrequencyChange(DEFAULT_FREQUENCY);
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50"
        >
          <span className="flex items-center justify-center gap-2"><RotateCcw className="h-4 w-4" /> Reset</span>
        </button>
      </div>
    </ControlCard>
  );

  return (
    <CurrentTypeCard
      tone="blue"
      number="2"
      title="AC Current"
      subtitle="Alternating Current"
      description="Current periodically changes direction."
      preTitle={acControls}
      circuit={<AcCurrentCircuit peakCurrent={acPeakCurrent} frequency={frequency} isPlaying={isAcPlaying} />}
      graph={<AcCurrentWaveform peakCurrent={acPeakCurrent} frequency={frequency} />}
      controls={null}
      measurements={
        <Measurements
          currentLabel="Current RMS"
          currentValue={`${acRmsCurrent.toFixed(2)} A`}
          direction="Alternating Direction"
          observation="AC current changes direction again and again based on its frequency."
          strength={acStrength}
          tone="blue"
        />
      }
    />
  );
}
