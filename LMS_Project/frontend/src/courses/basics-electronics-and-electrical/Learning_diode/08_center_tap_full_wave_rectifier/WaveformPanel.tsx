"use client";

import type { WavePoint } from "./types";

const VIEW = {
  width: 720,
  height: 460,
  plotX: 56,
  plotWidth: 610,
  inputZeroY: 150,
  outputZeroY: 315,
  amplitude: 82,
} as const;

const STYLE = {
  input: "#60a5fa",
  inputFill: "rgba(96,165,250,0.22)",
  output: "#22c55e",
  outputFill: "rgba(34,197,94,0.28)",
  cursor: "#facc15",
  d1: "#16a34a",
  d2: "#7c3aed",
  axis: "#0f172a",
  grid: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
} as const;

function safeNumber(value: number, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function xFromT(t: number) {
  return VIEW.plotX + Math.min(1, Math.max(0, safeNumber(t))) * VIEW.plotWidth;
}

function buildPath(
  data: WavePoint[],
  yZero: number,
  scale: number,
  getValue: (point: WavePoint) => number,
) {
  return data
    .map((point, index) => {
      const x =
        VIEW.plotX + (index / Math.max(1, data.length - 1)) * VIEW.plotWidth;
      const y = yZero - safeNumber(getValue(point)) * scale;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildAreaPath(
  data: WavePoint[],
  yZero: number,
  scale: number,
  getValue: (point: WavePoint) => number,
) {
  if (data.length === 0) return "";

  const line = buildPath(data, yZero, scale, getValue);
  return `${line} L${VIEW.plotX + VIEW.plotWidth} ${yZero} L${VIEW.plotX} ${yZero} Z`;
}

export function WaveformPanel({
  data,
  cursorPoint,
}: {
  data: WavePoint[];
  cursorPoint: WavePoint;
}) {
  const maxMagnitude = Math.max(
    1,
    ...data.map((point) => Math.abs(point.vinTop)),
    ...data.map((point) => Math.abs(point.vout)),
  );

  const scale = VIEW.amplitude / maxMagnitude;

  const inputPath = buildPath(
    data,
    VIEW.inputZeroY,
    scale,
    (point) => point.vinTop,
  );
  const inputArea = buildAreaPath(
    data,
    VIEW.inputZeroY,
    scale,
    (point) => point.vinTop,
  );
  const outputPath = buildPath(
    data,
    VIEW.outputZeroY,
    scale,
    (point) => point.vout,
  );
  const outputArea = buildAreaPath(
    data,
    VIEW.outputZeroY,
    scale,
    (point) => point.vout,
  );

  const cursorX = xFromT(cursorPoint.t);
  const cursorInputY = VIEW.inputZeroY - safeNumber(cursorPoint.vinTop) * scale;
  const cursorOutputY = VIEW.outputZeroY - safeNumber(cursorPoint.vout) * scale;

  const activeDiode = cursorPoint.activeDiode;
  const isD1 = activeDiode === "D1";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="h-auto min-h-[430px] w-full"
        role="img"
        aria-label="Center tap full wave rectifier input and output waveform"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width={VIEW.width} height={VIEW.height} fill="#ffffff" />

        <rect
          x="26"
          y="78"
          width="668"
          height="332"
          rx="22"
          fill="#f8fafc"
          stroke="#e2e8f0"
        />

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const x = VIEW.plotX + ratio * VIEW.plotWidth;

          return (
            <g key={ratio}>
              <line
                x1={x}
                y1="92"
                x2={x}
                y2="380"
                stroke={STYLE.grid}
                strokeDasharray="5 7"
              />
              <text
                x={x}
                y="398"
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={STYLE.muted}
              >
                {(ratio * 2).toFixed(ratio === 0 ? 0 : 1)} cycle
              </text>
            </g>
          );
        })}

        <line
          x1={VIEW.plotX}
          y1={VIEW.inputZeroY}
          x2={VIEW.plotX + VIEW.plotWidth}
          y2={VIEW.inputZeroY}
          stroke={STYLE.axis}
          strokeWidth="1.5"
        />
        <line
          x1={VIEW.plotX}
          y1={VIEW.outputZeroY}
          x2={VIEW.plotX + VIEW.plotWidth}
          y2={VIEW.outputZeroY}
          stroke={STYLE.axis}
          strokeWidth="1.5"
        />

        <text x="60" y="102" fontSize="13" fontWeight="900" fill={STYLE.input}>
          Transformer Secondary AC
        </text>
        <text x="60" y="292" fontSize="13" fontWeight="900" fill={STYLE.output}>
          Full-Wave DC Output
        </text>

        <text
          x="34"
          y={VIEW.inputZeroY - 44}
          fontSize="14"
          fontWeight="900"
          fill={STYLE.axis}
        >
          +
        </text>
        <text
          x="36"
          y={VIEW.inputZeroY + 52}
          fontSize="14"
          fontWeight="900"
          fill={STYLE.axis}
        >
          -
        </text>

        <path d={inputArea} fill={STYLE.inputFill} />
        <path
          d={inputPath}
          fill="none"
          stroke={STYLE.input}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path d={outputArea} fill={STYLE.outputFill} />
        <path
          d={outputPath}
          fill="none"
          stroke={STYLE.output}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <line
          x1={cursorX}
          y1="92"
          x2={cursorX}
          y2="380"
          stroke={STYLE.cursor}
          strokeWidth="3"
          strokeLinecap="round"
        />

        <circle cx={cursorX} cy={cursorInputY} r="6" fill={STYLE.cursor} />
        <circle cx={cursorX} cy={cursorOutputY} r="6" fill={STYLE.cursor} />

        <rect
          x="420"
          y="0"
          width="260"
          height="72"
          rx="16"
          fill={isD1 ? "#ecfdf5" : "#f5f3ff"}
          stroke={isD1 ? STYLE.d1 : STYLE.d2}
        />
        <text
          x="550"
          y="21"
          textAnchor="middle"
          fontSize="12"
          fontWeight="900"
          fill={isD1 ? STYLE.d1 : STYLE.d2}
        >
          {isD1 ? "Positive Half-Cycle" : "Negative Half-Cycle"}
        </text>
        <text
          x="550"
          y="42"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill={STYLE.muted}
        >
          {isD1
            ? "D1 conducts, load current stays same direction"
            : "D2 conducts, output is flipped positive"}
        </text>

        <g>
          <rect
            x="58"
            y="420"
            width="14"
            height="14"
            rx="4"
            fill={STYLE.input}
          />
          <text
            x="78"
            y="432"
            fontSize="12"
            fontWeight="800"
            fill={STYLE.muted}
          >
            AC secondary
          </text>

          <rect
            x="178"
            y="420"
            width="14"
            height="14"
            rx="4"
            fill={STYLE.output}
          />
          <text
            x="198"
            y="432"
            fontSize="12"
            fontWeight="800"
            fill={STYLE.muted}
          >
            Full-wave output
          </text>

          <rect x="332" y="420" width="14" height="14" rx="4" fill={STYLE.d1} />
          <text
            x="352"
            y="432"
            fontSize="12"
            fontWeight="800"
            fill={STYLE.muted}
          >
            D1 positive half
          </text>

          <rect x="490" y="420" width="14" height="14" rx="4" fill={STYLE.d2} />
          <text
            x="510"
            y="432"
            fontSize="12"
            fontWeight="800"
            fill={STYLE.muted}
          >
            D2 negative half
          </text>
        </g>
      </svg>
    </div>
  );
}
