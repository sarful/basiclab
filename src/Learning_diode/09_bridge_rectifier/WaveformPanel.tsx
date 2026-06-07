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
    ...data.map((point) => Math.abs(point.vinTop)),
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
        `${index === 0 ? "M" : "L"}${x(index).toFixed(1)} ${(yInputZero - point.vinTop * scale).toFixed(1)}`,
    )
    .join(" ");
  const outputPath = data
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${x(index).toFixed(1)} ${(yOutputZero - point.vout * scale).toFixed(1)}`,
    )
    .join(" ");
  const cursorX = xForT(cursorPoint.t);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full min-h-[320px] w-full rounded-2xl bg-white"
      role="img"
      aria-label="Full wave rectifier waveform"
    >
      <rect x="0" y="0" width={width} height={height} fill="white" />
      <text x="374" y="24" fill="#0f172a" fontSize="14" fontWeight="900">
        AC input
      </text>
      <line x1="30" y1={yInputZero} x2="570" y2={yInputZero} stroke="#0f172a" strokeWidth="1" />
      <path d={inputPath} fill="rgba(96,165,250,0.32)" stroke="#60a5fa" strokeWidth="3" />
      <text x="48" y="72" fill="#0f172a" fontSize="14" fontWeight="900">
        +
      </text>
      <text x="48" y="151" fill="#0f172a" fontSize="14" fontWeight="900">
        -
      </text>

      <line x1="30" y1={yOutputZero} x2="570" y2={yOutputZero} stroke="#0f172a" strokeWidth="1" />
      <path d={outputPath} fill="rgba(52,211,153,0.42)" stroke="#34d399" strokeWidth="3" />
      <text x="315" y="326" fill="#0f172a" fontSize="13" fontWeight="900">
        Full-Wave Rectified Output
      </text>
      <text x="315" y="350" fill="#0f172a" fontSize="13" fontWeight="900">
        Both half-cycles become positive pulses
      </text>

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
      <circle cx={cursorX} cy={yInputZero - cursorPoint.vinTop * scale} r="5" fill="#facc15" />
      <circle cx={cursorX} cy={yOutputZero - cursorPoint.vout * scale} r="5" fill="#facc15" />
      <text x="48" y="330" fill="#64748b" fontSize="12" fontWeight="800">
        time -&gt;
      </text>
    </svg>
  );
}
