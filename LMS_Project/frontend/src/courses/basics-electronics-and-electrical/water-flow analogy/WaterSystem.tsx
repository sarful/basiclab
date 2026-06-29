"use client";

import { GaugeNeedle } from "./ui";

interface WaterSystemProps {
  resistance: number;
  pipeOpening: number;
  flowRate: number;
  angle: number;
  flowSpeed: number;
}

export function WaterSystem({
  resistance,
  pipeOpening,
  flowRate,
  angle,
  flowSpeed,
}: WaterSystemProps) {
  const centerY = 118;

  const safeFlowSpeed = Math.max(0.1, flowSpeed);
  const safePipeOpening = Math.min(100, Math.max(0, pipeOpening));

  const opening = Math.min(42, Math.max(8, safePipeOpening / 2.4));
  const innerOpening = Math.max(5, opening * 0.45);

  const particleDuration = Math.max(1.2, 7 / safeFlowSpeed);
  const particleRadius =
    safePipeOpening < 25 ? 3.5 : safePipeOpening < 50 ? 5 : 7;

  const meterX = 710;
  const meterY = 100;
  const meterLabelX = 765;

  const waterFlowLoopPath = `
    M155 118
    L470 118
    C505 118 555 118 590 118
    L${meterX} 118
    L${meterX} 210
    L155 210
    L155 138
  `;

  const narrowPipeOuterPath = `
    M470 ${centerY}
    C505 ${centerY - opening} 555 ${centerY - opening} 590 ${centerY}
    C555 ${centerY + opening} 505 ${centerY + opening} 470 ${centerY}
    Z
  `;

  const narrowPipeInnerPath = `
    M470 ${centerY}
    C505 ${centerY - innerOpening} 555 ${centerY - innerOpening} 590 ${centerY}
    C555 ${centerY + innerOpening} 505 ${centerY + innerOpening} 470 ${centerY}
    Z
  `;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-[1rem] font-semibold tracking-tight text-blue-700">
        Water System Analogy
      </h2>

      <svg
        viewBox="0 0 940 260"
        className="h-auto w-full"
        role="img"
        aria-label="Water system analogy showing pressure as voltage, water flow as current, and narrow pipe as resistance"
      >
        <defs>
          <clipPath id="narrowPipeWaterClip">
            <path d={narrowPipeInnerPath} />
          </clipPath>
        </defs>

        {/* Main pipe */}
        <path
          d="M155 118 L470 118"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="28"
          strokeLinecap="round"
        />

        <path
          d={`M590 118 L${meterX} 118`}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="28"
          strokeLinecap="round"
        />

        {/* Return pipe */}
        <path
          d={`M155 138 L155 210 L${meterX} 210 L${meterX} 138`}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Narrow pipe body */}
        <path
          d={narrowPipeOuterPath}
          fill="#d1d5db"
          stroke="#475569"
          strokeWidth="3"
        />

        {/* Narrow pipe inner water channel */}
        <path d={narrowPipeInnerPath} fill="#7dd3fc" opacity="0.95" />

        {/* Water particles clipped inside narrow pipe only */}
        <g clipPath="url(#narrowPipeWaterClip)">
          {[0, 1, 2, 3, 4].map((delay) => (
            <circle key={delay} r={particleRadius} fill="#0284c7">
              <animateMotion
                dur={`${particleDuration}s`}
                begin={`${delay * 0.35}s`}
                repeatCount="indefinite"
                path={waterFlowLoopPath}
              />
            </circle>
          ))}
        </g>

        {/* Normal pipe particles */}
        {[0, 1, 2, 3].map((delay) => (
          <circle key={`pipe-${delay}`} r={particleRadius} fill="#0284c7">
            <animateMotion
              dur={`${particleDuration}s`}
              begin={`${delay * 0.45}s`}
              repeatCount="indefinite"
              path={waterFlowLoopPath}
            />
          </circle>
        ))}

        {/* Pump */}
        <circle
          cx="125"
          cy="118"
          r="50"
          fill="#3b82f6"
          stroke="#1e3a8a"
          strokeWidth="4"
        />

        <circle
          cx="125"
          cy="118"
          r="25"
          fill="#93c5fd"
          stroke="#1e3a8a"
          strokeWidth="3"
        />

        <path
          d="M112 118 C112 105 138 105 138 118 C138 132 112 132 112 118"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="3"
        />

        <rect x="84" y="168" width="82" height="14" rx="3" fill="#64748b" />

        <text x="40" y="72" fontSize="16" fontWeight="bold">
          Pump
        </text>
        <text x="25" y="96" fontSize="14">
          Pressure Source
        </text>
        <text x="25" y="148" fontSize="16" fontWeight="bold" fill="#2563eb">
          Pressure
        </text>
        <text x="25" y="170" fontSize="14" fill="#2563eb">
          = Voltage
        </text>

        {/* Flow direction */}
        <line
          x1="270"
          y1="78"
          x2="380"
          y2="78"
          stroke="#16a34a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polygon points="380,78 365,68 365,88" fill="#16a34a" />

        <text x="280" y="44" fontSize="16" fontWeight="bold">
          Water Flow
        </text>
        <text x="285" y="66" fontSize="14">
          = Current
        </text>

        <text x="500" y="43" fontSize="16" fontWeight="bold">
          Narrow Pipe
        </text>
        <text x="500" y="66" fontSize="14">
          = Resistance: {resistance} Ω
        </text>
        <text x="500" y="88" fontSize="14">
          Opening: {safePipeOpening.toFixed(0)}%
        </text>

        {/* Flow meter connector adjusted for meter moved down */}
        <path
          d={`M${meterX} 118 L${meterX} 142`}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* Flow meter moved down */}
        <circle
          cx={meterX}
          cy={meterY}
          r="46"
          fill="#e5e7eb"
          stroke="#111827"
          strokeWidth="4"
        />
        <circle
          cx={meterX}
          cy={meterY}
          r="33"
          fill="white"
          stroke="#94a3b8"
          strokeWidth="2"
        />

        <GaugeNeedle cx={meterX} cy={meterY} angle={angle} />

        <text
          x={meterX}
          y="126"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
        >
          {flowRate.toFixed(1)}
        </text>

        <text
          x={meterX}
          y="140"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
        >
          L/min
        </text>

        <text x={meterLabelX} y="130" fontSize="16" fontWeight="bold">
          Flow Meter
        </text>
        <text x={meterLabelX} y="154" fontSize="14">
          = {flowRate.toFixed(1)} L/min
        </text>
        <text x={meterLabelX} y="176" fontSize="14">
          Measures Flow Rate
        </text>
      </svg>
    </section>
  );
}
