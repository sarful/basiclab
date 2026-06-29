"use client";

import { GaugeNeedle } from "./ui";

type ElectricalCircuitProps = {
  voltage?: number;
  resistance?: number;
  current: number;
  angle: number;
  flowSpeed: number;
};

export function ElectricalCircuit({
  voltage,
  resistance,
  current,
  angle,
  flowSpeed,
}: ElectricalCircuitProps) {
  const wireStroke = 6;

  const meterX = 740;
  const meterY = 80;
  const meterLabelX = 795;

  const positiveWireColor = "#dc2626";
  const returnWireColor = "#2563eb";
  const currentParticleColor = "#16a34a";
  const resistorColor = "#92400e";

  const particleDuration = `${Math.max(0.8, 6 / Math.max(0.1, flowSpeed))}s`;

  const currentFlowPath = `
    M190 80
    L460 80
    L480 65
    L500 95
    L520 65
    L540 95
    L560 65
    L580 80
    L590 80
    L692 80
    L740 80
    L740 128
    L740 160
    Q740 185 710 185
    L185 185
    Q165 185 165 165
    L165 145
  `;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="rounded-lg bg-slate-100 px-3 py-1.5 text-[1rem] font-semibold tracking-tight text-slate-800">
          Electrical Circuit
        </h2>

        <span className="rounded-lg border border-green-200 bg-green-50 px-4 py-1 text-xs font-semibold text-green-700">
          Current direction →
        </span>
      </div>

      <svg
        viewBox="20 10 840 210"
        className="h-auto min-h-[280px] w-full"
        role="img"
        aria-label="Electrical circuit showing battery voltage, current flow, resistor, and ammeter"
      >
        {/* Positive wire */}
        <path
          d="M175 80 L460 80"
          fill="none"
          stroke={positiveWireColor}
          strokeWidth={wireStroke}
          strokeLinecap="round"
        />

        {/* Positive wire after resistor */}
        <path
          d={`M590 80 L${meterX - 48} 80`}
          fill="none"
          stroke={positiveWireColor}
          strokeWidth={wireStroke}
          strokeLinecap="round"
        />

        {/* Return / negative wire */}
        <path
          d={`M${meterX} 128 L${meterX} 160 Q${meterX} 185 ${
            meterX - 30
          } 185 L185 185 Q165 185 165 165 L165 145`}
          fill="none"
          stroke={returnWireColor}
          strokeWidth={wireStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Battery connection nodes */}
        <circle cx="175" cy="80" r="5" fill={positiveWireColor} />
        <circle cx="165" cy="145" r="5" fill={returnWireColor} />

        {/* Animated current particles */}
        {current > 0 &&
          [0, 1, 2, 3, 4].map((delay) => (
            <circle key={delay} r="5.5" fill={currentParticleColor}>
              <animateMotion
                dur={particleDuration}
                begin={`${delay * 0.42}s`}
                repeatCount="indefinite"
                path={currentFlowPath}
              />
            </circle>
          ))}

        {/* Battery */}
        <rect
          x="125"
          y="80"
          width="50"
          height="90"
          rx="8"
          fill="#1f2937"
          stroke="#111827"
          strokeWidth="3"
        />
        <rect x="140" y="68" width="20" height="14" rx="2" fill="#334155" />

        <text
          x="150"
          y="115"
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill={positiveWireColor}
        >
          +
        </text>

        <text
          x="150"
          y="158"
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill={returnWireColor}
        >
          -
        </text>

        <text x="35" y="70" fontSize="16" fontWeight="bold">
          Battery
        </text>
        <text x="35" y="95" fontSize="14">
          Voltage Source
        </text>
        <text
          x="35"
          y="132"
          fontSize="16"
          fontWeight="bold"
          fill={positiveWireColor}
        >
          Voltage (V)
        </text>
        <text x="35" y="156" fontSize="14">
          = Pressure
        </text>

        {typeof voltage === "number" && (
          <text
            x="35"
            y="178"
            fontSize="13"
            fontWeight="bold"
            fill={positiveWireColor}
          >
            {voltage.toFixed(1)} V
          </text>
        )}

        {/* Current direction indicator */}
        <line
          x1="285"
          y1="50"
          x2="370"
          y2="50"
          stroke={currentParticleColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polygon points="370,50 352,39 352,61" fill={currentParticleColor} />

        <text x="300" y="22" fontSize="16" fontWeight="bold">
          Current (I)
        </text>
        <text x="315" y="42" fontSize="14">
          = Flow
        </text>

        {/* Resistor */}
        <polyline
          points="460,80 480,65 500,95 520,65 540,95 560,65 580,80 590,80"
          fill="none"
          stroke={resistorColor}
          strokeWidth={wireStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text x="490" y="25" fontSize="16" fontWeight="bold">
          Resistor (R)
        </text>
        <text x="495" y="47" fontSize="14">
          = Resistance
        </text>

        {typeof resistance === "number" && (
          <text
            x="495"
            y="65"
            fontSize="13"
            fontWeight="bold"
            fill={resistorColor}
          >
            {resistance.toFixed(0)} Ω
          </text>
        )}

        {/* Ammeter */}
        <circle
          cx={meterX}
          cy={meterY}
          r="48"
          fill="#e5e7eb"
          stroke="#111827"
          strokeWidth="4"
        />
        <circle
          cx={meterX}
          cy={meterY}
          r="34"
          fill="white"
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {/* Ammeter ticks */}
        {[-130, -80, -30, 20, 70].map((tick) => {
          const rad = (tick * Math.PI) / 180;
          const x1 = meterX + Math.cos(rad) * 26;
          const y1 = meterY + Math.sin(rad) * 26;
          const x2 = meterX + Math.cos(rad) * 32;
          const y2 = meterY + Math.sin(rad) * 32;

          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        <GaugeNeedle cx={meterX} cy={meterY} angle={angle} />

        <text
          x={meterX}
          y="105"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#111827"
        >
          A
        </text>

        <text
          x={meterX}
          y="122"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill={currentParticleColor}
        >
          {current.toFixed(3)} A
        </text>

        <text x={meterLabelX} y="78" fontSize="16" fontWeight="bold">
          Ammeter
        </text>
        <text x={meterLabelX} y="102" fontSize="14">
          = Measures
        </text>
        <text x={meterLabelX} y="122" fontSize="14">
          Current
        </text>
      </svg>
    </section>
  );
}
