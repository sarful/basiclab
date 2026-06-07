"use client";

import React from "react";

export default function BlackMaleToFemaleJumperWire() {
  return (
    <div className="w-full rounded-xl bg-white p-4">
      <svg
        viewBox="0 0 1200 170"
        className="h-auto w-full"
        role="img"
        aria-label="Black male to female jumper wire"
      >
        <defs>
          <linearGradient id="wireBlack" x1="0" x2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="50%" stopColor="#30343a" />
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

          <linearGradient id="copper" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c4a2c" />
            <stop offset="45%" stopColor="#f3c38b" />
            <stop offset="100%" stopColor="#5b341f" />
          </linearGradient>

          <filter id="softShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.22" />
          </filter>
        </defs>

        <rect x="0" y="0" width="1200" height="170" fill="#ffffff" />

        {/* Wire shadow */}
        <path
          d="M275 86 C455 78, 665 83, 940 82"
          fill="none"
          stroke="#000"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.16"
        />

        {/* Black wire */}
        <path
          d="M275 80 C455 72, 665 77, 940 76"
          fill="none"
          stroke="url(#wireBlack)"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* Wire highlight */}
        <path
          d="M285 74 C465 67, 665 71, 930 71"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* LEFT MALE PIN */}
        <line
          x1="45"
          y1="83"
          x2="118"
          y2="78"
          stroke="url(#pinMetal)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="45" cy="83" r="3.5" fill="#e5e7eb" />

        {/* Left male connector housing */}
        <g filter="url(#softShadow)">
          <rect x="115" y="57" width="165" height="42" rx="3" fill="url(#housingBlack)" />
          <rect x="135" y="64" width="55" height="28" rx="2" fill="#101116" />
          <rect x="196" y="64" width="58" height="28" rx="2" fill="#24262d" />

          <rect x="154" y="71" width="19" height="13" rx="2" fill="#e5e7eb" />
          <rect x="199" y="68" width="42" height="6" rx="2" fill="#555862" opacity="0.65" />

          <rect x="263" y="63" width="18" height="30" rx="2" fill="#16171d" />
        </g>

        {/* Right female connector housing */}
        <g filter="url(#softShadow)">
          <rect x="930" y="55" width="210" height="46" rx="3" fill="url(#housingBlack)" />

          {/* front socket opening */}
          <rect x="1084" y="62" width="42" height="32" rx="2" fill="#0b0c10" />
          <rect x="1092" y="68" width="26" height="20" rx="2" fill="#1f2026" />

          {/* copper contacts inside female socket */}
          <rect x="1072" y="64" width="13" height="28" rx="2" fill="url(#copper)" />
          <rect x="1125" y="64" width="13" height="28" rx="2" fill="url(#copper)" />

          {/* middle details */}
          <rect x="952" y="63" width="78" height="30" rx="2" fill="#2c2d34" />
          <rect x="965" y="69" width="50" height="6" rx="2" fill="#5f626b" opacity="0.7" />
          <rect x="1035" y="63" width="42" height="30" rx="2" fill="#15161c" />

          {/* wire sleeve overlap */}
          <rect x="922" y="63" width="20" height="31" rx="2" fill="#15161c" />
        </g>

        {/* Female end dark front face */}
        <rect x="1136" y="61" width="12" height="34" rx="2" fill="#0b0c10" />
      </svg>
    </div>
  );
}