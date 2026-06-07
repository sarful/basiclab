"use client";

import type { WavePoint } from "./types";

export function WaveformPanel({
  data,
  cursorPoint,
}: {
  data: WavePoint[];
  cursorPoint: WavePoint;
}) {
  const width = 620;
  const height = 390;
  const maxMagnitude = Math.max(
    1,
    ...data.map((point) => Math.abs(point.vin)),
    ...data.map((point) => Math.abs(point.vout)),
  );
  const x = (index: number) => 30 + (index / (data.length - 1)) * 540;
  const xForT = (t: number) => 30 + t * 540;
  const yInputZero = 115;
  const yOutputZero = 265;
  const scale = 70 / maxMagnitude;

  const inputPath = data
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${x(index).toFixed(1)} ${(yInputZero - point.vin * scale).toFixed(1)}`,
    )
    .join(" ");
  const outputPath = data
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${x(index).toFixed(1)} ${(yOutputZero - point.vout * scale).toFixed(1)}`,
    )
    .join(" ");
  const recoveryRegions = data.filter((point) => point.reverseRecovery);
  const cursorX = xForT(cursorPoint.t);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full min-h-[300px] w-full rounded-2xl bg-white"
      role="img"
      aria-label="AC input and rectified output waveform"
    >
      <rect x="0" y="0" width={width} height={height} fill="white" />

      <text x="368" y="24" fill="#0f172a" fontSize="14" fontWeight="900">
        AC supply
      </text>
      <line x1="30" y1={yInputZero} x2="570" y2={yInputZero} stroke="#0f172a" strokeWidth="1" />
      <path d={inputPath} fill="rgba(96,165,250,0.35)" stroke="#60a5fa" strokeWidth="3" />
      <text x="48" y="72" fill="#0f172a" fontSize="14" fontWeight="900">
        +
      </text>
      <text x="48" y="151" fill="#0f172a" fontSize="14" fontWeight="900">
        -
      </text>

      <line x1="30" y1={yOutputZero} x2="570" y2={yOutputZero} stroke="#0f172a" strokeWidth="1" />
      <path d={outputPath} fill="rgba(52,211,153,0.42)" stroke="#34d399" strokeWidth="3" />

      {recoveryRegions.map((point, index) =>
        index % 2 === 0 ? (
          <line
            key={index}
            x1={xForT(point.t)}
            y1="38"
            x2={xForT(point.t)}
            y2="300"
            stroke="#f97316"
            strokeWidth="2"
            opacity="0.55"
          />
        ) : null,
      )}

      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <line
          key={ratio}
          x1={30 + ratio * 540}
          y1="38"
          x2={30 + ratio * 540}
          y2="300"
          stroke="#94a3b8"
          strokeWidth="1"
          strokeDasharray="6 8"
          opacity="0.5"
        />
      ))}

      <line x1={cursorX} y1="38" x2={cursorX} y2="305" stroke="#facc15" strokeWidth="3" />
      <circle cx={cursorX} cy={yInputZero - cursorPoint.vin * scale} r="5" fill="#facc15" />
      <circle cx={cursorX} cy={yOutputZero - cursorPoint.vout * scale} r="5" fill="#facc15" />
      <circle cx="570" cy={yInputZero} r="5" fill="#facc15" />
      <circle cx="570" cy={yOutputZero} r="5" fill="#facc15" />

      <text x="48" y="330" fill="#64748b" fontSize="12" fontWeight="800">
        time -&gt;
      </text>
      <text x="308" y="326" fill="#0f172a" fontSize="13" fontWeight="900">
        Negative half-cycle blocked; orange marks reverse recovery
      </text>
      <text x="305" y="360" fill="#0f172a" fontSize="13" fontWeight="900">
        Rectified Output with Real Diode Switching
      </text>
    </svg>
  );
}
