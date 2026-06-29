"use client";

import { motion } from "framer-motion";

import type { BandMode } from "./types";

type Band = {
  label: string;
  color: string;
  name: string;
  value: string;
};

const VIEW_BOX = "0 0 840 410";
const VIEW_BOX_WIDTH = 840;
const VIEW_BOX_HEIGHT = 410;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  resistorBody: 1,
  leftTerminal: 1,
  rightTerminal: 1,
  legend: 1,
} as const;

const BASE_WIRE_WIDTH = 7;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#334155",
  terminal: "#111827",
  terminalHighlight: "#94a3b8",
  direction: "#93c5fd",
  directionText: "#60a5fa",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

const BAND_MEANING_BY_MODE: Record<BandMode, string[]> = {
  4: ["1st Digit", "2nd Digit", "Multiplier", "Tolerance"],
  5: ["1st Digit", "2nd Digit", "3rd Digit", "Multiplier", "Tolerance"],
  6: [
    "1st Digit",
    "2nd Digit",
    "3rd Digit",
    "Multiplier",
    "Tolerance",
    "Temp. Coefficient",
  ],
};

const BAND_POSITIONS_BY_MODE: Record<BandMode, number[]> = {
  4: [245, 315, 385, 540],
  5: [230, 285, 340, 395, 545],
  6: [215, 262, 309, 356, 500, 555],
};

function scaleComponent(component: ComponentBox, scale: number): ComponentBox {
  const width = component.width * scale;
  const height = component.height * scale;

  return {
    ...component,
    x: component.x - (width - component.width) / 2,
    y: component.y - (height - component.height) / 2,
    width,
    height,
  };
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  leftTerminal: { x: 35, y: 190, width: 160, height: 7, rotate: 0 },
  rightTerminal: { x: 625, y: 190, width: 160, height: 7, rotate: 0 },
  resistorBody: { x: 195, y: 98, width: 430, height: 184, rotate: 0 },
  legend: { x: 105, y: 350, width: 640, height: 42, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  leftTerminal: scaleComponent(
    BASE_COMPONENT.leftTerminal,
    CIRCUIT_COMPONENT_SCALE.leftTerminal,
  ),
  rightTerminal: scaleComponent(
    BASE_COMPONENT.rightTerminal,
    CIRCUIT_COMPONENT_SCALE.rightTerminal,
  ),
  resistorBody: scaleComponent(
    BASE_COMPONENT.resistorBody,
    CIRCUIT_COMPONENT_SCALE.resistorBody,
  ),
  legend: scaleComponent(BASE_COMPONENT.legend, CIRCUIT_COMPONENT_SCALE.legend),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  leftTerminal: [
    { x: COMPONENT.leftTerminal.x, y: 190 },
    { x: COMPONENT.leftTerminal.x + COMPONENT.leftTerminal.width, y: 190 },
  ],

  rightTerminal: [
    { x: COMPONENT.rightTerminal.x, y: 190 },
    { x: COMPONENT.rightTerminal.x + COMPONENT.rightTerminal.width, y: 190 },
  ],
} as const;

const PATH = {
  body: "M195 190 C195 116 245 98 285 114 L535 114 C575 98 625 116 625 190 C625 264 575 282 535 266 L285 266 C245 282 195 264 195 190 Z",

  bodyHighlight:
    "M215 165 C255 130 320 144 370 145 L505 145 C545 140 582 138 606 166 C565 154 535 162 502 163 L370 163 C310 160 260 150 215 165 Z",

  bodyLightLayer:
    "M215 190 C215 132 258 120 290 132 L530 132 C562 120 605 132 605 190 C605 248 562 260 530 248 L290 248 C258 260 215 248 215 190 Z",
} as const;

const LABEL = {
  title: { x: 420, y: 35 },
  directionText: { x: 420, y: 62 },
  legend: { x: COMPONENT.legend.x, y: COMPONENT.legend.y },
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <g>
      <path
        d={pathD(points)}
        stroke={STYLE.terminal}
        strokeWidth={WIRE.width}
        strokeLinecap="round"
        fill="none"
      />

      <path
        d={pathD(points.map((point) => ({ x: point.x, y: point.y - 4 })))}
        stroke={STYLE.terminalHighlight}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </g>
  );
}

function ReadingDirection({ mode }: { mode: BandMode }) {
  return (
    <g>
      <text
        x={LABEL.title.x}
        y={LABEL.title.y}
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="15"
        fontWeight="900"
      >
        Read left to right: digits → multiplier → tolerance
        {mode === 6 ? " → temperature coefficient" : ""}
      </text>

      <motion.g
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <text
          x={LABEL.directionText.x}
          y={LABEL.directionText.y}
          textAnchor="middle"
          fill={STYLE.directionText}
          fontSize="12"
          fontWeight="800"
        >
          Reading Direction
        </text>

        <line
          x1="320"
          y1="76"
          x2="520"
          y2="76"
          stroke={STYLE.direction}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="10 9"
        />

        <path d="M520 76 L506 68 L506 84 Z" fill={STYLE.direction} />
      </motion.g>
    </g>
  );
}

function ResistorBody() {
  return (
    <g filter="url(#resistorShadow)">
      <path
        d={PATH.body}
        fill="url(#resistorBodyRealistic)"
        stroke={STYLE.text}
        strokeWidth="4"
      />

      <path d={PATH.bodyHighlight} fill="#ffffff" opacity="0.28" />

      <path
        d={PATH.bodyLightLayer}
        fill="url(#bodyLightLayer)"
        opacity="0.75"
      />
    </g>
  );
}

function BandMarks({ mode, bands }: { mode: BandMode; bands: Band[] }) {
  const positions = BAND_POSITIONS_BY_MODE[mode];
  const meanings = BAND_MEANING_BY_MODE[mode];

  return (
    <g>
      {bands.map((band, index) => {
        const x = positions[index];
        const meaning = meanings[index] ?? band.label;

        return (
          <g key={`${band.label}-${index}`} className="cursor-help">
            <motion.rect
              x={x - 8}
              y="112"
              width="34"
              height="156"
              rx="7"
              fill={band.color}
              stroke={STYLE.text}
              strokeWidth="2"
              filter={index === 0 ? "url(#selectedBandGlow)" : undefined}
              initial={{ scaleY: 0.9, opacity: 0.85 }}
              animate={{
                scaleY: [1, index === 0 ? 1.04 : 1, 1],
                opacity: 1,
              }}
              transition={{
                duration: index === 0 ? 1.2 : 0.25,
                repeat: index === 0 ? Infinity : 0,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: `${x + 9}px 190px` }}
            />

            <text
              x={x + 9}
              y="295"
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="11"
              fontWeight="900"
            >
              {band.label}
            </text>

            <text
              x={x + 9}
              y="312"
              textAnchor="middle"
              fill={STYLE.muted}
              fontSize="10"
              fontWeight="800"
            >
              {meaning}
            </text>

            <title>{`${band.name} — ${meaning} — ${band.value}`}</title>
          </g>
        );
      })}
    </g>
  );
}

function Legend({ bands }: { bands: Band[] }) {
  return (
    <g transform={`translate(${LABEL.legend.x} ${LABEL.legend.y})`}>
      {bands.map((band, index) => {
        const cardX =
          index * (COMPONENT.legend.width / Math.max(bands.length, 1));

        return (
          <g key={`legend-${index}`} transform={`translate(${cardX} 0)`}>
            <circle
              cx="8"
              cy="8"
              r="7"
              fill={band.color}
              stroke={STYLE.text}
              strokeWidth="1.5"
            />

            <text x="24" y="7" fill={STYLE.text} fontSize="11" fontWeight="900">
              {band.name}
            </text>

            <text
              x="24"
              y="23"
              fill={STYLE.muted}
              fontSize="10"
              fontWeight="700"
            >
              {band.value}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function ResistorSvg({
  mode,
  bands,
}: {
  mode: BandMode;
  bands: Band[];
}) {
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Interactive Resistor Color Code
          </h2>

          <p className="mt-1 text-xs text-slate-600">
            Read the color bands from left to right to decode resistance,
            tolerance, and temperature coefficient.
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold text-blue-700">
          {mode}-BAND
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white p-4">
        <svg
          viewBox={VIEW_BOX}
          className="h-auto w-[840px] sm:w-full"
          role="img"
          aria-label={`${mode}-band resistor color code visualizer`}
        >
          <defs>
            <linearGradient
              id="resistorBodyRealistic"
              x1="0"
              x2="1"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#fff0bf" />
              <stop offset="35%" stopColor="#f2ca7c" />
              <stop offset="70%" stopColor="#e2aa5f" />
              <stop offset="100%" stopColor="#b97835" />
            </linearGradient>

            <linearGradient id="bodyLightLayer" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
            </linearGradient>

            <filter
              id="resistorShadow"
              x="-20%"
              y="-35%"
              width="140%"
              height="180%"
            >
              <feDropShadow
                dx="0"
                dy="9"
                stdDeviation="8"
                floodColor="#0f172a"
                floodOpacity="0.2"
              />
            </filter>

            <filter
              id="selectedBandGlow"
              x="-80%"
              y="-40%"
              width="260%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={canvasTransform}>
            <ReadingDirection mode={mode} />

            <WirePath points={WIRE.leftTerminal} />
            <WirePath points={WIRE.rightTerminal} />

            <ResistorBody />

            <BandMarks mode={mode} bands={bands} />

            <Legend bands={bands} />
          </g>
        </svg>
      </div>
    </section>
  );
}
