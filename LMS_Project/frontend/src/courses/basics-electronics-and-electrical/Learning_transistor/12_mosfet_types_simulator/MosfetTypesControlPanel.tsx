"use client";

import MosfetTypesScopePanel from "./MosfetTypesScopePanel";

type MosfetType =
  | "N-Channel Enhancement"
  | "P-Channel Enhancement"
  | "N-Channel Depletion"
  | "P-Channel Depletion";

type FlowMode = "Carrier" | "Conventional" | "Both";
type LoadType = "Resistor" | "LED" | "DC Motor" | "Lamp";
type EduMode = "Beginner" | "Advanced" | "Expert";
type Lesson =
  | "MOSFET Structure"
  | "Enhancement MOSFET"
  | "Depletion MOSFET"
  | "N vs P Channel"
  | "Threshold Voltage"
  | "Saturation Region"
  | "Load Driving"
  | "Industrial Applications";

const MOSFET_TYPES: MosfetType[] = [
  "N-Channel Enhancement",
  "P-Channel Enhancement",
  "N-Channel Depletion",
  "P-Channel Depletion",
];

const FLOW_MODES: FlowMode[] = ["Carrier", "Conventional", "Both"];
const LOAD_TYPES: LoadType[] = ["Resistor", "LED", "DC Motor", "Lamp"];
const EDU_MODES: EduMode[] = ["Beginner", "Advanced", "Expert"];
const LESSONS: Lesson[] = [
  "MOSFET Structure",
  "Enhancement MOSFET",
  "Depletion MOSFET",
  "N vs P Channel",
  "Threshold Voltage",
  "Saturation Region",
  "Load Driving",
  "Industrial Applications",
];

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
      />
    </label>
  );
}

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-green-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type MosfetTypesControlPanelProps = {
  typeA: MosfetType;
  typeB: MosfetType;
  vgs: number;
  vds: number;
  flowMode: FlowMode;
  loadType: LoadType;
  eduMode: EduMode;
  lesson: Lesson;
  isRunning: boolean;
  vgsHistory: number[];
  idHistory: number[];
  scopeRunning: boolean;
  autoScale: boolean;
  timeScale: number;
  setTypeA: (value: MosfetType) => void;
  setTypeB: (value: MosfetType) => void;
  setVgs: (value: number) => void;
  setVds: (value: number) => void;
  setFlowMode: (value: FlowMode) => void;
  setLoadType: (value: LoadType) => void;
  setEduMode: (value: EduMode) => void;
  setLesson: (value: Lesson) => void;
  setIsRunning: (value: boolean) => void;
  setScopeRunning: (value: boolean) => void;
  setAutoScale: (value: boolean) => void;
  setTimeScale: (value: number) => void;
  singleShot: () => void;
  clearTrace: () => void;
};

export default function MosfetTypesControlPanel({
  typeA,
  typeB,
  vgs,
  vds,
  flowMode,
  loadType,
  eduMode,
  lesson,
  isRunning,
  vgsHistory,
  idHistory,
  scopeRunning,
  autoScale,
  timeScale,
  setTypeA,
  setTypeB,
  setVgs,
  setVds,
  setFlowMode,
  setLoadType,
  setEduMode,
  setLesson,
  setIsRunning,
  setScopeRunning,
  setAutoScale,
  setTimeScale,
  singleShot,
  clearTrace,
}: MosfetTypesControlPanelProps) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] xl:sticky xl:top-6">
      <div className="mb-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
          Control Panel
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">MOSFET Type Comparison</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Compare two MOSFET families side by side while synchronizing lesson, waveform, and load behavior.
        </p>
      </div>

      <div className="grid gap-4">
        <SelectControl label="MOSFET A" value={typeA} options={MOSFET_TYPES} onChange={setTypeA} />
        <SelectControl label="MOSFET B" value={typeB} options={MOSFET_TYPES} onChange={setTypeB} />
        <SelectControl label="Flow Mode" value={flowMode} options={FLOW_MODES} onChange={setFlowMode} />
        <SelectControl label="Load Type" value={loadType} options={LOAD_TYPES} onChange={setLoadType} />
        <RangeControl label="Gate Voltage" value={vgs} min={-6} max={6} step={0.1} unit="V" onChange={setVgs} />
        <RangeControl label="Drain Voltage" value={vds} min={0} max={12} step={0.1} unit="V" onChange={setVds} />
        <SelectControl label="Education Mode" value={eduMode} options={EDU_MODES} onChange={setEduMode} />
        <SelectControl label="Lesson" value={lesson} options={LESSONS} onChange={setLesson} />

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setIsRunning(true)} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">
            Run
          </button>
          <button onClick={() => setIsRunning(false)} className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white">
            Pause
          </button>
          <button onClick={singleShot} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">
            Single
          </button>
          <button onClick={clearTrace} className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
            Clear
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">Simulation Status</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isRunning ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
              {isRunning ? "RUNNING" : "PAUSED"}
            </span>
          </div>
        </div>

        <MosfetTypesScopePanel
          vgsHistory={vgsHistory}
          idHistory={idHistory}
          running={scopeRunning}
          autoScale={autoScale}
          timeScale={timeScale}
          setRunning={setScopeRunning}
          setAutoScale={setAutoScale}
          setTimeScale={setTimeScale}
        />
      </div>
    </aside>
  );
}
