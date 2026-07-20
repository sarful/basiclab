'use client';

import React, { useMemo, useState } from 'react';

/* ============================================================================
   TYPES
============================================================================ */

type LoopKey = 'loop1' | 'loop2' | 'loop3';
type SimState = 'idle' | 'running' | 'paused';
type ViewMode = 'simulation' | 'kcl' | 'kvl' | 'practice' | 'exam' | 'debug';

type Point = {
  x: number;
  y: number;
};

type CircuitValues = {
  v1: number;
  v2: number;
  r1: number;
  r2: number;
  r3: number;
  r4: number;
  r5: number;
};

type CalculatedValues = {
  vA: number;
  vB: number;
  vC: number;

  i1: number;
  i2: number;
  i3: number;

  vr1: number;
  vr2: number;
  vr3: number;
  vr4: number;
  vr5: number;

  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;

  vv1: number;
  vv2: number;

  kclA: number;
  kvlLoop1: number;
  kvlLoop2: number;
  kvlLoop3: number;
  selectedKvl: number;

  error: string | null;
};

type PracticeInputs = {
  vA: string;
  vB: string;
  vC: string;
  i1: string;
  i2: string;
  i3: string;
};

type ComponentId = 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'v1' | 'v2';

type WireId =
  | 'leftTopToV1'
  | 'leftV1ToBottom'
  | 'leftTopToR1'
  | 'r1ToA'
  | 'aToR2'
  | 'r2ToRightTop'
  | 'rightTopToV2'
  | 'rightV2ToBottom'
  | 'bToR4'
  | 'r4ToBottomMid'
  | 'bottomMidToR5'
  | 'r5ToC'
  | 'aToR3'
  | 'r3ToBottomMid';

/* ============================================================================
   GLOBAL CONSTANTS
============================================================================ */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1280,
  height: 740,
};

const SCALE = {
  CANVAS: CIRCUIT_CANVAS_SCALE,
  COMPONENT: CIRCUIT_COMPONENT_SCALE,
  WIRE: CIRCUIT_WIRE_SCALE,
};

const COLOR = {
  wire: 'black',
  resistor: '#c33131',
  currentArrow: '#15803d',
  actualCurrentDot: '#22c55e',
  kvlDot: '#7c3aed',
  debugDot: '#f97316',
  node: 'black',
  nodeLabel: '#003fd1',
  voltage: '#0047b8',
  highlightGreen: '#16a34a',
  highlightBlue: '#2563eb',
  highlightPurple: '#7c3aed',
  polarity: '#0047b8',
};

const BASE_COMPONENT = {
  resistor: {
    leadLength: 28,
    amplitude: 24,
    zigzags: 6,
    strokeWidth: 5,
  },
  voltageSource: {
    plateLong: 92,
    plateShort: 55,
    plateGap: 38,
    strokeWidth: 5,
  },
  currentArrow: {
    strokeWidth: 5,
  },
  movingCharge: {
    radius: 7,
  },
};

const COMPONENT = {
  resistor: {
    leadLength: BASE_COMPONENT.resistor.leadLength * SCALE.COMPONENT,
    amplitude: BASE_COMPONENT.resistor.amplitude * SCALE.COMPONENT,
    zigzags: BASE_COMPONENT.resistor.zigzags,
    strokeWidth: BASE_COMPONENT.resistor.strokeWidth * SCALE.COMPONENT,
  },
  voltageSource: {
    plateLong: BASE_COMPONENT.voltageSource.plateLong * SCALE.COMPONENT,
    plateShort: BASE_COMPONENT.voltageSource.plateShort * SCALE.COMPONENT,
    plateGap: BASE_COMPONENT.voltageSource.plateGap * SCALE.COMPONENT,
    strokeWidth: BASE_COMPONENT.voltageSource.strokeWidth * SCALE.COMPONENT,
  },
  currentArrow: {
    strokeWidth: BASE_COMPONENT.currentArrow.strokeWidth * SCALE.COMPONENT,
  },
  movingCharge: {
    radius: BASE_COMPONENT.movingCharge.radius * SCALE.COMPONENT,
  },
};

const NODE = {
  radius: 12 * SCALE.COMPONENT,
  fill: COLOR.node,
  labelColor: COLOR.nodeLabel,
};

const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.WIRE,
  color: COLOR.wire,
  highlightWidth: 14 * SCALE.WIRE,
};

const PATH = {
  wireLinecap: 'round' as const,
  resistorLinecap: 'round' as const,
  resistorLinejoin: 'round' as const,
};

const LABEL = {
  mainSize: 30,
  valueSize: 24,
  nodeSize: 36,
  subSize: 17,
};

const OVERLAY = {
  nodeVoltage: { x: 25, y: 20 },
  legend: { x: 25, y: 170 },
};

const DEFAULT_VALUES: CircuitValues = {
  v1: 10,
  v2: 5,
  r1: 100,
  r2: 200,
  r3: 150,
  r4: 100,
  r5: 200,
};

const EMPTY_PRACTICE_INPUTS: PracticeInputs = {
  vA: '',
  vB: '',
  vC: '',
  i1: '',
  i2: '',
  i3: '',
};

const TOLERANCE = 1e-3;

/* ============================================================================
   OFFSETS
============================================================================ */

const COMPONENT_OFFSET: Record<ComponentId, Point> = {
  r1: { x: 0, y: 0 },
  r2: { x: 0, y: 0 },
  r3: { x: 0, y: 0 },
  r4: { x: 0, y: 0 },
  r5: { x: 0, y: 0 },
  v1: { x: 0, y: 0 },
  v2: { x: 0, y: 0 },
};

const LABEL_OFFSET: Record<ComponentId, Point> = {
  r1: { x: 0, y: 0 },
  r2: { x: 0, y: 0 },
  r3: { x: 0, y: 0 },
  r4: { x: 0, y: 0 },
  r5: { x: 0, y: 0 },
  v1: { x: 0, y: 0 },
  v2: { x: 0, y: 0 },
};

const WIRE_OFFSET: Record<WireId, Point> = {
  leftTopToV1: { x: 0, y: 0 },
  leftV1ToBottom: { x: 0, y: 0 },
  leftTopToR1: { x: 0, y: 0 },
  r1ToA: { x: 0, y: 0 },
  aToR2: { x: 0, y: 0 },
  r2ToRightTop: { x: 0, y: 0 },
  rightTopToV2: { x: 0, y: 0 },
  rightV2ToBottom: { x: 0, y: 0 },
  bToR4: { x: 0, y: 0 },
  r4ToBottomMid: { x: 0, y: 0 },
  bottomMidToR5: { x: 0, y: 0 },
  r5ToC: { x: 0, y: 0 },
  aToR3: { x: 0, y: 0 },
  r3ToBottomMid: { x: 0, y: 0 },
};

const DEBUG_TERMINAL_OFFSET: Point = {
  x: 0,
  y: 0,
};

/* ============================================================================
   GEOMETRY
============================================================================ */

const TERMINAL = {
  leftTop: { x: 130, y: 90 },
  leftBatteryTop: { x: 130, y: 270 },
  leftBatteryBottom: { x: 130, y: 455 },
  b: { x: 130, y: 620 },

  a: { x: 620, y: 90 },
  bottomMid: { x: 620, y: 620 },

  rightTop: { x: 1110, y: 90 },
  rightBatteryTop: { x: 1110, y: 270 },
  rightBatteryBottom: { x: 1110, y: 455 },
  c: { x: 1110, y: 620 },

  r1Left: { x: 300, y: 90 },
  r1Right: { x: 440, y: 90 },

  r2Left: { x: 800, y: 90 },
  r2Right: { x: 940, y: 90 },

  r3Top: { x: 620, y: 315 },
  r3Bottom: { x: 620, y: 475 },

  r4Left: { x: 300, y: 620 },
  r4Right: { x: 440, y: 620 },

  r5Left: { x: 800, y: 620 },
  r5Right: { x: 940, y: 620 },
};

const NODE_POINTS = {
  a: TERMINAL.a,
  b: TERMINAL.b,
  c: TERMINAL.c,
  bottomMid: TERMINAL.bottomMid,
};

const COMPONENT_GEOMETRY = {
  r1: {
    start: TERMINAL.r1Left,
    end: TERMINAL.r1Right,
    label: { x: 370, y: 32 },
    value: { x: 370, y: 148 },
  },
  r2: {
    start: TERMINAL.r2Left,
    end: TERMINAL.r2Right,
    label: { x: 870, y: 32 },
    value: { x: 870, y: 148 },
  },
  r3: {
    start: TERMINAL.r3Top,
    end: TERMINAL.r3Bottom,
    label: { x: 663, y: 395 },
    value: { x: 663, y: 430 },
  },
  r4: {
    start: TERMINAL.r4Left,
    end: TERMINAL.r4Right,
    label: { x: 370, y: 588 },
    value: { x: 370, y: 680 },
  },
  r5: {
    start: TERMINAL.r5Left,
    end: TERMINAL.r5Right,
    label: { x: 870, y: 588 },
    value: { x: 870, y: 680 },
  },
  v1: {
    center: { x: 130, y: 360 },
    label: { x: 55, y: 390 },
    value: { x: 42, y: 445 },
  },
  v2: {
    center: { x: 1110, y: 360 },
    label: { x: 1150, y: 390 },
    value: { x: 1140, y: 445 },
  },
};

const WIRE_SEGMENTS: Array<{
  id: WireId;
  from: Point;
  to: Point;
}> = [
  { id: 'leftTopToV1', from: TERMINAL.leftTop, to: TERMINAL.leftBatteryTop },
  { id: 'leftV1ToBottom', from: TERMINAL.leftBatteryBottom, to: TERMINAL.b },

  { id: 'leftTopToR1', from: TERMINAL.leftTop, to: TERMINAL.r1Left },
  { id: 'r1ToA', from: TERMINAL.r1Right, to: TERMINAL.a },

  { id: 'aToR2', from: TERMINAL.a, to: TERMINAL.r2Left },
  { id: 'r2ToRightTop', from: TERMINAL.r2Right, to: TERMINAL.rightTop },

  { id: 'rightTopToV2', from: TERMINAL.rightTop, to: TERMINAL.rightBatteryTop },
  { id: 'rightV2ToBottom', from: TERMINAL.rightBatteryBottom, to: TERMINAL.c },

  { id: 'bToR4', from: TERMINAL.b, to: TERMINAL.r4Left },
  { id: 'r4ToBottomMid', from: TERMINAL.r4Right, to: TERMINAL.bottomMid },

  { id: 'bottomMidToR5', from: TERMINAL.bottomMid, to: TERMINAL.r5Left },
  { id: 'r5ToC', from: TERMINAL.r5Right, to: TERMINAL.c },

  { id: 'aToR3', from: TERMINAL.a, to: TERMINAL.r3Top },
  { id: 'r3ToBottomMid', from: TERMINAL.r3Bottom, to: TERMINAL.bottomMid },
];

const DEBUG_TERMINALS = [
  ['leftTop', TERMINAL.leftTop],
  ['leftBatteryTop', TERMINAL.leftBatteryTop],
  ['leftBatteryBottom', TERMINAL.leftBatteryBottom],
  ['B', TERMINAL.b],
  ['R1-L', TERMINAL.r1Left],
  ['R1-R', TERMINAL.r1Right],
  ['A', TERMINAL.a],
  ['R2-L', TERMINAL.r2Left],
  ['R2-R', TERMINAL.r2Right],
  ['rightTop', TERMINAL.rightTop],
  ['rightBatteryTop', TERMINAL.rightBatteryTop],
  ['rightBatteryBottom', TERMINAL.rightBatteryBottom],
  ['C', TERMINAL.c],
  ['R3-T', TERMINAL.r3Top],
  ['R3-B', TERMINAL.r3Bottom],
  ['BM', TERMINAL.bottomMid],
  ['R4-L', TERMINAL.r4Left],
  ['R4-R', TERMINAL.r4Right],
  ['R5-L', TERMINAL.r5Left],
  ['R5-R', TERMINAL.r5Right],
] as const;

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

export default function KirchhoffsCircuitLaws() {
  const [simState, setSimState] = useState<SimState>('idle');
  const [selectedLoop, setSelectedLoop] = useState<LoopKey>('loop1');
  const [values, setValues] = useState<CircuitValues>(DEFAULT_VALUES);
  const [viewMode, setViewMode] = useState<ViewMode>('simulation');

  const [practiceInputs, setPracticeInputs] = useState<PracticeInputs>(EMPTY_PRACTICE_INPUTS);
  const [submitted, setSubmitted] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const calculated = useMemo(() => {
    return solveCircuit(values, selectedLoop);
  }, [values, selectedLoop]);

  const display = simState !== 'idle';

  const updateValue = (key: keyof CircuitValues, value: number) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSubmitted(false);
  };

  const resetPractice = () => {
    setPracticeInputs(EMPTY_PRACTICE_INPUTS);
    setSubmitted(false);
    setHintLevel(0);
  };

  const resetSimulation = () => {
    setValues(DEFAULT_VALUES);
    setSelectedLoop('loop1');
    setViewMode('simulation');
    setSimState('idle');
    resetPractice();
  };

  const generateRandomProblem = () => {
    const newValues: CircuitValues = {
      v1: randomInt(5, 20),
      v2: randomInt(2, 15),
      r1: randomStep(50, 500, 10),
      r2: randomStep(50, 500, 10),
      r3: randomStep(50, 500, 10),
      r4: randomStep(50, 500, 10),
      r5: randomStep(50, 500, 10),
    };

    setValues(newValues);
    setSelectedLoop(randomChoice<LoopKey>(['loop1', 'loop2', 'loop3']));
    setViewMode('practice');
    setSimState('running');
    resetPractice();
  };

  return (
    <main className="min-h-screen bg-white p-3 font-sans text-black">
      <section className="mx-auto max-w-[1536px]">
        <header className="text-center">
          <h1 className="text-[36px] font-black uppercase leading-none tracking-[0.06em] text-[#071c4d] md:text-[56px]">
            Kirchhoff’s Circuit Laws
          </h1>

          <p className="mt-3 text-[19px] tracking-wide text-[#071c4d] md:text-[25px]">
            Simulation, KCL, KVL, Practice, Exam and Debug modes for interactive learning.
          </p>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_410px]">
          <CircuitDiagram
            values={values}
            calculated={calculated}
            selectedLoop={selectedLoop}
            display={display}
            simState={simState}
            viewMode={viewMode}
          />

          <RightPanel selectedLoop={selectedLoop} setSelectedLoop={setSelectedLoop} />
        </div>

        <div className="mx-auto mt-4 grid max-w-[1450px] grid-cols-1 gap-4 xl:grid-cols-[330px_1.1fr_0.95fr]">
          <Controls
            simState={simState}
            viewMode={viewMode}
            setViewMode={(mode) => {
              setViewMode(mode);
              if (mode === 'practice' || mode === 'exam') {
                setSimState('running');
              }
            }}
            onStart={() => setSimState('running')}
            onPause={() => setSimState('paused')}
            onReset={resetSimulation}
            onGenerateProblem={generateRandomProblem}
          />

          <ValueControls values={values} updateValue={updateValue} />

          <Verification selectedLoop={selectedLoop} calculated={calculated} display={display} />
        </div>

        <Measurements calculated={calculated} display={display} />

        <LearningPanel
          values={values}
          calculated={calculated}
          selectedLoop={selectedLoop}
          display={display}
          viewMode={viewMode}
          practiceInputs={practiceInputs}
          setPracticeInputs={setPracticeInputs}
          submitted={submitted}
          setSubmitted={setSubmitted}
          hintLevel={hintLevel}
          setHintLevel={setHintLevel}
        />
      </section>
    </main>
  );
}

/* ============================================================================
   CIRCUIT SOLVER
============================================================================ */

function solveCircuit(values: CircuitValues, selectedLoop: LoopKey): CalculatedValues {
  const { v1, v2, r1, r2, r3, r4, r5 } = values;

  const invalidResistance = [r1, r2, r3, r4, r5].some((r) => r <= 0 || !Number.isFinite(r));

  if (invalidResistance) {
    return emptyCalculation(v1, v2, 'All resistances must be greater than 0 Ω.');
  }

  const g1 = 1 / r1;
  const g2 = 1 / r2;
  const g3 = 1 / r3;
  const g4 = 1 / r4;
  const g5 = 1 / r5;

  const matrix = [
    [g1 + g4, -g1, 0],
    [-g1, g1 + g2 + g3, -g2],
    [0, -g2, g2 + g5],
  ];

  const vector = [-v1 * g1, v1 * g1 + v2 * g2, -v2 * g2];

  const solved = solve3x3(matrix, vector);

  if (!solved) {
    return emptyCalculation(v1, v2, 'Circuit cannot be solved. Matrix is singular.');
  }

  const [vB, vA, vC] = solved;

  const vLeftTop = vB + v1;
  const vRightTop = vC + v2;

  const i1 = (vLeftTop - vA) / r1;
  const i2 = (vA - vRightTop) / r2;
  const i3 = vA / r3;

  const signedVR1 = i1 * r1;
  const signedVR2 = i2 * r2;
  const signedVR3 = i3 * r3;
  const signedVR4 = i1 * r4;
  const signedVR5 = i2 * r5;

  const kclA = i1 - i2 - i3;

  const kvlLoop1 = v1 - signedVR1 - signedVR3 - signedVR4;
  const kvlLoop2 = v2 + signedVR2 + signedVR5 - signedVR3;
  const kvlLoop3 = v1 - signedVR1 - signedVR2 - v2 - signedVR5 - signedVR4;

  const selectedKvl =
    selectedLoop === 'loop1'
      ? kvlLoop1
      : selectedLoop === 'loop2'
        ? kvlLoop2
        : kvlLoop3;

  return {
    vA,
    vB,
    vC,

    i1,
    i2,
    i3,

    vr1: Math.abs(signedVR1),
    vr2: Math.abs(signedVR2),
    vr3: Math.abs(signedVR3),
    vr4: Math.abs(signedVR4),
    vr5: Math.abs(signedVR5),

    p1: i1 ** 2 * r1,
    p2: i2 ** 2 * r2,
    p3: i3 ** 2 * r3,
    p4: i1 ** 2 * r4,
    p5: i2 ** 2 * r5,

    vv1: v1,
    vv2: v2,

    kclA,
    kvlLoop1,
    kvlLoop2,
    kvlLoop3,
    selectedKvl,

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

function emptyCalculation(v1: number, v2: number, error: string): CalculatedValues {
  return {
    vA: 0,
    vB: 0,
    vC: 0,

    i1: 0,
    i2: 0,
    i3: 0,

    vr1: 0,
    vr2: 0,
    vr3: 0,
    vr4: 0,
    vr5: 0,

    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
    p5: 0,

    vv1: v1,
    vv2: v2,

    kclA: 0,
    kvlLoop1: 0,
    kvlLoop2: 0,
    kvlLoop3: 0,
    selectedKvl: 0,

    error,
  };
}

/* ============================================================================
   SVG DIAGRAM
============================================================================ */

function CircuitDiagram({
  values,
  calculated,
  selectedLoop,
  display,
  simState,
  viewMode,
}: {
  values: CircuitValues;
  calculated: CalculatedValues;
  selectedLoop: LoopKey;
  display: boolean;
  simState: SimState;
  viewMode: ViewMode;
}) {
  const showAnimation = display && simState === 'running' && !calculated.error;
  const showActualCurrentDots = viewMode === 'simulation' || viewMode === 'practice' || viewMode === 'exam';
  const showKvlTraversal = viewMode === 'kvl';
  const showDebugTerminals = viewMode === 'debug';
  const showKclFocus = viewMode === 'kcl';
  const showPolarity = viewMode === 'kvl' || viewMode === 'simulation';

  return (
    <section className="relative min-h-[650px] overflow-hidden rounded-xl border border-slate-200 bg-white">
      <svg
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        className="h-full min-h-[650px] w-full"
      >
        <g transform={`scale(${SCALE.CANVAS})`}>
          {(viewMode === 'kvl' || viewMode === 'debug') && (
            <LoopHighlight selectedLoop={selectedLoop} />
          )}

          {showKclFocus && <KclFocusHighlight />}

          <WireLayer />
          <ComponentLayer values={values} />

          {showPolarity && <PolarityLayer calculated={calculated} />}

          <NodeLayer />
          <CurrentLayer calculated={calculated} display={display} />

          {showAnimation && showActualCurrentDots && (
            <ActualCurrentDots calculated={calculated} />
          )}

          {showAnimation && showKvlTraversal && <KvlTraversalDot selectedLoop={selectedLoop} />}

          <NodeVoltageOverlay calculated={calculated} display={display} />
          <LegendOverlay viewMode={viewMode} />

          {showDebugTerminals && <DebugTerminalLayer />}
        </g>
      </svg>
    </section>
  );
}

function WireLayer() {
  return (
    <g>
      {WIRE_SEGMENTS.map((segment) => (
        <WireSegment key={segment.id} id={segment.id} from={segment.from} to={segment.to} />
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

      <SvgVoltageSource
        id="v1"
        label="V"
        sub="1"
        value={`${values.v1} V`}
        center={COMPONENT_GEOMETRY.v1.center}
        labelPoint={COMPONENT_GEOMETRY.v1.label}
        valuePoint={COMPONENT_GEOMETRY.v1.value}
      />

      <SvgVoltageSource
        id="v2"
        label="V"
        sub="2"
        value={`${values.v2} V`}
        center={COMPONENT_GEOMETRY.v2.center}
        labelPoint={COMPONENT_GEOMETRY.v2.label}
        valuePoint={COMPONENT_GEOMETRY.v2.value}
      />
    </g>
  );
}

function NodeLayer() {
  return (
    <g>
      <CircuitNode point={NODE_POINTS.a} label="A" labelOffset={{ x: -25, y: -32 }} />
      <CircuitNode point={NODE_POINTS.b} label="B" labelOffset={{ x: -25, y: 55 }} />
      <CircuitNode point={NODE_POINTS.c} label="C" labelOffset={{ x: -25, y: 55 }} />
      <CircuitNode point={NODE_POINTS.bottomMid} />
    </g>
  );
}

function CurrentLayer({
  calculated,
  display,
}: {
  calculated: CalculatedValues;
  display: boolean;
}) {
  return (
    <g>
      <CurrentArrow
        label="I"
        sub="1"
        value={calculated.i1}
        display={display}
        forwardLine="M130 500 L130 285"
        backwardLine="M130 285 L130 500"
        forwardHead="130,265 112,305 148,305"
        backwardHead="130,520 112,480 148,480"
        labelPoint={{ x: 82, y: 245 }}
      />

      <CurrentArrow
        label="I"
        sub="2"
        value={calculated.i2}
        display={display}
        forwardLine="M675 90 L780 90"
        backwardLine="M780 90 L675 90"
        forwardHead="800,90 760,72 760,108"
        backwardHead="655,90 695,72 695,108"
        labelPoint={{ x: 1000, y: 50 }}
      />

      <CurrentArrow
        label="I"
        sub="3"
        value={calculated.i3}
        display={display}
        forwardLine="M620 485 L620 555"
        backwardLine="M620 555 L620 485"
        forwardHead="620,578 602,538 638,538"
        backwardHead="620,462 602,502 638,502"
        labelPoint={{ x: 650, y: 515 }}
      />
    </g>
  );
}

/* ============================================================================
   MOVING DOTS
============================================================================ */

function ActualCurrentDots({ calculated }: { calculated: CalculatedValues }) {
  return (
    <g>
      <MovingCharge
        path={createPath([
          TERMINAL.b,
          TERMINAL.leftBatteryBottom,
          TERMINAL.leftBatteryTop,
          TERMINAL.leftTop,
          TERMINAL.r1Left,
          TERMINAL.r1Right,
          TERMINAL.a,
          TERMINAL.r3Top,
          TERMINAL.r3Bottom,
          TERMINAL.bottomMid,
          TERMINAL.r4Right,
          TERMINAL.r4Left,
          TERMINAL.b,
        ])}
        current={calculated.i1}
        reverse={calculated.i1 < 0}
        color={COLOR.actualCurrentDot}
        opacity={0.7}
        radius={7}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.a,
          TERMINAL.r2Left,
          TERMINAL.r2Right,
          TERMINAL.rightTop,
          TERMINAL.rightBatteryTop,
          TERMINAL.rightBatteryBottom,
          TERMINAL.c,
          TERMINAL.r5Right,
          TERMINAL.r5Left,
          TERMINAL.bottomMid,
          TERMINAL.r3Bottom,
          TERMINAL.r3Top,
          TERMINAL.a,
        ])}
        current={calculated.i2}
        reverse={calculated.i2 < 0}
        color={COLOR.actualCurrentDot}
        opacity={0.65}
        radius={7}
      />

      <MovingCharge
        path={createPath([TERMINAL.a, TERMINAL.r3Top, TERMINAL.r3Bottom, TERMINAL.bottomMid])}
        current={calculated.i3}
        reverse={calculated.i3 < 0}
        color="#15803d"
        opacity={0.95}
        radius={8}
      />
    </g>
  );
}

function KvlTraversalDot({ selectedLoop }: { selectedLoop: LoopKey }) {
  const path =
    selectedLoop === 'loop1'
      ? createPath([
          TERMINAL.b,
          TERMINAL.leftBatteryBottom,
          TERMINAL.leftBatteryTop,
          TERMINAL.leftTop,
          TERMINAL.r1Left,
          TERMINAL.r1Right,
          TERMINAL.a,
          TERMINAL.r3Top,
          TERMINAL.r3Bottom,
          TERMINAL.bottomMid,
          TERMINAL.r4Right,
          TERMINAL.r4Left,
          TERMINAL.b,
        ])
      : selectedLoop === 'loop2'
        ? createPath([
            TERMINAL.c,
            TERMINAL.rightBatteryBottom,
            TERMINAL.rightBatteryTop,
            TERMINAL.rightTop,
            TERMINAL.r2Right,
            TERMINAL.r2Left,
            TERMINAL.a,
            TERMINAL.r3Top,
            TERMINAL.r3Bottom,
            TERMINAL.bottomMid,
            TERMINAL.r5Left,
            TERMINAL.r5Right,
            TERMINAL.c,
          ])
        : createPath([
            TERMINAL.b,
            TERMINAL.leftBatteryBottom,
            TERMINAL.leftBatteryTop,
            TERMINAL.leftTop,
            TERMINAL.r1Left,
            TERMINAL.r1Right,
            TERMINAL.a,
            TERMINAL.r2Left,
            TERMINAL.r2Right,
            TERMINAL.rightTop,
            TERMINAL.rightBatteryTop,
            TERMINAL.rightBatteryBottom,
            TERMINAL.c,
            TERMINAL.r5Right,
            TERMINAL.r5Left,
            TERMINAL.bottomMid,
            TERMINAL.r4Right,
            TERMINAL.r4Left,
            TERMINAL.b,
          ]);

  return (
    <MovingCharge
      path={path}
      current={0.05}
      color={COLOR.kvlDot}
      opacity={0.95}
      radius={10}
      duration={5}
    />
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
      stroke={WIRE.color}
      strokeWidth={WIRE.width}
      strokeLinecap={PATH.wireLinecap}
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
        strokeLinejoin={PATH.resistorLinejoin}
        strokeLinecap={PATH.resistorLinecap}
      />

      <SubscriptText
        x={labelPoint.x + labelOffset.x}
        y={labelPoint.y + labelOffset.y}
        text={label}
        sub={sub}
        size={LABEL.mainSize}
        subSize={LABEL.subSize}
        anchor={anchor}
        weight={900}
      />

      <SvgText
        x={valuePoint.x + labelOffset.x}
        y={valuePoint.y + labelOffset.y}
        size={LABEL.valueSize}
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
  const longHalf = COMPONENT.voltageSource.plateLong / 2;
  const shortHalf = COMPONENT.voltageSource.plateShort / 2;
  const gapHalf = COMPONENT.voltageSource.plateGap / 2;

  return (
    <g>
      <line
        x1={c.x - longHalf}
        y1={c.y - gapHalf}
        x2={c.x + longHalf}
        y2={c.y - gapHalf}
        stroke="#e00000"
        strokeWidth={COMPONENT.voltageSource.strokeWidth}
      />

      <line
        x1={c.x - shortHalf}
        y1={c.y + gapHalf}
        x2={c.x + shortHalf}
        y2={c.y + gapHalf}
        stroke="black"
        strokeWidth={COMPONENT.voltageSource.strokeWidth}
      />

      <SvgText x={c.x - 58} y={c.y - gapHalf - 25} size={34} weight={900}>
        +
      </SvgText>

      <SvgText x={c.x - 58} y={c.y + gapHalf + 72} size={38} weight={900}>
        −
      </SvgText>

      <SubscriptText
        x={labelPoint.x + labelOffset.x}
        y={labelPoint.y + labelOffset.y}
        text={label}
        sub={sub}
        size={LABEL.mainSize}
        subSize={LABEL.subSize}
        anchor="start"
        italic
      />

      <SvgText
        x={valuePoint.x + labelOffset.x}
        y={valuePoint.y + labelOffset.y}
        size={LABEL.valueSize}
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
  labelOffset = { x: 0, y: 0 },
}: {
  point: Point;
  label?: string;
  labelOffset?: Point;
}) {
  return (
    <g>
      <circle cx={point.x} cy={point.y} r={NODE.radius} fill={NODE.fill} />

      {label && (
        <SvgText
          x={point.x + labelOffset.x}
          y={point.y + labelOffset.y}
          size={LABEL.nodeSize}
          color={NODE.labelColor}
          weight={900}
        >
          {label}
        </SvgText>
      )}
    </g>
  );
}

function CurrentArrow({
  label,
  sub,
  value,
  display,
  forwardLine,
  backwardLine,
  forwardHead,
  backwardHead,
  labelPoint,
}: {
  label: string;
  sub: string;
  value: number;
  display: boolean;
  forwardLine: string;
  backwardLine: string;
  forwardHead: string;
  backwardHead: string;
  labelPoint: Point;
}) {
  const isForward = value >= 0;
  const color = display ? COLOR.currentArrow : '#9ca3af';

  return (
    <g>
      <path
        d={isForward ? forwardLine : backwardLine}
        fill="none"
        stroke={color}
        strokeWidth={COMPONENT.currentArrow.strokeWidth}
        strokeLinecap="round"
      />

      <polygon points={isForward ? forwardHead : backwardHead} fill={color} />

      <SubscriptText
        x={labelPoint.x}
        y={labelPoint.y}
        text={label}
        sub={sub}
        size={32}
        subSize={18}
        italic
        weight={500}
      />
    </g>
  );
}

function MovingCharge({
  path,
  current,
  reverse = false,
  color = COLOR.actualCurrentDot,
  opacity = 0.85,
  radius = COMPONENT.movingCharge.radius,
  duration,
}: {
  path: string;
  current: number;
  reverse?: boolean;
  color?: string;
  opacity?: number;
  radius?: number;
  duration?: number;
}) {
  const safeCurrent = Math.max(Math.abs(current), 0.001);
  const calculatedDuration = duration ?? clamp(0.9, 4.5 - safeCurrent * 45, 3.8);

  return (
    <circle r={radius} fill={color} opacity={opacity}>
      <animateMotion
        dur={`${calculatedDuration}s`}
        repeatCount="indefinite"
        path={path}
        keyPoints={reverse ? '1;0' : '0;1'}
        keyTimes="0;1"
        calcMode="linear"
      />
    </circle>
  );
}

/* ============================================================================
   HIGHLIGHTS / POLARITY / DEBUG / OVERLAY
============================================================================ */

function LoopHighlight({ selectedLoop }: { selectedLoop: LoopKey }) {
  if (selectedLoop === 'loop1') {
    return (
      <path
        d={createPath([TERMINAL.b, TERMINAL.leftTop, TERMINAL.a, TERMINAL.bottomMid, TERMINAL.b])}
        fill="none"
        stroke={COLOR.highlightGreen}
        strokeWidth={WIRE.highlightWidth}
        strokeOpacity="0.16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }

  if (selectedLoop === 'loop2') {
    return (
      <path
        d={createPath([TERMINAL.a, TERMINAL.rightTop, TERMINAL.c, TERMINAL.bottomMid, TERMINAL.a])}
        fill="none"
        stroke={COLOR.highlightBlue}
        strokeWidth={WIRE.highlightWidth}
        strokeOpacity="0.16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }

  return (
    <path
      d={createPath([
        TERMINAL.b,
        TERMINAL.leftTop,
        TERMINAL.a,
        TERMINAL.rightTop,
        TERMINAL.c,
        TERMINAL.bottomMid,
        TERMINAL.b,
      ])}
      fill="none"
      stroke={COLOR.highlightPurple}
      strokeWidth={WIRE.highlightWidth}
      strokeOpacity="0.14"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function KclFocusHighlight() {
  return (
    <g>
      <circle cx={TERMINAL.a.x} cy={TERMINAL.a.y} r="42" fill="#dcfce7" opacity="0.8" />
      <circle
        cx={TERMINAL.a.x}
        cy={TERMINAL.a.y}
        r="42"
        fill="none"
        stroke={COLOR.highlightGreen}
        strokeWidth="4"
        strokeDasharray="8 6"
      />

      <text
        x={TERMINAL.a.x + 55}
        y={TERMINAL.a.y - 25}
        fontSize="18"
        fontWeight="900"
        fill="#166534"
      >
        KCL Node
      </text>
    </g>
  );
}

function PolarityLayer({ calculated }: { calculated: CalculatedValues }) {
  return (
    <g>
      <PolarityMark
        positive={calculated.i1 >= 0 ? { x: 282, y: 72 } : { x: 455, y: 72 }}
        negative={calculated.i1 >= 0 ? { x: 455, y: 72 } : { x: 282, y: 72 }}
      />

      <PolarityMark
        positive={calculated.i2 >= 0 ? { x: 782, y: 72 } : { x: 955, y: 72 }}
        negative={calculated.i2 >= 0 ? { x: 955, y: 72 } : { x: 782, y: 72 }}
      />

      <PolarityMark
        positive={calculated.i3 >= 0 ? { x: 590, y: 300 } : { x: 590, y: 495 }}
        negative={calculated.i3 >= 0 ? { x: 590, y: 495 } : { x: 590, y: 300 }}
      />

      <PolarityMark
        positive={calculated.i1 >= 0 ? { x: 455, y: 602 } : { x: 282, y: 602 }}
        negative={calculated.i1 >= 0 ? { x: 282, y: 602 } : { x: 455, y: 602 }}
      />

      <PolarityMark
        positive={calculated.i2 >= 0 ? { x: 955, y: 602 } : { x: 782, y: 602 }}
        negative={calculated.i2 >= 0 ? { x: 782, y: 602 } : { x: 955, y: 602 }}
      />
    </g>
  );
}

function PolarityMark({
  positive,
  negative,
}: {
  positive: Point;
  negative: Point;
}) {
  return (
    <g>
      <text x={positive.x} y={positive.y} fontSize="22" fontWeight="900" fill={COLOR.polarity}>
        +
      </text>
      <text x={negative.x} y={negative.y} fontSize="26" fontWeight="900" fill={COLOR.polarity}>
        −
      </text>
    </g>
  );
}

function DebugTerminalLayer() {
  return (
    <g>
      {DEBUG_TERMINALS.map(([name, point]) => (
        <DebugTerminalDot key={name} label={name} point={point} />
      ))}
    </g>
  );
}

function DebugTerminalDot({
  point,
  label,
}: {
  point: Point;
  label: string;
}) {
  const p = addPoint(point, DEBUG_TERMINAL_OFFSET);

  return (
    <g>
      <circle cx={p.x} cy={p.y} r="8" fill={COLOR.debugDot} opacity="0.9" />
      <text x={p.x + 10} y={p.y - 10} fontSize="12" fontWeight="800" fill="#9a3412">
        {label}
      </text>
    </g>
  );
}

function NodeVoltageOverlay({
  calculated,
  display,
}: {
  calculated: CalculatedValues;
  display: boolean;
}) {
  const { x, y } = OVERLAY.nodeVoltage;

  return (
    <g>
      <NodeVoltageBox x={x} y={y} label="VA" value={calculated.vA} display={display} />
      <NodeVoltageBox x={x} y={y + 48} label="VB" value={calculated.vB} display={display} />
      <NodeVoltageBox x={x} y={y + 96} label="VC" value={calculated.vC} display={display} />
    </g>
  );
}

function NodeVoltageBox({
  x,
  y,
  label,
  value,
  display,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  display: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width="180" height="38" rx="10" fill="#eef2ff" stroke="#94a3b8" />
      <text x={x + 18} y={y + 25} fontSize="18" fontWeight="900" fill="#1e3a8a">
        {label} = {display ? value.toFixed(3) : '0.000'} V
      </text>
    </g>
  );
}

function LegendOverlay({ viewMode }: { viewMode: ViewMode }) {
  const { x, y } = OVERLAY.legend;

  const lines =
    viewMode === 'simulation'
      ? [
          { color: COLOR.actualCurrentDot, text: 'Actual current flow dots' },
          { color: COLOR.currentArrow, text: 'Arrow = current sign direction' },
        ]
      : viewMode === 'kvl'
        ? [
            { color: COLOR.kvlDot, text: 'Purple dot = selected KVL traversal' },
            { color: COLOR.polarity, text: 'Blue +/− = resistor polarity' },
          ]
        : viewMode === 'kcl'
          ? [
              { color: COLOR.highlightGreen, text: 'Node A is checked for KCL' },
              { color: COLOR.currentArrow, text: 'I1 − I2 − I3 = 0' },
            ]
          : viewMode === 'practice'
            ? [
                { color: COLOR.actualCurrentDot, text: 'Solve, then check answer' },
                { color: COLOR.highlightBlue, text: 'Hints are available' },
              ]
            : viewMode === 'exam'
              ? [
                  { color: COLOR.actualCurrentDot, text: 'Exam mode: no hints' },
                  { color: COLOR.highlightPurple, text: 'Submit to see result' },
                ]
              : [
                  { color: COLOR.debugDot, text: 'Orange dots = debug terminals' },
                  { color: COLOR.wire, text: 'Use offsets to tune geometry' },
                ];

  return (
    <g>
      <rect x={x} y={y} width="325" height="66" rx="10" fill="white" stroke="#cbd5e1" />

      {lines.map((line, index) => (
        <g key={line.text}>
          <circle cx={x + 20} cy={y + 23 + index * 26} r="7" fill={line.color} />
          <text
            x={x + 42}
            y={y + 29 + index * 26}
            fontSize="15"
            fontWeight="800"
            fill="#0f172a"
          >
            {line.text}
          </text>
        </g>
      ))}
    </g>
  );
}

/* ============================================================================
   SVG TEXT AND HELPERS
============================================================================ */

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
  anchor?: 'start' | 'middle' | 'end';
  italic?: boolean;
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={italic ? 'Times New Roman' : undefined}
      fontSize={size}
      fontStyle={italic ? 'italic' : undefined}
      fontWeight={weight}
      fill="black"
    >
      {text}
      <tspan baselineShift="sub" fontSize={subSize}>
        {sub}
      </tspan>
    </text>
  );
}

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

/* ============================================================================
   SIDE PANELS
============================================================================ */

function RightPanel({
  selectedLoop,
  setSelectedLoop,
}: {
  selectedLoop: LoopKey;
  setSelectedLoop: (value: LoopKey) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border-2 border-[#8d9bb2] bg-white p-5">
        <h2 className="text-center text-[22px] font-black uppercase text-[#071c4d]">
          Kirchhoff’s Laws
        </h2>

        <div className="my-3 h-px bg-gray-300" />

        <h3 className="text-[18px] font-black uppercase text-[#007018]">
          1) Kirchhoff’s Current Law
        </h3>

        <p className="mt-3 text-[17px] font-semibold leading-snug">
          At node A, incoming current equals outgoing current.
        </p>

        <div className="mx-auto mt-4 w-fit rounded-lg bg-[#e5f6e7] px-8 py-3 font-serif text-[28px] italic">
          I<sub>1</sub> − I<sub>2</sub> − I<sub>3</sub> = 0
        </div>

        <div className="my-5 h-px bg-gray-300" />

        <h3 className="text-[18px] font-black uppercase text-[#0047b8]">
          2) Kirchhoff’s Voltage Law
        </h3>

        <p className="mt-3 text-[17px] font-semibold leading-snug">
          Around any closed loop, the algebraic voltage sum is zero.
        </p>

        <div className="mx-auto mt-4 w-fit rounded-lg bg-[#e7f3ff] px-10 py-3 font-serif text-[31px] italic">
          ∑ V = 0
        </div>
      </div>

      <div className="rounded-xl border-2 border-[#8d9bb2] bg-white p-5">
        <h2 className="text-center text-[18px] font-black uppercase text-[#071c4d]">
          Select Loop <span className="font-semibold normal-case text-black">(KVL)</span>
        </h2>

        <div className="mt-4 space-y-4 text-[17px]">
          <LoopRadio
            checked={selectedLoop === 'loop1'}
            onChange={() => setSelectedLoop('loop1')}
            label={
              <>
                Loop 1: V<sub>1</sub> → R<sub>1</sub> → R<sub>3</sub> → R<sub>4</sub>
              </>
            }
          />

          <LoopRadio
            checked={selectedLoop === 'loop2'}
            onChange={() => setSelectedLoop('loop2')}
            label={
              <>
                Loop 2: V<sub>2</sub> → R<sub>2</sub> → R<sub>3</sub> → R<sub>5</sub>
              </>
            }
          />

          <LoopRadio
            checked={selectedLoop === 'loop3'}
            onChange={() => setSelectedLoop('loop3')}
            label={
              <>
                Outer Loop: V<sub>1</sub>, R<sub>1</sub>, R<sub>2</sub>, V<sub>2</sub>, R
                <sub>5</sub>, R<sub>4</sub>
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}

function LoopRadio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-lg p-2 hover:bg-slate-50">
      <span
        className={`flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? 'border-[#1f6ed4]' : 'border-gray-400'
        }`}
      >
        {checked && <span className="h-[10px] w-[10px] rounded-full bg-[#1f6ed4]" />}
      </span>

      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />

      <span>{label}</span>
    </label>
  );
}

/* ============================================================================
   CONTROLS
============================================================================ */

function Controls({
  simState,
  viewMode,
  setViewMode,
  onStart,
  onPause,
  onReset,
  onGenerateProblem,
}: {
  simState: SimState;
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onGenerateProblem: () => void;
}) {
  return (
    <section className="rounded-lg border-2 border-[#8d9bb2] bg-white p-7">
      <h2 className="text-center text-[20px] font-black uppercase text-[#071c4d]">
        Controls
      </h2>

      <div className="mt-7 flex flex-col gap-5">
        <button
          onClick={onStart}
          className="flex h-[48px] items-center justify-center gap-3 rounded-md bg-gradient-to-b from-[#33b350] to-[#15933b] px-5 text-[18px] font-black text-white shadow"
        >
          <span className="text-[28px]">▶</span>
          {simState === 'paused' ? 'Resume' : 'Start'}
        </button>

        <button
          onClick={onPause}
          disabled={simState !== 'running'}
          className="flex h-[48px] items-center justify-center gap-3 rounded-md bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] px-5 text-[18px] font-black text-white shadow disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-[25px]">Ⅱ</span>
          Pause
        </button>

        <button
          onClick={onReset}
          className="flex h-[48px] items-center justify-center gap-4 rounded-md bg-gradient-to-b from-[#ff9a20] to-[#e66b00] px-5 text-[18px] font-black text-white shadow"
        >
          <span className="text-[30px]">↻</span>
          Reset
        </button>

        <button
          onClick={onGenerateProblem}
          className="rounded-md bg-gradient-to-b from-[#7c3aed] to-[#5b21b6] px-5 py-3 text-[16px] font-black text-white shadow"
        >
          Generate Practice Problem
        </button>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="mb-3 text-center text-sm font-black uppercase text-[#071c4d]">View Mode</p>

          <div className="grid grid-cols-2 gap-2">
            <ModeButton label="Simulation" active={viewMode === 'simulation'} onClick={() => setViewMode('simulation')} />
            <ModeButton label="KCL" active={viewMode === 'kcl'} onClick={() => setViewMode('kcl')} />
            <ModeButton label="KVL" active={viewMode === 'kvl'} onClick={() => setViewMode('kvl')} />
            <ModeButton label="Practice" active={viewMode === 'practice'} onClick={() => setViewMode('practice')} />
            <ModeButton label="Exam" active={viewMode === 'exam'} onClick={() => setViewMode('exam')} />
            <ModeButton label="Debug" active={viewMode === 'debug'} onClick={() => setViewMode('debug')} />
          </div>
        </div>
      </div>
    </section>
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
        active ? 'bg-[#071c4d] text-white' : 'bg-white text-[#071c4d] ring-1 ring-slate-300'
      }`}
    >
      {label}
    </button>
  );
}

function ValueControls({
  values,
  updateValue,
}: {
  values: CircuitValues;
  updateValue: (key: keyof CircuitValues, value: number) => void;
}) {
  return (
    <section className="rounded-lg border-2 border-[#8d9bb2] bg-white p-5">
      <h2 className="text-center text-[20px] font-black uppercase text-[#071c4d]">
        Interactive Values
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-x-7 gap-y-4 md:grid-cols-2">
        <SliderRow label="V1" value={values.v1} min={0} max={30} step={1} unit="V" onChange={(v) => updateValue('v1', v)} />
        <SliderRow label="V2" value={values.v2} min={0} max={30} step={1} unit="V" onChange={(v) => updateValue('v2', v)} />
        <SliderRow label="R1" value={values.r1} min={10} max={1000} step={10} unit="Ω" onChange={(v) => updateValue('r1', v)} />
        <SliderRow label="R2" value={values.r2} min={10} max={1000} step={10} unit="Ω" onChange={(v) => updateValue('r2', v)} />
        <SliderRow label="R3" value={values.r3} min={10} max={1000} step={10} unit="Ω" onChange={(v) => updateValue('r3', v)} />
        <SliderRow label="R4" value={values.r4} min={10} max={1000} step={10} unit="Ω" onChange={(v) => updateValue('r4', v)} />
        <SliderRow label="R5" value={values.r5} min={10} max={1000} step={10} unit="Ω" onChange={(v) => updateValue('r5', v)} />
      </div>
    </section>
  );
}

function SliderRow({
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
    <label className="block rounded-lg bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between text-[15px] font-black text-[#071c4d]">
        <span>{label}</span>
        <span>
          {value} {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full cursor-pointer"
      />
    </label>
  );
}

/* ============================================================================
   RESULT PANELS
============================================================================ */

function Verification({
  selectedLoop,
  calculated,
  display,
}: {
  selectedLoop: LoopKey;
  calculated: CalculatedValues;
  display: boolean;
}) {
  const isKclValid = display && Math.abs(calculated.kclA) < 1e-6;
  const isKvlValid = display && Math.abs(calculated.selectedKvl) < 1e-6;

  const loopName =
    selectedLoop === 'loop1' ? 'Loop 1' : selectedLoop === 'loop2' ? 'Loop 2' : 'Outer Loop';

  return (
    <section className="rounded-lg border-2 border-[#8d9bb2] bg-white p-5">
      <h2 className="text-center text-[20px] font-black uppercase text-[#071c4d]">
        Verification
      </h2>

      {calculated.error && display && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">
          {calculated.error}
        </div>
      )}

      <div className="mt-6 space-y-6 text-[17px]">
        <ResultLine
          title="KCL at Node A"
          equation={
            <>
              I<sub>1</sub> − I<sub>2</sub> − I<sub>3</sub> = 0
            </>
          }
          value={`${display ? calculated.kclA.toFixed(6) : '0.000000'} A`}
          valid={isKclValid}
          color="green"
        />

        <ResultLine
          title={`KVL ${loopName}`}
          equation="∑ V = 0"
          value={`${display ? calculated.selectedKvl.toFixed(6) : '0.000000'} V`}
          valid={isKvlValid}
          color="blue"
        />
      </div>
    </section>
  );
}

function ResultLine({
  title,
  equation,
  value,
  valid,
  color,
}: {
  title: string;
  equation: React.ReactNode;
  value: string;
  valid: boolean;
  color: 'green' | 'blue';
}) {
  const colorClass = color === 'green' ? 'text-[#05751c]' : 'text-[#0047b8]';

  return (
    <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_170px]">
      <p className="font-black">
        {title}: <span className="font-serif italic">{equation}</span>
      </p>

      <div
        className={`rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-center text-[17px] font-black ${colorClass}`}
      >
        <div>{value}</div>
        <div className={valid ? 'text-[#05751c]' : 'text-slate-500'}>
          {valid ? 'Verified ✅' : 'Waiting'}
        </div>
      </div>
    </div>
  );
}

function Measurements({
  calculated,
  display,
}: {
  calculated: CalculatedValues;
  display: boolean;
}) {
  const n = (value: number, digits = 3) => (display ? value.toFixed(digits) : '0.000');

  return (
    <section className="mx-auto mt-4 w-full max-w-[1450px] rounded-lg border-2 border-[#8d9bb2] bg-white p-4">
      <h2 className="text-center text-[20px] font-black uppercase text-[#071c4d]">
        Measurements
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-[0.75fr_1.25fr_0.8fr_1fr]">
        <MeasureBox title="Currents" color="green">
          <MeasurementLine label="I1" value={`${n(calculated.i1)} A`} color="green" />
          <MeasurementLine label="I2" value={`${n(calculated.i2)} A`} color="green" />
          <MeasurementLine label="I3" value={`${n(calculated.i3)} A`} color="green" />
        </MeasureBox>

        <MeasureBox title="Voltages" color="blue">
          <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-[18px]">
            <MeasurementLine label="VR1" value={`${n(calculated.vr1)} V`} color="blue" />
            <MeasurementLine label="VR2" value={`${n(calculated.vr2)} V`} color="blue" />
            <MeasurementLine label="VR3" value={`${n(calculated.vr3)} V`} color="blue" />
            <MeasurementLine label="VR4" value={`${n(calculated.vr4)} V`} color="blue" />
            <MeasurementLine label="VR5" value={`${n(calculated.vr5)} V`} color="blue" />
            <MeasurementLine label="VV1" value={`${n(calculated.vv1)} V`} color="blue" />
            <MeasurementLine label="VV2" value={`${n(calculated.vv2)} V`} color="blue" />
          </div>
        </MeasureBox>

        <MeasureBox title="Node Voltages" color="purple">
          <MeasurementLine label="VA" value={`${n(calculated.vA)} V`} color="purple" />
          <MeasurementLine label="VB" value={`${n(calculated.vB)} V`} color="purple" />
          <MeasurementLine label="VC" value={`${n(calculated.vC)} V`} color="purple" />
        </MeasureBox>

        <MeasureBox title="Power" color="orange">
          <MeasurementLine label="P1" value={`${n(calculated.p1)} W`} color="orange" />
          <MeasurementLine label="P2" value={`${n(calculated.p2)} W`} color="orange" />
          <MeasurementLine label="P3" value={`${n(calculated.p3)} W`} color="orange" />
          <MeasurementLine label="P4" value={`${n(calculated.p4)} W`} color="orange" />
          <MeasurementLine label="P5" value={`${n(calculated.p5)} W`} color="orange" />
        </MeasureBox>
      </div>
    </section>
  );
}

function MeasureBox({
  title,
  color,
  children,
}: {
  title: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
  children: React.ReactNode;
}) {
  const colorClass =
    color === 'green'
      ? 'text-[#06751d]'
      : color === 'blue'
        ? 'text-[#0047b8]'
        : color === 'purple'
          ? 'text-[#7c3aed]'
          : 'text-[#ea580c]';

  return (
    <div className="rounded-lg bg-slate-50 px-6 py-4">
      <h3 className={`text-center text-[18px] font-black ${colorClass}`}>{title}</h3>
      <div className="mt-5 space-y-4 text-[18px]">{children}</div>
    </div>
  );
}

function MeasurementLine({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}) {
  const first = label.charAt(0);
  const sub = label.slice(1);

  const colorClass =
    color === 'green'
      ? 'text-[#05751c]'
      : color === 'blue'
        ? 'text-[#0047b8]'
        : color === 'purple'
          ? 'text-[#7c3aed]'
          : 'text-[#ea580c]';

  return (
    <div className="grid grid-cols-[56px_20px_1fr] items-center gap-2">
      <span className="font-serif text-[20px] italic">
        {first}
        <sub className="text-[12px]">{sub}</sub>
      </span>

      <span>=</span>

      <span className={`font-black ${colorClass}`}>{value}</span>
    </div>
  );
}

/* ============================================================================
   LEARNING / PRACTICE / EXAM PANEL
============================================================================ */

function LearningPanel({
  values,
  calculated,
  selectedLoop,
  display,
  viewMode,
  practiceInputs,
  setPracticeInputs,
  submitted,
  setSubmitted,
  hintLevel,
  setHintLevel,
}: {
  values: CircuitValues;
  calculated: CalculatedValues;
  selectedLoop: LoopKey;
  display: boolean;
  viewMode: ViewMode;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  hintLevel: number;
  setHintLevel: React.Dispatch<React.SetStateAction<number>>;
}) {
  const selectedEquation =
    selectedLoop === 'loop1'
      ? `V1 − VR1 − VR3 − VR4 = ${display ? calculated.kvlLoop1.toFixed(6) : '0.000000'} V`
      : selectedLoop === 'loop2'
        ? `V2 + VR2 + VR5 − VR3 = ${display ? calculated.kvlLoop2.toFixed(6) : '0.000000'} V`
        : `V1 − VR1 − VR2 − V2 − VR5 − VR4 = ${
            display ? calculated.kvlLoop3.toFixed(6) : '0.000000'
          } V`;

  return (
    <section className="mx-auto mt-4 max-w-[1450px] rounded-lg border-2 border-[#8d9bb2] bg-white p-5">
      <h2 className="text-center text-[20px] font-black uppercase text-[#071c4d]">
        Live Math Solver
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 text-[16px] font-bold md:grid-cols-2">
        <div className="rounded-lg bg-[#e5f6e7] p-4">
          <p className="text-[#05751c]">KCL</p>
          <p className="mt-2 font-serif text-[20px] italic">
            I<sub>1</sub> − I<sub>2</sub> − I<sub>3</sub> ={' '}
            {display ? calculated.kclA.toFixed(6) : '0.000000'} A
          </p>
        </div>

        <div className="rounded-lg bg-[#e7f3ff] p-4">
          <p className="text-[#0047b8]">Selected KVL</p>
          <p className="mt-2 font-serif text-[18px] italic">{selectedEquation}</p>
        </div>
      </div>

      {viewMode === 'kvl' && (
        <KvlStepCards calculated={calculated} selectedLoop={selectedLoop} display={display} />
      )}

      {(viewMode === 'practice' || viewMode === 'exam') && (
        <PracticeExamPanel
          values={values}
          calculated={calculated}
          practiceInputs={practiceInputs}
          setPracticeInputs={setPracticeInputs}
          submitted={submitted}
          setSubmitted={setSubmitted}
          hintLevel={hintLevel}
          setHintLevel={setHintLevel}
          examMode={viewMode === 'exam'}
        />
      )}
    </section>
  );
}

function KvlStepCards({
  calculated,
  selectedLoop,
  display,
}: {
  calculated: CalculatedValues;
  selectedLoop: LoopKey;
  display: boolean;
}) {
  const items =
    selectedLoop === 'loop1'
      ? [
          ['+V1', calculated.vv1],
          ['−VR1', -calculated.vr1],
          ['−VR3', -calculated.vr3],
          ['−VR4', -calculated.vr4],
          ['Total', calculated.kvlLoop1],
        ]
      : selectedLoop === 'loop2'
        ? [
            ['+V2', calculated.vv2],
            ['+VR2', calculated.vr2],
            ['+VR5', calculated.vr5],
            ['−VR3', -calculated.vr3],
            ['Total', calculated.kvlLoop2],
          ]
        : [
            ['+V1', calculated.vv1],
            ['−VR1', -calculated.vr1],
            ['−VR2', -calculated.vr2],
            ['−V2', -calculated.vv2],
            ['−VR5', -calculated.vr5],
            ['−VR4', -calculated.vr4],
            ['Total', calculated.kvlLoop3],
          ];

  return (
    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-slate-300 bg-white p-3 text-center">
          <p className="text-sm font-black text-[#071c4d]">{label}</p>
          <p className="mt-1 text-lg font-black text-[#0047b8]">
            {display ? Number(value).toFixed(3) : '0.000'} V
          </p>
        </div>
      ))}
    </div>
  );
}

function PracticeExamPanel({
  values,
  calculated,
  practiceInputs,
  setPracticeInputs,
  submitted,
  setSubmitted,
  hintLevel,
  setHintLevel,
  examMode,
}: {
  values: CircuitValues;
  calculated: CalculatedValues;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  hintLevel: number;
  setHintLevel: React.Dispatch<React.SetStateAction<number>>;
  examMode: boolean;
}) {
  const answers = {
    vA: calculated.vA,
    vB: calculated.vB,
    vC: calculated.vC,
    i1: calculated.i1,
    i2: calculated.i2,
    i3: calculated.i3,
  };

  const checks = {
    vA: isCloseNumber(practiceInputs.vA, answers.vA, 0.01),
    vB: isCloseNumber(practiceInputs.vB, answers.vB, 0.01),
    vC: isCloseNumber(practiceInputs.vC, answers.vC, 0.01),
    i1: isCloseNumber(practiceInputs.i1, answers.i1, 0.001),
    i2: isCloseNumber(practiceInputs.i2, answers.i2, 0.001),
    i3: isCloseNumber(practiceInputs.i3, answers.i3, 0.001),
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
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg bg-white p-4">
          <h3 className="text-center text-[19px] font-black uppercase text-[#071c4d]">
            {examMode ? 'Exam Question' : 'Practice Question'}
          </h3>

          <p className="mt-4 font-bold text-slate-700">
            Given the circuit values below, find node voltages and branch currents.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-black md:grid-cols-3">
            <GivenBox label="V1" value={`${values.v1} V`} />
            <GivenBox label="V2" value={`${values.v2} V`} />
            <GivenBox label="R1" value={`${values.r1} Ω`} />
            <GivenBox label="R2" value={`${values.r2} Ω`} />
            <GivenBox label="R3" value={`${values.r3} Ω`} />
            <GivenBox label="R4" value={`${values.r4} Ω`} />
            <GivenBox label="R5" value={`${values.r5} Ω`} />
          </div>

          {!examMode && (
            <div className="mt-5 rounded-lg bg-[#fff7ed] p-4">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-black text-[#9a3412]">Hints</h4>

                <button
                  onClick={() => setHintLevel((prev) => Math.min(prev + 1, 4))}
                  className="rounded-md bg-[#f97316] px-3 py-2 text-sm font-black text-white"
                >
                  Show Next Hint
                </button>
              </div>

              <div className="mt-3 space-y-2 text-sm font-bold text-[#7c2d12]">
                {hintLevel >= 1 && <p>Hint 1: Use bottom middle node as 0 V reference.</p>}
                {hintLevel >= 2 && <p>Hint 2: Source relation: left top = VB + V1, right top = VC + V2.</p>}
                {hintLevel >= 3 && <p>Hint 3: At node A, KCL is I1 − I2 − I3 = 0.</p>}
                {hintLevel >= 4 && <p>Hint 4: Negative current means actual direction is opposite to assumed direction.</p>}
                {hintLevel === 0 && <p>No hint shown yet. A rare moment of academic suffering.</p>}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-4">
          <h3 className="text-center text-[19px] font-black uppercase text-[#071c4d]">
            Your Answer
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <AnswerInput
              label="VA"
              unit="V"
              value={practiceInputs.vA}
              onChange={(value) => updateInput('vA', value)}
              correct={checks.vA}
              submitted={submitted}
            />

            <AnswerInput
              label="VB"
              unit="V"
              value={practiceInputs.vB}
              onChange={(value) => updateInput('vB', value)}
              correct={checks.vB}
              submitted={submitted}
            />

            <AnswerInput
              label="VC"
              unit="V"
              value={practiceInputs.vC}
              onChange={(value) => updateInput('vC', value)}
              correct={checks.vC}
              submitted={submitted}
            />

            <AnswerInput
              label="I1"
              unit="A"
              value={practiceInputs.i1}
              onChange={(value) => updateInput('i1', value)}
              correct={checks.i1}
              submitted={submitted}
            />

            <AnswerInput
              label="I2"
              unit="A"
              value={practiceInputs.i2}
              onChange={(value) => updateInput('i2', value)}
              correct={checks.i2}
              submitted={submitted}
            />

            <AnswerInput
              label="I3"
              unit="A"
              value={practiceInputs.i3}
              onChange={(value) => updateInput('i3', value)}
              correct={checks.i3}
              submitted={submitted}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <button
              onClick={() => setSubmitted(true)}
              className="flex-1 rounded-md bg-[#071c4d] px-5 py-3 font-black text-white"
            >
              Submit Answer
            </button>

            <button
              onClick={() => {
                setPracticeInputs(EMPTY_PRACTICE_INPUTS);
                setSubmitted(false);
              }}
              className="flex-1 rounded-md bg-slate-200 px-5 py-3 font-black text-[#071c4d]"
            >
              Clear
            </button>
          </div>

          {submitted && (
            <div className="mt-5 rounded-lg border-2 border-slate-300 bg-slate-50 p-4">
              <h4 className="text-center text-lg font-black text-[#071c4d]">
                Score: {score}/6
              </h4>

              {!examMode && (
                <div className="mt-4 grid grid-cols-1 gap-2 text-sm font-bold md:grid-cols-2">
                  <CorrectAnswer label="VA" value={`${answers.vA.toFixed(3)} V`} />
                  <CorrectAnswer label="VB" value={`${answers.vB.toFixed(3)} V`} />
                  <CorrectAnswer label="VC" value={`${answers.vC.toFixed(3)} V`} />
                  <CorrectAnswer label="I1" value={`${answers.i1.toFixed(4)} A`} />
                  <CorrectAnswer label="I2" value={`${answers.i2.toFixed(4)} A`} />
                  <CorrectAnswer label="I3" value={`${answers.i3.toFixed(4)} A`} />
                </div>
              )}

              {examMode && (
                <p className="mt-3 text-center text-sm font-bold text-slate-600">
                  Exam mode shows score only. Switch to Practice mode to see full solution.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GivenBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 p-3 text-center">
      <p className="text-[#071c4d]">{label}</p>
      <p className="text-[#0047b8]">{value}</p>
    </div>
  );
}

function AnswerInput({
  label,
  unit,
  value,
  onChange,
  correct,
  submitted,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  correct: boolean;
  submitted: boolean;
}) {
  const statusClass =
    !submitted
      ? 'border-slate-300'
      : correct
        ? 'border-green-500 bg-green-50'
        : 'border-red-500 bg-red-50';

  return (
    <label className={`rounded-lg border-2 p-3 ${statusClass}`}>
      <div className="mb-2 flex justify-between font-black text-[#071c4d]">
        <span>{label}</span>
        <span>{unit}</span>
      </div>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Enter ${label}`}
        className="w-full rounded-md border border-slate-300 px-3 py-2 font-bold outline-none"
      />

      {submitted && (
        <p className={`mt-2 text-sm font-black ${correct ? 'text-green-700' : 'text-red-700'}`}>
          {correct ? 'Correct ✅' : 'Wrong ❌'}
        </p>
      )}
    </label>
  );
}

function CorrectAnswer({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-2 text-center">
      <span className="font-black text-[#071c4d]">{label}</span>
      <span className="mx-2">=</span>
      <span className="font-black text-[#0047b8]">{value}</span>
    </div>
  );
}

/* ============================================================================
   PRACTICE HELPERS
============================================================================ */

function isCloseNumber(input: string, target: number, tolerance: number) {
  const parsed = Number(input);

  if (!Number.isFinite(parsed)) {
    return false;
  }

  return Math.abs(parsed - target) <= tolerance;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStep(min: number, max: number, step: number) {
  const count = Math.floor((max - min) / step);
  return min + randomInt(0, count) * step;
}

function randomChoice<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}