"use client";

import { motion, useReducedMotion } from "framer-motion";

type FlowKind = "electron" | "conventional";

type FlowParticleProps = {
  delay: number;
  active: boolean;
  speed: number;
  kind?: FlowKind;
  size?: number;
};

type CurrentFlowSystemProps = {
  active: boolean;
  currentLevel: number;
  showElectrons?: boolean;
  showConventional?: boolean;
};

const CONVENTIONAL_PATH = {
  cx: [90, 90, 300, 350, 640, 640, 640, 90],
  cy: [119, 70, 70, 70, 70, 118, 255, 255],
};

const ELECTRON_PATH = {
  cx: [640, 640, 640, 350, 300, 90, 90, 90],
  cy: [255, 118, 70, 70, 70, 70, 119, 255],
};

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function getParticleCount(currentLevel: number) {
  const level = clamp(currentLevel, 0, 1);
  return Math.max(2, Math.round(3 + level * 7));
}

function getDuration(currentLevel: number) {
  const level = clamp(currentLevel, 0, 1);
  return 6 - level * 3.8;
}

function getOpacity(currentLevel: number) {
  const level = clamp(currentLevel, 0, 1);
  return 0.45 + level * 0.55;
}

export function ElectronDot({
  delay,
  active,
  speed,
  kind = "electron",
  size = 5,
}: FlowParticleProps) {
  const prefersReducedMotion = useReducedMotion();
  const level = clamp(speed, 0, 1);
  const duration = getDuration(level);
  const opacity = getOpacity(level);
  const path = kind === "electron" ? ELECTRON_PATH : CONVENTIONAL_PATH;
  const isElectron = kind === "electron";

  if (prefersReducedMotion) {
    return active ? (
      <circle
        cx={isElectron ? 640 : 90}
        cy={isElectron ? 255 : 119}
        r={size}
        fill={isElectron ? "#2563eb" : "#f97316"}
        opacity={opacity}
      />
    ) : null;
  }

  return (
    <motion.circle
      r={size}
      fill={isElectron ? "#2563eb" : "#f97316"}
      stroke="#ffffff"
      strokeWidth="2"
      initial={{
        cx: path.cx[0],
        cy: path.cy[0],
        opacity: 0,
      }}
      animate={
        active
          ? {
              cx: path.cx,
              cy: path.cy,
              opacity: [
                0,
                opacity,
                opacity,
                opacity,
                opacity,
                opacity,
                opacity,
                0,
              ],
            }
          : { opacity: 0 }
      }
      transition={{
        duration,
        delay,
        repeat: active ? Infinity : 0,
        ease: "linear",
      }}
    />
  );
}

export function CurrentFlowSystem({
  active,
  currentLevel,
  showElectrons = true,
  showConventional = true,
}: CurrentFlowSystemProps) {
  const level = clamp(currentLevel, 0, 1);
  const particleCount = getParticleCount(level);
  const duration = getDuration(level);
  const delayStep = duration / particleCount;

  const particles = Array.from({ length: particleCount }, (_, index) => ({
    id: index,
    delay: index * delayStep,
  }));

  return (
    <g aria-label="Conventional current and electron flow animation system">
      {showConventional &&
        particles.map((particle) => (
          <ElectronDot
            key={`conventional-${particle.id}`}
            delay={particle.delay}
            active={active}
            speed={level}
            kind="conventional"
            size={4.8}
          />
        ))}

      {showElectrons &&
        particles.map((particle) => (
          <ElectronDot
            key={`electron-${particle.id}`}
            delay={particle.delay + delayStep / 2}
            active={active}
            speed={level}
            kind="electron"
            size={5.2}
          />
        ))}

      <g aria-label="Flow direction labels">
        <text x="300" y="40" fontSize="16" fontWeight="900" fill="#f97316">
          Conventional Current: + to -
        </text>

        <text x="570" y="40" fontSize="16" fontWeight="900" fill="#2563eb">
          Electron Flow: - to +
        </text>
      </g>
    </g>
  );
}
