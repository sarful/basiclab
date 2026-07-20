'use client';

import React, { useMemo, useState } from 'react';

/* ============================================================================
   TYPES
============================================================================ */

type Status = 'Ready' | 'Running' | 'Paused';

type ViewMode =
  | 'comparison'
  | 'shortCircuit'
  | 'rn'
  | 'equivalent'
  | 'practice'
  | 'debug';

type Point = {
  x: number;
  y: number;
};

type CircuitValues = {
  r1: number;
  r2: number;
  rLoad: number;
  vs: number;
};

type NortonResult = {
  inorton: number;
  rn: number;
  vth: number;

  iLoadNorton: number;
  vLoadNorton: number;
  pLoadNorton: number;

  rParallelLoaded: number;
  vLoadOriginal: number;
  iLoadOriginal: number;
  pLoadOriginal: number;

  iRnNorton: number;
  iShortCircuit: number;
  iR1Open: number;
  iR2Open: number;

  verificationErrorCurrent: number;
  verificationErrorVoltage: number;

  error: string | null;
};

type PracticeInputs = {
  inorton: string;
  rn: string;
  iLoad: string;
};

type ComponentId =
  | 'originalR1'
  | 'originalR2'
  | 'originalLoad'
  | 'originalVs'
  | 'nortonSource'
  | 'nortonRn'
  | 'nortonLoad';

type WireId =
  | 'oVsTopToR1'
  | 'oR1ToA'
  | 'oAToLoadTop'
  | 'oLoadTopToLoadRTop'
  | 'oLoadRBottomToLoadBottom'
  | 'oBottomNodeToLoadBottom'
  | 'oBottomNodeToVsBottom'
  | 'oAToR2Top'
  | 'oR2BottomToBottomNode'
  | 'oVsTopToVsSource'
  | 'oVsSourceToVsBottom'
  | 'nTopBusLeftToSourceTop'
  | 'nSourceBottomToBottomBus'
  | 'nTopBusToRnTop'
  | 'nRnBottomToBottomBus'
  | 'nTopBusToLoadTop'
  | 'nLoadTopToLoadRTop'
  | 'nLoadRBottomToLoadBottom'
  | 'nLoadBottomToBottomBus';

/* ============================================================================
   CONSTANTS
============================================================================ */

const DEFAULT_VALUES: CircuitValues = {
  r1: 100,
  r2: 220,
  rLoad: 330,
  vs: 12,
};

const EMPTY_PRACTICE: PracticeInputs = {
  inorton: '',
  rn: '',
  iLoad: '',
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
  currentSource: '#0648d8',

  node: '#000000',
  nodeLabel: '#0648b8',

  original: '#0648b8',
  norton: '#7c3aed',
  load: '#15803d',
  warning: '#ea580c',

  originalDot: '#16a34a',
  nortonDot: '#7c3aed',
  shortCircuitDot: '#2563eb',
  rnDot: '#0f766e',

  debug: '#f97316',
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
  currentSource: {
    radius: 44 * SCALE.COMPONENT,
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
  current: 0.001,
  resistance: 0.05,
};

/* ============================================================================
   OFFSETS
============================================================================ */

const COMPONENT_OFFSET: Record<ComponentId, Point> = {
  originalR1: { x: 0, y: 0 },
  originalR2: { x: 0, y: 0 },
  originalLoad: { x: 0, y: 0 },
  originalVs: { x: 0, y: 0 },
  nortonSource: { x: 0, y: 0 },
  nortonRn: { x: 0, y: 0 },
  nortonLoad: { x: 0, y: 0 },
};

const LABEL_OFFSET: Record<ComponentId, Point> = {
  originalR1: { x: 0, y: 0 },
  originalR2: { x: 0, y: 0 },
  originalLoad: { x: 0, y: 0 },
  originalVs: { x: 0, y: 0 },
  nortonSource: { x: 0, y: 0 },
  nortonRn: { x: 0, y: 0 },
  nortonLoad: { x: 0, y: 0 },
};

const WIRE_OFFSET: Record<WireId, Point> = {
  oVsTopToR1: { x: 0, y: 0 },
  oR1ToA: { x: 0, y: 0 },
  oAToLoadTop: { x: 0, y: 0 },
  oLoadTopToLoadRTop: { x: 0, y: 0 },
  oLoadRBottomToLoadBottom: { x: 0, y: 0 },
  oBottomNodeToLoadBottom: { x: 0, y: 0 },
  oBottomNodeToVsBottom: { x: 0, y: 0 },
  oAToR2Top: { x: 0, y: 0 },
  oR2BottomToBottomNode: { x: 0, y: 0 },
  oVsTopToVsSource: { x: 0, y: 0 },
  oVsSourceToVsBottom: { x: 0, y: 0 },

  nTopBusLeftToSourceTop: { x: 0, y: 0 },
  nSourceBottomToBottomBus: { x: 0, y: 0 },
  nTopBusToRnTop: { x: 0, y: 0 },
  nRnBottomToBottomBus: { x: 0, y: 0 },
  nTopBusToLoadTop: { x: 0, y: 0 },
  nLoadTopToLoadRTop: { x: 0, y: 0 },
  nLoadRBottomToLoadBottom: { x: 0, y: 0 },
  nLoadBottomToBottomBus: { x: 0, y: 0 },
};

const DEBUG_TERMINAL_OFFSET: Point = {
  x: 0,
  y: 0,
};

/* ============================================================================
   GEOMETRY
============================================================================ */

const ORIGINAL = {
  vsTop: { x: 95, y: 150 },
  vsSourceTop: { x: 95, y: 262 },
  vsCenter: { x: 95, y: 305 },
  vsSourceBottom: { x: 95, y: 348 },

  sourceBottom: { x: 95, y: 560 },
  bottomNode: { x: 405, y: 560 },

  r1Left: { x: 185, y: 150 },
  r1Right: { x: 315, y: 150 },

  a: { x: 405, y: 150 },

  r2Top: { x: 405, y: 270 },
  r2Bottom: { x: 405, y: 430 },

  loadTop: { x: 575, y: 150 },
  loadBottom: { x: 575, y: 560 },
  loadRTop: { x: 575, y: 270 },
  loadRBottom: { x: 575, y: 430 },
};

const NORTON = {
  topBusLeft: { x: 735, y: 150 },
  bottomBusLeft: { x: 735, y: 560 },

  sourceTop: { x: 735, y: 260 },
  sourceCenter: { x: 735, y: 305 },
  sourceBottom: { x: 735, y: 350 },

  rnTop: { x: 890, y: 270 },
  rnBottom: { x: 890, y: 430 },

  loadTop: { x: 1045, y: 150 },
  loadBottom: { x: 1045, y: 560 },
  loadRTop: { x: 1045, y: 270 },
  loadRBottom: { x: 1045, y: 430 },

  a: { x: 1045, y: 150 },
  b: { x: 1045, y: 560 },
};

const COMPONENT_GEOMETRY = {
  originalR1: {
    start: ORIGINAL.r1Left,
    end: ORIGINAL.r1Right,
    label: { x: 250, y: 92 },
    value: { x: 250, y: 205 },
  },
  originalR2: {
    start: ORIGINAL.r2Top,
    end: ORIGINAL.r2Bottom,
    label: { x: 335, y: 350 },
    value: { x: 320, y: 390 },
  },
  originalLoad: {
    start: ORIGINAL.loadRTop,
    end: ORIGINAL.loadRBottom,
    label: { x: 615, y: 350 },
    value: { x: 615, y: 390 },
  },
  originalVs: {
    center: ORIGINAL.vsCenter,
    label: { x: 25, y: 307 },
    value: { x: 25, y: 350 },
  },
  nortonSource: {
    center: NORTON.sourceCenter,
    label: { x: 650, y: 307 },
    value: { x: 635, y: 350 },
  },
  nortonRn: {
    start: NORTON.rnTop,
    end: NORTON.rnBottom,
    label: { x: 925, y: 350 },
    value: { x: 925, y: 390 },
  },
  nortonLoad: {
    start: NORTON.loadRTop,
    end: NORTON.loadRBottom,
    label: { x: 1085, y: 350 },
    value: { x: 1085, y: 390 },
  },
};

const WIRE_SEGMENTS: Array<{
  id: WireId;
  from: Point;
  to: Point;
}> = [
  // Original source branch
  { id: 'oVsTopToVsSource', from: ORIGINAL.vsTop, to: ORIGINAL.vsSourceTop },
  { id: 'oVsSourceToVsBottom', from: ORIGINAL.vsSourceBottom, to: ORIGINAL.sourceBottom },

  // Original top branch
  { id: 'oVsTopToR1', from: ORIGINAL.vsTop, to: ORIGINAL.r1Left },
  { id: 'oR1ToA', from: ORIGINAL.r1Right, to: ORIGINAL.a },

  // Original R2 branch
  { id: 'oAToR2Top', from: ORIGINAL.a, to: ORIGINAL.r2Top },
  { id: 'oR2BottomToBottomNode', from: ORIGINAL.r2Bottom, to: ORIGINAL.bottomNode },

  // Original load branch
  { id: 'oAToLoadTop', from: ORIGINAL.a, to: ORIGINAL.loadTop },
  { id: 'oLoadTopToLoadRTop', from: ORIGINAL.loadTop, to: ORIGINAL.loadRTop },
  { id: 'oLoadRBottomToLoadBottom', from: ORIGINAL.loadRBottom, to: ORIGINAL.loadBottom },

  // Original bottom bus
  { id: 'oBottomNodeToLoadBottom', from: ORIGINAL.bottomNode, to: ORIGINAL.loadBottom },
  { id: 'oBottomNodeToVsBottom', from: ORIGINAL.bottomNode, to: ORIGINAL.sourceBottom },

  // Norton current source branch
  { id: 'nTopBusLeftToSourceTop', from: NORTON.topBusLeft, to: NORTON.sourceTop },
  { id: 'nSourceBottomToBottomBus', from: NORTON.sourceBottom, to: NORTON.bottomBusLeft },

  // Norton Rn branch
  { id: 'nTopBusToRnTop', from: NORTON.topBusLeft, to: NORTON.rnTop },
  { id: 'nRnBottomToBottomBus', from: NORTON.rnBottom, to: NORTON.bottomBusLeft },

  // Norton load branch
  { id: 'nTopBusToLoadTop', from: NORTON.topBusLeft, to: NORTON.loadTop },
  { id: 'nLoadTopToLoadRTop', from: NORTON.loadTop, to: NORTON.loadRTop },
  { id: 'nLoadRBottomToLoadBottom', from: NORTON.loadRBottom, to: NORTON.loadBottom },
  { id: 'nLoadBottomToBottomBus', from: NORTON.loadBottom, to: NORTON.bottomBusLeft },
];

const DEBUG_TERMINALS = [
  ['O-Vs+', ORIGINAL.vsTop],
  ['O-VsC+', ORIGINAL.vsSourceTop],
  ['O-VsC−', ORIGINAL.vsSourceBottom],
  ['O-SrcBottom', ORIGINAL.sourceBottom],
  ['O-BottomNode', ORIGINAL.bottomNode],

  ['O-R1-L', ORIGINAL.r1Left],
  ['O-R1-R', ORIGINAL.r1Right],
  ['O-A', ORIGINAL.a],
  ['O-R2-T', ORIGINAL.r2Top],
  ['O-R2-B', ORIGINAL.r2Bottom],
  ['O-RL-T', ORIGINAL.loadRTop],
  ['O-RL-B', ORIGINAL.loadRBottom],
  ['O-LoadTop', ORIGINAL.loadTop],
  ['O-LoadBottom', ORIGINAL.loadBottom],

  ['N-TopBus', NORTON.topBusLeft],
  ['N-BottomBus', NORTON.bottomBusLeft],
  ['N-Is-T', NORTON.sourceTop],
  ['N-Is-B', NORTON.sourceBottom],
  ['N-Rn-T', NORTON.rnTop],
  ['N-Rn-B', NORTON.rnBottom],
  ['N-A', NORTON.a],
  ['N-B', NORTON.b],
  ['N-RL-T', NORTON.loadRTop],
  ['N-RL-B', NORTON.loadRBottom],
] as const;

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

export default function NortonsTheoremSimulator() {
  const [values, setValues] = useState<CircuitValues>(DEFAULT_VALUES);
  const [status, setStatus] = useState<Status>('Ready');
  const [viewMode, setViewMode] = useState<ViewMode>('comparison');
  const [practiceInputs, setPracticeInputs] = useState<PracticeInputs>(EMPTY_PRACTICE);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => solveNorton(values), [values]);

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
    setViewMode('comparison');
    setPracticeInputs(EMPTY_PRACTICE);
    setSubmitted(false);
  };

  const generateProblem = () => {
    setValues({
      r1: randomStep(50, 500, 10),
      r2: randomStep(50, 500, 10),
      rLoad: randomStep(50, 800, 10),
      vs: randomInt(5, 24),
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
          <CircuitComparisonPanel
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

function solveNorton(values: CircuitValues): NortonResult {
  const r1 = Math.max(values.r1, 0.0001);
  const r2 = Math.max(values.r2, 0.0001);
  const rLoad = Math.max(values.rLoad, 0.0001);

  // Norton current is the short-circuit current at terminals A-B.
  const inorton = values.vs / r1;

  // Norton resistance is seen from A-B with the voltage source shorted.
  const rn = (r1 * r2) / (r1 + r2);

  // Thevenin voltage is useful for verification.
  const vth = inorton * rn;

  // Norton current division.
  const iLoadNorton = inorton * (rn / (rn + rLoad));
  const vLoadNorton = iLoadNorton * rLoad;
  const pLoadNorton = iLoadNorton ** 2 * rLoad;

  // Original loaded circuit.
  const rParallelLoaded = (r2 * rLoad) / (r2 + rLoad);
  const vLoadOriginal = values.vs * (rParallelLoaded / (r1 + rParallelLoaded));
  const iLoadOriginal = vLoadOriginal / rLoad;
  const pLoadOriginal = iLoadOriginal ** 2 * rLoad;

  const iRnNorton = inorton * (rLoad / (rn + rLoad));

  // Open-circuit R1/R2 current.
  const iR1Open = values.vs / (r1 + r2);
  const iR2Open = iR1Open;

  const iShortCircuit = inorton;

  const verificationErrorCurrent = iLoadNorton - iLoadOriginal;
  const verificationErrorVoltage = vLoadNorton - vLoadOriginal;

  return {
    inorton,
    rn,
    vth,

    iLoadNorton,
    vLoadNorton,
    pLoadNorton,

    rParallelLoaded,
    vLoadOriginal,
    iLoadOriginal,
    pLoadOriginal,

    iRnNorton,
    iShortCircuit,
    iR1Open,
    iR2Open,

    verificationErrorCurrent,
    verificationErrorVoltage,

    error: null,
  };
}

/* ============================================================================
   CIRCUIT AREA
============================================================================ */

function CircuitComparisonPanel({
  values,
  result,
  isRunning,
  viewMode,
}: {
  values: CircuitValues;
  result: NortonResult;
  isRunning: boolean;
  viewMode: ViewMode;
}) {
  const showMovingDots = isRunning && viewMode !== 'debug';

  return (
    <section className="rounded-lg border-2 border-[#0648b8] bg-white p-3">
      <div className="mb-2 grid grid-cols-1 gap-3 md:grid-cols-2">
        <h1 className="text-center text-[30px] font-black uppercase text-[#0648b8]">
          Original Circuit
        </h1>

        <h1 className="text-center text-[30px] font-black uppercase text-[#7c3aed]">
          Norton Equivalent
        </h1>
      </div>

      <div className="h-[700px] w-full">
        <svg
          viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          className="h-full w-full"
        >
          <g transform={`scale(${SCALE.CANVAS})`}>
            <CenterDivider />

            {viewMode === 'comparison' && <ComparisonHighlight />}
            {viewMode === 'shortCircuit' && <ShortCircuitHighlight />}
            {viewMode === 'rn' && <RnHighlight />}
            {viewMode === 'equivalent' && <EquivalentHighlight />}

            <WireLayer />
            <ComponentLayer values={values} result={result} viewMode={viewMode} />
            <NodeLayer />
            <GroundLayer />

            {showMovingDots && <MovingCurrentLayer result={result} viewMode={viewMode} />}

            <DiagramOverlay result={result} viewMode={viewMode} />

            {viewMode === 'debug' && <DebugTerminalLayer />}
          </g>
        </svg>
      </div>
    </section>
  );
}

function CenterDivider() {
  return (
    <line
      x1="655"
      y1="25"
      x2="655"
      y2="690"
      stroke="#8bb8ff"
      strokeWidth="3"
      strokeDasharray="10 10"
    />
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
  viewMode,
}: {
  values: CircuitValues;
  result: NortonResult;
  viewMode: ViewMode;
}) {
  const loadOpacity = viewMode === 'shortCircuit' ? 0.18 : 1;

  return (
    <g>
      <SvgResistor
        id="originalR1"
        label="R"
        sub="1"
        value={`${values.r1} Ω`}
        start={COMPONENT_GEOMETRY.originalR1.start}
        end={COMPONENT_GEOMETRY.originalR1.end}
        labelPoint={COMPONENT_GEOMETRY.originalR1.label}
        valuePoint={COMPONENT_GEOMETRY.originalR1.value}
      />

      <SvgResistor
        id="originalR2"
        label="R"
        sub="2"
        value={`${values.r2} Ω`}
        start={COMPONENT_GEOMETRY.originalR2.start}
        end={COMPONENT_GEOMETRY.originalR2.end}
        labelPoint={COMPONENT_GEOMETRY.originalR2.label}
        valuePoint={COMPONENT_GEOMETRY.originalR2.value}
        anchor="end"
      />

      <g opacity={loadOpacity}>
        <SvgResistor
          id="originalLoad"
          label="R"
          sub="L"
          value={`${values.rLoad} Ω`}
          start={COMPONENT_GEOMETRY.originalLoad.start}
          end={COMPONENT_GEOMETRY.originalLoad.end}
          labelPoint={COMPONENT_GEOMETRY.originalLoad.label}
          valuePoint={COMPONENT_GEOMETRY.originalLoad.value}
          anchor="start"
        />
      </g>

      {viewMode === 'shortCircuit' && (
        <ShortCircuitMark x={ORIGINAL.loadTop.x} y={ORIGINAL.loadTop.y} />
      )}

      {viewMode === 'rn' ? (
        <ShortedVoltageSource
          center={COMPONENT_GEOMETRY.originalVs.center}
          labelPoint={COMPONENT_GEOMETRY.originalVs.label}
          valuePoint={COMPONENT_GEOMETRY.originalVs.value}
        />
      ) : (
        <SvgVoltageSource
          id="originalVs"
          label="V"
          sub="s"
          value={`${values.vs} V`}
          center={COMPONENT_GEOMETRY.originalVs.center}
          labelPoint={COMPONENT_GEOMETRY.originalVs.label}
          valuePoint={COMPONENT_GEOMETRY.originalVs.value}
        />
      )}

      <SvgCurrentSource
        id="nortonSource"
        label="I"
        sub="N"
        value={`${result.inorton.toFixed(4)} A`}
        center={COMPONENT_GEOMETRY.nortonSource.center}
        labelPoint={COMPONENT_GEOMETRY.nortonSource.label}
        valuePoint={COMPONENT_GEOMETRY.nortonSource.value}
      />

      <SvgResistor
        id="nortonRn"
        label="R"
        sub="N"
        value={`${result.rn.toFixed(2)} Ω`}
        start={COMPONENT_GEOMETRY.nortonRn.start}
        end={COMPONENT_GEOMETRY.nortonRn.end}
        labelPoint={COMPONENT_GEOMETRY.nortonRn.label}
        valuePoint={COMPONENT_GEOMETRY.nortonRn.value}
        anchor="start"
      />

      <SvgResistor
        id="nortonLoad"
        label="R"
        sub="L"
        value={`${values.rLoad} Ω`}
        start={COMPONENT_GEOMETRY.nortonLoad.start}
        end={COMPONENT_GEOMETRY.nortonLoad.end}
        labelPoint={COMPONENT_GEOMETRY.nortonLoad.label}
        valuePoint={COMPONENT_GEOMETRY.nortonLoad.value}
        anchor="start"
      />
    </g>
  );
}

function NodeLayer() {
  return (
    <g>
      <CircuitNode point={ORIGINAL.a} label="A" offset={{ x: -15, y: -28 }} />
      <CircuitNode point={ORIGINAL.bottomNode} label="B" offset={{ x: -15, y: 45 }} />

      <CircuitNode point={ORIGINAL.loadTop} label="A" offset={{ x: -15, y: -28 }} hollow />
      <CircuitNode point={ORIGINAL.loadBottom} label="B" offset={{ x: 18, y: 45 }} hollow />

      <CircuitNode point={NORTON.a} label="A" offset={{ x: -15, y: -28 }} hollow />
      <CircuitNode point={NORTON.b} label="B" offset={{ x: 18, y: 45 }} hollow />
    </g>
  );
}

function GroundLayer() {
  return (
    <g>
      <GroundSymbol x={ORIGINAL.bottomNode.x} y={ORIGINAL.bottomNode.y + 28} />
      <GroundSymbol x={NORTON.b.x} y={NORTON.b.y + 28} />
    </g>
  );
}

function MovingCurrentLayer({
  result,
  viewMode,
}: {
  result: NortonResult;
  viewMode: ViewMode;
}) {
  const showOriginalLoaded = viewMode === 'comparison' || viewMode === 'practice';
  const showShortCircuit = viewMode === 'shortCircuit';
  const showEquivalent = viewMode === 'equivalent' || viewMode === 'comparison' || viewMode === 'practice';

  return (
    <g>
      {showOriginalLoaded && (
        <>
          <MovingCharge
            path={createPath([
              ORIGINAL.sourceBottom,
              ORIGINAL.vsSourceBottom,
              ORIGINAL.vsSourceTop,
              ORIGINAL.vsTop,
              ORIGINAL.r1Left,
              ORIGINAL.r1Right,
              ORIGINAL.a,
              ORIGINAL.loadTop,
              ORIGINAL.loadRTop,
              ORIGINAL.loadRBottom,
              ORIGINAL.loadBottom,
              ORIGINAL.bottomNode,
              ORIGINAL.sourceBottom,
            ])}
            current={result.iLoadOriginal}
            color={COLOR.originalDot}
          />

          <MovingCharge
            path={createPath([
              ORIGINAL.a,
              ORIGINAL.r2Top,
              ORIGINAL.r2Bottom,
              ORIGINAL.bottomNode,
            ])}
            current={result.iR2Open}
            color={COLOR.rnDot}
          />
        </>
      )}

      {showShortCircuit && (
        <MovingCharge
          path={createPath([
            ORIGINAL.sourceBottom,
            ORIGINAL.vsSourceBottom,
            ORIGINAL.vsSourceTop,
            ORIGINAL.vsTop,
            ORIGINAL.r1Left,
            ORIGINAL.r1Right,
            ORIGINAL.a,
            ORIGINAL.loadTop,
            ORIGINAL.loadBottom,
            ORIGINAL.bottomNode,
            ORIGINAL.sourceBottom,
          ])}
          current={result.iShortCircuit}
          color={COLOR.shortCircuitDot}
          radius={10}
        />
      )}

      {showEquivalent && (
        <>
          <MovingCharge
            path={createPath([
              NORTON.bottomBusLeft,
              NORTON.sourceBottom,
              NORTON.sourceTop,
              NORTON.topBusLeft,
              NORTON.loadTop,
              NORTON.loadRTop,
              NORTON.loadRBottom,
              NORTON.loadBottom,
              NORTON.bottomBusLeft,
            ])}
            current={result.iLoadNorton}
            color={COLOR.nortonDot}
            radius={10}
          />

          <MovingCharge
            path={createPath([
              NORTON.topBusLeft,
              NORTON.rnTop,
              NORTON.rnBottom,
              NORTON.bottomBusLeft,
            ])}
            current={result.iRnNorton}
            color={COLOR.rnDot}
          />
        </>
      )}
    </g>
  );
}

/* ============================================================================
   HIGHLIGHTS / OVERLAY
============================================================================ */

function ComparisonHighlight() {
  return (
    <g>
      <rect x="30" y="35" width="590" height="620" rx="18" fill={COLOR.original} opacity="0.05" />
      <rect x="690" y="35" width="520" height="620" rx="18" fill={COLOR.norton} opacity="0.05" />
    </g>
  );
}

function ShortCircuitHighlight() {
  return (
    <g>
      <rect x="360" y="115" width="240" height="470" rx="16" fill={COLOR.warning} opacity="0.08" />
      <text x="465" y="245" textAnchor="middle" fontSize="21" fontWeight="900" fill={COLOR.warning}>
        RL Removed
      </text>
      <text x="465" y="275" textAnchor="middle" fontSize="18" fontWeight="800" fill={COLOR.warning}>
        Find IN = ISC
      </text>
    </g>
  );
}

function RnHighlight() {
  return (
    <g>
      <rect x="70" y="105" width="390" height="510" rx="16" fill={COLOR.warning} opacity="0.08" />
      <text x="245" y="250" textAnchor="middle" fontSize="21" fontWeight="900" fill={COLOR.warning}>
        Source Shorted
      </text>
      <text x="245" y="280" textAnchor="middle" fontSize="18" fontWeight="800" fill={COLOR.warning}>
        RN = R1 || R2
      </text>
    </g>
  );
}

function EquivalentHighlight() {
  return (
    <g>
      <rect x="690" y="35" width="520" height="620" rx="18" fill={COLOR.norton} opacity="0.09" />
    </g>
  );
}

function ShortCircuitMark({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y - 10} x2={x} y2={y + 410} stroke={COLOR.warning} strokeWidth="7" />
      <text x={x + 35} y={y + 205} fontSize="21" fontWeight="900" fill={COLOR.warning}>
        short
      </text>
    </g>
  );
}

function DiagramOverlay({
  result,
  viewMode,
}: {
  result: NortonResult;
  viewMode: ViewMode;
}) {
  const overlayX = 870;
  const overlayY = 505;

  const lines =
    viewMode === 'comparison'
      ? [
          { color: COLOR.originalDot, text: 'Green = original load current' },
          { color: COLOR.nortonDot, text: 'Purple = Norton load current' },
          { color: COLOR.nodeLabel, text: 'Both load results match' },
        ]
      : viewMode === 'shortCircuit'
        ? [
            { color: COLOR.shortCircuitDot, text: 'Blue = short-circuit current' },
            { color: COLOR.warning, text: 'RL replaced by short' },
            { color: COLOR.nodeLabel, text: 'IN = ISC' },
          ]
        : viewMode === 'rn'
          ? [
              { color: COLOR.warning, text: 'Voltage source replaced by short' },
              { color: COLOR.nodeLabel, text: 'RN seen from A-B' },
              { color: COLOR.resistor, text: 'RN = R1 || R2' },
            ]
          : viewMode === 'equivalent'
            ? [
                { color: COLOR.nortonDot, text: 'Norton equivalent circuit' },
                { color: COLOR.norton, text: 'IN in parallel with RN' },
                { color: COLOR.load, text: 'RL reconnected' },
              ]
            : viewMode === 'practice'
              ? [
                  { color: COLOR.nortonDot, text: 'Solve IN, RN, IL' },
                  { color: COLOR.load, text: 'Use current division' },
                  { color: COLOR.nodeLabel, text: 'Submit answer below' },
                ]
              : [
                  { color: COLOR.debug, text: 'Orange dots = debug terminals' },
                  { color: COLOR.wire, text: 'Wire segments are structured' },
                  { color: COLOR.resistor, text: 'Reusable SVG blocks' },
                ];

  return (
    <g>
      <rect x={overlayX} y={overlayY} width="335" height="104" rx="10" fill="white" stroke="#cbd5e1" />

      {lines.map((line, index) => (
        <g key={line.text}>
          <circle cx={overlayX + 22} cy={overlayY + 25 + index * 28} r="7" fill={line.color} />
          <text
            x={overlayX + 43}
            y={overlayY + 31 + index * 28}
            fontSize="15"
            fontWeight="800"
            fill="#0f172a"
          >
            {line.text}
          </text>
        </g>
      ))}

      <rect x="35" y="35" width="310" height="122" rx="10" fill="#eef2ff" stroke="#94a3b8" />
      <text x="55" y="65" fontSize="18" fontWeight="900" fill="#1e3a8a">
        IN = {result.inorton.toFixed(5)} A
      </text>
      <text x="55" y="92" fontSize="18" fontWeight="900" fill="#5b21b6">
        RN = {result.rn.toFixed(3)} Ω
      </text>
      <text x="55" y="119" fontSize="18" fontWeight="900" fill="#166534">
        IL = {result.iLoadNorton.toFixed(5)} A
      </text>
      <text x="55" y="145" fontSize="15" fontWeight="800" fill="#0f172a">
        Original/Norton error ≈ 0
      </text>
    </g>
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

function SvgCurrentSource({
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
        r={COMPONENT.currentSource.radius}
        fill="white"
        stroke="black"
        strokeWidth={COMPONENT.currentSource.strokeWidth}
      />

      <line
        x1={c.x}
        y1={c.y + 35}
        x2={c.x}
        y2={c.y - 25}
        stroke={COLOR.currentSource}
        strokeWidth="7"
      />
      <polygon
        points={`${c.x},${c.y - 45} ${c.x - 18},${c.y - 11} ${c.x + 18},${c.y - 11}`}
        fill={COLOR.currentSource}
      />

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

function ShortedVoltageSource({
  center,
  labelPoint,
  valuePoint,
}: {
  center: Point;
  labelPoint: Point;
  valuePoint: Point;
}) {
  return (
    <g>
      <line x1={center.x} y1={center.y - 60} x2={center.x} y2={center.y + 60} stroke={COLOR.warning} strokeWidth="7" />
      <text x={labelPoint.x} y={labelPoint.y} fontSize="24" fontWeight="900" fill={COLOR.warning}>
        Vs off
      </text>
      <text x={valuePoint.x} y={valuePoint.y} fontSize="20" fontWeight="800" fill={COLOR.warning}>
        short circuit
      </text>
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

function GroundSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y - 28} x2={x} y2={y} stroke="black" strokeWidth="4" />
      <line x1={x - 34} y1={y} x2={x + 34} y2={y} stroke="black" strokeWidth="4" />
      <line x1={x - 22} y1={y + 16} x2={x + 22} y2={y + 16} stroke="black" strokeWidth="4" />
      <line x1={x - 10} y1={y + 32} x2={x + 10} y2={y + 32} stroke="black" strokeWidth="4" />
    </g>
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
  result: NortonResult;
  viewMode: ViewMode;
}) {
  return (
    <section className="rounded-lg border-2 border-[#0648b8] bg-white">
      <div className="rounded-t-md bg-gradient-to-r from-[#0648b8] to-[#0b58c6] py-4 text-center text-[31px] font-black uppercase tracking-wide text-white">
        Norton&apos;s Theorem
      </div>

      <div className="space-y-5 px-6 py-5 text-[22px] leading-snug">
        <ConceptItem number={1}>Remove the load resistor RL</ConceptItem>
        <ConceptItem number={2}>Short terminals A-B and find IN = ISC</ConceptItem>
        <ConceptItem number={3}>Turn off independent voltage source</ConceptItem>
        <ConceptItem number={4}>Find RN seen from terminals A-B</ConceptItem>
        <ConceptItem number={5}>Reconnect RL to IN parallel RN</ConceptItem>
      </div>

      <div className="mx-5 h-[2px] bg-[#8bb8ff]" />

      <div className="mx-auto w-fit rounded-b-lg bg-[#e6f2ff] px-8 py-3 text-[23px] font-black text-[#0648b8]">
        Live Equations
      </div>

      <div className="px-6 py-4 text-[17px] font-bold">
        <EquationBlock title="Norton current">
          I<sub>N</sub> = I<sub>SC</sub> = V<sub>s</sub> / R<sub>1</sub>
        </EquationBlock>

        <EquationBlock title="Norton resistance">
          R<sub>N</sub> = R<sub>1</sub> || R<sub>2</sub>
        </EquationBlock>

        <EquationBlock title="Load current">
          I<sub>L</sub> = I<sub>N</sub> × R<sub>N</sub> / (R<sub>N</sub> + R<sub>L</sub>)
        </EquationBlock>

        <div className="mt-5 rounded-lg border-2 border-[#3a7bdc] bg-white px-5 py-3">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-serif text-[20px] italic">
            <span>R₁ = {values.r1} Ω</span>
            <span>R₂ = {values.r2} Ω</span>
            <span>RL = {values.rLoad} Ω</span>
            <span>Vs = {values.vs} V</span>
            <span>IN = {result.inorton.toFixed(5)} A</span>
            <span>RN = {result.rn.toFixed(3)} Ω</span>
            <span>Vth = {result.vth.toFixed(3)} V</span>
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

      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        <ValueInput
          label="R₁"
          value={values.r1}
          unit="Ω"
          min={0.1}
          step={1}
          onChange={(value) => updateValue('r1', value)}
        />

        <ValueInput
          label="R₂"
          value={values.r2}
          unit="Ω"
          min={0.1}
          step={1}
          onChange={(value) => updateValue('r2', value)}
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
          label="Vs"
          value={values.vs}
          unit="V"
          min={0}
          step={1}
          onChange={(value) => updateValue('vs', value)}
        />
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
  onGenerateProblem,
}: {
  status: Status;
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
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
        onClick={onGenerateProblem}
        className="mt-4 w-full rounded-lg bg-gradient-to-b from-[#7c3aed] to-[#5b21b6] px-4 py-3 text-[17px] font-black text-white"
      >
        Generate Practice Problem
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ModeButton label="Compare" active={viewMode === 'comparison'} onClick={() => setViewMode('comparison')} />
        <ModeButton label="Short Ckt" active={viewMode === 'shortCircuit'} onClick={() => setViewMode('shortCircuit')} />
        <ModeButton label="RN" active={viewMode === 'rn'} onClick={() => setViewMode('rn')} />
        <ModeButton label="Equivalent" active={viewMode === 'equivalent'} onClick={() => setViewMode('equivalent')} />
        <ModeButton label="Practice" active={viewMode === 'practice'} onClick={() => setViewMode('practice')} />
        <ModeButton label="Debug" active={viewMode === 'debug'} onClick={() => setViewMode('debug')} />
      </div>
    </section>
  );
}

function ResultsPanel({ result }: { result: NortonResult }) {
  const currentOk = Math.abs(result.verificationErrorCurrent) < 1e-10;
  const voltageOk = Math.abs(result.verificationErrorVoltage) < 1e-10;

  return (
    <section className="min-h-[305px] bg-white p-4">
      <h2 className="text-center text-[23px] font-black uppercase text-[#0648b8]">
        Results
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ResultCard label="IN" value={`${result.inorton.toFixed(5)} A`} color="blue" />
        <ResultCard label="RN" value={`${result.rn.toFixed(3)} Ω`} color="purple" />
        <ResultCard label="IL" value={`${result.iLoadNorton.toFixed(5)} A`} color="green" />
      </div>

      <div className="mt-5 rounded-lg border-2 border-[#8bb8ff] bg-white px-5 py-4 text-[16px] font-bold">
        <p>Original IL = {result.iLoadOriginal.toFixed(8)} A</p>
        <p>Norton IL = {result.iLoadNorton.toFixed(8)} A</p>
        <p>Current error = {result.verificationErrorCurrent.toExponential(3)} A {currentOk ? '✅' : '❌'}</p>
        <p>Voltage error = {result.verificationErrorVoltage.toExponential(3)} V {voltageOk ? '✅' : '❌'}</p>
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
  result: NortonResult;
  viewMode: ViewMode;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section className="mt-4 rounded-lg border-2 border-[#0648b8] bg-white p-5">
      <h2 className="text-center text-[24px] font-black uppercase text-[#0648b8]">
        Live Norton Math Solver
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
  result: NortonResult;
}) {
  return (
    <div className="rounded-lg bg-[#eef6ff] p-5">
      <h3 className="text-[21px] font-black text-[#0648b8]">
        Step-by-step Calculation
      </h3>

      <div className="mt-4 space-y-3 rounded-lg bg-white p-4 text-[16px] font-bold">
        <p>IN = ISC = Vs / R1</p>
        <p>
          IN = {values.vs} / {values.r1} = {result.inorton.toFixed(8)} A
        </p>

        <div className="h-px bg-slate-300" />

        <p>RN = R1 || R2 = R1R2 / (R1 + R2)</p>
        <p>
          RN = ({values.r1} × {values.r2}) / ({values.r1} + {values.r2}) = {result.rn.toFixed(5)} Ω
        </p>

        <div className="h-px bg-slate-300" />

        <p>IL = IN × RN / (RN + RL)</p>
        <p>
          IL = {result.inorton.toFixed(8)} × {result.rn.toFixed(5)} / ({result.rn.toFixed(5)} + {values.rLoad}) = {result.iLoadNorton.toFixed(8)} A
        </p>
      </div>
    </div>
  );
}

function VerificationPanel({ result }: { result: NortonResult }) {
  return (
    <div className="rounded-lg bg-[#f4efff] p-5">
      <h3 className="text-[21px] font-black text-[#5b21b6]">
        Original vs Norton Check
      </h3>

      <div className="mt-4 space-y-3 rounded-lg bg-white p-4 text-[16px] font-bold">
        <p>Original loaded voltage = {result.vLoadOriginal.toFixed(6)} V</p>
        <p>Norton loaded voltage = {result.vLoadNorton.toFixed(6)} V</p>
        <p>Original load current = {result.iLoadOriginal.toFixed(8)} A</p>
        <p>Norton load current = {result.iLoadNorton.toFixed(8)} A</p>

        <div className="h-px bg-slate-300" />

        <p>Thevenin voltage check: Vth = IN × RN = {result.vth.toFixed(6)} V</p>
        <p>Load power = {result.pLoadNorton.toFixed(6)} W</p>
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
  result: NortonResult;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const checks = {
    inorton: isClose(practiceInputs.inorton, result.inorton, ANSWER_TOLERANCE.current),
    rn: isClose(practiceInputs.rn, result.rn, ANSWER_TOLERANCE.resistance),
    iLoad: isClose(practiceInputs.iLoad, result.iLoadNorton, ANSWER_TOLERANCE.current),
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
        Solve for IN, RN and IL. Type current in A and resistance in Ω.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnswerInput
          label="IN"
          unit="A"
          value={practiceInputs.inorton}
          correct={checks.inorton}
          submitted={submitted}
          onChange={(value) => updateInput('inorton', value)}
        />

        <AnswerInput
          label="RN"
          unit="Ω"
          value={practiceInputs.rn}
          correct={checks.rn}
          submitted={submitted}
          onChange={(value) => updateInput('rn', value)}
        />

        <AnswerInput
          label="IL"
          unit="A"
          value={practiceInputs.iLoad}
          correct={checks.iLoad}
          submitted={submitted}
          onChange={(value) => updateInput('iLoad', value)}
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
            <p>IN = {result.inorton.toFixed(6)} A</p>
            <p>RN = {result.rn.toFixed(3)} Ω</p>
            <p>IL = {result.iLoadNorton.toFixed(6)} A</p>
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
    <div className="grid grid-cols-[64px_1fr_44px] items-center gap-3 text-[20px]">
      <label className="font-serif text-[23px] font-black italic">
        {label}
      </label>

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
  color: 'blue' | 'purple' | 'green';
}) {
  const colorClass =
    color === 'blue'
      ? 'text-[#0648b8]'
      : color === 'purple'
        ? 'text-[#7c3aed]'
        : 'text-[#15803d]';

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