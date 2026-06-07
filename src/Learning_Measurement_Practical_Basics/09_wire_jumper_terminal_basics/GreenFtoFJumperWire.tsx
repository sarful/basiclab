"use client";

import React from "react";

export default function GreenJumperWire() {
  return (
    <div className="w-full rounded-xl bg-white p-4">
      <svg
        viewBox="0 0 1200 160"
        className="h-auto w-full"
        role="img"
        aria-label="Green female to female jumper wire"
      >
        <defs>
          <linearGradient id="wireGreen" x1="0" x2="1">
            <stop offset="0%" stopColor="#16824d" />
            <stop offset="45%" stopColor="#2bb36f" />
            <stop offset="100%" stopColor="#0f6d3f" />
          </linearGradient>

          <linearGradient id="blackBody" x1="0" x2="1">
            <stop offset="0%" stopColor="#1f2026" />
            <stop offset="50%" stopColor="#3a3b42" />
            <stop offset="100%" stopColor="#18191f" />
          </linearGradient>

          <linearGradient id="metal" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c4a2c" />
            <stop offset="40%" stopColor="#f3c38b" />
            <stop offset="100%" stopColor="#5b341f" />
          </linearGradient>

          <filter id="softShadow">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* Green wire */}
        <path
          d="M260 72 C420 78, 600 70, 760 73 C850 75, 900 82, 965 82"
          fill="none"
          stroke="#0b5f37"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M260 68 C420 74, 600 66, 760 69 C850 71, 900 78, 965 78"
          fill="none"
          stroke="url(#wireGreen)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M270 60 C430 66, 610 58, 955 70"
          fill="none"
          stroke="#7be3a8"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Left connector */}
        <g filter="url(#softShadow)">
          <rect x="25" y="38" width="240" height="48" rx="3" fill="url(#blackBody)" />
          <rect x="85" y="42" width="105" height="40" rx="3" fill="#111217" />
          <rect x="103" y="48" width="58" height="28" rx="3" fill="#292a30" />
          <rect x="105" y="51" width="54" height="8" rx="2" fill="#55565c" opacity="0.7" />

          {/* metal contact */}
          <rect x="94" y="46" width="15" height="32" rx="2" fill="url(#metal)" />
          <rect x="174" y="46" width="15" height="32" rx="2" fill="url(#metal)" />

          {/* socket opening */}
          <rect x="42" y="47" width="72" height="30" rx="2" fill="#15161b" />
          <rect x="118" y="47" width="115" height="30" rx="2" fill="#15161b" opacity="0.45" />

          {/* right sleeve overlap */}
          <rect x="236" y="43" width="30" height="38" rx="2" fill="#222329" />
        </g>

        {/* Right connector */}
        <g filter="url(#softShadow)">
          <rect x="955" y="48" width="220" height="44" rx="3" fill="url(#blackBody)" />
          <rect x="1040" y="52" width="85" height="36" rx="3" fill="#111217" />
          <rect x="1053" y="57" width="50" height="24" rx="3" fill="#292a30" />
          <rect x="1055" y="59" width="46" height="7" rx="2" fill="#55565c" opacity="0.7" />

          {/* metal contact */}
          <rect x="1030" y="55" width="15" height="30" rx="2" fill="url(#metal)" />
          <rect x="1115" y="55" width="15" height="30" rx="2" fill="url(#metal)" />

          {/* socket opening */}
          <rect x="970" y="56" width="84" height="28" rx="2" fill="#15161b" opacity="0.55" />
          <rect x="1128" y="56" width="35" height="28" rx="2" fill="#15161b" />
        </g>
      </svg>
    </div>
  );
}