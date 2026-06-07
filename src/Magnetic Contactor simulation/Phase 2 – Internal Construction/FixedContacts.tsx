"use client";

import React from "react";

export type FixedContactState = "open" | "closed" | "inactive";

export interface FixedContactItem {
  id: string;
  topLabel?: string;
  bottomLabel?: string;
  state?: FixedContactState;
}

export interface FixedContactsProps {
  contacts?: FixedContactItem[];
  energized?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
  className?: string;
}

const defaultContacts: FixedContactItem[] = [
  { id: "L1-T1", topLabel: "L1", bottomLabel: "T1" },
  { id: "L2-T2", topLabel: "L2", bottomLabel: "T2" },
  { id: "L3-T3", topLabel: "L3", bottomLabel: "T3" },
];

export default function FixedContacts({
  contacts = defaultContacts,
  energized = false,
  width = 360,
  height = 220,
  showLabels = true,
  className = "",
}: FixedContactsProps) {
  const topY = 58;
  const bottomY = 162;
  const contactWidth = 42;
  const contactHeight = 26;
  const usableWidth = width - 90;
  const startX = 45;
  const gap = contacts.length > 1 ? usableWidth / (contacts.length - 1) : 0;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Fixed contacts"
    >
      <defs>
        <linearGradient id="fixedContactCopper" x1="0" x2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        <linearGradient id="fixedContactMetal" x1="0" x2="1">
          <stop offset="0%" stopColor="#737373" />
          <stop offset="50%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#525252" />
        </linearGradient>

        <filter id="fixedContactGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base guide */}
      <rect
        x="16"
        y="24"
        width={width - 32}
        height={height - 48}
        rx="16"
        fill="#f8fafc"
        stroke="#d1d5db"
        strokeWidth="2"
      />

      <line
        x1="30"
        y1={height / 2}
        x2={width - 30}
        y2={height / 2}
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeDasharray="8 8"
      />

      {contacts.map((contact, index) => {
        const x = startX + index * gap;
        const state = contact.state ?? (energized ? "closed" : "open");
        const active = state === "closed";

        return (
          <g key={contact.id}>
            {/* Vertical terminal guides */}
            <line
              x1={x}
              y1="34"
              x2={x}
              y2={height - 34}
              stroke={active ? "#f59e0b" : "#94a3b8"}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={active ? 1 : 0.55}
            />

            {/* Top fixed contact */}
            <rect
              x={x - contactWidth / 2}
              y={topY - contactHeight / 2}
              width={contactWidth}
              height={contactHeight}
              rx="6"
              fill="url(#fixedContactCopper)"
              stroke="#78350f"
              strokeWidth="2"
              filter={active ? "url(#fixedContactGlow)" : undefined}
            />

            {/* Bottom fixed contact */}
            <rect
              x={x - contactWidth / 2}
              y={bottomY - contactHeight / 2}
              width={contactWidth}
              height={contactHeight}
              rx="6"
              fill="url(#fixedContactCopper)"
              stroke="#78350f"
              strokeWidth="2"
              filter={active ? "url(#fixedContactGlow)" : undefined}
            />

            {/* Silver contact faces */}
            <circle cx={x} cy={topY + 13} r="7" fill="url(#fixedContactMetal)" stroke="#374151" />
            <circle cx={x} cy={bottomY - 13} r="7" fill="url(#fixedContactMetal)" stroke="#374151" />

            {/* Small screw heads */}
            <circle cx={x} cy={topY - 4} r="5" fill="#1f2937" opacity="0.75" />
            <circle cx={x} cy={bottomY + 4} r="5" fill="#1f2937" opacity="0.75" />

            {showLabels && (
              <>
                <text
                  x={x}
                  y="20"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill="#374151"
                >
                  {contact.topLabel ?? contact.id}
                </text>
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill="#374151"
                >
                  {contact.bottomLabel ?? "OUT"}
                </text>
              </>
            )}

            <text
              x={x}
              y={height / 2 + 5}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={active ? "#15803d" : "#64748b"}
            >
              {active ? "ON" : "OFF"}
            </text>
          </g>
        );
      })}

      {showLabels && (
        <text
          x={width / 2}
          y={height - 34}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="#64748b"
        >
          Fixed Main Power Contacts
        </text>
      )}
    </svg>
  );
}
