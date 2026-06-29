"use client";

import type { WavePoint } from "./types";

const PANEL = {
  width: 720,
  height: 420,
  plotLeft: 64,
  plotRight: 660,
  inputZeroY: 132,
  outputZeroY: 286,
  amplitude: 72,
} as const;

const COLOR = {
  text: "#0f172a",
  muted: "#64748b",
  grid: "#cbd5e1",
  input: "#3b82f6",
  output: "#22c55e",
  cursor: "#f59e0b",
  inputFill: "rgba(59,130,246,0.12)",
  outputFill: "rgba(34,197,94,0.16)",
} as const;

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildPath(
  data: WavePoint[],
  getY: (point: WavePoint) => number,
  getX: (index: number) => number,
) {
  return data
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${getX(index).toFixed(1)} ${getY(point).toFixed(1)}`;
    })
    .join(" ");
}

export function WaveformPanel({
  data,
  cursorPoint,
}: {
  data: WavePoint[];
  cursorPoint: WavePoint;
}) {
  const safeData = data.length > 1 ? data : [cursorPoint, cursorPoint];

  const plotWidth = PANEL.plotRight - PANEL.plotLeft;

  const maxMagnitude = Math.max(
    1,
    ...safeData.map((point) => Math.abs(point.vinTop)),
    ...safeData.map((point) => Math.abs(point.vout)),
  );

  const scale = PANEL.amplitude / maxMagnitude;

  const x = (index: number) =>
    PANEL.plotLeft + (index / (safeData.length - 1)) * plotWidth;

  const xForT = (t: number) => PANEL.plotLeft + clampValue(t, 0, 1) * plotWidth;

  const inputY = (point: WavePoint) => PANEL.inputZeroY - point.vinTop * scale;

  const outputY = (point: WavePoint) => PANEL.outputZeroY - point.vout * scale;

  const inputPath = buildPath(safeData, inputY, x);
  const outputPath = buildPath(safeData, outputY, x);

  const cursorX = xForT(cursorPoint.t);
  const cursorInputY = inputY(cursorPoint);
  const cursorOutputY = outputY(cursorPoint);

  const isPositiveCycle = cursorPoint.activeDiode === "D1D4";
  const activeDiodeText =
    cursorPoint.activeDiode === "D1D4"
      ? "D1 + D4 conducting"
      : cursorPoint.activeDiode === "D2D3"
        ? "D2 + D3 conducting"
        : "No conduction";

  const cycleText = isPositiveCycle
    ? "Positive half-cycle"
    : cursorPoint.activeDiode === "D2D3"
      ? "Negative half-cycle is flipped upward"
      : "Zero crossing / no output";

  return (
    <svg
      viewBox={`0 0 ${PANEL.width} ${PANEL.height}`}
      className="h-full min-h-[360px] w-full rounded-2xl bg-white"
      role="img"
      aria-label="Bridge rectifier input and full-wave rectified output waveform"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width={PANEL.width} height={PANEL.height} rx="22" fill="#ffffff" />

      <text x="32" y="34" fill={COLOR.text} fontSize="18" fontWeight="900">
        Bridge Rectifier Waveform
      </text>

      <text x="32" y="56" fill={COLOR.muted} fontSize="12" fontWeight="700">
        {/* AC input changes polarity, but output across the LED/load remains
        positive. */}
      </text>

      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const gx = PANEL.plotLeft + ratio * plotWidth;
        return (
          <g key={ratio}>
            <line
              x1={gx}
              y1="82"
              x2={gx}
              y2="326"
              stroke={COLOR.grid}
              strokeWidth="1"
              strokeDasharray="5 7"
              opacity="0.75"
            />
            <text
              x={gx}
              y="350"
              textAnchor="middle"
              fill={COLOR.muted}
              fontSize="11"
              fontWeight="700"
            >
              {ratio === 0 ? "0" : ratio === 1 ? "T" : `${ratio}T`}
            </text>
          </g>
        );
      })}

      <line
        x1={PANEL.plotLeft}
        y1={PANEL.inputZeroY}
        x2={PANEL.plotRight}
        y2={PANEL.inputZeroY}
        stroke={COLOR.text}
        strokeWidth="1.5"
      />

      <line
        x1={PANEL.plotLeft}
        y1={PANEL.outputZeroY}
        x2={PANEL.plotRight}
        y2={PANEL.outputZeroY}
        stroke={COLOR.text}
        strokeWidth="1.5"
      />

      <text
        x="32"
        y={PANEL.inputZeroY - 58}
        fill={COLOR.input}
        fontSize="13"
        fontWeight="900"
      >
        AC Input
      </text>
      <text
        x="36"
        y={PANEL.inputZeroY - 10}
        fill={COLOR.muted}
        fontSize="11"
        fontWeight="800"
      >
        +V
      </text>
      <text
        x="38"
        y={PANEL.inputZeroY + 48}
        fill={COLOR.muted}
        fontSize="11"
        fontWeight="800"
      >
        -V
      </text>

      <text
        x="32"
        y={PANEL.outputZeroY - 58}
        fill={COLOR.output}
        fontSize="13"
        fontWeight="900"
      >
        DC Output
      </text>
      <text
        x="36"
        y={PANEL.outputZeroY - 10}
        fill={COLOR.muted}
        fontSize="11"
        fontWeight="800"
      >
        +V
      </text>
      <text
        x="36"
        y={PANEL.outputZeroY + 38}
        fill={COLOR.muted}
        fontSize="11"
        fontWeight="800"
      >
        0V
      </text>

      <path
        d={`${inputPath} L ${PANEL.plotRight} ${PANEL.inputZeroY} L ${PANEL.plotLeft} ${PANEL.inputZeroY} Z`}
        fill={COLOR.inputFill}
      />
      <path
        d={inputPath}
        fill="none"
        stroke={COLOR.input}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={`${outputPath} L ${PANEL.plotRight} ${PANEL.outputZeroY} L ${PANEL.plotLeft} ${PANEL.outputZeroY} Z`}
        fill={COLOR.outputFill}
      />
      <path
        d={outputPath}
        fill="none"
        stroke={COLOR.output}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1={cursorX}
        y1="78"
        x2={cursorX}
        y2="328"
        stroke={COLOR.cursor}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx={cursorX}
        cy={cursorInputY}
        r="6"
        fill={COLOR.cursor}
        stroke="#fff"
        strokeWidth="2"
      />
      <circle
        cx={cursorX}
        cy={cursorOutputY}
        r="6"
        fill={COLOR.cursor}
        stroke="#fff"
        strokeWidth="2"
      />

      <rect
        x="420"
        y="0"
        width="268"
        height="58"
        rx="14"
        fill="#f8fafc"
        stroke="#e2e8f0"
      />
      <text x="438" y="15" fill={COLOR.text} fontSize="13" fontWeight="900">
        {cycleText}
      </text>
      <text x="499" y="30" fill={COLOR.muted} fontSize="12" fontWeight="800">
        {activeDiodeText}
      </text>

      <text x="32" y="386" fill={COLOR.muted} fontSize="12" fontWeight="800">
        Time →
      </text>

      <text x="170" y="386" fill={COLOR.output} fontSize="12" fontWeight="900">
        Full-wave output: both AC half-cycles become positive pulses.
      </text>
    </svg>
  );
}
