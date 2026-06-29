"use client";

import { useEffect, useMemo, useState } from "react";

/* =========================
   TYPES / INTERFACES
========================= */
type Point = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type TransformControl = Point &
  Size & {
    scale: number;
    rotation: number;
  };

type WireSegment = {
  id: string;
  from: Point;
  to: Point;
  stroke?: string;
  width?: number;
  dash?: string;
  opacity?: number;
};

type ACPowerRelaySketchProps = {
  title?: string;
  initialPowered?: boolean;
  autoStart?: boolean;
  simulationSpeed?: number;
  showControls?: boolean;
  showTimeline?: boolean;
  showCurrentDots?: boolean;
  showDebugTerminals?: boolean;
  className?: string;
};

type CurrentDotsProps = {
  path: string;
  active: boolean;
  show: boolean;
  speed: number;
  count?: number;
  radius?: number;
  color?: string;
  opacity?: number;
};

type WireLineProps = {
  segment: WireSegment;
  stroke?: string;
  width?: number;
  opacity?: number;
};

type TerminalCircleProps = {
  point: Point;
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
};

/* =========================
   REQUIRED GLOBAL TUNING CONTROLS
========================= */
export const CIRCUIT_COMPONENT_SCALE = 1;
export const BASE_WIRE_WIDTH = 2.4;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const COMPONENT_OFFSET: Point = {
  x: 0,
  y: 0,
};

export const WIRE_OFFSET: Point = {
  x: 0,
  y: 0,
};

export const DEBUG_TERMINAL_OFFSET: Point = {
  x: 0,
  y: 0,
};

/* =========================
   HELPER FUNCTIONS
========================= */
function offsetPoint(point: Point, offset: Point): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function buildSvgPath(points: Point[]): string {
  return points
    .map((point, index) => {
      const p = offsetPoint(point, WIRE_OFFSET);
      return `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    })
    .join(" ");
}

function componentTransform(control: TransformControl): string {
  return [
    `translate(${COMPONENT_OFFSET.x} ${COMPONENT_OFFSET.y})`,
    `translate(${control.x} ${control.y})`,
    `rotate(${control.rotation})`,
    `scale(${control.scale})`,
    `translate(${-control.x} ${-control.y})`,
  ].join(" ");
}

/* =========================
   VIEW BOX
========================= */
export const VIEW_BOX = {
  minX: 0,
  minY: 0,
  width: 1000,
  height: 1040,
};

/* =========================
   SCALE
========================= */
export const SCALE = {
  stroke: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  thinStroke: 1.4 * CIRCUIT_WIRE_SCALE,
  boldStroke: 4 * CIRCUIT_WIRE_SCALE,
  activeWire: 4.5 * CIRCUIT_WIRE_SCALE,
  currentDot: 4.5,
  terminalRadius: 10,
  debugDotRadius: 4,
};

/* =========================
   STYLES
========================= */
export const STYLES = {
  font: "Arial, Helvetica, sans-serif",

  stroke: "#111111",
  softStroke: "#343434",
  muted: "#9ca3af",

  caseFill: "#f8f8f4",
  caseSideFill: "#ecece6",
  baseFill: "#2c2c2c",
  metalFill: "#e9e9e2",

  active: "#f59e0b",
  inputActive: "#2563eb",
  outputActive: "#16a34a",
  debug: "#ef4444",
};

/* =========================
   BASE_COMPONENT
========================= */
export const BASE_COMPONENT = {
  relayBody: {
    x: 180,
    y: 95,
    width: 650,
    height: 650,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  relayBase: {
    x: 185,
    y: 715,
    width: 640,
    height: 70,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  printedText: {
    x: 285,
    y: 300,
    width: 220,
    height: 390,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  schematic: {
    x: 515,
    y: 280,
    width: 300,
    height: 330,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  statusTag: {
    x: 500,
    y: 612,
    width: 255,
    height: 34,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  terminalPins: {
    x: 230,
    y: 760,
    width: 536,
    height: 185,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },
};

/* =========================
   COMPONENT
   Every major part has x/y/width/height/scale/rotation
========================= */
export const COMPONENT = {
  relayTopCap: {
    x: 170,
    y: 80,
    width: 660,
    height: 65,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  relayBody: BASE_COMPONENT.relayBody,
  relayBase: BASE_COMPONENT.relayBase,
  printedText: BASE_COMPONENT.printedText,
  schematic: BASE_COMPONENT.schematic,
  statusTag: BASE_COMPONENT.statusTag,
  terminalPins: BASE_COMPONENT.terminalPins,

  coil: {
    x: BASE_COMPONENT.schematic.x + 20,
    y: BASE_COMPONENT.schematic.y + 75,
    width: 32,
    height: 95,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  spdtSwitch: {
    x: BASE_COMPONENT.schematic.x + 120,
    y: BASE_COMPONENT.schematic.y + 80,
    width: 140,
    height: 120,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  leftBladePin: {
    x: 230,
    y: 760,
    width: 76,
    height: 170,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  slimPinOne: {
    x: 395,
    y: 765,
    width: 22,
    height: 180,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  slimPinTwo: {
    x: 505,
    y: 765,
    width: 22,
    height: 180,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  slimPinThree: {
    x: 615,
    y: 765,
    width: 22,
    height: 180,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },

  rightBladePin: {
    x: 690,
    y: 760,
    width: 76,
    height: 170,
    scale: CIRCUIT_COMPONENT_SCALE,
    rotation: 0,
  },
};

/* =========================
   NODE
   Main terminal and connection coordinates
========================= */
export const NODE = {
  A1: {
    x: BASE_COMPONENT.schematic.x + 36,
    y: BASE_COMPONENT.schematic.y + 14,
  },

  A2: {
    x: BASE_COMPONENT.schematic.x + 36,
    y: BASE_COMPONENT.schematic.y + 230,
  },

  COIL_TOP: {
    x: BASE_COMPONENT.schematic.x + 36,
    y: BASE_COMPONENT.schematic.y + 75,
  },

  COIL_BOTTOM: {
    x: BASE_COMPONENT.schematic.x + 36,
    y: BASE_COMPONENT.schematic.y + 170,
  },

  MECH_LINK_START: {
    x: BASE_COMPONENT.schematic.x + 55,
    y: BASE_COMPONENT.schematic.y + 120,
  },

  MECH_LINK_END: {
    x: BASE_COMPONENT.schematic.x + 112,
    y: BASE_COMPONENT.schematic.y + 120,
  },

  COM_11: {
    x: BASE_COMPONENT.schematic.x + 142,
    y: BASE_COMPONENT.schematic.y + 14,
  },

  COM_VERTICAL_BOTTOM: {
    x: BASE_COMPONENT.schematic.x + 142,
    y: BASE_COMPONENT.schematic.y + 102,
  },

  COM_LINE_START: {
    x: BASE_COMPONENT.schematic.x + 122,
    y: BASE_COMPONENT.schematic.y + 128,
  },

  COM_POINT: {
    x: BASE_COMPONENT.schematic.x + 142,
    y: BASE_COMPONENT.schematic.y + 128,
  },

  NO_14: {
    x: BASE_COMPONENT.schematic.x + 205,
    y: BASE_COMPONENT.schematic.y + 96,
  },

  NC_12: {
    x: BASE_COMPONENT.schematic.x + 205,
    y: BASE_COMPONENT.schematic.y + 170,
  },

  NO_STUB_END: {
    x: BASE_COMPONENT.schematic.x + 230,
    y: BASE_COMPONENT.schematic.y + 96,
  },

  NC_STUB_END: {
    x: BASE_COMPONENT.schematic.x + 230,
    y: BASE_COMPONENT.schematic.y + 170,
  },
};

/* =========================
   WIRE
   Structured wire segments, fully adjustable by WIRE_OFFSET
========================= */
export const WIRE = {
  coilA1ToBody: {
    id: "coil-a1-to-body",
    from: {
      x: NODE.A1.x,
      y: NODE.A1.y + SCALE.terminalRadius,
    },
    to: NODE.COIL_TOP,
  },

  coilBodyToA2: {
    id: "coil-body-to-a2",
    from: NODE.COIL_BOTTOM,
    to: {
      x: NODE.A2.x,
      y: NODE.A2.y - SCALE.terminalRadius,
    },
  },

  mechanicalLink: {
    id: "mechanical-link",
    from: NODE.MECH_LINK_START,
    to: NODE.MECH_LINK_END,
    dash: "8 9",
  },

  com11Vertical: {
    id: "com-11-vertical",
    from: {
      x: NODE.COM_11.x,
      y: NODE.COM_11.y + SCALE.terminalRadius,
    },
    to: NODE.COM_VERTICAL_BOTTOM,
  },

  com11ToCommonStart: {
    id: "com-11-to-common-start",
    from: NODE.COM_VERTICAL_BOTTOM,
    to: NODE.COM_LINE_START,
  },

  commonStartToCommonPoint: {
    id: "common-start-to-common-point",
    from: NODE.COM_LINE_START,
    to: NODE.COM_POINT,
  },

  no14Stub: {
    id: "no-14-stub",
    from: {
      x: NODE.NO_14.x + SCALE.terminalRadius,
      y: NODE.NO_14.y,
    },
    to: NODE.NO_STUB_END,
  },

  nc12Stub: {
    id: "nc-12-stub",
    from: {
      x: NODE.NC_12.x + SCALE.terminalRadius,
      y: NODE.NC_12.y,
    },
    to: NODE.NC_STUB_END,
  },
} satisfies Record<string, WireSegment>;

/* =========================
   PATH
   Current flow paths
========================= */
export const PATH = {
  coilCurrent: buildSvgPath([
    NODE.A1,
    NODE.COIL_TOP,
    NODE.COIL_BOTTOM,
    NODE.A2,
  ]),

  contactPowerOn: buildSvgPath([
    NODE.COM_11,
    NODE.COM_VERTICAL_BOTTOM,
    NODE.COM_LINE_START,
    NODE.COM_POINT,
    NODE.NO_14,
    NODE.NO_STUB_END,
  ]),

  contactPowerOff: buildSvgPath([
    NODE.COM_11,
    NODE.COM_VERTICAL_BOTTOM,
    NODE.COM_LINE_START,
    NODE.COM_POINT,
    NODE.NC_12,
    NODE.NC_STUB_END,
  ]),
};

/* =========================
   LABEL
========================= */
export const LABEL = {
  relay: {
    current: {
      x: 290,
      y: 375,
      value: "10A",
    },

    coilVoltage: {
      x: 290,
      y: 430,
      value: "AC 220V",
    },

    acRating: {
      x: 292,
      y: 505,
      value: "10A 250VAC",
    },

    dcRating: {
      x: 292,
      y: 548,
      value: "10A 30VDC",
    },

    madeIn: {
      x: 292,
      y: 682,
      value: "MADE IN CHINA",
    },
  },

  terminal: {
    A1: {
      x: NODE.A1.x - 14,
      y: NODE.A1.y - 34,
      value: "A1",
    },

    A2: {
      x: NODE.A2.x - 18,
      y: NODE.A2.y + 46,
      value: "A2",
    },

    COM11: {
      x: NODE.COM_11.x - 16,
      y: NODE.COM_11.y - 34,
      value: "11",
    },

    NO14: {
      x: NODE.NO_STUB_END.x + 10,
      y: NODE.NO_14.y + 10,
      value: "14",
    },

    NC12: {
      x: NODE.NC_STUB_END.x + 10,
      y: NODE.NC_12.y + 10,
      value: "12",
    },
  },
};

/* =========================
   TIMELINE STEPS
========================= */
const TIMELINE_STEPS = [
  "Relay coil energized",
  "Magnetic field created",
  "Internal armature moves",
  "Relay contact changes",
  "Relay is active",
];

/* =========================
   REUSABLE SVG: WIRE LINE
========================= */
function WireLine({ segment, stroke, width, opacity }: WireLineProps) {
  const from = offsetPoint(segment.from, WIRE_OFFSET);
  const to = offsetPoint(segment.to, WIRE_OFFSET);

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={stroke ?? segment.stroke ?? STYLES.stroke}
      strokeWidth={width ?? segment.width ?? SCALE.stroke}
      strokeDasharray={segment.dash}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity ?? segment.opacity ?? 1}
    />
  );
}

/* =========================
   REUSABLE SVG: TERMINAL CIRCLE
========================= */
function TerminalCircle({
  point,
  radius = SCALE.terminalRadius,
  stroke = STYLES.stroke,
  strokeWidth = SCALE.stroke,
  fill = "#f8f8f4",
}: TerminalCircleProps) {
  return (
    <circle
      cx={point.x}
      cy={point.y}
      r={radius}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

/* =========================
   REUSABLE SVG: CURRENT DOT FLOW
========================= */
function CurrentDots({
  path,
  active,
  show,
  speed,
  count = 4,
  radius = SCALE.currentDot,
  color = STYLES.outputActive,
  opacity = 0.95,
}: CurrentDotsProps) {
  if (!active || !show) return null;

  const safeSpeed = Math.max(0.3, speed);
  const duration = Math.max(0.7, 2.8 / safeSpeed);

  return (
    <g pointerEvents="none">
      {Array.from({ length: count }).map((_, index) => (
        <circle
          key={`${path}-${index}`}
          r={radius}
          fill={color}
          opacity={opacity}
        >
          <animateMotion
            dur={`${duration}s`}
            repeatCount="indefinite"
            begin={`${(-duration / count) * index}s`}
            path={path}
          />
        </circle>
      ))}
    </g>
  );
}

/* =========================
   REUSABLE SVG: DEBUG TERMINAL DOTS
========================= */
function DebugTerminalDots({ show }: { show: boolean }) {
  if (!show) return null;

  const debugNodes: Record<string, Point> = {
    A1: NODE.A1,
    A2: NODE.A2,
    COM11: NODE.COM_11,
    COMMON: NODE.COM_POINT,
    NO14: NODE.NO_14,
    NC12: NODE.NC_12,
  };

  return (
    <g pointerEvents="none">
      {Object.entries(debugNodes).map(([name, point]) => {
        const p = offsetPoint(point, DEBUG_TERMINAL_OFFSET);

        return (
          <g key={name}>
            <circle
              cx={p.x}
              cy={p.y}
              r={SCALE.debugDotRadius}
              fill={STYLES.debug}
              opacity={0.8}
            />

            <text
              x={p.x + 7}
              y={p.y - 7}
              fill={STYLES.debug}
              fontFamily={STYLES.font}
              fontSize={10}
              fontWeight={800}
            >
              {name}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* =========================
   REUSABLE SVG: LARGE TERMINAL PIN
========================= */
function LargeBladePin({ control }: { control: TransformControl }) {
  const x = control.x;

  return (
    <g transform={componentTransform(control)}>
      <path
        d={`M${x} 760 L${x + 76} 760 L${x + 70} 905 Q${x + 66} 930 ${
          x + 38
        } 930 Q${x + 10} 930 ${x + 5} 905 Z`}
        fill="url(#metalGradient)"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.stroke}
        strokeLinejoin="round"
      />

      <path
        d={`M${x + 12} 775 L${x + 63} 775 L${x + 58} 895 Q${x + 56} 912 ${
          x + 39
        } 915`}
        fill="none"
        stroke="#777"
        strokeWidth={1}
        opacity={0.45}
      />

      <circle
        cx={x + 38}
        cy={855}
        r={22}
        fill="#ffffff"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.stroke}
      />

      <circle
        cx={x + 38}
        cy={855}
        r={16}
        fill="none"
        stroke="#555"
        strokeWidth={1.2}
        opacity={0.45}
      />
    </g>
  );
}

/* =========================
   REUSABLE SVG: SLIM TERMINAL PIN
========================= */
function SlimPin({ control }: { control: TransformControl }) {
  const x = control.x;

  return (
    <g transform={componentTransform(control)}>
      <path
        d={`M${x} 765 L${x + 22} 765 L${x + 19} 930 Q${x + 18} 945 ${
          x + 11
        } 945 Q${x + 4} 945 ${x + 3} 930 Z`}
        fill="url(#metalGradient)"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.thinStroke}
        strokeLinejoin="round"
      />

      <ellipse
        cx={x + 11}
        cy={878}
        rx={4}
        ry={10}
        fill="none"
        stroke="#555"
        strokeWidth={1.2}
      />
    </g>
  );
}

/* =========================
   REUSABLE SVG: PRINTED TEXT BLOCK
========================= */
function RelayPrintedText() {
  return (
    <g
      transform={componentTransform(COMPONENT.printedText)}
      fill={STYLES.stroke}
      fontFamily={STYLES.font}
      fontWeight="700"
    >
      <text
        x={LABEL.relay.current.x}
        y={LABEL.relay.current.y}
        fontSize="60"
        fontWeight="800"
      >
        {LABEL.relay.current.value}
      </text>

      <text
        x={LABEL.relay.coilVoltage.x}
        y={LABEL.relay.coilVoltage.y}
        fontSize="38"
      >
        {LABEL.relay.coilVoltage.value}
      </text>

      <line
        x1="292"
        y1="458"
        x2="470"
        y2="458"
        stroke={STYLES.stroke}
        strokeWidth={4}
      />

      <text
        x={LABEL.relay.acRating.x}
        y={LABEL.relay.acRating.y}
        fontSize="30"
        fontWeight="500"
      >
        {LABEL.relay.acRating.value}
      </text>

      <text
        x={LABEL.relay.dcRating.x}
        y={LABEL.relay.dcRating.y}
        fontSize="30"
        fontWeight="500"
      >
        {LABEL.relay.dcRating.value}
      </text>

      <text x="292" y="640" fontSize="55" fontWeight="800">
        CE
      </text>

      <path
        d="M420 642 L456 585 L492 642 Z"
        fill="none"
        stroke={STYLES.stroke}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      <path
        d="M443 625 Q456 600 469 625"
        fill="none"
        stroke={STYLES.stroke}
        strokeWidth={3}
        strokeLinecap="round"
      />

      <text
        x={LABEL.relay.madeIn.x}
        y={LABEL.relay.madeIn.y}
        fontSize="22"
        fontWeight="600"
      >
        {LABEL.relay.madeIn.value}
      </text>
    </g>
  );
}

/* =========================
   REUSABLE SVG: RELAY BODY
========================= */
function RelayBody({ energized }: { energized: boolean }) {
  return (
    <g
      transform={componentTransform(COMPONENT.relayBody)}
      filter="url(#softShadow)"
    >
      <path
        d="M215 80 L785 80 Q815 80 830 110 L815 145 L185 145 L170 110 Q180 80 215 80 Z"
        fill="url(#caseGradient)"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.stroke}
        strokeLinejoin="round"
      />

      <path
        d="M205 96 L780 96 Q800 96 812 116 L805 132 L192 132 L182 115 Q190 96 205 96 Z"
        fill="none"
        stroke="#555"
        strokeWidth={1.2}
        opacity={0.55}
      />

      <path
        d="M185 125 Q185 105 210 105 L790 105 Q815 105 825 130 L825 700 Q825 728 800 735 L200 735 Q175 728 175 700 L175 130 Q178 125 185 125 Z"
        fill="url(#caseGradient)"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.boldStroke}
        strokeLinejoin="round"
      />

      {energized && (
        <rect
          x="530"
          y="322"
          width="92"
          height="178"
          rx="18"
          fill={STYLES.active}
          opacity="0.12"
          filter="url(#coilGlow)"
        />
      )}

      <path
        d="M195 150 L805 150 L805 700 L195 700 Z"
        fill="url(#sketchHatch)"
        opacity={0.85}
      />

      <path
        d="M175 128 L225 150 L225 705 L175 700 Z"
        fill="url(#sideGradient)"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.stroke}
        strokeLinejoin="round"
        opacity={0.92}
      />

      <path
        d="M805 150 L825 130 L825 700 L805 725 Z"
        fill="url(#sideGradient)"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.stroke}
        strokeLinejoin="round"
        opacity={0.9}
      />

      <rect
        x="215"
        y="150"
        width="590"
        height="555"
        fill="none"
        stroke="#555"
        strokeWidth={1.5}
        opacity={0.55}
      />

      <path
        d="M195 500 L215 510 L215 675 L195 665 Z"
        fill="#f7f7f2"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.thinStroke}
        strokeLinejoin="round"
      />

      <path
        d="M205 515 L220 522 L220 610 L205 603 Z"
        fill="none"
        stroke="#444"
        strokeWidth={1}
        opacity={0.6}
      />

      <path
        d="M792 610 L807 604 L807 690 L792 700 Z"
        fill="#f7f7f2"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.thinStroke}
        strokeLinejoin="round"
      />

      <path
        d="M430 105 L465 105 L462 122 L427 122 Z"
        fill="#f6f6f0"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.thinStroke}
      />

      <rect
        x="475"
        y="682"
        width="82"
        height="34"
        rx="4"
        fill="#1d1d1d"
        stroke={STYLES.stroke}
        strokeWidth={SCALE.stroke}
      />

      <rect
        x="485"
        y="690"
        width="62"
        height="17"
        fill="#555"
        stroke="#111"
        strokeWidth="1"
      />

      <path
        d="M185 715 L825 715 L825 785 L185 785 Z"
        fill={STYLES.baseFill}
        stroke={STYLES.stroke}
        strokeWidth={SCALE.boldStroke}
        strokeLinejoin="round"
      />

      <line x1="195" y1="732" x2="815" y2="732" stroke="#555" strokeWidth="1" />
      <line
        x1="195"
        y1="766"
        x2="815"
        y2="766"
        stroke="#111"
        strokeWidth="1.2"
      />
    </g>
  );
}

/* =========================
   REUSABLE SVG: RELAY TERMINAL PINS
========================= */
function RelayTerminalPins() {
  return (
    <g filter="url(#softShadow)">
      <LargeBladePin control={COMPONENT.leftBladePin} />
      <SlimPin control={COMPONENT.slimPinOne} />
      <SlimPin control={COMPONENT.slimPinTwo} />
      <SlimPin control={COMPONENT.slimPinThree} />
      <LargeBladePin control={COMPONENT.rightBladePin} />
    </g>
  );
}

/* =========================
   REUSABLE SVG: RELAY SCHEMATIC
========================= */
function RelaySchematic({
  energized,
  speed,
  showCurrentDots,
  showDebugTerminals,
}: {
  energized: boolean;
  speed: number;
  showCurrentDots: boolean;
  showDebugTerminals: boolean;
}) {
  const coilStroke = energized ? STYLES.active : STYLES.stroke;
  const coilFill = energized ? "#fff7db" : "#fbfbf8";
  const coilActiveStroke = energized ? STYLES.inputActive : STYLES.stroke;

  const commonStroke = STYLES.outputActive;
  const commonStrokeWidth = SCALE.activeWire;

  const noStroke = energized ? STYLES.outputActive : STYLES.stroke;
  const ncStroke = energized ? STYLES.muted : STYLES.outputActive;

  const activeContactPath = energized
    ? PATH.contactPowerOn
    : PATH.contactPowerOff;
  const movingArmEnd = energized ? NODE.NO_14 : NODE.NC_12;

  return (
    <g transform={componentTransform(COMPONENT.schematic)}>
      {/* Coil glow */}
      {energized && (
        <rect
          x={COMPONENT.coil.x - 15}
          y={COMPONENT.coil.y - 17}
          width={COMPONENT.coil.width + 30}
          height={COMPONENT.coil.height + 35}
          rx={12}
          fill={STYLES.active}
          opacity={0.12}
        />
      )}

      {/* A1 terminal and coil upper wire */}
      <text
        x={LABEL.terminal.A1.x}
        y={LABEL.terminal.A1.y}
        fill={coilActiveStroke}
        stroke="none"
        fontFamily={STYLES.font}
        fontSize={30}
        fontWeight={energized ? 800 : 500}
      >
        {LABEL.terminal.A1.value}
      </text>

      <TerminalCircle
        point={NODE.A1}
        stroke={coilActiveStroke}
        strokeWidth={energized ? SCALE.activeWire : SCALE.stroke}
      />

      <WireLine
        segment={WIRE.coilA1ToBody}
        stroke={coilActiveStroke}
        width={energized ? SCALE.activeWire : SCALE.stroke}
      />

      {/* Coil body */}
      <rect
        x={COMPONENT.coil.x}
        y={COMPONENT.coil.y}
        width={COMPONENT.coil.width}
        height={COMPONENT.coil.height}
        fill={coilFill}
        stroke={coilStroke}
        strokeWidth={energized ? SCALE.activeWire : SCALE.stroke}
      />

      <WireLine
        segment={WIRE.coilBodyToA2}
        stroke={coilActiveStroke}
        width={energized ? SCALE.activeWire : SCALE.stroke}
      />

      {/* A2 terminal */}
      <TerminalCircle
        point={NODE.A2}
        stroke={coilActiveStroke}
        strokeWidth={energized ? SCALE.activeWire : SCALE.stroke}
      />

      <text
        x={LABEL.terminal.A2.x}
        y={LABEL.terminal.A2.y}
        fill={coilActiveStroke}
        stroke="none"
        fontFamily={STYLES.font}
        fontSize={30}
        fontWeight={energized ? 800 : 500}
      >
        {LABEL.terminal.A2.value}
      </text>

      {/* Mechanical dotted link */}
      <WireLine
        segment={WIRE.mechanicalLink}
        stroke={energized ? STYLES.active : STYLES.stroke}
        width={energized ? SCALE.activeWire : SCALE.stroke}
      />

      {/* COM 11 label and terminal */}
      <text
        x={LABEL.terminal.COM11.x}
        y={LABEL.terminal.COM11.y}
        fill={commonStroke}
        stroke="none"
        fontFamily={STYLES.font}
        fontSize={30}
        fontWeight={800}
      >
        {LABEL.terminal.COM11.value}
      </text>

      <TerminalCircle
        point={NODE.COM_11}
        stroke={commonStroke}
        strokeWidth={commonStrokeWidth}
      />

      <WireLine
        segment={WIRE.com11Vertical}
        stroke={commonStroke}
        width={commonStrokeWidth}
      />
      <WireLine
        segment={WIRE.com11ToCommonStart}
        stroke={commonStroke}
        width={commonStrokeWidth}
      />
      <WireLine
        segment={WIRE.commonStartToCommonPoint}
        stroke={commonStroke}
        width={commonStrokeWidth}
      />

      <TerminalCircle
        point={NODE.COM_POINT}
        fill="#ffffff"
        stroke={commonStroke}
        strokeWidth={commonStrokeWidth}
      />

      {/* Moving contact arm */}
      <line
        x1={NODE.COM_POINT.x}
        y1={NODE.COM_POINT.y}
        x2={movingArmEnd.x}
        y2={movingArmEnd.y}
        stroke={STYLES.outputActive}
        strokeWidth={SCALE.activeWire}
        strokeLinecap="round"
        style={{
          transition: "all 450ms ease-in-out",
        }}
      />

      {/* NO 14 terminal */}
      <TerminalCircle
        point={NODE.NO_14}
        fill="#ffffff"
        stroke={noStroke}
        strokeWidth={energized ? SCALE.activeWire : SCALE.stroke}
      />

      <WireLine
        segment={WIRE.no14Stub}
        stroke={noStroke}
        width={energized ? SCALE.activeWire : SCALE.stroke}
      />

      <text
        x={LABEL.terminal.NO14.x}
        y={LABEL.terminal.NO14.y}
        fill={noStroke}
        stroke="none"
        fontFamily={STYLES.font}
        fontSize={30}
        fontWeight={energized ? 800 : 500}
      >
        {LABEL.terminal.NO14.value}
      </text>

      {/* NC 12 terminal */}
      <TerminalCircle
        point={NODE.NC_12}
        fill="#ffffff"
        stroke={ncStroke}
        strokeWidth={!energized ? SCALE.activeWire : SCALE.stroke}
      />

      <WireLine
        segment={WIRE.nc12Stub}
        stroke={ncStroke}
        width={!energized ? SCALE.activeWire : SCALE.stroke}
      />

      <text
        x={LABEL.terminal.NC12.x}
        y={LABEL.terminal.NC12.y}
        fill={ncStroke}
        stroke="none"
        fontFamily={STYLES.font}
        fontSize={30}
        fontWeight={!energized ? 800 : 500}
      >
        {LABEL.terminal.NC12.value}
      </text>

      {/* Current dot flow */}
      <CurrentDots
        path={PATH.coilCurrent}
        active={energized}
        show={showCurrentDots}
        speed={speed}
        count={4}
        radius={4.2}
        color={STYLES.inputActive}
        opacity={0.9}
      />

      <CurrentDots
        path={activeContactPath}
        active={showCurrentDots}
        show={showCurrentDots}
        speed={speed}
        count={5}
        radius={4.5}
        color={STYLES.outputActive}
        opacity={0.95}
      />

      {/* Debug terminal dots */}
      <DebugTerminalDots show={showDebugTerminals} />
    </g>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function ACPowerRelaySketch({
  title = "Interactive AC Electromagnetic Relay Coil 10A AC 220V 2D Sketch",
  initialPowered = false,
  autoStart = false,
  simulationSpeed = 1,
  showControls = true,
  showTimeline = true,
  showCurrentDots: showCurrentDotsProp = true,
  showDebugTerminals = false,
  className = "",
}: ACPowerRelaySketchProps) {
  const [isPowered, setIsPowered] = useState(initialPowered);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [simulationStep, setSimulationStep] = useState(initialPowered ? 1 : 0);
  const [timelineProgress, setTimelineProgress] = useState(
    initialPowered ? 20 : 0,
  );
  const [speed, setSpeed] = useState(simulationSpeed);
  const [showCurrentDots, setShowCurrentDots] = useState(showCurrentDotsProp);

  useEffect(() => {
    setIsPowered(initialPowered);
    setIsRunning(initialPowered ? autoStart : false);
    setSimulationStep(initialPowered ? 1 : 0);
    setTimelineProgress(initialPowered ? 20 : 0);
  }, [initialPowered, autoStart]);

  useEffect(() => {
    setSpeed(simulationSpeed);
  }, [simulationSpeed]);

  useEffect(() => {
    setShowCurrentDots(showCurrentDotsProp);
  }, [showCurrentDotsProp]);

  const energized = isPowered;

  const activeStepText =
    simulationStep > 0
      ? TIMELINE_STEPS[simulationStep - 1]
      : "Relay is OFF / rest position";

  const conditionTitle = energized
    ? "POWER ON CONDITION"
    : "POWER OFF CONDITION";
  const coilCondition = energized ? "Coil energized" : "Coil de-energized";
  const contactCondition = energized ? "11 → 14 closed" : "11 → 12 closed";
  const openContactCondition = energized ? "12 open" : "14 open";
  const selectedPathText = energized ? "COM 11 to NO 14" : "COM 11 to NC 12";

  const contactStatus = useMemo(() => {
    if (energized) return "Power ON: 11 connected to 14, 12 open";
    return "Power OFF: 11 connected to 12, 14 open";
  }, [energized]);

  const setPowerCondition = (powered: boolean) => {
    setIsPowered(powered);

    if (powered) {
      setSimulationStep(1);
      setTimelineProgress(20);
      return;
    }

    setIsRunning(false);
    setSimulationStep(0);
    setTimelineProgress(0);
  };

  const resetSimulation = () => {
    setIsPowered(initialPowered);
    setIsRunning(autoStart);
    setSimulationStep(initialPowered ? 1 : 0);
    setTimelineProgress(initialPowered ? 20 : 0);
    setSpeed(simulationSpeed);
    setShowCurrentDots(showCurrentDotsProp);
  };

  /* =========================
     AUTO SIMULATION TIMELINE
  ========================= */
  useEffect(() => {
    if (!isRunning || !isPowered) {
      if (!isPowered) {
        setSimulationStep(0);
        setTimelineProgress(0);
      }

      return;
    }

    const safeSpeed = Math.max(0.25, speed);
    const intervalMs = Math.max(450, 1100 / safeSpeed);

    const timer = window.setInterval(() => {
      setSimulationStep((previousStep) => {
        const nextStep =
          previousStep >= TIMELINE_STEPS.length ? 1 : previousStep + 1;
        setTimelineProgress((nextStep / TIMELINE_STEPS.length) * 100);
        return nextStep;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isRunning, isPowered, speed]);

  return (
    <div className={`w-full max-w-[760px] ${className}`}>
      {/* =========================
          SVG DRAWING
      ========================= */}
      <svg
        viewBox={`${VIEW_BOX.minX} ${VIEW_BOX.minY} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title}
        className="w-full h-auto"
      >
        <title>{title}</title>

        {/* =========================
            SVG DEFS
        ========================= */}
        <defs>
          <linearGradient id="caseGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f5f5ef" />
            <stop offset="100%" stopColor="#e9e9e2" />
          </linearGradient>

          <linearGradient id="sideGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ddddda" />
            <stop offset="50%" stopColor="#f7f7f2" />
            <stop offset="100%" stopColor="#e0e0dc" />
          </linearGradient>

          <linearGradient id="metalGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#deded8" />
            <stop offset="100%" stopColor="#bdbdb7" />
          </linearGradient>

          <pattern
            id="sketchHatch"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(18)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="12"
              stroke="#222"
              strokeWidth="0.7"
              opacity="0.08"
            />
          </pattern>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="8"
              floodColor="#000000"
              floodOpacity="0.13"
            />
          </filter>

          <filter id="coilGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`scale(${CIRCUIT_CANVAS_SCALE})`}>
          {/* Terminal pins */}
          <RelayTerminalPins />

          {/* Physical relay body */}
          <RelayBody energized={energized} />

          {/* Printed relay text */}
          <RelayPrintedText />

          {/* Internal relay schematic */}
          <RelaySchematic
            energized={energized}
            speed={speed}
            showCurrentDots={showCurrentDots}
            showDebugTerminals={showDebugTerminals}
          />

          {/* Status tag */}
          <g transform={componentTransform(COMPONENT.statusTag)}>
            <rect
              x={COMPONENT.statusTag.x}
              y={COMPONENT.statusTag.y}
              width={COMPONENT.statusTag.width}
              height={COMPONENT.statusTag.height}
              rx="8"
              fill={energized ? "#fff7db" : "#f5f5f5"}
              stroke={energized ? STYLES.active : STYLES.stroke}
              strokeWidth={1.5}
              opacity={0.95}
            />

            <text
              x={COMPONENT.statusTag.x + COMPONENT.statusTag.width / 2}
              y={COMPONENT.statusTag.y + 23}
              textAnchor="middle"
              fill={energized ? STYLES.active : STYLES.stroke}
              fontFamily={STYLES.font}
              fontSize={17}
              fontWeight={800}
            >
              {energized ? "ENERGIZED" : "REST POSITION"}
            </text>
          </g>

          {/* Extra hand-drawn sketch lines */}
          <g
            fill="none"
            stroke="#111"
            strokeWidth="1"
            opacity="0.25"
            strokeLinecap="round"
          >
            <path d="M240 175 C380 160 560 165 760 178" />
            <path d="M240 190 C410 178 585 184 760 195" />
            <path d="M250 705 C390 695 580 700 790 708" />
            <path d="M220 115 C330 105 500 108 760 113" />
            <path d="M205 150 C200 290 202 470 204 690" />
            <path d="M807 158 C810 305 810 530 805 705" />
          </g>
        </g>
      </svg>

      {/* =========================
          TIMELINE
      ========================= */}
      {showTimeline && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-neutral-900">
              {activeStepText}
            </p>

            <p className="text-xs font-medium text-neutral-500">
              Step {simulationStep || 0} / {TIMELINE_STEPS.length}
            </p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${timelineProgress}%` }}
            />
          </div>

          <div className="mt-3 grid gap-2 text-xs text-neutral-600 sm:grid-cols-5">
            {TIMELINE_STEPS.map((step, index) => {
              const active = simulationStep === index + 1;
              const completed = simulationStep > index + 1;

              return (
                <div
                  key={step}
                  className={[
                    "rounded-lg border px-2 py-2 text-center transition",
                    active
                      ? "border-amber-400 bg-amber-50 font-bold text-amber-700"
                      : completed
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-neutral-200 bg-neutral-50",
                  ].join(" ")}
                >
                  {step}
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-sm font-medium text-neutral-800">
            {contactStatus}
          </p>
        </div>
      )}

      {/* =========================
          CONTROL PANEL
      ========================= */}
      {showControls && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
          <div
            className={[
              "mb-4 rounded-xl border p-4 transition",
              energized
                ? "border-green-300 bg-green-50"
                : "border-neutral-300 bg-white",
            ].join(" ")}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className={[
                    "text-xs font-black uppercase tracking-wide",
                    energized ? "text-green-700" : "text-neutral-500",
                  ].join(" ")}
                >
                  {conditionTitle}
                </p>

                <h3 className="mt-1 text-lg font-black text-neutral-900">
                  {selectedPathText}
                </h3>

                <p className="mt-1 text-sm font-semibold text-neutral-700">
                  {coilCondition} · {contactCondition} · {openContactCondition}
                </p>
              </div>

              <span
                className={[
                  "inline-flex rounded-full px-4 py-2 text-sm font-black text-white",
                  energized ? "bg-green-600" : "bg-neutral-800",
                ].join(" ")}
              >
                {energized ? "POWER ON" : "POWER OFF"}
              </span>
            </div>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPowerCondition(false)}
              className={[
                "rounded-xl border p-3 text-left transition",
                !energized
                  ? "border-green-400 bg-green-50 ring-2 ring-green-100"
                  : "border-neutral-200 bg-white opacity-70 hover:opacity-100",
              ].join(" ")}
            >
              <p className="text-sm font-black text-neutral-900">
                Power OFF Condition
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-700">
                Coil OFF, relay in rest position
              </p>
              <p className="mt-2 text-sm font-black text-green-700">
                11 → 12 CLOSED
              </p>
              <p className="text-xs font-semibold text-neutral-500">14 OPEN</p>
            </button>

            <button
              type="button"
              onClick={() => setPowerCondition(true)}
              className={[
                "rounded-xl border p-3 text-left transition",
                energized
                  ? "border-green-400 bg-green-50 ring-2 ring-green-100"
                  : "border-neutral-200 bg-white opacity-70 hover:opacity-100",
              ].join(" ")}
            >
              <p className="text-sm font-black text-neutral-900">
                Power ON Condition
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-700">
                Coil ON, relay energized
              </p>
              <p className="mt-2 text-sm font-black text-green-700">
                11 → 14 CLOSED
              </p>
              <p className="text-xs font-semibold text-neutral-500">12 OPEN</p>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPowerCondition(!isPowered)}
              className={[
                "rounded-lg px-4 py-2 text-sm font-black text-white transition",
                isPowered
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700",
              ].join(" ")}
            >
              {isPowered ? "Turn Power OFF" : "Turn Power ON"}
            </button>

            <button
              type="button"
              onClick={() => setIsRunning((value) => !value)}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-black text-white transition hover:bg-neutral-700"
            >
              {isRunning ? "Stop Simulation" : "Start Simulation"}
            </button>

            <button
              type="button"
              onClick={resetSimulation}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-black text-neutral-800 transition hover:bg-neutral-100"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => setShowCurrentDots((value) => !value)}
              className={[
                "rounded-lg border px-4 py-2 text-sm font-black transition",
                showCurrentDots
                  ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100",
              ].join(" ")}
            >
              {showCurrentDots ? "Hide Current Dots" : "Show Current Dots"}
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <label
              className="text-sm font-black text-neutral-800"
              htmlFor="relay-speed"
            >
              Speed
            </label>

            <input
              id="relay-speed"
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="w-full accent-amber-500 sm:max-w-xs"
            />

            <span className="text-sm font-bold text-neutral-600">
              {speed.toFixed(1)}x
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
