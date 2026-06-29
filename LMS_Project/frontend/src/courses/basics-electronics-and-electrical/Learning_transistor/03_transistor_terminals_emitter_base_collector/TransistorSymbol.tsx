import CurrentDots from "./CurrentDots";
import type { SelectedTerminal, TransistorType } from "./types";

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 7;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 436,
  height: 485,
};

const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

/* =========================================================
   BASE STYLES
========================================================= */

const BASE_COMPONENT = {
  stroke: "#7A0000",
  strokeWidth: BASE_WIRE_WIDTH * SCALE.wire,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const COMPONENT = {
  background: "#FFFFFF",
  symbol: "#7A0000",
  typeText: "#A8A8A8",
  selectedStrokeWidth: 9,
};

const NODE = {
  emitter: "#dc2626",
  base: "#2563eb",
  collector: "#16a34a",
};

const WIRE = {
  normal: COMPONENT.symbol,
  emitter: NODE.emitter,
  base: NODE.base,
  collector: NODE.collector,
};

const PATH = {
  // visual path direction: junction/base bar → terminal
  baseLead: "M126 243 H28",
  collectorLead: "M150 200 L246 135 V76",
  emitterLead: "M150 270 L238 318 V410",
};

const LABEL = {
  fontFamily: "Arial",
  terminalSize: 72,
  typeSize: 84,
  directionSize: 18,
  weight: 900,
};

/* =========================================================
   TYPES
========================================================= */

type TransistorSymbolProps = {
  type: TransistorType;
  selected: SelectedTerminal;
  signal: number;
  variant?: "default" | "showcase";
};

type FlowMode = "electron" | "conventional";

type TerminalStyle = {
  color: string;
  normalPath: string;
  electronReverse: boolean;
  conventionalReverse: boolean;
};

/* =========================================================
   TERMINAL CONSTANTS
========================================================= */

const TERMINAL_COLOR: Record<SelectedTerminal, string> = {
  Emitter: WIRE.emitter,
  Base: WIRE.base,
  Collector: WIRE.collector,
};

const LABEL_POSITIONS: Record<
  SelectedTerminal,
  { x: number; y: number; text: string }
> = {
  Base: { x: 0, y: 257, text: "B" },
  Collector: { x: 228, y: 62, text: "C" },
  Emitter: { x: 226, y: 472, text: "E" },
};

const ARROW_POINTS: Record<TransistorType, string> = {
  NPN: "208,284 244,320 212,333",
  PNP: "228,333 192,297 224,284",
};

/* =========================================================
   CURRENT FLOW DIRECTION METHOD
   Default mode = conventional current
========================================================= */

function getFlowMap(
  type: TransistorType,
): Record<SelectedTerminal, TerminalStyle> {
  const isNPN = type === "NPN";

  return {
    Collector: {
      color: WIRE.collector,
      normalPath: PATH.collectorLead,

      // PATH: junction → collector
      // Conventional NPN: collector → junction, so reverse = true
      // Conventional PNP: junction → collector, so reverse = false
      conventionalReverse: isNPN,
      electronReverse: !isNPN,
    },

    Emitter: {
      color: WIRE.emitter,
      normalPath: PATH.emitterLead,

      // PATH: junction → emitter
      // Conventional NPN: junction → emitter, so reverse = false
      // Conventional PNP: emitter → junction, so reverse = true
      conventionalReverse: !isNPN,
      electronReverse: isNPN,
    },

    Base: {
      color: WIRE.base,
      normalPath: PATH.baseLead,

      // PATH: junction → base terminal
      // Conventional NPN: base → junction, so reverse = true
      // Conventional PNP: junction → base, so reverse = false
      conventionalReverse: isNPN,
      electronReverse: !isNPN,
    },
  };
}

function getCurrentFlowDirection(
  type: TransistorType,
  terminal: SelectedTerminal,
  mode: FlowMode = "conventional",
) {
  const flowMap = getFlowMap(type)[terminal];

  return {
    path: flowMap.normalPath,
    color: flowMap.color,
    reverse:
      mode === "conventional"
        ? flowMap.conventionalReverse
        : flowMap.electronReverse,
  };
}

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function SvgSoftGlowFilter() {
  return (
    <defs>
      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function SvgBaseLead({ selected }: { selected: boolean }) {
  return (
    <path
      d={PATH.baseLead}
      stroke={selected ? WIRE.base : WIRE.normal}
      strokeWidth={
        selected ? COMPONENT.selectedStrokeWidth : BASE_COMPONENT.strokeWidth
      }
      strokeLinecap={BASE_COMPONENT.strokeLinecap}
      strokeLinejoin={BASE_COMPONENT.strokeLinejoin}
      filter={selected ? "url(#softGlow)" : undefined}
    />
  );
}

function SvgBaseBar({ selected }: { selected: boolean }) {
  return (
    <rect
      x="126"
      y="153"
      width="24"
      height="180"
      rx="3"
      fill={selected ? WIRE.base : WIRE.normal}
      filter={selected ? "url(#softGlow)" : undefined}
    />
  );
}

function SvgTerminalPath({
  terminal,
  selected,
}: {
  terminal: SelectedTerminal;
  selected: boolean;
}) {
  const path =
    terminal === "Collector"
      ? PATH.collectorLead
      : terminal === "Emitter"
        ? PATH.emitterLead
        : PATH.baseLead;

  return (
    <path
      d={path}
      stroke={selected ? TERMINAL_COLOR[terminal] : WIRE.normal}
      strokeWidth={
        selected ? COMPONENT.selectedStrokeWidth : BASE_COMPONENT.strokeWidth
      }
      strokeLinecap={BASE_COMPONENT.strokeLinecap}
      strokeLinejoin={BASE_COMPONENT.strokeLinejoin}
      filter={selected ? "url(#softGlow)" : undefined}
    />
  );
}

function SvgEmitterArrow({
  type,
  selected,
}: {
  type: TransistorType;
  selected: boolean;
}) {
  const color = selected ? WIRE.emitter : WIRE.normal;

  return (
    <polygon
      points={ARROW_POINTS[type]}
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      filter={selected ? "url(#softGlow)" : undefined}
    />
  );
}

function SvgTerminalLabel({
  terminal,
  active,
}: {
  terminal: SelectedTerminal;
  active: boolean;
}) {
  const label = LABEL_POSITIONS[terminal];

  return (
    <text
      x={label.x}
      y={label.y}
      fontFamily={LABEL.fontFamily}
      fontSize={LABEL.terminalSize}
      fontWeight={LABEL.weight}
      fill={active ? TERMINAL_COLOR[terminal] : "#000000"}
    >
      {label.text}
    </text>
  );
}

function SvgTypeLabel({ type }: { type: TransistorType }) {
  return (
    <>
      <text
        x="255"
        y="270"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.typeSize}
        fontWeight={LABEL.weight}
        fill={COMPONENT.typeText}
      >
        {type}
      </text>

      <text
        x="255"
        y="305"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.directionSize}
        fontWeight="700"
        fill="#64748b"
      >
        Conventional Current
      </text>

      <text
        x="255"
        y="330"
        fontFamily={LABEL.fontFamily}
        fontSize={LABEL.directionSize}
        fontWeight="700"
        fill="#64748b"
      >
        {type === "NPN" ? "C → E, B → E" : "E → C, E → B"}
      </text>
    </>
  );
}

function SvgCurrentFlow({
  type,
  terminal,
  active,
}: {
  type: TransistorType;
  terminal: SelectedTerminal;
  active: boolean;
}) {
  const flow = getCurrentFlowDirection(type, terminal, "conventional");

  return (
    <CurrentDots
      path={flow.path}
      active={active}
      color={flow.color}
      reverse={flow.reverse}
    />
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TransistorSymbol({
  type,
  selected,
  signal,
  variant = "default",
}: TransistorSymbolProps) {
  const selectedColor = TERMINAL_COLOR[selected];
  const flowActive = signal > 0;
  const showcase = variant === "showcase";

  const isSelected = (terminal: SelectedTerminal) => selected === terminal;

  return (
    <div
      className={
        showcase
          ? "rounded-[1.75rem] bg-white p-1"
          : "rounded-3xl border border-slate-200 bg-white p-4 shadow-xl"
      }
    >
      {showcase ? null : (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {type} Terminal Diagram
            </h2>
            <p className="text-sm text-slate-600">
              Interactive symbol for identifying Emitter, Base, and Collector.
              Conventional current: NPN = C to E, PNP = E to C.
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700">
            Selected: <span style={{ color: selectedColor }}>{selected}</span>
          </div>
        </div>
      )}

      <div
        className={
          showcase
            ? "overflow-hidden rounded-[1.75rem] bg-white p-0"
            : "overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-inner"
        }
      >
        <svg
          width={VIEW_BOX.width * SCALE.canvas}
          height={VIEW_BOX.height * SCALE.canvas}
          viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`mx-auto h-auto w-full ${showcase ? "max-w-[540px]" : "max-w-[436px]"}`}
        >
          <rect
            width={VIEW_BOX.width}
            height={VIEW_BOX.height}
            fill={COMPONENT.background}
          />

          <SvgSoftGlowFilter />

          <SvgBaseLead selected={isSelected("Base")} />
          <SvgBaseBar selected={isSelected("Base")} />

          <SvgTerminalPath
            terminal="Collector"
            selected={isSelected("Collector")}
          />

          <SvgTerminalPath
            terminal="Emitter"
            selected={isSelected("Emitter")}
          />

          <SvgEmitterArrow type={type} selected={isSelected("Emitter")} />

          <SvgTerminalLabel terminal="Base" active={isSelected("Base")} />
          <SvgTerminalLabel
            terminal="Collector"
            active={isSelected("Collector")}
          />
          <SvgTerminalLabel terminal="Emitter" active={isSelected("Emitter")} />

          <SvgTypeLabel type={type} />

          <SvgCurrentFlow
            type={type}
            terminal="Collector"
            active={flowActive && selected === "Collector"}
          />

          <SvgCurrentFlow
            type={type}
            terminal="Emitter"
            active={flowActive && selected === "Emitter"}
          />

          <SvgCurrentFlow
            type={type}
            terminal="Base"
            active={flowActive && selected === "Base"}
          />
        </svg>
      </div>
    </div>
  );
}
