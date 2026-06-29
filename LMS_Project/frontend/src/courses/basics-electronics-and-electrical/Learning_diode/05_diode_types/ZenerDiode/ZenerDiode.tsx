"use client";

type CircuitProps = {
  className?: string;
  showDebug?: boolean;
};

type Offset = {
  x: number;
  y: number;
};

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const BASE_WIRE_WIDTH = 6;

const COMPONENT_OFFSET = { x: 0, y: 0 } as const satisfies Offset;
const WIRE_OFFSET = { x: 0, y: 0 } as const satisfies Offset;
const DEBUG_TERMINAL_OFFSET = { x: 0, y: 0 } as const satisfies Offset;

const DEBUG = false;

const WIRE = {
  stroke: "#111111",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  cap: "round" as const,
  join: "round" as const,
};

function WireSegment({
  d,
  stroke = WIRE.stroke,
  width = WIRE.width,
  opacity = 1,
}: {
  d: string;
  stroke?: string;
  width?: number;
  opacity?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap={WIRE.cap}
      strokeLinejoin={WIRE.join}
      opacity={opacity}
    />
  );
}

function DebugTerminalDot({
  x,
  y,
  label,
}: {
  x: number;
  y: number;
  label: string;
}) {
  return (
    <g transform={`translate(${DEBUG_TERMINAL_OFFSET.x},${DEBUG_TERMINAL_OFFSET.y})`}>
      <circle cx={x} cy={y} r={5} fill="#ef4444" />
      <text x={x + 8} y={y - 8} fontSize={10} fill="#ef4444" fontFamily="Arial">
        {label}
      </text>
    </g>
  );
}

const SYMBOL_VIEW_BOX = {
  x: 0,
  y: 0,
  w: 420,
  h: 150,
};

const SYMBOL_BASE_COMPONENT = {
  centerY: 76 + COMPONENT_OFFSET.y,
  triangleLeft: 128 + COMPONENT_OFFSET.x,
  triangleTop: 34 + COMPONENT_OFFSET.y,
  triangleBottom: 118 + COMPONENT_OFFSET.y,
  triangleTip: 218 + COMPONENT_OFFSET.x,
  cathodeX: 234 + COMPONENT_OFFSET.x,
  cathodeTop: 30 + COMPONENT_OFFSET.y,
  cathodeBottom: 122 + COMPONENT_OFFSET.y,
};

const SYMBOL_COMPONENT = {
  triangle: `
    M ${SYMBOL_BASE_COMPONENT.triangleLeft} ${SYMBOL_BASE_COMPONENT.triangleTop}
    L ${SYMBOL_BASE_COMPONENT.triangleTip} ${SYMBOL_BASE_COMPONENT.centerY}
    L ${SYMBOL_BASE_COMPONENT.triangleLeft} ${SYMBOL_BASE_COMPONENT.triangleBottom}
    Z
  `,
  cathodeBar: `M ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeTop} L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeBottom}`,
  topKink: `M ${SYMBOL_BASE_COMPONENT.cathodeX - 18} ${SYMBOL_BASE_COMPONENT.cathodeTop + 10} L ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeTop}`,
  bottomKink: `M ${SYMBOL_BASE_COMPONENT.cathodeX} ${SYMBOL_BASE_COMPONENT.cathodeBottom} L ${SYMBOL_BASE_COMPONENT.cathodeX + 18} ${SYMBOL_BASE_COMPONENT.cathodeBottom - 10}`,
};

const SYMBOL_NODE = {
  anode: { x: 48 + WIRE_OFFSET.x, y: 76 + WIRE_OFFSET.y },
  anodeJoin: { x: 128 + WIRE_OFFSET.x, y: 76 + WIRE_OFFSET.y },
  cathodeJoin: { x: 234 + WIRE_OFFSET.x, y: 76 + WIRE_OFFSET.y },
  cathode: { x: 372 + WIRE_OFFSET.x, y: 76 + WIRE_OFFSET.y },
};

const SYMBOL_PATH = {
  anodeWire: `M ${SYMBOL_NODE.anode.x} ${SYMBOL_NODE.anode.y} L ${SYMBOL_NODE.anodeJoin.x} ${SYMBOL_NODE.anodeJoin.y}`,
  cathodeWire: `M ${SYMBOL_NODE.cathodeJoin.x} ${SYMBOL_NODE.cathodeJoin.y} L ${SYMBOL_NODE.cathode.x} ${SYMBOL_NODE.cathode.y}`,
};

const SYMBOL_LABEL = {
  anode: { text: "Anode (+)", x: 56, y: 32 },
  cathode: { text: "Cathode (-)", x: 298, y: 32 },
};

function ZenerSymbolBody() {
  return (
    <g fill="none" stroke="#111111" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <path d={SYMBOL_COMPONENT.triangle} fill="#111111" />
      <path d={SYMBOL_COMPONENT.cathodeBar} />
      <path d={SYMBOL_COMPONENT.topKink} />
      <path d={SYMBOL_COMPONENT.bottomKink} />
    </g>
  );
}

function SymbolLabels() {
  return (
    <g fontSize={18} fontFamily="Arial" fontWeight={700} fill="#111111">
      <text x={SYMBOL_LABEL.anode.x} y={SYMBOL_LABEL.anode.y}>
        {SYMBOL_LABEL.anode.text}
      </text>
      <text x={SYMBOL_LABEL.cathode.x} y={SYMBOL_LABEL.cathode.y}>
        {SYMBOL_LABEL.cathode.text}
      </text>
    </g>
  );
}

export function ZenerDiodeSymbol({
  className = "",
  showDebug = DEBUG,
}: CircuitProps) {
  return (
    <div
      className={`inline-flex w-full items-center justify-center bg-white ${className}`}
      style={{ transform: `scale(${CIRCUIT_CANVAS_SCALE})`, transformOrigin: "center" }}
    >
      <svg viewBox={`0 0 ${SYMBOL_VIEW_BOX.w} ${SYMBOL_VIEW_BOX.h}`} className="h-auto w-full max-w-[420px]">
        <WireSegment d={SYMBOL_PATH.anodeWire} />
        <WireSegment d={SYMBOL_PATH.cathodeWire} />
        <ZenerSymbolBody />
        <SymbolLabels />

        {showDebug && (
          <>
            <DebugTerminalDot x={SYMBOL_NODE.anode.x} y={SYMBOL_NODE.anode.y} label="A" />
            <DebugTerminalDot x={SYMBOL_NODE.anodeJoin.x} y={SYMBOL_NODE.anodeJoin.y} label="AJ" />
            <DebugTerminalDot x={SYMBOL_NODE.cathodeJoin.x} y={SYMBOL_NODE.cathodeJoin.y} label="CJ" />
            <DebugTerminalDot x={SYMBOL_NODE.cathode.x} y={SYMBOL_NODE.cathode.y} label="K" />
          </>
        )}
      </svg>
    </div>
  );
}

const PHYSICAL_VIEW_BOX = {
  x: 0,
  y: 0,
  w: 420,
  h: 170,
};

const PHYSICAL_BASE_COMPONENT = {
  bodyX: 130 + COMPONENT_OFFSET.x,
  bodyY: 54 + COMPONENT_OFFSET.y,
  bodyW: 154,
  bodyH: 48,
  radius: 24,
};

const PHYSICAL_COMPONENT = {
  body: {
    x: PHYSICAL_BASE_COMPONENT.bodyX,
    y: PHYSICAL_BASE_COMPONENT.bodyY,
    w: PHYSICAL_BASE_COMPONENT.bodyW,
    h: PHYSICAL_BASE_COMPONENT.bodyH,
  },
  band: {
    x: PHYSICAL_BASE_COMPONENT.bodyX + 102,
    y: PHYSICAL_BASE_COMPONENT.bodyY,
    w: 12,
    h: PHYSICAL_BASE_COMPONENT.bodyH,
  },
  shine: {
    x: PHYSICAL_BASE_COMPONENT.bodyX + 114,
    y: PHYSICAL_BASE_COMPONENT.bodyY,
    w: 5,
    h: PHYSICAL_BASE_COMPONENT.bodyH,
  },
};

const PHYSICAL_NODE = {
  anode: { x: 52 + WIRE_OFFSET.x, y: 78 + WIRE_OFFSET.y },
  leftJoin: { x: 130 + WIRE_OFFSET.x, y: 78 + WIRE_OFFSET.y },
  rightJoin: { x: 284 + WIRE_OFFSET.x, y: 78 + WIRE_OFFSET.y },
  cathode: { x: 366 + WIRE_OFFSET.x, y: 78 + WIRE_OFFSET.y },
};

const PHYSICAL_PATH = {
  leftWire: `M ${PHYSICAL_NODE.anode.x} ${PHYSICAL_NODE.anode.y} L ${PHYSICAL_NODE.leftJoin.x} ${PHYSICAL_NODE.leftJoin.y}`,
  rightWire: `M ${PHYSICAL_NODE.rightJoin.x} ${PHYSICAL_NODE.rightJoin.y} L ${PHYSICAL_NODE.cathode.x} ${PHYSICAL_NODE.cathode.y}`,
};

const PHYSICAL_LABEL = {
  title: { text: "Zener Diode Physical", x: 210, y: 144 },
};

function PhysicalBody() {
  return (
    <g>
      <defs>
        <linearGradient id="zener-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="38%" stopColor="#f43f5e" />
          <stop offset="72%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
      </defs>

      <rect
        x={PHYSICAL_COMPONENT.body.x}
        y={PHYSICAL_COMPONENT.body.y}
        width={PHYSICAL_COMPONENT.body.w}
        height={PHYSICAL_COMPONENT.body.h}
        rx={PHYSICAL_BASE_COMPONENT.radius}
        fill="url(#zener-body-gradient)"
      />
      <rect
        x={PHYSICAL_COMPONENT.band.x}
        y={PHYSICAL_COMPONENT.band.y}
        width={PHYSICAL_COMPONENT.band.w}
        height={PHYSICAL_COMPONENT.band.h}
        fill="#cbd5e1"
      />
      <rect
        x={PHYSICAL_COMPONENT.shine.x}
        y={PHYSICAL_COMPONENT.shine.y}
        width={PHYSICAL_COMPONENT.shine.w}
        height={PHYSICAL_COMPONENT.shine.h}
        fill="#f8fafc"
        opacity={0.9}
      />
    </g>
  );
}

export function ZenerDiodePhysicalComponent({
  className = "",
  showDebug = DEBUG,
}: CircuitProps) {
  return (
    <div
      className={`inline-flex w-full items-center justify-center bg-white ${className}`}
      style={{ transform: `scale(${CIRCUIT_CANVAS_SCALE})`, transformOrigin: "center" }}
    >
      <svg viewBox={`0 0 ${PHYSICAL_VIEW_BOX.w} ${PHYSICAL_VIEW_BOX.h}`} className="h-auto w-full max-w-[420px]">
        <WireSegment d={PHYSICAL_PATH.leftWire} stroke="#8f8f8f" />
        <WireSegment d={PHYSICAL_PATH.rightWire} stroke="#8f8f8f" />
        <PhysicalBody />
        <text x={210} y={80} textAnchor="middle" fontSize={16} fontWeight={700} fill="#ffffff">
          1N4733A
        </text>
        <text
          x={PHYSICAL_LABEL.title.x}
          y={PHYSICAL_LABEL.title.y}
          fontSize={14}
          fontFamily="Arial"
          fontWeight={700}
          textAnchor="middle"
          fill="#111111"
        >
          {PHYSICAL_LABEL.title.text}
        </text>

        {showDebug && (
          <>
            <DebugTerminalDot x={PHYSICAL_NODE.anode.x} y={PHYSICAL_NODE.anode.y} label="A" />
            <DebugTerminalDot x={PHYSICAL_NODE.leftJoin.x} y={PHYSICAL_NODE.leftJoin.y} label="L" />
            <DebugTerminalDot x={PHYSICAL_NODE.rightJoin.x} y={PHYSICAL_NODE.rightJoin.y} label="R" />
            <DebugTerminalDot x={PHYSICAL_NODE.cathode.x} y={PHYSICAL_NODE.cathode.y} label="K" />
          </>
        )}
      </svg>
    </div>
  );
}

export default function ZenerDiodeLibraryPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-6 bg-white p-4">
      <ZenerDiodeSymbol />
      <ZenerDiodePhysicalComponent />
    </div>
  );
}
