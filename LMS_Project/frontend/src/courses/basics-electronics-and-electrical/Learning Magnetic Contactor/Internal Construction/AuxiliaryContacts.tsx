"use client";

import React from "react";

export interface AuxiliaryContactsProps {
  /** true = contactor coil energized */
  energized?: boolean;
  /** show terminal labels */
  showLabels?: boolean;
  /** show small status badges */
  showStatus?: boolean;
  /** optional scale for embedding inside larger SVG/scene */
  width?: number;
  height?: number;
  className?: string;
}

export default function AuxiliaryContacts({
  energized = false,
  showLabels = true,
  showStatus = true,
  width = 360,
  height = 260,
  className = "",
}: AuxiliaryContactsProps) {
  const noClosed = energized;
  const ncClosed = !energized;

  const noArmY = noClosed ? 74 : 58;
  const ncArmY = ncClosed ? 174 : 158;

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 360 260"
        role="img"
        aria-label="Auxiliary NO and NC contacts"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="auxBody" x1="0" x2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="50%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="auxMetal" x1="0" x2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="50%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          <filter id="auxGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main auxiliary block */}
        <rect
          x="28"
          y="24"
          width="304"
          height="212"
          rx="18"
          fill="url(#auxBody)"
          stroke="#374151"
          strokeWidth="3"
        />

        {/* Center divider */}
        <line x1="48" y1="130" x2="312" y2="130" stroke="#4b5563" strokeWidth="2" />

        {/* NO section title */}
        {showLabels && (
          <>
            <text x="52" y="52" fontSize="18" fill="#e5e7eb" fontWeight="700">
              NO AUX
            </text>
            <text x="52" y="152" fontSize="18" fill="#e5e7eb" fontWeight="700">
              NC AUX
            </text>
          </>
        )}

        {/* NO fixed terminals */}
        <g>
          <circle cx="96" cy="84" r="13" fill="url(#auxMetal)" stroke="#111827" strokeWidth="2" />
          <circle cx="264" cy="84" r="13" fill="url(#auxMetal)" stroke="#111827" strokeWidth="2" />

          <line x1="96" y1="84" x2="140" y2="84" stroke="#d1d5db" strokeWidth="8" strokeLinecap="round" />
          <line x1="220" y1="84" x2="264" y2="84" stroke="#d1d5db" strokeWidth="8" strokeLinecap="round" />

          {/* Moving bridge for NO contact */}
          <g
            style={{
              transform: `translateY(${noArmY - 58}px)`,
              transition: "transform 350ms ease",
            }}
          >
            <line
              x1="140"
              y1="58"
              x2="220"
              y2="78"
              stroke={noClosed ? "#22c55e" : "#f59e0b"}
              strokeWidth="9"
              strokeLinecap="round"
              filter={noClosed ? "url(#auxGlow)" : undefined}
            />
            <circle cx="140" cy="58" r="6" fill="#fde68a" />
            <circle cx="220" cy="78" r="6" fill="#fde68a" />
          </g>

          {showLabels && (
            <>
              <text x="84" y="118" fontSize="16" fill="#cbd5e1" fontWeight="700">
                13
              </text>
              <text x="252" y="118" fontSize="16" fill="#cbd5e1" fontWeight="700">
                14
              </text>
            </>
          )}
        </g>

        {/* NC fixed terminals */}
        <g>
          <circle cx="96" cy="184" r="13" fill="url(#auxMetal)" stroke="#111827" strokeWidth="2" />
          <circle cx="264" cy="184" r="13" fill="url(#auxMetal)" stroke="#111827" strokeWidth="2" />

          <line x1="96" y1="184" x2="140" y2="184" stroke="#d1d5db" strokeWidth="8" strokeLinecap="round" />
          <line x1="220" y1="184" x2="264" y2="184" stroke="#d1d5db" strokeWidth="8" strokeLinecap="round" />

          {/* Moving bridge for NC contact */}
          <g
            style={{
              transform: `translateY(${ncArmY - 174}px)`,
              transition: "transform 350ms ease",
            }}
          >
            <line
              x1="140"
              y1="174"
              x2="220"
              y2="184"
              stroke={ncClosed ? "#22c55e" : "#ef4444"}
              strokeWidth="9"
              strokeLinecap="round"
              filter={ncClosed ? "url(#auxGlow)" : undefined}
            />
            <circle cx="140" cy="174" r="6" fill="#fde68a" />
            <circle cx="220" cy="184" r="6" fill="#fde68a" />
          </g>

          {showLabels && (
            <>
              <text x="84" y="218" fontSize="16" fill="#cbd5e1" fontWeight="700">
                21
              </text>
              <text x="252" y="218" fontSize="16" fill="#cbd5e1" fontWeight="700">
                22
              </text>
            </>
          )}
        </g>

        {/* Right side actuator indicator */}
        <rect x="316" y="72" width="12" height="116" rx="6" fill="#020617" />
        <circle
          cx="322"
          cy={energized ? 106 : 154}
          r="8"
          fill={energized ? "#22c55e" : "#94a3b8"}
          style={{ transition: "cy 350ms ease" }}
        />
      </svg>

      {showStatus && (
        <div className="grid grid-cols-2 gap-3 text-center text-sm">
          <div
            className={`rounded-lg px-3 py-2 font-semibold ${
              noClosed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            13-14 NO: {noClosed ? "Closed" : "Open"}
          </div>
          <div
            className={`rounded-lg px-3 py-2 font-semibold ${
              ncClosed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            21-22 NC: {ncClosed ? "Closed" : "Open"}
          </div>
        </div>
      )}
    </div>
  );
}
