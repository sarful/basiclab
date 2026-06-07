"use client";

type ElectricalCircuitProps = {
  current: number;
  angle: number;
  flowSpeed: number;
};

function GaugeNeedle({
  cx,
  cy,
  angle,
  length = 30,
}: {
  cx: number;
  cy: number;
  angle: number;
  length?: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const x2 = cx + Math.cos(rad) * length;
  const y2 = cy + Math.sin(rad) * length;

  return (
    <>
      <line
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        stroke="#ef4444"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="5" fill="#111827" />
    </>
  );
}

export function ElectricalCircuit({
  current,
  angle,
  flowSpeed,
}: ElectricalCircuitProps) {
  const wireStroke = 6;
  const meterX = 740;
  const meterLabelX = 795;
  const particlePath =
    "M180 80 L470 80 L600 80 L692 80 L740 80 L740 128 L740 160 Q740 185 710 185 L185 185 Q165 185 165 165 L165 145";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="rounded-lg bg-slate-100 px-3 py-1.5 text-[1rem] font-semibold tracking-tight text-slate-800">
          Electrical circuit
        </h2>

        <span className="rounded-lg border border-green-200 bg-green-50 px-4 py-1 text-xs font-semibold text-green-700">
          Current direction -&gt;
        </span>
      </div>

      <svg viewBox="20 10 840 210" className="h-auto min-h-[280px] w-full">
        <path
          d="M165 80 L470 80"
          fill="none"
          stroke="#111827"
          strokeWidth={wireStroke}
          strokeLinecap="round"
        />

        <path
          d={`M600 80 L${meterX - 48} 80`}
          fill="none"
          stroke="#111827"
          strokeWidth={wireStroke}
          strokeLinecap="round"
        />

        <path
          d={`M${meterX} 128 L${meterX} 160 Q${meterX} 185 ${
            meterX - 30
          } 185 L185 185 Q165 185 165 165 L165 145`}
          fill="none"
          stroke="#111827"
          strokeWidth={wireStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="165" cy="80" r="5" fill="#111827" />
        <circle cx="165" cy="145" r="5" fill="#111827" />

        {current > 0 &&
          [0, 1, 2, 3].map((delay) => (
            <circle key={delay} r="6" fill="#16a34a">
              <animateMotion
                dur={`${Math.max(0.8, 6 / flowSpeed)}s`}
                begin={`${delay * 0.45}s`}
                repeatCount="indefinite"
                path={particlePath}
              />
            </circle>
          ))}

        <rect
          x="115"
          y="80"
          width="50"
          height="90"
          rx="8"
          fill="#1f2937"
          stroke="#111827"
          strokeWidth="3"
        />
        <rect x="130" y="68" width="20" height="14" rx="2" fill="#334155" />

        <text
          x="140"
          y="115"
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill="#ef4444"
        >
          +
        </text>

        <text
          x="140"
          y="158"
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill="white"
        >
          -
        </text>

        <text x="35" y="70" fontSize="16" fontWeight="bold">
          Battery
        </text>
        <text x="35" y="95" fontSize="14">
          (Voltage Source)
        </text>
        <text x="35" y="132" fontSize="16" fontWeight="bold" fill="#ef4444">
          Voltage (V)
        </text>
        <text x="35" y="156" fontSize="14">
          = Pressure
        </text>

        <line
          x1="285"
          y1="50"
          x2="370"
          y2="50"
          stroke="#16a34a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polygon points="370,50 352,39 352,61" fill="#16a34a" />

        <text x="300" y="22" fontSize="16" fontWeight="bold">
          Current (I)
        </text>
        <text x="315" y="42" fontSize="14">
          = Flow
        </text>

        <polyline
          points="470,80 490,65 510,95 530,65 550,95 570,65 590,80 600,80"
          fill="none"
          stroke="#111827"
          strokeWidth={wireStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text x="500" y="25" fontSize="16" fontWeight="bold">
          Resistor (R)
        </text>
        <text x="505" y="47" fontSize="14">
          = Resistance
        </text>

        <circle
          cx={meterX}
          cy="80"
          r="48"
          fill="#e5e7eb"
          stroke="#111827"
          strokeWidth="4"
        />
        <circle
          cx={meterX}
          cy="80"
          r="34"
          fill="white"
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {[-130, -80, -30, 20, 70].map((tick) => {
          const rad = (tick * Math.PI) / 180;
          const x1 = meterX + Math.cos(rad) * 26;
          const y1 = 80 + Math.sin(rad) * 26;
          const x2 = meterX + Math.cos(rad) * 32;
          const y2 = 80 + Math.sin(rad) * 32;

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

        <GaugeNeedle cx={meterX} cy={80} angle={angle} />

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
