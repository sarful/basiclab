"use client";

import { GaugeNeedle } from "./ui";

export function WaterSystem({
  resistance,
  pipeOpening,
  flowRate,
  angle,
  flowSpeed,
}: {
  resistance: number;
  pipeOpening: number;
  flowRate: number;
  angle: number;
  flowSpeed: number;
}) {
  const centerY = 118;
  const opening = Math.max(8, pipeOpening / 2.6);

  const meterX = 710;
  const meterY = 70;
  const meterLabelX = 765;

  const particlePath = `
    M155 118 
    L470 118 
    C510 ${centerY - opening} 550 ${centerY - opening} 590 118 
    L${meterX} 118 
    L${meterX} 210 
    L155 210 
    L155 138
  `;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-[1rem] font-semibold tracking-tight text-blue-700">
        Water system analogy
      </h2>

      <svg viewBox="0 0 940 260" className="h-auto w-full">
        {/* Main pipe */}
        <path
          d="M155 118 L470 118"
          stroke="#60a5fa"
          strokeWidth="28"
          strokeLinecap="round"
        />

        <path
          d={`M590 118 L${meterX} 118`}
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

        {/* Animated water particles */}
        {[0, 1, 2, 3].map((delay) => (
          <circle key={delay} r="8" fill="#0284c7">
            <animateMotion
              dur={`${Math.max(1.2, 7 / flowSpeed)}s`}
              begin={`${delay * 0.4}s`}
              repeatCount="indefinite"
              path={particlePath}
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
        <rect x="84" y="168" width="82" height="14" rx="3" fill="#64748b" />

        <text x="40" y="72" fontSize="16" fontWeight="bold">
          Pump
        </text>
        <text x="25" y="96" fontSize="14">
          (Pressure Source)
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

        {/* Dynamic narrow pipe */}
        <path
          d={`
            M470 ${centerY}
            C510 ${centerY - opening} 550 ${centerY - opening} 590 ${centerY}
            C550 ${centerY + opening} 510 ${centerY + opening} 470 ${centerY}
          `}
          fill="#d1d5db"
          stroke="#475569"
          strokeWidth="3"
        />

        <text x="500" y="43" fontSize="16" fontWeight="bold">
          Narrow Pipe
        </text>
        <text x="500" y="66" fontSize="14">
          = Resistance: {resistance} Ω
        </text>
        <text x="500" y="88" fontSize="14">
          Opening: {pipeOpening.toFixed(0)}%
        </text>

        {/* Flow meter connector */}
        <path
          d={`M${meterX} 118 L${meterX} 112`}
          stroke="#60a5fa"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* Flow meter */}
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
          y="96"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
        >
          {flowRate.toFixed(1)}
        </text>
        <text
          x={meterX}
          y="110"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
        >
          L/min
        </text>

        <text x={meterLabelX} y="100" fontSize="16" fontWeight="bold">
          Flow Meter
        </text>
        <text x={meterLabelX} y="124" fontSize="14">
          = {flowRate.toFixed(1)} L/min
        </text>
        <text x={meterLabelX} y="146" fontSize="14">
          Measures Flow Rate
        </text>
      </svg>
    </section>
  );
}
