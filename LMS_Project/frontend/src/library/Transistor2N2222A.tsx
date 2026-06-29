"use client";

type Terminal = {
  pin: "1" | "2" | "3";
  name: "Emitter" | "Base" | "Collector";
  x: number;
  color: string;
};

const TERMINALS: Terminal[] = [
  { pin: "1", name: "Emitter", x: 102, color: "#dc2626" },
  { pin: "2", name: "Base", x: 152, color: "#2563eb" },
  { pin: "3", name: "Collector", x: 202, color: "#16a34a" },
];

export default function Transistor2N2222AComponent() {
  return <Transistor2N2222AView compact={false} />;
}

export function Transistor2N2222AView({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex items-center justify-center rounded-[1.75rem] bg-[#f3f4f6] p-4"
          : "rounded-3xl border border-slate-200 bg-white p-4 shadow-xl"
      }
    >
      {compact ? null : (
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Real Package View
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-900">
            Transistor 2N2222A
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            TO-92 style package reference with pin order for identifying Emitter,
            Base, and Collector.
          </p>
        </div>
      )}

      <div
        className={
          compact
            ? "w-full max-w-[180px]"
            : "overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-inner"
        }
      >
        <svg
          viewBox="0 0 300 690"
          className={`mx-auto h-auto w-full ${compact ? "max-w-[180px]" : "max-w-[320px]"}`}
        >
          <defs>
            <linearGradient id="bodyOuter" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#050708" />
              <stop offset="45%" stopColor="#24292b" />
              <stop offset="100%" stopColor="#030404" />
            </linearGradient>

            <linearGradient id="bodyInner" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2c3436" />
              <stop offset="48%" stopColor="#111616" />
              <stop offset="100%" stopColor="#020303" />
            </linearGradient>

            <linearGradient id="pinMetal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#817d77" />
              <stop offset="22%" stopColor="#d0ccc4" />
              <stop offset="50%" stopColor="#fffaf0" />
              <stop offset="76%" stopColor="#b6b1a9" />
              <stop offset="100%" stopColor="#77736e" />
            </linearGradient>

            <linearGradient id="highlight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          <rect width="300" height="690" fill="#f8fafc" />

          {TERMINALS.map((terminal) => (
            <g key={terminal.pin}>
              <rect
                x={terminal.x - 7}
                y="360"
                width="14"
                height="245"
                rx="5"
                fill="url(#pinMetal)"
              />
              <circle cx={terminal.x} cy="610" r="9" fill={terminal.color} opacity="0.15" />
              <text
                x={terminal.x}
                y="645"
                textAnchor="middle"
                fontSize="20"
                fontWeight="900"
                fill={terminal.color}
              >
                {terminal.pin}
              </text>
              <text
                x={terminal.x}
                y="668"
                textAnchor="middle"
                fontSize="15"
                fontWeight="800"
                fill="#0f172a"
              >
                {terminal.name}
              </text>
            </g>
          ))}

          <path
            d="M72 142 C82 82 118 44 152 44 C186 44 222 82 232 142 L232 310 C232 344 194 372 152 372 C110 372 72 344 72 310 Z"
            fill="url(#bodyOuter)"
          />

          <path
            d="M88 148 C96 104 122 74 152 74 C182 74 208 104 216 148 L216 300 C216 324 188 344 152 344 C116 344 88 324 88 300 Z"
            fill="url(#bodyInner)"
          />

          <path
            d="M102 120 C118 92 136 78 154 76 C126 104 114 168 114 244 C114 286 118 320 128 342 C108 332 94 318 88 300 L88 148 C92 138 97 128 102 120 Z"
            fill="url(#highlight)"
            opacity="0.55"
          />

          <text
            x="152"
            y="176"
            textAnchor="middle"
            fontSize="26"
            fontWeight="900"
            fill="#f8fafc"
          >
            2N2222A
          </text>
          <text
            x="152"
            y="204"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#cbd5e1"
          >
            NPN BJT
          </text>
          <text
            x="152"
            y="230"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#94a3b8"
          >
            Front View Pinout
          </text>

          <circle cx="90" cy="316" r="8" fill="#e2e8f0" opacity="0.85" />

          <line x1="102" y1="352" x2="102" y2="390" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="5 5" />
          <line x1="152" y1="352" x2="152" y2="390" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5 5" />
          <line x1="202" y1="352" x2="202" y2="390" stroke="#16a34a" strokeWidth="2.5" strokeDasharray="5 5" />
        </svg>
      </div>
    </div>
  );
}
