"use client";

import {
  createElement,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

type MotionLikeProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  animate?: unknown;
  initial?: unknown;
  transition?: unknown;
};

function createMotionPrimitive<T extends ElementType>(tag: T) {
  return function MotionPrimitive({
    animate: _animate,
    initial: _initial,
    transition: _transition,
    ...props
  }: MotionLikeProps<T>) {
    return createElement(tag, props);
  };
}

const motion = {
  circle: createMotionPrimitive("circle"),
  path: createMotionPrimitive("path"),
  rect: createMotionPrimitive("rect"),
};

type StageId = "ac" | "transformer" | "rectifier" | "filter" | "regulator" | "resistor" | "load";
type RegulatorIc = "7805" | "7809" | "7812" | "7905" | "7909" | "7912";

type RegulatorSpec = {
  id: RegulatorIc;
  output: number;
  polarity: "positive" | "negative";
  minInputAbs: number;
  label: string;
};

type SimulationInput = {
  acInputVrms: number;
  turnsRatio: number;
  filterCapUf: number;
  loadResistance: number;
  regulatorIc: RegulatorIc;
  capacitorVoltageV: number;
};

type SimulationResult = {
  transformerVac: number;
  rectifiedVdc: number;
  rippleV: number;
  inputToRegulator: number;
  outputV: number;
  selectedIc: RegulatorIc;
  regulatorLabel: string;
  regulatorPolarity: "positive" | "negative";
  capacitorVoltageV: number;
  recommendedCapVoltageV: number;
  capacitorVoltageOk: boolean;
  ledCurrentMa: number;
  regulatorOk: boolean;
  ledOn: boolean;
  powerDissipationW: number;
  junctionTempC: number;
  thermalWarning: boolean;
  thermalShutdown: boolean;
  status: string;
};

const regulatorSpecs: Record<RegulatorIc, RegulatorSpec> = {
  "7805": { id: "7805", output: 5, polarity: "positive", minInputAbs: 7, label: "+5V" },
  "7809": { id: "7809", output: 9, polarity: "positive", minInputAbs: 11, label: "+9V" },
  "7812": { id: "7812", output: 12, polarity: "positive", minInputAbs: 14, label: "+12V" },
  "7905": { id: "7905", output: -5, polarity: "negative", minInputAbs: 7, label: "−5V" },
  "7909": { id: "7909", output: -9, polarity: "negative", minInputAbs: 11, label: "−9V" },
  "7912": { id: "7912", output: -12, polarity: "negative", minInputAbs: 14, label: "−12V" },
};

const stages = [
  { id: "ac" as StageId, title: "1. AC Input", short: "AC sine source circuit-এ প্রবেশ করে।", detail: "Main AC input transformer primary winding-এ যায়।" },
  { id: "transformer" as StageId, title: "2. Transformer", short: "AC voltage step-down করে।", detail: "Transformer secondary voltage তৈরি করে এবং isolation দেয়।" },
  { id: "rectifier" as StageId, title: "3. Rectifier", short: "D2/D3 alternate half-cycle conduct করে।", detail: "D2 এক half-cycle, D3 opposite half-cycle conduct করে; output rail একই polarity pulse পায়।" },
  { id: "filter" as StageId, title: "4. Filter Capacitor", short: "Ripple কমিয়ে DC smooth করে।", detail: "Capacitor peak voltage ধরে রাখে এবং ripple কমায়।" },
  { id: "regulator" as StageId, title: "5. Regulator IC", short: "78xx/79xx output stable রাখে।", detail: "Selected IC অনুযায়ী + বা − regulated output পাওয়া যায়।" },
  { id: "resistor" as StageId, title: "6. LED Resistor", short: "LED current limit করে।", detail: "Series resistor LED current safe রাখে। Formula: R = (|Vsupply| − Vled) ÷ Iled." },
  { id: "load" as StageId, title: "7. Load / LED", short: "Regulated output load drive করে।", detail: "Current resistor পার হয়ে LED/load-এ যায় এবং light output তৈরি করে।" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

function getStageInfo(stageId: StageId) {
  return stages.find((stage) => stage.id === stageId) ?? stages[0];
}

function calculate7805(input: SimulationInput): SimulationResult {
  const spec = regulatorSpecs[input.regulatorIc];
  const safeRatio = Math.max(1, input.turnsRatio);
  const transformerVac = input.acInputVrms / safeRatio;
  const rectifiedVdc = Math.max(0, transformerVac * Math.SQRT2 - 1.4);
  const targetOutputAbs = Math.abs(spec.output);
  const loadCurrentA = targetOutputAbs / Math.max(1, input.loadResistance);
  const rippleV = clamp(loadCurrentA / (100 * (input.filterCapUf / 1_000_000)), 0, 8);
  const inputToRegulator = Math.max(0, rectifiedVdc - rippleV / 2);
  const regulatorOk = inputToRegulator >= spec.minInputAbs;
  const outputAbs = regulatorOk ? targetOutputAbs : clamp(inputToRegulator - 2, 0, targetOutputAbs);
  const outputV = spec.polarity === "negative" ? -outputAbs : outputAbs;
  const ledCurrentMa = outputAbs > 1.9 ? ((outputAbs - 1.9) / Math.max(1, input.loadResistance)) * 1000 : 0;
  const powerDissipationW = Math.max(0, (inputToRegulator - outputAbs) * (ledCurrentMa / 1000));
  const junctionTempC = 25 + powerDissipationW * 65;
  const thermalWarning = junctionTempC >= 90;
  const thermalShutdown = junctionTempC >= 125;
  const recommendedCapVoltageV = Math.max(6, Math.ceil((rectifiedVdc * 1.5) / 5) * 5);
  const capacitorVoltageOk = input.capacitorVoltageV >= rectifiedVdc * 1.25;
  const ledOn = ledCurrentMa > 2;
  const status = thermalShutdown
    ? `${input.regulatorIc} thermal shutdown!`
    : thermalWarning
      ? `${input.regulatorIc} overheating warning. Heat sink দরকার হতে পারে।`
      : !capacitorVoltageOk
        ? `Capacitor voltage rating low. At least ${recommendedCapVoltageV}V ব্যবহার করুন।`
        : regulatorOk
          ? `${input.regulatorIc} enough headroom পাচ্ছে, output প্রায় ${spec.label} stable।`
          : `${input.regulatorIc} dropout condition: input voltage কম।`;

  return {
    transformerVac,
    rectifiedVdc,
    rippleV,
    inputToRegulator,
    outputV,
    selectedIc: input.regulatorIc,
    regulatorLabel: spec.label,
    regulatorPolarity: spec.polarity,
    capacitorVoltageV: input.capacitorVoltageV,
    recommendedCapVoltageV,
    capacitorVoltageOk,
    ledCurrentMa,
    regulatorOk,
    ledOn,
    powerDissipationW,
    junctionTempC,
    thermalWarning,
    thermalShutdown,
    status,
  };
}

const simulationTests = [
  { input: { acInputVrms: 230, turnsRatio: 9, filterCapUf: 450, loadResistance: 100, regulatorIc: "7805" as RegulatorIc, capacitorVoltageV: 50 }, ok: true, minAbsOutput: 4.99 },
  { input: { acInputVrms: 110, turnsRatio: 9, filterCapUf: 450, loadResistance: 100, regulatorIc: "7809" as RegulatorIc, capacitorVoltageV: 25 }, ok: true, minAbsOutput: 8.9 },
  { input: { acInputVrms: 80, turnsRatio: 9, filterCapUf: 100, loadResistance: 100, regulatorIc: "7812" as RegulatorIc, capacitorVoltageV: 25 }, ok: false, maxAbsOutput: 12 },
  { input: { acInputVrms: 230, turnsRatio: 9, filterCapUf: 2200, loadResistance: 1000, regulatorIc: "7905" as RegulatorIc, capacitorVoltageV: 50 }, ok: true, expectedNegative: true },
  { input: { acInputVrms: 230, turnsRatio: 0, filterCapUf: 450, loadResistance: 100, regulatorIc: "7805" as RegulatorIc, capacitorVoltageV: 50 }, ok: true, minAbsOutput: 4.99 },
  { input: { acInputVrms: 230, turnsRatio: 9, filterCapUf: 450, loadResistance: 100, regulatorIc: "7805" as RegulatorIc, capacitorVoltageV: 6 }, ok: true, capOk: false },
];

function runSimulationTests() {
  return simulationTests.every((test) => {
    const result = calculate7805(test.input);
    const okMatch = result.regulatorOk === test.ok;
    const minMatch = test.minAbsOutput === undefined || Math.abs(result.outputV) >= test.minAbsOutput;
    const maxMatch = test.maxAbsOutput === undefined || Math.abs(result.outputV) <= test.maxAbsOutput;
    const signMatch = test.expectedNegative === undefined || result.outputV < 0;
    const capMatch = test.capOk === undefined || result.capacitorVoltageOk === test.capOk;
    return okMatch && minMatch && maxMatch && signMatch && capMatch;
  });
}

function FlowDots({ path, active, color, count = 10, duration = 2.2, reverse = false, flowRate = 1 }: { path: string; active: boolean; color: string; count?: number; duration?: number; reverse?: boolean; flowRate?: number }) {
  const adjustedCount = Math.max(2, Math.round(count * flowRate));
  const adjustedDuration = duration / Math.max(0.25, flowRate);
  const route = reverse ? ["100%", "0%"] : ["0%", "100%"];
  return (
    <>
      {Array.from({ length: adjustedCount }).map((_, index) => (
        <motion.circle
          key={`${path}-${index}-${reverse}`}
          r="4"
          fill={color}
          stroke="white"
          strokeWidth="1"
          initial={{ offsetDistance: route[0], opacity: 0 }}
          animate={{ offsetDistance: active ? route : route[0], opacity: active ? [0, 1, 1, 0] : 0 }}
          transition={{ duration: adjustedDuration, repeat: Infinity, ease: "linear", delay: index * (adjustedDuration / adjustedCount) }}
          style={{ offsetPath: `path('${path}')` }}
        />
      ))}
    </>
  );
}

function AcFlow({ path, active, color, flowRate }: { path: string; active: boolean; color: string; flowRate: number }) {
  return (
    <>
      <FlowDots path={path} active={active} color={color} count={12} duration={1.5} flowRate={flowRate} />
      <FlowDots path={path} active={active} color={color} count={12} duration={1.5} reverse flowRate={flowRate} />
    </>
  );
}

function HalfCycleFlow({ path, active, color, delay = 0, reverse = false, flowRate = 1 }: { path: string; active: boolean; color: string; delay?: number; reverse?: boolean; flowRate?: number }) {
  const adjustedCount = Math.max(2, Math.round(8 * flowRate));
  const adjustedDuration = 2.4 / Math.max(0.25, flowRate);
  const route = reverse ? ["100%", "0%"] : ["0%", "100%"];
  return (
    <>
      {Array.from({ length: adjustedCount }).map((_, index) => (
        <motion.circle
          key={`${path}-${index}-${delay}-${reverse}`}
          r="4.5"
          fill={color}
          stroke="white"
          strokeWidth="1"
          initial={{ offsetDistance: route[0], opacity: 0 }}
          animate={{ offsetDistance: active ? route : route[0], opacity: active ? [0, 1, 1, 0, 0, 0] : 0 }}
          transition={{ duration: adjustedDuration, repeat: Infinity, ease: "linear", delay: delay + index * (adjustedDuration / adjustedCount) }}
          style={{ offsetPath: `path('${path}')` }}
        />
      ))}
    </>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-black ${tone}`}>{value}</p>
    </div>
  );
}

function InfoCard({ title, children, active }: { title: string; children: React.ReactNode; active?: boolean }) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${active ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}>
      <h3 className="text-xl font-black text-slate-900">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

function StageHighlight({ activeStage }: { activeStage: StageId }) {
  const stageBoxes: Record<StageId, { x: number; y: number; width: number; height: number; labelX: number; labelY: number }> = {
    ac: { x: 18, y: 170, width: 118, height: 180, labelX: 77, labelY: 158 },
    transformer: { x: 140, y: 185, width: 120, height: 165, labelX: 200, labelY: 176 },
    rectifier: { x: 365, y: 82, width: 165, height: 355, labelX: 448, labelY: 72 },
    filter: { x: 548, y: 98, width: 155, height: 270, labelX: 625, labelY: 88 },
    regulator: { x: 770, y: 70, width: 165, height: 150, labelX: 852, labelY: 60 },
    resistor: { x: 1070, y: 95, width: 150, height: 125, labelX: 1145, labelY: 82 },
    load: { x: 1140, y: 205, width: 140, height: 150, labelX: 1210, labelY: 194 },
  };
  const box = stageBoxes[activeStage];
  return (
    <g pointerEvents="none">
      <motion.rect x={box.x} y={box.y} width={box.width} height={box.height} rx="18" fill="#dbeafe" stroke="#2563eb" strokeWidth="4" strokeDasharray="12 8" animate={{ opacity: [0.18, 0.42, 0.18] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <text x={box.labelX} y={box.labelY} textAnchor="middle" fontSize="20" fontWeight="900" fill="#2563eb" fontFamily="Arial">{getStageInfo(activeStage).title}</text>
    </g>
  );
}

function StageLearningPanel({ activeStage, result, input }: { activeStage: StageId; result: SimulationResult; input: SimulationInput }) {
  const stage = getStageInfo(activeStage);
  const recommendedResistor = Math.abs(result.outputV) > 2 ? ((Math.abs(result.outputV) - 2) / 0.02) : 0;
  const stageData: Record<StageId, { live: string; formula: string; note: string }> = {
    ac: { live: "Input AC source feeds transformer primary.", formula: "AC mains → transformer primary", note: "AC source alternating current তৈরি করে যা transformer-এ প্রবেশ করে।" },
    transformer: { live: `Secondary ≈ ${formatNumber(result.transformerVac, 2)} Vac`, formula: `Vsecondary = ${input.acInputVrms} ÷ ${Math.max(1, input.turnsRatio)} = ${formatNumber(result.transformerVac, 2)}V`, note: "Transformer voltage step-down করে এবং galvanic isolation দেয়।" },
    rectifier: { live: `Rectified peak DC ≈ ${formatNumber(result.rectifiedVdc, 2)} V`, formula: `Vpeak = ${formatNumber(result.transformerVac, 2)} × 1.414 − 1.4 = ${formatNumber(result.rectifiedVdc, 2)}V`, note: "D2 এবং D3 alternate half-cycle conduct করে pulsating DC তৈরি করে।" },
    filter: { live: `Ripple ≈ ${formatNumber(result.rippleV, 2)} V`, formula: "Vripple = I ÷ (f × C)", note: `Capacitor ${input.filterCapUf}µF ripple কমিয়ে smoother DC দেয়।` },
    regulator: { live: `${result.selectedIc} Vin ${formatNumber(result.inputToRegulator, 2)}V → Vout ${formatNumber(result.outputV, 2)}V`, formula: `Required Vin ≥ ${regulatorSpecs[result.selectedIc].minInputAbs}V`, note: "Linear regulator stable fixed output maintain করে।" },
    resistor: { live: `Current resistor = ${input.loadResistance}Ω, LED current ≈ ${formatNumber(result.ledCurrentMa, 1)}mA`, formula: `R = (|Vsupply| − Vled) ÷ Iled = ${formatNumber(recommendedResistor, 0)}Ω`, note: `For 20mA target, recommended resistor ≈ ${formatNumber(recommendedResistor, 0)}Ω. Higher resistor = lower LED current.` },
    load: { live: `LED current ≈ ${formatNumber(result.ledCurrentMa, 1)} mA`, formula: `Pled approx depends on LED current`, note: `LED/load turns ON when current is enough. Present resistor: ${input.loadResistance}Ω.` },
  };

  return (
    <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">Stage Learning</p>
      <h3 className="mt-2 text-2xl font-black text-slate-900">{stage.title}</h3>
      <p className="mt-3 text-sm font-bold text-slate-700">{stage.short}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{stage.detail}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-3 ring-1 ring-blue-100">
          <p className="text-xs font-black uppercase text-blue-600">Live Value</p>
          <p className="mt-2 text-sm font-black text-slate-800">{stageData[activeStage].live}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-blue-100">
          <p className="text-xs font-black uppercase text-emerald-600">Formula</p>
          <p className="mt-2 font-mono text-sm font-black text-emerald-700">{stageData[activeStage].formula}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-blue-100">
          <p className="text-xs font-black uppercase text-purple-600">Engineering Note</p>
          <p className="mt-2 text-sm font-bold text-slate-700">{stageData[activeStage].note}</p>
        </div>
      </div>
    </div>
  );
}

function WaveCard({ title, value, children, active }: { title: string; value: string; children: React.ReactNode; active?: boolean }) {
  return (
    <div className={`rounded-3xl border bg-white p-4 shadow-sm ${active ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-black text-slate-900">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{value}</span>
      </div>
      <svg viewBox="0 0 280 120" className="h-auto w-full" shapeRendering="geometricPrecision">
        <rect x="0" y="0" width="280" height="120" rx="14" fill="#f8fafc" />
        <line x1="16" y1="60" x2="264" y2="60" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 8" />
        {children}
      </svg>
    </div>
  );
}

function WaveformVisualizer({ result, activeStage }: { result: SimulationResult; activeStage: StageId }) {
  const rippleTop = 34;
  const rippleBottom = clamp(34 + result.rippleV * 5, 48, 86);
  const regulatorY = result.regulatorOk ? 42 : clamp(95 - Math.abs(result.outputV) * 4, 45, 98);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Waveform Visualizer</h2>
          <p className="text-sm text-slate-600">AC sine → rectified DC → filtered ripple → regulated output</p>
        </div>
        <div className="rounded-full bg-purple-100 px-4 py-2 text-xs font-black text-purple-700">Live waveform path</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WaveCard title="AC Secondary" value={`${formatNumber(result.transformerVac, 2)} Vac`} active={activeStage === "ac" || activeStage === "transformer"}>
          <motion.path d="M16 60 C35 15,55 15,75 60 S115 105,135 60 S175 15,195 60 S235 105,264 60" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" animate={{ pathLength: [0.25, 1, 0.25] }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }} />
          <text x="18" y="106" fontSize="12" fontWeight="900" fill="#2563eb">sine AC</text>
        </WaveCard>
        <WaveCard title="Rectified DC" value={`${formatNumber(result.rectifiedVdc, 2)} V peak`} active={activeStage === "rectifier"}>
          <motion.path d="M16 92 C35 20,55 20,75 92 C95 20,115 20,135 92 C155 20,175 20,195 92 C215 20,235 20,264 92" fill="none" stroke="#f97316" strokeWidth="5" strokeLinecap="round" animate={{ pathLength: [0.25, 1, 0.25] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
          <text x="18" y="106" fontSize="12" fontWeight="900" fill="#f97316">pulsating DC</text>
        </WaveCard>
        <WaveCard title="Filtered DC" value={`Ripple ${formatNumber(result.rippleV, 2)} V`} active={activeStage === "filter"}>
          <motion.path d={`M16 ${rippleTop} L50 ${rippleBottom} L84 ${rippleTop} L118 ${rippleBottom} L152 ${rippleTop} L186 ${rippleBottom} L220 ${rippleTop} L264 ${rippleBottom}`} fill="none" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <text x="18" y="106" fontSize="12" fontWeight="900" fill="#7e22ce">smoothed ripple</text>
        </WaveCard>
        <WaveCard title="Regulated Output" value={`${formatNumber(result.outputV, 2)} V`} active={activeStage === "regulator" || activeStage === "load"}>
          <motion.path d={`M16 ${regulatorY} L264 ${regulatorY}`} fill="none" stroke={result.regulatorOk ? "#16a34a" : "#dc2626"} strokeWidth="6" strokeLinecap="round" animate={{ opacity: [0.65, 1, 0.65] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <line x1="16" y1="42" x2="264" y2="42" stroke="#bbf7d0" strokeWidth="2" strokeDasharray="8 7" />
          <text x="18" y="106" fontSize="12" fontWeight="900" fill={result.regulatorOk ? "#16a34a" : "#dc2626"}>{result.regulatorOk ? result.regulatorLabel : "dropout sag"}</text>
        </WaveCard>
      </div>
    </div>
  );
}

function FormulaCard({ title, formula, explanation, live }: { title: string; formula: string; explanation: string; live: string }) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Formula Learning</p>
      <h3 className="mt-2 text-lg font-black text-slate-900">{title}</h3>
      <div className="mt-3 rounded-2xl bg-white p-4 font-mono text-sm font-black text-emerald-700 ring-1 ring-emerald-100">{formula}</div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{explanation}</p>
      <div className="mt-4 rounded-2xl bg-white p-3 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">{live}</div>
    </div>
  );
}

function FormulaLearningPanel({ result, input }: { result: SimulationResult; input: SimulationInput }) {
  const diodeDrop = 1.4;
  const loadCurrentA = Math.abs(result.outputV) / Math.max(1, input.loadResistance);
  const recommendedResistor = Math.abs(result.outputV) > 2 ? ((Math.abs(result.outputV) - 2) / 0.02) : 0;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-900">Formula Explanation</h2>
        <p className="text-sm text-slate-600">Live engineering formulas with current simulation values</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <FormulaCard title="Transformer" formula="Vsecondary = Vac ÷ Turns Ratio" explanation="Transformer AC voltage step-down করে secondary output তৈরি করে।" live={`${input.acInputVrms} ÷ ${Math.max(1, input.turnsRatio)} = ${formatNumber(result.transformerVac, 2)} Vac`} />
        <FormulaCard title="Rectifier Peak" formula="Vpeak = Vrms × √2 − Diode Drop" explanation="Rectifier AC sine-এর peak থেকে diode voltage drop বাদ দিয়ে DC peak দেয়।" live={`${formatNumber(result.transformerVac, 2)} × 1.414 − ${diodeDrop} = ${formatNumber(result.rectifiedVdc, 2)} V`} />
        <FormulaCard title="Ripple Voltage" formula="Vripple = Iload ÷ (f × C)" explanation="Capacitor ছোট হলে ripple বেশি হয়, capacitor বড় হলে ripple কমে।" live={`${formatNumber(loadCurrentA, 3)} ÷ (100 × ${input.filterCapUf / 1_000_000}) = ${formatNumber(result.rippleV, 2)} V`} />
        <FormulaCard title={`${result.selectedIc} Dropout`} formula="Required Vin ≈ |Vout| + 2V" explanation="78xx/79xx regulator stable output দিতে input headroom চায়।" live={`${result.selectedIc}: Vin ${formatNumber(result.inputToRegulator, 2)}V, need ${regulatorSpecs[result.selectedIc].minInputAbs}V`} />
        <FormulaCard title="LED Resistor Selection" formula="R = (|Vsupply| − Vled) ÷ Iled" explanation="LED current limit resistor select করার formula। Red LED ≈ 2V, target current 20mA ধরা হয়েছে।" live={`(${formatNumber(Math.abs(result.outputV), 2)} − 2.0) ÷ 0.02 = ${formatNumber(recommendedResistor, 0)} Ω`} />
      </div>
    </div>
  );
}

function ThermalEducationPanel({ result }: { result: SimulationResult }) {
  return (
    <div className="rounded-3xl border border-orange-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Thermal Education</h2>
          <p className="text-sm text-slate-600">Linear regulator heat dissipation learning</p>
        </div>
        <div className={`rounded-full px-4 py-2 text-xs font-black ${result.thermalShutdown ? "bg-red-100 text-red-700" : result.thermalWarning ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
          {result.thermalShutdown ? "THERMAL SHUTDOWN" : result.thermalWarning ? "HOT" : "SAFE"}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Power Formula</p><div className="mt-3 font-mono text-sm font-black text-orange-700">P = (Vin − |Vout|) × I</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Power Loss</p><div className="mt-3 text-3xl font-black text-orange-600">{formatNumber(result.powerDissipationW, 2)}W</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Junction Temp</p><div className={`mt-3 text-3xl font-black ${result.thermalShutdown ? "text-red-600" : result.thermalWarning ? "text-orange-600" : "text-green-600"}`}>{formatNumber(result.junctionTempC, 1)}°C</div></div>
      </div>
      <div className="mt-5 h-6 w-full overflow-hidden rounded-full bg-slate-200"><div className={`${result.thermalShutdown ? "bg-red-600" : result.thermalWarning ? "bg-orange-500" : "bg-green-500"} h-full`} style={{ width: `${Math.min(result.junctionTempC / 1.5, 100)}%` }} /></div>
    </div>
  );
}

function LinearRegulatorPowerSupplySvg({ result, activeStage, input, flowRate }: { result: SimulationResult; activeStage: StageId; input: SimulationInput; flowRate: number }) {
  return (
    <svg width="1333" height="522" viewBox="0 0 1333 522" className="h-auto w-full bg-white" shapeRendering="geometricPrecision" role="img" aria-label="Interactive Linear Regulator Power Supply Circuit">
      <title>Linear Regulator Power Supply Circuit</title>
      <rect width="1333" height="522" fill="#ffffff" />
      <StageHighlight activeStage={activeStage} />
      <g stroke="#465055" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="51" cy="262" r="32" /><path d="M36 264 C42 245 48 245 54 264 S66 283 72 264" /><line x1="52" y1="233" x2="52" y2="292" /><path d="M44 280 L52 292 L60 280" /><path d="M53 197 L158 197 L158 336 L53 336 Z" />
        <path d="M158 231 C176 231 176 248 158 248" /><path d="M158 248 C176 248 176 265 158 265" /><path d="M158 265 C176 265 176 282 158 282" /><path d="M158 282 C176 282 176 299 158 299" /><line x1="187" y1="232" x2="187" y2="299" /><line x1="198" y1="232" x2="198" y2="299" />
        <path d="M227 231 C209 231 209 248 227 248" /><path d="M227 248 C209 248 209 265 227 265" /><path d="M227 265 C209 265 209 282 227 282" /><path d="M227 282 C209 282 209 299 227 299" /><line x1="227" y1="197" x2="262" y2="197" /><line x1="262" y1="197" x2="262" y2="119" /><line x1="262" y1="119" x2="401" y2="119" />
        <line x1="227" y1="197" x2="262" y2="197" />
        <line x1="227" y1="266" x2="331" y2="266" /><line x1="227" y1="299" x2="227" y2="329" /><line x1="331" y1="266" x2="331" y2="336" /><line x1="331" y1="336" x2="1230" y2="336" /><line x1="227" y1="329" x2="262" y2="329" /><line x1="262" y1="329" x2="262" y2="398" /><line x1="262" y1="398" x2="401" y2="398" />
        <line x1="227" y1="329" x2="262" y2="329" />
        <path d="M401 102 L401 136 L434 119 Z" fill="#465055" /><line x1="435" y1="100" x2="435" y2="138" /><line x1="435" y1="119" x2="503" y2="119" /><path d="M401 381 L401 415 L434 398 Z" fill="#465055" /><line x1="435" y1="379" x2="435" y2="417" /><line x1="435" y1="398" x2="503" y2="398" />
        <line x1="503" y1="119" x2="798" y2="119" /><line x1="503" y1="119" x2="503" y2="336" /><path d="M494 336 C494 322 512 322 512 336" /><line x1="503" y1="405" x2="503" y2="336" /><circle cx="608" cy="119" r="4" fill="#465055" /><circle cx="608" cy="336" r="4" fill="#465055" /><circle cx="851" cy="336" r="4" fill="#465055" />
        <line x1="608" y1="119" x2="608" y2="259" /><line x1="574" y1="259" x2="642" y2="259" /><path d="M574 281 C595 270 621 270 642 281" /><line x1="608" y1="281" x2="608" y2="336" /><line x1="589" y1="238" x2="589" y2="255" /><line x1="580" y1="246" x2="598" y2="246" />
        <motion.rect x="799" y="92" width="104" height="88" fill={result.regulatorOk ? "#dcfce7" : "#fee2e2"} animate={{ opacity: result.regulatorOk ? [0.82, 1, 0.82] : [0.75, 1, 0.75] }} transition={{ duration: 1, repeat: Infinity }} /><rect x="799" y="92" width="104" height="88" /><line x1="798" y1="119" x2="799" y2="119" /><line x1="851" y1="180" x2="851" y2="336" />
        <line x1="903" y1="119" x2="1091" y2="119" /><line x1="1091" y1="119" x2="1091" y2="127" /><polyline points="1091,127 1100,127 1110,111 1121,143 1133,111 1145,143 1157,111 1169,143 1180,111 1192,143 1202,127" /><line x1="1202" y1="127" x2="1202" y2="232" />
        <motion.path d="M1180 232 L1224 232 L1202 264 Z" fill={result.ledOn ? "#fef3c7" : "#465055"} animate={{ opacity: result.ledOn ? [0.65, 1, 0.65] : 1 }} transition={{ duration: 1, repeat: result.ledOn ? Infinity : 0 }} /><line x1="1180" y1="264" x2="1224" y2="264" /><line x1="1202" y1="264" x2="1202" y2="336" /><line x1="1231" y1="235" x2="1261" y2="265" /><path d="M1249 265 L1261 265 L1261 253" /><line x1="1241" y1="250" x2="1271" y2="280" /><path d="M1259 280 L1271 280 L1271 268" />
      </g>
      <AcFlow path="M53 197 H158 M227 197 H262 V119 H401 M227 329 H262 V398 H401" active={true} color="#2563eb" flowRate={flowRate} />
      <HalfCycleFlow path="M503 119 H435 H401" active={true} color="#0ea5e9" flowRate={flowRate} />
      <HalfCycleFlow path="M503 398 H435 H401" active={true} color="#8b5cf6" delay={1.2} flowRate={flowRate} />
      <FlowDots path="M503 119 H608 H798 H903 H1091 V127" active={true} color="#f97316" count={14} duration={2.4} flowRate={flowRate} />
      <FlowDots path="M903 119 H1091 V127 H1202 V232 M1202 264 V336 H851" active={result.ledOn} color="#16a34a" count={12} duration={2.1} flowRate={flowRate} />
      <g fill="#263238" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700">
        <text x="97" y="249" fontSize="24">I1</text><text x="97" y="276" fontSize="24">AC {input.acInputVrms}V</text><text x="97" y="301" fontSize="24">1 kHz</text><text x="154" y="365" fontSize="22">XFMR1 {input.turnsRatio}:1</text><text x="244" y="184" fontSize="18" fill="#2563eb">{formatNumber(result.transformerVac, 2)}Vac</text>
        <text x="418" y="168" fontSize="22" textAnchor="middle">D2</text><text x="470" y="90" fontSize="17" fill="#0ea5e9">D2 half-cycle</text><text x="418" y="193" fontSize="21" textAnchor="middle">1N4148</text><text x="418" y="447" fontSize="22" textAnchor="middle">D3</text><text x="470" y="430" fontSize="17" fill="#8b5cf6">D3 half-cycle</text><text x="418" y="472" fontSize="21" textAnchor="middle">1N4148</text>
        <text x="652" y="262" fontSize="22">C2</text><text x="652" y="289" fontSize="21">{input.filterCapUf} µF</text><text x="652" y="316" fontSize="18" fill="#7e22ce">Ripple {formatNumber(result.rippleV, 2)}V</text><text x="652" y="343" fontSize="18" fill={result.capacitorVoltageOk ? "#16a34a" : "#dc2626"}>Cap {input.capacitorVoltageV}V {result.capacitorVoltageOk ? "OK" : "LOW"}</text>
        <text x="851" y="56" fontSize="24" textAnchor="middle">U1</text><text x="851" y="82" fontSize="22" textAnchor="middle">{input.regulatorIc}</text><text x="851" y="205" fontSize="18" textAnchor="middle" fill={result.regulatorOk ? "#16a34a" : "#dc2626"}>{result.regulatorOk ? `${result.regulatorLabel} OK` : "DROPOUT"}</text><text x="805" y="133" fontSize="18" fontStyle="italic">IN</text><text x="859" y="133" fontSize="18" fontStyle="italic">OUT</text><text x="832" y="173" fontSize="17" fontStyle="italic">GND</text>
        <text x="1130" y="176" fontSize="22" textAnchor="middle">R1</text><text x="1130" y="201" fontSize="21" textAnchor="middle">{input.loadResistance} Ω</text><text x="1128" y="244" fontSize="22" textAnchor="middle">D4</text><text x="1028" y="270" fontSize="21">{formatNumber(result.ledCurrentMa, 1)}mA</text>
      </g>
      <text x="980" y="390" fontSize="24" fontWeight="900" fill={result.regulatorOk ? "#16a34a" : "#dc2626"}>Vin {result.selectedIc}: {formatNumber(result.inputToRegulator, 2)}V → Vout: {formatNumber(result.outputV, 2)}V</text>
    </svg>
  );
}

function ControlPanel({ acInputVrms, setAcInputVrms, turnsRatio, setTurnsRatio, filterCapUf, setFilterCapUf, loadResistance, setLoadResistance, regulatorIc, setRegulatorIc, capacitorVoltageV, setCapacitorVoltageV, flowRate, setFlowRate, result }: { acInputVrms: number; setAcInputVrms: (value: number) => void; turnsRatio: number; setTurnsRatio: (value: number) => void; filterCapUf: number; setFilterCapUf: (value: number) => void; loadResistance: number; setLoadResistance: (value: number) => void; regulatorIc: RegulatorIc; setRegulatorIc: (value: RegulatorIc) => void; capacitorVoltageV: number; setCapacitorVoltageV: (value: number) => void; flowRate: number; setFlowRate: (value: number) => void; result: SimulationResult }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl font-black text-slate-900">Control Panel</h2><p className="text-sm text-slate-600">Adjust all values before viewing the Power Supply Visualizer.</p></div>
        <div className={`rounded-full px-4 py-2 text-xs font-black ${result.capacitorVoltageOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{result.capacitorVoltageOk ? "CAP OK" : `CAP NEED ≥ ${result.recommendedCapVoltageV}V`}</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200"><label className="mb-3 block text-sm font-black text-slate-700">Regulator IC: {regulatorIc} ({regulatorSpecs[regulatorIc].label})</label><div className="grid grid-cols-3 gap-2">{(["7805", "7809", "7812", "7905", "7909", "7912"] as RegulatorIc[]).map((ic) => (<button key={ic} type="button" onClick={() => setRegulatorIc(ic)} className={`rounded-2xl px-3 py-3 text-sm font-black ${regulatorIc === ic ? "bg-blue-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>{ic}</button>))}</div></div>
        <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200"><label className="mb-2 block text-sm font-black text-slate-700">AC Input RMS: {acInputVrms}V</label><input type="range" min="80" max="260" step="5" value={acInputVrms} onChange={(event) => setAcInputVrms(Number(event.target.value))} className="w-full accent-blue-600" /><label className="mb-2 mt-4 block text-sm font-black text-slate-700">Transformer Ratio: {turnsRatio}:1 {turnsRatio === 0 ? "(protected as 1:1)" : ""}</label><input type="range" min="0" max="9" step="1" value={turnsRatio} onChange={(event) => setTurnsRatio(Number(event.target.value))} className="w-full accent-purple-600" /></div>
        <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200"><label className="mb-2 block text-sm font-black text-slate-700">Filter Capacitor: {filterCapUf} µF</label><input type="range" min="100" max="2200" step="50" value={filterCapUf} onChange={(event) => setFilterCapUf(Number(event.target.value))} className="w-full accent-orange-600" /><label className="mb-2 mt-4 block text-sm font-black text-slate-700">Capacitor Voltage: {capacitorVoltageV}V {result.capacitorVoltageOk ? "OK" : `(need ≥ ${result.recommendedCapVoltageV}V)`}</label><input type="range" min="6" max="100" step="1" value={capacitorVoltageV} onChange={(event) => setCapacitorVoltageV(Number(event.target.value))} className="w-full accent-red-600" /></div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200"><label className="mb-2 block text-sm font-black text-slate-700">Load / LED Resistor: {loadResistance} Ω</label><input type="range" min="100" max="1000" step="10" value={loadResistance} onChange={(event) => setLoadResistance(Number(event.target.value))} className="w-full accent-green-600" /></div><div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200"><label className="mb-2 block text-sm font-black text-slate-700">Electron Flow Rate: {flowRate.toFixed(1)}×</label><input type="range" min="0.3" max="3" step="0.1" value={flowRate} onChange={(event) => setFlowRate(Number(event.target.value))} className="w-full accent-cyan-600" /></div></div>
      <div className="mt-5 rounded-3xl bg-white p-4 ring-1 ring-slate-200"><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Realtime Explanation</p><p className="mt-3 text-sm leading-relaxed text-slate-700">{result.status}</p><p className="mt-3 text-sm font-black text-slate-900">Ripple: {formatNumber(result.rippleV, 2)}V • LED current: {formatNumber(result.ledCurrentMa, 1)}mA</p></div>
    </div>
  );
}

export default function Linear7805PowerSupplySimulation() {
  const [acInputVrms, setAcInputVrms] = useState(230);
  const [turnsRatio, setTurnsRatio] = useState(9);
  const [filterCapUf, setFilterCapUf] = useState(450);
  const [loadResistance, setLoadResistance] = useState(100);
  const [regulatorIc, setRegulatorIc] = useState<RegulatorIc>("7805");
  const [capacitorVoltageV, setCapacitorVoltageV] = useState(25);
  const [activeStage, setActiveStage] = useState<StageId>("ac");
  const [flowRate, setFlowRate] = useState(1);
  const input = useMemo<SimulationInput>(() => ({ acInputVrms, turnsRatio, filterCapUf, loadResistance, regulatorIc, capacitorVoltageV }), [acInputVrms, turnsRatio, filterCapUf, loadResistance, regulatorIc, capacitorVoltageV]);
  const result = useMemo(() => calculate7805(input), [input]);
  const testsPassed = useMemo(() => runSimulationTests(), []);

  return (
    <div className="min-h-screen bg-white p-4 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"><p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">Power Electronics Trainer</p><h1 className="mt-2 text-2xl font-black sm:text-4xl">Power Supply Visualizer</h1><p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">AC input → transformer → D2/D3 rectifier → filter capacitor → selected 78xx/79xx regulator → LED/load.</p></div>
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-6"><StatCard label="AC Input" value={`${input.acInputVrms}V`} tone="text-blue-600" /><StatCard label="Secondary" value={`${formatNumber(result.transformerVac, 2)}Vac`} tone="text-purple-600" /><StatCard label="Reg Vin" value={`${formatNumber(result.inputToRegulator, 2)}V`} tone={result.regulatorOk ? "text-green-600" : "text-red-600"} /><StatCard label="Output" value={`${formatNumber(result.outputV, 2)}V`} tone={result.regulatorOk ? "text-green-600" : "text-orange-600"} /><StatCard label="IC" value={regulatorIc} tone={result.regulatorPolarity === "positive" ? "text-blue-600" : "text-purple-600"} /><StatCard label="Tests" value={testsPassed ? "PASS" : "FAIL"} tone={testsPassed ? "text-emerald-600" : "text-red-600"} /></div>
        <ControlPanel acInputVrms={acInputVrms} setAcInputVrms={setAcInputVrms} turnsRatio={turnsRatio} setTurnsRatio={setTurnsRatio} filterCapUf={filterCapUf} setFilterCapUf={setFilterCapUf} loadResistance={loadResistance} setLoadResistance={setLoadResistance} regulatorIc={regulatorIc} setRegulatorIc={setRegulatorIc} capacitorVoltageV={capacitorVoltageV} setCapacitorVoltageV={setCapacitorVoltageV} flowRate={flowRate} setFlowRate={setFlowRate} result={result} />
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-black">Power Supply Visualizer</h2><div className={`rounded-full px-4 py-2 text-xs font-black ${result.regulatorOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{result.regulatorOk ? `REGULATED ${result.regulatorLabel}` : "DROPOUT"}</div></div><div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner"><LinearRegulatorPowerSupplySvg result={result} activeStage={activeStage} input={input} flowRate={flowRate} /></div></div>
        <WaveformVisualizer result={result} activeStage={activeStage} />
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black text-slate-900">Stage-by-stage learning</h2><p className="text-sm text-slate-600">একটি stage select করলে circuit diagram-এ সেই অংশ highlight হবে।</p></div><div className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700">{getStageInfo(activeStage).title}</div></div><div className="grid gap-3 md:grid-cols-3 lg:grid-cols-7">{stages.map((stage) => (<button key={stage.id} type="button" onClick={() => setActiveStage(stage.id)} className={`rounded-2xl border px-3 py-4 text-left text-sm font-black transition ${activeStage === stage.id ? "border-blue-500 bg-blue-600 text-white shadow-lg" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><span className="block text-xs opacity-80">{stage.title}</span><span className="mt-2 block text-xs font-bold leading-snug">{stage.short}</span></button>))}</div><div className="mt-4"><StageLearningPanel activeStage={activeStage} result={result} input={input} /></div></div>
        <ThermalEducationPanel result={result} />
        <FormulaLearningPanel result={result} input={input} />
        <div className="grid gap-4 lg:grid-cols-3"><InfoCard title="78XX / 79XX IC" active>78XX positive output দেয়, 79XX negative output দেয়। এই simulator polarity এবং output voltage live দেখায়।</InfoCard><InfoCard title="Capacitor Voltage">Capacitor voltage rating rectified DC peak-এর চেয়ে বেশি হওয়া উচিত। এখানে recommended rating live calculate হয়।</InfoCard><InfoCard title="Electron Flow Control">Flow rate slider দিয়ে animation speed এবং electron dot density control করা যায়।</InfoCard></div>
      </div>
    </div>
  );
}
