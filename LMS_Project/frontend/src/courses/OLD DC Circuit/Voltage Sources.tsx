'use client';

import React, { useMemo, useState } from 'react';

/* ============================================================================
   TYPES
============================================================================ */

type Status = 'Ready' | 'Running' | 'Paused';

type SourceType = 'DC' | 'AC' | 'Variable' | 'Battery';

type ViewMode =
  | 'selectedCircuit'
  | 'comparison'
  | 'waveform'
  | 'practice'
  | 'debug';

type Point = {
  x: number;
  y: number;
};

type CircuitValues = {
  dcVoltage: number;
  acRmsVoltage: number;
  acFrequency: number;
  variableVoltage: number;
  loadResistance: number;
};

type WaveformPoint = {
  t: number;
  voltage: number;
};

type SourceResult = {
  sourceType: SourceType;
  sourceLabel: string;
  sourceVoltage: number;
  loadVoltage: number;
  loadCurrent: number;
  loadPower: number;
  sourcePower: number;
  resistance: number;

  isAc: boolean;
  acRmsVoltage: number;
  acPeakVoltage: number;
  acFrequency: number;
  acPeriod: number;
  acAngularFrequency: number;

  waveformPoints: WaveformPoint[];
  equationLabel: string;
};

type PracticeInputs = {
  loadVoltage: string;
  loadCurrent: string;
  loadPower: string;
  sourceType: string;
};

type ComponentId = 'source' | 'load';

type WireId =
  | 'sourceTopToSourceBodyTop'
  | 'sourceBodyBottomToSourceBottom'
  | 'sourceTopToLoadTop'
  | 'loadTopToLoadRTop'
  | 'loadRBottomToLoadBottom'
  | 'loadBottomToSourceBottom';

/* ============================================================================
   CONSTANTS
============================================================================ */

const BATTERY_VOLTAGE = 9;

const DEFAULT_VALUES: CircuitValues = {
  dcVoltage: 12,
  acRmsVoltage: 10,
  acFrequency: 50,
  variableVoltage: 6,
  loadResistance: 100,
};

const EMPTY_PRACTICE: PracticeInputs = {
  loadVoltage: '',
  loadCurrent: '',
  loadPower: '',
  sourceType: '',
};

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const BASE_WIRE_WIDTH = 4;

const SCALE = {
  COMPONENT: CIRCUIT_COMPONENT_SCALE,
  WIRE: CIRCUIT_WIRE_SCALE,
};

const MAIN_VIEW_BOX = {
  x: 0,
  y: 0,
  width: 760,
  height: 520,
};

const WAVEFORM_VIEW_BOX = {
  x: 0,
  y: 0,
  width: 760,
  height: 520,
};

const COLOR = {
  wire: '#000000',
  resistor: '#111827',

  dc: '#0648b8',
  ac: '#dc2626',
  variable: '#7c3aed',
  battery: '#15803d',

  sourcePositive: '#e00000',
  sourceNegative: '#111827',
  currentDot: '#16a34a',

  node: '#000000',
  nodeLabel: '#0648b8',

  debug: '#f97316',
  warning: '#ea580c',
};

const COMPONENT = {
  resistor: {
    leadLength: 24 * SCALE.COMPONENT,
    amplitude: 22 * SCALE.COMPONENT,
    zigzags: 6,
    strokeWidth: 5 * SCALE.COMPONENT,
  },
  source: {
    radius: 44 * SCALE.COMPONENT,
    strokeWidth: 4 * SCALE.COMPONENT,
  },
  movingCharge: {
    radius: 8 * SCALE.COMPONENT,
  },
};

const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.WIRE,
};

const NODE = {
  radius: 9 * SCALE.COMPONENT,
};

const LABEL = {
  title: 28,
  value: 22,
  node: 32,
  sub: 15,
};

const ANSWER_TOLERANCE = {
  voltage: 0.02,
  current: 0.001,
  power: 0.02,
};

/* ============================================================================
   OFFSETS
============================================================================ */

const COMPONENT_OFFSET: Record<ComponentId, Point> = {
  source: { x: 0, y: 0 },
  load: { x: 0, y: 0 },
};

const LABEL_OFFSET: Record<ComponentId, Point> = {
  source: { x: 0, y: 0 },
  load: { x: 0, y: 0 },
};

const WIRE_OFFSET: Record<WireId, Point> = {
  sourceTopToSourceBodyTop: { x: 0, y: 0 },
  sourceBodyBottomToSourceBottom: { x: 0, y: 0 },
  sourceTopToLoadTop: { x: 0, y: 0 },
  loadTopToLoadRTop: { x: 0, y: 0 },
  loadRBottomToLoadBottom: { x: 0, y: 0 },
  loadBottomToSourceBottom: { x: 0, y: 0 },
};

const DEBUG_TERMINAL_OFFSET: Point = {
  x: 0,
  y: 0,
};

/* ============================================================================
   GEOMETRY
============================================================================ */

const TERMINAL = {
  sourceTop: { x: 120, y: 95 },
  sourceBodyTop: { x: 120, y: 205 },
  sourceCenter: { x: 120, y: 250 },
  sourceBodyBottom: { x: 120, y: 295 },
  sourceBottom: { x: 120, y: 410 },

  loadTop: { x: 610, y: 95 },
  loadRTop: { x: 610, y: 190 },
  loadRBottom: { x: 610, y: 310 },
  loadBottom: { x: 610, y: 410 },
};

const COMPONENT_GEOMETRY = {
  source: {
    center: TERMINAL.sourceCenter,
    label: { x: 32, y: 250 },
    value: { x: 24, y: 288 },
  },
  load: {
    start: TERMINAL.loadRTop,
    end: TERMINAL.loadRBottom,
    label: { x: 650, y: 250 },
    value: { x: 650, y: 288 },
  },
};

const WIRE_SEGMENTS: Array<{
  id: WireId;
  from: Point;
  to: Point;
}> = [
  { id: 'sourceTopToSourceBodyTop', from: TERMINAL.sourceTop, to: TERMINAL.sourceBodyTop },
  { id: 'sourceBodyBottomToSourceBottom', from: TERMINAL.sourceBodyBottom, to: TERMINAL.sourceBottom },

  { id: 'sourceTopToLoadTop', from: TERMINAL.sourceTop, to: TERMINAL.loadTop },
  { id: 'loadTopToLoadRTop', from: TERMINAL.loadTop, to: TERMINAL.loadRTop },
  { id: 'loadRBottomToLoadBottom', from: TERMINAL.loadRBottom, to: TERMINAL.loadBottom },

  { id: 'loadBottomToSourceBottom', from: TERMINAL.loadBottom, to: TERMINAL.sourceBottom },
];

const DEBUG_TERMINALS = [
  ['Source+', TERMINAL.sourceTop],
  ['Source body +', TERMINAL.sourceBodyTop],
  ['Source center', TERMINAL.sourceCenter],
  ['Source body −', TERMINAL.sourceBodyBottom],
  ['Source−', TERMINAL.sourceBottom],
  ['A', TERMINAL.loadTop],
  ['RL top', TERMINAL.loadRTop],
  ['RL bottom', TERMINAL.loadRBottom],
  ['B', TERMINAL.loadBottom],
] as const;

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

export default function VoltageSourcesSimulator() {
  const [values, setValues] = useState<CircuitValues>(DEFAULT_VALUES);
  const [activeSource, setActiveSource] = useState<SourceType>('DC');
  const [status, setStatus] = useState<Status>('Ready');
  const [viewMode, setViewMode] = useState<ViewMode>('selectedCircuit');
  const [practiceInputs, setPracticeInputs] = useState<PracticeInputs>(EMPTY_PRACTICE);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () => solveVoltageSource(values, activeSource),
    [values, activeSource],
  );

  const isRunning = status === 'Running';

  const updateValue = (key: keyof CircuitValues, value: number) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSubmitted(false);
  };

  const reset = () => {
    setValues(DEFAULT_VALUES);
    setActiveSource('DC');
    setStatus('Ready');
    setViewMode('selectedCircuit');
    setPracticeInputs(EMPTY_PRACTICE);
    setSubmitted(false);
  };

  const generateProblem = () => {
    const sources: SourceType[] = ['DC', 'AC', 'Variable', 'Battery'];

    setValues({
      dcVoltage: randomInt(5, 24),
      acRmsVoltage: randomInt(5, 24),
      acFrequency: randomStep(20, 120, 5),
      variableVoltage: randomInt(1, 24),
      loadResistance: randomStep(20, 500, 10),
    });

    setActiveSource(sources[randomInt(0, sources.length - 1)]);
    setStatus('Running');
    setViewMode('practice');
    setPracticeInputs(EMPTY_PRACTICE);
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-white p-3 font-sans text-black">
      <section className="mx-auto max-w-[1536px] rounded-lg border-2 border-[#0648b8] bg-white p-3">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2.05fr_1fr]">
          <MainVisualizationPanel
            values={values}
            result={result}
            activeSource={activeSource}
            isRunning={isRunning}
            viewMode={viewMode}
          />

          <ConceptPanel values={values} result={result} viewMode={viewMode} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border-2 border-[#0648b8] p-3 xl:grid-cols-[1.1fr_1fr_1.1fr]">
          <ComponentValues values={values} updateValue={updateValue} />

          <SimulationControls
            status={status}
            activeSource={activeSource}
            viewMode={viewMode}
            setActiveSource={(source) => {
              setActiveSource(source);
              setSubmitted(false);
            }}
            setViewMode={setViewMode}
            onStart={() => setStatus('Running')}
            onPause={() => setStatus('Paused')}
            onReset={reset}
            onGenerateProblem={generateProblem}
          />

          <ResultsPanel result={result} />
        </div>

        <LearningPanel
          values={values}
          result={result}
          viewMode={viewMode}
          practiceInputs={practiceInputs}
          setPracticeInputs={setPracticeInputs}
          submitted={submitted}
          setSubmitted={setSubmitted}
        />
      </section>
    </main>
  );
}

/* ============================================================================
   SOLVER
============================================================================ */

function solveVoltageSource(values: CircuitValues, activeSource: SourceType): SourceResult {
  const resistance = Math.max(values.loadResistance, 0.0001);
  const safeFrequency = Math.max(values.acFrequency, 0.0001);

  let sourceVoltage = values.dcVoltage;
  let sourceLabel = 'DC Source';
  let equationLabel = 'I = VDC / RL';
  let isAc = false;

  if (activeSource === 'AC') {
    sourceVoltage = values.acRmsVoltage;
    sourceLabel = 'AC Source';
    equationLabel = 'Irms = Vrms / RL';
    isAc = true;
  }

  if (activeSource === 'Variable') {
    sourceVoltage = values.variableVoltage;
    sourceLabel = 'Variable Source';
    equationLabel = 'I = VVAR / RL';
  }

  if (activeSource === 'Battery') {
    sourceVoltage = BATTERY_VOLTAGE;
    sourceLabel = 'Battery Source';
    equationLabel = 'I = VBAT / RL';
  }

  const loadCurrent = sourceVoltage / resistance;
  const loadVoltage = sourceVoltage;
  const loadPower = loadVoltage * loadCurrent;
  const sourcePower = loadPower;

  const acRmsVoltage = values.acRmsVoltage;
  const acPeakVoltage = acRmsVoltage * Math.sqrt(2);
  const acFrequency = safeFrequency;
  const acPeriod = 1 / safeFrequency;
  const acAngularFrequency = 2 * Math.PI * safeFrequency;

  const waveformPoints = createWaveformPoints({
    activeSource,
    sourceVoltage,
    acPeakVoltage,
    frequency: safeFrequency,
  });

  return {
    sourceType: activeSource,
    sourceLabel,
    sourceVoltage,
    loadVoltage,
    loadCurrent,
    loadPower,
    sourcePower,
    resistance,

    isAc,
    acRmsVoltage,
    acPeakVoltage,
    acFrequency,
    acPeriod,
    acAngularFrequency,

    waveformPoints,
    equationLabel,
  };
}

function createWaveformPoints({
  activeSource,
  sourceVoltage,
  acPeakVoltage,
  frequency,
}: {
  activeSource: SourceType;
  sourceVoltage: number;
  acPeakVoltage: number;
  frequency: number;
}): WaveformPoint[] {
  const points: WaveformPoint[] = [];
  const totalTime = activeSource === 'AC' ? 1 / frequency : 1;
  const steps = 120;

  for (let i = 0; i <= steps; i += 1) {
    const t = (totalTime * i) / steps;

    let voltage = sourceVoltage;

    if (activeSource === 'AC') {
      voltage = acPeakVoltage * Math.sin(2 * Math.PI * frequency * t);
    }

    points.push({
      t,
      voltage,
    });
  }

  return points;
}

/* ============================================================================
   TOP VISUALIZATION
============================================================================ */

function MainVisualizationPanel({
  values,
  result,
  activeSource,
  isRunning,
  viewMode,
}: {
  values: CircuitValues;
  result: SourceResult;
  activeSource: SourceType;
  isRunning: boolean;
  viewMode: ViewMode;
}) {
  const showComparison = viewMode === 'comparison';
  const showWaveform = viewMode === 'waveform' || viewMode === 'practice';

  return (
    <section className="rounded-lg border-2 border-[#0648b8] bg-white p-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <h1 className="text-center text-[30px] font-black uppercase text-[#0648b8]">
          Selected Voltage Source
        </h1>

        <h1 className="text-center text-[30px] font-black uppercase text-[#15803d]">
          Source Behavior
        </h1>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="h-[590px] rounded-lg border border-slate-200 bg-white">
          <SelectedCircuitSvg
            values={values}
            result={result}
            activeSource={activeSource}
            isRunning={isRunning}
            viewMode={viewMode}
          />
        </div>

        <div className="h-[590px] rounded-lg border border-slate-200 bg-white">
          {showComparison ? (
            <SourceComparisonSvg values={values} activeSource={activeSource} />
          ) : showWaveform ? (
            <WaveformSvg result={result} />
          ) : (
            <SourceSummarySvg result={result} values={values} />
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   MAIN CIRCUIT SVG
============================================================================ */

function SelectedCircuitSvg({
  values,
  result,
  activeSource,
  isRunning,
  viewMode,
}: {
  values: CircuitValues;
  result: SourceResult;
  activeSource: SourceType;
  isRunning: boolean;
  viewMode: ViewMode;
}) {
  const showMovingDots = isRunning && viewMode !== 'debug';
  const showDebug = viewMode === 'debug';

  return (
    <svg
      viewBox={`${MAIN_VIEW_BOX.x} ${MAIN_VIEW_BOX.y} ${MAIN_VIEW_BOX.width} ${MAIN_VIEW_BOX.height}`}
      className="h-full w-full"
    >
      <rect x="0" y="0" width="760" height="520" fill="white" />

      <SourceHighlight activeSource={activeSource} />

      <WireLayer />
      <ComponentLayer values={values} result={result} activeSource={activeSource} />
      <NodeLayer />

      {showMovingDots && <MovingCurrentLayer result={result} />}

      <CircuitOverlay result={result} activeSource={activeSource} />

      {showDebug && <DebugTerminalLayer />}
    </svg>
  );
}

function SourceHighlight({ activeSource }: { activeSource: SourceType }) {
  const fill =
    activeSource === 'DC'
      ? COLOR.dc
      : activeSource === 'AC'
        ? COLOR.ac
        : activeSource === 'Variable'
          ? COLOR.variable
          : COLOR.battery;

  return (
    <g>
      <rect x="35" y="35" width="665" height="420" rx="20" fill={fill} opacity="0.055" />
      <text x="380" y="455" textAnchor="middle" fontSize="22" fontWeight="900" fill={fill}>
        Active source: {activeSource}
      </text>
    </g>
  );
}

function WireLayer() {
  return (
    <g>
      {WIRE_SEGMENTS.map((segment) => (
        <WireSegment
          key={segment.id}
          id={segment.id}
          from={segment.from}
          to={segment.to}
        />
      ))}
    </g>
  );
}

function ComponentLayer({
  values,
  result,
  activeSource,
}: {
  values: CircuitValues;
  result: SourceResult;
  activeSource: SourceType;
}) {
  return (
    <g>
      <SourceSymbol
        sourceType={activeSource}
        value={result.sourceVoltage}
        acRms={values.acRmsVoltage}
        acFrequency={values.acFrequency}
      />

      <SvgResistor
        id="load"
        label="R"
        sub="L"
        value={`${values.loadResistance} Ω`}
        start={COMPONENT_GEOMETRY.load.start}
        end={COMPONENT_GEOMETRY.load.end}
        labelPoint={COMPONENT_GEOMETRY.load.label}
        valuePoint={COMPONENT_GEOMETRY.load.value}
        anchor="start"
      />
    </g>
  );
}

function SourceSymbol({
  sourceType,
  value,
  acRms,
  acFrequency,
}: {
  sourceType: SourceType;
  value: number;
  acRms: number;
  acFrequency: number;
}) {
  if (sourceType === 'AC') {
    return (
      <SvgACSource
        id="source"
        value={`${acRms} Vrms`}
        frequency={`${acFrequency} Hz`}
        center={COMPONENT_GEOMETRY.source.center}
        labelPoint={COMPONENT_GEOMETRY.source.label}
        valuePoint={COMPONENT_GEOMETRY.source.value}
      />
    );
  }

  if (sourceType === 'Variable') {
    return (
      <SvgVariableSource
        id="source"
        value={`${value} V`}
        center={COMPONENT_GEOMETRY.source.center}
        labelPoint={COMPONENT_GEOMETRY.source.label}
        valuePoint={COMPONENT_GEOMETRY.source.value}
      />
    );
  }

  if (sourceType === 'Battery') {
    return (
      <SvgBatterySource
        id="source"
        value={`${BATTERY_VOLTAGE} V`}
        center={COMPONENT_GEOMETRY.source.center}
        labelPoint={COMPONENT_GEOMETRY.source.label}
        valuePoint={COMPONENT_GEOMETRY.source.value}
      />
    );
  }

  return (
    <SvgDCSource
      id="source"
      value={`${value} V`}
      center={COMPONENT_GEOMETRY.source.center}
      labelPoint={COMPONENT_GEOMETRY.source.label}
      valuePoint={COMPONENT_GEOMETRY.source.value}
    />
  );
}

function NodeLayer() {
  return (
    <g>
      <CircuitNode point={TERMINAL.loadTop} label="A" offset={{ x: -18, y: -28 }} hollow />
      <CircuitNode point={TERMINAL.loadBottom} label="B" offset={{ x: 20, y: 42 }} hollow />
      <CircuitNode point={TERMINAL.sourceTop} />
      <CircuitNode point={TERMINAL.sourceBottom} />
    </g>
  );
}

function MovingCurrentLayer({ result }: { result: SourceResult }) {
  return (
    <g>
      <MovingCharge
        path={createPath([
          TERMINAL.sourceBottom,
          TERMINAL.sourceBodyBottom,
          TERMINAL.sourceBodyTop,
          TERMINAL.sourceTop,
          TERMINAL.loadTop,
          TERMINAL.loadRTop,
          TERMINAL.loadRBottom,
          TERMINAL.loadBottom,
          TERMINAL.sourceBottom,
        ])}
        current={result.loadCurrent}
        color={COLOR.currentDot}
      />
    </g>
  );
}

function CircuitOverlay({
  result,
  activeSource,
}: {
  result: SourceResult;
  activeSource: SourceType;
}) {
  return (
    <g>
      <rect x="30" y="25" width="290" height="136" rx="10" fill="#eef2ff" stroke="#94a3b8" />
      <text x="50" y="57" fontSize="18" fontWeight="900" fill="#1e3a8a">
        VL = {result.loadVoltage.toFixed(3)} V
      </text>
      <text x="50" y="84" fontSize="18" fontWeight="900" fill="#166534">
        IL = {result.loadCurrent.toFixed(6)} A
      </text>
      <text x="50" y="111" fontSize="18" fontWeight="900" fill="#ea580c">
        PL = {result.loadPower.toFixed(4)} W
      </text>
      <text x="50" y="138" fontSize="15" fontWeight="800" fill="#0f172a">
        Source = {activeSource}
      </text>

      <rect x="380" y="25" width="320" height="86" rx="10" fill="white" stroke="#cbd5e1" />
      <circle cx="405" cy="54" r="7" fill={COLOR.currentDot} />
      <text x="427" y="60" fontSize="15" fontWeight="800" fill="#0f172a">
        Moving dot = load current
      </text>
      <circle cx="405" cy="84" r="7" fill={getSourceColor(activeSource)} />
      <text x="427" y="90" fontSize="15" fontWeight="800" fill="#0f172a">
        Highlight = selected source type
      </text>
    </g>
  );
}

/* ============================================================================
   RIGHT SVG PANELS
============================================================================ */

function SourceSummarySvg({
  values,
  result,
}: {
  values: CircuitValues;
  result: SourceResult;
}) {
  return (
    <svg viewBox="0 0 760 520" className="h-full w-full">
      <rect x="0" y="0" width="760" height="520" fill="white" />

      <text x="380" y="45" textAnchor="middle" fontSize="29" fontWeight="900" fill="#0648b8">
        Voltage Source Summary
      </text>

      <rect x="70" y="84" width="620" height="95" rx="14" fill="#eef2ff" stroke="#94a3b8" strokeWidth="3" />
      <text x="380" y="123" textAnchor="middle" fontSize="25" fontWeight="900" fill={getSourceColor(result.sourceType)}>
        {result.sourceLabel}
      </text>
      <text x="380" y="156" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a">
        {result.equationLabel}
      </text>

      <g>
        <rect x="80" y="220" width="180" height="130" rx="12" fill="#eef2ff" stroke="#94a3b8" />
        <text x="170" y="255" textAnchor="middle" fontSize="22" fontWeight="900" fill="#1e3a8a">
          Voltage
        </text>
        <text x="170" y="310" textAnchor="middle" fontSize="31" fontWeight="900" fill="#0f172a">
          {result.loadVoltage.toFixed(2)} V
        </text>
      </g>

      <g>
        <rect x="290" y="220" width="180" height="130" rx="12" fill="#ecfdf5" stroke="#86efac" />
        <text x="380" y="255" textAnchor="middle" fontSize="22" fontWeight="900" fill="#15803d">
          Current
        </text>
        <text x="380" y="310" textAnchor="middle" fontSize="31" fontWeight="900" fill="#0f172a">
          {result.loadCurrent.toFixed(4)} A
        </text>
      </g>

      <g>
        <rect x="500" y="220" width="180" height="130" rx="12" fill="#fff7ed" stroke="#fdba74" />
        <text x="590" y="255" textAnchor="middle" fontSize="22" fontWeight="900" fill="#ea580c">
          Power
        </text>
        <text x="590" y="310" textAnchor="middle" fontSize="31" fontWeight="900" fill="#0f172a">
          {result.loadPower.toFixed(3)} W
        </text>
      </g>

      <text x="380" y="410" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7c3aed">
        Load resistance RL = {values.loadResistance} Ω
      </text>

      {result.isAc && (
        <>
          <text x="380" y="445" textAnchor="middle" fontSize="18" fontWeight="800" fill="#334155">
            Vpeak = Vrms × √2 = {result.acPeakVoltage.toFixed(3)} V
          </text>
          <text x="380" y="475" textAnchor="middle" fontSize="18" fontWeight="800" fill="#334155">
            T = 1/f = {result.acPeriod.toFixed(5)} s, ω = {result.acAngularFrequency.toFixed(2)} rad/s
          </text>
        </>
      )}
    </svg>
  );
}

function SourceComparisonSvg({
  values,
  activeSource,
}: {
  values: CircuitValues;
  activeSource: SourceType;
}) {
  const items: Array<{
    type: SourceType;
    title: string;
    voltage: number;
    subtitle: string;
  }> = [
    {
      type: 'DC',
      title: 'DC Source',
      voltage: values.dcVoltage,
      subtitle: 'Constant polarity',
    },
    {
      type: 'AC',
      title: 'AC Source',
      voltage: values.acRmsVoltage,
      subtitle: `${values.acFrequency} Hz, RMS value`,
    },
    {
      type: 'Variable',
      title: 'Variable Source',
      voltage: values.variableVoltage,
      subtitle: 'Adjustable output',
    },
    {
      type: 'Battery',
      title: 'Battery Source',
      voltage: BATTERY_VOLTAGE,
      subtitle: 'Fixed 9 V source',
    },
  ];

  return (
    <svg viewBox="0 0 760 520" className="h-full w-full">
      <rect x="0" y="0" width="760" height="520" fill="white" />

      <text x="380" y="42" textAnchor="middle" fontSize="29" fontWeight="900" fill="#0648b8">
        Source Type Comparison
      </text>

      {items.map((item, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const x = 70 + col * 340;
        const y = 80 + row * 190;
        const active = activeSource === item.type;

        return (
          <g key={item.type}>
            <rect
              x={x}
              y={y}
              width="280"
              height="145"
              rx="16"
              fill={active ? '#eef2ff' : 'white'}
              stroke={getSourceColor(item.type)}
              strokeWidth={active ? 5 : 3}
            />

            <circle cx={x + 42} cy={y + 52} r="24" fill="white" stroke={getSourceColor(item.type)} strokeWidth="4" />
            <text x={x + 42} y={y + 60} textAnchor="middle" fontSize="22" fontWeight="900" fill={getSourceColor(item.type)}>
              {item.type === 'AC' ? '~' : item.type === 'Battery' ? 'B' : '+'}
            </text>

            <text x={x + 82} y={y + 42} fontSize="22" fontWeight="900" fill="#0f172a">
              {item.title}
            </text>

            <text x={x + 82} y={y + 75} fontSize="19" fontWeight="800" fill={getSourceColor(item.type)}>
              {item.voltage.toFixed(2)} V
            </text>

            <text x={x + 82} y={y + 106} fontSize="15" fontWeight="700" fill="#334155">
              {item.subtitle}
            </text>

            {active && (
              <text x={x + 140} y={y + 134} textAnchor="middle" fontSize="15" fontWeight="900" fill="#15803d">
                selected
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function WaveformSvg({ result }: { result: SourceResult }) {
  const graph = {
    x: 78,
    y: 68,
    width: 610,
    height: 320,
  };

  const maxAbsVoltage = Math.max(
    ...result.waveformPoints.map((point) => Math.abs(point.voltage)),
    1,
  );

  const timeMax = Math.max(result.waveformPoints[result.waveformPoints.length - 1]?.t ?? 1, 0.0001);

  const mapX = (t: number) => graph.x + (t / timeMax) * graph.width;
  const mapY = (voltage: number) =>
    graph.y + graph.height / 2 - (voltage / maxAbsVoltage) * (graph.height / 2 - 18);

  const waveformPolyline = result.waveformPoints
    .map((point) => `${mapX(point.t)},${mapY(point.voltage)}`)
    .join(' ');

  return (
    <svg
      viewBox={`${WAVEFORM_VIEW_BOX.x} ${WAVEFORM_VIEW_BOX.y} ${WAVEFORM_VIEW_BOX.width} ${WAVEFORM_VIEW_BOX.height}`}
      className="h-full w-full"
    >
      <rect x="0" y="0" width="760" height="520" fill="white" />

      <text x="380" y="40" textAnchor="middle" fontSize="29" fontWeight="900" fill="#0648b8">
        Voltage Waveform
      </text>

      <line
        x1={graph.x}
        y1={graph.y + graph.height / 2}
        x2={graph.x + graph.width}
        y2={graph.y + graph.height / 2}
        stroke="black"
        strokeWidth="3"
      />

      <line
        x1={graph.x}
        y1={graph.y}
        x2={graph.x}
        y2={graph.y + graph.height}
        stroke="black"
        strokeWidth="3"
      />

      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <g key={ratio}>
          <line
            x1={graph.x + ratio * graph.width}
            y1={graph.y}
            x2={graph.x + ratio * graph.width}
            y2={graph.y + graph.height}
            stroke="#f1f5f9"
            strokeWidth="2"
          />
          <text
            x={graph.x + ratio * graph.width}
            y={graph.y + graph.height + 28}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#334155"
          >
            {(timeMax * ratio).toFixed(result.isAc ? 4 : 2)} s
          </text>
        </g>
      ))}

      {[-1, -0.5, 0.5, 1].map((ratio) => (
        <g key={ratio}>
          <line
            x1={graph.x}
            y1={mapY(maxAbsVoltage * ratio)}
            x2={graph.x + graph.width}
            y2={mapY(maxAbsVoltage * ratio)}
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          <text
            x={graph.x - 12}
            y={mapY(maxAbsVoltage * ratio) + 5}
            textAnchor="end"
            fontSize="13"
            fontWeight="700"
            fill="#334155"
          >
            {(maxAbsVoltage * ratio).toFixed(1)}
          </text>
        </g>
      ))}

      <polyline
        points={waveformPolyline}
        fill="none"
        stroke={getSourceColor(result.sourceType)}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text x="380" y="470" textAnchor="middle" fontSize="20" fontWeight="900" fill="#0f172a">
        Time
      </text>

      <text
        x="22"
        y="245"
        textAnchor="middle"
        transform="rotate(-90 22 245)"
        fontSize="20"
        fontWeight="900"
        fill="#0f172a"
      >
        Voltage V(t)
      </text>

      <rect x="445" y="58" width="255" height="126" rx="10" fill="white" stroke="#cbd5e1" />

      <text x="465" y="90" fontSize="16" fontWeight="900" fill="#0f172a">
        Source = {result.sourceType}
      </text>

      <text x="465" y="118" fontSize="16" fontWeight="900" fill="#0f172a">
        Vrms/DC = {result.sourceVoltage.toFixed(3)} V
      </text>

      {result.isAc ? (
        <>
          <text x="465" y="146" fontSize="16" fontWeight="900" fill="#0f172a">
            Vpeak = {result.acPeakVoltage.toFixed(3)} V
          </text>
          <text x="465" y="174" fontSize="16" fontWeight="900" fill="#0f172a">
            f = {result.acFrequency.toFixed(2)} Hz
          </text>
        </>
      ) : (
        <text x="465" y="146" fontSize="16" fontWeight="900" fill="#0f172a">
          Constant source voltage
        </text>
      )}
    </svg>
  );
}

/* ============================================================================
   REUSABLE SVG BLOCKS
============================================================================ */

function WireSegment({
  id,
  from,
  to,
}: {
  id: WireId;
  from: Point;
  to: Point;
}) {
  const offset = WIRE_OFFSET[id];
  const p1 = addPoint(from, offset);
  const p2 = addPoint(to, offset);

  return (
    <line
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
      stroke={COLOR.wire}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
    />
  );
}

function SvgResistor({
  id,
  label,
  sub,
  value,
  start,
  end,
  labelPoint,
  valuePoint,
  anchor = 'middle',
}: {
  id: ComponentId;
  label: string;
  sub: string;
  value: string;
  start: Point;
  end: Point;
  labelPoint: Point;
  valuePoint: Point;
  anchor?: 'start' | 'middle' | 'end';
}) {
  const offset = COMPONENT_OFFSET[id];
  const labelOffset = LABEL_OFFSET[id];

  const startPoint = addPoint(start, offset);
  const endPoint = addPoint(end, offset);
  const points = createResistorPolyline(startPoint, endPoint);

  return (
    <g>
      <polyline
        points={points}
        fill="none"
        stroke={COLOR.resistor}
        strokeWidth={COMPONENT.resistor.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <SubscriptText
        x={labelPoint.x + labelOffset.x}
        y={labelPoint.y + labelOffset.y}
        text={label}
        sub={sub}
        size={LABEL.title}
        subSize={LABEL.sub}
        anchor={anchor}
        weight={900}
      />

      <SvgText
        x={valuePoint.x + labelOffset.x}
        y={valuePoint.y + labelOffset.y}
        size={LABEL.value}
        anchor={anchor}
        weight={900}
      >
        {value}
      </SvgText>
    </g>
  );
}

function SvgDCSource({
  id,
  value,
  center,
  labelPoint,
  valuePoint,
}: {
  id: ComponentId;
  value: string;
  center: Point;
  labelPoint: Point;
  valuePoint: Point;
}) {
  const offset = COMPONENT_OFFSET[id];
  const labelOffset = LABEL_OFFSET[id];
  const c = addPoint(center, offset);

  return (
    <g>
      <circle
        cx={c.x}
        cy={c.y}
        r={COMPONENT.source.radius}
        fill="white"
        stroke="black"
        strokeWidth={COMPONENT.source.strokeWidth}
      />

      <text x={c.x} y={c.y - 9} textAnchor="middle" fill={COLOR.sourcePositive} fontSize="36" fontWeight="900">
        +
      </text>

      <text x={c.x} y={c.y + 30} textAnchor="middle" fill={COLOR.sourceNegative} fontSize="36" fontWeight="900">
        −
      </text>

      <SubscriptText
        x={labelPoint.x + labelOffset.x}
        y={labelPoint.y + labelOffset.y}
        text="V"
        sub="DC"
        size={LABEL.title}
        subSize={LABEL.sub}
        anchor="start"
        italic
      />

      <SvgText
        x={valuePoint.x + labelOffset.x}
        y={valuePoint.y + labelOffset.y}
        size={LABEL.value}
        anchor="start"
        weight={900}
      >
        {value}
      </SvgText>
    </g>
  );
}

function SvgACSource({
  id,
  value,
  frequency,
  center,
  labelPoint,
  valuePoint,
}: {
  id: ComponentId;
  value: string;
  frequency: string;
  center: Point;
  labelPoint: Point;
  valuePoint: Point;
}) {
  const offset = COMPONENT_OFFSET[id];
  const labelOffset = LABEL_OFFSET[id];
  const c = addPoint(center, offset);

  return (
    <g>
      <circle
        cx={c.x}
        cy={c.y}
        r={COMPONENT.source.radius}
        fill="white"
        stroke="black"
        strokeWidth={COMPONENT.source.strokeWidth}
      />

      <path
        d={`M${c.x - 28} ${c.y} C${c.x - 18} ${c.y - 22}, ${c.x - 8} ${c.y - 22}, ${c.x} ${c.y} C${c.x + 8} ${c.y + 22}, ${c.x + 18} ${c.y + 22}, ${c.x + 28} ${c.y}`}
        fill="none"
        stroke={COLOR.ac}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <SubscriptText
        x={labelPoint.x + labelOffset.x}
        y={labelPoint.y + labelOffset.y}
        text="V"
        sub="AC"
        size={LABEL.title}
        subSize={LABEL.sub}
        anchor="start"
        italic
      />

      <SvgText
        x={valuePoint.x + labelOffset.x}
        y={valuePoint.y + labelOffset.y}
        size={LABEL.value}
        anchor="start"
        weight={900}
      >
        {value}
      </SvgText>

      <SvgText
        x={valuePoint.x + labelOffset.x}
        y={valuePoint.y + 30 + labelOffset.y}
        size={18}
        anchor="start"
        weight={800}
      >
        {frequency}
      </SvgText>
    </g>
  );
}

function SvgVariableSource({
  id,
  value,
  center,
  labelPoint,
  valuePoint,
}: {
  id: ComponentId;
  value: string;
  center: Point;
  labelPoint: Point;
  valuePoint: Point;
}) {
  const offset = COMPONENT_OFFSET[id];
  const labelOffset = LABEL_OFFSET[id];
  const c = addPoint(center, offset);

  return (
    <g>
      <circle
        cx={c.x}
        cy={c.y}
        r={COMPONENT.source.radius}
        fill="white"
        stroke="black"
        strokeWidth={COMPONENT.source.strokeWidth}
      />

      <text x={c.x} y={c.y - 9} textAnchor="middle" fill={COLOR.sourcePositive} fontSize="34" fontWeight="900">
        +
      </text>

      <text x={c.x} y={c.y + 30} textAnchor="middle" fill={COLOR.sourceNegative} fontSize="34" fontWeight="900">
        −
      </text>

      <line
        x1={c.x - 34}
        y1={c.y + 34}
        x2={c.x + 38}
        y2={c.y - 38}
        stroke={COLOR.variable}
        strokeWidth="4"
      />

      <polygon
        points={`${c.x + 45},${c.y - 45} ${c.x + 30},${c.y - 12} ${c.x + 12},${c.y - 30}`}
        fill={COLOR.variable}
      />

      <SubscriptText
        x={labelPoint.x + labelOffset.x}
        y={labelPoint.y + labelOffset.y}
        text="V"
        sub="VAR"
        size={LABEL.title}
        subSize={LABEL.sub}
        anchor="start"
        italic
      />

      <SvgText
        x={valuePoint.x + labelOffset.x}
        y={valuePoint.y + labelOffset.y}
        size={LABEL.value}
        anchor="start"
        weight={900}
      >
        {value}
      </SvgText>
    </g>
  );
}

function SvgBatterySource({
  id,
  value,
  center,
  labelPoint,
  valuePoint,
}: {
  id: ComponentId;
  value: string;
  center: Point;
  labelPoint: Point;
  valuePoint: Point;
}) {
  const offset = COMPONENT_OFFSET[id];
  const labelOffset = LABEL_OFFSET[id];
  const c = addPoint(center, offset);

  return (
    <g>
      <line x1={c.x - 35} y1={c.y - 36} x2={c.x + 35} y2={c.y - 36} stroke="black" strokeWidth="6" />
      <line x1={c.x - 24} y1={c.y - 8} x2={c.x + 24} y2={c.y - 8} stroke="black" strokeWidth="6" />
      <line x1={c.x - 13} y1={c.y + 20} x2={c.x + 13} y2={c.y + 20} stroke="black" strokeWidth="6" />

      <line x1={c.x} y1={c.y - 80} x2={c.x} y2={c.y - 36} stroke="black" strokeWidth="4" />
      <line x1={c.x} y1={c.y + 20} x2={c.x} y2={c.y + 78} stroke="black" strokeWidth="4" />

      <text x={c.x + 43} y={c.y - 32} fill={COLOR.sourcePositive} fontSize="29" fontWeight="900">
        +
      </text>

      <text x={c.x + 43} y={c.y + 27} fill={COLOR.sourceNegative} fontSize="29" fontWeight="900">
        −
      </text>

      <SubscriptText
        x={labelPoint.x + labelOffset.x}
        y={labelPoint.y + labelOffset.y}
        text="V"
        sub="BAT"
        size={LABEL.title}
        subSize={LABEL.sub}
        anchor="start"
        italic
      />

      <SvgText
        x={valuePoint.x + labelOffset.x}
        y={valuePoint.y + labelOffset.y}
        size={LABEL.value}
        anchor="start"
        weight={900}
      >
        {value}
      </SvgText>
    </g>
  );
}

function CircuitNode({
  point,
  label,
  offset,
  hollow = false,
}: {
  point: Point;
  label?: string;
  offset?: Point;
  hollow?: boolean;
}) {
  return (
    <g>
      <circle
        cx={point.x}
        cy={point.y}
        r={NODE.radius}
        fill={hollow ? 'white' : COLOR.node}
        stroke={COLOR.node}
        strokeWidth={hollow ? 4 : 0}
      />

      {label && offset && (
        <SvgText
          x={point.x + offset.x}
          y={point.y + offset.y}
          size={LABEL.node}
          color={COLOR.nodeLabel}
          anchor="start"
          weight={900}
        >
          {label}
        </SvgText>
      )}
    </g>
  );
}

function MovingCharge({
  path,
  current,
  reverse = false,
  color,
  radius = COMPONENT.movingCharge.radius,
}: {
  path: string;
  current: number;
  reverse?: boolean;
  color: string;
  radius?: number;
}) {
  const speed = clamp(0.9, 4.7 - Math.abs(current) * 60, 4.1);

  return (
    <circle r={radius} fill={color} opacity="0.9">
      <animateMotion
        dur={`${speed}s`}
        repeatCount="indefinite"
        path={path}
        keyPoints={reverse ? '1;0' : '0;1'}
        keyTimes="0;1"
        calcMode="linear"
      />
    </circle>
  );
}

function DebugTerminalLayer() {
  return (
    <g>
      {DEBUG_TERMINALS.map(([label, point]) => (
        <g key={label}>
          <circle
            cx={point.x + DEBUG_TERMINAL_OFFSET.x}
            cy={point.y + DEBUG_TERMINAL_OFFSET.y}
            r="8"
            fill={COLOR.debug}
          />

          <text
            x={point.x + 10 + DEBUG_TERMINAL_OFFSET.x}
            y={point.y - 10 + DEBUG_TERMINAL_OFFSET.y}
            fontSize="12"
            fontWeight="900"
            fill="#9a3412"
          >
            {label}
          </text>
        </g>
      ))}
    </g>
  );
}

function SvgText({
  x,
  y,
  children,
  size = 20,
  color = 'black',
  anchor = 'middle',
  weight = 800,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  weight?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontWeight={weight}>
      {children}
    </text>
  );
}

function SubscriptText({
  x,
  y,
  text,
  sub,
  size,
  subSize,
  color = 'black',
  anchor = 'middle',
  italic = false,
  weight = 800,
}: {
  x: number;
  y: number;
  text: string;
  sub: string;
  size: number;
  subSize: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  italic?: boolean;
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={color}
      fontFamily={italic ? 'Times New Roman' : undefined}
      fontStyle={italic ? 'italic' : undefined}
      fontSize={size}
      fontWeight={weight}
    >
      {text}
      <tspan baselineShift="sub" fontSize={subSize}>
        {sub}
      </tspan>
    </text>
  );
}

/* ============================================================================
   RIGHT CONCEPT PANEL
============================================================================ */

function ConceptPanel({
  values,
  result,
  viewMode,
}: {
  values: CircuitValues;
  result: SourceResult;
  viewMode: ViewMode;
}) {
  return (
    <section className="rounded-lg border-2 border-[#0648b8] bg-white">
      <div className="rounded-t-md bg-gradient-to-r from-[#0648b8] to-[#0b58c6] py-4 text-center text-[31px] font-black uppercase tracking-wide text-white">
        Voltage Sources
      </div>

      <div className="space-y-5 px-6 py-5 text-[22px] leading-snug">
        <ConceptItem number={1}>A voltage source maintains a specified terminal voltage.</ConceptItem>
        <ConceptItem number={2}>DC and battery sources keep constant polarity.</ConceptItem>
        <ConceptItem number={3}>AC source changes polarity periodically with frequency.</ConceptItem>
        <ConceptItem number={4}>Variable source can be adjusted to different voltages.</ConceptItem>
        <ConceptItem number={5}>Load current depends on source voltage and load resistance.</ConceptItem>
      </div>

      <div className="mx-5 h-[2px] bg-[#8bb8ff]" />

      <div className="mx-auto w-fit rounded-b-lg bg-[#e6f2ff] px-8 py-3 text-[23px] font-black text-[#0648b8]">
        Live Equations
      </div>

      <div className="px-6 py-4 text-[17px] font-bold">
        <EquationBlock title="Ohm's law">
          I<sub>L</sub> = V<sub>L</sub> / R<sub>L</sub>
        </EquationBlock>

        <EquationBlock title="Load power">
          P<sub>L</sub> = V<sub>L</sub> × I<sub>L</sub>
        </EquationBlock>

        <EquationBlock title="AC peak voltage">
          V<sub>peak</sub> = V<sub>rms</sub> × √2
        </EquationBlock>

        <EquationBlock title="AC frequency relation">
          T = 1 / f, ω = 2πf
        </EquationBlock>

        <div className="mt-5 rounded-lg border-2 border-[#3a7bdc] bg-white px-5 py-3">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-serif text-[20px] italic">
            <span>Source = {result.sourceType}</span>
            <span>VL = {result.loadVoltage.toFixed(3)} V</span>
            <span>IL = {result.loadCurrent.toFixed(5)} A</span>
            <span>PL = {result.loadPower.toFixed(4)} W</span>
            <span>RL = {values.loadResistance} Ω</span>
            <span>Mode: {viewMode}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function EquationBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h3 className="text-[21px] font-black text-[#0648b8]">{title}:</h3>

      <div className="mt-2 rounded-lg bg-[#f8fbff] p-3 font-serif text-[20px] font-bold italic">
        {children}
      </div>
    </div>
  );
}

function ConceptItem({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[44px_1fr] items-center gap-4">
      <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#0648b8] text-[24px] font-black text-white">
        {number}
      </div>
      <p>{children}</p>
    </div>
  );
}

/* ============================================================================
   BOTTOM PANELS
============================================================================ */

function ComponentValues({
  values,
  updateValue,
}: {
  values: CircuitValues;
  updateValue: (key: keyof CircuitValues, value: number) => void;
}) {
  return (
    <section className="min-h-[330px] border-r-2 border-[#cfd4dc] bg-white p-4">
      <h2 className="text-center text-[22px] font-black uppercase text-[#0648b8]">
        Component Values
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3">
        <ValueInput
          label="DC Voltage"
          value={values.dcVoltage}
          unit="V"
          min={0}
          step={1}
          onChange={(value) => updateValue('dcVoltage', value)}
        />

        <ValueInput
          label="AC RMS Voltage"
          value={values.acRmsVoltage}
          unit="V"
          min={0}
          step={1}
          onChange={(value) => updateValue('acRmsVoltage', value)}
        />

        <ValueInput
          label="AC Frequency"
          value={values.acFrequency}
          unit="Hz"
          min={0.1}
          step={1}
          onChange={(value) => updateValue('acFrequency', value)}
        />

        <ValueInput
          label="Variable Voltage"
          value={values.variableVoltage}
          unit="V"
          min={0}
          max={24}
          step={1}
          onChange={(value) => updateValue('variableVoltage', value)}
        />

        <ValueInput
          label="Load Resistance"
          value={values.loadResistance}
          unit="Ω"
          min={0.1}
          step={1}
          onChange={(value) => updateValue('loadResistance', value)}
        />
      </div>
    </section>
  );
}

function SimulationControls({
  status,
  activeSource,
  viewMode,
  setActiveSource,
  setViewMode,
  onStart,
  onPause,
  onReset,
  onGenerateProblem,
}: {
  status: Status;
  activeSource: SourceType;
  viewMode: ViewMode;
  setActiveSource: (source: SourceType) => void;
  setViewMode: (mode: ViewMode) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onGenerateProblem: () => void;
}) {
  return (
    <section className="min-h-[330px] border-r-2 border-[#cfd4dc] bg-white p-4">
      <h2 className="text-center text-[22px] font-black uppercase text-[#0648b8]">
        Controls
      </h2>

      <div className="mt-5 flex justify-center gap-3">
        <ControlButton color="green" icon="▶" label="Start" onClick={onStart} />
        <ControlButton color="blue" icon="Ⅱ" label="Pause" onClick={onPause} />
        <ControlButton color="yellow" icon="↻" label="Reset" onClick={onReset} />
      </div>

      <div className="mt-5 rounded-lg border border-[#c8d5e8] bg-white px-5 py-4">
        <div className="flex items-center gap-5 text-[22px]">
          <span className="font-black">Status:</span>
          <span className="font-black text-[#118225]">{status}</span>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-300 p-3">
        <h3 className="text-center text-[18px] font-black text-[#0648b8]">
          Active Source
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <SourceButton label="DC" active={activeSource === 'DC'} onClick={() => setActiveSource('DC')} />
          <SourceButton label="AC" active={activeSource === 'AC'} onClick={() => setActiveSource('AC')} />
          <SourceButton label="Variable" active={activeSource === 'Variable'} onClick={() => setActiveSource('Variable')} />
          <SourceButton label="Battery" active={activeSource === 'Battery'} onClick={() => setActiveSource('Battery')} />
        </div>
      </div>

      <button
        onClick={onGenerateProblem}
        className="mt-3 w-full rounded-lg bg-gradient-to-b from-[#7c3aed] to-[#5b21b6] px-4 py-3 text-[17px] font-black text-white"
      >
        Generate Practice Problem
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ModeButton label="Circuit" active={viewMode === 'selectedCircuit'} onClick={() => setViewMode('selectedCircuit')} />
        <ModeButton label="Compare" active={viewMode === 'comparison'} onClick={() => setViewMode('comparison')} />
        <ModeButton label="Waveform" active={viewMode === 'waveform'} onClick={() => setViewMode('waveform')} />
        <ModeButton label="Practice" active={viewMode === 'practice'} onClick={() => setViewMode('practice')} />
        <ModeButton label="Debug" active={viewMode === 'debug'} onClick={() => setViewMode('debug')} />
      </div>
    </section>
  );
}

function ResultsPanel({ result }: { result: SourceResult }) {
  return (
    <section className="min-h-[330px] bg-white p-4">
      <h2 className="text-center text-[23px] font-black uppercase text-[#0648b8]">
        Results
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ResultCard label="VL" value={`${result.loadVoltage.toFixed(3)} V`} color="blue" />
        <ResultCard label="IL" value={`${result.loadCurrent.toFixed(6)} A`} color="green" />
        <ResultCard label="PL" value={`${result.loadPower.toFixed(4)} W`} color="orange" />
      </div>

      <div className="mt-5 rounded-lg border-2 border-[#8bb8ff] bg-white px-5 py-4 text-[16px] font-bold">
        <p>Source type = {result.sourceLabel}</p>
        <p>Equation = {result.equationLabel}</p>
        <p>Load resistance = {result.resistance.toFixed(3)} Ω</p>

        {result.isAc && (
          <>
            <p>Vpeak = {result.acPeakVoltage.toFixed(5)} V</p>
            <p>Period = {result.acPeriod.toFixed(6)} s</p>
            <p>Angular frequency = {result.acAngularFrequency.toFixed(5)} rad/s</p>
          </>
        )}
      </div>
    </section>
  );
}

/* ============================================================================
   LEARNING PANEL
============================================================================ */

function LearningPanel({
  values,
  result,
  viewMode,
  practiceInputs,
  setPracticeInputs,
  submitted,
  setSubmitted,
}: {
  values: CircuitValues;
  result: SourceResult;
  viewMode: ViewMode;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section className="mt-4 rounded-lg border-2 border-[#0648b8] bg-white p-5">
      <h2 className="text-center text-[24px] font-black uppercase text-[#0648b8]">
        Live Voltage Source Math Solver
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <StepPanel values={values} result={result} />
        <SourceDetailsPanel result={result} />
      </div>

      {viewMode === 'practice' && (
        <PracticePanel
          result={result}
          practiceInputs={practiceInputs}
          setPracticeInputs={setPracticeInputs}
          submitted={submitted}
          setSubmitted={setSubmitted}
        />
      )}
    </section>
  );
}

function StepPanel({
  values,
  result,
}: {
  values: CircuitValues;
  result: SourceResult;
}) {
  return (
    <div className="rounded-lg bg-[#eef6ff] p-5">
      <h3 className="text-[21px] font-black text-[#0648b8]">
        Step-by-step Calculation
      </h3>

      <div className="mt-4 space-y-3 rounded-lg bg-white p-4 text-[16px] font-bold">
        <p>Selected source = {result.sourceLabel}</p>
        <p>Load voltage VL = source voltage = {result.loadVoltage.toFixed(6)} V</p>

        <div className="h-px bg-slate-300" />

        <p>IL = VL / RL</p>
        <p>
          IL = {result.loadVoltage.toFixed(6)} / {values.loadResistance} = {result.loadCurrent.toFixed(8)} A
        </p>

        <div className="h-px bg-slate-300" />

        <p>PL = VL × IL</p>
        <p>
          PL = {result.loadVoltage.toFixed(6)} × {result.loadCurrent.toFixed(8)} = {result.loadPower.toFixed(8)} W
        </p>
      </div>
    </div>
  );
}

function SourceDetailsPanel({ result }: { result: SourceResult }) {
  return (
    <div className="rounded-lg bg-[#f4efff] p-5">
      <h3 className="text-[21px] font-black text-[#5b21b6]">
        Source Details
      </h3>

      <div className="mt-4 space-y-3 rounded-lg bg-white p-4 text-[16px] font-bold">
        <p>Source type = {result.sourceType}</p>
        <p>RMS/DC voltage = {result.sourceVoltage.toFixed(6)} V</p>
        <p>Load current = {result.loadCurrent.toFixed(8)} A</p>
        <p>Load power = {result.loadPower.toFixed(8)} W</p>

        <div className="h-px bg-slate-300" />

        {result.isAc ? (
          <>
            <p>Vpeak = Vrms × √2 = {result.acPeakVoltage.toFixed(8)} V</p>
            <p>Frequency f = {result.acFrequency.toFixed(4)} Hz</p>
            <p>Period T = 1/f = {result.acPeriod.toFixed(8)} s</p>
            <p>Angular frequency ω = 2πf = {result.acAngularFrequency.toFixed(8)} rad/s</p>
          </>
        ) : (
          <p>This source gives a constant voltage in the selected circuit.</p>
        )}
      </div>
    </div>
  );
}

function PracticePanel({
  result,
  practiceInputs,
  setPracticeInputs,
  submitted,
  setSubmitted,
}: {
  result: SourceResult;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const checks = {
    loadVoltage: isClose(practiceInputs.loadVoltage, result.loadVoltage, ANSWER_TOLERANCE.voltage),
    loadCurrent: isClose(practiceInputs.loadCurrent, result.loadCurrent, ANSWER_TOLERANCE.current),
    loadPower: isClose(practiceInputs.loadPower, result.loadPower, ANSWER_TOLERANCE.power),
    sourceType: practiceInputs.sourceType.trim().toLowerCase() === result.sourceType.toLowerCase(),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const updateInput = (key: keyof PracticeInputs, value: string) => {
    setPracticeInputs((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSubmitted(false);
  };

  return (
    <div className="mt-5 rounded-xl border-2 border-slate-300 bg-slate-50 p-5">
      <h3 className="text-center text-[22px] font-black uppercase text-[#0648b8]">
        Practice Mode
      </h3>

      <p className="mt-2 text-center font-bold text-slate-700">
        Solve VL, IL, PL and identify the active source type.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <AnswerInput
          label="VL"
          unit="V"
          value={practiceInputs.loadVoltage}
          correct={checks.loadVoltage}
          submitted={submitted}
          onChange={(value) => updateInput('loadVoltage', value)}
        />

        <AnswerInput
          label="IL"
          unit="A"
          value={practiceInputs.loadCurrent}
          correct={checks.loadCurrent}
          submitted={submitted}
          onChange={(value) => updateInput('loadCurrent', value)}
        />

        <AnswerInput
          label="PL"
          unit="W"
          value={practiceInputs.loadPower}
          correct={checks.loadPower}
          submitted={submitted}
          onChange={(value) => updateInput('loadPower', value)}
        />

        <AnswerInput
          label="Type"
          unit="DC/AC/Variable/Battery"
          value={practiceInputs.sourceType}
          correct={checks.sourceType}
          submitted={submitted}
          onChange={(value) => updateInput('sourceType', value)}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <button
          onClick={() => setSubmitted(true)}
          className="flex-1 rounded-lg bg-[#0648b8] px-5 py-3 text-[17px] font-black text-white"
        >
          Submit Answer
        </button>

        <button
          onClick={() => {
            setPracticeInputs(EMPTY_PRACTICE);
            setSubmitted(false);
          }}
          className="flex-1 rounded-lg bg-slate-200 px-5 py-3 text-[17px] font-black text-[#0648b8]"
        >
          Clear
        </button>
      </div>

      {submitted && (
        <div className="mt-5 rounded-lg border-2 border-slate-300 bg-white p-4">
          <h4 className="text-center text-[20px] font-black text-[#0648b8]">
            Score: {score}/4
          </h4>

          <div className="mt-3 grid grid-cols-1 gap-2 text-center text-[16px] font-bold md:grid-cols-4">
            <p>VL = {result.loadVoltage.toFixed(3)} V</p>
            <p>IL = {result.loadCurrent.toFixed(6)} A</p>
            <p>PL = {result.loadPower.toFixed(6)} W</p>
            <p>Type = {result.sourceType}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   SMALL UI BLOCKS
============================================================================ */

function ValueInput({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max?: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-[150px_1fr_48px] items-center gap-3 text-[18px]">
      <label className="font-bold">{label}</label>

      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-[38px] rounded-md border border-gray-400 bg-white px-2 text-center text-[18px] outline-none focus:border-[#0648b8]"
      />

      <span className="text-[17px]">{unit}</span>
    </div>
  );
}

function ControlButton({
  color,
  icon,
  label,
  onClick,
}: {
  color: 'green' | 'blue' | 'yellow';
  icon: string;
  label: string;
  onClick: () => void;
}) {
  const colorClass =
    color === 'green'
      ? 'bg-gradient-to-b from-[#12a63a] to-[#0a8a29] text-white'
      : color === 'blue'
        ? 'bg-gradient-to-b from-[#0b64d8] to-[#064bb4] text-white'
        : 'bg-gradient-to-b from-[#ffc51c] to-[#f0a400] text-black';

  return (
    <button
      onClick={onClick}
      className={`flex h-[60px] w-[112px] items-center justify-center gap-2 rounded-xl border-2 border-black/20 text-[19px] font-bold shadow-md ${colorClass}`}
    >
      <span className="text-[30px] leading-none">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function SourceButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-sm font-black ${
        active ? 'bg-[#0648b8] text-white' : 'bg-white text-[#0648b8] ring-1 ring-slate-300'
      }`}
    >
      {label}
    </button>
  );
}

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-sm font-black ${
        active ? 'bg-[#15803d] text-white' : 'bg-white text-[#15803d] ring-1 ring-slate-300'
      }`}
    >
      {label}
    </button>
  );
}

function ResultCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: 'blue' | 'green' | 'orange';
}) {
  const colorClass =
    color === 'blue'
      ? 'text-[#0648b8]'
      : color === 'green'
        ? 'text-[#15803d]'
        : 'text-[#ea580c]';

  return (
    <div className="rounded-lg border-2 border-[#4b9f5a] bg-[#f8fff8] px-3 py-4 text-center">
      <p className={`font-serif text-[34px] font-bold italic ${colorClass}`}>
        {label}
      </p>

      <p className="mt-2 text-[22px] font-black">{value}</p>
    </div>
  );
}

function AnswerInput({
  label,
  unit,
  value,
  correct,
  submitted,
  onChange,
}: {
  label: string;
  unit: string;
  value: string;
  correct: boolean;
  submitted: boolean;
  onChange: (value: string) => void;
}) {
  const statusClass =
    !submitted
      ? 'border-slate-300'
      : correct
        ? 'border-green-500 bg-green-50'
        : 'border-red-500 bg-red-50';

  return (
    <label className={`rounded-lg border-2 p-4 ${statusClass}`}>
      <div className="mb-2 flex justify-between gap-2 font-black text-[#0648b8]">
        <span>{label}</span>
        <span className="text-xs">{unit}</span>
      </div>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Enter ${label}`}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-center font-bold outline-none"
      />

      {submitted && (
        <p className={`mt-2 text-center text-sm font-black ${correct ? 'text-green-700' : 'text-red-700'}`}>
          {correct ? 'Correct' : 'Wrong'}
        </p>
      )}
    </label>
  );
}

/* ============================================================================
   HELPERS
============================================================================ */

function addPoint(point: Point, offset: Point): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function createPath(points: Point[]) {
  if (points.length === 0) return '';

  const [first, ...rest] = points;

  return [`M${first.x} ${first.y}`, ...rest.map((point) => `L${point.x} ${point.y}`)].join(' ');
}

function createResistorPolyline(start: Point, end: Point) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const length = horizontal ? dx : dy;
  const sign = Math.sign(length) || 1;
  const absLength = Math.abs(length);

  const leadLength = COMPONENT.resistor.leadLength;
  const amplitude = COMPONENT.resistor.amplitude;
  const zigzagCount = COMPONENT.resistor.zigzags * 2;

  const bodyStart = leadLength;
  const bodyEnd = absLength - leadLength;
  const bodyLength = bodyEnd - bodyStart;

  const localPoints: Point[] = [];

  localPoints.push({ x: 0, y: 0 });
  localPoints.push({ x: bodyStart, y: 0 });

  for (let i = 1; i < zigzagCount; i += 1) {
    localPoints.push({
      x: bodyStart + (bodyLength / zigzagCount) * i,
      y: i % 2 === 1 ? -amplitude : amplitude,
    });
  }

  localPoints.push({ x: bodyEnd, y: 0 });
  localPoints.push({ x: absLength, y: 0 });

  const mapped = localPoints.map((point) => {
    if (horizontal) {
      return `${start.x + sign * point.x},${start.y + point.y}`;
    }

    return `${start.x + point.y},${start.y + sign * point.x}`;
  });

  return mapped.join(' ');
}

function clamp(min: number, value: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isClose(input: string, correct: number, tolerance: number) {
  const parsed = Number(input);

  if (!Number.isFinite(parsed)) {
    return false;
  }

  return Math.abs(parsed - correct) <= tolerance;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStep(min: number, max: number, step: number) {
  const count = Math.round((max - min) / step);
  return Number((min + randomInt(0, count) * step).toFixed(6));
}

function getSourceColor(source: SourceType) {
  if (source === 'DC') return COLOR.dc;
  if (source === 'AC') return COLOR.ac;
  if (source === 'Variable') return COLOR.variable;
  return COLOR.battery;
}