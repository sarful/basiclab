import type { BjtType, Family, FetChannel, FetType } from "./types";

type ControlPanelSectionProps = {
  family: Family;
  setFamily: (value: Family) => void;
  bjtType: BjtType;
  setBjtType: (value: BjtType) => void;
  fetType: FetType;
  setFetType: (value: FetType) => void;
  fetChannel: FetChannel;
  setFetChannel: (value: FetChannel) => void;
  signal: number;
  setSignal: (value: number) => void;
  gain: number;
  setGain: (value: number) => void;
  active: boolean;
  current: number;
  selectedType: string;
  controlType: string;
  mainCarrier: string;
};

function ChoiceButton({
  label,
  active,
  activeClassName,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClassName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
        active
          ? activeClassName
          : "bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-base font-black text-slate-900">{value}</p>
    </div>
  );
}

function SliderBlock({
  label,
  valueLabel,
  helper,
  value,
  min,
  max,
  step = 1,
  accentClassName,
  onChange,
}: {
  label: string;
  valueLabel: string;
  helper: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  accentClassName: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-black text-slate-800">{label}</label>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">
          {valueLabel}
        </span>
      </div>

      <p className="mt-2 text-xs font-semibold text-slate-500">{helper}</p>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`mt-4 w-full ${accentClassName}`}
      />
    </div>
  );
}

export default function ControlPanelSection({
  family,
  setFamily,
  bjtType,
  setBjtType,
  fetType,
  setFetType,
  fetChannel,
  setFetChannel,
  signal,
  setSignal,
  gain,
  setGain,
  active,
  current,
  selectedType,
  controlType,
  mainCarrier,
}: ControlPanelSectionProps) {
  const signalTone =
    family === "BJT" ? "accent-blue-600" : "accent-emerald-600";
  const gainTone = family === "BJT" ? "accent-violet-600" : "accent-cyan-600";
  const fetSignalHelper =
    fetType === "JFET"
      ? "Represents gate junction control that pinches or opens the channel."
      : "Represents gate voltage building an electric field across the oxide layer.";
  const fetGainLabel =
    fetType === "JFET" ? "Channel Sensitivity" : "Enhancement Strength";
  const fetGainHelper =
    fetType === "JFET"
      ? "Higher sensitivity means the gate junction changes the channel width more quickly."
      : "Higher enhancement strength means the insulated gate field builds a stronger conductive channel.";
  const realtimeText =
    family === "BJT"
      ? "BJT uses junction current to control the main transistor current path."
      : fetType === "JFET"
        ? "JFET uses a reverse-biased gate junction to squeeze or widen the source-drain channel."
        : "MOSFET uses an insulated gate electric field to enhance or weaken the source-drain channel.";

  const resetDefaults = () => {
    setFamily("BJT");
    setBjtType("NPN");
    setFetType("MOSFET");
    setFetChannel("N-Channel");
    setSignal(70);
    setGain(100);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Simulator Controls
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-900">
            Transistor Type Selector
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Switch between BJT and FET families, then compare polarity, control
            style, and symbol differences.
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Controls update the symbol canvas in realtime.
          </p>
        </div>

        <button
          type="button"
          onClick={resetDefaults}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-black text-white"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ChoiceButton
          label="BJT Family"
          active={family === "BJT"}
          activeClassName="bg-blue-600 text-white"
          onClick={() => setFamily("BJT")}
        />
        <ChoiceButton
          label="FET Family"
          active={family === "FET"}
          activeClassName="bg-emerald-600 text-white"
          onClick={() => setFamily("FET")}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <MetricChip label="Selected" value={selectedType} />
        <MetricChip label="Control" value={controlType} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <MetricChip label="Output Level" value={`${Math.round(current)}%`} />
        <MetricChip label="Status" value={active ? "Active" : "Off"} />
      </div>

      {family === "BJT" ? (
        <div className="mt-6 space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            BJT Type
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ChoiceButton
              label="NPN"
              active={bjtType === "NPN"}
              activeClassName="bg-red-700 text-white"
              onClick={() => setBjtType("NPN")}
            />
            <ChoiceButton
              label="PNP"
              active={bjtType === "PNP"}
              activeClassName="bg-red-700 text-white"
              onClick={() => setBjtType("PNP")}
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              FET Device
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceButton
                label="JFET"
                active={fetType === "JFET"}
                activeClassName="bg-green-600 text-white"
                onClick={() => setFetType("JFET")}
              />
              <ChoiceButton
                label="MOSFET"
                active={fetType === "MOSFET"}
                activeClassName="bg-green-600 text-white"
                onClick={() => setFetType("MOSFET")}
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Channel Type
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceButton
                label="N-Channel"
                active={fetChannel === "N-Channel"}
                activeClassName="bg-cyan-600 text-white"
                onClick={() => setFetChannel("N-Channel")}
              />
              <ChoiceButton
                label="P-Channel"
                active={fetChannel === "P-Channel"}
                activeClassName="bg-rose-600 text-white"
                onClick={() => setFetChannel("P-Channel")}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <SliderBlock
          label={family === "BJT" ? "Input Signal" : "Gate Drive"}
          valueLabel={`${signal}%`}
          helper={
            family === "BJT"
              ? "Represents the drive level applied at the base."
              : fetSignalHelper
          }
          value={signal}
          min={0}
          max={100}
          accentClassName={signalTone}
          onChange={setSignal}
        />

        <SliderBlock
          label={family === "BJT" ? "Gain (Beta)" : fetGainLabel}
          valueLabel={`${gain}`}
          helper={
            family === "BJT"
              ? "Higher beta means a small input current creates more collector current."
              : fetGainHelper
          }
          value={gain}
          min={20}
          max={200}
          accentClassName={gainTone}
          onChange={setGain}
        />
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Realtime Logic
        </p>
        <p className="mt-2 text-sm text-slate-700">
          {realtimeText}
        </p>
        <p className="mt-3 text-sm font-black text-slate-900">
          Carrier / Direction: {mainCarrier}
        </p>
      </div>
    </div>
  );
}
