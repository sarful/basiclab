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
  recovery: "#f97316",
  axis: "#0f172a",
  grid: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
} as const;

function safeNumber(value: number, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
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
  const lastX = VIEW.plotX + VIEW.plotWidth;

  return `${line} L${lastX} ${yZero} L${VIEW.plotX} ${yZero} Z`;
}

function xFromT(t: number) {
  const safeT = Math.min(1, Math.max(0, safeNumber(t)));
  return VIEW.plotX + safeT * VIEW.plotWidth;
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
    ...data.map((point) => Math.abs(point.vin)),
    ...data.map((point) => Math.abs(point.vout)),
  );

  const scale = VIEW.amplitude / maxMagnitude;

  const inputPath = buildPath(
    data,
    VIEW.inputZeroY,
    scale,
    (point) => point.vin,
  );
  const inputArea = buildAreaPath(
    data,
    VIEW.inputZeroY,
    scale,
    (point) => point.vin,
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
  const cursorInputY = VIEW.inputZeroY - safeNumber(cursorPoint.vin) * scale;
  const cursorOutputY = VIEW.outputZeroY - safeNumber(cursorPoint.vout) * scale;

  const recoveryPoints = data.filter((point) => point.reverseRecovery);
  const isPositiveHalf = cursorPoint.vin >= 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="h-auto min-h-[430px] w-full"
        role="img"
        aria-label="Half-wave rectifier input and output waveform"
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
          AC Input
        </text>
        <text x="60" y="292" fontSize="13" fontWeight="900" fill={STYLE.output}>
          Rectified Output
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

        {recoveryPoints.map((point, index) =>
          index % 2 === 0 ? (
            <line
              key={`${point.t}-${index}`}
              x1={xFromT(point.t)}
              y1="92"
              x2={xFromT(point.t)}
              y2="380"
              stroke={STYLE.recovery}
              strokeWidth="2"
              opacity="0.4"
            />
          ) : null,
        )}

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
          x="430"
          y="0"
          width="240"
          height="72"
          rx="16"
          fill={isPositiveHalf ? "#ecfdf5" : "#fef2f2"}
          stroke={isPositiveHalf ? "#22c55e" : "#ef4444"}
        />
        <text
          x="550"
          y="20"
          textAnchor="middle"
          fontSize="12"
          fontWeight="900"
          fill={isPositiveHalf ? "#15803d" : "#dc2626"}
        >
          {isPositiveHalf ? "Positive Half-Cycle" : "Negative Half-Cycle"}
        </text>
        <text
          x="550"
          y="40"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill={STYLE.muted}
        >
          {cursorPoint.conducting
            ? "Diode conducts and output appears"
            : "Diode blocks, output stays near zero"}
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
            AC input
          </text>

          <rect
            x="160"
            y="420"
            width="14"
            height="14"
            rx="4"
            fill={STYLE.output}
          />
          <text
            x="180"
            y="432"
            fontSize="12"
            fontWeight="800"
            fill={STYLE.muted}
          >
            Rectified output
          </text>

          <rect
            x="308"
            y="420"
            width="14"
            height="14"
            rx="4"
            fill={STYLE.cursor}
          />
          <text
            x="328"
            y="432"
            fontSize="12"
            fontWeight="800"
            fill={STYLE.muted}
          >
            Time cursor
          </text>

          <rect
            x="430"
            y="420"
            width="14"
            height="14"
            rx="4"
            fill={STYLE.recovery}
          />
          <text
            x="450"
            y="432"
            fontSize="12"
            fontWeight="800"
            fill={STYLE.muted}
          >
            Reverse recovery marks
          </text>
        </g>
      </svg>
    </div>
  );
}
