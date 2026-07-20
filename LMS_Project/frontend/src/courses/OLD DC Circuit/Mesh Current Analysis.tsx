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
  v1: number;
  v2: number;
};

type MeshResult = {
  i1: number;
  i2: number;
  iR3: number;

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

  a11: number;
  a12: number;
  a21: number;
  a22: number;
  determinant: number;

  kvl1: number;
  kvl2: number;

  error: string | null;
};

type PracticeInputs = {
  i1: string;
  i2: string;
  iR3: string;
};

type ComponentId = 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'v1' | 'v2';

type WireId =
  | 'leftTopToBattery'
  | 'leftBatteryToBottom'
  | 'leftTopToR1'
  | 'r1ToTopCenter'
  | 'topCenterToR2'
  | 'r2ToRightTop'
  | 'rightTopToBattery'
  | 'rightBatteryToBottom'
  | 'leftBottomToR4'
  | 'r4ToBottomCenter'
  | 'bottomCenterToR5'
  | 'r5ToRightBottom'
  | 'topCenterToR3'
  | 'r3ToBottomCenter';

/* ============================================================================
   CONSTANTS
============================================================================ */

const DEFAULT_VALUES: CircuitValues = {
  r1: 100,
  r2: 150,
  r3: 50,
  r4: 120,
  r5: 180,
  v1: 12,
  v2: 6,
};

const EMPTY_PRACTICE: PracticeInputs = {
  i1: '',
  i2: '',
  iR3: '',
};

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 4;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1200,
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

  sourcePositivePlate: '#e00000',
  sourceNegativePlate: '#111827',
  sourcePlus: '#e00000',

  mesh1: '#0648b8',
  mesh2: '#7c3aed',
  shared: '#15803d',

  movingMesh1: '#2563eb',
  movingMesh2: '#a855f7',
  movingShared: '#16a34a',

  node: '#000000',
  nodeLabel: '#003fd1',

  highlightMesh1: '#2563eb',
  highlightMesh2: '#7c3aed',
  debug: '#f97316',
};

const BASE_COMPONENT = {
  resistor: {
    leadLength: 24,
    amplitude: 24,
    zigzags: 6,
    strokeWidth: 5,
  },
  voltageSource: {
    plateLong: 76,
    plateShort: 48,
    plateGap: 34,
    strokeWidth: 5,
  },
  movingCharge: {
    radius: 8,
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
  movingCharge: {
    radius: BASE_COMPONENT.movingCharge.radius * SCALE.COMPONENT,
  },
};

const NODE = {
  radius: 10,
  fill: COLOR.node,
};

const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.WIRE,
  color: COLOR.wire,
  highlightWidth: 14,
};

const LABEL = {
  title: 30,
  value: 23,
  node: 34,
  sub: 16,
};

const ANSWER_TOLERANCE = 0.001;

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
  leftTopToBattery: { x: 0, y: 0 },
  leftBatteryToBottom: { x: 0, y: 0 },
  leftTopToR1: { x: 0, y: 0 },
  r1ToTopCenter: { x: 0, y: 0 },
  topCenterToR2: { x: 0, y: 0 },
  r2ToRightTop: { x: 0, y: 0 },
  rightTopToBattery: { x: 0, y: 0 },
  rightBatteryToBottom: { x: 0, y: 0 },
  leftBottomToR4: { x: 0, y: 0 },
  r4ToBottomCenter: { x: 0, y: 0 },
  bottomCenterToR5: { x: 0, y: 0 },
  r5ToRightBottom: { x: 0, y: 0 },
  topCenterToR3: { x: 0, y: 0 },
  r3ToBottomCenter: { x: 0, y: 0 },
};

const DEBUG_TERMINAL_OFFSET: Point = {
  x: 0,
  y: 0,
};

/* ============================================================================
   GEOMETRY
============================================================================ */

const TERMINAL = {
  leftTop: { x: 110, y: 130 },
  leftBatteryTop: { x: 110, y: 305 },
  leftBatteryBottom: { x: 110, y: 465 },
  leftBottom: { x: 110, y: 640 },

  topCenter: { x: 600, y: 130 },
  bottomCenter: { x: 600, y: 640 },

  rightTop: { x: 1080, y: 130 },
  rightBatteryTop: { x: 1080, y: 305 },
  rightBatteryBottom: { x: 1080, y: 465 },
  rightBottom: { x: 1080, y: 640 },

  r1Left: { x: 270, y: 130 },
  r1Right: { x: 420, y: 130 },

  r2Left: { x: 780, y: 130 },
  r2Right: { x: 930, y: 130 },

  r3Top: { x: 600, y: 325 },
  r3Bottom: { x: 600, y: 465 },

  r4Left: { x: 270, y: 640 },
  r4Right: { x: 420, y: 640 },

  r5Left: { x: 780, y: 640 },
  r5Right: { x: 930, y: 640 },
};

const NODE_POINTS = {
  leftBottom: TERMINAL.leftBottom,
  topCenter: TERMINAL.topCenter,
  bottomCenter: TERMINAL.bottomCenter,
  rightBottom: TERMINAL.rightBottom,
};

const COMPONENT_GEOMETRY = {
  r1: {
    start: TERMINAL.r1Left,
    end: TERMINAL.r1Right,
    label: { x: 345, y: 70 },
    value: { x: 345, y: 183 },
  },
  r2: {
    start: TERMINAL.r2Left,
    end: TERMINAL.r2Right,
    label: { x: 855, y: 70 },
    value: { x: 855, y: 183 },
  },
  r3: {
    start: TERMINAL.r3Top,
    end: TERMINAL.r3Bottom,
    label: { x: 640, y: 392 },
    value: { x: 658, y: 430 },
  },
  r4: {
    start: TERMINAL.r4Left,
    end: TERMINAL.r4Right,
    label: { x: 345, y: 600 },
    value: { x: 345, y: 720 },
  },
  r5: {
    start: TERMINAL.r5Left,
    end: TERMINAL.r5Right,
    label: { x: 855, y: 600 },
    value: { x: 855, y: 720 },
  },
  v1: {
    center: { x: 110, y: 385 },
    label: { x: 35, y: 395 },
    value: { x: 35, y: 440 },
  },
  v2: {
    center: { x: 1080, y: 385 },
    label: { x: 1125, y: 395 },
    value: { x: 1115, y: 440 },
  },
};

const WIRE_SEGMENTS: Array<{
  id: WireId;
  from: Point;
  to: Point;
}> = [
  { id: 'leftTopToBattery', from: TERMINAL.leftTop, to: TERMINAL.leftBatteryTop },
  { id: 'leftBatteryToBottom', from: TERMINAL.leftBatteryBottom, to: TERMINAL.leftBottom },

  { id: 'leftTopToR1', from: TERMINAL.leftTop, to: TERMINAL.r1Left },
  { id: 'r1ToTopCenter', from: TERMINAL.r1Right, to: TERMINAL.topCenter },

  { id: 'topCenterToR2', from: TERMINAL.topCenter, to: TERMINAL.r2Left },
  { id: 'r2ToRightTop', from: TERMINAL.r2Right, to: TERMINAL.rightTop },

  { id: 'rightTopToBattery', from: TERMINAL.rightTop, to: TERMINAL.rightBatteryTop },
  { id: 'rightBatteryToBottom', from: TERMINAL.rightBatteryBottom, to: TERMINAL.rightBottom },

  { id: 'leftBottomToR4', from: TERMINAL.leftBottom, to: TERMINAL.r4Left },
  { id: 'r4ToBottomCenter', from: TERMINAL.r4Right, to: TERMINAL.bottomCenter },

  { id: 'bottomCenterToR5', from: TERMINAL.bottomCenter, to: TERMINAL.r5Left },
  { id: 'r5ToRightBottom', from: TERMINAL.r5Right, to: TERMINAL.rightBottom },

  { id: 'topCenterToR3', from: TERMINAL.topCenter, to: TERMINAL.r3Top },
  { id: 'r3ToBottomCenter', from: TERMINAL.r3Bottom, to: TERMINAL.bottomCenter },
];

const DEBUG_TERMINALS = [
  ['LT', TERMINAL.leftTop],
  ['V1-T', TERMINAL.leftBatteryTop],
  ['V1-B', TERMINAL.leftBatteryBottom],
  ['LB', TERMINAL.leftBottom],
  ['R1-L', TERMINAL.r1Left],
  ['R1-R', TERMINAL.r1Right],
  ['A', TERMINAL.topCenter],
  ['R2-L', TERMINAL.r2Left],
  ['R2-R', TERMINAL.r2Right],
  ['RT', TERMINAL.rightTop],
  ['V2-T', TERMINAL.rightBatteryTop],
  ['V2-B', TERMINAL.rightBatteryBottom],
  ['RB', TERMINAL.rightBottom],
  ['R3-T', TERMINAL.r3Top],
  ['R3-B', TERMINAL.r3Bottom],
  ['D', TERMINAL.bottomCenter],
  ['R4-L', TERMINAL.r4Left],
  ['R4-R', TERMINAL.r4Right],
  ['R5-L', TERMINAL.r5Left],
  ['R5-R', TERMINAL.r5Right],
] as const;

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

export default function MeshCurrentAnalysisSimulator() {
  const [values, setValues] = useState<CircuitValues>(DEFAULT_VALUES);
  const [status, setStatus] = useState<Status>('Ready');
  const [viewMode, setViewMode] = useState<ViewMode>('simulation');
  const [practiceInputs, setPracticeInputs] = useState<PracticeInputs>(EMPTY_PRACTICE);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => solveMesh(values), [values]);

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
      r3: randomStep(20, 300, 10),
      r4: randomStep(50, 500, 10),
      r5: randomStep(50, 500, 10),
      v1: randomInt(5, 24),
      v2: randomInt(3, 18),
    });

    setViewMode('practice');
    setStatus('Running');
    setPracticeInputs(EMPTY_PRACTICE);
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-white p-3 font-sans text-black">
      <section className="mx-auto max-w-[1536px] rounded-lg border-2 border-[#cfd4dc] bg-white p-3">
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

function solveMesh(values: CircuitValues): MeshResult {
  const r1 = Math.max(values.r1, 0.0001);
  const r2 = Math.max(values.r2, 0.0001);
  const r3 = Math.max(values.r3, 0.0001);
  const r4 = Math.max(values.r4, 0.0001);
  const r5 = Math.max(values.r5, 0.0001);

  const a11 = r1 + r3 + r4;
  const a12 = -r3;
  const a21 = -r3;
  const a22 = r2 + r3 + r5;

  const determinant = a11 * a22 - a12 * a21;

  if (Math.abs(determinant) < 1e-12) {
    return {
      i1: 0,
      i2: 0,
      iR3: 0,
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
      a11,
      a12,
      a21,
      a22,
      determinant,
      kvl1: 0,
      kvl2: 0,
      error: 'Circuit cannot be solved because determinant is too close to zero.',
    };
  }

  const i1 = (values.v1 * a22 - a12 * values.v2) / determinant;
  const i2 = (a11 * values.v2 - a21 * values.v1) / determinant;

  const iR3 = i1 - i2;

  const vr1 = Math.abs(i1 * r1);
  const vr2 = Math.abs(i2 * r2);
  const vr3 = Math.abs(iR3 * r3);
  const vr4 = Math.abs(i1 * r4);
  const vr5 = Math.abs(i2 * r5);

  const kvl1 = values.v1 - i1 * r1 - iR3 * r3 - i1 * r4;
  const kvl2 = values.v2 - i2 * r2 - (i2 - i1) * r3 - i2 * r5;

  return {
    i1,
    i2,
    iR3,

    vr1,
    vr2,
    vr3,
    vr4,
    vr5,

    p1: i1 ** 2 * r1,
    p2: i2 ** 2 * r2,
    p3: iR3 ** 2 * r3,
    p4: i1 ** 2 * r4,
    p5: i2 ** 2 * r5,

    a11,
    a12,
    a21,
    a22,
    determinant,

    kvl1,
    kvl2,

    error: null,
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
  result: MeshResult;
  isRunning: boolean;
  viewMode: ViewMode;
}) {
  const showDebug = viewMode === 'debug';
  const showEquationHighlight = viewMode === 'equation';
  const showMovingDots = isRunning && (viewMode === 'simulation' || viewMode === 'practice');

  return (
    <section className="rounded-lg bg-white p-2">
      <div className="h-[760px] w-full">
        <svg
          viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          className="h-full w-full"
        >
          <defs>
            <marker
              id="mesh1Arrow"
              markerWidth="14"
              markerHeight="14"
              refX="12"
              refY="7"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L14,7 L0,14 Z" fill={COLOR.mesh1} />
            </marker>

            <marker
              id="mesh2Arrow"
              markerWidth="14"
              markerHeight="14"
              refX="12"
              refY="7"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L14,7 L0,14 Z" fill={COLOR.mesh2} />
            </marker>
          </defs>

          <g transform={`scale(${SCALE.CANVAS})`}>
            {showEquationHighlight && <MeshHighlightLayer />}

            <WireLayer />
            <ComponentLayer values={values} />
            <NodeLayer />

            <MeshArrowLayer />
            <SharedCurrentArrow result={result} />

            {showMovingDots && <ActualBranchCurrentDots result={result} />}

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
      <CircuitNode point={NODE_POINTS.leftBottom} label="B" offset={{ x: -25, y: 55 }} />
      <CircuitNode point={NODE_POINTS.topCenter} label="A" offset={{ x: -25, y: -35 }} />
      <CircuitNode point={NODE_POINTS.bottomCenter} label="D" offset={{ x: -25, y: 55 }} />
      <CircuitNode point={NODE_POINTS.rightBottom} label="C" offset={{ x: -25, y: 55 }} />
    </g>
  );
}

function MeshArrowLayer() {
  return (
    <g>
      <path
        d="M230 500 C170 410 175 315 245 265 C330 205 465 255 495 360 C525 470 440 555 350 560"
        fill="none"
        stroke={COLOR.mesh1}
        strokeWidth="5"
        strokeLinecap="round"
        markerEnd="url(#mesh1Arrow)"
      />

      <SubscriptText
        x={345}
        y={405}
        text="I"
        sub="1"
        size={58}
        subSize={32}
        color={COLOR.mesh1}
        italic
      />

      <path
        d="M770 500 C710 410 715 315 785 265 C870 205 1005 255 1035 360 C1065 470 980 555 890 560"
        fill="none"
        stroke={COLOR.mesh2}
        strokeWidth="5"
        strokeLinecap="round"
        markerEnd="url(#mesh2Arrow)"
      />

      <SubscriptText
        x={855}
        y={405}
        text="I"
        sub="2"
        size={58}
        subSize={32}
        color={COLOR.mesh2}
        italic
      />
    </g>
  );
}

function SharedCurrentArrow({ result }: { result: MeshResult }) {
  const downward = result.iR3 >= 0;

  return (
    <g>
      <path
        d={downward ? 'M600 485 L600 565' : 'M600 565 L600 485'}
        fill="none"
        stroke={COLOR.shared}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <polygon
        points={downward ? '600,590 582,550 618,550' : '600,460 582,500 618,500'}
        fill={COLOR.shared}
      />

      <SubscriptText
        x={630}
        y={535}
        text="I"
        sub="R3"
        size={32}
        subSize={15}
        color={COLOR.shared}
        italic
      />
    </g>
  );
}

function ActualBranchCurrentDots({ result }: { result: MeshResult }) {
  return (
    <g>
      <MovingCharge
        path={createPath([
          TERMINAL.leftBottom,
          TERMINAL.leftBatteryBottom,
          TERMINAL.leftBatteryTop,
          TERMINAL.leftTop,
        ])}
        current={result.i1}
        reverse={result.i1 < 0}
        color={COLOR.movingMesh1}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.leftTop,
          TERMINAL.r1Left,
          TERMINAL.r1Right,
          TERMINAL.topCenter,
        ])}
        current={result.i1}
        reverse={result.i1 < 0}
        color={COLOR.movingMesh1}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.bottomCenter,
          TERMINAL.r4Right,
          TERMINAL.r4Left,
          TERMINAL.leftBottom,
        ])}
        current={result.i1}
        reverse={result.i1 < 0}
        color={COLOR.movingMesh1}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.topCenter,
          TERMINAL.r2Left,
          TERMINAL.r2Right,
          TERMINAL.rightTop,
        ])}
        current={result.i2}
        reverse={result.i2 < 0}
        color={COLOR.movingMesh2}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.rightTop,
          TERMINAL.rightBatteryTop,
          TERMINAL.rightBatteryBottom,
          TERMINAL.rightBottom,
        ])}
        current={result.i2}
        reverse={result.i2 < 0}
        color={COLOR.movingMesh2}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.rightBottom,
          TERMINAL.r5Right,
          TERMINAL.r5Left,
          TERMINAL.bottomCenter,
        ])}
        current={result.i2}
        reverse={result.i2 < 0}
        color={COLOR.movingMesh2}
      />

      <MovingCharge
        path={createPath([
          TERMINAL.topCenter,
          TERMINAL.r3Top,
          TERMINAL.r3Bottom,
          TERMINAL.bottomCenter,
        ])}
        current={result.iR3}
        reverse={result.iR3 < 0}
        color={COLOR.movingShared}
        radius={10}
      />
    </g>
  );
}

function MeshHighlightLayer() {
  return (
    <g>
      <path
        d={createPath([
          TERMINAL.leftBottom,
          TERMINAL.leftTop,
          TERMINAL.topCenter,
          TERMINAL.bottomCenter,
          TERMINAL.leftBottom,
        ])}
        fill="none"
        stroke={COLOR.highlightMesh1}
        strokeWidth={WIRE.highlightWidth}
        strokeOpacity="0.14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={createPath([
          TERMINAL.topCenter,
          TERMINAL.rightTop,
          TERMINAL.rightBottom,
          TERMINAL.bottomCenter,
          TERMINAL.topCenter,
        ])}
        fill="none"
        stroke={COLOR.highlightMesh2}
        strokeWidth={WIRE.highlightWidth}
        strokeOpacity="0.14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function DiagramOverlay({
  result,
  viewMode,
}: {
  result: MeshResult;
  viewMode: ViewMode;
}) {
  const lines =
    viewMode === 'simulation'
      ? [
          { color: COLOR.movingMesh1, text: 'Blue dots = I1 exclusive branches' },
          { color: COLOR.movingMesh2, text: 'Purple dots = I2 exclusive branches' },
          { color: COLOR.movingShared, text: 'Green dot = shared R3 current' },
        ]
      : viewMode === 'equation'
        ? [
            { color: COLOR.highlightMesh1, text: 'Mesh 1 equation highlighted' },
            { color: COLOR.highlightMesh2, text: 'Mesh 2 equation highlighted' },
            { color: COLOR.shared, text: 'Shared resistor uses I1 − I2' },
          ]
        : viewMode === 'practice'
          ? [
              { color: COLOR.movingMesh1, text: 'Solve I1, I2 and IR3' },
              { color: COLOR.shared, text: 'IR3 = I1 − I2' },
              { color: COLOR.highlightMesh2, text: 'Submit answers below' },
            ]
          : [
              { color: COLOR.debug, text: 'Orange dots = debug terminals' },
              { color: COLOR.wire, text: 'Use geometry constants to tune layout' },
              { color: COLOR.resistor, text: 'Reusable SVG blocks are separated' },
            ];

  return (
    <g>
      <rect x="25" y="18" width="340" height="104" rx="10" fill="white" stroke="#cbd5e1" />

      {lines.map((line, index) => (
        <g key={line.text}>
          <circle cx="47" cy={43 + index * 28} r="7" fill={line.color} />
          <text x="68" y={49 + index * 28} fontSize="15" fontWeight="800" fill="#0f172a">
            {line.text}
          </text>
        </g>
      ))}

      <rect x="25" y="138" width="260" height="88" rx="10" fill="#eef2ff" stroke="#94a3b8" />
      <text x="45" y="168" fontSize="18" fontWeight="900" fill="#1e3a8a">
        I1 = {result.i1.toFixed(4)} A
      </text>
      <text x="45" y="194" fontSize="18" fontWeight="900" fill="#5b21b6">
        I2 = {result.i2.toFixed(4)} A
      </text>
      <text x="45" y="220" fontSize="18" fontWeight="900" fill="#166534">
        IR3 = {result.iR3.toFixed(4)} A
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
      stroke={WIRE.color}
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
        stroke={COLOR.sourcePositivePlate}
        strokeWidth={COMPONENT.voltageSource.strokeWidth}
      />

      <line
        x1={c.x - shortHalf}
        y1={c.y + gapHalf}
        x2={c.x + shortHalf}
        y2={c.y + gapHalf}
        stroke={COLOR.sourceNegativePlate}
        strokeWidth={COMPONENT.voltageSource.strokeWidth}
      />

      <SvgText x={c.x - 58} y={c.y - gapHalf - 20} size={34} color={COLOR.sourcePlus} weight={900}>
        +
      </SvgText>

      <SvgText x={c.x - 58} y={c.y + gapHalf + 65} size={38} weight={900}>
        −
      </SvgText>

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
}: {
  point: Point;
  label?: string;
  offset?: Point;
}) {
  return (
    <g>
      <circle cx={point.x} cy={point.y} r={NODE.radius} fill={NODE.fill} />

      {label && offset && (
        <SvgText
          x={point.x + offset.x}
          y={point.y + offset.y}
          size={LABEL.node}
          color={COLOR.nodeLabel}
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
  const speed = clamp(0.8, 4.4 - Math.abs(current) * 35, 3.8);

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
  result: MeshResult;
  viewMode: ViewMode;
}) {
  return (
    <section className="rounded-lg border-2 border-[#0648b8] bg-white">
      <div className="rounded-t-md bg-gradient-to-r from-[#0648b8] to-[#0b58c6] py-4 text-center text-[31px] font-black uppercase tracking-wide text-white">
        Mesh Current Analysis
      </div>

      <div className="space-y-5 px-6 py-5 text-[23px] leading-snug">
        <ConceptItem number={1}>Assign clockwise mesh currents I₁ and I₂</ConceptItem>
        <ConceptItem number={2}>Apply KVL around each mesh</ConceptItem>
        <ConceptItem number={3}>Solve the simultaneous equations</ConceptItem>
      </div>

      <div className="mx-5 h-[2px] bg-[#8bb8ff]" />

      <div className="mx-auto w-fit rounded-b-lg bg-[#e6f2ff] px-9 py-3 text-[23px] font-black text-[#0648b8]">
        Mesh Equations
      </div>

      <div className="px-6 py-4">
        <EquationBlock title="Mesh 1">
          (R<sub>1</sub> + R<sub>3</sub> + R<sub>4</sub>) I<sub>1</sub> − R
          <sub>3</sub>I<sub>2</sub> = V<sub>1</sub>
        </EquationBlock>

        <EquationBlock title="Mesh 2">
          −R<sub>3</sub>I<sub>1</sub> + (R<sub>2</sub> + R<sub>3</sub> + R
          <sub>5</sub>) I<sub>2</sub> = V<sub>2</sub>
        </EquationBlock>

        <div className="mt-5 rounded-lg border-2 border-[#3a7bdc] bg-white px-5 py-3">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-serif text-[21px] italic">
            <span>R₁ = {values.r1} Ω</span>
            <span>R₂ = {values.r2} Ω</span>
            <span>R₃ = {values.r3} Ω</span>
            <span>R₄ = {values.r4} Ω</span>
            <span>R₅ = {values.r5} Ω</span>
            <span>V₁ = {values.v1} V</span>
            <span>V₂ = {values.v2} V</span>
            <span>Mode: {viewMode}</span>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-[18px] font-bold">
          <p>I₁ = {result.i1.toFixed(5)} A</p>
          <p>I₂ = {result.i2.toFixed(5)} A</p>
          <p>
            I<sub>R3</sub> = I₁ − I₂ = {result.iR3.toFixed(5)} A
          </p>
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
      <h3 className="text-[22px] font-black text-[#0648b8]">{title}:</h3>

      <div className="mt-2 rounded-lg bg-[#f8fbff] p-3 font-serif text-[23px] font-bold italic">
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
    <section className="min-h-[300px] border-r-2 border-[#cfd4dc] bg-white p-4">
      <h2 className="text-center text-[22px] font-black uppercase text-[#0648b8]">
        Component Values
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        <ValueInput label="R₁" value={values.r1} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r1', v)} />
        <ValueInput label="R₂" value={values.r2} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r2', v)} />
        <ValueInput label="R₃" value={values.r3} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r3', v)} />
        <ValueInput label="R₄" value={values.r4} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r4', v)} />
        <ValueInput label="R₅" value={values.r5} unit="Ω" min={0.1} step={1} onChange={(v) => updateValue('r5', v)} />
        <ValueInput label="V₁" value={values.v1} unit="V" min={0} step={1} onChange={(v) => updateValue('v1', v)} />
        <div />
        <ValueInput label="V₂" value={values.v2} unit="V" min={0} step={1} onChange={(v) => updateValue('v2', v)} />
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
    <section className="min-h-[300px] border-r-2 border-[#cfd4dc] bg-white p-4">
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

function ResultsPanel({ result }: { result: MeshResult }) {
  const kvl1Ok = Math.abs(result.kvl1) < 1e-6;
  const kvl2Ok = Math.abs(result.kvl2) < 1e-6;

  return (
    <section className="min-h-[300px] bg-white p-4">
      <h2 className="text-center text-[23px] font-black uppercase text-[#0648b8]">
        Results
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ResultCard label="I₁" value={`${result.i1.toFixed(4)} A`} color="blue" />
        <ResultCard label="I₂" value={`${result.i2.toFixed(4)} A`} color="purple" />
        <ResultCard label="IR₃" value={`${result.iR3.toFixed(4)} A`} color="green" />
      </div>

      <div className="mt-5 rounded-lg border-2 border-[#8bb8ff] bg-white px-5 py-4 text-[18px] font-bold">
        <p>KVL Mesh 1: {result.kvl1.toFixed(8)} V {kvl1Ok ? '✅' : '❌'}</p>
        <p>KVL Mesh 2: {result.kvl2.toFixed(8)} V {kvl2Ok ? '✅' : '❌'}</p>
        <p>Determinant: {result.determinant.toFixed(3)}</p>
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
  result: MeshResult;
  viewMode: ViewMode;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section className="mt-4 rounded-lg border-2 border-[#0648b8] bg-white p-5">
      <h2 className="text-center text-[24px] font-black uppercase text-[#0648b8]">
        Live Mesh Math Solver
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MatrixPanel values={values} result={result} />
        <KvlPanel values={values} result={result} />
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

function MatrixPanel({
  values,
  result,
}: {
  values: CircuitValues;
  result: MeshResult;
}) {
  return (
    <div className="rounded-lg bg-[#eef6ff] p-5">
      <h3 className="text-[21px] font-black text-[#0648b8]">Matrix Form</h3>

      <div className="mt-4 overflow-x-auto rounded-lg bg-white p-4 font-serif text-[22px] font-bold italic">
        <p>
          [{result.a11.toFixed(1)} &nbsp; {result.a12.toFixed(1)}] [I₁] = [{values.v1}]
        </p>
        <p>
          [{result.a21.toFixed(1)} &nbsp; {result.a22.toFixed(1)}] [I₂] = [{values.v2}]
        </p>
      </div>

      <div className="mt-4 rounded-lg bg-white p-4 text-[17px] font-bold">
        <p>a₁₁ = R₁ + R₃ + R₄ = {values.r1} + {values.r3} + {values.r4} = {result.a11.toFixed(2)}</p>
        <p>a₂₂ = R₂ + R₃ + R₅ = {values.r2} + {values.r3} + {values.r5} = {result.a22.toFixed(2)}</p>
        <p>a₁₂ = a₂₁ = −R₃ = −{values.r3}</p>
      </div>
    </div>
  );
}

function KvlPanel({
  values,
  result,
}: {
  values: CircuitValues;
  result: MeshResult;
}) {
  return (
    <div className="rounded-lg bg-[#f4efff] p-5">
      <h3 className="text-[21px] font-black text-[#5b21b6]">Step-by-step KVL</h3>

      <div className="mt-4 space-y-3 rounded-lg bg-white p-4 text-[17px] font-bold">
        <p>
          Mesh 1: {values.v1} − ({values.r1})I₁ − ({values.r3})(I₁ − I₂) − ({values.r4})I₁ = 0
        </p>
        <p>
          Mesh 1 residual = {result.kvl1.toFixed(8)} V
        </p>

        <div className="h-px bg-slate-300" />

        <p>
          Mesh 2: {values.v2} − ({values.r2})I₂ − ({values.r3})(I₂ − I₁) − ({values.r5})I₂ = 0
        </p>
        <p>
          Mesh 2 residual = {result.kvl2.toFixed(8)} V
        </p>

        <div className="h-px bg-slate-300" />

        <p>I₁ = {result.i1.toFixed(6)} A</p>
        <p>I₂ = {result.i2.toFixed(6)} A</p>
        <p>
          I<sub>R3</sub> = I₁ − I₂ = {result.iR3.toFixed(6)} A
        </p>
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
  result: MeshResult;
  practiceInputs: PracticeInputs;
  setPracticeInputs: React.Dispatch<React.SetStateAction<PracticeInputs>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const checks = {
    i1: isClose(practiceInputs.i1, result.i1),
    i2: isClose(practiceInputs.i2, result.i2),
    iR3: isClose(practiceInputs.iR3, result.iR3),
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
        Solve for I₁, I₂, and shared branch current IR₃. Type answers in amperes.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnswerInput
          label="I₁"
          value={practiceInputs.i1}
          correct={checks.i1}
          submitted={submitted}
          onChange={(value) => updateInput('i1', value)}
        />

        <AnswerInput
          label="I₂"
          value={practiceInputs.i2}
          correct={checks.i2}
          submitted={submitted}
          onChange={(value) => updateInput('i2', value)}
        />

        <AnswerInput
          label="IR₃"
          value={practiceInputs.iR3}
          correct={checks.iR3}
          submitted={submitted}
          onChange={(value) => updateInput('iR3', value)}
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
            <p>I₁ = {result.i1.toFixed(5)} A</p>
            <p>I₂ = {result.i2.toFixed(5)} A</p>
            <p>IR₃ = {result.iR3.toFixed(5)} A</p>
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
    <div className="grid grid-cols-[54px_1fr_34px] items-center gap-3 text-[20px]">
      <label className="font-serif text-[23px] font-black italic">
        {label}
      </label>

      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-[40px] rounded-md border border-gray-400 bg-white px-2 text-center text-[20px] outline-none focus:border-[#0648b8]"
      />

      <span className="text-[20px]">{unit}</span>
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
        <span>A</span>
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
  const count = Math.floor((max - min) / step);
  return min + randomInt(0, count) * step;
}