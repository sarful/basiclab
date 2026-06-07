"use client";

import React, { useMemo, useState } from "react";

export type CutawayPartKey =
  | "cover"
  | "coil"
  | "core"
  | "armature"
  | "spring"
  | "mainContacts"
  | "auxContacts"
  | "terminals";

export interface ContactorCutawayViewProps {
  energized?: boolean;
  initialCoverVisible?: boolean;
  initialExploded?: boolean;
  highlightedPart?: CutawayPartKey | null;
  showLabels?: boolean;
  className?: string;
}

const partInfo: Record<CutawayPartKey, { title: string; description: string }> = {
  cover: {
    title: "Front Cover",
    description: "Protective plastic housing. In cutaway mode it becomes transparent so internal parts are visible.",
  },
  coil: {
    title: "Coil Assembly",
    description: "A1 and A2 coil terminals energize the winding and create the magnetic field.",
  },
  core: {
    title: "Iron Core",
    description: "Guides magnetic flux and strengthens the pull force on the armature.",
  },
  armature: {
    title: "Moving Armature",
    description: "Moves toward the core when the coil is energized and drives the contacts.",
  },
  spring: {
    title: "Return Spring",
    description: "Pushes the armature back when the coil is de-energized.",
  },
  mainContacts: {
    title: "Main Power Contacts",
    description: "Three main poles connect L1/L2/L3 to T1/T2/T3 when the contactor closes.",
  },
  auxContacts: {
    title: "Auxiliary Contacts",
    description: "NO/NC control contacts used for holding circuits, signals, and interlocks.",
  },
  terminals: {
    title: "Terminal Blocks",
    description: "External screw terminals for power lines, load lines, and control wiring.",
  },
};

function cx(...items: Array<string | false | undefined | null>) {
  return items.filter(Boolean).join(" ");
}

function Label({ x, y, text, targetX, targetY, active }: { x: number; y: number; text: string; targetX: number; targetY: number; active?: boolean }) {
  return (
    <g className="pointer-events-none">
      <path
        d={`M ${x} ${y + 5} L ${targetX} ${targetY}`}
        stroke={active ? "#f59e0b" : "#64748b"}
        strokeWidth={active ? 2.5 : 1.5}
        strokeDasharray="4 4"
        fill="none"
      />
      <rect x={x - 8} y={y - 17} width={text.length * 7.2 + 16} height="24" rx="6" fill={active ? "#fef3c7" : "#f8fafc"} stroke={active ? "#f59e0b" : "#cbd5e1"} />
      <text x={x} y={y} fontSize="12" fontWeight="700" fill={active ? "#92400e" : "#334155"}>
        {text}
      </text>
    </g>
  );
}

function MagneticFieldLines({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <g opacity="0.75">
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M ${250 - i * 14} ${305 - i * 15} C ${205 - i * 10} ${250}, ${220 - i * 5} ${175}, 310 ${165} C ${410 + i * 10} ${175}, ${420 + i * 6} ${250}, ${370 + i * 14} ${305 - i * 15}`}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="8 6"
        >
          <animate attributeName="stroke-dashoffset" values="0;-28" dur="1.2s" repeatCount="indefinite" />
        </path>
      ))}
    </g>
  );
}

export default function ContactorCutawayView({
  energized: controlledEnergized,
  initialCoverVisible = false,
  initialExploded = false,
  highlightedPart = null,
  showLabels = true,
  className,
}: ContactorCutawayViewProps) {
  const [localEnergized, setLocalEnergized] = useState(false);
  const [coverVisible, setCoverVisible] = useState(initialCoverVisible);
  const [exploded, setExploded] = useState(initialExploded);
  const [hovered, setHovered] = useState<CutawayPartKey | null>(null);

  const energized = controlledEnergized ?? localEnergized;
  const activePart = hovered ?? highlightedPart;
  const info = activePart ? partInfo[activePart] : null;

  const movement = useMemo(() => {
    return {
      armatureY: energized ? 18 : 0,
      springScale: energized ? 0.68 : 1,
      contactGap: energized ? 0 : 18,
      coilGlow: energized ? 0.36 : 0,
    };
  }, [energized]);

  const offset = (part: CutawayPartKey) => {
    if (!exploded) return { x: 0, y: 0 };
    const map: Record<CutawayPartKey, { x: number; y: number }> = {
      cover: { x: 95, y: -5 },
      coil: { x: -80, y: 15 },
      core: { x: 0, y: 0 },
      armature: { x: 0, y: -40 },
      spring: { x: -70, y: -35 },
      mainContacts: { x: 80, y: 18 },
      auxContacts: { x: 105, y: -24 },
      terminals: { x: 0, y: 0 },
    };
    return map[part];
  };

  const isActive = (part: CutawayPartKey) => activePart === part;

  return (
    <div className={cx("w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm", className)}>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Magnetic Contactor Cutaway View</h2>
          <p className="text-sm text-slate-500">Internal construction with coil, core, armature, spring, main contacts, and auxiliary contacts.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {controlledEnergized === undefined && (
            <button onClick={() => setLocalEnergized((v) => !v)} className={cx("rounded-lg px-3 py-2 text-sm font-semibold text-white", energized ? "bg-emerald-600" : "bg-slate-700")}>
              Coil {energized ? "ON" : "OFF"}
            </button>
          )}
          <button onClick={() => setCoverVisible((v) => !v)} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
            Cover {coverVisible ? "ON" : "OFF"}
          </button>
          <button onClick={() => setExploded((v) => !v)} className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white">
            {exploded ? "Normal View" : "Exploded View"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl bg-slate-50 p-3">
          <svg viewBox="0 0 720 560" className="h-auto w-full" role="img" aria-label="Magnetic contactor internal cutaway diagram">
            <defs>
              <linearGradient id="housing" x1="0" x2="1">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="50%" stopColor="#2f3a46" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="terminal" x1="0" x2="1">
                <stop offset="0%" stopColor="#d8d8ce" />
                <stop offset="50%" stopColor="#f5f5eb" />
                <stop offset="100%" stopColor="#c7c7bd" />
              </linearGradient>
              <linearGradient id="steel" x1="0" x2="1">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect x="175" y="55" width="370" height="455" rx="18" fill="#0f172a" opacity="0.08" />

            {/* Terminal blocks */}
            <g transform={`translate(${offset("terminals").x} ${offset("terminals").y})`} onMouseEnter={() => setHovered("terminals")} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <rect x="185" y="70" width="350" height="70" rx="10" fill="url(#terminal)" stroke={isActive("terminals") ? "#f59e0b" : "#b6b7ad"} strokeWidth={isActive("terminals") ? 4 : 2} />
              <rect x="185" y="430" width="350" height="70" rx="10" fill="url(#terminal)" stroke={isActive("terminals") ? "#f59e0b" : "#b6b7ad"} strokeWidth={isActive("terminals") ? 4 : 2} />
              {[245, 360, 475].map((x, i) => (
                <g key={x}>
                  <circle cx={x} cy="105" r="22" fill="#334155" />
                  <path d={`M${x - 13} 105 H${x + 13}`} stroke="#e2e8f0" strokeWidth="4" />
                  <text x={x - 18} y="88" fontSize="12" fontWeight="700" fill="#64748b">{["1/L1", "3/L2", "5/L3"][i]}</text>
                  <circle cx={x} cy="465" r="22" fill="#334155" />
                  <path d={`M${x - 13} 465 H${x + 13}`} stroke="#e2e8f0" strokeWidth="4" />
                  <text x={x - 18} y="494" fontSize="12" fontWeight="700" fill="#64748b">{["2/T1", "4/T2", "6/T3"][i]}</text>
                </g>
              ))}
            </g>

            {/* Main housing cutaway */}
            <rect x="185" y="140" width="350" height="290" rx="8" fill="url(#housing)" stroke="#020617" strokeWidth="2" />
            <rect x="210" y="165" width="300" height="235" rx="10" fill="#f8fafc" opacity="0.1" stroke="#475569" strokeDasharray="8 8" />

            <MagneticFieldLines visible={energized} />

            {/* Coil */}
            <g transform={`translate(${offset("coil").x} ${offset("coil").y})`} onMouseEnter={() => setHovered("coil")} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <rect x="247" y="240" width="226" height="94" rx="14" fill="#fef3c7" opacity={movement.coilGlow} filter="url(#glow)" />
              <rect x="250" y="245" width="220" height="85" rx="12" fill="#7c2d12" opacity="0.95" stroke={isActive("coil") ? "#f59e0b" : "#431407"} strokeWidth={isActive("coil") ? 4 : 2} />
              {Array.from({ length: 24 }).map((_, i) => (
                <path key={i} d={`M ${262 + i * 8} 255 Q ${268 + i * 8} 287 ${262 + i * 8} 320`} fill="none" stroke={energized ? "#fbbf24" : "#f59e0b"} strokeWidth="4" strokeLinecap="round" />
              ))}
              <circle cx="238" cy="287" r="9" fill={energized ? "#22c55e" : "#94a3b8"} />
              <circle cx="482" cy="287" r="9" fill={energized ? "#22c55e" : "#94a3b8"} />
              <text x="220" y="290" fontSize="13" fontWeight="800" fill="#e2e8f0">A1</text>
              <text x="490" y="290" fontSize="13" fontWeight="800" fill="#e2e8f0">A2</text>
            </g>

            {/* Iron core */}
            <g transform={`translate(${offset("core").x} ${offset("core").y})`} onMouseEnter={() => setHovered("core")} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <rect x="335" y="180" width="50" height="185" rx="8" fill="url(#steel)" stroke={isActive("core") ? "#f59e0b" : "#334155"} strokeWidth={isActive("core") ? 4 : 2} />
              <rect x="347" y="190" width="8" height="165" rx="4" fill="#f8fafc" opacity="0.35" />
            </g>

            {/* Armature */}
            <g transform={`translate(${offset("armature").x} ${offset("armature").y + movement.armatureY})`} onMouseEnter={() => setHovered("armature")} onMouseLeave={() => setHovered(null)} className="cursor-pointer transition-transform duration-300">
              <rect x="250" y="170" width="220" height="22" rx="5" fill="#475569" stroke={isActive("armature") ? "#f59e0b" : "#1e293b"} strokeWidth={isActive("armature") ? 4 : 2} />
              <rect x="280" y="192" width="160" height="18" rx="4" fill="#64748b" />
              <circle cx="250" cy="181" r="9" fill="#ef4444" />
            </g>

            {/* Return spring */}
            <g transform={`translate(${offset("spring").x} ${offset("spring").y})`} onMouseEnter={() => setHovered("spring")} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <path
                d={Array.from({ length: 9 }).map((_, i) => `${i === 0 ? "M" : "L"} ${225 + (i % 2 === 0 ? 0 : 22)} ${175 + i * 8 * movement.springScale}`).join(" ")}
                fill="none"
                stroke={isActive("spring") ? "#f59e0b" : "#94a3b8"}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line x1="225" y1="170" x2="247" y2="170" stroke="#94a3b8" strokeWidth="4" />
              <line x1="225" y1={175 + 8 * 8 * movement.springScale} x2="247" y2={175 + 8 * 8 * movement.springScale} stroke="#94a3b8" strokeWidth="4" />
            </g>

            {/* Main contacts */}
            <g transform={`translate(${offset("mainContacts").x} ${offset("mainContacts").y})`} onMouseEnter={() => setHovered("mainContacts")} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              {[245, 360, 475].map((x, i) => (
                <g key={x}>
                  <line x1={x} y1="140" x2={x} y2="226" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
                  <line x1={x} y1="344" x2={x} y2="430" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
                  <circle cx={x} cy="226" r="12" fill="#fbbf24" stroke={isActive("mainContacts") ? "#f59e0b" : "#92400e"} strokeWidth={isActive("mainContacts") ? 4 : 2} />
                  <circle cx={x} cy={344 - movement.contactGap} r="12" fill="#fbbf24" stroke={isActive("mainContacts") ? "#f59e0b" : "#92400e"} strokeWidth={isActive("mainContacts") ? 4 : 2} />
                  {energized && <line x1={x} y1="238" x2={x} y2="332" stroke="#22c55e" strokeWidth="5" strokeDasharray="8 7"><animate attributeName="stroke-dashoffset" values="0;-30" dur="0.7s" repeatCount="indefinite" /></line>}
                  <text x={x - 9} y="157" fontSize="12" fontWeight="800" fill="#e2e8f0">L{i + 1}</text>
                  <text x={x - 9} y="420" fontSize="12" fontWeight="800" fill="#e2e8f0">T{i + 1}</text>
                </g>
              ))}
            </g>

            {/* Auxiliary contacts */}
            <g transform={`translate(${offset("auxContacts").x} ${offset("auxContacts").y})`} onMouseEnter={() => setHovered("auxContacts")} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <rect x="520" y="190" width="70" height="155" rx="10" fill="#1e293b" stroke={isActive("auxContacts") ? "#f59e0b" : "#334155"} strokeWidth={isActive("auxContacts") ? 4 : 2} />
              <text x="535" y="215" fontSize="12" fontWeight="800" fill="#cbd5e1">AUX</text>
              <line x1="540" y1="240" x2="570" y2={energized ? 240 : 260} stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
              <text x="532" y="232" fontSize="10" fill="#e2e8f0">13-14 NO</text>
              <line x1="540" y1="300" x2="570" y2={energized ? 320 : 300} stroke="#fb7185" strokeWidth="5" strokeLinecap="round" />
              <text x="532" y="292" fontSize="10" fill="#e2e8f0">21-22 NC</text>
            </g>

            {/* Transparent cover */}
            {coverVisible && (
              <g transform={`translate(${offset("cover").x} ${offset("cover").y})`} onMouseEnter={() => setHovered("cover")} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
                <rect x="185" y="140" width="350" height="290" rx="18" fill="#0f172a" opacity="0.22" stroke={isActive("cover") ? "#f59e0b" : "#94a3b8"} strokeWidth={isActive("cover") ? 4 : 2} />
                <rect x="230" y="210" width="260" height="130" rx="16" fill="#e0f2fe" opacity="0.18" stroke="#bae6fd" strokeDasharray="10 8" />
                <text x="300" y="282" fontSize="18" fontWeight="800" fill="#e0f2fe">Transparent Cover</text>
              </g>
            )}

            {showLabels && (
              <g>
                <Label x={65} y={120} text="Terminals" targetX={220} targetY={100} active={isActive("terminals")} />
                <Label x={70} y={260} text="Coil" targetX={270} targetY={280} active={isActive("coil")} />
                <Label x={72} y={330} text="Iron Core" targetX={360} targetY={250} active={isActive("core")} />
                <Label x={75} y={185} text="Spring" targetX={235} targetY={205} active={isActive("spring")} />
                <Label x={500} y={155} text="Armature" targetX={390} targetY={182} active={isActive("armature")} />
                <Label x={575} y={365} text="Main Contacts" targetX={475} targetY={315} active={isActive("mainContacts")} />
                <Label x={575} y={245} text="Aux Contacts" targetX={555} targetY={255} active={isActive("auxContacts")} />
              </g>
            )}
          </svg>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 rounded-lg bg-white p-3 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Status</div>
            <div className={cx("mt-1 text-lg font-bold", energized ? "text-emerald-600" : "text-slate-700")}>
              Coil {energized ? "Energized" : "De-Energized"}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {energized ? "Armature pulled, main NO contacts closed, auxiliary NO closed." : "Spring returned, main NO contacts open, auxiliary NC closed."}
            </p>
          </div>

          <div className="rounded-lg bg-white p-3 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Part Inspector</div>
            {info ? (
              <>
                <h3 className="mt-1 text-base font-bold text-slate-900">{info.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{info.description}</p>
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-slate-500">Hover any internal part to inspect its function.</p>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
            {Object.keys(partInfo).map((key) => (
              <button
                key={key}
                onMouseEnter={() => setHovered(key as CutawayPartKey)}
                onMouseLeave={() => setHovered(null)}
                className={cx("rounded-lg border px-2 py-2 text-left", activePart === key ? "border-amber-400 bg-amber-50 text-amber-800" : "border-slate-200 bg-white")}
              >
                {partInfo[key as CutawayPartKey].title}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
