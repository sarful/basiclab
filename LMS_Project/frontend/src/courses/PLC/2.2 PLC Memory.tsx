"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
} from "motion/react";

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

type MemoryArea =
  | "program"
  | "input"
  | "output"
  | "marker"
  | "data"
  | "timer"
  | "counter"
  | "retentive";

type MemoryState = Record<MemoryArea, number[]>;

type PhysicalInputs = {
  start: boolean;
  stop: boolean;
  level: boolean;
};

type PhysicalOutputs = {
  motor: boolean;
  valve: boolean;
  alarm: boolean;
};

type AreaDefinition = {
  title: string;
  shortTitle: string;
  prefix: string;
  description: string;
  example: string;
  volatile: boolean;
  writable: boolean;
  retainSelectable: boolean;
};

/* =========================================================
   MEMORY DEFINITIONS
========================================================= */

const AREA_ORDER: MemoryArea[] = [
  "program",
  "input",
  "output",
  "marker",
  "data",
  "timer",
  "counter",
  "retentive",
];

const AREA_DEFINITIONS: Record<
  MemoryArea,
  AreaDefinition
> = {
  program: {
    title: "Program Memory",
    shortTitle: "Program",
    prefix: "P",
    description:
      "Stores the PLC user program and the instructions fetched by the CPU during each scan.",
    example:
      "The sample bytes represent a simplified control program. Program memory is treated as non-volatile and read-only in this simulation.",
    volatile: false,
    writable: false,
    retainSelectable: false,
  },

  input: {
    title: "Input Process Image",
    shortTitle: "Input image",
    prefix: "I0.",
    description:
      "Stores a snapshot of physical input terminals captured at the beginning of a PLC scan.",
    example:
      "The control program reads the input image instead of repeatedly reading the physical terminals during the same scan.",
    volatile: true,
    writable: false,
    retainSelectable: false,
  },

  output: {
    title: "Output Process Image",
    shortTitle: "Output image",
    prefix: "Q0.",
    description:
      "Stores output commands calculated by the user program before the output module updates field devices.",
    example:
      "Q0.0 controls the motor, Q0.1 controls the valve and Q0.2 controls the warning alarm in this simulation.",
    volatile: true,
    writable: true,
    retainSelectable: false,
  },

  marker: {
    title: "Marker / Internal Memory",
    shortTitle: "Marker",
    prefix: "M",
    description:
      "Stores internal Boolean states and intermediate control logic that are not directly connected to physical I/O.",
    example:
      "M0 acts as the motor seal-in memory bit: START sets it and STOP clears it.",
    volatile: true,
    writable: true,
    retainSelectable: true,
  },

  data: {
    title: "Data Registers",
    shortTitle: "Data",
    prefix: "D",
    description:
      "Stores numeric process values, calculations, setpoints, recipes and communication data.",
    example:
      "D0 counts completed scans in this simplified byte-oriented learning model.",
    volatile: true,
    writable: true,
    retainSelectable: true,
  },

  timer: {
    title: "Timer Memory",
    shortTitle: "Timer",
    prefix: "T",
    description:
      "Stores accumulated timer values and timer-related state used by timing instructions.",
    example:
      "T0 accumulates while the level input is ON and resets when the level input turns OFF.",
    volatile: true,
    writable: true,
    retainSelectable: true,
  },

  counter: {
    title: "Counter Memory",
    shortTitle: "Counter",
    prefix: "C",
    description:
      "Stores accumulated event counts and counter state used by counting instructions.",
    example:
      "C0 increments on a rising edge of the level input, so holding the input ON does not repeatedly count it.",
    volatile: true,
    writable: true,
    retainSelectable: true,
  },

  retentive: {
    title: "Retentive Memory",
    shortTitle: "Retentive",
    prefix: "R",
    description:
      "Stores selected machine data that must remain available after a simulated power interruption.",
    example:
      "R0 mirrors the product counter and remains stored when PLC power is switched OFF.",
    volatile: false,
    writable: true,
    retainSelectable: false,
  },
};

/* =========================================================
   SCAN STAGES
========================================================= */

const STAGE_DEFINITIONS: Record<
  ScanStage,
  {
    title: string;
    description: string;
    progress: number;
  }
> = {
  idle: {
    title: "PLC memory system ready",
    description:
      "Power the PLC and run a scan to observe how information moves through the memory areas.",
    progress: 0,
  },

  read: {
    title: "1. Capture the input process image",
    description:
      "The input module snapshots the physical START, STOP and LEVEL states into I0.0, I0.1 and I0.2.",
    progress: 25,
  },

  execute: {
    title:
      "2. Fetch the program and update working memory",
    description:
      "The CPU reads program memory and uses the input image to update marker, data, timer, counter, retentive and output-image values.",
    progress: 50,
  },

  write: {
    title: "3. Transfer the output image",
    description:
      "The output module copies Q0.0, Q0.1 and Q0.2 from the output image to the motor, valve and alarm.",
    progress: 75,
  },

  service: {
    title: "4. Service and preserve required data",
    description:
      "The PLC completes diagnostics, communication and retention housekeeping before the next scan begins.",
    progress: 100,
  },
};

/* =========================================================
   INITIAL VALUES
========================================================= */

const INITIAL_MEMORY: MemoryState = {
  program: [
    0x10,
    0x21,
    0x31,
    0x42,
    0x50,
    0x61,
    0x70,
    0xff,
  ],

  input: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ],

  output: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ],

  marker: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ],

  data: [
    0,
    25,
    50,
    75,
    0,
    0,
    0,
    0,
  ],

  timer: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ],

  counter: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ],

  retentive: [
    0,
    120,
    0,
    0,
    0,
    0,
    0,
    0,
  ],
};

const EMPTY_INPUTS: PhysicalInputs = {
  start: false,
  stop: false,
  level: false,
};

const EMPTY_OUTPUTS: PhysicalOutputs = {
  motor: false,
  valve: false,
  alarm: false,
};

/* =========================================================
   HELPERS
========================================================= */

function cloneMemory(
  memory: MemoryState,
): MemoryState {
  return {
    program: [...memory.program],
    input: [...memory.input],
    output: [...memory.output],
    marker: [...memory.marker],
    data: [...memory.data],
    timer: [...memory.timer],
    counter: [...memory.counter],
    retentive: [...memory.retentive],
  };
}

function clampByte(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    255,
    Math.max(
      0,
      Math.round(value),
    ),
  );
}

function toBinary(
  value: number,
): string {
  return clampByte(value)
    .toString(2)
    .padStart(8, "0");
}

function toHex(
  value: number,
): string {
  return `0x${clampByte(value)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0")}`;
}

function wait(
  milliseconds: number,
): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds,
    );
  });
}

function memoryKey(
  area: MemoryArea,
  index: number,
): string {
  return `${area}:${index}`;
}

function addressLabel(
  area: MemoryArea,
  index: number,
): string {
  const prefix =
    AREA_DEFINITIONS[area].prefix;

  return `${prefix}${index}`;
}

function isOn(
  value: number,
): boolean {
  return value !== 0;
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

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

function StatusBadge({
  children,
  active = false,
  tone = "blue",
}: {
  children: ReactNode;
  active?: boolean;
  tone?:
    | "blue"
    | "green"
    | "amber"
    | "red";
}) {
  const tones = {
    blue:
      "border-blue-200 bg-blue-50 text-blue-700",

    green:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    amber:
      "border-amber-200 bg-amber-50 text-amber-700",

    red:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",

        active
          ? tones[tone]
          : "border-slate-200 bg-slate-50 text-slate-500",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function MetricCard({
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

      <p className="mt-1 text-xs text-slate-500">
        {helper}
      </p>
    </div>
  );
}

function Led({
  active,
  label,
  danger = false,
}: {
  active: boolean;
  label?: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <motion.span
        className={[
          "h-3.5 w-3.5 shrink-0 rounded-full border",

          active
            ? danger
              ? "border-red-500 bg-red-500"
              : "border-emerald-500 bg-emerald-500"
            : "border-slate-300 bg-slate-100",
        ].join(" ")}
        animate={
          active
            ? {
                scale: [
                  1,
                  1.18,
                  1,
                ],

                boxShadow: danger
                  ? [
                      "0 0 0 rgba(239,68,68,0)",
                      "0 0 10px rgba(239,68,68,.55)",
                      "0 0 0 rgba(239,68,68,0)",
                    ]
                  : [
                      "0 0 0 rgba(16,185,129,0)",
                      "0 0 10px rgba(16,185,129,.55)",
                      "0 0 0 rgba(16,185,129,0)",
                    ],
              }
            : {
                scale: 1,

                boxShadow:
                  "0 0 0 rgba(0,0,0,0)",
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
  address,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  address: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={checked}
      onClick={onChange}
      className={[
        "flex w-full items-center justify-between rounded-xl border p-3 text-left transition",

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

        <p className="mt-1 font-mono text-xs text-blue-700">
          {address}
        </p>
      </div>

      <span
        className={[
          "relative h-7 w-14 rounded-full transition-colors",

          checked
            ? "bg-blue-600"
            : "bg-slate-300",
        ].join(" ")}
      >
        <motion.span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
          animate={{
            left: checked
              ? 30
              : 4,
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

/* =========================================================
   ACCESSIBLE SVG MEMORY NODE
========================================================= */

function MemoryNode({
  area,
  active,
  selected,
  children,
  onSelect,
}: {
  area: MemoryArea;
  active: boolean;
  selected: boolean;
  children: ReactNode;
  onSelect: (
    area: MemoryArea,
  ) => void;
}) {
  const handleKeyDown = (
    event: KeyboardEvent<SVGGElement>,
  ) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onSelect(area);
    }
  };

  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${AREA_DEFINITIONS[area].title}`}
      className="cursor-pointer outline-none"
      onClick={() =>
        onSelect(area)
      }
      onKeyDown={handleKeyDown}
      animate={
        active
          ? {
              filter: [
                "drop-shadow(0 0 0 rgba(37,99,235,0))",
                "drop-shadow(0 0 12px rgba(37,99,235,.32))",
                "drop-shadow(0 0 0 rgba(37,99,235,0))",
              ],
            }
          : {
              filter:
                "drop-shadow(0 0 0 rgba(0,0,0,0))",
            }
      }
      transition={{
        duration: 1.1,

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
   PLC MEMORY CANVAS
========================================================= */

function PlcMemoryCanvas({
  mode,
  stage,
  memory,
  physicalInputs,
  physicalOutputs,
  selectedArea,
  onSelectArea,
}: {
  mode: PlcMode;
  stage: ScanStage;
  memory: MemoryState;
  physicalInputs: PhysicalInputs;
  physicalOutputs: PhysicalOutputs;
  selectedArea: MemoryArea;
  onSelectArea: (
    area: MemoryArea,
  ) => void;
}) {
  const powered =
    mode !== "off";

  const nodeClass = (
    area: MemoryArea,
    active: boolean,
  ) =>
    [
      "fill-white stroke-[3] transition-colors",

      selectedArea === area
        ? "stroke-blue-600"
        : active
          ? "stroke-blue-400"
          : "stroke-slate-300",
    ].join(" ");

  const pathClass = (
    active: boolean,
  ) =>
    [
      "fill-none stroke-[4]",

      active
        ? "stroke-blue-600"
        : "stroke-slate-300",
    ].join(" ");

  const programActive =
    stage === "execute";

  const inputActive =
    stage === "read";

  const outputActive =
    stage === "write";

  const workingActive =
    stage === "execute";

  const retentiveActive =
    stage === "execute" ||
    stage === "service";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            PLC memory architecture canvas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a memory block or run a
            scan to follow the data path.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge
            active={powered}
            tone="green"
          >
            {powered
              ? "POWER ON"
              : "POWER OFF"}
          </StatusBadge>

          <StatusBadge
            active={mode === "run"}
            tone="blue"
          >
            {mode === "run"
              ? "RUN"
              : "STOP"}
          </StatusBadge>

          <StatusBadge
            active={
              stage !== "idle"
            }
            tone="amber"
          >
            {stage === "idle"
              ? "IDLE"
              : stage.toUpperCase()}
          </StatusBadge>
        </div>
      </div>

      <div className="relative aspect-[4/3] min-h-[500px] w-full bg-slate-50 sm:aspect-[16/10]">
        <svg
          viewBox="0 0 1180 780"
          className="h-full w-full"
          role="img"
          aria-label="Interactive PLC memory architecture with program memory, process images, working memory and retentive storage"
        >
          <defs>
            <pattern
              id="memoryGrid"
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
              id="activeArrow"
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
              id="idleArrow"
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
          </defs>

          <rect
            width="1180"
            height="780"
            fill="url(#memoryGrid)"
          />

          <rect
            x="28"
            y="28"
            width="1124"
            height="700"
            rx="28"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
          />

          <text
            x="58"
            y="67"
            fill="#0f172a"
            fontSize="21"
            fontWeight="700"
          >
            PLC MEMORY SYSTEM
          </text>

          <text
            x="58"
            y="93"
            fill="#64748b"
            fontSize="13"
          >
            Simplified byte-oriented learning model
          </text>

          {/* CPU memory interface */}

          <rect
            x="440"
            y="255"
            width="300"
            height="230"
            rx="24"
            fill="#eff6ff"
            stroke="#2563eb"
            strokeWidth="4"
          />

          <text
            x="590"
            y="298"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="22"
            fontWeight="800"
          >
            CPU MEMORY INTERFACE
          </text>

          <rect
            x="485"
            y="325"
            width="210"
            height="75"
            rx="12"
            fill="#0f172a"
          />

          <text
            x="590"
            y="355"
            textAnchor="middle"
            fill="#86efac"
            fontSize="17"
            fontWeight="800"
          >
            {powered
              ? stage === "idle"
                ? "READY"
                : stage.toUpperCase()
              : "OFF"}
          </text>

          <text
            x="590"
            y="380"
            textAnchor="middle"
            fill="#cbd5e1"
            fontSize="11"
          >
            Address bus · data bus · control bus
          </text>

          <text
            x="590"
            y="438"
            textAnchor="middle"
            fill="#475569"
            fontSize="13"
          >
            Reads instructions and data, then
            writes results
          </text>

          {/* Program bus */}

          <path
            d="M300 180 H390 V315 H440"
            className={pathClass(
              programActive,
            )}
            strokeDasharray={
              programActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              programActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Input image bus */}

          <path
            d="M300 390 H440"
            className={pathClass(
              inputActive,
            )}
            strokeDasharray={
              inputActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              inputActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Output image bus */}

          <path
            d="M440 440 H390 V590 H300"
            className={pathClass(
              outputActive,
            )}
            strokeDasharray={
              outputActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              outputActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Marker bus */}

          <path
            d="M740 310 H815 V155 H860"
            className={pathClass(
              workingActive,
            )}
            strokeDasharray={
              workingActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              workingActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Data bus */}

          <path
            d="M740 345 H860"
            className={pathClass(
              workingActive,
            )}
            strokeDasharray={
              workingActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              workingActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Timer and counter bus */}

          <path
            d="M740 380 H815 V445 H860"
            className={pathClass(
              workingActive,
            )}
            strokeDasharray={
              workingActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              workingActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Retentive bus */}

          <path
            d="M740 415 H825 V570 H860"
            className={pathClass(
              retentiveActive,
            )}
            strokeDasharray={
              retentiveActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              retentiveActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Program memory */}

          <MemoryNode
            area="program"
            active={programActive}
            selected={
              selectedArea === "program"
            }
            onSelect={onSelectArea}
          >
            <rect
              x="70"
              y="120"
              width="230"
              height="140"
              rx="20"
              className={nodeClass(
                "program",
                programActive,
              )}
            />

            <text
              x="185"
              y="154"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="15"
              fontWeight="700"
            >
              PROGRAM MEMORY
            </text>

            <rect
              x="102"
              y="175"
              width="166"
              height="48"
              rx="9"
              fill="#eff6ff"
              stroke="#93c5fd"
              strokeWidth="2"
            />

            <text
              x="185"
              y="198"
              textAnchor="middle"
              fill="#1d4ed8"
              fontSize="12"
              fontWeight="700"
            >
              P0 = {toHex(memory.program[0])}
            </text>

            <text
              x="185"
              y="216"
              textAnchor="middle"
              fill="#475569"
              fontSize="10"
            >
              USER PROGRAM
            </text>

            <text
              x="185"
              y="246"
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              Non-volatile · read-only
            </text>
          </MemoryNode>

          {/* Input process image */}

          <MemoryNode
            area="input"
            active={inputActive}
            selected={
              selectedArea === "input"
            }
            onSelect={onSelectArea}
          >
            <rect
              x="70"
              y="315"
              width="230"
              height="145"
              rx="20"
              className={nodeClass(
                "input",
                inputActive,
              )}
            />

            <text
              x="185"
              y="349"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="15"
              fontWeight="700"
            >
              INPUT PROCESS IMAGE
            </text>

            <text
              x="185"
              y="386"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="19"
              fontWeight="800"
            >
              I0 ={" "}
              {memory.input
                .slice(0, 8)
                .map((value) =>
                  isOn(value)
                    ? "1"
                    : "0",
                )
                .join("")}
            </text>

            <g>
              {[0, 1, 2].map(
                (index) => (
                  <circle
                    key={index}
                    cx={
                      145 +
                      index * 40
                    }
                    cy="418"
                    r="8"
                    fill={
                      isOn(
                        memory.input[
                          index
                        ],
                      )
                        ? "#10b981"
                        : "#e2e8f0"
                    }
                    stroke={
                      isOn(
                        memory.input[
                          index
                        ],
                      )
                        ? "#059669"
                        : "#94a3b8"
                    }
                    strokeWidth="2"
                  />
                ),
              )}
            </g>

            <text
              x="185"
              y="446"
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              Snapshot at scan start
            </text>
          </MemoryNode>

          {/* Output process image */}

          <MemoryNode
            area="output"
            active={outputActive}
            selected={
              selectedArea === "output"
            }
            onSelect={onSelectArea}
          >
            <rect
              x="70"
              y="525"
              width="230"
              height="130"
              rx="20"
              className={nodeClass(
                "output",
                outputActive,
              )}
            />

            <text
              x="185"
              y="558"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="15"
              fontWeight="700"
            >
              OUTPUT PROCESS IMAGE
            </text>

            <text
              x="185"
              y="597"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="19"
              fontWeight="800"
            >
              Q0 ={" "}
              {memory.output
                .slice(0, 8)
                .map((value) =>
                  isOn(value)
                    ? "1"
                    : "0",
                )
                .join("")}
            </text>

            <text
              x="185"
              y="632"
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              Commands waiting for output update
            </text>
          </MemoryNode>

          {/* Marker memory */}

          <MemoryNode
            area="marker"
            active={workingActive}
            selected={
              selectedArea === "marker"
            }
            onSelect={onSelectArea}
          >
            <rect
              x="860"
              y="105"
              width="240"
              height="105"
              rx="20"
              className={nodeClass(
                "marker",
                workingActive,
              )}
            />

            <text
              x="980"
              y="138"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              MARKER / INTERNAL MEMORY
            </text>

            <text
              x="980"
              y="178"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="20"
              fontWeight="800"
            >
              M0 = {memory.marker[0]}
            </text>
          </MemoryNode>

          {/* Data registers */}

          <MemoryNode
            area="data"
            active={workingActive}
            selected={
              selectedArea === "data"
            }
            onSelect={onSelectArea}
          >
            <rect
              x="860"
              y="245"
              width="240"
              height="105"
              rx="20"
              className={nodeClass(
                "data",
                workingActive,
              )}
            />

            <text
              x="980"
              y="278"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              DATA REGISTERS
            </text>

            <text
              x="980"
              y="318"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="20"
              fontWeight="800"
            >
              D0 = {memory.data[0]}
            </text>
          </MemoryNode>

          {/* Timer memory */}

          <MemoryNode
            area="timer"
            active={workingActive}
            selected={
              selectedArea === "timer"
            }
            onSelect={onSelectArea}
          >
            <rect
              x="860"
              y="385"
              width="112"
              height="120"
              rx="20"
              className={nodeClass(
                "timer",
                workingActive,
              )}
            />

            <text
              x="916"
              y="418"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="13"
              fontWeight="700"
            >
              TIMER
            </text>

            <text
              x="916"
              y="456"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="20"
              fontWeight="800"
            >
              T0
            </text>

            <text
              x="916"
              y="485"
              textAnchor="middle"
              fill="#475569"
              fontSize="12"
            >
              {memory.timer[0]}
            </text>
          </MemoryNode>

          {/* Counter memory */}

          <MemoryNode
            area="counter"
            active={workingActive}
            selected={
              selectedArea === "counter"
            }
            onSelect={onSelectArea}
          >
            <rect
              x="988"
              y="385"
              width="112"
              height="120"
              rx="20"
              className={nodeClass(
                "counter",
                workingActive,
              )}
            />

            <text
              x="1044"
              y="418"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="13"
              fontWeight="700"
            >
              COUNTER
            </text>

            <text
              x="1044"
              y="456"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="20"
              fontWeight="800"
            >
              C0
            </text>

            <text
              x="1044"
              y="485"
              textAnchor="middle"
              fill="#475569"
              fontSize="12"
            >
              {memory.counter[0]}
            </text>
          </MemoryNode>

          {/* Retentive memory */}

          <MemoryNode
            area="retentive"
            active={retentiveActive}
            selected={
              selectedArea ===
              "retentive"
            }
            onSelect={onSelectArea}
          >
            <rect
              x="860"
              y="545"
              width="240"
              height="110"
              rx="20"
              className={nodeClass(
                "retentive",
                retentiveActive,
              )}
            />

            <text
              x="980"
              y="578"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              RETENTIVE MEMORY
            </text>

            <text
              x="980"
              y="616"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="20"
              fontWeight="800"
            >
              R0 = {memory.retentive[0]}
            </text>

            <text
              x="980"
              y="640"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              Survives simulated power loss
            </text>
          </MemoryNode>

          {/* Physical input terminals */}

          <rect
            x="360"
            y="565"
            width="170"
            height="120"
            rx="18"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
          />

          <text
            x="445"
            y="596"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="13"
            fontWeight="700"
          >
            PHYSICAL INPUTS
          </text>

          {[
            {
              label: "START",
              active:
                physicalInputs.start,
            },
            {
              label: "STOP",
              active:
                physicalInputs.stop,
            },
            {
              label: "LEVEL",
              active:
                physicalInputs.level,
            },
          ].map((item, index) => (
            <g key={item.label}>
              <circle
                cx="390"
                cy={
                  622 +
                  index * 22
                }
                r="6"
                fill={
                  item.active
                    ? "#10b981"
                    : "#e2e8f0"
                }
                stroke={
                  item.active
                    ? "#059669"
                    : "#94a3b8"
                }
                strokeWidth="2"
              />

              <text
                x="407"
                y={
                  626 +
                  index * 22
                }
                fill="#475569"
                fontSize="10"
              >
                {item.label}
              </text>
            </g>
          ))}

          {/* Physical output terminals */}

          <rect
            x="650"
            y="565"
            width="170"
            height="120"
            rx="18"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
          />

          <text
            x="735"
            y="596"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="13"
            fontWeight="700"
          >
            PHYSICAL OUTPUTS
          </text>

          {[
            {
              label: "MOTOR",
              active:
                physicalOutputs.motor,
              danger: false,
            },
            {
              label: "VALVE",
              active:
                physicalOutputs.valve,
              danger: false,
            },
            {
              label: "ALARM",
              active:
                physicalOutputs.alarm,
              danger: true,
            },
          ].map((item, index) => (
            <g key={item.label}>
              <circle
                cx="680"
                cy={
                  622 +
                  index * 22
                }
                r="6"
                fill={
                  item.active
                    ? item.danger
                      ? "#ef4444"
                      : "#10b981"
                    : "#e2e8f0"
                }
                stroke={
                  item.active
                    ? item.danger
                      ? "#dc2626"
                      : "#059669"
                    : "#94a3b8"
                }
                strokeWidth="2"
              />

              <text
                x="697"
                y={
                  626 +
                  index * 22
                }
                fill="#475569"
                fontSize="10"
              >
                {item.label}
              </text>
            </g>
          ))}

          {/* Input terminal to input image */}

          <path
            d="M445 565 V520 H185 V460"
            className={pathClass(
              inputActive,
            )}
            strokeDasharray={
              inputActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              inputActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Output image to terminals */}

          <path
            d="M300 590 H650"
            className={pathClass(
              outputActive,
            )}
            strokeDasharray={
              outputActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              outputActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Animated signal packets */}

          <AnimatePresence>
            {stage === "read" ? (
              <motion.circle
                key="read-packet"
                r="7"
                fill="#2563eb"
                initial={{
                  cx: 445,
                  cy: 565,
                  opacity: 0,
                }}
                animate={{
                  cx: [
                    445,
                    445,
                    185,
                    185,
                  ],

                  cy: [
                    565,
                    520,
                    520,
                    460,
                  ],

                  opacity: [
                    0,
                    1,
                    1,
                    0,
                  ],
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 1.15,

                  repeat:
                    Number.POSITIVE_INFINITY,

                  ease: "linear",
                }}
              />
            ) : null}

            {stage === "execute" ? (
              <>
                <motion.circle
                  key="program-packet"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 300,
                    cy: 180,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [
                      300,
                      390,
                      390,
                      440,
                    ],

                    cy: [
                      180,
                      180,
                      315,
                      315,
                    ],

                    opacity: [
                      0,
                      1,
                      1,
                      0,
                    ],
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.05,

                    repeat:
                      Number.POSITIVE_INFINITY,

                    ease: "linear",
                  }}
                />

                <motion.circle
                  key="working-packet"
                  r="7"
                  fill="#7c3aed"
                  initial={{
                    cx: 740,
                    cy: 345,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [
                      740,
                      860,
                    ],

                    cy: [
                      345,
                      345,
                    ],

                    opacity: [
                      0,
                      1,
                      0,
                    ],
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.8,

                    repeat:
                      Number.POSITIVE_INFINITY,

                    ease: "linear",
                  }}
                />
              </>
            ) : null}

            {stage === "write" ? (
              <motion.circle
                key="write-packet"
                r="7"
                fill="#2563eb"
                initial={{
                  cx: 300,
                  cy: 590,
                  opacity: 0,
                }}
                animate={{
                  cx: [
                    300,
                    650,
                  ],

                  cy: [
                    590,
                    590,
                  ],

                  opacity: [
                    0,
                    1,
                    0,
                  ],
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 1,

                  repeat:
                    Number.POSITIVE_INFINITY,

                  ease: "linear",
                }}
              />
            ) : null}

            {stage === "service" ? (
              <motion.circle
                key="retentive-packet"
                r="7"
                fill="#10b981"
                initial={{
                  cx: 740,
                  cy: 415,
                  opacity: 0,
                }}
                animate={{
                  cx: [
                    740,
                    825,
                    825,
                    860,
                  ],

                  cy: [
                    415,
                    415,
                    570,
                    570,
                  ],

                  opacity: [
                    0,
                    1,
                    1,
                    0,
                  ],
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 1,

                  repeat:
                    Number.POSITIVE_INFINITY,

                  ease: "linear",
                }}
              />
            ) : null}
          </AnimatePresence>
        </svg>

        {!powered ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-4 backdrop-blur-[1px]">
            <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-mono text-sm font-bold text-blue-700">
                MEM
              </div>

              <p className="mt-3 font-semibold text-slate-900">
                PLC memory power is OFF
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Power the PLC from the left
                control panel. Retentive and
                program memory remain stored
                while volatile memory clears.
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

export default function PlcMemoryPage() {
  const [
    mode,
    setMode,
  ] = useState<PlcMode>("off");

  const [
    stage,
    setStage,
  ] = useState<ScanStage>("idle");

  const [
    busy,
    setBusy,
  ] = useState(false);

  const [
    scanCount,
    setScanCount,
  ] = useState(0);

  const [
    cycleDuration,
    setCycleDuration,
  ] = useState(2200);

  const [
    memory,
    setMemory,
  ] = useState<MemoryState>(
    () =>
      cloneMemory(
        INITIAL_MEMORY,
      ),
  );

  const [
    physicalInputs,
    setPhysicalInputs,
  ] =
    useState<PhysicalInputs>(
      EMPTY_INPUTS,
    );

  const [
    physicalOutputs,
    setPhysicalOutputs,
  ] =
    useState<PhysicalOutputs>(
      EMPTY_OUTPUTS,
    );

  const [
    selectedArea,
    setSelectedArea,
  ] =
    useState<MemoryArea>(
      "program",
    );

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState(0);

  const [
    writeValue,
    setWriteValue,
  ] = useState(0);

  const [
    retainedKeys,
    setRetainedKeys,
  ] = useState<string[]>([]);

  /* =======================================================
     REFS FOR ASYNCHRONOUS SCAN LOOP
  ======================================================= */

  const modeRef =
    useRef<PlcMode>(mode);

  const memoryRef =
    useRef<MemoryState>(
      memory,
    );

  const physicalInputsRef =
    useRef<PhysicalInputs>(
      physicalInputs,
    );

  const cycleDurationRef =
    useRef(cycleDuration);

  const retainedKeysRef =
    useRef<string[]>(
      retainedKeys,
    );

  const busyRef =
    useRef(false);

  const previousLevelRef =
    useRef(false);

  const abortVersionRef =
    useRef(0);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    memoryRef.current = memory;
  }, [memory]);

  useEffect(() => {
    physicalInputsRef.current =
      physicalInputs;
  }, [physicalInputs]);

  useEffect(() => {
    cycleDurationRef.current =
      cycleDuration;
  }, [cycleDuration]);

  useEffect(() => {
    retainedKeysRef.current =
      retainedKeys;
  }, [retainedKeys]);

  const selectedDefinition =
    AREA_DEFINITIONS[
      selectedArea
    ];

  const selectedValue =
    memory[selectedArea][
      selectedIndex
    ] ?? 0;

  const selectedKey =
    memoryKey(
      selectedArea,
      selectedIndex,
    );

  const selectedIsRetained =
    selectedArea ===
      "retentive" ||
    selectedArea ===
      "program" ||
    retainedKeys.includes(
      selectedKey,
    );

  const selectedCanWrite =
    selectedDefinition.writable &&
    mode !== "run" &&
    !busy &&
    mode !== "off";

  const stageInfo =
    STAGE_DEFINITIONS[
      stage
    ];

  /* =======================================================
     MEMORY UPDATE
  ======================================================= */

  const updateMemory =
    useCallback(
      (
        next: MemoryState,
      ) => {
        memoryRef.current =
          next;

        setMemory(next);
      },
      [],
    );

  /* =======================================================
     PHYSICAL INPUT UPDATE
  ======================================================= */

  const updatePhysicalInput =
    useCallback(
      (
        key: keyof PhysicalInputs,
        value: boolean,
      ) => {
        setPhysicalInputs(
          (current) => {
            const next = {
              ...current,
              [key]: value,
            };

            physicalInputsRef.current =
              next;

            return next;
          },
        );
      },
      [],
    );

  /* =======================================================
     ONE COMPLETE PLC SCAN
  ======================================================= */

  const performScan =
    useCallback(
      async (): Promise<boolean> => {
        if (
          modeRef.current ===
            "off" ||
          busyRef.current
        ) {
          return false;
        }

        busyRef.current = true;
        setBusy(true);

        const token =
          abortVersionRef.current;

        const phaseDuration =
          Math.max(
            180,

            Math.round(
              cycleDurationRef.current /
                4,
            ),
          );

        const isValid = () =>
          token ===
            abortVersionRef.current &&
          modeRef.current !== "off";

        try {
          /*
           * 1. READ PHYSICAL INPUTS
           */

          setStage("read");

          const inputSnapshot =
            physicalInputsRef.current;

          const afterRead =
            cloneMemory(
              memoryRef.current,
            );

          afterRead.input[0] =
            inputSnapshot.start
              ? 1
              : 0;

          afterRead.input[1] =
            inputSnapshot.stop
              ? 1
              : 0;

          afterRead.input[2] =
            inputSnapshot.level
              ? 1
              : 0;

          updateMemory(
            afterRead,
          );

          await wait(
            phaseDuration,
          );

          if (!isValid()) {
            return false;
          }

          /*
           * 2. FETCH PROGRAM AND EXECUTE
           */

          setStage("execute");

          const current =
            cloneMemory(
              memoryRef.current,
            );

          const start =
            isOn(
              current.input[0],
            );

          const stop =
            isOn(
              current.input[1],
            );

          const level =
            isOn(
              current.input[2],
            );

          const previousMotorLatch =
            isOn(
              current.marker[0],
            );

          /*
           * M0 motor seal-in logic:
           *
           * M0 =
           * (I0.0 OR previous M0)
           * AND NOT I0.1
           */

          const nextMotorLatch =
            (
              start ||
              previousMotorLatch
            ) &&
            !stop;

          /*
           * Counter C0 increments only on
           * the rising edge of I0.2.
           */

          const levelRisingEdge =
            level &&
            !previousLevelRef.current;

          current.marker[0] =
            nextMotorLatch
              ? 1
              : 0;

          current.data[0] =
            (
              current.data[0] +
              1
            ) &
            0xff;

          current.timer[0] =
            level
              ? Math.min(
                  255,
                  current.timer[0] +
                    10,
                )
              : 0;

          current.counter[0] =
            levelRisingEdge
              ? Math.min(
                  255,
                  current.counter[0] +
                    1,
                )
              : current.counter[0];

          current.retentive[0] =
            current.counter[0];

          /*
           * Update output process image.
           */

          current.output[0] =
            nextMotorLatch
              ? 1
              : 0;

          current.output[1] =
            level
              ? 1
              : 0;

          current.output[2] =
            stop
              ? 1
              : 0;

          previousLevelRef.current =
            level;

          updateMemory(current);

          await wait(
            phaseDuration,
          );

          if (!isValid()) {
            return false;
          }

          /*
           * 3. TRANSFER OUTPUT IMAGE
           */

          setStage("write");

          const outputImage =
            memoryRef.current
              .output;

          setPhysicalOutputs({
            motor: isOn(
              outputImage[0],
            ),

            valve: isOn(
              outputImage[1],
            ),

            alarm: isOn(
              outputImage[2],
            ),
          });

          await wait(
            phaseDuration,
          );

          if (!isValid()) {
            return false;
          }

          /*
           * 4. SERVICE AND RETENTION
           */

          setStage("service");

          setScanCount(
            (currentCount) =>
              currentCount + 1,
          );

          await wait(
            phaseDuration,
          );

          if (!isValid()) {
            return false;
          }

          setStage("idle");

          return true;
        } finally {
          if (
            token ===
            abortVersionRef.current
          ) {
            busyRef.current =
              false;

            setBusy(false);
          }
        }
      },
      [updateMemory],
    );

  /* =======================================================
     CONTINUOUS RUN MODE
  ======================================================= */

  useEffect(() => {
    if (mode !== "run") {
      return;
    }

    let cancelled = false;

    const loop = async () => {
      while (
        !cancelled &&
        modeRef.current ===
          "run"
      ) {
        await performScan();

        if (
          !cancelled &&
          modeRef.current ===
            "run"
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
     POWER CONTROL
  ======================================================= */

  const powerToggle =
    useCallback(() => {
      /*
       * Powering OFF clears volatile memory
       * unless the selected address was marked
       * as retained.
       */

      if (
        modeRef.current !==
        "off"
      ) {
        abortVersionRef.current +=
          1;

        modeRef.current =
          "off";

        busyRef.current =
          false;

        setMode("off");
        setBusy(false);
        setStage("idle");

        setPhysicalOutputs(
          EMPTY_OUTPUTS,
        );

        previousLevelRef.current =
          false;

        const retainedSet =
          new Set(
            retainedKeysRef.current,
          );

        const current =
          cloneMemory(
            memoryRef.current,
          );

        AREA_ORDER.forEach(
          (area) => {
            if (
              area === "program" ||
              area === "retentive"
            ) {
              return;
            }

            current[area] =
              current[area].map(
                (
                  value,
                  index,
                ) => {
                  if (
                    !AREA_DEFINITIONS[
                      area
                    ].volatile
                  ) {
                    return value;
                  }

                  return retainedSet.has(
                    memoryKey(
                      area,
                      index,
                    ),
                  )
                    ? value
                    : 0;
                },
              );
          },
        );

        updateMemory(current);

        return;
      }

      modeRef.current =
        "stop";

      setMode("stop");
      setStage("idle");
    }, [updateMemory]);

  /* =======================================================
     RUN / STOP CONTROL
  ======================================================= */

  const runToggle =
    useCallback(() => {
      if (
        modeRef.current ===
        "off"
      ) {
        return;
      }

      if (
        modeRef.current ===
        "run"
      ) {
        abortVersionRef.current +=
          1;

        modeRef.current =
          "stop";

        busyRef.current =
          false;

        setMode("stop");
        setBusy(false);
        setStage("idle");

        return;
      }

      modeRef.current =
        "run";

      setMode("run");
    }, []);

  /* =======================================================
     RESET SIMULATION
  ======================================================= */

  const resetSimulation =
    useCallback(() => {
      abortVersionRef.current +=
        1;

      modeRef.current =
        "off";

      memoryRef.current =
        cloneMemory(
          INITIAL_MEMORY,
        );

      physicalInputsRef.current =
        EMPTY_INPUTS;

      cycleDurationRef.current =
        2200;

      retainedKeysRef.current =
        [];

      busyRef.current =
        false;

      previousLevelRef.current =
        false;

      setMode("off");
      setStage("idle");
      setBusy(false);
      setScanCount(0);
      setCycleDuration(2200);

      setMemory(
        cloneMemory(
          INITIAL_MEMORY,
        ),
      );

      setPhysicalInputs(
        EMPTY_INPUTS,
      );

      setPhysicalOutputs(
        EMPTY_OUTPUTS,
      );

      setSelectedArea(
        "program",
      );

      setSelectedIndex(0);
      setWriteValue(0);
      setRetainedKeys([]);
    }, []);

  /* =======================================================
     MEMORY INSPECTOR
  ======================================================= */

  const selectArea = (
    area: MemoryArea,
  ) => {
    setSelectedArea(area);
    setSelectedIndex(0);

    setWriteValue(
      memory[area][0] ?? 0,
    );
  };

  const selectAddress = (
    index: number,
  ) => {
    setSelectedIndex(index);

    setWriteValue(
      memory[selectedArea][
        index
      ] ?? 0,
    );
  };

  const writeSelectedCell =
    () => {
      if (!selectedCanWrite) {
        return;
      }

      const next =
        cloneMemory(
          memoryRef.current,
        );

      next[selectedArea][
        selectedIndex
      ] = clampByte(
        writeValue,
      );

      updateMemory(next);
    };

  const toggleSelectedRetention =
    () => {
      if (
        !selectedDefinition.retainSelectable
      ) {
        return;
      }

      setRetainedKeys(
        (current) => {
          const exists =
            current.includes(
              selectedKey,
            );

          const next =
            exists
              ? current.filter(
                  (key) =>
                    key !==
                    selectedKey,
                )
              : [
                  ...current,
                  selectedKey,
                ];

          retainedKeysRef.current =
            next;

          return next;
        },
      );
    };

  const memoryRows =
    useMemo(
      () =>
        memory[
          selectedArea
        ].map(
          (
            value,
            index,
          ) => ({
            index,

            address:
              addressLabel(
                selectedArea,
                index,
              ),

            value,

            retained:
              selectedArea ===
                "program" ||
              selectedArea ===
                "retentive" ||
              retainedKeys.includes(
                memoryKey(
                  selectedArea,
                  index,
                ),
              ),
          }),
        ),
      [
        memory,
        retainedKeys,
        selectedArea,
      ],
    );

  const powered =
    mode !== "off";

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-slate-50 px-3 py-4 text-slate-900 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}

          <header className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    active={powered}
                    tone="green"
                  >
                    {powered
                      ? "POWER ON"
                      : "POWER OFF"}
                  </StatusBadge>

                  <StatusBadge
                    active={
                      mode === "run"
                    }
                    tone="blue"
                  >
                    {mode === "run"
                      ? "PLC RUNNING"
                      : "PLC STOPPED"}
                  </StatusBadge>

                  <StatusBadge
                    active={busy}
                    tone="amber"
                  >
                    {busy
                      ? stage.toUpperCase()
                      : "READY"}
                  </StatusBadge>
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  PLC Memory Interactive
                  Simulator
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                  Explore program memory,
                  input and output process
                  images, marker bits, data
                  registers, timers, counters
                  and retentive storage during
                  a PLC scan.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <MetricCard
                  label="PLC mode"
                  value={
                    mode.toUpperCase()
                  }
                  helper="Current operating state"
                />

                <MetricCard
                  label="Scans"
                  value={scanCount}
                  helper="Completed scan cycles"
                />

                <MetricCard
                  label="Selected"
                  value={addressLabel(
                    selectedArea,
                    selectedIndex,
                  )}
                  helper={
                    selectedDefinition.shortTitle
                  }
                />

                <MetricCard
                  label="Value"
                  value={selectedValue}
                  helper={`${toHex(
                    selectedValue,
                  )} · ${toBinary(
                    selectedValue,
                  )}`}
                />
              </div>
            </div>
          </header>

          {/* Main responsive layout */}

          <div className="grid gap-5 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)]">
            {/* Left control panel */}

            <aside className="space-y-4 md:sticky md:top-4 md:self-start">
              <Card
                title="PLC controls"
                description="Power and run the memory scan sequence."
              >
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    type="button"
                    onClick={
                      powerToggle
                    }
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      powered
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-blue-600 bg-blue-600 text-white",
                    ].join(" ")}
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    {powered
                      ? "Power OFF"
                      : "Power ON"}
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={!powered}
                    onClick={runToggle}
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      !powered
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : mode ===
                            "run"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-emerald-600 bg-emerald-600 text-white",
                    ].join(" ")}
                    whileHover={
                      powered
                        ? { y: -2 }
                        : undefined
                    }
                    whileTap={
                      powered
                        ? {
                            scale: 0.98,
                          }
                        : undefined
                    }
                  >
                    {mode === "run"
                      ? "Stop PLC"
                      : "Run PLC"}
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={
                      !powered ||
                      mode === "run" ||
                      busy
                    }
                    onClick={() =>
                      void performScan()
                    }
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      !powered ||
                      mode === "run" ||
                      busy
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : "border-violet-200 bg-violet-50 text-violet-700",
                    ].join(" ")}
                    whileHover={
                      powered &&
                      mode !== "run" &&
                      !busy
                        ? { y: -2 }
                        : undefined
                    }
                    whileTap={
                      powered &&
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
                    onClick={
                      resetSimulation
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700"
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    Reset
                  </motion.button>
                </div>
              </Card>

              <Card
                title="Physical input terminals"
                description="Change the field states captured during the next scan."
              >
                <div className="space-y-3">
                  <Toggle
                    checked={
                      physicalInputs.start
                    }
                    disabled={!powered}
                    label="START sensor"
                    address="I0.0"
                    onChange={() =>
                      updatePhysicalInput(
                        "start",
                        !physicalInputs.start,
                      )
                    }
                  />

                  <Toggle
                    checked={
                      physicalInputs.stop
                    }
                    disabled={!powered}
                    label="STOP sensor"
                    address="I0.1"
                    onChange={() =>
                      updatePhysicalInput(
                        "stop",
                        !physicalInputs.stop,
                      )
                    }
                  />

                  <Toggle
                    checked={
                      physicalInputs.level
                    }
                    disabled={!powered}
                    label="LEVEL sensor"
                    address="I0.2"
                    onChange={() =>
                      updatePhysicalInput(
                        "level",
                        !physicalInputs.level,
                      )
                    }
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  A physical change does not
                  update the input image until
                  the next read-input stage.
                </p>
              </Card>

              <Card
                title="Memory inspector"
                description="Select an area, address and value."
              >
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="memory-area"
                      className="text-sm font-semibold text-slate-800"
                    >
                      Memory area
                    </label>

                    <select
                      id="memory-area"
                      value={selectedArea}
                      disabled={
                        mode === "run" ||
                        busy
                      }
                      onChange={(
                        event,
                      ) =>
                        selectArea(
                          event.target
                            .value as MemoryArea,
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      {AREA_ORDER.map(
                        (area) => (
                          <option
                            key={area}
                            value={area}
                          >
                            {
                              AREA_DEFINITIONS[
                                area
                              ].title
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="memory-address"
                      className="text-sm font-semibold text-slate-800"
                    >
                      Address
                    </label>

                    <select
                      id="memory-address"
                      value={selectedIndex}
                      disabled={
                        mode === "run" ||
                        busy
                      }
                      onChange={(
                        event,
                      ) =>
                        selectAddress(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      {memory[
                        selectedArea
                      ].map(
                        (
                          _,
                          index,
                        ) => (
                          <option
                            key={index}
                            value={index}
                          >
                            {addressLabel(
                              selectedArea,
                              index,
                            )}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="write-value"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Write value
                      </label>

                      <span className="font-mono text-xs font-semibold text-blue-700">
                        {toHex(
                          writeValue,
                        )}
                      </span>
                    </div>

                    <input
                      id="write-value"
                      type="range"
                      min={0}
                      max={255}
                      step={1}
                      value={writeValue}
                      disabled={
                        !selectedCanWrite
                      }
                      onChange={(
                        event,
                      ) =>
                        setWriteValue(
                          clampByte(
                            Number(
                              event
                                .target
                                .value,
                            ),
                          ),
                        )
                      }
                      className="mt-3 w-full accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <input
                      type="number"
                      min={0}
                      max={255}
                      step={1}
                      value={writeValue}
                      disabled={
                        !selectedCanWrite
                      }
                      onChange={(
                        event,
                      ) =>
                        setWriteValue(
                          clampByte(
                            Number(
                              event
                                .target
                                .value,
                            ),
                          ),
                        )
                      }
                      className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    <div className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-center font-mono text-xs tracking-wider text-blue-200">
                      {toBinary(
                        writeValue,
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={
                      !selectedCanWrite
                    }
                    onClick={
                      writeSelectedCell
                    }
                    className={[
                      "w-full rounded-xl border px-3 py-2.5 text-sm font-semibold",

                      selectedCanWrite
                        ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400",
                    ].join(" ")}
                  >
                    Write to{" "}
                    {addressLabel(
                      selectedArea,
                      selectedIndex,
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={
                      !selectedDefinition.retainSelectable ||
                      mode === "run" ||
                      busy
                    }
                    onClick={
                      toggleSelectedRetention
                    }
                    className={[
                      "flex w-full items-center justify-between rounded-xl border p-3 text-left",

                      !selectedDefinition.retainSelectable ||
                      mode === "run" ||
                      busy
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
                        : selectedIsRetained
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white",
                    ].join(" ")}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Retain after power loss
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {selectedDefinition.retainSelectable
                          ? "Applies to this selected cell"
                          : selectedArea ===
                                "retentive" ||
                              selectedArea ===
                                "program"
                            ? "This area is already non-volatile"
                            : "Retention is not available for this area"}
                      </p>
                    </div>

                    <Led
                      active={
                        selectedIsRetained
                      }
                    />
                  </button>
                </div>
              </Card>

              <Card
                title="Teaching speed"
                description="Slow the scan cycle to observe each transfer."
              >
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="cycle-speed"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full scan
                  </label>

                  <span className="font-mono text-sm font-semibold text-blue-700">
                    {cycleDuration} ms
                  </span>
                </div>

                <input
                  id="cycle-speed"
                  type="range"
                  min={1200}
                  max={5000}
                  step={100}
                  value={
                    cycleDuration
                  }
                  onChange={(
                    event,
                  ) => {
                    const value =
                      Number(
                        event.target
                          .value,
                      );

                    cycleDurationRef.current =
                      value;

                    setCycleDuration(
                      value,
                    );
                  }}
                  className="mt-4 w-full accent-blue-600"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Faster</span>
                  <span>Slower</span>
                </div>
              </Card>
            </aside>

            {/* Right learning area */}

            <section className="min-w-0 space-y-5">
              <PlcMemoryCanvas
                mode={mode}
                stage={stage}
                memory={memory}
                physicalInputs={
                  physicalInputs
                }
                physicalOutputs={
                  physicalOutputs
                }
                selectedArea={
                  selectedArea
                }
                onSelectArea={
                  selectArea
                }
              />

              <Card
                title="PLC memory scan sequence"
                description="The processor repeats these four memory operations while in RUN mode."
              >
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-blue-600"
                    animate={{
                      width: `${stageInfo.progress}%`,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-4">
                  {(
                    [
                      {
                        id: "read",
                        title:
                          "Read input image",
                      },

                      {
                        id: "execute",
                        title:
                          "Program and work data",
                      },

                      {
                        id: "write",
                        title:
                          "Write output image",
                      },

                      {
                        id: "service",
                        title:
                          "Service and retain",
                      },
                    ] as const
                  ).map(
                    (
                      item,
                      index,
                    ) => {
                      const active =
                        stage ===
                        item.id;

                      return (
                        <motion.div
                          key={
                            item.id
                          }
                          className={[
                            "rounded-xl border p-3",

                            active
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 bg-white",
                          ].join(
                            " ",
                          )}
                          animate={{
                            y: active
                              ? -3
                              : 0,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={[
                                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",

                                active
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-500",
                              ].join(
                                " ",
                              )}
                            >
                              {index + 1}
                            </span>

                            <Led
                              active={
                                active
                              }
                            />
                          </div>

                          <p className="mt-3 text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>
                        </motion.div>
                      );
                    },
                  )}
                </div>

                <AnimatePresence mode="wait">
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
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                  >
                    <p className="font-semibold text-blue-900">
                      {stageInfo.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      {
                        stageInfo.description
                      }
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Card>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
                <Card
                  title="Selected memory area"
                  description="Click a memory block in the canvas or use the inspector."
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={
                        selectedArea
                      }
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                      }}
                    >
                      <StatusBadge
                        active
                        tone="blue"
                      >
                        {
                          selectedDefinition.title
                        }
                      </StatusBadge>

                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {
                          selectedDefinition.description
                        }
                      </p>

                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                        {
                          selectedDefinition.example
                        }
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-200 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Power behavior
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {selectedDefinition.volatile
                              ? "Volatile by default"
                              : "Non-volatile"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Access
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {selectedDefinition.writable
                              ? "Readable and writable"
                              : "Read-only in simulator"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </Card>

                <Card
                  title="Physical I/O result"
                  description="The output image reaches field devices only during the write stage."
                >
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Input terminals
                      </p>

                      <div className="mt-3 space-y-2">
                        <Led
                          active={
                            physicalInputs.start
                          }
                          label="I0.0 START"
                        />

                        <Led
                          active={
                            physicalInputs.stop
                          }
                          label="I0.1 STOP"
                          danger
                        />

                        <Led
                          active={
                            physicalInputs.level
                          }
                          label="I0.2 LEVEL"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Output terminals
                      </p>

                      <div className="mt-3 space-y-2">
                        <Led
                          active={
                            physicalOutputs.motor
                          }
                          label="Q0.0 MOTOR"
                        />

                        <Led
                          active={
                            physicalOutputs.valve
                          }
                          label="Q0.1 VALVE"
                        />

                        <Led
                          active={
                            physicalOutputs.alarm
                          }
                          label="Q0.2 ALARM"
                          danger
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card
                title={`${selectedDefinition.title} table`}
                description="Inspect decimal, hexadecimal, binary and retention state for each address."
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-3">
                          Address
                        </th>

                        <th className="px-3 py-3">
                          Decimal
                        </th>

                        <th className="px-3 py-3">
                          Hex
                        </th>

                        <th className="px-3 py-3">
                          Binary
                        </th>

                        <th className="px-3 py-3">
                          Retention
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {memoryRows.map(
                        (row) => (
                          <tr
                            key={
                              row.address
                            }
                            className={[
                              "cursor-pointer border-b border-slate-100 last:border-b-0",

                              selectedIndex ===
                              row.index
                                ? "bg-blue-50"
                                : "hover:bg-slate-50",
                            ].join(
                              " ",
                            )}
                            onClick={() =>
                              selectAddress(
                                row.index,
                              )
                            }
                          >
                            <td className="px-3 py-3 font-mono font-semibold text-blue-700">
                              {
                                row.address
                              }
                            </td>

                            <td className="px-3 py-3 font-mono text-slate-700">
                              {
                                row.value
                              }
                            </td>

                            <td className="px-3 py-3 font-mono text-slate-700">
                              {toHex(
                                row.value,
                              )}
                            </td>

                            <td className="px-3 py-3 font-mono text-slate-700">
                              {toBinary(
                                row.value,
                              )}
                            </td>

                            <td className="px-3 py-3">
                              <StatusBadge
                                active={
                                  row.retained
                                }
                                tone="green"
                              >
                                {row.retained
                                  ? "Retained"
                                  : "Volatile"}
                              </StatusBadge>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}