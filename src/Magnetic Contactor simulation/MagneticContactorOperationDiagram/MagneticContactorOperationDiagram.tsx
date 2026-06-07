"use client";

import React, { useMemo, useState } from "react";

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

export default function MagneticContactorOperationDiagram() {
  const [energized, setEnergized] = useState(false);

  const state = useMemo(() => {
    return {
      mainClosed: energized,
      noClosed: energized,
      ncClosed: !energized,
      loadOn: energized,
      bridgeLift: energized ? -28 : 0,
      coilGlow: energized ? 1 : 0.2,
      fieldOpacity: energized ? 1 : 0,
    };
  }, [energized]);

  const handleReset = () => setEnergized(false);

  return (
    <div className="min-h-screen w-full bg-[#f5f6fb] p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1560px] rounded-[32px] bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.16)] md:p-6">
        <div className="grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-[24px] border border-[#aeb7c1] bg-[linear-gradient(180deg,#ffffff_0%,#f4f5f8_100%)] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
              <h2 className="mb-4 text-center text-[20px] font-black uppercase tracking-tight text-[#1e40af] md:text-[22px]">
                Controls
              </h2>

              <div className="grid gap-4">
                <div className="grid grid-cols-[70px_1fr] items-center gap-3">
                  <div className="text-[20px] font-black text-[#1e40af]">COIL</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEnergized(false)}
                      className={cx(
                        "rounded-[10px] border px-4 py-3 text-[18px] font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition",
                        !energized
                          ? "border-[#8f1010] bg-[linear-gradient(180deg,#ff2d2d_0%,#c91212_100%)]"
                          : "border-[#d26767] bg-[linear-gradient(180deg,#f87171_0%,#dc2626_100%)] opacity-80",
                      )}
                    >
                      OFF
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnergized(true)}
                      className={cx(
                        "rounded-[10px] border px-4 py-3 text-[18px] font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition",
                        energized
                          ? "border-[#0b5f1c] bg-[linear-gradient(180deg,#179b31_0%,#0b7a21_100%)]"
                          : "border-[#5aa970] bg-[linear-gradient(180deg,#4ade80_0%,#16a34a_100%)] opacity-80",
                      )}
                    >
                      ON
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEnergized((value) => !value)}
                    className="rounded-[12px] border border-[#12367d] bg-[linear-gradient(180deg,#2563eb_0%,#1746a2_100%)] px-4 py-3 text-[18px] font-black text-white shadow-[0_6px_14px_rgba(37,99,235,0.22)]"
                  >
                    ANIMATE ▶
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-[12px] border border-[#5b616d] bg-[linear-gradient(180deg,#7b8391_0%,#606775_100%)] px-4 py-3 text-[18px] font-black text-white shadow-[0_6px_14px_rgba(71,85,105,0.18)]"
                  >
                    RESET ↻
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-300 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-center text-[20px] font-black uppercase text-[#1e40af]">
                Operation Status
              </h3>
              <div className="space-y-3 text-[15px] font-bold">
                {[
                  ["COIL (A1-A2)", energized ? "ON" : "OFF", energized ? "text-[#0f8a27]" : "text-[#e21a1a]"],
                  ["MAGNETIC FIELD", energized ? "ON" : "OFF", energized ? "text-[#0f8a27]" : "text-[#e21a1a]"],
                  ["MAIN CONTACTS", energized ? "CLOSED" : "OPEN", energized ? "text-[#0f8a27]" : "text-[#e21a1a]"],
                  ["NC CONTACT", energized ? "OPEN" : "CLOSED", energized ? "text-[#e21a1a]" : "text-[#0f8a27]"],
                  ["NO CONTACT", energized ? "CLOSED" : "OPEN", energized ? "text-[#0f8a27]" : "text-[#e21a1a]"],
                  ["LOAD", energized ? "ON" : "OFF", energized ? "text-[#0f8a27]" : "text-[#e21a1a]"],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-slate-900">
                      <span className="h-4 w-4 rounded-full border border-black bg-[radial-gradient(circle_at_35%_35%,#d1d5db,#4b5563)]" />
                      <span>{label}</span>
                    </div>
                    <span className={cx("text-right text-[16px] font-black", color)}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="overflow-hidden rounded-[28px] bg-white">
            <div className="mb-4 flex flex-col items-center gap-3">
              <div className="w-full max-w-[900px] rounded-[18px] bg-[#0f2347] px-6 py-4 text-center text-[28px] font-black uppercase tracking-wide text-white shadow-[0_16px_30px_rgba(15,35,71,0.26)] md:text-[36px]">
                Magnetic Contactor - Operation Diagram
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5 text-center text-[24px] font-black uppercase text-white">
                <div className="rounded-[12px] bg-[#9ca3af] px-6 py-2 shadow-sm">
                  Coil Off (De-Energized)
                </div>
                <div className="rounded-[12px] bg-[#0f8a27] px-6 py-2 shadow-sm">
                  Coil On (Energized)
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 1380 980"
                className="h-auto w-full min-w-[1180px]"
                role="img"
                aria-label="Magnetic contactor operation diagram"
              >
                <defs>
                  <linearGradient id="panelMetal" x1="0" x2="1">
                    <stop offset="0%" stopColor="#d1d5db" />
                    <stop offset="50%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#9ca3af" />
                  </linearGradient>
                  <linearGradient id="copper" x1="0" x2="1">
                    <stop offset="0%" stopColor="#f1b28d" />
                    <stop offset="50%" stopColor="#cf7b42" />
                    <stop offset="100%" stopColor="#f3c0a0" />
                  </linearGradient>
                  <linearGradient id="iron" x1="0" x2="1">
                    <stop offset="0%" stopColor="#505862" />
                    <stop offset="50%" stopColor="#aeb7c1" />
                    <stop offset="100%" stopColor="#39414b" />
                  </linearGradient>
                  <linearGradient id="coreBrown" x1="0" x2="1">
                    <stop offset="0%" stopColor="#8c520f" />
                    <stop offset="50%" stopColor="#b56f18" />
                    <stop offset="100%" stopColor="#6b3d09" />
                  </linearGradient>
                  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="12" floodOpacity="0.18" />
                  </filter>
                  <filter id="coilGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <text x="125" y="140" fontSize="22" fontWeight="900" fill="#1e40af">MAIN SUPPLY (3-PHASE)</text>
                <text x="580" y="100" fontSize="22" fontWeight="900" fill="#1e40af">MOVING CONTACT BRIDGE</text>
                <text x="970" y="120" fontSize="22" fontWeight="900" fill="#1e40af">MAIN CONTACTS</text>

                <text x="42" y="173" fontSize="26" fontWeight="900" fill="#e21a1a">L1</text>
                <text x="42" y="268" fontSize="26" fontWeight="900" fill="#f4b400">L2</text>
                <text x="42" y="363" fontSize="26" fontWeight="900" fill="#1746a2">L3</text>

                {[165, 260, 355].map((y, index) => (
                  <circle key={y} cx="92" cy={y} r="7" fill="#fff" stroke="#111" strokeWidth="2.5" />
                ))}

                <path d="M 92 165 H 395" stroke="#e21a1a" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M 92 260 H 395" stroke="#f4b400" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M 92 355 H 395" stroke="#1746a2" strokeWidth="6" fill="none" strokeLinecap="round" />

                {[145, 240, 335].map((y) => (
                  <g key={y} filter="url(#softShadow)">
                    <rect x="395" y={y} width="66" height="52" rx="4" fill="url(#panelMetal)" stroke="#333" strokeWidth="2" />
                    <circle cx="428" cy={y + 26} r="15" fill="#8b8b8b" stroke="#111" strokeWidth="2" />
                    <path d={`M418 ${y + 16} L438 ${y + 36} M438 ${y + 16} L418 ${y + 36}`} stroke="#111" strokeWidth="3" />
                  </g>
                ))}

                {[164, 259, 354].map((y, idx) => (
                  <g key={y}>
                    <rect x="461" y={y - 5} width="115" height="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="1.5" />
                    <circle cx="582" cy={y} r="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                    <rect x="560" y={y - 8} width="40" height="16" rx="2" fill="url(#copper)" stroke="#5d3420" strokeWidth="1.5" />
                  </g>
                ))}

                <g
                  style={{
                    transform: `translateY(${state.bridgeLift}px)`,
                    transition: "transform 450ms ease",
                  }}
                >
                  {[125, 220, 315].map((y, idx) => (
                    <g key={y}>
                      <rect x="560" y={y} width="240" height="18" rx="3" fill="url(#panelMetal)" stroke="#222" strokeWidth="2" />
                      <circle cx="578" cy={y + 18} r="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                      <circle cx="782" cy={y + 18} r="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                    </g>
                  ))}
                </g>

                <rect x="665" y="143" width="28" height="455" fill="url(#iron)" stroke="#20262d" strokeWidth="3" />

                {[145, 240, 335].map((y) => (
                  <g key={y} filter="url(#softShadow)">
                    <rect x="885" y={y} width="66" height="52" rx="4" fill="url(#panelMetal)" stroke="#333" strokeWidth="2" />
                    <circle cx="918" cy={y + 26} r="15" fill="#8b8b8b" stroke="#111" strokeWidth="2" />
                    <path d={`M908 ${y + 16} L928 ${y + 36} M928 ${y + 16} L908 ${y + 36}`} stroke="#111" strokeWidth="3" />
                  </g>
                ))}

                {[164, 259, 354].map((y) => (
                  <g key={y}>
                    <rect x="799" y={y - 5} width="86" height="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="1.5" />
                    <circle cx="800" cy={y} r="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                  </g>
                ))}

                <path d="M 951 165 H 1285 V 265 H 1325" stroke="#e21a1a" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M 951 260 H 1180 Q 1180 276 1196 276 H 1325" stroke="#f4b400" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M 951 355 H 1325" stroke="#1746a2" strokeWidth="6" fill="none" strokeLinecap="round" />

                <circle cx="1325" cy="275" r="66" fill="#fff" stroke="#111" strokeWidth="4" />
                <path d="M1325 209 V341 M1259 275 H1391" stroke="#111" strokeWidth="4" />
                <path d="M1325 209 H1391 V275 H1325 Z" fill="#000" />
                <path d="M1259 275 H1325 V341 H1259 Z" fill="#1b8fe3" />
                <text x="1318" y="390" fontSize="22" fontWeight="900" fill="#1e40af">LOAD</text>

                <path d="M 692 392 H 1070 V 458" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M 692 408 H 1132 V 506" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" />

                <g filter="url(#softShadow)">
                  <rect x="880" y="445" width="58" height="50" rx="4" fill="url(#panelMetal)" stroke="#333" strokeWidth="2" />
                  <circle cx="909" cy="470" r="14" fill="#8b8b8b" stroke="#111" strokeWidth="2" />
                  <path d="M898 459 L920 481 M920 459 L898 481" stroke="#111" strokeWidth="3" />
                  <rect x="968" y="460" width="60" height="12" fill="url(#copper)" stroke="#5d3420" strokeWidth="1.5" />
                  <circle cx="987" cy="458" r="11" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                  <rect x="1035" y="462" width="60" height="10" fill="#8d6e3f" stroke="#3d2a12" strokeWidth="1.5" />
                  <circle cx="1044" cy="457" r="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                  <circle cx="1152" cy="457" r="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                  <rect x="1125" y="460" width="75" height="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="1.5" />
                  <rect x="1210" y="445" width="58" height="50" rx="4" fill="url(#panelMetal)" stroke="#333" strokeWidth="2" />
                  <circle cx="1239" cy="470" r="14" fill="#8b8b8b" stroke="#111" strokeWidth="2" />
                  <path d="M1228 459 L1250 481 M1250 459 L1228 481" stroke="#111" strokeWidth="3" />
                </g>

                <g filter="url(#softShadow)">
                  <rect x="880" y="535" width="58" height="50" rx="4" fill="url(#panelMetal)" stroke="#333" strokeWidth="2" />
                  <circle cx="909" cy="560" r="14" fill="#8b8b8b" stroke="#111" strokeWidth="2" />
                  <path d="M898 549 L920 571 M920 549 L898 571" stroke="#111" strokeWidth="3" />
                  <rect x="968" y="555" width="60" height="12" fill="url(#copper)" stroke="#5d3420" strokeWidth="1.5" />
                  <circle cx="987" cy="558" r="11" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                  <rect x="1046" y="554" width="44" height="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="1.5" />
                  <circle cx={state.noClosed ? 1107 : 1080} cy={state.noClosed ? 557 : 563} r="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" style={{ transition: "all 450ms ease" }} />
                  <rect x="1125" y="555" width="75" height="10" fill="url(#copper)" stroke="#5d3420" strokeWidth="1.5" />
                  <circle cx="1170" cy="558" r="11" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                  <rect x="1210" y="535" width="58" height="50" rx="4" fill="url(#panelMetal)" stroke="#333" strokeWidth="2" />
                  <circle cx="1239" cy="560" r="14" fill="#8b8b8b" stroke="#111" strokeWidth="2" />
                  <path d="M1228 549 L1250 571 M1250 549 L1228 571" stroke="#111" strokeWidth="3" />
                </g>

                <text x="1282" y="468" fontSize="22" fontWeight="900" fill="#e21a1a">NC</text>
                <text x="1282" y="490" fontSize="18" fontWeight="800" fill="#111">(NORMALLY CLOSED)</text>
                <text x="1282" y="557" fontSize="22" fontWeight="900" fill="#0f8a27">NO</text>
                <text x="1282" y="579" fontSize="18" fontWeight="800" fill="#111">(NORMALLY OPEN)</text>
                <text x="1018" y="615" fontSize="22" fontWeight="900" fill="#1e40af">AUXILIARY CONTACTS</text>

                <path d="M 473 620 H 580 Q 595 620 595 605 V 578" stroke="#e21a1a" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M 473 700 H 595 V 623" stroke="#111" strokeWidth="5" fill="none" strokeLinecap="round" />
                <text x="372" y="657" fontSize="22" fontWeight="900" fill="#1e40af">COIL</text>
                <path d="M430 650 H 402 M430 700 H 402 M402 620 V 705" stroke="#1e40af" strokeWidth="2" fill="none" />

                <rect x="430" y="603" width="42" height="34" rx="4" fill="#fff" stroke="#9ca3af" strokeWidth="2" />
                <circle cx="480" cy="620" r="10" fill="#e5e7eb" stroke="#111" strokeWidth="2" />
                <text x="438" y="628" fontSize="24" fontWeight="900" fill="#1e40af">A1</text>

                <rect x="430" y="683" width="42" height="34" rx="4" fill="#fff" stroke="#9ca3af" strokeWidth="2" />
                <circle cx="480" cy="700" r="10" fill="#e5e7eb" stroke="#111" strokeWidth="2" />
                <text x="438" y="708" fontSize="24" fontWeight="900" fill="#1e40af">A2</text>

                <g filter="url(#softShadow)">
                  <path d="M540 515 H640 V555 H680 V515 H780 V610 H680 V570 H640 V610 H540 Z" fill="url(#coreBrown)" stroke="#4b2e08" strokeWidth="3" />
                  <path d="M540 675 H640 V625 H680 V675 H780 V800 H680 V760 H640 V800 H540 Z" fill="url(#coreBrown)" stroke="#4b2e08" strokeWidth="3" />
                </g>

                <rect x="632" y="598" width="56" height="124" rx="10" fill="#111" opacity="0.22" />
                <rect x="630" y="595" width="58" height="126" rx="10" fill="#36220d" stroke="#160d04" strokeWidth="2" />
                {Array.from({ length: 10 }).map((_, index) => (
                  <ellipse
                    key={index}
                    cx="659"
                    cy={610 + index * 11}
                    rx="47"
                    ry="7"
                    fill="none"
                    stroke="#cf6f2d"
                    strokeWidth="4"
                  />
                ))}

                {energized && (
                  <g opacity={state.fieldOpacity}>
                    {[0, 1, 2].map((index) => (
                      <ellipse
                        key={index}
                        cx="659"
                        cy="660"
                        rx={55 + index * 22}
                        ry={20 + index * 10}
                        fill="none"
                        stroke="#58b6ff"
                        strokeWidth="3"
                        filter="url(#coilGlow)"
                      >
                        <animate attributeName="stroke-dashoffset" values="0;-20" dur="1.1s" repeatCount="indefinite" />
                      </ellipse>
                    ))}
                  </g>
                )}

                <circle cx="557" cy="760" r="4" fill="#111" />
                <text x="402" y="780" fontSize="20" fontWeight="900" fill="#1e40af">CONTACTOR</text>
                <text x="418" y="805" fontSize="20" fontWeight="900" fill="#1e40af">(FRAME)</text>
                <line x1="520" y1="773" x2="553" y2="773" stroke="#111" strokeWidth="3" />

                <circle cx="803" cy="755" r="4" fill="#111" />
                <text x="822" y="765" fontSize="20" fontWeight="900" fill="#1e40af">IRON CORE</text>
                <line x1="804" y1="755" x2="860" y2="755" stroke="#111" strokeWidth="3" />

                <g transform={`translate(0 ${state.bridgeLift})`} style={{ transition: "transform 450ms ease" }}>
                  {[164, 259, 354].map((y) => (
                    <g key={y}>
                      {energized && (
                        <line x1={582} y1={y + 18} x2={800} y2={y} stroke="#22c55e" strokeWidth="4" opacity="0.18" />
                      )}
                    </g>
                  ))}
                </g>

                <g transform="translate(0 0)">
                  <rect x="305" y="850" width="680" height="120" rx="16" fill="#fafafa" stroke="#b6c0cc" strokeWidth="2" />
                  <text x="645" y="885" textAnchor="middle" fontSize="22" fontWeight="900" fill="#1e40af">HOW IT WORKS</text>
                  <text x="332" y="915" fontSize="18" fontWeight="700" fill="#111">
                    When the coil (A1-A2) is
                  </text>
                  <text x="522" y="915" fontSize="18" fontWeight="900" fill="#0f8a27">energized</text>
                  <text x="625" y="915" fontSize="18" fontWeight="700" fill="#111">, it generates a magnetic field that pulls the</text>
                  <text x="332" y="945" fontSize="18" fontWeight="700" fill="#111">armature up. This</text>
                  <text x="476" y="945" fontSize="18" fontWeight="900" fill="#0f8a27">closes</text>
                  <text x="552" y="945" fontSize="18" fontWeight="700" fill="#111">the main contacts, closes the</text>
                  <text x="790" y="945" fontSize="18" fontWeight="900" fill="#0f8a27">NO</text>
                  <text x="822" y="945" fontSize="18" fontWeight="700" fill="#111">contact and</text>
                  <text x="919" y="945" fontSize="18" fontWeight="900" fill="#e21a1a">opens</text>
                  <text x="332" y="972" fontSize="18" fontWeight="700" fill="#111">the</text>
                  <text x="370" y="972" fontSize="18" fontWeight="900" fill="#e21a1a">NC</text>
                  <text x="402" y="972" fontSize="18" fontWeight="700" fill="#111">contact. Current then flows from the</text>
                  <text x="696" y="972" fontSize="18" fontWeight="900" fill="#1746a2">supply</text>
                  <text x="762" y="972" fontSize="18" fontWeight="700" fill="#111">to the</text>
                  <text x="829" y="972" fontSize="18" fontWeight="900" fill="#1746a2">load</text>
                  <text x="868" y="972" fontSize="18" fontWeight="700" fill="#111">.</text>
                </g>

                <g transform="translate(1135 742)">
                  <rect width="215" height="210" rx="16" fill="#fafafa" stroke="#b6c0cc" strokeWidth="2" />
                  <text x="108" y="30" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1e40af">LEGEND</text>
                  <line x1="22" y1="60" x2="76" y2="60" stroke="#e21a1a" strokeWidth="5" strokeLinecap="round" />
                  <text x="88" y="66" fontSize="16" fontWeight="900" fill="#e21a1a">L1</text>
                  <text x="113" y="66" fontSize="16" fontWeight="700" fill="#111">(PHASE 1)</text>
                  <line x1="22" y1="92" x2="76" y2="92" stroke="#f4b400" strokeWidth="5" strokeLinecap="round" />
                  <text x="88" y="98" fontSize="16" fontWeight="900" fill="#f4b400">L2</text>
                  <text x="113" y="98" fontSize="16" fontWeight="700" fill="#111">(PHASE 2)</text>
                  <line x1="22" y1="124" x2="76" y2="124" stroke="#1746a2" strokeWidth="5" strokeLinecap="round" />
                  <text x="88" y="130" fontSize="16" fontWeight="900" fill="#1746a2">L3</text>
                  <text x="113" y="130" fontSize="16" fontWeight="700" fill="#111">(PHASE 3)</text>
                  <line x1="22" y1="156" x2="76" y2="156" stroke="#111" strokeWidth="4" strokeLinecap="round" />
                  <text x="88" y="162" fontSize="16" fontWeight="700" fill="#111">CONTROL WIRING</text>
                  <circle cx="49" cy="186" r="8" fill="url(#copper)" stroke="#5d3420" strokeWidth="2" />
                  <text x="88" y="192" fontSize="16" fontWeight="700" fill="#111">CONTACT POINT</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
