"use client";

import React from "react";

export interface ArmatureAnimatorProps {
  pulled?: boolean;
  energized?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showStatus?: boolean;
  className?: string;
}

export default function ArmatureAnimator({
  pulled = false,
  energized = false,
  width = 360,
  height = 190,
  showLabels = true,
  showStatus = true,
  className = "",
}: ArmatureAnimatorProps) {
  const moveX = pulled ? -54 : 0;
  const armatureColor = energized ? "#94a3b8" : "#64748b";
  const statusColor = pulled ? "#22c55e" : "#f97316";

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 360 190"
        role="img"
        aria-label="Animated magnetic contactor armature"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="armatureMetal" x1="0" x2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="45%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="coreFace" x1="0" x2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <filter id="pullGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fixed iron core face */}
        <rect x="34" y="48" width="48" height="94" rx="8" fill="url(#coreFace)" stroke="#1e293b" strokeWidth="3" />
        <text x="22" y="168" fontSize="13" fill="#475569" fontWeight="700">
          Fixed Core
        </text>

        {/* Magnetic pull indication */}
        {energized && (
          <g opacity={pulled ? 0.95 : 0.7} filter="url(#pullGlow)">
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M ${105 + i * 22} ${72 + i * 16} L ${78 + i * 4} ${82 + i * 8}`}
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ))}
          </g>
        )}

        {/* Gap guide */}
        <line x1="90" y1="95" x2="158" y2="95" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 8" />
        <text x="104" y="88" fontSize="11" fill="#64748b">
          air gap
        </text>

        {/* Moving armature assembly */}
        <g
          style={{
            transform: `translateX(${moveX}px)`,
            transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <rect x="160" y="45" width="145" height="32" rx="7" fill="url(#armatureMetal)" stroke="#334155" strokeWidth="2" />
          <rect x="160" y="111" width="145" height="32" rx="7" fill="url(#armatureMetal)" stroke="#334155" strokeWidth="2" />
          <rect x="292" y="32" width="26" height="124" rx="6" fill={armatureColor} stroke="#334155" strokeWidth="2" />

          {/* Contact rod connection point */}
          <circle cx="318" cy="94" r="8" fill="#f97316" stroke="#7c2d12" strokeWidth="2" />
          <line x1="326" y1="94" x2="346" y2="94" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Position indicator */}
        <g>
          <rect x="158" y="12" width="154" height="12" rx="6" fill="#e2e8f0" />
          <circle
            cx={pulled ? 180 : 288}
            cy="18"
            r="9"
            fill={statusColor}
            style={{ transition: "cx 500ms ease" }}
          />
          <text x="155" y="10" fontSize="11" fill="#64748b" fontWeight="700">
            Pulled
          </text>
          <text x="270" y="10" fontSize="11" fill="#64748b" fontWeight="700">
            Released
          </text>
        </g>

        {showLabels && (
          <>
            <text x="172" y="169" fontSize="13" fill="#475569" fontWeight="700">
              Moving Armature
            </text>
            <text x="282" y="178" fontSize="12" fill="#64748b">
              linkage rod
            </text>
          </>
        )}
      </svg>

      {showStatus && (
        <div className="text-center">
          <div className="font-semibold text-slate-800">Armature Animator</div>
          <div className="text-sm text-slate-500">
            {pulled ? "Pulled toward iron core" : "Released by return spring"}
          </div>
        </div>
      )}
    </div>
  );
}
