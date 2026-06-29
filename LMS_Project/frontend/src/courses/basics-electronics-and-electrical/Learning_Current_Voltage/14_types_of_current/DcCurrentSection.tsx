"use client";

import { useState } from "react";

import { DEFAULT_DC_CURRENT, MAX_DC_CURRENT, MIN_DC_CURRENT } from "./logic";
import { Pause, Play, RotateCcw } from "./icons";
import { DcCurrentCircuit, DcCurrentWaveform } from "./DcCurrentCircuit";
import { ControlCard, CurrentTypeCard, Measurements, RangeControl } from "./ui";

export function DcCurrentSection({
  dcCurrent,
  dcStrength,
  onDcCurrentChange,
}: {
  dcCurrent: number;
  dcStrength: number;
  onDcCurrentChange: (value: number) => void;
}) {
  const [isDcPlaying, setIsDcPlaying] = useState(true);

  const dcControls = (
    <ControlCard
      title="Try the DC current"
      tone="green"
      description="Adjust the DC value and watch how the flow stays steady in one direction."
    >
      <RangeControl
        label="Current"
        unit="A"
        value={dcCurrent}
        min={MIN_DC_CURRENT}
        max={MAX_DC_CURRENT}
        step={0.1}
        onChange={onDcCurrentChange}
        tone="green"
      />
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button type="button" onClick={() => setIsDcPlaying(true)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-green-500 hover:bg-green-50">
          <span className="flex items-center justify-center gap-2"><Play className="h-4 w-4" /> Play</span>
        </button>
        <button type="button" onClick={() => setIsDcPlaying(false)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-green-500 hover:bg-green-50">
          <span className="flex items-center justify-center gap-2"><Pause className="h-4 w-4" /> Pause</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setIsDcPlaying(true);
            onDcCurrentChange(DEFAULT_DC_CURRENT);
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-green-500 hover:bg-green-50"
        >
          <span className="flex items-center justify-center gap-2"><RotateCcw className="h-4 w-4" /> Reset</span>
        </button>
      </div>
    </ControlCard>
  );

  return (
    <CurrentTypeCard
      tone="green"
      number="1"
      title="DC Current"
      subtitle="Direct Current"
      description="Current flows continuously in one direction."
      preTitle={dcControls}
      circuit={<DcCurrentCircuit current={dcCurrent} isPlaying={isDcPlaying} />}
      graph={<DcCurrentWaveform current={dcCurrent} />}
      controls={null}
      measurements={
        <Measurements
          currentLabel="Current"
          currentValue={`${dcCurrent.toFixed(2)} A`}
          direction="One Direction"
          observation="DC current stays steady and keeps moving in one direction."
          strength={dcStrength}
          tone="green"
        />
      }
    />
  );
}
