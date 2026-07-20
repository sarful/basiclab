"use client";

import { MotionConfig, motion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type PlcMode = "off" | "stop" | "run";

type ScanStage =
  | "idle"
  | "read"
  | "execute"
  | "write"
  | "service";

type PlcProfileId =
  | "micro"
  | "compact"
  | "modular"
  | "highPerformance";

type SpecificationId =
  | "power"
  | "cpu"
  | "memory"
  | "digitalIo"
  | "analogIo"
  | "network"
  | "expansion"
  | "environment"
  | "motion"
  | "safety";

type PlcProfile = {
  id: PlcProfileId;
  name: string;
  description: string;
  processor: string;
  powerSupply: string;

  digitalIo: number;
  analogIo: number;
  memoryKb: number;
  scanMs: number;
  expansionModules: number;
  maxTemperatureC: number;

  ethernet: boolean;
  motion: boolean;
  safety: boolean;
  redundancy: boolean;
  harshEnvironment: boolean;
};

type Requirements = {
  digitalIo: number;
  analogIo: number;
  memoryKb: number;
  scanMs: number;
  expansionModules: number;
  maxTemperatureC: number;

  ethernet: boolean;
  motion: boolean;
  safety: boolean;
  redundancy: boolean;
  harshEnvironment: boolean;
};

type MachineInputs = {
  start: boolean;
  stop: boolean;
  levelHigh: boolean;
  safetyGateClosed: boolean;
};

type MachineOutputs = {
  conveyor: boolean;
  valve: boolean;
  alarm: boolean;
  servoPosition: number;
};

type FitChecks = {
  digitalIo: boolean;
  analogIo: boolean;
  memory: boolean;
  scan: boolean;
  expansion: boolean;
  temperature: boolean;
  ethernet: boolean;
  motion: boolean;
  safety: boolean;
  redundancy: boolean;
  environment: boolean;
};

type FitEvaluation = {
  checks: FitChecks;
  passed: number;
  total: number;
  percentage: number;
  isFit: boolean;
  failed: string[];
};

type SimulationContext = {
  profile: PlcProfile;
  requirements: Requirements;
  evaluation: FitEvaluation;
  machineInputs: MachineInputs;
  servoTarget: number;
};

/* =========================================================
   EDUCATIONAL PLC PROFILES
========================================================= */

/*
 * These profiles are vendor-neutral teaching examples.
 * They are not specifications for any particular commercial PLC.
 */
const PLC_PROFILES: Record<PlcProfileId, PlcProfile> = {
  micro: {
    id: "micro",
    name: "Micro PLC",
    description:
      "A small controller for simple standalone machines with limited expansion.",
    processor: "Entry-level industrial CPU",
    powerSupply: "24 VDC",

    digitalIo: 32,
    analogIo: 4,
    memoryKb: 64,
    scanMs: 12,
    expansionModules: 2,
    maxTemperatureC: 50,

    ethernet: false,
    motion: false,
    safety: false,
    redundancy: false,
    harshEnvironment: false,
  },

  compact: {
    id: "compact",
    name: "Compact PLC",
    description:
      "A balanced controller for small and medium machines with networking and moderate expansion.",
    processor: "32-bit industrial CPU",
    powerSupply: "24 VDC",

    digitalIo: 128,
    analogIo: 16,
    memoryKb: 256,
    scanMs: 5,
    expansionModules: 8,
    maxTemperatureC: 55,

    ethernet: true,
    motion: false,
    safety: false,
    redundancy: false,
    harshEnvironment: false,
  },

  modular: {
    id: "modular",
    name: "Modular PLC",
    description:
      "A scalable rack-based controller for larger machines, remote I/O, motion, and safety.",
    processor: "High-speed multicore CPU",
    powerSupply: "24 VDC rack supply",

    digitalIo: 1024,
    analogIo: 128,
    memoryKb: 2048,
    scanMs: 2,
    expansionModules: 32,
    maxTemperatureC: 60,

    ethernet: true,
    motion: true,
    safety: true,
    redundancy: false,
    harshEnvironment: true,
  },

  highPerformance: {
    id: "highPerformance",
    name: "High-Performance PLC",
    description:
      "A high-capacity controller for large plants, fast motion, redundancy, and critical automation.",
    processor: "High-performance redundant CPU",
    powerSupply: "Redundant rack supply",

    digitalIo: 4096,
    analogIo: 512,
    memoryKb: 8192,
    scanMs: 0.5,
    expansionModules: 128,
    maxTemperatureC: 70,

    ethernet: true,
    motion: true,
    safety: true,
    redundancy: true,
    harshEnvironment: true,
  },
};

const PROFILE_ORDER: PlcProfileId[] = [
  "micro",
  "compact",
  "modular",
  "highPerformance",
];

const INITIAL_REQUIREMENTS: Requirements = {
  digitalIo: 24,
  analogIo: 4,
  memoryKb: 128,
  scanMs: 10,
  expansionModules: 4,
  maxTemperatureC: 55,

  ethernet: true,
  motion: false,
  safety: false,
  redundancy: false,
  harshEnvironment: false,
};

const INITIAL_INPUTS: MachineInputs = {
  start: false,
  stop: false,
  levelHigh: false,
  safetyGateClosed: true,
};

const INITIAL_OUTPUTS: MachineOutputs = {
  conveyor: false,
  valve: false,
  alarm: false,
  servoPosition: 0,
};

/* =========================================================
   LEARNING INFORMATION
========================================================= */

const STAGE_INFORMATION: Record<
  ScanStage,
  {
    title: string;
    shortTitle: string;
    description: string;
    progress: number;
  }
> = {
  idle: {
    title: "PLC ready",
    shortTitle: "Idle",
    description:
      "Select a PLC profile, configure the project requirements, and run a scan.",
    progress: 0,
  },

  read: {
    title: "1. Read physical inputs",
    shortTitle: "Read",
    description:
      "The input modules copy the START, STOP, level, and safety-gate states into the input process image.",
    progress: 25,
  },

  execute: {
    title: "2. Execute the user program",
    shortTitle: "Execute",
    description:
      "The CPU evaluates the process image, project fit, safety permission, conveyor logic, valve logic, alarm logic, and motion command.",
    progress: 50,
  },

  write: {
    title: "3. Update physical outputs",
    shortTitle: "Write",
    description:
      "The output process image is transferred to the conveyor, filling valve, alarm, and servo axis.",
    progress: 75,
  },

  service: {
    title: "4. Perform services and diagnostics",
    shortTitle: "Service",
    description:
      "The PLC performs communication, timing, project-fit diagnostics, and system housekeeping.",
    progress: 100,
  },
};

const SPECIFICATION_INFORMATION: Record<
  SpecificationId,
  {
    title: string;
    description: string;
    example: string;
  }
> = {
  power: {
    title: "Power-Supply Specification",
    description:
      "Defines controller supply voltage, current consumption, inrush current, isolation, and available backplane power.",
    example:
      "PLC logic power and field-device power may use separate power supplies.",
  },

  cpu: {
    title: "CPU and Scan Performance",
    description:
      "Defines instruction speed, task scheduling, communication processing, and expected scan-cycle performance.",
    example:
      "A project requiring a 5 ms scan should use a controller capable of consistently completing the application within that period.",
  },

  memory: {
    title: "Program and Data Memory",
    description:
      "Stores the user program, tags, function blocks, timers, counters, recipes, alarms, and retained data.",
    example:
      "Large projects need additional free memory for future functions and diagnostics.",
  },

  digitalIo: {
    title: "Digital I/O Capacity",
    description:
      "Defines how many discrete sensors, switches, lamps, contactors, and solenoid valves the PLC can address.",
    example:
      "A project with 20 inputs and 12 outputs requires at least 32 digital I/O points.",
  },

  analogIo: {
    title: "Analog I/O Capacity",
    description:
      "Defines the number and type of continuous voltage, current, temperature, and process channels.",
    example:
      "Common analog interfaces include 0–10 V, 4–20 mA, RTD, and thermocouple signals.",
  },

  network: {
    title: "Communication Interfaces",
    description:
      "Defines communication with HMIs, SCADA systems, drives, remote I/O, engineering computers, and other controllers.",
    example:
      "Check physical ports, protocols, update rates, connection limits, and licensing.",
  },

  expansion: {
    title: "Expansion Capacity",
    description:
      "Defines how many additional I/O, communication, motion, safety, and specialist modules can be connected.",
    example:
      "A modular PLC may support local racks and distributed remote-I/O stations.",
  },

  environment: {
    title: "Environmental Rating",
    description:
      "Defines permitted temperature, humidity, vibration, shock, altitude, pollution, and enclosure conditions.",
    example:
      "The PLC may still require a ventilated or climate-controlled cabinet.",
  },

  motion: {
    title: "Motion-Control Capability",
    description:
      "Defines support for position, velocity, acceleration, homing, electronic gearing, and coordinated axes.",
    example:
      "Fast servo systems may need deterministic motion networks and dedicated instructions.",
  },

  safety: {
    title: "Functional-Safety Capability",
    description:
      "Defines whether certified safety logic and safety I/O can be integrated into the automation platform.",
    example:
      "Safety functions require suitable certified hardware, validation, and machine-risk assessment.",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(maximum, Math.max(minimum, value));
}

function bit(value: boolean): number {
  return value ? 1 : 0;
}

function formatScan(value: number): string {
  return value < 1
    ? `${value.toFixed(1)} ms`
    : `${value.toFixed(0)} ms`;
}

function formatMemory(value: number): string {
  if (value >= 1024) {
    const megabytes = value / 1024;

    return `${megabytes.toFixed(
      Number.isInteger(megabytes) ? 0 : 1,
    )} MB`;
  }

  return `${value} KB`;
}

function evaluateProfile(
  profile: PlcProfile,
  requirements: Requirements,
): FitEvaluation {
  const checks: FitChecks = {
    digitalIo:
      profile.digitalIo >= requirements.digitalIo,

    analogIo:
      profile.analogIo >= requirements.analogIo,

    memory:
      profile.memoryKb >= requirements.memoryKb,

    scan:
      profile.scanMs <= requirements.scanMs,

    expansion:
      profile.expansionModules >=
      requirements.expansionModules,

    temperature:
      profile.maxTemperatureC >=
      requirements.maxTemperatureC,

    ethernet:
      !requirements.ethernet || profile.ethernet,

    motion:
      !requirements.motion || profile.motion,

    safety:
      !requirements.safety || profile.safety,

    redundancy:
      !requirements.redundancy || profile.redundancy,

    environment:
      !requirements.harshEnvironment ||
      profile.harshEnvironment,
  };

  const labels: Record<keyof FitChecks, string> = {
    digitalIo: "digital I/O",
    analogIo: "analog I/O",
    memory: "program memory",
    scan: "scan performance",
    expansion: "expansion capacity",
    temperature: "temperature rating",
    ethernet: "industrial Ethernet",
    motion: "motion control",
    safety: "integrated safety",
    redundancy: "CPU redundancy",
    environment: "harsh-environment rating",
  };

  const entries = Object.entries(checks) as Array<
    [keyof FitChecks, boolean]
  >;

  const passed = entries.filter(
    ([, result]) => result,
  ).length;

  const failed = entries
    .filter(([, result]) => !result)
    .map(([key]) => labels[key]);

  return {
    checks,
    passed,
    total: entries.length,
    percentage: Math.round(
      (passed / entries.length) * 100,
    ),
    isFit: passed === entries.length,
    failed,
  };
}

function findRecommendedProfile(
  requirements: Requirements,
): PlcProfileId {
  return (
    PROFILE_ORDER.find((profileId) =>
      evaluateProfile(
        PLC_PROFILES[profileId],
        requirements,
      ).isFit,
    ) ?? "highPerformance"
  );
}

/* =========================================================
   GENERAL UI
========================================================= */

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-slate-900">
        {title}
      </h2>

      {description ? (
        <p className="mt-1 text-sm leading-5 text-slate-500">
          {description}
        </p>
      ) : null}

      <div className="mt-4">{children}</div>
    </section>
  );
}

function Badge({
  active,
  tone = "blue",
  children,
}: {
  active: boolean;
  tone?: "blue" | "green" | "amber" | "red";
  children: ReactNode;
}) {
  const toneClass = {
    blue:
      "border-blue-200 bg-blue-50 text-blue-700",

    green:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    amber:
      "border-amber-200 bg-amber-50 text-amber-700",

    red:
      "border-red-200 bg-red-50 text-red-700",
  }[tone];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",

        active
          ? toneClass
          : "border-slate-200 bg-slate-50 text-slate-500",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function Metric({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-mono text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs leading-4 text-slate-500">
        {helper}
      </p>
    </div>
  );
}

function Led({
  active,
  danger = false,
  warning = false,
  label,
}: {
  active: boolean;
  danger?: boolean;
  warning?: boolean;
  label?: string;
}) {
  const activeClass = danger
    ? "border-red-500 bg-red-500"
    : warning
      ? "border-amber-500 bg-amber-500"
      : "border-emerald-500 bg-emerald-500";

  return (
    <div className="flex items-center gap-2">
      <motion.span
        className={[
          "h-3.5 w-3.5 shrink-0 rounded-full border",

          active
            ? activeClass
            : "border-slate-300 bg-slate-100",
        ].join(" ")}
        animate={
          active
            ? {
                scale: [1, 1.18, 1],
              }
            : {
                scale: 1,
              }
        }
        transition={{
          duration: 1,
          repeat: active
            ? Number.POSITIVE_INFINITY
            : 0,
        }}
      />

      {label ? (
        <span className="text-xs font-medium text-slate-600">
          {label}
        </span>
      ) : null}
    </div>
  );
}

function Toggle({
  checked,
  disabled,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  description?: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={checked}
      onClick={onChange}
      className={[
        "flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition",

        "focus:outline-none focus:ring-2 focus:ring-blue-500",

        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
          : checked
            ? "border-blue-300 bg-blue-50"
            : "border-slate-200 bg-white hover:border-slate-300",
      ].join(" ")}
    >
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        {description ? (
          <p className="mt-1 text-xs leading-4 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      <span
        className={[
          "relative h-7 w-14 shrink-0 rounded-full transition-colors",

          checked ? "bg-blue-600" : "bg-slate-300",
        ].join(" ")}
      >
        <motion.span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
          animate={{
            left: checked ? 30 : 4,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </span>
    </button>
  );
}

function RangeField({
  id,
  label,
  value,
  minimum,
  maximum,
  step,
  unit,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  step: number;
  unit: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-800"
        >
          {label}
        </label>

        <span className="font-mono text-sm font-semibold text-blue-700">
          {value}
          {unit}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={minimum}
        max={maximum}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="mt-4 w-full accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      />

      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>
          {minimum}
          {unit}
        </span>

        <span>
          {maximum}
          {unit}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   SVG NODE
========================================================= */

function SpecNode({
  id,
  active,
  selected,
  children,
  onSelect,
}: {
  id: SpecificationId;
  active: boolean;
  selected: boolean;
  children: ReactNode;
  onSelect: (id: SpecificationId) => void;
}) {
  function handleKeyDown(
    event: KeyboardEvent<SVGGElement>,
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onSelect(id);
    }
  }

  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${SPECIFICATION_INFORMATION[id].title}`}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer outline-none"
      animate={
        active
          ? {
              filter: [
                "drop-shadow(0 0 0 rgba(37,99,235,0))",
                "drop-shadow(0 0 11px rgba(37,99,235,.3))",
                "drop-shadow(0 0 0 rgba(37,99,235,0))",
              ],
            }
          : {
              filter: "none",
            }
      }
      transition={{
        duration: 1,
        repeat: active
          ? Number.POSITIVE_INFINITY
          : 0,
      }}
      data-selected={selected}
    >
      {children}
    </motion.g>
  );
}

/* =========================================================
   PLC ARCHITECTURE CANVAS
========================================================= */

function PlcSpecificationCanvas({
  mode,
  stage,
  profile,
  requirements,
  evaluation,
  inputImage,
  outputImage,
  physicalOutputs,
  selectedSpecification,
  onSelectSpecification,
}: {
  mode: PlcMode;
  stage: ScanStage;
  profile: PlcProfile;
  requirements: Requirements;
  evaluation: FitEvaluation;
  inputImage: MachineInputs;
  outputImage: MachineOutputs;
  physicalOutputs: MachineOutputs;
  selectedSpecification: SpecificationId;
  onSelectSpecification: (
    id: SpecificationId,
  ) => void;
}) {
  const powered = mode !== "off";

  const readActive = stage === "read";
  const executeActive = stage === "execute";
  const writeActive = stage === "write";
  const serviceActive = stage === "service";

  function stroke(
    id: SpecificationId,
    active: boolean,
  ): string {
    if (selectedSpecification === id) {
      return "#2563eb";
    }

    return active ? "#60a5fa" : "#cbd5e1";
  }

  const waterY = inputImage.levelHigh ? 455 : 495;
  const waterHeight = inputImage.levelHigh ? 100 : 60;

  const servoAngle =
    -70 +
    clamp(
      physicalOutputs.servoPosition,
      0,
      100,
    ) *
      1.4;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            PLC specification architecture
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Click a hardware block or run the
            PLC scan simulation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            active={powered}
            tone="green"
          >
            {powered
              ? "POWER ON"
              : "POWER OFF"}
          </Badge>

          <Badge
            active={evaluation.isFit}
            tone={
              evaluation.isFit
                ? "green"
                : "red"
            }
          >
            {evaluation.isFit
              ? "PROJECT FIT"
              : "UNDERSIZED"}
          </Badge>

          <Badge
            active={stage !== "idle"}
            tone="amber"
          >
            {stage === "idle"
              ? "IDLE"
              : stage.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto bg-white">
        <div className="min-w-[980px]">
          <svg
            viewBox="0 0 1320 790"
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto w-full"
            role="img"
            aria-label="PLC specifications and machine actuator simulation"
          >
            <defs>
              <pattern
                id="specGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0 L0 0 0 40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              </pattern>

              <marker
                id="blueArrow"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path
                  d="M0,0 L10,5 L0,10 Z"
                  fill="#2563eb"
                />
              </marker>

              <marker
                id="grayArrow"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path
                  d="M0,0 L10,5 L0,10 Z"
                  fill="#cbd5e1"
                />
              </marker>

              <marker
                id="greenArrow"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path
                  d="M0,0 L10,5 L0,10 Z"
                  fill="#10b981"
                />
              </marker>
            </defs>

            <rect
              width="1320"
              height="790"
              fill="url(#specGrid)"
            />

            {/* PLC enclosure */}

            <rect
              x="25"
              y="30"
              width="770"
              height="700"
              rx="28"
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth="4"
            />

            <text
              x="60"
              y="72"
              fill="#0f172a"
              fontSize="22"
              fontWeight="800"
            >
              {profile.name.toUpperCase()}
            </text>

            <text
              x="60"
              y="98"
              fill="#64748b"
              fontSize="13"
            >
              Vendor-neutral educational
              specification profile
            </text>

            <rect
              x="60"
              y="125"
              width="700"
              height="18"
              rx="9"
              fill="#dbeafe"
              stroke="#60a5fa"
              strokeWidth="2"
            />

            <text
              x="410"
              y="119"
              textAnchor="middle"
              fill="#475569"
              fontSize="10"
              fontWeight="700"
            >
              PLC BACKPLANE BUS
            </text>

            {/* Machine enclosure */}

            <rect
              x="820"
              y="30"
              width="475"
              height="700"
              rx="28"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="3"
            />

            <text
              x="855"
              y="72"
              fill="#0f172a"
              fontSize="20"
              fontWeight="800"
            >
              MACHINE DEMONSTRATION
            </text>

            <text
              x="855"
              y="98"
              fill="#64748b"
              fontSize="12"
            >
              Conveyor · tank · valve · alarm ·
              servo
            </text>

            {/* Input flow */}

            <path
              d="M845 180 H785 V480 H260"
              fill="none"
              stroke={
                readActive
                  ? "#2563eb"
                  : "#cbd5e1"
              }
              strokeWidth="4"
              strokeDasharray={
                readActive ? "12 9" : undefined
              }
              markerEnd={
                readActive
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            {/* Output flow */}

            <path
              d="M260 530 H785 V325 H845"
              fill="none"
              stroke={
                writeActive
                  ? "#2563eb"
                  : "#cbd5e1"
              }
              strokeWidth="4"
              strokeDasharray={
                writeActive ? "12 9" : undefined
              }
              markerEnd={
                writeActive
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            {/* Power module */}

            <SpecNode
              id="power"
              active={powered}
              selected={
                selectedSpecification === "power"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="60"
                y="170"
                width="145"
                height="180"
                rx="18"
                fill="#ffffff"
                stroke={stroke("power", powered)}
                strokeWidth="3"
              />

              <text
                x="132"
                y="202"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                POWER
              </text>

              <circle
                cx="132"
                cy="252"
                r="29"
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth="4"
              />

              <path
                d="M121 231 L143 231 L131 252 L147 252 L119 281 L128 259 L112 259 Z"
                fill="#2563eb"
              />

              <text
                x="132"
                y="311"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="14"
                fontWeight="800"
              >
                {profile.powerSupply}
              </text>

              <text
                x="132"
                y="334"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                CPU + BACKPLANE
              </text>
            </SpecNode>

            {/* CPU */}

            <SpecNode
              id="cpu"
              active={
                executeActive || serviceActive
              }
              selected={
                selectedSpecification === "cpu"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="230"
                y="170"
                width="215"
                height="180"
                rx="18"
                fill="#eff6ff"
                stroke={stroke(
                  "cpu",
                  executeActive || serviceActive,
                )}
                strokeWidth="4"
              />

              <text
                x="337"
                y="202"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="15"
                fontWeight="800"
              >
                CPU
              </text>

              <rect
                x="260"
                y="222"
                width="155"
                height="67"
                rx="10"
                fill="#0f172a"
              />

              <text
                x="337"
                y="250"
                textAnchor="middle"
                fill="#86efac"
                fontSize="17"
                fontWeight="800"
              >
                {!powered
                  ? "OFF"
                  : stage === "idle"
                    ? "READY"
                    : stage.toUpperCase()}
              </text>

              <text
                x="337"
                y="274"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="10"
              >
                {formatScan(profile.scanMs)} profile
              </text>

              <text
                x="337"
                y="317"
                textAnchor="middle"
                fill="#334155"
                fontSize="10"
                fontWeight="700"
              >
                {profile.processor}
              </text>

              <text
                x="337"
                y="337"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                LOGIC · TIMING · DIAGNOSTICS
              </text>
            </SpecNode>

            {/* Memory */}

            <SpecNode
              id="memory"
              active={executeActive}
              selected={
                selectedSpecification === "memory"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="470"
                y="170"
                width="135"
                height="180"
                rx="18"
                fill="#ffffff"
                stroke={stroke(
                  "memory",
                  executeActive,
                )}
                strokeWidth="3"
              />

              <text
                x="537"
                y="202"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                MEMORY
              </text>

              {[0, 1, 2, 3].map((index) => (
                <rect
                  key={index}
                  x="493"
                  y={225 + index * 25}
                  width="88"
                  height="16"
                  rx="4"
                  fill={
                    executeActive
                      ? "#2563eb"
                      : "#cbd5e1"
                  }
                />
              ))}

              <text
                x="537"
                y="322"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="15"
                fontWeight="800"
              >
                {formatMemory(profile.memoryKb)}
              </text>

              <text
                x="537"
                y="341"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                PROGRAM + DATA
              </text>
            </SpecNode>

            {/* Network */}

            <SpecNode
              id="network"
              active={serviceActive}
              selected={
                selectedSpecification === "network"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="630"
                y="170"
                width="130"
                height="180"
                rx="18"
                fill="#ffffff"
                stroke={stroke(
                  "network",
                  serviceActive,
                )}
                strokeWidth="3"
              />

              <text
                x="695"
                y="202"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                NETWORK
              </text>

              <rect
                x="662"
                y="228"
                width="66"
                height="48"
                rx="8"
                fill="#ffffff"
                stroke="#64748b"
                strokeWidth="3"
              />

              {[0, 1, 2, 3, 4].map((index) => (
                <line
                  key={index}
                  x1={670 + index * 12}
                  y1="276"
                  x2={670 + index * 12}
                  y2="288"
                  stroke="#64748b"
                  strokeWidth="3"
                />
              ))}

              <text
                x="695"
                y="315"
                textAnchor="middle"
                fill={
                  profile.ethernet
                    ? "#059669"
                    : "#dc2626"
                }
                fontSize="12"
                fontWeight="800"
              >
                {profile.ethernet
                  ? "ETHERNET"
                  : "NO ETHERNET"}
              </text>

              <text
                x="695"
                y="338"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                HMI · SCADA · DRIVES
              </text>
            </SpecNode>

            {/* Digital I/O */}

            <SpecNode
              id="digitalIo"
              active={readActive || writeActive}
              selected={
                selectedSpecification ===
                "digitalIo"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="60"
                y="390"
                width="205"
                height="180"
                rx="18"
                fill="#ffffff"
                stroke={stroke(
                  "digitalIo",
                  readActive || writeActive,
                )}
                strokeWidth="3"
              />

              <text
                x="162"
                y="422"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                DIGITAL I/O
              </text>

              {[
                inputImage.start,
                inputImage.stop,
                inputImage.levelHigh,
                inputImage.safetyGateClosed,
                outputImage.conveyor,
                outputImage.valve,
                outputImage.alarm,
                false,
              ].map((active, index) => (
                <circle
                  key={index}
                  cx={101 + (index % 4) * 41}
                  cy={
                    465 +
                    Math.floor(index / 4) * 42
                  }
                  r="10"
                  fill={
                    active ? "#10b981" : "#e2e8f0"
                  }
                  stroke={
                    active ? "#059669" : "#94a3b8"
                  }
                  strokeWidth="3"
                />
              ))}

              <text
                x="162"
                y="548"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="15"
                fontWeight="800"
              >
                {profile.digitalIo} points
              </text>
            </SpecNode>

            {/* Analog I/O */}

            <SpecNode
              id="analogIo"
              active={writeActive}
              selected={
                selectedSpecification === "analogIo"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="290"
                y="390"
                width="155"
                height="180"
                rx="18"
                fill="#ffffff"
                stroke={stroke(
                  "analogIo",
                  writeActive,
                )}
                strokeWidth="3"
              />

              <text
                x="367"
                y="422"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                ANALOG I/O
              </text>

              <path
                d="M318 480 C333 440 348 520 363 480 C378 440 393 520 417 480"
                fill="none"
                stroke="#2563eb"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <text
                x="367"
                y="530"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="15"
                fontWeight="800"
              >
                {profile.analogIo} channels
              </text>

              <text
                x="367"
                y="552"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                VOLTAGE · CURRENT · TEMP
              </text>
            </SpecNode>

            {/* Motion */}

            <SpecNode
              id="motion"
              active={
                writeActive && requirements.motion
              }
              selected={
                selectedSpecification === "motion"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="470"
                y="390"
                width="135"
                height="180"
                rx="18"
                fill="#ffffff"
                stroke={stroke(
                  "motion",
                  writeActive && requirements.motion,
                )}
                strokeWidth="3"
              />

              <text
                x="537"
                y="422"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                MOTION
              </text>

              <circle
                cx="537"
                cy="480"
                r="34"
                fill="#ffffff"
                stroke={
                  profile.motion
                    ? "#2563eb"
                    : "#94a3b8"
                }
                strokeWidth="4"
              />

              <line
                x1="537"
                y1="480"
                x2="560"
                y2="458"
                stroke={
                  profile.motion
                    ? "#2563eb"
                    : "#94a3b8"
                }
                strokeWidth="5"
                strokeLinecap="round"
              />

              <text
                x="537"
                y="535"
                textAnchor="middle"
                fill={
                  profile.motion
                    ? "#059669"
                    : "#dc2626"
                }
                fontSize="11"
                fontWeight="800"
              >
                {profile.motion
                  ? "SUPPORTED"
                  : "NOT SUPPORTED"}
              </text>
            </SpecNode>

            {/* Expansion */}

            <SpecNode
              id="expansion"
              active={serviceActive}
              selected={
                selectedSpecification ===
                "expansion"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="630"
                y="390"
                width="130"
                height="180"
                rx="18"
                fill="#ffffff"
                stroke={stroke(
                  "expansion",
                  serviceActive,
                )}
                strokeWidth="3"
              />

              <text
                x="695"
                y="422"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                EXPANSION
              </text>

              {[0, 1, 2].map((index) => (
                <rect
                  key={index}
                  x={655 + index * 27}
                  y="458"
                  width="20"
                  height="57"
                  rx="4"
                  fill="#dbeafe"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              ))}

              <text
                x="695"
                y="542"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="14"
                fontWeight="800"
              >
                {profile.expansionModules} modules
              </text>
            </SpecNode>

            {/* Environment */}

            <SpecNode
              id="environment"
              active={serviceActive}
              selected={
                selectedSpecification ===
                "environment"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="60"
                y="605"
                width="260"
                height="80"
                rx="18"
                fill="#ffffff"
                stroke={stroke(
                  "environment",
                  serviceActive,
                )}
                strokeWidth="3"
              />

              <text
                x="86"
                y="635"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                ENVIRONMENT
              </text>

              <text
                x="86"
                y="662"
                fill="#2563eb"
                fontSize="14"
                fontWeight="800"
              >
                0–{profile.maxTemperatureC} °C
              </text>

              <text
                x="205"
                y="650"
                fill={
                  profile.harshEnvironment
                    ? "#059669"
                    : "#64748b"
                }
                fontSize="11"
                fontWeight="700"
              >
                {profile.harshEnvironment
                  ? "HARSH-RATED"
                  : "STANDARD"}
              </text>
            </SpecNode>

            {/* Safety */}

            <SpecNode
              id="safety"
              active={
                serviceActive && requirements.safety
              }
              selected={
                selectedSpecification === "safety"
              }
              onSelect={onSelectSpecification}
            >
              <rect
                x="345"
                y="605"
                width="200"
                height="80"
                rx="18"
                fill="#ffffff"
                stroke={stroke(
                  "safety",
                  serviceActive && requirements.safety,
                )}
                strokeWidth="3"
              />

              <text
                x="445"
                y="635"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                INTEGRATED SAFETY
              </text>

              <text
                x="445"
                y="662"
                textAnchor="middle"
                fill={
                  profile.safety
                    ? "#059669"
                    : "#dc2626"
                }
                fontSize="13"
                fontWeight="800"
              >
                {profile.safety
                  ? "SUPPORTED"
                  : "NOT SUPPORTED"}
              </text>
            </SpecNode>

            {/* Project fit */}

            <rect
              x="570"
              y="605"
              width="190"
              height="80"
              rx="18"
              fill={
                evaluation.isFit
                  ? "#ecfdf5"
                  : "#fef2f2"
              }
              stroke={
                evaluation.isFit
                  ? "#10b981"
                  : "#ef4444"
              }
              strokeWidth="3"
            />

            <text
              x="665"
              y="635"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="700"
            >
              PROJECT FIT
            </text>

            <text
              x="665"
              y="663"
              textAnchor="middle"
              fill={
                evaluation.isFit
                  ? "#059669"
                  : "#dc2626"
              }
              fontSize="18"
              fontWeight="800"
            >
              {evaluation.percentage}%
            </text>

            {/* Machine inputs */}

            <rect
              x="850"
              y="130"
              width="405"
              height="100"
              rx="20"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="3"
            />

            <text
              x="1052"
              y="160"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="13"
              fontWeight="700"
            >
              MACHINE INPUTS
            </text>

            {[
              {
                label: "START",
                value: inputImage.start,
                x: 900,
              },
              {
                label: "STOP",
                value: inputImage.stop,
                x: 995,
              },
              {
                label: "LEVEL",
                value: inputImage.levelHigh,
                x: 1090,
              },
              {
                label: "GATE",
                value: inputImage.safetyGateClosed,
                x: 1185,
              },
            ].map((item) => (
              <g key={item.label}>
                <circle
                  cx={item.x}
                  cy="192"
                  r="12"
                  fill={
                    item.value
                      ? "#10b981"
                      : "#e2e8f0"
                  }
                  stroke={
                    item.value
                      ? "#059669"
                      : "#94a3b8"
                  }
                  strokeWidth="3"
                />

                <text
                  x={item.x}
                  y="218"
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="9"
                  fontWeight="700"
                >
                  {item.label}
                </text>
              </g>
            ))}

            {/* Conveyor */}

            <rect
              x="850"
              y="260"
              width="405"
              height="140"
              rx="20"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="3"
            />

            <text
              x="1052"
              y="290"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="13"
              fontWeight="700"
            >
              CONVEYOR OUTPUT Q0.0
            </text>

            <rect
              x="915"
              y="337"
              width="300"
              height="25"
              rx="12"
              fill="#475569"
            />

            {[0, 1, 2, 3, 4, 5].map((index) => (
              <circle
                key={index}
                cx={937 + index * 52}
                cy="349"
                r="10"
                fill="#94a3b8"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
            ))}

            <motion.g
              animate={{
                x: physicalOutputs.conveyor
                  ? [0, 240]
                  : 0,
              }}
              transition={{
                duration: 1.5,
                repeat:
                  physicalOutputs.conveyor
                    ? Number.POSITIVE_INFINITY
                    : 0,
                ease: "linear",
              }}
            >
              <rect
                x="930"
                y="305"
                width="48"
                height="31"
                rx="5"
                fill="#dbeafe"
                stroke="#2563eb"
                strokeWidth="3"
              />
            </motion.g>

            <circle
              cx="885"
              cy="343"
              r="31"
              fill="#ffffff"
              stroke={
                physicalOutputs.conveyor
                  ? "#2563eb"
                  : "#94a3b8"
              }
              strokeWidth="4"
            />

            <motion.g
              style={{
                transformOrigin: "885px 343px",
              }}
              animate={{
                rotate:
                  physicalOutputs.conveyor
                    ? 360
                    : 0,
              }}
              transition={{
                duration: 0.8,
                repeat:
                  physicalOutputs.conveyor
                    ? Number.POSITIVE_INFINITY
                    : 0,
                ease: "linear",
              }}
            >
              <line
                x1="885"
                y1="321"
                x2="885"
                y2="365"
                stroke="#2563eb"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <line
                x1="863"
                y1="343"
                x2="907"
                y2="343"
                stroke="#2563eb"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </motion.g>

            <text
              x="1052"
              y="386"
              textAnchor="middle"
              fill={
                physicalOutputs.conveyor
                  ? "#059669"
                  : "#64748b"
              }
              fontSize="10"
              fontWeight="800"
            >
              {physicalOutputs.conveyor
                ? "RUNNING"
                : "STOPPED"}
            </text>

            {/* Tank */}

            <rect
              x="850"
              y="425"
              width="255"
              height="240"
              rx="20"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="3"
            />

            <text
              x="977"
              y="455"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="13"
              fontWeight="700"
            >
              FILLING VALVE Q0.1
            </text>

            <path
              d="M875 505 H918"
              fill="none"
              stroke={
                physicalOutputs.valve
                  ? "#10b981"
                  : "#cbd5e1"
              }
              strokeWidth="5"
              markerEnd={
                physicalOutputs.valve
                  ? "url(#greenArrow)"
                  : "url(#grayArrow)"
              }
            />

            <path
              d="M918 487 L947 505 L918 523 Z"
              fill={
                physicalOutputs.valve
                  ? "#10b981"
                  : "#e2e8f0"
              }
              stroke="#64748b"
              strokeWidth="3"
            />

            <path
              d="M977 487 L947 505 L977 523 Z"
              fill={
                physicalOutputs.valve
                  ? "#10b981"
                  : "#e2e8f0"
              }
              stroke="#64748b"
              strokeWidth="3"
            />

            <path
              d="M977 505 H1028 V530"
              fill="none"
              stroke={
                physicalOutputs.valve
                  ? "#10b981"
                  : "#cbd5e1"
              }
              strokeWidth="5"
            />

            <rect
              x="920"
              y="530"
              width="130"
              height="110"
              rx="12"
              fill="#ffffff"
              stroke="#64748b"
              strokeWidth="4"
            />

            <motion.rect
              x="924"
              width="122"
              rx="7"
              fill="#bfdbfe"
              animate={{
                y: waterY,
                height: waterHeight,
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 18,
              }}
            />

            <text
              x="985"
              y="658"
              textAnchor="middle"
              fill="#1d4ed8"
              fontSize="10"
              fontWeight="800"
            >
              {inputImage.levelHigh
                ? "LEVEL HIGH"
                : "LEVEL LOW"}
            </text>

            {/* Alarm */}

            <rect
              x="1130"
              y="425"
              width="125"
              height="105"
              rx="20"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="3"
            />

            <text
              x="1192"
              y="454"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="11"
              fontWeight="700"
            >
              ALARM Q0.2
            </text>

            <motion.circle
              cx="1192"
              cy="488"
              r="22"
              fill={
                physicalOutputs.alarm
                  ? "#ef4444"
                  : "#e2e8f0"
              }
              stroke={
                physicalOutputs.alarm
                  ? "#dc2626"
                  : "#94a3b8"
              }
              strokeWidth="4"
              animate={
                physicalOutputs.alarm
                  ? {
                      opacity: [0.35, 1, 0.35],
                    }
                  : {
                      opacity: 1,
                    }
              }
              transition={{
                duration: 0.65,
                repeat:
                  physicalOutputs.alarm
                    ? Number.POSITIVE_INFINITY
                    : 0,
              }}
            />

            {/* Servo */}

            <rect
              x="1130"
              y="555"
              width="125"
              height="110"
              rx="20"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="3"
            />

            <text
              x="1192"
              y="583"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="11"
              fontWeight="700"
            >
              SERVO AXIS
            </text>

            <circle
              cx="1192"
              cy="620"
              r="30"
              fill="#ffffff"
              stroke={
                requirements.motion
                  ? profile.motion
                    ? "#2563eb"
                    : "#ef4444"
                  : "#94a3b8"
              }
              strokeWidth="4"
            />

            <motion.line
              x1="1192"
              y1="620"
              x2="1192"
              y2="593"
              stroke="#2563eb"
              strokeWidth="5"
              strokeLinecap="round"
              style={{
                transformOrigin: "1192px 620px",
              }}
              animate={{
                rotate: servoAngle,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 16,
              }}
            />

            <circle
              cx="1192"
              cy="620"
              r="6"
              fill="#2563eb"
            />

            <text
              x="1192"
              y="658"
              textAnchor="middle"
              fill="#475569"
              fontSize="9"
              fontWeight="800"
            >
              {physicalOutputs.servoPosition.toFixed(
                0,
              )}
              %
            </text>

            {/* Animated data packets */}

            {stage === "read" ? (
              <motion.circle
                r="7"
                fill="#2563eb"
                initial={{
                  cx: 845,
                  cy: 180,
                  opacity: 0,
                }}
                animate={{
                  cx: [845, 785, 785, 260],
                  cy: [180, 180, 480, 480],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat:
                    Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ) : null}

            {stage === "write" ? (
              <motion.circle
                r="7"
                fill="#10b981"
                initial={{
                  cx: 260,
                  cy: 530,
                  opacity: 0,
                }}
                animate={{
                  cx: [260, 785, 785, 845],
                  cy: [530, 530, 325, 325],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat:
                    Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ) : null}

            <text
              x="660"
              y="760"
              textAnchor="middle"
              fill="#64748b"
              fontSize="12"
            >
              Select a PLC using capacity,
              performance, communication,
              expansion, feature, and
              environmental requirements.
            </text>
          </svg>
        </div>

        {!powered ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-4 backdrop-blur-[1px]">
            <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-mono text-sm font-bold text-blue-700">
                PLC
              </div>

              <p className="mt-3 font-semibold text-slate-900">
                PLC power is OFF
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Configure the project, power
                the PLC, and run a scan.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function PlcSpecificationsPage() {
  const [profileId, setProfileId] =
    useState<PlcProfileId>("compact");

  const [requirements, setRequirements] =
    useState<Requirements>(
      INITIAL_REQUIREMENTS,
    );

  const [mode, setMode] =
    useState<PlcMode>("off");

  const [stage, setStage] =
    useState<ScanStage>("idle");

  const [busy, setBusy] =
    useState(false);

  const [scanDuration, setScanDuration] =
    useState(2200);

  const [machineInputs, setMachineInputs] =
    useState<MachineInputs>(
      INITIAL_INPUTS,
    );

  const [inputImage, setInputImage] =
    useState<MachineInputs>(
      INITIAL_INPUTS,
    );

  const [motorLatch, setMotorLatch] =
    useState(false);

  const [outputImage, setOutputImage] =
    useState<MachineOutputs>(
      INITIAL_OUTPUTS,
    );

  const [
    physicalOutputs,
    setPhysicalOutputs,
  ] =
    useState<MachineOutputs>(
      INITIAL_OUTPUTS,
    );

  const [servoTarget, setServoTarget] =
    useState(50);

  const [scanCount, setScanCount] =
    useState(0);

  const [
    selectedSpecification,
    setSelectedSpecification,
  ] =
    useState<SpecificationId>("cpu");

  const profile = PLC_PROFILES[profileId];

  const evaluation = useMemo(
    () =>
      evaluateProfile(
        profile,
        requirements,
      ),
    [profile, requirements],
  );

  const recommendedId = useMemo(
    () =>
      findRecommendedProfile(
        requirements,
      ),
    [requirements],
  );

  const recommendedProfile =
    PLC_PROFILES[recommendedId];

  const stageInformation =
    STAGE_INFORMATION[stage];

  const selectedInformation =
    SPECIFICATION_INFORMATION[
      selectedSpecification
    ];

  const configurationLocked =
    mode === "run" || busy;

  /* =======================================================
     ASYNC REFS
  ======================================================= */

  const modeRef = useRef<PlcMode>(mode);
  const busyRef = useRef(false);
  const abortVersionRef = useRef(0);
  const motorLatchRef = useRef(false);

  const scanDurationRef =
    useRef(scanDuration);

  const contextRef =
    useRef<SimulationContext>({
      profile,
      requirements,
      evaluation,
      machineInputs,
      servoTarget,
    });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    scanDurationRef.current =
      scanDuration;
  }, [scanDuration]);

  useEffect(() => {
    contextRef.current = {
      profile,
      requirements,
      evaluation,
      machineInputs,
      servoTarget,
    };
  }, [
    profile,
    requirements,
    evaluation,
    machineInputs,
    servoTarget,
  ]);

  /* =======================================================
     STATE HELPERS
  ======================================================= */

  const updateRequirement = useCallback(
    <Key extends keyof Requirements>(
      key: Key,
      value: Requirements[Key],
    ) => {
      setRequirements((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  const toggleInput = useCallback(
    (key: keyof MachineInputs) => {
      setMachineInputs((current) => ({
        ...current,
        [key]: !current[key],
      }));
    },
    [],
  );

  /* =======================================================
     PLC SCAN
  ======================================================= */

  const performScan =
    useCallback(async (): Promise<boolean> => {
      if (
        modeRef.current === "off" ||
        busyRef.current
      ) {
        return false;
      }

      busyRef.current = true;
      setBusy(true);

      const token =
        abortVersionRef.current;

      const context = {
        profile: contextRef.current.profile,
        requirements: {
          ...contextRef.current.requirements,
        },
        evaluation:
          contextRef.current.evaluation,
        machineInputs: {
          ...contextRef.current.machineInputs,
        },
        servoTarget:
          contextRef.current.servoTarget,
      };

      const phaseDuration = Math.max(
        170,
        Math.round(
          scanDurationRef.current / 4,
        ),
      );

      const validScan = () =>
        token ===
          abortVersionRef.current &&
        modeRef.current !== "off";

      try {
        /*
         * 1. READ INPUTS
         */

        setStage("read");

        const snapshot = {
          ...context.machineInputs,
        };

        setInputImage(snapshot);

        await wait(phaseDuration);

        if (!validScan()) {
          return false;
        }

        /*
         * 2. EXECUTE PROGRAM
         */

        setStage("execute");

        const projectApproved =
          context.evaluation.isFit;

        const safetyPermission =
          !context.requirements.safety ||
          snapshot.safetyGateClosed;

        const nextConveyor =
          projectApproved &&
          safetyPermission &&
          !snapshot.stop &&
          (
            snapshot.start ||
            motorLatchRef.current
          );

        const nextValve =
          projectApproved &&
          !snapshot.stop &&
          !snapshot.levelHigh;

        const nextAlarm =
          !projectApproved ||
          snapshot.stop ||
          (
            context.requirements.safety &&
            !snapshot.safetyGateClosed
          );

        const nextServo =
          projectApproved &&
          context.requirements.motion &&
          context.profile.motion &&
          !snapshot.stop
            ? clamp(
                context.servoTarget,
                0,
                100,
              )
            : 0;

        const nextOutputs: MachineOutputs = {
          conveyor: nextConveyor,
          valve: nextValve,
          alarm: nextAlarm,
          servoPosition: nextServo,
        };

        motorLatchRef.current =
          nextConveyor;

        setMotorLatch(nextConveyor);
        setOutputImage(nextOutputs);

        await wait(phaseDuration);

        if (!validScan()) {
          return false;
        }

        /*
         * 3. WRITE OUTPUTS
         */

        setStage("write");

        setPhysicalOutputs({
          ...nextOutputs,
        });

        await wait(phaseDuration);

        if (!validScan()) {
          return false;
        }

        /*
         * 4. SYSTEM SERVICES
         */

        setStage("service");

        setScanCount(
          (current) => current + 1,
        );

        await wait(phaseDuration);

        if (!validScan()) {
          return false;
        }

        setStage("idle");

        return true;
      } finally {
        if (
          token ===
          abortVersionRef.current
        ) {
          busyRef.current = false;
          setBusy(false);
        }
      }
    }, []);

  /* =======================================================
     AUTOMATIC LOOP
  ======================================================= */

  useEffect(() => {
    if (mode !== "run") {
      return;
    }

    let cancelled = false;

    const loop = async () => {
      while (
        !cancelled &&
        modeRef.current === "run"
      ) {
        await performScan();

        if (
          !cancelled &&
          modeRef.current === "run"
        ) {
          await wait(120);
        }
      }
    };

    void loop();

    return () => {
      cancelled = true;
    };
  }, [mode, performScan]);

  /* =======================================================
     PLC CONTROLS
  ======================================================= */

  const togglePower =
    useCallback(() => {
      if (
        modeRef.current !== "off"
      ) {
        abortVersionRef.current += 1;

        modeRef.current = "off";
        busyRef.current = false;
        motorLatchRef.current = false;

        setMode("off");
        setBusy(false);
        setStage("idle");
        setMotorLatch(false);
        setInputImage(INITIAL_INPUTS);
        setOutputImage(INITIAL_OUTPUTS);
        setPhysicalOutputs(
          INITIAL_OUTPUTS,
        );

        return;
      }

      modeRef.current = "stop";
      setMode("stop");
      setStage("idle");
    }, []);

  const toggleRun =
    useCallback(() => {
      if (
        modeRef.current === "off"
      ) {
        return;
      }

      if (
        modeRef.current === "run"
      ) {
        abortVersionRef.current += 1;

        modeRef.current = "stop";
        busyRef.current = false;

        setMode("stop");
        setBusy(false);
        setStage("idle");

        return;
      }

      modeRef.current = "run";
      setMode("run");
    }, []);

  const resetSimulation =
    useCallback(() => {
      abortVersionRef.current += 1;

      modeRef.current = "off";
      busyRef.current = false;
      motorLatchRef.current = false;
      scanDurationRef.current = 2200;

      setProfileId("compact");
      setRequirements(
        INITIAL_REQUIREMENTS,
      );

      setMode("off");
      setStage("idle");
      setBusy(false);
      setScanDuration(2200);

      setMachineInputs(
        INITIAL_INPUTS,
      );

      setInputImage(
        INITIAL_INPUTS,
      );

      setMotorLatch(false);

      setOutputImage(
        INITIAL_OUTPUTS,
      );

      setPhysicalOutputs(
        INITIAL_OUTPUTS,
      );

      setServoTarget(50);
      setScanCount(0);

      setSelectedSpecification(
        "cpu",
      );
    }, []);

  /* =======================================================
     DISPLAY VALUES
  ======================================================= */

  const digitalHeadroom =
    profile.digitalIo -
    requirements.digitalIo;

  const analogHeadroom =
    profile.analogIo -
    requirements.analogIo;

  const memoryHeadroom =
    profile.memoryKb -
    requirements.memoryKb;

  const fitClasses =
    evaluation.isFit
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-white px-3 py-4 text-slate-900 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1650px]">
          {/* Header */}

          <header className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    active={mode !== "off"}
                    tone="green"
                  >
                    {mode !== "off"
                      ? "POWER ON"
                      : "POWER OFF"}
                  </Badge>

                  <Badge
                    active={mode === "run"}
                    tone="blue"
                  >
                    {mode === "run"
                      ? "AUTO SCAN"
                      : "TEACHING MODE"}
                  </Badge>

                  <Badge
                    active={evaluation.isFit}
                    tone={
                      evaluation.isFit
                        ? "green"
                        : "red"
                    }
                  >
                    {evaluation.isFit
                      ? "PROJECT FIT"
                      : "SPECIFICATION MISMATCH"}
                  </Badge>
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  PLC Specifications Interactive
                  Simulator
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                  Compare PLC I/O capacity,
                  memory, scan performance,
                  communication, expansion,
                  motion, safety, redundancy,
                  and environmental ratings.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Metric
                  label="Selected PLC"
                  value={profile.name}
                  helper={profile.processor}
                />

                <Metric
                  label="Project fit"
                  value={`${evaluation.percentage}%`}
                  helper={`${evaluation.passed}/${evaluation.total} checks passed`}
                />

                <Metric
                  label="Required I/O"
                  value={
                    requirements.digitalIo +
                    requirements.analogIo
                  }
                  helper={`${requirements.digitalIo} digital + ${requirements.analogIo} analog`}
                />

                <Metric
                  label="Target scan"
                  value={formatScan(
                    requirements.scanMs,
                  )}
                  helper={`PLC profile: ${formatScan(
                    profile.scanMs,
                  )}`}
                />
              </div>
            </div>
          </header>

          <div className="grid gap-5 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)]">
            {/* LEFT CONTROL PANEL */}

            <aside className="space-y-4 md:sticky md:top-4 md:self-start">
              <Card
                title="Simulation controls"
                description="Power and operate the PLC scan."
              >
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    type="button"
                    onClick={togglePower}
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      mode !== "off"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-blue-600 bg-blue-600 text-white",
                    ].join(" ")}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    {mode !== "off"
                      ? "Power OFF"
                      : "Power ON"}
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={mode === "off"}
                    onClick={toggleRun}
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      mode === "off"
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : mode === "run"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-emerald-600 bg-emerald-600 text-white",
                    ].join(" ")}
                    whileTap={
                      mode !== "off"
                        ? {
                            scale: 0.98,
                          }
                        : undefined
                    }
                  >
                    {mode === "run"
                      ? "Stop Auto"
                      : "Auto Scan"}
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={
                      mode === "off" ||
                      mode === "run" ||
                      busy
                    }
                    onClick={() =>
                      void performScan()
                    }
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      mode === "off" ||
                      mode === "run" ||
                      busy
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : "border-violet-200 bg-violet-50 text-violet-700",
                    ].join(" ")}
                    whileTap={
                      mode !== "off" &&
                      mode !== "run" &&
                      !busy
                        ? {
                            scale: 0.98,
                          }
                        : undefined
                    }
                  >
                    Single Scan
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={resetSimulation}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700"
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    Reset
                  </motion.button>
                </div>
              </Card>

              <Card
                title="PLC class"
                description="Select a vendor-neutral educational profile."
              >
                <select
                  value={profileId}
                  disabled={configurationLocked}
                  onChange={(event) =>
                    setProfileId(
                      event.target
                        .value as PlcProfileId,
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  {PROFILE_ORDER.map(
                    (currentId) => (
                      <option
                        key={currentId}
                        value={currentId}
                      >
                        {
                          PLC_PROFILES[
                            currentId
                          ].name
                        }
                      </option>
                    ),
                  )}
                </select>

                <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                  {profile.description}
                </p>
              </Card>

              <Card
                title="Capacity requirements"
                description="Define the project size."
              >
                <div className="space-y-3">
                  <RangeField
                    id="digital-io"
                    label="Digital I/O"
                    value={
                      requirements.digitalIo
                    }
                    minimum={4}
                    maximum={512}
                    step={4}
                    unit=""
                    disabled={
                      configurationLocked
                    }
                    onChange={(value) =>
                      updateRequirement(
                        "digitalIo",
                        value,
                      )
                    }
                  />

                  <RangeField
                    id="analog-io"
                    label="Analog I/O"
                    value={
                      requirements.analogIo
                    }
                    minimum={0}
                    maximum={64}
                    step={1}
                    unit=""
                    disabled={
                      configurationLocked
                    }
                    onChange={(value) =>
                      updateRequirement(
                        "analogIo",
                        value,
                      )
                    }
                  />

                  <RangeField
                    id="program-memory"
                    label="Program memory"
                    value={
                      requirements.memoryKb
                    }
                    minimum={16}
                    maximum={2048}
                    step={16}
                    unit=" KB"
                    disabled={
                      configurationLocked
                    }
                    onChange={(value) =>
                      updateRequirement(
                        "memoryKb",
                        value,
                      )
                    }
                  />

                  <RangeField
                    id="scan-time"
                    label="Required scan time"
                    value={requirements.scanMs}
                    minimum={1}
                    maximum={50}
                    step={1}
                    unit=" ms"
                    disabled={
                      configurationLocked
                    }
                    onChange={(value) =>
                      updateRequirement(
                        "scanMs",
                        value,
                      )
                    }
                  />

                  <RangeField
                    id="expansion-modules"
                    label="Expansion modules"
                    value={
                      requirements.expansionModules
                    }
                    minimum={0}
                    maximum={32}
                    step={1}
                    unit=""
                    disabled={
                      configurationLocked
                    }
                    onChange={(value) =>
                      updateRequirement(
                        "expansionModules",
                        value,
                      )
                    }
                  />
                </div>
              </Card>

              <Card
                title="Required features"
                description="Select specialist capabilities."
              >
                <div className="space-y-3">
                  <Toggle
                    checked={
                      requirements.ethernet
                    }
                    disabled={
                      configurationLocked
                    }
                    label="Industrial Ethernet"
                    description="HMI, SCADA, drive, and remote-I/O communication."
                    onChange={() =>
                      updateRequirement(
                        "ethernet",
                        !requirements.ethernet,
                      )
                    }
                  />

                  <Toggle
                    checked={
                      requirements.motion
                    }
                    disabled={
                      configurationLocked
                    }
                    label="Motion control"
                    description="Position and coordinated-axis control."
                    onChange={() =>
                      updateRequirement(
                        "motion",
                        !requirements.motion,
                      )
                    }
                  />

                  <Toggle
                    checked={
                      requirements.safety
                    }
                    disabled={
                      configurationLocked
                    }
                    label="Integrated safety"
                    description="Safety CPU and certified safety I/O."
                    onChange={() =>
                      updateRequirement(
                        "safety",
                        !requirements.safety,
                      )
                    }
                  />

                  <Toggle
                    checked={
                      requirements.redundancy
                    }
                    disabled={
                      configurationLocked
                    }
                    label="CPU redundancy"
                    description="Standby controller for critical systems."
                    onChange={() =>
                      updateRequirement(
                        "redundancy",
                        !requirements.redundancy,
                      )
                    }
                  />
                </div>
              </Card>

              <Card
                title="Environment"
                description="Set installation conditions."
              >
                <div className="space-y-3">
                  <RangeField
                    id="temperature"
                    label="Maximum temperature"
                    value={
                      requirements.maxTemperatureC
                    }
                    minimum={40}
                    maximum={70}
                    step={5}
                    unit=" °C"
                    disabled={
                      configurationLocked
                    }
                    onChange={(value) =>
                      updateRequirement(
                        "maxTemperatureC",
                        value,
                      )
                    }
                  />

                  <Toggle
                    checked={
                      requirements.harshEnvironment
                    }
                    disabled={
                      configurationLocked
                    }
                    label="Harsh environment"
                    description="Higher vibration, dust, or industrial exposure."
                    onChange={() =>
                      updateRequirement(
                        "harshEnvironment",
                        !requirements.harshEnvironment,
                      )
                    }
                  />
                </div>
              </Card>

              <Card
                title="Machine inputs"
                description="Operate the demonstration process."
              >
                <div className="space-y-3">
                  <Toggle
                    checked={
                      machineInputs.start
                    }
                    disabled={mode === "off"}
                    label="START input I0.0"
                    description="Starts and seals in the conveyor."
                    onChange={() =>
                      toggleInput("start")
                    }
                  />

                  <Toggle
                    checked={
                      machineInputs.stop
                    }
                    disabled={mode === "off"}
                    label="STOP input I0.1"
                    description="Stops outputs and activates the alarm."
                    onChange={() =>
                      toggleInput("stop")
                    }
                  />

                  <Toggle
                    checked={
                      machineInputs.levelHigh
                    }
                    disabled={mode === "off"}
                    label="Level-high input I0.2"
                    description="Closes the filling valve."
                    onChange={() =>
                      toggleInput("levelHigh")
                    }
                  />

                  {requirements.safety ? (
                    <Toggle
                      checked={
                        machineInputs.safetyGateClosed
                      }
                      disabled={mode === "off"}
                      label="Safety gate closed"
                      description="Permits conveyor operation."
                      onChange={() =>
                        toggleInput(
                          "safetyGateClosed",
                        )
                      }
                    />
                  ) : null}

                  {requirements.motion ? (
                    <RangeField
                      id="servo-target"
                      label="Servo target"
                      value={servoTarget}
                      minimum={0}
                      maximum={100}
                      step={1}
                      unit="%"
                      disabled={mode === "off"}
                      onChange={setServoTarget}
                    />
                  ) : null}
                </div>
              </Card>

              <Card
                title="Teaching speed"
                description="Slow the scan animation."
              >
                <RangeField
                  id="animation-speed"
                  label="Full scan cycle"
                  value={scanDuration}
                  minimum={1000}
                  maximum={5000}
                  step={100}
                  unit=" ms"
                  onChange={(value) => {
                    scanDurationRef.current =
                      value;

                    setScanDuration(value);
                  }}
                />
              </Card>
            </aside>

            {/* RIGHT SIMULATION AREA */}

            <section className="min-w-0 space-y-5">
              <PlcSpecificationCanvas
                mode={mode}
                stage={stage}
                profile={profile}
                requirements={requirements}
                evaluation={evaluation}
                inputImage={inputImage}
                outputImage={outputImage}
                physicalOutputs={
                  physicalOutputs
                }
                selectedSpecification={
                  selectedSpecification
                }
                onSelectSpecification={
                  setSelectedSpecification
                }
              />

              {/* Scan cycle */}

              <Card
                title="PLC scan cycle"
                description="The teaching simulation completes four stages."
              >
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-blue-600"
                    animate={{
                      width: `${stageInformation.progress}%`,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                  {(
                    [
                      "read",
                      "execute",
                      "write",
                      "service",
                    ] as const
                  ).map(
                    (
                      currentStage,
                      index,
                    ) => {
                      const information =
                        STAGE_INFORMATION[
                          currentStage
                        ];

                      const active =
                        stage === currentStage;

                      return (
                        <motion.div
                          key={currentStage}
                          className={[
                            "rounded-xl border p-3",

                            active
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 bg-white",
                          ].join(" ")}
                          animate={{
                            y: active ? -3 : 0,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={[
                                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",

                                active
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-500",
                              ].join(" ")}
                            >
                              {index + 1}
                            </span>

                            <Led active={active} />
                          </div>

                          <p className="mt-3 text-sm font-semibold text-slate-800">
                            {
                              information.shortTitle
                            }
                          </p>
                        </motion.div>
                      );
                    },
                  )}
                </div>

                <motion.div
                  key={stage}
                  className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4"
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <p className="font-semibold text-blue-900">
                    {stageInformation.title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    {
                      stageInformation.description
                    }
                  </p>
                </motion.div>
              </Card>

              {/* Fit cards */}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card title="Digital I/O fit">
                  <p
                    className={[
                      "text-2xl font-bold",

                      evaluation.checks.digitalIo
                        ? "text-emerald-700"
                        : "text-red-700",
                    ].join(" ")}
                  >
                    {evaluation.checks.digitalIo
                      ? "PASS"
                      : "FAIL"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {digitalHeadroom >= 0
                      ? `${digitalHeadroom} spare points`
                      : `${Math.abs(
                          digitalHeadroom,
                        )} points short`}
                  </p>
                </Card>

                <Card title="Analog I/O fit">
                  <p
                    className={[
                      "text-2xl font-bold",

                      evaluation.checks.analogIo
                        ? "text-emerald-700"
                        : "text-red-700",
                    ].join(" ")}
                  >
                    {evaluation.checks.analogIo
                      ? "PASS"
                      : "FAIL"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {analogHeadroom >= 0
                      ? `${analogHeadroom} spare channels`
                      : `${Math.abs(
                          analogHeadroom,
                        )} channels short`}
                  </p>
                </Card>

                <Card title="Memory fit">
                  <p
                    className={[
                      "text-2xl font-bold",

                      evaluation.checks.memory
                        ? "text-emerald-700"
                        : "text-red-700",
                    ].join(" ")}
                  >
                    {evaluation.checks.memory
                      ? "PASS"
                      : "FAIL"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {memoryHeadroom >= 0
                      ? `${formatMemory(
                          memoryHeadroom,
                        )} spare`
                      : `${formatMemory(
                          Math.abs(
                            memoryHeadroom,
                          ),
                        )} short`}
                  </p>
                </Card>

                <Card title="Scan performance">
                  <p
                    className={[
                      "text-2xl font-bold",

                      evaluation.checks.scan
                        ? "text-emerald-700"
                        : "text-red-700",
                    ].join(" ")}
                  >
                    {evaluation.checks.scan
                      ? "PASS"
                      : "FAIL"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    PLC: {formatScan(profile.scanMs)}
                    <br />
                    Required:{" "}
                    {formatScan(requirements.scanMs)}
                  </p>
                </Card>
              </div>

              {/* Selected spec and recommendation */}

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_370px]">
                <Card
                  title="Selected specification"
                  description="Click any hardware block in the canvas."
                >
                  <motion.div
                    key={selectedSpecification}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <Badge
                      active
                      tone="blue"
                    >
                      {selectedInformation.title}
                    </Badge>

                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {
                        selectedInformation.description
                      }
                    </p>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                      {
                        selectedInformation.example
                      }
                    </div>
                  </motion.div>
                </Card>

                <Card
                  title="PLC recommendation"
                  description="Smallest teaching profile satisfying the requirements."
                >
                  <div
                    className={[
                      "rounded-xl border p-4",
                      fitClasses,
                    ].join(" ")}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      Selected profile
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {evaluation.isFit
                        ? "Suitable"
                        : "Undersized"}
                    </p>

                    <p className="mt-2 text-sm leading-5">
                      {evaluation.isFit
                        ? `${profile.name} satisfies the current requirements.`
                        : `Missing: ${evaluation.failed.join(
                            ", ",
                          )}.`}
                    </p>
                  </div>

                  <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Recommended minimum
                    </p>

                    <p className="mt-1 font-semibold text-blue-900">
                      {recommendedProfile.name}
                    </p>
                  </div>

                  <motion.button
                    type="button"
                    disabled={
                      configurationLocked ||
                      profileId === recommendedId
                    }
                    onClick={() =>
                      setProfileId(recommendedId)
                    }
                    className={[
                      "mt-3 w-full rounded-xl border px-3 py-3 text-sm font-semibold",

                      configurationLocked ||
                      profileId === recommendedId
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : "border-blue-600 bg-blue-600 text-white",
                    ].join(" ")}
                    whileTap={
                      !configurationLocked &&
                      profileId !== recommendedId
                        ? {
                            scale: 0.98,
                          }
                        : undefined
                    }
                  >
                    Select Recommended PLC
                  </motion.button>
                </Card>
              </div>

              {/* Process images */}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card title="Input process image">
                  <div className="space-y-3">
                    <Led
                      active={inputImage.start}
                      label={`I0.0 START = ${bit(
                        inputImage.start,
                      )}`}
                    />

                    <Led
                      active={inputImage.stop}
                      danger
                      label={`I0.1 STOP = ${bit(
                        inputImage.stop,
                      )}`}
                    />

                    <Led
                      active={
                        inputImage.levelHigh
                      }
                      label={`I0.2 LEVEL = ${bit(
                        inputImage.levelHigh,
                      )}`}
                    />

                    {requirements.safety ? (
                      <Led
                        active={
                          inputImage.safetyGateClosed
                        }
                        label={`I0.3 GATE = ${bit(
                          inputImage.safetyGateClosed,
                        )}`}
                      />
                    ) : null}
                  </div>
                </Card>

                <Card title="Output process image">
                  <div className="space-y-3">
                    <Led
                      active={
                        outputImage.conveyor
                      }
                      label={`Q0.0 CONVEYOR = ${bit(
                        outputImage.conveyor,
                      )}`}
                    />

                    <Led
                      active={outputImage.valve}
                      label={`Q0.1 VALVE = ${bit(
                        outputImage.valve,
                      )}`}
                    />

                    <Led
                      active={outputImage.alarm}
                      danger
                      label={`Q0.2 ALARM = ${bit(
                        outputImage.alarm,
                      )}`}
                    />
                  </div>
                </Card>

                <Card title="Physical actuators">
                  <div className="space-y-3">
                    <Led
                      active={
                        physicalOutputs.conveyor
                      }
                      label={
                        physicalOutputs.conveyor
                          ? "Conveyor running"
                          : "Conveyor stopped"
                      }
                    />

                    <Led
                      active={
                        physicalOutputs.valve
                      }
                      label={
                        physicalOutputs.valve
                          ? "Valve open"
                          : "Valve closed"
                      }
                    />

                    <Led
                      active={
                        physicalOutputs.alarm
                      }
                      danger
                      label={
                        physicalOutputs.alarm
                          ? "Alarm active"
                          : "Alarm normal"
                      }
                    />
                  </div>
                </Card>

                <Card title="PLC status">
                  <div className="space-y-3">
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-slate-500">
                        Scans
                      </span>

                      <strong>{scanCount}</strong>
                    </div>

                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-slate-500">
                        Motor latch
                      </span>

                      <strong>
                        {bit(motorLatch)}
                      </strong>
                    </div>

                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-slate-500">
                        Servo position
                      </span>

                      <strong>
                        {physicalOutputs.servoPosition.toFixed(
                          0,
                        )}
                        %
                      </strong>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Comparison table */}

              <Card
                title="Educational PLC comparison"
                description="Generic teaching profiles—not manufacturer datasheet values."
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-3 py-3">
                          PLC class
                        </th>

                        <th className="px-3 py-3">
                          Digital I/O
                        </th>

                        <th className="px-3 py-3">
                          Analog I/O
                        </th>

                        <th className="px-3 py-3">
                          Memory
                        </th>

                        <th className="px-3 py-3">
                          Scan
                        </th>

                        <th className="px-3 py-3">
                          Expansion
                        </th>

                        <th className="px-3 py-3">
                          Main features
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {PROFILE_ORDER.map(
                        (currentId) => {
                          const currentProfile =
                            PLC_PROFILES[currentId];

                          const currentFit =
                            evaluateProfile(
                              currentProfile,
                              requirements,
                            );

                          const features = [
                            currentProfile.ethernet
                              ? "Ethernet"
                              : null,

                            currentProfile.motion
                              ? "Motion"
                              : null,

                            currentProfile.safety
                              ? "Safety"
                              : null,

                            currentProfile.redundancy
                              ? "Redundancy"
                              : null,
                          ]
                            .filter(Boolean)
                            .join(", ");

                          return (
                            <tr
                              key={currentId}
                              className={[
                                "border-b border-slate-100",

                                currentId === profileId
                                  ? "bg-blue-50"
                                  : "",
                              ].join(" ")}
                            >
                              <td className="px-3 py-3">
                                <p className="font-semibold text-slate-800">
                                  {
                                    currentProfile.name
                                  }
                                </p>

                                <p
                                  className={[
                                    "mt-1 text-xs font-semibold",

                                    currentFit.isFit
                                      ? "text-emerald-700"
                                      : "text-red-700",
                                  ].join(" ")}
                                >
                                  {currentFit.isFit
                                    ? "Suitable"
                                    : `${currentFit.percentage}% fit`}
                                </p>
                              </td>

                              <td className="px-3 py-3">
                                {
                                  currentProfile.digitalIo
                                }
                              </td>

                              <td className="px-3 py-3">
                                {
                                  currentProfile.analogIo
                                }
                              </td>

                              <td className="px-3 py-3">
                                {formatMemory(
                                  currentProfile.memoryKb,
                                )}
                              </td>

                              <td className="px-3 py-3">
                                {formatScan(
                                  currentProfile.scanMs,
                                )}
                              </td>

                              <td className="px-3 py-3">
                                {
                                  currentProfile.expansionModules
                                }{" "}
                                modules
                              </td>

                              <td className="px-3 py-3">
                                {features ||
                                  "Basic control"}
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <strong>
                  Teaching-model notice:
                </strong>{" "}
                these PLC classes and numeric
                values are generic educational
                examples. For real hardware,
                use the manufacturer’s current
                datasheet, I/O electrical
                ratings, instruction timing,
                communication limits,
                environmental approvals, and
                safety documentation.
              </div>
            </section>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}