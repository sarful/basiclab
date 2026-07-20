'use client';

import React, { useMemo, useState } from 'react';

/* ============================================================================
   TYPES
============================================================================ */

type Status = 'Ready' | 'Running' | 'Paused';
type ViewMode = 'simulation' | 'equation' | 'practice' | 'debug';

type Point = {
  x: number;
  y: number;
};

type CircuitValues = {
  r1: number;
  r2: number;
  r3: number;
  r4: number;
  r5: number;
  vs: number;
  is: number;
};

type NodalResult = {
  v1: number;
  v2: number;
  v3: number;

  iR1: number;
  iR2: number;
  iR3: number;
  iR4: number;
  iR5: number;
  iSource: number;

  pR1: number;
  pR2: number;
  pR3: number;
  pR4: number;
  pR5: number;

  a11: number;
  a12: number;
  a13: number;
  a21: number;
  a22: number;
  a23: number;
  a31: number;
  a32: number;
  a33: number;

  b1: number;
  b2: number;
  b3: number;

  kcl1: number;
  kcl2: number;
  kcl3: number;

  error: string | null;
};

type PracticeInputs = {
  v1: string;
  v2: string;
  v3: string;
};

type ComponentId = 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'vs' | 'is';

type WireId =
  | 'sourceTopToVsTop'
  | 'vsBottomToSourceBottom'
  | 'sourceTopToR1'
  | 'r1ToV1'
  | 'v1ToR2'
  | 'r2ToV2'
  | 'v1ToR3'
  | 'r3ToGround'
  | 'v2ToR4'
  | 'r4ToV3'
  | 'groundToR5'
  | 'r5ToV3'
  | 'groundToSourceBottom'
  | 'v2ToCurrentTop'
  | 'currentTopToIsTop'
  | 'isBottomToCurrentBottom'
  | 'currentBottomToV3';

/* ============================================================================
   CONSTANTS
============================================================================ */

const DEFAULT_VALUES: CircuitValues = {
  r1: 100,
  r2: 220,
  r3: 150,
  r4: 330,
  r5: 180,
  vs: 10,
  is: 0.02,
};

const EMPTY_PRACTICE: PracticeInputs = {
  v1: '',
  v2: '',
  v3: '',
};

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const BASE_WIRE_WIDTH = 4;

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1160,
  height: 800,
};

const SCALE = {
  CANVAS: CIRCUIT_CANVAS_SCALE,
  COMPONENT: CIRCUIT_COMPONENT_SCALE,
  WIRE: CIRCUIT_WIRE_SCALE,
};

const COLOR = {
  wire: '#000000',
  resistor: '#111827',

  voltagePositive: '#e00000',
  voltageNegative: '#111827',
  currentSource: '#0648d8',

  node: '#000000',
  nodeLabel: '#0648b8',

  branchCurrent: '#16a34a',
  sourceCurrent: '#7c3aed',

  highlightNode1: '#2563eb',
  highlightNode2: '#7c3aed',
  highlightNode3: '#15803d',

  debug: '#f97316',
};

const COMPONENT = {
  resistor: {
    leadLength: 24 * SCALE.COMPONENT,
    amplitude: 24 * SCALE.COMPONENT,
    zigzags: 6,
    strokeWidth: 5 * SCALE.COMPONENT,
  },
  source: {
    voltageRadius: 43 * SCALE.COMPONENT,
    currentRadius: 47 * SCALE.COMPONENT,
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
  radius: 10 * SCALE.COMPONENT,
};

const LABEL = {
  title: 30,
  value: 23,
  node: 40,
  sub: 16,
};

const ANSWER_TOLERANCE = 0.01;

/* ============================================================================
   OFFSETS
============================================================================ */

const COMPONENT_OFFSET: Record<ComponentId, Point> = {
  r1: { x: 0, y: 0 },
  r2: { x: 0, y: 0 },
  r3: { x: 0, y: 0 },
  r4: { x: 0, y: 0 },
  r5: { x: 0, y: 0 },
  vs: { x: 0, y: 0 },
  is: { x: 0, y: 0 },
};

const LABEL_OFFSET: Record<ComponentId, Point> = {
  r1: { x: 0, y: 0 },
  r2: { x: 0, y: 0 },
  r3: { x: 0, y: 0 },
  r4: { x: 0, y: 0 },
  r5: { x: 0, y: 0 },
  vs: { x: 0, y: 0 },
  is: { x: 0, y: 0 },
};

const WIRE_OFFSET: Record<WireId, Point> = {
  sourceTopToVsTop: { x: 0, y: 0 },
  vsBottomToSourceBottom: { x: 0, y: 0 },

  sourceTopToR1: { x: 0, y: 0 },
  r1ToV1: { x: 0, y: 0 },

  v1ToR2: { x: 0, y: 0 },
  r2ToV2: { x: 0, y: 0 },

  v1ToR3: { x: 0, y: 0 },
  r3ToGround: { x: 0, y: 0 },

  v2ToR4: { x: 0, y: 0 },
  r4ToV3: { x: 0, y: 0 },

  groundToR5: { x: 0, y: 0 },
  r5ToV3: { x: 0, y: 0 },

  groundToSourceBottom: { x: 0, y: 0 },

  v2ToCurrentTop: { x: 0, y: 0 },
  currentTopToIsTop: { x: 0, y: 0 },
  isBottomToCurrentBottom: { x: 0, y: 0 },
  currentBottomToV3: { x: 0, y: 0 },
};

const DEBUG_TERMINAL_OFFSET: Point = {
  x: 0,
  y: 0,
};

/* ============================================================================
   GEOMETRY
============================================================================ */

const TERMINAL = {
  sourceTop: { x: 110, y: 130 },
  sourceBottom: { x: 110, y: 640 },

  vsTop: { x: 110, y: 342 },
  vsBottom: { x: 110, y: 428 },

  v1: { x: 390, y: 130 },
  v2: { x: 760, y: 130 },
  v3: { x: 760, y: 640 },

  ground: { x: 390, y: 640 },

  r1Left: { x: 190, y: 130 },
  r1Right: { x: 310, y: 130 },

  r2Left: { x: 500, y: 130 },
  r2Right: { x: 650, y: 130 },

  r3Top: { x: 390, y: 320 },
  r3Bottom: { x: 390, y: 465 },

  r4Top: { x: 760, y: 320 },
  r4Bottom: { x: 760, y: 465 },

  r5Left: { x: 500, y: 640 },
  r5Right: { x: 650, y: 640 },

  currentTop: { x: 970, y: 130 },
  currentBottom: { x: 970, y: 640 },

  isTop: { x: 970, y: 338 },
  isBottom: { x: 970, y: 432 },
};

const COMPONENT_GEOMETRY = {
  r1: {
    start: TERMINAL.r1Left,
    end: TERMINAL.r1Right,
    label: { x: 250, y: 78 },
    value: { x: 250, y: 185 },
  },
  r2: {
    start: TERMINAL.r2Left,
    end: TERMINAL.r2Right,
    label: { x: 575, y: 78 },
    value: { x: 575, y: 185 },
  },
  r3: {
    start: TERMINAL.r3Top,
    end: TERMINAL.r3Bottom,
    label: { x: 315, y: 390 },
    value: { x: 305, y: 430 },
  },
  r4: {
    start: TERMINAL.r4Top,
    end: TERMINAL.r4Bottom,
    label: { x: 680, y: 390 },
    value: { x: 670, y: 430 },
  },
  r5: {
    start: TERMINAL.r5Left,
    end: TERMINAL.r5Right,
    label: { x: 575, y: 595 },
    value: { x: 575, y: 720 },
  },
  vs: {
    center: { x: 110, y: 385 },
    label: { x: 35, y: 390 },
    value: { x: 35, y: 435 },
  },
  is: {
    center: { x: 970, y: 385 },
    label: { x: 1025, y: 390 },
    value: { x: 1010, y: 435 },
  },
};

const WIRE_SEGMENTS: Array<{
  id: WireId;
  from: Point;
  to: Point;
}> = [
  // Left voltage source branch, fixed connection
  { id: 'sourceTopToVsTop', from: TERMINAL.sourceTop, to: TERMINAL.vsTop },
  { id: 'vsBottomToSourceBottom', from: TERMINAL.vsBottom, to: TERMINAL.sourceBottom },

  // Top-left branch
  { id: 'sourceTopToR1', from: TERMINAL.sourceTop, to: TERMINAL.r1Left },
  { id: 'r1ToV1', from: TERMINAL.r1Right, to: TERMINAL.v1 },

  // Top-middle branch
  { id: 'v1ToR2', from: TERMINAL.v1, to: TERMINAL.r2Left },
  { id: 'r2ToV2', from: TERMINAL.r2Right, to: TERMINAL.v2 },

  // R3 vertical branch
  { id: 'v1ToR3', from: TERMINAL.v1, to: TERMINAL.r3Top },
  { id: 'r3ToGround', from: TERMINAL.r3Bottom, to: TERMINAL.ground },

  // R4 vertical branch
  { id: 'v2ToR4', from: TERMINAL.v2, to: TERMINAL.r4Top },
  { id: 'r4ToV3', from: TERMINAL.r4Bottom, to: TERMINAL.v3 },

  // Bottom branch
  { id: 'groundToR5', from: TERMINAL.ground, to: TERMINAL.r5Left },
  { id: 'r5ToV3', from: TERMINAL.r5Right, to: TERMINAL.v3 },

  // Ground to voltage source bottom
  { id: 'groundToSourceBottom', from: TERMINAL.ground, to: TERMINAL.sourceBottom },

  // Right current source branch, fixed connection
  { id: 'v2ToCurrentTop', from: TERMINAL.v2, to: TERMINAL.currentTop },
  { id: 'currentTopToIsTop', from: TERMINAL.currentTop, to: TERMINAL.isTop },
  { id: 'isBottomToCurrentBottom', from: TERMINAL.isBottom, to: TERMINAL.currentBottom },
  { id: 'currentBottomToV3', from: TERMINAL.currentBottom, to: TERMINAL.v3 },
];

const DEBUG_TERMINALS = [
  ['VS+', TERMINAL.sourceTop],
  ['VS-T', TERMINAL.vsTop],
  ['VS-B', TERMINAL.vsBottom],
  ['VS−', TERMINAL.sourceBottom],

  ['V1', TERMINAL.v1],
  ['V2', TERMINAL.v2],
  ['V3', TERMINAL.v3],
  ['GND', TERMINAL.ground],

  ['R1-L', TERMINAL.r1Left],
  ['R1-R', TERMINAL.r1Right],
  ['R2-L', TERMINAL.r2Left],
  ['R2-R', TERMINAL.r2Right],
  ['R3-T', TERMINAL.r3Top],
  ['R3-B', TERMINAL.r3Bottom],
  ['R4-T', TERMINAL.r4Top],
  ['R4-B', TERMINAL.r4Bottom],
  ['R5-L', TERMINAL.r5Left],
  ['R5-R', TERMINAL.r5Right],

  ['IS-TOP', TERMINAL.currentTop],
  ['IS-C-T', TERMINAL.isTop],
  ['IS-C-B', TERMINAL.isBottom],
  ['IS-BOT', TERMINAL.currentBottom],
] as const;

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

export default function NodalVoltageAnalysisSimulator() {
  const [values, setValues] = useState<CircuitValues>(DEFAULT_VALUES);
  const [status, setStatus] = useState<Status>('Ready');
  const [viewMode, setViewMode] = useState<ViewMode>('simulation');
  const [practiceInputs, setPracticeInputs] = useState<PracticeInputs>(EMPTY_PRACTICE);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => solveNodal(values), [values]);

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

  const generateProblem = () => {
    setValues({
      r1: randomStep(50, 500, 10),
      r2: randomStep(50, 500, 10),
      r3: randomStep(50, 500, 10),
      r4: randomStep(50, 500, 10),
      r5: randomStep(50, 500, 10),
      vs: randomInt(5, 24),
      is: randomStep(0.005, 0.05, 0.005),
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
          <CircuitDiagram
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

function solveNodal(values: CircuitValues): NodalResult {
  const r1 = Math.max(values.r1, 0.0001);
  const r2 = Math.max(values.r2, 0.0001);
  const r3 = Math.max(values.r3, 0.0001);
  const r4 = Math.max(values.r4, 0.0001);
  const r5 = Math.max(values.r5, 0.0001);

  const g1 = 1 / r1;
  const g2 = 1 / r2;
  const g3 = 1 / r3;
  const g4 = 1 / r4;
  const g5 = 1 / r5;

  /*
    Node equations:

    Node V1:
    (V1 − Vs)/R1 + (V1 − V2)/R2 + V1/R3 = 0

    Node V2:
    (V2 − V1)/R2 + (V2 − V3)/R4 − Is = 0

    Node V3:
    (V3 − V2)/R4 + V3/R5 + Is = 0

    Current source direction:
    Is flows upward from V3 to V2.
  */

  const a11 = g1 + g2 + g3;
  const a12 = -g2;
  const a13 = 0;
  const b1 = g1 * values.vs;

  const a21 = -g2;
  const a22 = g2 + g4;
  const a23 = -g4;
  const b2 = values.is;

  const a31 = 0;
  const a32 = -g4;
  const a33 = g4 + g5;
  const b3 = -values.is;

  const solved = solve3x3(
    [
      [a11, a12, a13],
      [a21, a22, a23],
      [a31, a32, a33],
    ],
    [b1, b2, b3],
  );

  if (!solved) {
    return emptyResult(values, {
      a11,
      a12,
      a13,
      a21,
      a22,
      a23,
      a31,
      a32,
      a33,
      b1,
      b2,
      b3,
      error: 'Nodal matrix is singular. Please change component values.',
    });
  }

  const [v1, v2, v3] = solved;

  const iR1 = (values.vs - v1) / r1;
  const iR2 = (v1 - v2) / r2;
  const iR3 = v1 / r3;
  const iR4 = (v2 - v3) / r4;
  const iR5 = v3 / r5;
  const iSource = values.is;

  const kcl1 = (v1 - values.vs) / r1 + (v1 - v2) / r2 + v1 / r3;
  const kcl2 = (v2 - v1) / r2 + (v2 - v3) / r4 - values.is;
  const kcl3 = (v3 - v2) / r4 + v3 / r5 + values.is;

  return {
    v1,
    v2,
    v3,

    iR1,
    iR2,
    iR3,
    iR4,
    iR5,
    iSource,

    pR1: iR1 ** 2 * r1,
    pR2: iR2 ** 2 * r2,
    pR3: iR3 ** 2 * r3,
    pR4: iR4 ** 2 * r4,
    pR5: iR5 ** 2 * r5,

    a11,
    a12,
    a13,
    a21,
    a22,
    a23,
    a31,
    a32,
    a33,

    b1,
    b2,
    b3,

    kcl1,
    kcl2,
    kcl3,

    error: null,
  };
}

function solve3x3(matrix: number[][], vector: number[]) {
  const a = matrix.map((row, index) => [...row, vector[index]]);
  const EPS = 1e-12;

  for (let col = 0; col < 3; col += 1) {
    let pivotRow = col;

    for (let row = col + 1; row < 3; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivotRow][col])) {
        pivotRow = row;
      }
    }

    if (Math.abs(a[pivotRow][col]) < EPS) {
      return null;
    }

    if (pivotRow !== col) {
      [a[col], a[pivotRow]] = [a[pivotRow], a[col]];
    }

    const pivot = a[col][col];

    for (let j = col; j < 4; j += 1) {
      a[col][j] /= pivot;
    }

    for (let row = 0; row < 3; row += 1) {
      if (row === col) continue;

      const factor = a[row][col];

      for (let j = col; j < 4; j += 1) {
        a[row][j] -= factor * a[col][j];
      }
    }
  }

  return [a[0][3], a[1][3], a[2][3]];
}

function emptyResult(
  values: CircuitValues,
  data: {
    a11: number;
    a12: number;
    a13: number;
    a21: number;
    a22: number;
    a23: number;
    a31: number;
    a32: number;
    a33: number;
    b1: number;
    b2: number;
    b3: number;
    error: string;
  },
): NodalResult {
  return {
    v1: 0,
    v2: 0,
    v3: 0,

    iR1: 0,
    iR2: 0,
    iR3: 0,
    iR4: 0,
    iR5: 0,
    iSource: values.is,

    pR1: 0,
    pR2: 0,
    pR3: 0,
    pR4: 0,
    pR5: 0,

    a11: data.a11,
    a12: data.a12,
    a13: data.a13,
    a21: data.a21,
    a22: data.a22,
    a23: data.a23,
    a31: data.a31,
    a32: data.a32,
    a33: data.a33,

    b1: data.b1,
    b2: data.b2,
    b3: data.b3,

    kcl1: 0,
    kcl2: 0,
    kcl3: 0,

    error: data.error,
  };
}

/* ============================================================================
   CIRCUIT DIAGRAM
============================================================================ */

function CircuitDiagram({
  values,
  result,
  isRunning,
  viewMode,
}: {
  values: CircuitValues;
  result: NodalResult;
  isRunning: boolean;
  viewMode: ViewMode;
}) {
  const showMovingDots = isRunning && (viewMode === 'simulation' || viewMode === 'practice');
  const showDebug = viewMode === 'debug';
  const showEquationHighlight = viewMode === 'equation';

  return (
    <section className="rounded-lg bg-white p-2">
      <div className="h-[760px] w-full">
        <svg
          viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          className="h-full w-full"
        >
          <g transform={`scale(${SCALE.CANVAS})`}>
            {showEquationHighlight && <NodeHighlightLayer />}

            <WireLayer />
            <ComponentLayer values={values} />
            <NodeLayer />
            <SourceLayer values={values} />

            {showMovingDots && <MovingCurrentLayer result={result} />}

            <GroundSymbol x={TERMINAL.ground.x} y={TERMINAL.ground.y + 28} />
            <DiagramOverlay result={result} viewMode={viewMode} />

            {showDebug && <DebugTerminalLayer />}
          </g>
        </svg>
      </div>
    </section>
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
      <SvgResistor
        id="r1"
        label="R"
        sub="1"
        value={`${values.r1} Ω`}
        start={COMPONENT_GEOMETRY.r1.start}
        end={COMPONENT_GEOMETRY.r1.end}
        labelPoint={COMPONENT_GEOMETRY.r1.label}
        valuePoint={COMPONENT_GEOMETRY.r1.value}
      />

      <SvgResistor
        id="r2"
        label="R"
        sub="2"
        value={`${values.r2} Ω`}
        start={COMPONENT_GEOMETRY.r2.start}
        end={COMPONENT_GEOMETRY.r2.end}
        labelPoint={COMPONENT_GEOMETRY.r2.label}
        valuePoint={COMPONENT_GEOMETRY.r2.value}
      />

      <SvgResistor
        id="r3"
        label="R"
        sub="3"
        value={`${values.r3} Ω`}
        start={COMPONENT_GEOMETRY.r3.start}
        end={COMPONENT_GEOMETRY.r3.end}
        labelPoint={COMPONENT_GEOMETRY.r3.label}
        valuePoint={COMPONENT_GEOMETRY.r3.value}
        anchor="start"
      />

      <SvgResistor
        id="r4"
        label="R"
        sub="4"
        value={`${values.r4} Ω`}
        start={COMPONENT_GEOMETRY.r4.start}
        end={COMPONENT_GEOMETRY.r4.end}
        labelPoint={COMPONENT_GEOMETRY.r4.label}
        valuePoint={COMPONENT_GEOMETRY.r4.value}
        anchor="start"
      />

      <SvgResistor
        id="r5"
        label="R"
        sub="5"
        value={`${values.r5} Ω`}
        start={COMPONENT_GEOMETRY.r5.start}
        end={COMPONENT_GEOMETRY.r5.end}
        labelPoint={COMPONENT_GEOMETRY.r5.label}
        valuePoint={COMPONENT_GEOMETRY.r5.value}
      />
    </g>
  );
}

function NodeLayer() {
  return (
    <g>
      <CircuitNode point={TERMINAL.sourceTop} label="V" sub="s" offset={{ x: -25, y: -35 }} />
      <CircuitNode point={TERMINAL.sourceBottom} />

      <CircuitNode point={TERMINAL.v1} label="V" sub="1" offset={{ x: -30, y: -45 }} />
      <CircuitNode point={TERMINAL.v2} label="V" sub="2" offset={{ x: -30, y: -45 }} />
      <CircuitNode point={TERMINAL.v3} label="V" sub="3" offset={{ x: -30, y: 55 }} />
      <CircuitNode point={TERMINAL.ground} label="GND" offset={{ x: -45, y: 92 }} small />

      <CircuitNode point={TERMINAL.currentTop} />
      <CircuitNode point={TERMINAL.currentBottom} />
    </g>
  );
}

function SourceLayer({ values }: { values: CircuitValues }) {
  return (
    <g>
      <SvgVoltageSource
        id="vs"
        label="V"
        sub="s"
        value={`${values.vs} V`}
        center={COMPONENT_GEOMETRY.vs.center}
        labelPoint={COMPONENT_GEOMETRY.vs.label}
        valuePoint={COMPONENT_GEOMETRY.vs.value}
      />

      <SvgCurrentSource
        id="is"
        label="I"
        sub="s"
        value={`${formatAmp(values.is)} A`}
        center={COMPONENT_GEOMETRY.is.center}
        labelPoint={COMPONENT_GEOMETRY.is.label}
        valuePoint={COMPONENT_GEOMETRY.is.value}
      />
    </g>
  );
}

function MovingCurrentLayer({ result }: { result: NodalResult }) {
  return (
    <g>
      <MovingCharge
        path={createPath([
          TERMINAL.sourceTop,
          TERMINAL.r1Left,
          TERMINAL.r1Right,
          TERMINAL.v1,
        ])}
        current={result.iR1}
        reverse={result.iR1 < 0}
        color={COLOR.branchCurrent}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.sourceBottom,
          TERMINAL.vsBottom,
          TERMINAL.vsTop,
          TERMINAL.sourceTop,
        ])}
        current={result.iR1}
        reverse={result.iR1 < 0}
        color={COLOR.sourceCurrent}
        radius={10}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.v1,
          TERMINAL.r2Left,
          TERMINAL.r2Right,
          TERMINAL.v2,
        ])}
        current={result.iR2}
        reverse={result.iR2 < 0}
        color={COLOR.branchCurrent}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.v1,
          TERMINAL.r3Top,
          TERMINAL.r3Bottom,
          TERMINAL.ground,
        ])}
        current={result.iR3}
        reverse={result.iR3 < 0}
        color={COLOR.branchCurrent}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.v2,
          TERMINAL.r4Top,
          TERMINAL.r4Bottom,
          TERMINAL.v3,
        ])}
        current={result.iR4}
        reverse={result.iR4 < 0}
        color={COLOR.branchCurrent}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.v3,
          TERMINAL.r5Right,
          TERMINAL.r5Left,
          TERMINAL.ground,
        ])}
        current={result.iR5}
        reverse={result.iR5 < 0}
        color={COLOR.branchCurrent}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.v3,
          TERMINAL.currentBottom,
          TERMINAL.isBottom,
          TERMINAL.isTop,
          TERMINAL.currentTop,
          TERMINAL.v2,
        ])}
        current={result.iSource}
        reverse={result.iSource < 0}
        color={COLOR.sourceCurrent}
        radius={10}
      />
    </g>
  );
}

function NodeHighlightLayer() {
  return (
    <g>
      <circle cx={TERMINAL.v1.x} cy={TERMINAL.v1.y} r="45" fill={COLOR.highlightNode1} opacity="0.16" />
      <circle cx={TERMINAL.v2.x} cy={TERMINAL.v2.y} r="45" fill={COLOR.highlightNode2} opacity="0.16" />
      <circle cx={TERMINAL.v3.x} cy={TERMINAL.v3.y} r="45" fill={COLOR.highlightNode3} opacity="0.16" />
    </g>
  );
}

function DiagramOverlay({
  result,
  viewMode,
}: {
  result: NodalResult;
  viewMode: ViewMode;
}) {
  const overlayX = 805;
  const resultX = 805;

  const lines =
    viewMode === 'simulation'
      ? [
          { color: COLOR.branchCurrent, text: 'Green dots = branch currents' },
          { color: COLOR.sourceCurrent, text: 'Purple dot = source current' },
          { color: COLOR.nodeLabel, text: 'Node voltages solved by KCL' },
        ]
      : viewMode === 'equation'
        ? [
            { color: COLOR.highlightNode1, text: 'Node V1 equation highlighted' },
            { color: COLOR.highlightNode2, text: 'Node V2 equation highlighted' },
            { color: COLOR.highlightNode3, text: 'Node V3 equation highlighted' },
          ]
        : viewMode === 'practice'
          ? [
              { color: COLOR.nodeLabel, text: 'Solve V1, V2 and V3' },
              { color: COLOR.branchCurrent, text: 'Use KCL at all nodes' },
              { color: COLOR.sourceCurrent, text: 'Submit answers below' },
            ]
          : [
              { color: COLOR.debug, text: 'Orange dots = debug terminals' },
              { color: COLOR.wire, text: 'Use constants to tune layout' },
              { color: COLOR.resistor, text: 'Reusable SVG blocks separated' },
            ];

  return (
    <g>
      <rect x={overlayX} y="18" width="335" height="104" rx="10" fill="white" stroke="#cbd5e1" />

      {lines.map((line, index) => (
        <g key={line.text}>
          <circle cx={overlayX + 22} cy={43 + index * 28} r="7" fill={line.color} />
          <text x={overlayX + 43} y={49 + index * 28} fontSize="15" fontWeight="800" fill="#0f172a">
            {line.text}
          </text>
        </g>
      ))}

      <rect x={resultX} y="138" width="255" height="112" rx="10" fill="#eef2ff" stroke="#94a3b8" />
      <text x={resultX + 20} y="168" fontSize="18" fontWeight="900" fill="#1e3a8a">
        V1 = {result.v1.toFixed(3)} V
      </text>
      <text x={resultX + 20} y="194" fontSize="18" fontWeight="900" fill="#5b21b6">
        V2 = {result.v2.toFixed(3)} V
      </text>
      <text x={resultX + 20} y="220" fontSize="18" fontWeight="900" fill="#166534">
        V3 = {result.v3.toFixed(3)} V
      </text>
      <text x={resultX + 20} y="244" fontSize="15" fontWeight="800" fill="#0f172a">
        KCL residuals ≈ 0
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
        r={COMPONENT.source.voltageRadius}
        fill="white"
        stroke="black"
        strokeWidth={COMPONENT.source.strokeWidth}
      />

      <text x={c.x} y={c.y - 9} textAnchor="middle" fill={COLOR.voltagePositive} fontSize="37" fontWeight="900">
        +
      </text>

      <text x={c.x} y={c.y + 30} textAnchor="middle" fill={COLOR.voltageNegative} fontSize="37" fontWeight="900">
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
        r={COMPONENT.source.currentRadius}
        fill="white"
        stroke="black"
        strokeWidth="4"
      />

      <line x1={c.x} y1={c.y + 35} x2={c.x} y2={c.y - 25} stroke={COLOR.currentSource} strokeWidth="7" />
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

function CircuitNode({
  point,
  label,
  sub,
  offset,
  small = false,
}: {
  point: Point;
  label?: string;
  sub?: string;
  offset?: Point;
  small?: boolean;
}) {
  return (
    <g>
      <circle cx={point.x} cy={point.y} r={NODE.radius} fill={COLOR.node} />

      {label && offset && (
        sub ? (
          <SubscriptText
            x={point.x + offset.x}
            y={point.y + offset.y}
            text={label}
            sub={sub}
            size={small ? 20 : LABEL.node}
            subSize={small ? 11 : 22}
            color={COLOR.nodeLabel}
            anchor="start"
            weight={900}
          />
        ) : (
          <SvgText
            x={point.x + offset.x}
            y={point.y + offset.y}
            size={small ? 18 : LABEL.node}
            color={COLOR.nodeLabel}
            anchor="start"
            weight={900}
          >
            {label}
          </SvgText>
        )
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
  const speed = clamp(0.9, 4.8 - Math.abs(current) * 50, 4.2);

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
   RIGHT PANEL
============================================================================ */

function ConceptPanel({
  values,
  result,
  viewMode,
}: {
  values: CircuitValues;
  result: NodalResult;
  viewMode: ViewMode;
}) {
  return (
    <section className="rounded-lg border-2 border-[#0648b8] bg-white">
      <div className="rounded-t-md bg-gradient-to-r from-[#0648b8] to-[#0b58c6] py-4 text-center text-[31px] font-black uppercase tracking-wide text-white">
        Nodal Voltage Analysis
      </div>

      <div className="space-y-5 px-6 py-5 text-[23px] leading-snug">
        <ConceptItem number={1}>Choose the reference node, ground</ConceptItem>
        <ConceptItem number={2}>Assign node voltages V₁, V₂ and V₃</ConceptItem>
        <ConceptItem number={3}>Apply KCL at every unknown node</ConceptItem>
        <ConceptItem number={4}>Solve the simultaneous equations</ConceptItem>
      </div>

      <div className="mx-5 h-[2px] bg-[#8bb8ff]" />

      <div className="mx-auto w-fit rounded-b-lg bg-[#e6f2ff] px-8 py-3 text-[23px] font-black text-[#0648b8]">
        Correct Node Equations
      </div>

      <div className="px-6 py-4 text-[17px] font-bold">
        <EquationBlock title="Node V₁">
          (V₁ − Vₛ)/R₁ + (V₁ − V₂)/R₂ + V₁/R₃ = 0
        </EquationBlock>

        <EquationBlock title="Node V₂">
          (V₂ − V₁)/R₂ + (V₂ − V₃)/R₄ − Iₛ = 0
        </EquationBlock>

        <EquationBlock title="Node V₃">
          (V₃ − V₂)/R₄ + V₃/R₅ + Iₛ = 0
        </EquationBlock>

        <div className="mt-5 rounded-lg border-2 border-[#3a7bdc] bg-white px-5 py-3">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-serif text-[20px] italic">
            <span>R₁ = {values.r1} Ω</span>
            <span>R₂ = {values.r2} Ω</span>
            <span>R₃ = {values.r3} Ω</span>
            <span>R₄ = {values.r4} Ω</span>
            <span>R₅ = {values.r5} Ω</span>
            <span>Vₛ = {values.vs} V</span>
            <span>Iₛ = {formatAmp(values.is)} A</span>
            <span>Mode: {viewMode}</span>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-[17px] font-bold">
          <p>V₁ = {result.v1.toFixed(5)} V</p>
          <p>V₂ = {result.v2.toFixed(5)} V</p>
          <p>V₃ = {result.v3.toFixed(5)} V</p>
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
        <ValueInput label="R₁" value={values.r1} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r1', v)} />
        <ValueInput label="R₂" value={values.r2} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r2', v)} />
        <ValueInput label="R₃" value={values.r3} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r3', v)} />
        <ValueInput label="R₄" value={values.r4} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r4', v)} />
        <ValueInput label="R₅" value={values.r5} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r5', v)} />
        <ValueInput label="Vₛ" value={values.vs} unit="V" min={0} step={1} onChange={(v) => updateValue('vs', v)} />
        <div />
        <ValueInput label="Iₛ" value={values.is} unit="A" min={-0.05} step={0.001} onChange={(v) => updateValue('is', v)} />
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
        <ModeButton label="Simulation" active={viewMode === 'simulation'} onClick={() => setViewMode('simulation')} />
        <ModeButton label="Equation" active={viewMode === 'equation'} onClick={() => setViewMode('equation')} />
        <ModeButton label="Practice" active={viewMode === 'practice'} onClick={() => setViewMode('practice')} />
        <ModeButton label="Debug" active={viewMode === 'debug'} onClick={() => setViewMode('debug')} />
      </div>
    </section>
  );
}

function ResultsPanel({ result }: { result: NodalResult }) {
  const kcl1Ok = Math.abs(result.kcl1) < 1e-8;
  const kcl2Ok = Math.abs(result.kcl2) < 1e-8;
  const kcl3Ok = Math.abs(result.kcl3) < 1e-8;

  return (
    <section className="min-h-[305px] bg-white p-4">
      <h2 className="text-center text-[23px] font-black uppercase text-[#0648b8]">
        Results
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ResultCard label="V₁" value={`${result.v1.toFixed(3)} V`} color="blue" />
        <ResultCard label="V₂" value={`${result.v2.toFixed(3)} V`} color="purple" />
        <ResultCard label="V₃" value={`${result.v3.toFixed(3)} V`} color="green" />
      </div>

      <div className="mt-5 rounded-lg border-2 border-[#8bb8ff] bg-white px-5 py-4 text-[16px] font-bold">
        <p>KCL at V₁: {result.kcl1.toExponential(3)} A {kcl1Ok ? '✅' : '❌'}</p>
        <p>KCL at V₂: {result.kcl2.toExponential(3)} A {kcl2Ok ? '✅' : '❌'}</p>
        <p>KCL at V₃: {result.kcl3.toExponential(3)} A {kcl3Ok ? '✅' : '❌'}</p>
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
  result: NodalResult;
  viewMode: ViewMode;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section className="mt-4 rounded-lg border-2 border-[#0648b8] bg-white p-5">
      <h2 className="text-center text-[24px] font-black uppercase text-[#0648b8]">
        Live Nodal Math Solver
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MatrixPanel result={result} />
        <KclPanel values={values} result={result} />
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

function MatrixPanel({ result }: { result: NodalResult }) {
  return (
    <div className="rounded-lg bg-[#eef6ff] p-5">
      <h3 className="text-[21px] font-black text-[#0648b8]">Matrix Form</h3>

      <div className="mt-4 overflow-x-auto rounded-lg bg-white p-4 font-serif text-[17px] font-bold italic">
        <p>[{result.a11.toFixed(5)} {result.a12.toFixed(5)} {result.a13.toFixed(5)}] [V₁] = [{result.b1.toFixed(5)}]</p>
        <p>[{result.a21.toFixed(5)} {result.a22.toFixed(5)} {result.a23.toFixed(5)}] [V₂] = [{result.b2.toFixed(5)}]</p>
        <p>[{result.a31.toFixed(5)} {result.a32.toFixed(5)} {result.a33.toFixed(5)}] [V₃] = [{result.b3.toFixed(5)}]</p>
      </div>
    </div>
  );
}

function KclPanel({
  values,
  result,
}: {
  values: CircuitValues;
  result: NodalResult;
}) {
  return (
    <div className="rounded-lg bg-[#f4efff] p-5">
      <h3 className="text-[21px] font-black text-[#5b21b6]">Step-by-step KCL</h3>

      <div className="mt-4 space-y-3 rounded-lg bg-white p-4 text-[16px] font-bold">
        <p>V₁ equation: (V₁ − {values.vs})/{values.r1} + (V₁ − V₂)/{values.r2} + V₁/{values.r3} = 0</p>
        <p>Residual V₁ = {result.kcl1.toExponential(4)} A</p>

        <div className="h-px bg-slate-300" />

        <p>V₂ equation: (V₂ − V₁)/{values.r2} + (V₂ − V₃)/{values.r4} − {formatAmp(values.is)} = 0</p>
        <p>Residual V₂ = {result.kcl2.toExponential(4)} A</p>

        <div className="h-px bg-slate-300" />

        <p>V₃ equation: (V₃ − V₂)/{values.r4} + V₃/{values.r5} + {formatAmp(values.is)} = 0</p>
        <p>Residual V₃ = {result.kcl3.toExponential(4)} A</p>
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
  result: NodalResult;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const checks = {
    v1: isClose(practiceInputs.v1, result.v1),
    v2: isClose(practiceInputs.v2, result.v2),
    v3: isClose(practiceInputs.v3, result.v3),
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
        Solve for V₁, V₂ and V₃. Type answers in volts.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnswerInput label="V₁" value={practiceInputs.v1} correct={checks.v1} submitted={submitted} onChange={(v) => updateInput('v1', v)} />
        <AnswerInput label="V₂" value={practiceInputs.v2} correct={checks.v2} submitted={submitted} onChange={(v) => updateInput('v2', v)} />
        <AnswerInput label="V₃" value={practiceInputs.v3} correct={checks.v3} submitted={submitted} onChange={(v) => updateInput('v3', v)} />
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
            <p>V₁ = {result.v1.toFixed(3)} V</p>
            <p>V₂ = {result.v2.toFixed(3)} V</p>
            <p>V₃ = {result.v3.toFixed(3)} V</p>
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
    <div className="grid grid-cols-[54px_1fr_44px] items-center gap-3 text-[20px]">
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
  value,
  correct,
  submitted,
  onChange,
}: {
  label: string;
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
        <span>V</span>
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

  const mapped = localPoints.map((p) => {
    if (horizontal) {
      return `${start.x + sign * p.x},${start.y + p.y}`;
    }

    return `${start.x + p.y},${start.y + sign * p.x}`;
  });

  return mapped.join(' ');
}

function clamp(min: number, value: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isClose(input: string, correct: number) {
  const parsed = Number(input);

  if (!Number.isFinite(parsed)) {
    return false;
  }

  return Math.abs(parsed - correct) <= ANSWER_TOLERANCE;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStep(min: number, max: number, step: number) {
  const count = Math.round((max - min) / step);
  return Number((min + randomInt(0, count) * step).toFixed(6));
}

function formatAmp(value: number) {
  return Number(value.toFixed(4)).toString();
}