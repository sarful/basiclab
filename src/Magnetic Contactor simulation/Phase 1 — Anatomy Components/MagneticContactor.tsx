"use client";

import React from "react";

export default function MagneticContactor() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-6">
      <svg
        viewBox="0 0 620 720"
        className="w-full max-w-[560px] h-auto"
        role="img"
        aria-label="CJX2 magnetic contactor"
      >
        <defs>
          <linearGradient id="blackBody" x1="0" x2="1">
            <stop offset="0%" stopColor="#151817" />
            <stop offset="50%" stopColor="#2a2d2c" />
            <stop offset="100%" stopColor="#111313" />
          </linearGradient>

          <linearGradient id="cream" x1="0" x2="1">
            <stop offset="0%" stopColor="#d7d8cf" />
            <stop offset="45%" stopColor="#f0f1e8" />
            <stop offset="100%" stopColor="#c6c7bd" />
          </linearGradient>

          <radialGradient id="screw" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#f8faf7" />
            <stop offset="45%" stopColor="#6f7772" />
            <stop offset="100%" stopColor="#0b0f0e" />
          </radialGradient>

          <linearGradient id="bluePlastic" x1="0" x2="1">
            <stop offset="0%" stopColor="#004fbe" />
            <stop offset="50%" stopColor="#116bdf" />
            <stop offset="100%" stopColor="#003f9e" />
          </linearGradient>
        </defs>

        <rect x="121" y="58" width="382" height="612" rx="12" fill="#000" opacity="0.12" />

        {[150, 255, 365, 475].map((x, i) => (
          <rect key={i} x={x} y="32" width="30" height="58" rx="6" fill="#1e2320" />
        ))}

        <path
          d="M120 72 H500 V190 H112 V92 Q112 72 120 72Z"
          fill="url(#cream)"
          stroke="#b8b9ae"
          strokeWidth="2"
        />

        {[
          { x: 190, label1: "1", label2: "L1" },
          { x: 310, label1: "3", label2: "L2" },
          { x: 430, label1: "5", label2: "L3" },
        ].map((s) => (
          <g key={s.x}>
            <circle cx={s.x} cy="135" r="35" fill="#cfd0c5" />
            <circle cx={s.x} cy="142" r="24" fill="url(#screw)" />
            <path
              d={`M${s.x - 18} 148 Q${s.x} 132 ${s.x + 18} 148`}
              stroke="#111"
              strokeWidth="5"
              fill="none"
            />
            <text x={s.x - 30} y="105" fontSize="20" fill="#8d8e86" fontWeight="600">
              {s.label1}
            </text>
            <text x={s.x + 5} y="105" fontSize="20" fill="#8d8e86" fontWeight="600">
              {s.label2}
            </text>
          </g>
        ))}

        <rect x="500" y="118" width="42" height="77" rx="5" fill="url(#cream)" stroke="#babbb1" />
        <circle cx="520" cy="158" r="20" fill="url(#screw)" />
        <rect x="546" y="105" width="18" height="95" rx="3" fill="#333735" />

        <rect x="112" y="190" width="390" height="330" fill="url(#blackBody)" stroke="#0b0c0c" />
        <rect x="112" y="225" width="390" height="2" fill="#464a48" opacity="0.6" />
        <rect x="112" y="380" width="390" height="2" fill="#464a48" opacity="0.6" />

        <text x="138" y="226" fontSize="24" fill="#c7cbc7" fontWeight="500">CJX2</text>
        <text x="138" y="252" fontSize="24" fill="#c7cbc7" fontWeight="500">5011</text>
        <text x="500" y="220" fontSize="18" fill="#c7cbc7">21 NC</text>
        <text x="500" y="244" fontSize="18" fill="#c7cbc7">13 NO</text>
        <text x="510" y="336" fontSize="18" fill="#c7cbc7">11</text>
        <text x="500" y="470" fontSize="18" fill="#c7cbc7">14 NO</text>
        <text x="500" y="494" fontSize="18" fill="#c7cbc7">22 NC</text>

        {[145, 210, 352, 420, 470].map((x) => (
          <g key={x}>
            <rect x={x} y="285" width="30" height="32" fill="#070909" />
            <rect x={x + 8} y="292" width="12" height="20" fill="#2b2e2d" />
            <rect x={x} y="395" width="30" height="32" fill="#070909" />
            <rect x={x + 8} y="402" width="12" height="20" fill="#2b2e2d" />
          </g>
        ))}

        <g>
          <rect x="130" y="315" width="368" height="72" rx="7" fill="#061317" />
          <path d="M140 322 H220 V342 H254 V322 H305 V390 H254 V370 H220 V390 H140 Z" fill="url(#bluePlastic)" />
          <path d="M318 322 H420 V342 H465 V322 H490 V390 H465 V370 H420 V390 H318 Z" fill="url(#bluePlastic)" />
          <rect x="245" y="312" width="38" height="88" rx="3" fill="#0757c7" />
          <rect x="334" y="323" width="17" height="68" rx="2" fill="#0e4fb0" />
          <rect x="150" y="332" width="34" height="38" rx="4" fill="#1f73dc" opacity="0.8" />
          <rect x="392" y="330" width="58" height="42" rx="3" fill="#2179e3" opacity="0.7" />
        </g>

        <rect x="275" y="410" width="130" height="48" rx="2" fill="#e9ebe6" />
        <circle cx="364" cy="196" r="14" fill="url(#screw)" />
        <circle cx="360" cy="520" r="14" fill="url(#screw)" />

        <path
          d="M112 520 H502 V642 H120 Q112 642 112 632 Z"
          fill="url(#cream)"
          stroke="#b8b9ae"
          strokeWidth="2"
        />

        {[
          { x: 190, label1: "2", label2: "T1" },
          { x: 310, label1: "4", label2: "T2" },
          { x: 430, label1: "6", label2: "T3" },
        ].map((s) => (
          <g key={s.x}>
            <circle cx={s.x} cy="575" r="35" fill="#cfd0c5" />
            <circle cx={s.x} cy="568" r="24" fill="url(#screw)" />
            <path
              d={`M${s.x - 18} 562 Q${s.x} 578 ${s.x + 18} 562`}
              stroke="#111"
              strokeWidth="5"
              fill="none"
            />
            <text x={s.x - 30} y="628" fontSize="20" fill="#8d8e86" fontWeight="600">
              {s.label1}
            </text>
            <text x={s.x + 5} y="628" fontSize="20" fill="#8d8e86" fontWeight="600">
              {s.label2}
            </text>
          </g>
        ))}

        {[150, 265, 385, 475].map((x, i) => (
          <rect key={i} x={x} y="638" width="33" height="23" rx="4" fill="#101312" />
        ))}

        <rect x="500" y="500" width="42" height="72" rx="5" fill="url(#cream)" stroke="#babbb1" />
        <circle cx="520" cy="532" r="20" fill="url(#screw)" />
        <rect x="546" y="488" width="18" height="96" rx="3" fill="#333735" />
      </svg>
    </div>
  );
}
