"use client";

export default function DiodeAnodeCathodeDiagram() {
  return (
    <section className="w-full rounded-3xl bg-white p-4 shadow-xl">
      <svg
        viewBox="0 0 1600 950"
        className="h-auto w-full"
        role="img"
        aria-label="Diode anode and cathode labeled diagram"
      >
        <defs>
          <linearGradient id="metal" x1="0" x2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="45%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          <linearGradient id="body" x1="0" x2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="45%" stopColor="#020617" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>

          <filter id="softShadow">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Title */}
        <text
          x="800"
          y="90"
          textAnchor="middle"
          className="fill-black text-[64px] font-bold"
        >
          Diode
        </text>

        {/* Top schematic terminals */}
        <line x1="330" y1="285" x2="650" y2="285" stroke="#000" strokeWidth="8" />
        <line x1="850" y1="285" x2="1220" y2="285" stroke="#000" strokeWidth="8" />
        <circle cx="315" cy="285" r="24" fill="#fff" stroke="#000" strokeWidth="7" />
        <circle cx="1238" cy="285" r="24" fill="#fff" stroke="#000" strokeWidth="7" />

        {/* Diode symbol */}
        <polygon points="650,185 650,385 850,285" fill="#000" />
        <rect x="850" y="195" width="20" height="185" fill="#000" />

        {/* Top labels */}
        <text x="240" y="215" textAnchor="middle" className="fill-red-600 text-[42px] font-bold">
          Anode
        </text>
        <text x="240" y="270" textAnchor="middle" className="fill-red-600 text-[42px] font-bold">
          (+)
        </text>

        <text x="1295" y="215" textAnchor="middle" className="fill-blue-700 text-[42px] font-bold">
          Cathode
        </text>
        <text x="1295" y="270" textAnchor="middle" className="fill-blue-700 text-[42px] font-bold">
          (−)
        </text>

        <text x="610" y="435" textAnchor="middle" className="fill-red-600 text-[38px] font-bold">
          Anode
        </text>
        <text x="610" y="485" textAnchor="middle" className="fill-red-600 text-[38px] font-bold">
          (+)
        </text>

        <text x="910" y="435" textAnchor="middle" className="fill-blue-700 text-[38px] font-bold">
          Cathode
        </text>
        <text x="910" y="485" textAnchor="middle" className="fill-blue-700 text-[38px] font-bold">
          (−)
        </text>

        {/* Real diode leads */}
        <rect x="255" y="600" width="360" height="28" rx="14" fill="url(#metal)" />
        <rect x="920" y="600" width="360" height="28" rx="14" fill="url(#metal)" />

        {/* Diode body */}
        <g filter="url(#softShadow)">
          <rect x="585" y="545" width="360" height="135" rx="28" fill="url(#body)" />
          <ellipse cx="945" cy="612.5" rx="31" ry="67.5" fill="#111827" />
          <rect x="875" y="545" width="28" height="135" fill="#e5e7eb" opacity="0.9" />
          <rect x="905" y="545" width="18" height="135" fill="#9ca3af" opacity="0.9" />
        </g>

        <text x="750" y="635" textAnchor="middle" className="fill-gray-200 text-[44px] font-medium">
          1N4007
        </text>

        {/* Bottom arrows */}
        <line x1="315" y1="700" x2="315" y2="645" stroke="#dc2626" strokeWidth="7" />
        <polygon points="315,625 300,655 330,655" fill="#dc2626" />

        <text x="315" y="745" textAnchor="middle" className="fill-red-600 text-[38px] font-bold">
          Anode
        </text>
        <text x="315" y="792" textAnchor="middle" className="fill-red-600 text-[38px] font-bold">
          (+)
        </text>

        <line x1="1210" y1="700" x2="1210" y2="645" stroke="#1d4ed8" strokeWidth="7" />
        <polygon points="1210,625 1195,655 1225,655" fill="#1d4ed8" />

        <text x="1210" y="745" textAnchor="middle" className="fill-blue-700 text-[38px] font-bold">
          Cathode
        </text>
        <text x="1210" y="792" textAnchor="middle" className="fill-blue-700 text-[38px] font-bold">
          (−)
        </text>

        {/* Explanation box */}
        <rect
          x="275"
          y="830"
          width="1050"
          height="90"
          rx="10"
          fill="#fff"
          stroke="#000"
          strokeWidth="4"
        />

        <text x="305" y="875" className="text-[30px] font-bold">
          <tspan fill="#dc2626">Anode (+): </tspan>
          <tspan fill="#111827" fontWeight="600">
            Positive terminal. Conventional current enters the diode here.
          </tspan>
        </text>

        <text x="305" y="910" className="text-[30px] font-bold">
          <tspan fill="#1d4ed8">Cathode (−): </tspan>
          <tspan fill="#111827" fontWeight="600">
            Negative terminal. Conventional current exits the diode here.
          </tspan>
        </text>
      </svg>
    </section>
  );
}
