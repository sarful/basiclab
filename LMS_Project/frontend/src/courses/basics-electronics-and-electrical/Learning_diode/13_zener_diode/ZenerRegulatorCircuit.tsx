"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type Point = Readonly<{ x: number; y: number }>;
export type MutablePoint = { x: number; y: number };

export type ComponentOffsetMap = {
  source: MutablePoint;
  resistor: MutablePoint;
  zener: MutablePoint;
  load: MutablePoint;
  labels: MutablePoint;
};

export type WireSegment = {
  id: string;
  points: readonly Point[];
};

export type CircuitControls = {
  canvasScale: number;
  componentScale: number;
  wireScale: number;
  wireWidth: number;
  globalOffset: MutablePoint;
  componentOffset: ComponentOffsetMap;
  wireOffset: MutablePoint;
  debugTerminalOffset: MutablePoint;
  showDebugTerminals: boolean;
  showGrid: boolean;
};

/* -------------------------------------------------------------------------- */
/*                              VIEW BOX + SCALE                              */
/* -------------------------------------------------------------------------- */

export const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 274,
  height: 198,
} as const;

export const SCALE = {
  CIRCUIT_COMPONENT_SCALE: 1,
  BASE_WIRE_WIDTH: 2,
  CIRCUIT_WIRE_SCALE: 1,
  CIRCUIT_CANVAS_SCALE: 1,
} as const;

/* -------------------------------------------------------------------------- */
/*                              BASE COMPONENTS                               */
/* -------------------------------------------------------------------------- */

export const BASE_COMPONENT = {
  source: {
    cx: 34,
    cy: 113,
    radius: 22,
  },
  resistor: {
    start: { x: 65, y: 49 },
    end: { x: 133, y: 49 },
    center: { x: 99, y: 49 },
  },
  zener: {
    x: 170,
    cathodeY: 94,
    anodeY: 123,
    center: { x: 170, y: 108.5 },
  },
  load: {
    x: 244,
    y: 81,
    width: 20,
    height: 62,
    radius: 4,
    center: { x: 254, y: 112 },
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                           COMPONENT CONFIGURATION                          */
/* -------------------------------------------------------------------------- */

export const COMPONENT = {
  source: {
    center: { x: BASE_COMPONENT.source.cx, y: BASE_COMPONENT.source.cy },
  },
  resistor: {
    center: BASE_COMPONENT.resistor.center,
  },
  zener: {
    center: BASE_COMPONENT.zener.center,
  },
  load: {
    center: BASE_COMPONENT.load.center,
  },
  labels: {
    center: { x: VIEW_BOX.width / 2, y: VIEW_BOX.height / 2 },
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                                   NODES                                    */
/* -------------------------------------------------------------------------- */

export const NODE = {
  sourceTop: { x: 34, y: 91 },
  sourceUpperCorner: { x: 34, y: 49 },
  resistorInput: { x: 65, y: 49 },
  resistorOutput: { x: 133, y: 49 },
  topRightCorner: { x: 254, y: 49 },
  loadTop: { x: 254, y: 81 },
  loadBottom: { x: 254, y: 143 },
  bottomRightCorner: { x: 254, y: 173 },
  sourceLowerCorner: { x: 34, y: 173 },
  sourceBottom: { x: 34, y: 135 },
  zenerTop: { x: 170, y: 49 },
  zenerCathode: { x: 170, y: 94 },
  zenerAnode: { x: 170, y: 123 },
  zenerBottom: { x: 170, y: 173 },
} as const satisfies Record<string, Point>;

/* -------------------------------------------------------------------------- */
/*                                   PATHS                                    */
/* -------------------------------------------------------------------------- */

export const PATH = {
  resistor:
    "M 65 49 L 72 28 L 83 68 L 94 28 L 105 68 L 116 28 L 127 68 L 133 49",
  zenerCathode: "M 151 83 L 151 94 L 190 94 L 190 105",
  zenerBody: "M 170 94 L 151 123 L 190 123 Z",
} as const;

/* -------------------------------------------------------------------------- */
/*                                   WIRES                                    */
/* -------------------------------------------------------------------------- */

export const WIRE: readonly WireSegment[] = [
  {
    id: "source-to-resistor",
    points: [NODE.sourceTop, NODE.sourceUpperCorner, NODE.resistorInput],
  },
  {
    id: "resistor-to-top-right",
    points: [NODE.resistorOutput, NODE.topRightCorner],
  },
  {
    id: "top-right-to-load",
    points: [NODE.topRightCorner, NODE.loadTop],
  },
  {
    id: "load-to-bottom-right",
    points: [NODE.loadBottom, NODE.bottomRightCorner],
  },
  {
    id: "bottom-return",
    points: [NODE.bottomRightCorner, NODE.sourceLowerCorner],
  },
  {
    id: "source-bottom-return",
    points: [NODE.sourceLowerCorner, NODE.sourceBottom],
  },
  {
    id: "zener-upper-branch",
    points: [NODE.zenerTop, NODE.zenerCathode],
  },
  {
    id: "zener-lower-branch",
    points: [NODE.zenerAnode, NODE.zenerBottom],
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                                   LABELS                                   */
/* -------------------------------------------------------------------------- */

export const LABEL = {
  resistor: {
    x: 91,
    y: 17,
    fontSize: 18,
    text: "R",
  },
  source: {
    x: 34,
    y: 119,
    fontSize: 16,
    text: "V",
  },
  zener: {
    x: 101,
    y: 105,
    fontSize: 16,
    lineHeight: 18,
    lines: ["Zener", "Diode"],
  },
  load: {
    x: 254,
    y: 112,
    fontSize: 16,
    text: "Load",
    rotation: -90,
  },
} as const;

const CANVAS_CENTER: Point = {
  x: VIEW_BOX.width / 2,
  y: VIEW_BOX.height / 2,
};

export const DEFAULT_COMPONENT_OFFSET: ComponentOffsetMap = {
  source: { x: 0, y: 0 },
  resistor: { x: 0, y: 0 },
  zener: { x: 0, y: 0 },
  load: { x: 0, y: 0 },
  labels: { x: 0, y: 0 },
};

export const DEFAULT_CONTROLS: CircuitControls = {
  canvasScale: SCALE.CIRCUIT_CANVAS_SCALE,
  componentScale: SCALE.CIRCUIT_COMPONENT_SCALE,
  wireScale: SCALE.CIRCUIT_WIRE_SCALE,
  wireWidth: SCALE.BASE_WIRE_WIDTH,
  globalOffset: { x: 0, y: 0 },
  componentOffset: DEFAULT_COMPONENT_OFFSET,
  wireOffset: { x: 0, y: 0 },
  debugTerminalOffset: { x: 0, y: 0 },
  showDebugTerminals: false,
  showGrid: false,
};

/* -------------------------------------------------------------------------- */
/*                              TRANSFORM HELPERS                             */
/* -------------------------------------------------------------------------- */

function scaleAround(
  center: Point,
  scale: number,
  offset: Point = { x: 0, y: 0 },
) {
  return [
    `translate(${center.x + offset.x} ${center.y + offset.y})`,
    `scale(${scale})`,
    `translate(${-center.x} ${-center.y})`,
  ].join(" ");
}

function pointsToString(points: readonly Point[]) {
  return points.map(({ x, y }) => `${x},${y}`).join(" ");
}

/* -------------------------------------------------------------------------- */
/*                         REUSABLE SVG LIBRARY BLOCKS                        */
/* -------------------------------------------------------------------------- */

export function CircuitWire({
  segment,
  strokeWidth,
}: {
  segment: WireSegment;
  strokeWidth: number;
}) {
  return (
    <polyline
      data-wire-id={segment.id}
      points={pointsToString(segment.points)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function TerminalDot({
  point,
  label,
  strokeWidth,
}: {
  point: Point;
  label: string;
  strokeWidth: number;
}) {
  return (
    <g data-terminal={label}>
      <circle
        cx={point.x}
        cy={point.y}
        r={3.1}
        fill="white"
        stroke="#dc2626"
        strokeWidth={Math.max(1, strokeWidth * 0.65)}
      />
      <circle cx={point.x} cy={point.y} r={1.05} fill="#dc2626" />
      <text
        x={point.x + 4.5}
        y={point.y - 4.5}
        fontSize={5.5}
        fill="#dc2626"
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

export function VoltageSourceSymbol({ strokeWidth }: { strokeWidth: number }) {
  const { cx, cy, radius } = BASE_COMPONENT.source;

  return (
    <g aria-label="Voltage source">
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="white"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </g>
  );
}

export function ResistorSymbol({ strokeWidth }: { strokeWidth: number }) {
  return (
    <path
      aria-label="Resistor"
      d={PATH.resistor}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  );
}

export function ZenerDiodeSymbol({ strokeWidth }: { strokeWidth: number }) {
  return (
    <g aria-label="Zener diode">
      <path
        d={PATH.zenerCathode}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d={PATH.zenerBody}
        fill="white"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </g>
  );
}

export function LoadSymbol({ strokeWidth }: { strokeWidth: number }) {
  const load = BASE_COMPONENT.load;

  return (
    <rect
      aria-label="Load"
      x={load.x}
      y={load.y}
      width={load.width}
      height={load.height}
      rx={load.radius}
      fill="white"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    />
  );
}

export function CircuitLabels() {
  return (
    <g
      fill="currentColor"
      stroke="none"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight={400}
    >
      <text
        x={LABEL.resistor.x}
        y={LABEL.resistor.y}
        fontSize={LABEL.resistor.fontSize}
        textAnchor="middle"
      >
        {LABEL.resistor.text}
      </text>

      <text
        x={LABEL.source.x}
        y={LABEL.source.y}
        fontSize={LABEL.source.fontSize}
        textAnchor="middle"
      >
        {LABEL.source.text}
      </text>

      <text
        x={LABEL.zener.x}
        y={LABEL.zener.y}
        fontSize={LABEL.zener.fontSize}
        textAnchor="start"
      >
        {LABEL.zener.lines.map((line, index) => (
          <tspan
            key={line}
            x={LABEL.zener.x}
            dy={index === 0 ? 0 : LABEL.zener.lineHeight}
          >
            {line}
          </tspan>
        ))}
      </text>

      <text
        x={LABEL.load.x}
        y={LABEL.load.y}
        fontSize={LABEL.load.fontSize}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${LABEL.load.rotation} ${LABEL.load.x} ${LABEL.load.y})`}
      >
        {LABEL.load.text}
      </text>
    </g>
  );
}

export function EngineeringGrid() {
  const verticalLines = Array.from({ length: 28 }, (_, index) => index * 10);
  const horizontalLines = Array.from({ length: 20 }, (_, index) => index * 10);

  return (
    <g aria-hidden="true" pointerEvents="none">
      {verticalLines.map((x) => (
        <line
          key={`grid-v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={VIEW_BOX.height}
          stroke="#e5e7eb"
          strokeWidth={x % 50 === 0 ? 0.65 : 0.3}
        />
      ))}
      {horizontalLines.map((y) => (
        <line
          key={`grid-h-${y}`}
          x1={0}
          y1={y}
          x2={VIEW_BOX.width}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth={y % 50 === 0 ? 0.65 : 0.3}
        />
      ))}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*                             CONTROL PANEL UI                               */
/* -------------------------------------------------------------------------- */

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const decimals = step < 1 ? 2 : 0;

  return (
    <label className="grid grid-cols-[minmax(0,1fr)_64px] items-center gap-x-3 gap-y-1 text-xs">
      <span className="font-medium text-slate-700">{label}</span>
      <output className="rounded-md border border-slate-200 bg-white px-2 py-1 text-right font-mono text-[11px] text-slate-800">
        {value.toFixed(decimals)}
      </output>
      <input
        className="col-span-2 h-2 w-full cursor-pointer accent-slate-950"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(Number(event.target.value))
        }
      />
    </label>
  );
}

function ToggleControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 accent-slate-950"
      />
    </label>
  );
}

function PointControls({
  title,
  point,
  min = -30,
  max = 30,
  step = 1,
  onChange,
}: {
  title: string;
  point: MutablePoint;
  min?: number;
  max?: number;
  step?: number;
  onChange: (axis: keyof MutablePoint, value: number) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {title}
      </div>
      <RangeControl
        label="X offset"
        value={point.x}
        min={min}
        max={max}
        step={step}
        onChange={(value) => onChange("x", value)}
      />
      <RangeControl
        label="Y offset"
        value={point.y}
        min={min}
        max={max}
        step={step}
        onChange={(value) => onChange("y", value)}
      />
    </div>
  );
}

function ControlSection({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details
      defaultOpen={open}
      className="group rounded-xl border border-slate-200 bg-white"
    >
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <span>{title}</span>
          <span className="text-xs text-slate-400 transition-transform group-open:rotate-180">
            ▼
          </span>
        </div>
      </summary>
      <div className="space-y-4 border-t border-slate-100 p-4">{children}</div>
    </details>
  );
}

function PanPad({ onNudge }: { onNudge: (dx: number, dy: number) => void }) {
  const buttonClass =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 active:translate-y-px";

  return (
    <div className="grid grid-cols-3 gap-2 self-start">
      <div />
      <button
        type="button"
        className={buttonClass}
        onClick={() => onNudge(0, -1)}
        aria-label="Move circuit up"
      >
        ↑
      </button>
      <div />
      <button
        type="button"
        className={buttonClass}
        onClick={() => onNudge(-1, 0)}
        aria-label="Move circuit left"
      >
        ←
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onNudge(0, 0)}
        aria-label="No movement"
      >
        •
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onNudge(1, 0)}
        aria-label="Move circuit right"
      >
        →
      </button>
      <div />
      <button
        type="button"
        className={buttonClass}
        onClick={() => onNudge(0, 1)}
        aria-label="Move circuit down"
      >
        ↓
      </button>
      <div />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             MAIN CIRCUIT SVG                               */
/* -------------------------------------------------------------------------- */

export function ZenerRegulatorSvg({ controls }: { controls: CircuitControls }) {
  /* Required tuning variables: these names stay visible and reusable. */
  const CIRCUIT_COMPONENT_SCALE = controls.componentScale;
  const BASE_WIRE_WIDTH = controls.wireWidth;
  const CIRCUIT_WIRE_SCALE = controls.wireScale;
  const CIRCUIT_CANVAS_SCALE = controls.canvasScale;
  const COMPONENT_OFFSET = controls.componentOffset;
  const WIRE_OFFSET = controls.wireOffset;
  const DEBUG_TERMINAL_OFFSET = controls.debugTerminalOffset;

  const canvasTransform = scaleAround(
    CANVAS_CENTER,
    CIRCUIT_CANVAS_SCALE,
    controls.globalOffset,
  );

  const wireTransform = scaleAround(
    CANVAS_CENTER,
    CIRCUIT_WIRE_SCALE,
    WIRE_OFFSET,
  );

  const sourceTransform = scaleAround(
    COMPONENT.source.center,
    CIRCUIT_COMPONENT_SCALE,
    COMPONENT_OFFSET.source,
  );

  const resistorTransform = scaleAround(
    COMPONENT.resistor.center,
    CIRCUIT_COMPONENT_SCALE,
    COMPONENT_OFFSET.resistor,
  );

  const zenerTransform = scaleAround(
    COMPONENT.zener.center,
    CIRCUIT_COMPONENT_SCALE,
    COMPONENT_OFFSET.zener,
  );

  const loadTransform = scaleAround(
    COMPONENT.load.center,
    CIRCUIT_COMPONENT_SCALE,
    COMPONENT_OFFSET.load,
  );

  return (
    <svg
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      role="img"
      aria-label="Zener diode voltage regulator circuit with voltage source, resistor, Zener diode and load"
      className="block h-auto w-full select-none bg-white text-black"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x={VIEW_BOX.x}
        y={VIEW_BOX.y}
        width={VIEW_BOX.width}
        height={VIEW_BOX.height}
        fill="white"
      />

      {controls.showGrid && <EngineeringGrid />}

      <g transform={canvasTransform}>
        <g transform={wireTransform}>
          {WIRE.map((segment) => (
            <CircuitWire
              key={segment.id}
              segment={segment}
              strokeWidth={BASE_WIRE_WIDTH}
            />
          ))}

          {controls.showDebugTerminals && (
            <g
              transform={`translate(${DEBUG_TERMINAL_OFFSET.x} ${DEBUG_TERMINAL_OFFSET.y})`}
              pointerEvents="none"
            >
              {Object.entries(NODE).map(([name, point]) => (
                <TerminalDot
                  key={name}
                  point={point}
                  label={name}
                  strokeWidth={BASE_WIRE_WIDTH}
                />
              ))}
            </g>
          )}
        </g>

        <g transform={sourceTransform}>
          <VoltageSourceSymbol strokeWidth={BASE_WIRE_WIDTH} />
        </g>

        <g transform={resistorTransform}>
          <ResistorSymbol strokeWidth={BASE_WIRE_WIDTH} />
        </g>

        <g transform={zenerTransform}>
          <ZenerDiodeSymbol strokeWidth={BASE_WIRE_WIDTH} />
        </g>

        <g transform={loadTransform}>
          <LoadSymbol strokeWidth={BASE_WIRE_WIDTH} />
        </g>

        <g
          transform={`translate(${COMPONENT_OFFSET.labels.x} ${COMPONENT_OFFSET.labels.y})`}
        >
          <CircuitLabels />
        </g>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                     COMPLETE NEXT.JS CLIENT COMPONENT                      */
/* -------------------------------------------------------------------------- */

export default function ZenerRegulatorCircuit() {
  const [controls, setControls] = useState<CircuitControls>(() => ({
    ...DEFAULT_CONTROLS,
    globalOffset: { ...DEFAULT_CONTROLS.globalOffset },
    wireOffset: { ...DEFAULT_CONTROLS.wireOffset },
    debugTerminalOffset: { ...DEFAULT_CONTROLS.debugTerminalOffset },
    componentOffset: {
      source: { ...DEFAULT_COMPONENT_OFFSET.source },
      resistor: { ...DEFAULT_COMPONENT_OFFSET.resistor },
      zener: { ...DEFAULT_COMPONENT_OFFSET.zener },
      load: { ...DEFAULT_COMPONENT_OFFSET.load },
      labels: { ...DEFAULT_COMPONENT_OFFSET.labels },
    },
  }));

  const updateScalar = (
    key: "canvasScale" | "componentScale" | "wireScale" | "wireWidth",
    value: number,
  ) => {
    setControls((current) => ({ ...current, [key]: value }));
  };

  const updatePoint = (
    key: "globalOffset" | "wireOffset" | "debugTerminalOffset",
    axis: keyof MutablePoint,
    value: number,
  ) => {
    setControls((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [axis]: value,
      },
    }));
  };

  const updateComponentPoint = (
    component: keyof ComponentOffsetMap,
    axis: keyof MutablePoint,
    value: number,
  ) => {
    setControls((current) => ({
      ...current,
      componentOffset: {
        ...current.componentOffset,
        [component]: {
          ...current.componentOffset[component],
          [axis]: value,
        },
      },
    }));
  };

  const nudgeCircuit = (dx: number, dy: number) => {
    if (dx === 0 && dy === 0) {
      setControls((current) => ({
        ...current,
        globalOffset: { x: 0, y: 0 },
      }));
      return;
    }

    setControls((current) => ({
      ...current,
      globalOffset: {
        x: current.globalOffset.x + dx,
        y: current.globalOffset.y + dy,
      },
    }));
  };

  const resetControls = () => {
    setControls({
      ...DEFAULT_CONTROLS,
      globalOffset: { ...DEFAULT_CONTROLS.globalOffset },
      wireOffset: { ...DEFAULT_CONTROLS.wireOffset },
      debugTerminalOffset: { ...DEFAULT_CONTROLS.debugTerminalOffset },
      componentOffset: {
        source: { ...DEFAULT_COMPONENT_OFFSET.source },
        resistor: { ...DEFAULT_COMPONENT_OFFSET.resistor },
        zener: { ...DEFAULT_COMPONENT_OFFSET.zener },
        load: { ...DEFAULT_COMPONENT_OFFSET.load },
        labels: { ...DEFAULT_COMPONENT_OFFSET.labels },
      },
    });
  };

  return (
    <section className="w-full bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
              <div>
                <h1 className="text-base font-semibold text-slate-950">
                  Zener Diode Voltage Regulator
                </h1>
                <p className="mt-0.5 text-xs text-slate-500">
                  Responsive SVG · component library · structured wire nodes
                </p>
              </div>

              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] text-slate-600">
                viewBox 0 0 274 198
              </div>
            </div>

            <div className="flex min-h-[360px] items-center justify-center bg-white p-3 sm:p-6">
              <div
                className="w-full max-w-[760px]"
                style={{ transform: "translateZ(0)" }}
              >
                <ZenerRegulatorSvg controls={controls} />
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-sm font-semibold text-slate-950">
                Interactive control panel
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Tune scale, wire geometry and every component offset.
              </p>
            </div>

            <button
              type="button"
              onClick={resetControls}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <ControlSection title="Global scale and wire styling" open>
              <RangeControl
                label="CIRCUIT_CANVAS_SCALE"
                value={controls.canvasScale}
                min={0.65}
                max={1.35}
                step={0.01}
                onChange={(value) => updateScalar("canvasScale", value)}
              />
              <RangeControl
                label="CIRCUIT_COMPONENT_SCALE"
                value={controls.componentScale}
                min={0.7}
                max={1.35}
                step={0.01}
                onChange={(value) => updateScalar("componentScale", value)}
              />
              <RangeControl
                label="CIRCUIT_WIRE_SCALE"
                value={controls.wireScale}
                min={0.75}
                max={1.25}
                step={0.01}
                onChange={(value) => updateScalar("wireScale", value)}
              />
              <RangeControl
                label="BASE_WIRE_WIDTH"
                value={controls.wireWidth}
                min={0.8}
                max={4}
                step={0.1}
                onChange={(value) => updateScalar("wireWidth", value)}
              />
            </ControlSection>

            <ControlSection title="Canvas pan / global offset" open>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                <PanPad onNudge={nudgeCircuit} />
                <PointControls
                  title="Global circuit"
                  point={controls.globalOffset}
                  min={-40}
                  max={40}
                  onChange={(axis, value) =>
                    updatePoint("globalOffset", axis, value)
                  }
                />
              </div>
            </ControlSection>

            <ControlSection title="WIRE_OFFSET">
              <PointControls
                title="All wire segments"
                point={controls.wireOffset}
                min={-25}
                max={25}
                onChange={(axis, value) =>
                  updatePoint("wireOffset", axis, value)
                }
              />
            </ControlSection>

            <ControlSection title="COMPONENT_OFFSET">
              <PointControls
                title="Voltage source"
                point={controls.componentOffset.source}
                onChange={(axis, value) =>
                  updateComponentPoint("source", axis, value)
                }
              />
              <PointControls
                title="Resistor"
                point={controls.componentOffset.resistor}
                onChange={(axis, value) =>
                  updateComponentPoint("resistor", axis, value)
                }
              />
              <PointControls
                title="Zener diode"
                point={controls.componentOffset.zener}
                onChange={(axis, value) =>
                  updateComponentPoint("zener", axis, value)
                }
              />
              <PointControls
                title="Load"
                point={controls.componentOffset.load}
                onChange={(axis, value) =>
                  updateComponentPoint("load", axis, value)
                }
              />
              <PointControls
                title="All labels"
                point={controls.componentOffset.labels}
                onChange={(axis, value) =>
                  updateComponentPoint("labels", axis, value)
                }
              />
            </ControlSection>

            <ControlSection title="Debug terminals and grid">
              <ToggleControl
                label="Show debug terminal dots"
                checked={controls.showDebugTerminals}
                onChange={(checked) =>
                  setControls((current) => ({
                    ...current,
                    showDebugTerminals: checked,
                  }))
                }
              />
              <ToggleControl
                label="Show engineering grid"
                checked={controls.showGrid}
                onChange={(checked) =>
                  setControls((current) => ({
                    ...current,
                    showGrid: checked,
                  }))
                }
              />
              <PointControls
                title="DEBUG_TERMINAL_OFFSET"
                point={controls.debugTerminalOffset}
                min={-12}
                max={12}
                step={0.5}
                onChange={(axis, value) =>
                  updatePoint("debugTerminalOffset", axis, value)
                }
              />
            </ControlSection>
          </div>
        </aside>
      </div>
    </section>
  );
}
