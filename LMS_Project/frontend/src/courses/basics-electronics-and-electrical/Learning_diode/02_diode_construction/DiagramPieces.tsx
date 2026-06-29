"use client";

import { motion } from "framer-motion";

import type { LayerView, ProbeTarget } from "./types";

type ProbePoint = {
  id: ProbeTarget;
  x: number;
  y: number;
  label: string;
};

export const PROBE_POINTS: ProbePoint[] = [
  { id: "anode", x: 135, y: 262, label: "Anode" },
  { id: "cathode", x: 625, y: 262, label: "Cathode" },
  { id: "p-region", x: 225, y: 176, label: "P Region" },
  { id: "n-region", x: 535, y: 176, label: "N Region" },
  { id: "pn-junction", x: 390, y: 140, label: "PN Junction" },
  { id: "depletion-region", x: 390, y: 214, label: "Depletion" },
];

function getDensityStrength(view: LayerView) {
  switch (view) {
    case "basic":
      return 0.15;
    case "doping":
      return 0.44;
    case "junction":
      return 0.32;
    case "formation":
      return 0.38;
    default:
      return 0.16;
  }
}

export function SemiconductorDensityShader({
  side,
  view,
}: {
  side: "p" | "n";
  view: LayerView;
}) {
  const isP = side === "p";
  const x = isP ? 95 : 380;
  const accent = isP ? "#dc2626" : "#2563eb";
  const gradientId = isP ? "pDensityGradient" : "nDensityGradient";
  const patternId = isP ? "pDensityPattern" : "nDensityPattern";
  const textureId = isP ? "pStructureTexture" : "nStructureTexture";
  const clipId = isP ? "pDensityClip" : "nDensityClip";
  const opacity = getDensityStrength(view);
  const depletionFade =
    view === "formation" ? 0.3 : view === "junction" ? 0.2 : 0.06;
  const structureOpacity = view === "basic" ? 0.22 : 0.1;

  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y="110" width="285" height="150" rx="18" />
        </clipPath>
        <linearGradient
          id={gradientId}
          x1={isP ? "0%" : "100%"}
          y1="0%"
          x2={isP ? "100%" : "0%"}
          y2="0%"
        >
          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
          <stop
            offset="52%"
            stopColor={accent}
            stopOpacity={view === "basic" ? "0.1" : "0.24"}
          />
          <stop offset="100%" stopColor={accent} stopOpacity="0.06" />
        </linearGradient>
        <pattern
          id={patternId}
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="4" cy="9" r="1.2" fill={accent} opacity="0.55" />
          <circle cx="13" cy="5" r="1" fill={accent} opacity="0.36" />
          <rect
            x="8"
            y="11"
            width="6"
            height="1.4"
            rx="0.7"
            fill={accent}
            opacity="0.22"
          />
        </pattern>
        <pattern
          id={textureId}
          width="26"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M4 22 L22 4"
            stroke={accent}
            strokeOpacity="0.12"
            strokeWidth="1.1"
          />
          <path
            d="M0 12 H10"
            stroke={accent}
            strokeOpacity="0.08"
            strokeWidth="1"
          />
          <circle cx="18" cy="18" r="1.1" fill={accent} opacity="0.1" />
        </pattern>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect x={x} y="110" width="285" height="150" fill={`url(#${gradientId})`} />
        <rect
          x={x}
          y="110"
          width="285"
          height="150"
          fill={`url(#${textureId})`}
          opacity={structureOpacity}
        />
        <rect x={x} y="110" width="285" height="150" fill={`url(#${patternId})`} />
        {(view === "junction" || view === "formation") && (
          <rect
            x={isP ? 332 : 380}
            y="110"
            width="48"
            height="150"
            fill="#ffffff"
            opacity={depletionFade}
          />
        )}
      </g>
    </g>
  );
}

export function ElectromagneticFieldBand({ opacity }: { opacity: number }) {
  return (
    <g opacity={opacity}>
      {[0, 1, 2].map((index) => (
        <ellipse
          key={index}
          cx="238"
          cy="184"
          rx={72 + index * 16}
          ry={40 + index * 12}
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="1.8"
          strokeDasharray="8 10"
        />
      ))}
    </g>
  );
}

export function Terminal({
  x,
  label,
  color,
}: {
  x: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      <line
        x1={x}
        y1="196"
        x2={x}
        y2="256"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx={x} cy="262" r="10" fill="white" stroke={color} strokeWidth="4" />
      {label ? (
        <text
          x={x}
          y="304"
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill={color}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function CarrierDots({
  type,
  density = 12,
}: {
  type: "holes" | "electrons";
  density?: number;
}) {
  const isHoles = type === "holes";
  const color = isHoles ? "#dc2626" : "#2563eb";
  const symbol = isHoles ? "+" : "−";
  const startX = isHoles ? 150 : 495;

  return (
    <g>
      {Array.from({ length: density }).map((_, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        return (
          <motion.g
            key={`${type}-${index}`}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.2, delay: index * 0.08, repeat: Infinity }}
          >
            <circle
              cx={startX + col * 46}
              cy={128 + row * 28}
              r="9.5"
              fill="white"
              stroke={color}
              strokeWidth="2.8"
            />
            <text
              x={startX + col * 46}
              y={133 + row * 28}
              textAnchor="middle"
              fontSize="16"
              fontWeight="900"
              fill={color}
            >
              {symbol}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

export function DiffusionAnimation({ speed = 1 }: { speed?: number }) {
  return (
    <g>
      {[0, 0.8, 1.6].map((delay, index) => (
        <motion.g
          key={`electron-diffuse-${index}`}
          initial={{ x: 536, y: 128 + index * 28, opacity: 0 }}
          animate={{ x: [536, 498, 456, 418], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2.3 / speed,
            delay: delay / speed,
            repeat: Infinity,
            repeatDelay: 0.3 / speed,
            ease: "linear",
          }}
        >
          <circle r="9" fill="white" stroke="#2563eb" strokeWidth="3" />
          <text y="5" textAnchor="middle" fontSize="16" fontWeight="900" fill="#2563eb">
            −
          </text>
        </motion.g>
      ))}

      {[0.4, 1.2, 2].map((delay, index) => (
        <motion.g
          key={`hole-diffuse-${index}`}
          initial={{ x: 244, y: 134 + index * 28, opacity: 0 }}
          animate={{ x: [244, 284, 324, 362], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2.3 / speed,
            delay: delay / speed,
            repeat: Infinity,
            repeatDelay: 0.3 / speed,
            ease: "linear",
          }}
        >
          <circle r="9" fill="white" stroke="#dc2626" strokeWidth="3" />
          <text y="5" textAnchor="middle" fontSize="16" fontWeight="900" fill="#dc2626">
            +
          </text>
        </motion.g>
      ))}

      {[0.6, 1.4, 2.2].map((delay, index) => (
        <motion.circle
          key={`flash-${index}`}
          cx="390"
          cy={138 + index * 24}
          r="5"
          fill="#facc15"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2, 0], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 1.1 / speed,
            delay: delay / speed,
            repeat: Infinity,
            repeatDelay: 1.4 / speed,
          }}
        />
      ))}
    </g>
  );
}

export function FixedIons() {
  return (
    <g>
      {[0, 1, 2, 3].map((index) => (
        <g key={`fixed-negative-${index}`}>
          <circle
            cx="366"
            cy={122 + index * 24}
            r="8.5"
            fill="#fee2e2"
            stroke="#991b1b"
            strokeWidth="2.6"
          />
          <text
            x="366"
            y={127 + index * 24}
            textAnchor="middle"
            fontSize="15"
            fontWeight="900"
            fill="#991b1b"
          >
            −
          </text>
        </g>
      ))}

      {[0, 1, 2, 3].map((index) => (
        <g key={`fixed-positive-${index}`}>
          <circle
            cx="414"
            cy={122 + index * 24}
            r="8.5"
            fill="#dbeafe"
            stroke="#1d4ed8"
            strokeWidth="2.6"
          />
          <text
            x="414"
            y={127 + index * 24}
            textAnchor="middle"
            fontSize="15"
            fontWeight="900"
            fill="#1d4ed8"
          >
            +
          </text>
        </g>
      ))}
    </g>
  );
}

export function ElectricFieldArrows() {
  return (
    <g>
      {[126, 150, 174].map((y, index) => (
        <motion.g
          key={`field-${index}`}
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.2, delay: index * 0.18, repeat: Infinity }}
        >
          <line
            x1="428"
            y1={y}
            x2="352"
            y2={y}
            stroke="#7c3aed"
            strokeWidth="2.8"
            markerEnd="url(#purpleArrow)"
          />
        </motion.g>
      ))}
    </g>
  );
}

export function ProbeTargets({
  selectedProbe,
  onSelect,
  showTargets,
}: {
  selectedProbe: ProbeTarget;
  onSelect: (probe: ProbeTarget) => void;
  showTargets: boolean;
}) {
  return (
    <g>
      {PROBE_POINTS.map((point) => {
        const active = point.id === selectedProbe;
        const visible = showTargets || active;

        return (
          <g key={point.id} opacity={visible ? 1 : 0.001}>
            <circle
              cx={point.x}
              cy={point.y}
              r={active ? 9.5 : 7}
              fill={active ? "#fef3c7" : "#ffffff"}
              stroke={active ? "#b45309" : "#64748b"}
              strokeWidth="2"
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(point.id)}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={active ? 15 : 11.5}
              fill="transparent"
              stroke={active ? "#f59e0b" : "#d9e2ec"}
              strokeWidth={active ? "1.8" : "1.2"}
              strokeDasharray={active ? "2 4" : "3 6"}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(point.id)}
            />
            <line
              x1={point.x - 5}
              y1={point.y}
              x2={point.x + 5}
              y2={point.y}
              stroke={active ? "#92400e" : "#94a3b8"}
              strokeWidth="1.4"
              strokeLinecap="round"
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(point.id)}
            />
            <line
              x1={point.x}
              y1={point.y - 5}
              x2={point.x}
              y2={point.y + 5}
              stroke={active ? "#92400e" : "#94a3b8"}
              strokeWidth="1.4"
              strokeLinecap="round"
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(point.id)}
            />
            {active ? (
              <text
                x={point.x}
                y={point.y - 20}
                textAnchor="middle"
                fontSize="9"
                fontWeight="900"
                fill="#92400e"
                letterSpacing="0.9"
              >
                {point.label.toUpperCase()}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
