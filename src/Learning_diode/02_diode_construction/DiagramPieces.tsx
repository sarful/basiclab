"use client";

import { motion } from "framer-motion";

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
      <line x1={x} y1="170" x2={x} y2="245" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <circle cx={x} cy="250" r="10" fill="white" stroke={color} strokeWidth="4" />
      <text x={x} y="285" textAnchor="middle" fontSize="18" fontWeight="800" fill={color}>
        {label}
      </text>
    </g>
  );
}

export function CarrierDots({ type }: { type: "holes" | "electrons" }) {
  const isHoles = type === "holes";
  const color = isHoles ? "#dc2626" : "#2563eb";
  const symbol = isHoles ? "+" : "−";
  const startX = isHoles ? 145 : 465;

  return (
    <g>
      {Array.from({ length: 12 }).map((_, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        return (
          <motion.g
            key={`${type}-${index}`}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.2, delay: index * 0.08, repeat: Infinity }}
          >
            <circle cx={startX + col * 45} cy={95 + row * 35} r="11" fill="white" stroke={color} strokeWidth="3" />
            <text x={startX + col * 45} y={101 + row * 35} textAnchor="middle" fontSize="18" fontWeight="900" fill={color}>
              {symbol}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

export function DiffusionAnimation() {
  return (
    <g>
      {[0, 0.8, 1.6].map((delay, index) => (
        <motion.g
          key={`electron-diffuse-${index}`}
          initial={{ x: 520, y: 95 + index * 34, opacity: 0 }}
          animate={{ x: [520, 455, 405, 355], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 0.3, ease: "linear" }}
        >
          <circle r="11" fill="white" stroke="#2563eb" strokeWidth="3" />
          <text y="6" textAnchor="middle" fontSize="18" fontWeight="900" fill="#2563eb">−</text>
        </motion.g>
      ))}

      {[0.4, 1.2, 2].map((delay, index) => (
        <motion.g
          key={`hole-diffuse-${index}`}
          initial={{ x: 230, y: 100 + index * 34, opacity: 0 }}
          animate={{ x: [230, 295, 345, 405], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 0.3, ease: "linear" }}
        >
          <circle r="11" fill="white" stroke="#dc2626" strokeWidth="3" />
          <text y="6" textAnchor="middle" fontSize="18" fontWeight="900" fill="#dc2626">+</text>
        </motion.g>
      ))}

      {[0.7, 1.5, 2.3].map((delay, index) => (
        <motion.circle
          key={`flash-${index}`}
          cx="380"
          cy={105 + index * 28}
          r="6"
          fill="#facc15"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2.5, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.1, delay, repeat: Infinity, repeatDelay: 1.6 }}
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
          <circle cx="350" cy={82 + index * 34} r="10" fill="#fee2e2" stroke="#991b1b" strokeWidth="3" />
          <text x="350" y={88 + index * 34} textAnchor="middle" fontSize="18" fontWeight="900" fill="#991b1b">−</text>
        </g>
      ))}

      {[0, 1, 2, 3].map((index) => (
        <g key={`fixed-positive-${index}`}>
          <circle cx="410" cy={82 + index * 34} r="10" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="3" />
          <text x="410" y={88 + index * 34} textAnchor="middle" fontSize="18" fontWeight="900" fill="#1d4ed8">+</text>
        </g>
      ))}
    </g>
  );
}

export function ElectricFieldArrows() {
  return (
    <g>
      {[92, 126, 160].map((y, index) => (
        <motion.g
          key={`field-${index}`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, delay: index * 0.2, repeat: Infinity }}
        >
          <line x1="420" y1={y} x2="340" y2={y} stroke="#7c3aed" strokeWidth="3" markerEnd="url(#purpleArrow)" />
        </motion.g>
      ))}
      <text x="380" y="45" textAnchor="middle" fontSize="14" fontWeight="800" fill="#6d28d9">
        Electric Field: N → P
      </text>
    </g>
  );
}
