'use client';

import React, { useMemo, useState } from 'react';

/* ============================================================================
   TYPES
============================================================================ */

type Status = 'Ready' | 'Running' | 'Paused';

type ViewMode =
  | 'simulation'
  | 'powerCurve'
  | 'matching'
  | 'practice'
  | 'debug';

type Point = {
  x: number;
  y: number;
};

type CircuitValues = {
  rTh: number;
  rLoad: number;
  vTh: number;
};

type CurvePoint = {
  rLoad: number;
  power: number;
};

type MptResult = {
  current: number;
  loadVoltage: number;
  loadPower: number;
  maxPower: number;
  optimalLoad: number;
  sourcePower: number;
  efficiency: number;
  powerRatio: number;
  matchingError: number;
  matchingPercentError: number;
  conditionText: string;
  curveMaxResistance: number;
  curvePoints: CurvePoint[];
  error: string | null;
};

type PracticeInputs = {
  rLoadOpt: string;
  iLoadMax: string;
  pMax: string;
};

type ComponentId = 'vth' | 'rth' | 'load';

type WireId =
  | 'sourceTopToVoltageTop'
  | 'voltageBottomToSourceBottom'
  | 'sourceTopToRth'
  | 'rthToA'
  | 'aToLoadTop'
  | 'loadTopToLoadRTop'
  | 'loadRBottomToLoadBottom'
  | 'loadBottomToSourceBottom';

/* ============================================================================
   CONSTANTS
============================================================================ */

const DEFAULT_VALUES: CircuitValues = {
  rTh: 100,
  rLoad: 100,
  vTh: 12,
};

const EMPTY_PRACTICE: PracticeInputs = {
  rLoadOpt: '',
  iLoadMax: '',
  pMax: '',
};

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const BASE_WIRE_WIDTH = 4;

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1260,
  height: 720,
};

const CIRCUIT_VIEW_BOX = {
  x: 0,
  y: 0,
  width: 760,
  height: 520,
};

const GRAPH_VIEW_BOX = {
  x: 0,
  y: 0,
  width: 760,
  height: 520,
};

const SCALE = {
  CANVAS: CIRCUIT_CANVAS_SCALE,
  COMPONENT: CIRCUIT_COMPONENT_SCALE,
  WIRE: CIRCUIT_WIRE_SCALE,
};

const COLOR = {
  wire: '#000000',
  resistor: '#111827',

  sourcePositive: '#e00000',
  sourceNegative: '#111827',

  node: '#000000',
  nodeLabel: '#0648b8',

  power: '#15803d',
  maxPower: '#ea580c',
  curve: '#0648b8',
  matching: '#7c3aed',

  currentDot: '#16a34a',
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
  voltageSource: {
    radius: 42 * SCALE.COMPONENT,
    strokeWidth: 4 * SCALE.COMPONENT,
  },
  movingCharge: {
    radius: 8 * SCALE.COMPONENT,
  },
};

const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.WIRE,
  highlightWidth: 14 * SCALE.WIRE,
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
  resistance: 0.05,
  current: 0.001,
  power: 0.01,
};

/* ============================================================================
   OFFSETS
============================================================================ */

const COMPONENT_OFFSET: Record<ComponentId, Point> = {
  vth: { x: 0, y: 0 },
  rth: { x: 0, y: 0 },
  load: { x: 0, y: 0 },
};

const LABEL_OFFSET: Record<ComponentId, Point> = {
  vth: { x: 0, y: 0 },
  rth: { x: 0, y: 0 },
  load: { x: 0, y: 0 },
};

const WIRE_OFFSET: Record<WireId, Point> = {
  sourceTopToVoltageTop: { x: 0, y: 0 },
  voltageBottomToSourceBottom: { x: 0, y: 0 },
  sourceTopToRth: { x: 0, y: 0 },
  rthToA: { x: 0, y: 0 },
  aToLoadTop: { x: 0, y: 0 },
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
  voltageTop: { x: 120, y: 205 },
  voltageCenter: { x: 120, y: 250 },
  voltageBottom: { x: 120, y: 295 },
  sourceBottom: { x: 120, y: 410 },

  rthLeft: { x: 220, y: 95 },
  rthRight: { x: 360, y: 95 },

  a: { x: 465, y: 95 },

  loadTop: { x: 610, y: 95 },
  loadRTop: { x: 610, y: 190 },
  loadRBottom: { x: 610, y: 310 },
  loadBottom: { x: 610, y: 410 },
};

const COMPONENT_GEOMETRY = {
  vth: {
    center: TERMINAL.voltageCenter,
    label: { x: 36, y: 250 },
    value: { x: 28, y: 288 },
  },
  rth: {
    start: TERMINAL.rthLeft,
    end: TERMINAL.rthRight,
    label: { x: 290, y: 40 },
    value: { x: 290, y: 155 },
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
  { id: 'sourceTopToVoltageTop', from: TERMINAL.sourceTop, to: TERMINAL.voltageTop },
  { id: 'voltageBottomToSourceBottom', from: TERMINAL.voltageBottom, to: TERMINAL.sourceBottom },

  { id: 'sourceTopToRth', from: TERMINAL.sourceTop, to: TERMINAL.rthLeft },
  { id: 'rthToA', from: TERMINAL.rthRight, to: TERMINAL.a },

  { id: 'aToLoadTop', from: TERMINAL.a, to: TERMINAL.loadTop },
  { id: 'loadTopToLoadRTop', from: TERMINAL.loadTop, to: TERMINAL.loadRTop },
  { id: 'loadRBottomToLoadBottom', from: TERMINAL.loadRBottom, to: TERMINAL.loadBottom },

  { id: 'loadBottomToSourceBottom', from: TERMINAL.loadBottom, to: TERMINAL.sourceBottom },
];

const DEBUG_TERMINALS = [
  ['Vth+', TERMINAL.sourceTop],
  ['Vth-C+', TERMINAL.voltageTop],
  ['Vth-C−', TERMINAL.voltageBottom],
  ['Vth−', TERMINAL.sourceBottom],
  ['Rth-L', TERMINAL.rthLeft],
  ['Rth-R', TERMINAL.rthRight],
  ['A', TERMINAL.a],
  ['RL-Top', TERMINAL.loadTop],
  ['RL-R-Top', TERMINAL.loadRTop],
  ['RL-R-Bot', TERMINAL.loadRBottom],
  ['B', TERMINAL.loadBottom],
] as const;

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

export default function MaximumPowerTransferSimulator() {
  const [values, setValues] = useState<CircuitValues>(DEFAULT_VALUES);
  const [status, setStatus] = useState<Status>('Ready');
  const [viewMode, setViewMode] = useState<ViewMode>('simulation');
  const [practiceInputs, setPracticeInputs] = useState<PracticeInputs>(EMPTY_PRACTICE);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => solveMaximumPowerTransfer(values), [values]);

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
    setStatus('Ready');
    setViewMode('simulation');
    setPracticeInputs(EMPTY_PRACTICE);
    setSubmitted(false);
  };

  const autoMatchLoad = () => {
    setValues((prev) => ({
      ...prev,
      rLoad: Math.max(prev.rTh, 0.0001),
    }));

    setViewMode('matching');
    setSubmitted(false);
  };

  const generateProblem = () => {
    setValues({
      rTh: randomStep(20, 500, 10),
      rLoad: randomStep(20, 800, 10),
      vTh: randomInt(5, 30),
    });

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
            isRunning={isRunning}
            viewMode={viewMode}
          />

          <ConceptPanel values={values} result={result} viewMode={viewMode} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border-2 border-[#0648b8] p-3 xl:grid-cols-[1.05fr_1fr_1.15fr]">
          <ComponentValues values={values} updateValue={updateValue} />

          <SimulationControls
            status={status}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onStart={() => setStatus('Running')}
            onPause={() => setStatus('Paused')}
            onReset={reset}
            onAutoMatch={autoMatchLoad}
            onGenerateProblem={generateProblem}
          />

          <ResultsPanel result={result} values={values} />
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

function solveMaximumPowerTransfer(values: CircuitValues): MptResult {
  const rTh = Math.max(values.rTh, 0.0001);
  const rLoad = Math.max(values.rLoad, 0.0001);
  const vTh = values.vTh;

  const current = vTh / (rTh + rLoad);
  const loadVoltage = current * rLoad;
  const loadPower = current ** 2 * rLoad;

  const maxPower = vTh ** 2 / (4 * rTh);
  const optimalLoad = rTh;

  const sourcePower = vTh * current;
  const efficiency = sourcePower === 0 ? 0 : (loadPower / sourcePower) * 100;
  const powerRatio = maxPower === 0 ? 0 : (loadPower / maxPower) * 100;

  const matchingError = rLoad - rTh;
  const matchingPercentError = rTh === 0 ? 0 : (matchingError / rTh) * 100;

  const conditionText =
    Math.abs(matchingError) < 1e-9
      ? 'Matched: maximum power transfer'
      : rLoad < rTh
        ? 'Under-matched: load resistance is too low'
        : 'Over-matched: load resistance is too high';

  const curveMaxResistance = Math.max(rTh * 3, rLoad * 1.25, 10);
  const curvePoints = createPowerCurvePoints(vTh, rTh, curveMaxResistance);

  return {
    current,
    loadVoltage,
    loadPower,
    maxPower,
    optimalLoad,
    sourcePower,
    efficiency,
    powerRatio,
    matchingError,
    matchingPercentError,
    conditionText,
    curveMaxResistance,
    curvePoints,
    error: null,
  };
}

function createPowerCurvePoints(vTh: number, rTh: number, maxResistance: number): CurvePoint[] {
  const points: CurvePoint[] = [];
  const safeRTh = Math.max(rTh, 0.0001);
  const steps = 90;

  for (let i = 0; i <= steps; i += 1) {
    const rLoad = Math.max((maxResistance * i) / steps, 0.0001);
    const power = (vTh ** 2 * rLoad) / (safeRTh + rLoad) ** 2;

    points.push({
      rLoad,
      power,
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
  isRunning,
  viewMode,
}: {
  values: CircuitValues;
  result: MptResult;
  isRunning: boolean;
  viewMode: ViewMode;
}) {
  const showPowerCurve = viewMode === 'powerCurve';
  const showDebug = viewMode === 'debug';

  return (
    <section className="rounded-lg border-2 border-[#0648b8] bg-white p-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <h1 className="text-center text-[30px] font-black uppercase text-[#0648b8]">
          Thevenin Circuit
        </h1>

        <h1 className="text-center text-[30px] font-black uppercase text-[#15803d]">
          Load Power Curve
        </h1>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="h-[590px] rounded-lg border border-slate-200 bg-white">
          <CircuitSvg
            values={values}
            result={result}
            isRunning={isRunning}
            viewMode={viewMode}
          />
        </div>

        <div className="h-[590px] rounded-lg border border-slate-200 bg-white">
          {showPowerCurve || viewMode === 'matching' || viewMode === 'practice' ? (
            <PowerCurveSvg values={values} result={result} />
          ) : (
            <PowerSummarySvg values={values} result={result} />
          )}
        </div>
      </div>

      {showDebug && (
        <p className="mt-2 text-center text-sm font-bold text-orange-700">
          Debug mode shows terminal dots and labels inside the circuit SVG.
        </p>
      )}
    </section>
  );
}

/* ============================================================================
   CIRCUIT SVG
============================================================================ */

function CircuitSvg({
  values,
  result,
  isRunning,
  viewMode,
}: {
  values: CircuitValues;
  result: MptResult;
  isRunning: boolean;
  viewMode: ViewMode;
}) {
  const showMovingDots = isRunning && viewMode !== 'debug';
  const showDebug = viewMode === 'debug';
  const showMatchingHighlight = viewMode === 'matching' || Math.abs(result.matchingError) < 1e-9;

  return (
    <svg
      viewBox={`${CIRCUIT_VIEW_BOX.x} ${CIRCUIT_VIEW_BOX.y} ${CIRCUIT_VIEW_BOX.width} ${CIRCUIT_VIEW_BOX.height}`}
      className="h-full w-full"
    >
      <g>
        {showMatchingHighlight && <MatchingHighlight />}

        <WireLayer />
        <ComponentLayer values={values} />
        <NodeLayer />

        {showMovingDots && <MovingCurrentLayer result={result} />}

        <CircuitOverlay result={result} values={values} />

        {showDebug && <DebugTerminalLayer />}
      </g>
    </svg>
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

function ComponentLayer({ values }: { values: CircuitValues }) {
  return (
    <g>
      <SvgVoltageSource
        id="vth"
        label="V"
        sub="th"
        value={`${values.vTh} V`}
        center={COMPONENT_GEOMETRY.vth.center}
        labelPoint={COMPONENT_GEOMETRY.vth.label}
        valuePoint={COMPONENT_GEOMETRY.vth.value}
      />

      <SvgResistor
        id="rth"
        label="R"
        sub="th"
        value={`${values.rTh} Ω`}
        start={COMPONENT_GEOMETRY.rth.start}
        end={COMPONENT_GEOMETRY.rth.end}
        labelPoint={COMPONENT_GEOMETRY.rth.label}
        valuePoint={COMPONENT_GEOMETRY.rth.value}
      />

      <SvgResistor
        id="load"
        label="R"
        sub="L"
        value={`${values.rLoad} Ω`}
        start={COMPONENT_GEOMETRY.load.start}
        end={COMPONENT_GEOMETRY.load.end}
        labelPoint={COMPONENT_GEOMETRY.load.label}
        valuePoint={COMPONENT_GEOMETRY.load.value}
        anchor="start"
      />
    </g>
  );
}

function NodeLayer() {
  return (
    <g>
      <CircuitNode point={TERMINAL.a} label="A" offset={{ x: -18, y: -28 }} hollow />
      <CircuitNode point={TERMINAL.loadBottom} label="B" offset={{ x: 20, y: 42 }} hollow />
      <CircuitNode point={TERMINAL.sourceTop} />
      <CircuitNode point={TERMINAL.sourceBottom} />
    </g>
  );
}

function MatchingHighlight() {
  return (
    <g>
      <rect
        x="190"
        y="30"
        width="470"
        height="430"
        rx="20"
        fill={COLOR.matching}
        opacity="0.07"
      />

      <text x="380" y="455" textAnchor="middle" fontSize="22" fontWeight="900" fill={COLOR.matching}>
        Matching condition: RL = Rth
      </text>
    </g>
  );
}

function MovingCurrentLayer({ result }: { result: MptResult }) {
  return (
    <g>
      <MovingCharge
        path={createPath([
          TERMINAL.sourceBottom,
          TERMINAL.voltageBottom,
          TERMINAL.voltageTop,
          TERMINAL.sourceTop,
          TERMINAL.rthLeft,
          TERMINAL.rthRight,
          TERMINAL.a,
          TERMINAL.loadTop,
          TERMINAL.loadRTop,
          TERMINAL.loadRBottom,
          TERMINAL.loadBottom,
          TERMINAL.sourceBottom,
        ])}
        current={result.current}
        color={COLOR.currentDot}
        reverse={result.current < 0}
      />
    </g>
  );
}

function CircuitOverlay({
  result,
  values,
}: {
  result: MptResult;
  values: CircuitValues;
}) {
  return (
    <g>
      <rect x="30" y="25" width="258" height="122" rx="10" fill="#eef2ff" stroke="#94a3b8" />
      <text x="50" y="57" fontSize="18" fontWeight="900" fill="#1e3a8a">
        IL = {result.current.toFixed(5)} A
      </text>
      <text x="50" y="84" fontSize="18" fontWeight="900" fill="#166534">
        PL = {result.loadPower.toFixed(4)} W
      </text>
      <text x="50" y="111" fontSize="18" fontWeight="900" fill="#ea580c">
        Pmax = {result.maxPower.toFixed(4)} W
      </text>
      <text x="50" y="137" fontSize="15" fontWeight="800" fill="#0f172a">
        RL / Rth = {(values.rLoad / Math.max(values.rTh, 0.0001)).toFixed(3)}
      </text>

      <rect x="370" y="25" width="330" height="82" rx="10" fill="white" stroke="#cbd5e1" />
      <circle cx="393" cy="52" r="7" fill={COLOR.currentDot} />
      <text x="415" y="58" fontSize="15" fontWeight="800" fill="#0f172a">
        Moving dot = load current direction
      </text>
      <circle cx="393" cy="82" r="7" fill={COLOR.matching} />
      <text x="415" y="88" fontSize="15" fontWeight="800" fill="#0f172a">
        Purple highlight = matched load
      </text>
    </g>
  );
}

/* ============================================================================
   POWER CURVE SVG
============================================================================ */

function PowerCurveSvg({
  values,
  result,
}: {
  values: CircuitValues;
  result: MptResult;
}) {
  const graph = {
    x: 78,
    y: 58,
    width: 610,
    height: 350,
  };

  const maxResistance = result.curveMaxResistance;
  const maxPower = Math.max(result.maxPower, 0.0001);

  const mapX = (rLoad: number) => graph.x + (rLoad / maxResistance) * graph.width;
  const mapY = (power: number) => graph.y + graph.height - (power / maxPower) * graph.height;

  const curvePolyline = result.curvePoints
    .map((point) => `${mapX(point.rLoad)},${mapY(point.power)}`)
    .join(' ');

  const currentX = mapX(Math.max(values.rLoad, 0.0001));
  const currentY = mapY(result.loadPower);
  const optimalX = mapX(result.optimalLoad);
  const optimalY = mapY(result.maxPower);

  return (
    <svg
      viewBox={`${GRAPH_VIEW_BOX.x} ${GRAPH_VIEW_BOX.y} ${GRAPH_VIEW_BOX.width} ${GRAPH_VIEW_BOX.height}`}
      className="h-full w-full"
    >
      <rect x="0" y="0" width="760" height="520" fill="white" />

      <text x="380" y="34" textAnchor="middle" fontSize="28" fontWeight="900" fill="#0648b8">
        Power Curve: PL vs RL
      </text>

      <line
        x1={graph.x}
        y1={graph.y + graph.height}
        x2={graph.x + graph.width}
        y2={graph.y + graph.height}
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
            x1={graph.x}
            y1={graph.y + graph.height - ratio * graph.height}
            x2={graph.x + graph.width}
            y2={graph.y + graph.height - ratio * graph.height}
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          <text
            x={graph.x - 12}
            y={graph.y + graph.height - ratio * graph.height + 5}
            textAnchor="end"
            fontSize="13"
            fontWeight="700"
            fill="#334155"
          >
            {(maxPower * ratio).toFixed(2)}
          </text>
        </g>
      ))}

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
            {(maxResistance * ratio).toFixed(0)}
          </text>
        </g>
      ))}

      <polyline
        points={curvePolyline}
        fill="none"
        stroke={COLOR.curve}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1={optimalX}
        y1={graph.y}
        x2={optimalX}
        y2={graph.y + graph.height}
        stroke={COLOR.maxPower}
        strokeWidth="3"
        strokeDasharray="9 8"
      />

      <circle cx={optimalX} cy={optimalY} r="10" fill={COLOR.maxPower} />
      <circle cx={currentX} cy={currentY} r="10" fill={COLOR.power} />

      <text x={optimalX + 18} y={optimalY - 16} fontSize="17" fontWeight="900" fill={COLOR.maxPower}>
        Maximum
      </text>

      <text x={currentX + 18} y={currentY + 26} fontSize="17" fontWeight="900" fill={COLOR.power}>
        Current RL
      </text>

      <text x="380" y="492" textAnchor="middle" fontSize="20" fontWeight="900" fill="#0f172a">
        Load resistance RL (Ω)
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
        Load power PL (W)
      </text>

      <rect x="445" y="55" width="260" height="112" rx="10" fill="white" stroke="#cbd5e1" />
      <text x="465" y="86" fontSize="16" fontWeight="900" fill="#0f172a">
        Current PL = {result.loadPower.toFixed(4)} W
      </text>
      <text x="465" y="114" fontSize="16" fontWeight="900" fill="#0f172a">
        Pmax = {result.maxPower.toFixed(4)} W
      </text>
      <text x="465" y="142" fontSize="16" fontWeight="900" fill="#0f172a">
        Power ratio = {result.powerRatio.toFixed(2)}%
      </text>
    </svg>
  );
}

function PowerSummarySvg({
  values,
  result,
}: {
  values: CircuitValues;
  result: MptResult;
}) {
  const matched = Math.abs(result.matchingError) < 1e-9;

  return (
    <svg viewBox="0 0 760 520" className="h-full w-full">
      <rect x="0" y="0" width="760" height="520" fill="white" />

      <text x="380" y="45" textAnchor="middle" fontSize="29" fontWeight="900" fill="#0648b8">
        Maximum Power Transfer Summary
      </text>

      <rect x="75" y="90" width="610" height="90" rx="14" fill={matched ? '#ecfdf5' : '#fff7ed'} stroke={matched ? '#16a34a' : '#ea580c'} strokeWidth="3" />

      <text x="380" y="126" textAnchor="middle" fontSize="24" fontWeight="900" fill={matched ? '#15803d' : '#ea580c'}>
        {result.conditionText}
      </text>

      <text x="380" y="158" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a">
        Current RL = {values.rLoad} Ω, Optimal RL = {result.optimalLoad.toFixed(2)} Ω
      </text>

      <g>
        <rect x="80" y="225" width="180" height="135" rx="12" fill="#eef2ff" stroke="#94a3b8" />
        <text x="170" y="260" textAnchor="middle" fontSize="22" fontWeight="900" fill="#1e3a8a">
          PL current
        </text>
        <text x="170" y="315" textAnchor="middle" fontSize="30" fontWeight="900" fill="#0f172a">
          {result.loadPower.toFixed(3)} W
        </text>
      </g>

      <g>
        <rect x="290" y="225" width="180" height="135" rx="12" fill="#fff7ed" stroke="#fdba74" />
        <text x="380" y="260" textAnchor="middle" fontSize="22" fontWeight="900" fill="#ea580c">
          Pmax
        </text>
        <text x="380" y="315" textAnchor="middle" fontSize="30" fontWeight="900" fill="#0f172a">
          {result.maxPower.toFixed(3)} W
        </text>
      </g>

      <g>
        <rect x="500" y="225" width="180" height="135" rx="12" fill="#ecfdf5" stroke="#86efac" />
        <text x="590" y="260" textAnchor="middle" fontSize="22" fontWeight="900" fill="#15803d">
          Ratio
        </text>
        <text x="590" y="315" textAnchor="middle" fontSize="30" fontWeight="900" fill="#0f172a">
          {result.powerRatio.toFixed(1)}%
        </text>
      </g>

      <text x="380" y="420" textAnchor="middle" fontSize="24" fontWeight="900" fill="#7c3aed">
        Maximum power happens when RL = Rth
      </text>

      <text x="380" y="455" textAnchor="middle" fontSize="18" fontWeight="800" fill="#334155">
        Efficiency at maximum power is 50%, because half the source power is lost in Rth.
      </text>
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

function SvgVoltageSource({
  id,
  label,
  sub,
  value,
  center,
  labelPoint,
  valuePoint,
}: {
  id: ComponentId;
  label: string;
  sub: string;
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
        r={COMPONENT.voltageSource.radius}
        fill="white"
        stroke="black"
        strokeWidth={COMPONENT.voltageSource.strokeWidth}
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
        text={label}
        sub={sub}
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
  const speed = clamp(0.9, 4.7 - Math.abs(current) * 45, 4.1);

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
  result: MptResult;
  viewMode: ViewMode;
}) {
  return (
    <section className="rounded-lg border-2 border-[#0648b8] bg-white">
      <div className="rounded-t-md bg-gradient-to-r from-[#0648b8] to-[#0b58c6] py-4 text-center text-[29px] font-black uppercase tracking-wide text-white">
        Maximum Power Transfer
      </div>

      <div className="space-y-5 px-6 py-5 text-[22px] leading-snug">
        <ConceptItem number={1}>Replace the source network by its Thevenin equivalent</ConceptItem>
        <ConceptItem number={2}>Identify the source resistance Rth</ConceptItem>
        <ConceptItem number={3}>Vary the load resistance RL</ConceptItem>
        <ConceptItem number={4}>Maximum load power occurs when RL = Rth</ConceptItem>
      </div>

      <div className="mx-5 h-[2px] bg-[#8bb8ff]" />

      <div className="mx-auto w-fit rounded-b-lg bg-[#e6f2ff] px-8 py-3 text-[23px] font-black text-[#0648b8]">
        Live Equations
      </div>

      <div className="px-6 py-4 text-[17px] font-bold">
        <EquationBlock title="Load current">
          I<sub>L</sub> = V<sub>th</sub> / (R<sub>th</sub> + R<sub>L</sub>)
        </EquationBlock>

        <EquationBlock title="Load power">
          P<sub>L</sub> = I<sub>L</sub>
          <sup>2</sup>R<sub>L</sub>
        </EquationBlock>

        <EquationBlock title="Maximum condition">
          R<sub>L</sub> = R<sub>th</sub>
        </EquationBlock>

        <EquationBlock title="Maximum power">
          P<sub>max</sub> = V<sub>th</sub>
          <sup>2</sup> / 4R<sub>th</sub>
        </EquationBlock>

        <div className="mt-5 rounded-lg border-2 border-[#3a7bdc] bg-white px-5 py-3">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-serif text-[20px] italic">
            <span>Rth = {values.rTh} Ω</span>
            <span>RL = {values.rLoad} Ω</span>
            <span>Vth = {values.vTh} V</span>
            <span>IL = {result.current.toFixed(5)} A</span>
            <span>PL = {result.loadPower.toFixed(4)} W</span>
            <span>Pmax = {result.maxPower.toFixed(4)} W</span>
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
    <section className="min-h-[305px] border-r-2 border-[#cfd4dc] bg-white p-4">
      <h2 className="text-center text-[22px] font-black uppercase text-[#0648b8]">
        Component Values
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4">
        <ValueInput
          label="Rth"
          value={values.rTh}
          unit="Ω"
          min={0.1}
          step={1}
          onChange={(value) => updateValue('rTh', value)}
        />

        <ValueInput
          label="RL"
          value={values.rLoad}
          unit="Ω"
          min={0.1}
          step={1}
          onChange={(value) => updateValue('rLoad', value)}
        />

        <ValueInput
          label="Vth"
          value={values.vTh}
          unit="V"
          min={0}
          step={1}
          onChange={(value) => updateValue('vTh', value)}
        />
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-3 text-center text-[16px] font-bold text-slate-700">
        Current status: {values.rLoad === values.rTh ? 'Matched' : values.rLoad < values.rTh ? 'Under-matched' : 'Over-matched'}
      </div>
    </section>
  );
}

function SimulationControls({
  status,
  viewMode,
  setViewMode,
  onStart,
  onPause,
  onReset,
  onAutoMatch,
  onGenerateProblem,
}: {
  status: Status;
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onAutoMatch: () => void;
  onGenerateProblem: () => void;
}) {
  return (
    <section className="min-h-[305px] border-r-2 border-[#cfd4dc] bg-white p-4">
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

      <button
        onClick={onAutoMatch}
        className="mt-4 w-full rounded-lg bg-gradient-to-b from-[#16a34a] to-[#15803d] px-4 py-3 text-[17px] font-black text-white"
      >
        Auto Match RL = Rth
      </button>

      <button
        onClick={onGenerateProblem}
        className="mt-3 w-full rounded-lg bg-gradient-to-b from-[#7c3aed] to-[#5b21b6] px-4 py-3 text-[17px] font-black text-white"
      >
        Generate Practice Problem
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ModeButton label="Simulation" active={viewMode === 'simulation'} onClick={() => setViewMode('simulation')} />
        <ModeButton label="Curve" active={viewMode === 'powerCurve'} onClick={() => setViewMode('powerCurve')} />
        <ModeButton label="Matching" active={viewMode === 'matching'} onClick={() => setViewMode('matching')} />
        <ModeButton label="Practice" active={viewMode === 'practice'} onClick={() => setViewMode('practice')} />
        <ModeButton label="Debug" active={viewMode === 'debug'} onClick={() => setViewMode('debug')} />
      </div>
    </section>
  );
}

function ResultsPanel({
  result,
  values,
}: {
  result: MptResult;
  values: CircuitValues;
}) {
  const matched = Math.abs(result.matchingError) < 1e-9;

  return (
    <section className="min-h-[305px] bg-white p-4">
      <h2 className="text-center text-[23px] font-black uppercase text-[#0648b8]">
        Results
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ResultCard label="PL" value={`${result.loadPower.toFixed(4)} W`} color="green" />
        <ResultCard label="Pmax" value={`${result.maxPower.toFixed(4)} W`} color="orange" />
        <ResultCard label="Ratio" value={`${result.powerRatio.toFixed(2)}%`} color="purple" />
      </div>

      <div className="mt-5 rounded-lg border-2 border-[#8bb8ff] bg-white px-5 py-4 text-[16px] font-bold">
        <p>Current IL = {result.current.toFixed(8)} A</p>
        <p>Current VL = {result.loadVoltage.toFixed(6)} V</p>
        <p>Efficiency = {result.efficiency.toFixed(2)}%</p>
        <p>Optimal RL = {result.optimalLoad.toFixed(3)} Ω</p>
        <p>
          Match error = {(values.rLoad - values.rTh).toFixed(3)} Ω {matched ? '✅' : '❌'}
        </p>
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
  result: MptResult;
  viewMode: ViewMode;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section className="mt-4 rounded-lg border-2 border-[#0648b8] bg-white p-5">
      <h2 className="text-center text-[24px] font-black uppercase text-[#0648b8]">
        Live Maximum Power Math Solver
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <StepPanel values={values} result={result} />
        <VerificationPanel result={result} />
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
  result: MptResult;
}) {
  const iMax = values.vTh / (2 * Math.max(values.rTh, 0.0001));

  return (
    <div className="rounded-lg bg-[#eef6ff] p-5">
      <h3 className="text-[21px] font-black text-[#0648b8]">
        Step-by-step Calculation
      </h3>

      <div className="mt-4 space-y-3 rounded-lg bg-white p-4 text-[16px] font-bold">
        <p>IL = Vth / (Rth + RL)</p>
        <p>
          IL = {values.vTh} / ({values.rTh} + {values.rLoad}) = {result.current.toFixed(8)} A
        </p>

        <div className="h-px bg-slate-300" />

        <p>PL = IL² × RL</p>
        <p>
          PL = ({result.current.toFixed(8)})² × {values.rLoad} = {result.loadPower.toFixed(8)} W
        </p>

        <div className="h-px bg-slate-300" />

        <p>Maximum condition: RL(opt) = Rth = {result.optimalLoad.toFixed(4)} Ω</p>
        <p>
          At maximum: IL = Vth / (2Rth) = {iMax.toFixed(8)} A
        </p>
      </div>
    </div>
  );
}

function VerificationPanel({ result }: { result: MptResult }) {
  return (
    <div className="rounded-lg bg-[#f4efff] p-5">
      <h3 className="text-[21px] font-black text-[#5b21b6]">
        Power Transfer Check
      </h3>

      <div className="mt-4 space-y-3 rounded-lg bg-white p-4 text-[16px] font-bold">
        <p>Current load power = {result.loadPower.toFixed(8)} W</p>
        <p>Maximum possible power = {result.maxPower.toFixed(8)} W</p>
        <p>Power ratio = {result.powerRatio.toFixed(4)}%</p>
        <p>Efficiency = {result.efficiency.toFixed(4)}%</p>

        <div className="h-px bg-slate-300" />

        <p>{result.conditionText}</p>
        <p>Matching error = {result.matchingError.toFixed(6)} Ω</p>
        <p>Matching percent error = {result.matchingPercentError.toFixed(4)}%</p>
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
  result: MptResult;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const iLoadMax = result.optimalLoad <= 0 ? 0 : Math.sqrt(result.maxPower / result.optimalLoad);

  const checks = {
    rLoadOpt: isClose(practiceInputs.rLoadOpt, result.optimalLoad, ANSWER_TOLERANCE.resistance),
    iLoadMax: isClose(practiceInputs.iLoadMax, iLoadMax, ANSWER_TOLERANCE.current),
    pMax: isClose(practiceInputs.pMax, result.maxPower, ANSWER_TOLERANCE.power),
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
        Solve for RL(opt), IL at maximum power, and Pmax.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnswerInput
          label="RL(opt)"
          unit="Ω"
          value={practiceInputs.rLoadOpt}
          correct={checks.rLoadOpt}
          submitted={submitted}
          onChange={(value) => updateInput('rLoadOpt', value)}
        />

        <AnswerInput
          label="IL(max)"
          unit="A"
          value={practiceInputs.iLoadMax}
          correct={checks.iLoadMax}
          submitted={submitted}
          onChange={(value) => updateInput('iLoadMax', value)}
        />

        <AnswerInput
          label="Pmax"
          unit="W"
          value={practiceInputs.pMax}
          correct={checks.pMax}
          submitted={submitted}
          onChange={(value) => updateInput('pMax', value)}
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
            Score: {score}/3
          </h4>

          <div className="mt-3 grid grid-cols-1 gap-2 text-center text-[16px] font-bold md:grid-cols-3">
            <p>RL(opt) = {result.optimalLoad.toFixed(3)} Ω</p>
            <p>IL(max) = {iLoadMax.toFixed(6)} A</p>
            <p>Pmax = {result.maxPower.toFixed(6)} W</p>
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
  step,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-[70px_1fr_44px] items-center gap-3 text-[20px]">
      <label className="font-serif text-[23px] font-black italic">{label}</label>

      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-[40px] rounded-md border border-gray-400 bg-white px-2 text-center text-[20px] outline-none focus:border-[#0648b8]"
      />

      <span className="text-[18px]">{unit}</span>
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
        active ? 'bg-[#0648b8] text-white' : 'bg-white text-[#0648b8] ring-1 ring-slate-300'
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
  color: 'green' | 'orange' | 'purple';
}) {
  const colorClass =
    color === 'green'
      ? 'text-[#15803d]'
      : color === 'orange'
        ? 'text-[#ea580c]'
        : 'text-[#7c3aed]';

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
      <div className="mb-2 flex justify-between font-black text-[#0648b8]">
        <span>{label}</span>
        <span>{unit}</span>
      </div>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Enter ${label}`}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-center font-bold outline-none"
      />

      {submitted && (
        <p className={`mt-2 text-center text-sm font-black ${correct ? 'text-green-700' : 'text-red-700'}`}>
          {correct ? 'Correct ✅' : 'Wrong ❌'}
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