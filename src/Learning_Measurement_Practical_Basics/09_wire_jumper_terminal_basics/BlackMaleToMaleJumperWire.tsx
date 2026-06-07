"use client";

import React from "react";

export default function BlackMaleToMaleJumperWire() {
  return (
    <div className="w-full rounded-xl bg-white p-4">
      <svg
        viewBox="0 0 1200 170"
        className="h-auto w-full"
        role="img"
        aria-label="Black male to male jumper wire"
      >
        <defs>
          <linearGradient id="wireBlack" x1="0" x2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="50%" stopColor="#2f3338" />
            <stop offset="100%" stopColor="#0b0f14" />
          </linearGradient>

          <linearGradient id="housingBlack" x1="0" x2="1">
            <stop offset="0%" stopColor="#14151a" />
            <stop offset="50%" stopColor="#303139" />
            <stop offset="100%" stopColor="#111217" />
          </linearGradient>

          <linearGradient id="pinMetal" x1="0" x2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="45%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          <filter id="softShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* soft background */}
        <rect x="0" y="0" width="1200" height="170" fill="#ffffff" />

        {/* wire shadow */}
        <path
          d="M260 86 C430 78, 650 83, 940 82"
          fill="none"
          stroke="#000"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.16"
        />

        {/* black wire */}
        <path
          d="M260 80 C430 72, 650 77, 940 76"
          fill="none"
          stroke="url(#wireBlack)"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* wire highlight */}
        <path
          d="M270 74 C440 67, 650 71, 930 71"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* left metal pin */}
        <line
          x1="45"
          y1="83"
          x2="118"
          y2="78"
          stroke="url(#pinMetal)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* left connector */}
        <g filter="url(#softShadow)">
          <rect x="115" y="57" width="160" height="42" rx="3" fill="url(#housingBlack)" />
          <rect x="135" y="64" width="55" height="28" rx="2" fill="#101116" />
          <rect x="196" y="64" width="58" height="28" rx="2" fill="#24262d" />

          <rect x="154" y="71" width="19" height="13" rx="2" fill="#e5e7eb" />
          <rect x="199" y="68" width="42" height="6" rx="2" fill="#555862" opacity="0.65" />

          <rect x="258" y="63" width="18" height="30" rx="2" fill="#16171d" />
        </g>

        {/* right connector */}
        <g filter="url(#softShadow)">
          <rect x="930" y="56" width="175" height="43" rx="3" fill="url(#housingBlack)" />
          <rect x="950" y="63" width="70" height="29" rx="2" fill="#2c2d34" />
          <rect x="1028" y="63" width="55" height="29" rx="2" fill="#111217" />

          <rect x="968" y="69" width="40" height="6" rx="2" fill="#5f626b" opacity="0.7" />
          <rect x="1045" y="70" width="20" height="14" rx="2" fill="#e5e7eb" />

          <rect x="925" y="62" width="18" height="31" rx="2" fill="#15161c" />
        </g>

        {/* right metal pin */}
        <line
          x1="1102"
          y1="78"
          x2="1165"
          y2="76"
          stroke="url(#pinMetal)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* pin tips */}
        <circle cx="45" cy="83" r="3.5" fill="#e5e7eb" />
        <circle cx="1165" cy="76" r="3.5" fill="#e5e7eb" />
      </svg>
    </div>
  );
}