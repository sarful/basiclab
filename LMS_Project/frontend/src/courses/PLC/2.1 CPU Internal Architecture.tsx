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

type CpuMode = "off" | "stop" | "run";

type CpuStage =
  | "idle"
  | "fetch"
  | "decode"
  | "execute"
  | "writeback";

type Operation =
  | "AND"
  | "OR"
  | "XOR"
  | "ADD"
  | "SUB"
  | "GT"
  | "MOVE";

type CpuComponentId =
  | "programMemory"
  | "programCounter"
  | "instructionRegister"
  | "controlUnit"
  | "dataRegisters"
  | "alu"
  | "accumulator"
  | "statusRegister"
  | "outputRegister"
  | "clock"
  | "watchdog";

type Flags = {
  zero: boolean;
  carry: boolean;
  negative: boolean;
  compare: boolean;
};

type Calculation = {
  raw: number;
  value: number;
  flags: Flags;
};

/* =========================================================
   CONSTANTS
========================================================= */

const EMPTY_FLAGS: Flags = {
  zero: false,
  carry: false,
  negative: false,
  compare: false,
};

const OPERATIONS: Array<{
  value: Operation;
  label: string;
  formula: string;
  explanation: string;
}> = [
  {
    value: "AND",
    label: "AND — bitwise logic",
    formula: "ACC ← A AND B",
    explanation:
      "Each output bit is 1 only when both corresponding input bits are 1.",
  },
  {
    value: "OR",
    label: "OR — bitwise logic",
    formula: "ACC ← A OR B",
    explanation:
      "Each output bit is 1 when either corresponding input bit is 1.",
  },
  {
    value: "XOR",
    label: "XOR — exclusive logic",
    formula: "ACC ← A XOR B",
    explanation:
      "Each output bit is 1 when the two corresponding input bits are different.",
  },
  {
    value: "ADD",
    label: "ADD — 8-bit addition",
    formula: "ACC ← A + B",
    explanation:
      "The ALU adds the two bytes and sets the carry flag when the result exceeds 255.",
  },
  {
    value: "SUB",
    label: "SUB — 8-bit subtraction",
    formula: "ACC ← A − B",
    explanation:
      "The ALU subtracts B from A and wraps the stored result into an 8-bit value.",
  },
  {
    value: "GT",
    label: "COMPARE — A greater than B",
    formula: "ACC ← (A > B)",
    explanation:
      "The accumulator becomes 1 when A is greater than B; otherwise it becomes 0.",
  },
  {
    value: "MOVE",
    label: "MOVE — copy register A",
    formula: "ACC ← A",
    explanation:
      "The value in data register A is copied directly into the accumulator.",
  },
];

const STAGE_DETAILS: Record<
  CpuStage,
  {
    title: string;
    description: string;
    progress: number;
  }
> = {
  idle: {
    title: "CPU ready",
    description:
      "Power the CPU and choose Run CPU or Single Cycle to observe the internal instruction path.",
    progress: 0,
  },

  fetch: {
    title: "1. Fetch instruction",
    description:
      "The program counter supplies an address to program memory. The instruction at that address is loaded into the instruction register.",
    progress: 25,
  },

  decode: {
    title: "2. Decode instruction",
    description:
      "The control unit interprets the opcode and generates control signals for registers, the ALU and the data buses.",
    progress: 50,
  },

  execute: {
    title: "3. Execute operation",
    description:
      "Data registers A and B feed the ALU. The ALU performs the selected logic, arithmetic or comparison operation.",
    progress: 75,
  },

  writeback: {
    title: "4. Write back result",
    description:
      "The result is stored in the accumulator and output register. Status flags are updated and the program counter advances.",
    progress: 100,
  },
};

const COMPONENT_DETAILS: Record<
  CpuComponentId,
  {
    title: string;
    summary: string;
    points: string[];
  }
> = {
  programMemory: {
    title: "Program Memory",
    summary:
      "Stores the PLC user program as a sequence of instructions that the CPU fetches and executes.",
    points: [
      "Addressed by the program counter",
      "Returns the instruction stored at the selected address",
      "Usually retains the control program when power is removed",
    ],
  },

  programCounter: {
    title: "Program Counter (PC)",
    summary:
      "Holds the address of the next program instruction to fetch from memory.",
    points: [
      "Supplies the instruction address",
      "Advances after a completed instruction cycle",
      "Can be changed by jump and branch instructions",
    ],
  },

  instructionRegister: {
    title: "Instruction Register (IR)",
    summary:
      "Temporarily stores the instruction currently being decoded and executed.",
    points: [
      "Loaded during the fetch stage",
      "Provides the opcode to the control unit",
      "Keeps the current instruction stable during execution",
    ],
  },

  controlUnit: {
    title: "Control Unit",
    summary:
      "Coordinates the CPU by decoding instructions and issuing timed control signals.",
    points: [
      "Selects the ALU operation",
      "Controls register loading and bus direction",
      "Sequences fetch, decode, execute and write-back stages",
    ],
  },

  dataRegisters: {
    title: "Data Registers A and B",
    summary:
      "Fast internal registers that hold the operands supplied to the arithmetic logic unit.",
    points: [
      "Represent values read from PLC memory or process data",
      "Feed the two ALU input ports",
      "Allow rapid operation without repeatedly accessing memory",
    ],
  },

  alu: {
    title: "Arithmetic Logic Unit (ALU)",
    summary:
      "Performs arithmetic, Boolean logic and comparison operations on CPU data.",
    points: [
      "Executes ADD and SUB operations",
      "Executes AND, OR and XOR logic",
      "Generates condition information for status flags",
    ],
  },

  accumulator: {
    title: "Accumulator",
    summary:
      "A high-speed register that stores an intermediate or final result from the ALU.",
    points: [
      "Receives the ALU result during write-back",
      "Can supply data to later instructions",
      "Shows the active result in this learning model",
    ],
  },

  statusRegister: {
    title: "Status Register",
    summary:
      "Stores condition flags that describe the result of the most recent ALU operation.",
    points: [
      "Zero flag indicates a result of zero",
      "Carry flag indicates 8-bit overflow or borrow",
      "Negative and compare flags support decision logic",
    ],
  },

  outputRegister: {
    title: "Output Register",
    summary:
      "Stores the completed result that can be transferred to PLC memory or the output process image.",
    points: [
      "Loaded during the write-back stage",
      "Separates internal ALU activity from an externally visible result",
      "Represents a destination register in this simulation",
    ],
  },

  clock: {
    title: "System Clock",
    summary:
      "Provides timing pulses that synchronize register transfers and CPU operations.",
    points: [
      "Keeps CPU actions in the correct order",
      "Coordinates control-unit timing",
      "Runs much faster in a real PLC than in this teaching animation",
    ],
  },

  watchdog: {
    title: "Watchdog Timer",
    summary:
      "Monitors execution time and detects a CPU cycle that takes longer than an allowed safety limit.",
    points: [
      "Helps detect stalled software or processor faults",
      "Can place the PLC into a controlled fault state",
      "Is refreshed when the CPU completes expected activity",
    ],
  },
};

/* =========================================================
   HELPERS
========================================================= */

function clampByte(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(255, Math.max(0, Math.round(value)));
}

function byteBinary(value: number): string {
  return clampByte(value)
    .toString(2)
    .padStart(8, "0");
}

function byteHex(value: number): string {
  return `0x${clampByte(value)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0")}`;
}

function wrapByte(value: number): number {
  return ((value % 256) + 256) % 256;
}

function calculateOperation(
  operation: Operation,
  a: number,
  b: number,
): Calculation {
  let raw = 0;
  let compare = false;

  switch (operation) {
    case "AND":
      raw = a & b;
      break;

    case "OR":
      raw = a | b;
      break;

    case "XOR":
      raw = a ^ b;
      break;

    case "ADD":
      raw = a + b;
      break;

    case "SUB":
      raw = a - b;
      break;

    case "GT":
      compare = a > b;
      raw = compare ? 1 : 0;
      break;

    case "MOVE":
      raw = a;
      break;
  }

  const value = wrapByte(raw);

  return {
    raw,
    value,

    flags: {
      zero: value === 0,
      carry: raw > 255 || raw < 0,
      negative: (value & 0x80) !== 0,
      compare,
    },
  };
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

/* =========================================================
   UI COMPONENTS
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
  tone?: "blue" | "green" | "amber" | "red";
}) {
  const activeClass = {
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
          ? activeClass
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

function FlagLamp({
  active,
  label,
  description,
}: {
  active: boolean;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <motion.span
        className={[
          "h-4 w-4 shrink-0 rounded-full border",

          active
            ? "border-emerald-500 bg-emerald-500"
            : "border-slate-300 bg-slate-100",
        ].join(" ")}
        animate={
          active
            ? {
                scale: [1, 1.2, 1],

                boxShadow: [
                  "0 0 0 rgba(16,185,129,0)",
                  "0 0 12px rgba(16,185,129,.55)",
                  "0 0 0 rgba(16,185,129,0)",
                ],
              }
            : {
                scale: 1,
                boxShadow: "0 0 0 rgba(0,0,0,0)",
              }
        }
        transition={{
          duration: 1,
          repeat: active
            ? Number.POSITIVE_INFINITY
            : 0,
        }}
      />
    </div>
  );
}

function ValueControl({
  id,
  label,
  value,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={`${id}-number`}
          className="text-sm font-semibold text-slate-800"
        >
          {label}
        </label>

        <span className="font-mono text-xs font-semibold text-blue-700">
          {byteHex(value)}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_76px] items-center gap-3">
        <input
          id={`${id}-range`}
          type="range"
          min={0}
          max={255}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              clampByte(
                Number(event.target.value),
              ),
            )
          }
          className="w-full accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <input
          id={`${id}-number`}
          type="number"
          min={0}
          max={255}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              clampByte(
                Number(event.target.value),
              ),
            )
          }
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-center font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>

      <div className="rounded-lg bg-slate-900 px-3 py-2 text-center font-mono text-xs tracking-wider text-blue-200">
        {byteBinary(value)}
      </div>
    </div>
  );
}

/* =========================================================
   ACCESSIBLE SVG COMPONENT WRAPPER
========================================================= */

function SvgNode({
  id,
  active,
  children,
  onSelect,
}: {
  id: CpuComponentId;
  active: boolean;
  children: ReactNode;
  onSelect: (id: CpuComponentId) => void;
}) {
  const handleKeyDown = (
    event: KeyboardEvent<SVGGElement>,
  ) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${COMPONENT_DETAILS[id].title}`}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer outline-none"
      animate={
        active
          ? {
              filter: [
                "drop-shadow(0 0 0 rgba(37,99,235,0))",
                "drop-shadow(0 0 12px rgba(37,99,235,.35))",
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
    >
      {children}
    </motion.g>
  );
}

/* =========================================================
   CPU ARCHITECTURE CANVAS
========================================================= */

function CpuArchitectureCanvas({
  mode,
  stage,
  operation,
  inputA,
  inputB,
  programCounter,
  instructionRegister,
  accumulator,
  outputRegister,
  flags,
  selectedComponent,
  onSelectComponent,
}: {
  mode: CpuMode;
  stage: CpuStage;
  operation: Operation;
  inputA: number;
  inputB: number;
  programCounter: number;
  instructionRegister: string;
  accumulator: number;
  outputRegister: number;
  flags: Flags;
  selectedComponent: CpuComponentId;
  onSelectComponent: (
    id: CpuComponentId,
  ) => void;
}) {
  const powered = mode !== "off";

  const clockActive =
    powered &&
    (
      mode === "run" ||
      stage !== "idle"
    );

  const nodeClass = (
    id: CpuComponentId,
    active: boolean,
  ) => {
    return [
      "fill-white stroke-[3] transition-colors",

      selectedComponent === id
        ? "stroke-blue-600"
        : active
          ? "stroke-blue-400"
          : "stroke-slate-300",
    ].join(" ");
  };

  const pathClass = (
    active: boolean,
  ) => {
    return [
      "fill-none stroke-[4]",

      active
        ? "stroke-blue-600"
        : "stroke-slate-300",
    ].join(" ");
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            CPU internal architecture canvas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a component or run a cycle
            to follow the internal data path.
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
            active={stage !== "idle"}
            tone="amber"
          >
            {stage === "idle"
              ? "IDLE"
              : stage.toUpperCase()}
          </StatusBadge>
        </div>
      </div>

      <div className="relative aspect-[4/3] min-h-[470px] w-full bg-slate-50 sm:aspect-[16/10]">
        <svg
          viewBox="0 0 1120 760"
          className="h-full w-full"
          role="img"
          aria-label="Interactive diagram of PLC CPU internal components and instruction data flow"
        >
          <defs>
            <pattern
              id="cpuGrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
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
          </defs>

          <rect
            width="1120"
            height="760"
            fill="url(#cpuGrid)"
          />

          <rect
            x="30"
            y="30"
            width="1060"
            height="690"
            rx="28"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
          />

          <text
            x="60"
            y="68"
            fill="#0f172a"
            fontSize="21"
            fontWeight="700"
          >
            PLC CENTRAL PROCESSING UNIT
          </text>

          <text
            x="60"
            y="94"
            fill="#64748b"
            fontSize="13"
          >
            Simplified 8-bit instructional
            data path
          </text>

          {/* Program-counter address bus */}

          <path
            d="M360 175 H280 V210 H240"
            className={pathClass(
              stage === "fetch",
            )}
            strokeDasharray={
              stage === "fetch"
                ? "12 9"
                : undefined
            }
            markerEnd={
              stage === "fetch"
                ? "url(#blueArrow)"
                : "url(#grayArrow)"
            }
          />

          {/* Program-memory instruction bus */}

          <path
            d="M240 255 H455"
            className={pathClass(
              stage === "fetch",
            )}
            strokeDasharray={
              stage === "fetch"
                ? "12 9"
                : undefined
            }
            markerEnd={
              stage === "fetch"
                ? "url(#blueArrow)"
                : "url(#grayArrow)"
            }
          />

          {/* Instruction-register decode path */}

          <path
            d="M550 285 V335"
            className={pathClass(
              stage === "decode",
            )}
            strokeDasharray={
              stage === "decode"
                ? "12 9"
                : undefined
            }
            markerEnd={
              stage === "decode"
                ? "url(#blueArrow)"
                : "url(#grayArrow)"
            }
          />

          {/* Register-file data bus */}

          <path
            d="M300 430 H710"
            className={pathClass(
              stage === "execute",
            )}
            strokeDasharray={
              stage === "execute"
                ? "12 9"
                : undefined
            }
            markerEnd={
              stage === "execute"
                ? "url(#blueArrow)"
                : "url(#grayArrow)"
            }
          />

          {/* Control-unit signal path */}

          <path
            d="M650 405 H710"
            className={pathClass(
              stage === "execute",
            )}
            strokeDasharray={
              stage === "execute"
                ? "12 9"
                : undefined
            }
            markerEnd={
              stage === "execute"
                ? "url(#blueArrow)"
                : "url(#grayArrow)"
            }
          />

          {/* ALU to accumulator */}

          <path
            d="M835 500 V570"
            className={pathClass(
              stage === "writeback",
            )}
            strokeDasharray={
              stage === "writeback"
                ? "12 9"
                : undefined
            }
            markerEnd={
              stage === "writeback"
                ? "url(#blueArrow)"
                : "url(#grayArrow)"
            }
          />

          {/* ALU to status register */}

          <path
            d="M930 440 H970"
            className={pathClass(
              stage === "writeback",
            )}
            strokeDasharray={
              stage === "writeback"
                ? "12 9"
                : undefined
            }
            markerEnd={
              stage === "writeback"
                ? "url(#blueArrow)"
                : "url(#grayArrow)"
            }
          />

          {/* Accumulator to output register */}

          <path
            d="M740 635 H650"
            className={pathClass(
              stage === "writeback",
            )}
            strokeDasharray={
              stage === "writeback"
                ? "12 9"
                : undefined
            }
            markerEnd={
              stage === "writeback"
                ? "url(#blueArrow)"
                : "url(#grayArrow)"
            }
          />

          {/* Clock-control path */}

          <path
            d="M250 620 H430 V455"
            className={pathClass(clockActive)}
            strokeDasharray="8 8"
            markerEnd={
              clockActive
                ? "url(#blueArrow)"
                : "url(#grayArrow)"
            }
          />

          {/* Program Memory */}

          <SvgNode
            id="programMemory"
            active={stage === "fetch"}
            onSelect={onSelectComponent}
          >
            <rect
              x="70"
              y="145"
              width="170"
              height="150"
              rx="18"
              className={nodeClass(
                "programMemory",
                stage === "fetch",
              )}
            />

            <text
              x="155"
              y="177"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              PROGRAM MEMORY
            </text>

            <rect
              x="95"
              y="195"
              width="120"
              height="58"
              rx="9"
              fill="#eff6ff"
              stroke="#93c5fd"
              strokeWidth="2"
            />

            <text
              x="155"
              y="218"
              textAnchor="middle"
              fill="#1d4ed8"
              fontSize="12"
              fontWeight="700"
            >
              ADDRESS {programCounter}
            </text>

            <text
              x="155"
              y="239"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="700"
            >
              {operation}
            </text>

            <text
              x="155"
              y="277"
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              Instruction storage
            </text>
          </SvgNode>

          {/* Program Counter */}

          <SvgNode
            id="programCounter"
            active={
              stage === "fetch" ||
              stage === "writeback"
            }
            onSelect={onSelectComponent}
          >
            <rect
              x="360"
              y="125"
              width="150"
              height="100"
              rx="18"
              className={nodeClass(
                "programCounter",

                stage === "fetch" ||
                  stage === "writeback",
              )}
            />

            <text
              x="435"
              y="157"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              PROGRAM COUNTER
            </text>

            <text
              x="435"
              y="194"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="22"
              fontWeight="700"
            >
              PC = {programCounter}
            </text>
          </SvgNode>

          {/* Instruction Register */}

          <SvgNode
            id="instructionRegister"
            active={
              stage === "fetch" ||
              stage === "decode"
            }
            onSelect={onSelectComponent}
          >
            <rect
              x="455"
              y="235"
              width="190"
              height="100"
              rx="18"
              className={nodeClass(
                "instructionRegister",

                stage === "fetch" ||
                  stage === "decode",
              )}
            />

            <text
              x="550"
              y="267"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              INSTRUCTION REGISTER
            </text>

            <text
              x="550"
              y="305"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="19"
              fontWeight="700"
            >
              IR = {instructionRegister}
            </text>
          </SvgNode>

          {/* Control Unit */}

          <SvgNode
            id="controlUnit"
            active={
              stage === "decode" ||
              stage === "execute"
            }
            onSelect={onSelectComponent}
          >
            <rect
              x="430"
              y="335"
              width="220"
              height="140"
              rx="20"
              className={nodeClass(
                "controlUnit",

                stage === "decode" ||
                  stage === "execute",
              )}
            />

            <text
              x="540"
              y="368"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="15"
              fontWeight="700"
            >
              CONTROL UNIT
            </text>

            <rect
              x="462"
              y="387"
              width="156"
              height="48"
              rx="9"
              fill="#0f172a"
            />

            <text
              x="540"
              y="408"
              textAnchor="middle"
              fill="#86efac"
              fontSize="14"
              fontWeight="700"
            >
              {stage === "idle"
                ? "READY"
                : stage.toUpperCase()}
            </text>

            <text
              x="540"
              y="426"
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="10"
            >
              OPCODE: {operation}
            </text>

            <text
              x="540"
              y="456"
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              Decode and timing control
            </text>
          </SvgNode>

          {/* Data Registers */}

          <SvgNode
            id="dataRegisters"
            active={stage === "execute"}
            onSelect={onSelectComponent}
          >
            <rect
              x="70"
              y="355"
              width="230"
              height="150"
              rx="18"
              className={nodeClass(
                "dataRegisters",
                stage === "execute",
              )}
            />

            <text
              x="185"
              y="388"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              DATA REGISTERS
            </text>

            <rect
              x="95"
              y="407"
              width="80"
              height="58"
              rx="10"
              fill="#eff6ff"
              stroke="#93c5fd"
              strokeWidth="2"
            />

            <text
              x="135"
              y="428"
              textAnchor="middle"
              fill="#475569"
              fontSize="11"
              fontWeight="700"
            >
              REG A
            </text>

            <text
              x="135"
              y="451"
              textAnchor="middle"
              fill="#1d4ed8"
              fontSize="18"
              fontWeight="700"
            >
              {inputA}
            </text>

            <rect
              x="195"
              y="407"
              width="80"
              height="58"
              rx="10"
              fill="#eff6ff"
              stroke="#93c5fd"
              strokeWidth="2"
            />

            <text
              x="235"
              y="428"
              textAnchor="middle"
              fill="#475569"
              fontSize="11"
              fontWeight="700"
            >
              REG B
            </text>

            <text
              x="235"
              y="451"
              textAnchor="middle"
              fill="#1d4ed8"
              fontSize="18"
              fontWeight="700"
            >
              {inputB}
            </text>

            <text
              x="185"
              y="488"
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              ALU operand storage
            </text>
          </SvgNode>

          {/* Arithmetic Logic Unit */}

          <SvgNode
            id="alu"
            active={stage === "execute"}
            onSelect={onSelectComponent}
          >
            <path
              d="M710 350 H930 L895 425 L930 500 H710 L745 425 Z"
              className={nodeClass(
                "alu",
                stage === "execute",
              )}
            />

            <text
              x="820"
              y="390"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="18"
              fontWeight="700"
            >
              ALU
            </text>

            <text
              x="820"
              y="426"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="28"
              fontWeight="800"
            >
              {operation}
            </text>

            <text
              x="820"
              y="455"
              textAnchor="middle"
              fill="#475569"
              fontSize="13"
            >
              A={inputA} · B={inputB}
            </text>

            <text
              x="820"
              y="480"
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              Arithmetic and logic unit
            </text>
          </SvgNode>

          {/* Status Register */}

          <SvgNode
            id="statusRegister"
            active={stage === "writeback"}
            onSelect={onSelectComponent}
          >
            <rect
              x="970"
              y="340"
              width="100"
              height="200"
              rx="18"
              className={nodeClass(
                "statusRegister",
                stage === "writeback",
              )}
            />

            <text
              x="1020"
              y="370"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="700"
            >
              STATUS
            </text>

            {[
              {
                label: "Z",
                active: flags.zero,
              },
              {
                label: "C",
                active: flags.carry,
              },
              {
                label: "N",
                active: flags.negative,
              },
              {
                label: "GT",
                active: flags.compare,
              },
            ].map((item, index) => (
              <g key={item.label}>
                <circle
                  cx="998"
                  cy={405 + index * 34}
                  r="8"
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
                  x="1017"
                  y={410 + index * 34}
                  fill="#475569"
                  fontSize="11"
                  fontWeight="700"
                >
                  {item.label}
                </text>
              </g>
            ))}
          </SvgNode>

          {/* Accumulator */}

          <SvgNode
            id="accumulator"
            active={stage === "writeback"}
            onSelect={onSelectComponent}
          >
            <rect
              x="740"
              y="570"
              width="190"
              height="105"
              rx="18"
              className={nodeClass(
                "accumulator",
                stage === "writeback",
              )}
            />

            <text
              x="835"
              y="603"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              ACCUMULATOR
            </text>

            <text
              x="835"
              y="642"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="25"
              fontWeight="800"
            >
              ACC = {accumulator}
            </text>
          </SvgNode>

          {/* Output Register */}

          <SvgNode
            id="outputRegister"
            active={stage === "writeback"}
            onSelect={onSelectComponent}
          >
            <rect
              x="460"
              y="575"
              width="190"
              height="100"
              rx="18"
              className={nodeClass(
                "outputRegister",
                stage === "writeback",
              )}
            />

            <text
              x="555"
              y="607"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              OUTPUT REGISTER
            </text>

            <text
              x="555"
              y="644"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="23"
              fontWeight="800"
            >
              OUT = {outputRegister}
            </text>
          </SvgNode>

          {/* System Clock */}

          <SvgNode
            id="clock"
            active={clockActive}
            onSelect={onSelectComponent}
          >
            <rect
              x="70"
              y="555"
              width="180"
              height="120"
              rx="18"
              className={nodeClass(
                "clock",
                clockActive,
              )}
            />

            <text
              x="160"
              y="585"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              SYSTEM CLOCK
            </text>

            <circle
              cx="130"
              cy="625"
              r="27"
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth="3"
            />

            <motion.line
              x1="130"
              y1="625"
              x2="130"
              y2="605"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                transformOrigin:
                  "130px 625px",
              }}
              animate={{
                rotate: clockActive
                  ? 360
                  : 0,
              }}
              transition={{
                duration: 0.85,

                repeat: clockActive
                  ? Number.POSITIVE_INFINITY
                  : 0,

                ease: "linear",
              }}
            />

            <text
              x="190"
              y="618"
              textAnchor="middle"
              fill="#475569"
              fontSize="11"
              fontWeight="700"
            >
              CLOCK
            </text>

            <text
              x="190"
              y="638"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              Timing pulses
            </text>
          </SvgNode>

          {/* Watchdog Timer */}

          <SvgNode
            id="watchdog"
            active={stage === "writeback"}
            onSelect={onSelectComponent}
          >
            <rect
              x="270"
              y="555"
              width="150"
              height="120"
              rx="18"
              className={nodeClass(
                "watchdog",
                stage === "writeback",
              )}
            />

            <text
              x="345"
              y="585"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
            >
              WATCHDOG
            </text>

            <motion.circle
              cx="345"
              cy="625"
              r="26"
              fill="#ffffff"
              stroke="#10b981"
              strokeWidth="7"
              strokeDasharray="125 38"
              animate={{
                rotate: clockActive
                  ? 360
                  : 0,
              }}
              style={{
                transformOrigin:
                  "345px 625px",
              }}
              transition={{
                duration: 2,

                repeat: clockActive
                  ? Number.POSITIVE_INFINITY
                  : 0,

                ease: "linear",
              }}
            />

            <text
              x="345"
              y="630"
              textAnchor="middle"
              fill="#047857"
              fontSize="11"
              fontWeight="800"
            >
              OK
            </text>
          </SvgNode>

          {/* Animated Data Packets */}

          <AnimatePresence>
            {stage === "fetch" ? (
              <>
                <motion.circle
                  key="fetch-address"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 360,
                    cy: 175,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [
                      360,
                      280,
                      280,
                      240,
                    ],

                    cy: [
                      175,
                      175,
                      210,
                      210,
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
                    duration: 1.1,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <motion.circle
                  key="fetch-instruction"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 240,
                    cy: 255,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [240, 455],
                    cy: [255, 255],
                    opacity: [0, 1, 0],
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.1,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: 0.2,
                  }}
                />
              </>
            ) : null}

            {stage === "decode" ? (
              <motion.circle
                key="decode-packet"
                r="7"
                fill="#2563eb"
                initial={{
                  cx: 550,
                  cy: 285,
                  opacity: 0,
                }}
                animate={{
                  cx: [550, 550],
                  cy: [285, 335],
                  opacity: [0, 1, 0],
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
            ) : null}

            {stage === "execute" ? (
              <>
                <motion.circle
                  key="execute-data"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 300,
                    cy: 430,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [300, 710],
                    cy: [430, 430],
                    opacity: [0, 1, 0],
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.1,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <motion.circle
                  key="execute-control"
                  r="6"
                  fill="#7c3aed"
                  initial={{
                    cx: 650,
                    cy: 405,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [650, 710],
                    cy: [405, 405],
                    opacity: [0, 1, 0],
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </>
            ) : null}

            {stage === "writeback" ? (
              <>
                <motion.circle
                  key="write-acc"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 835,
                    cy: 500,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [835, 835],
                    cy: [500, 570],
                    opacity: [0, 1, 0],
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

                <motion.circle
                  key="write-status"
                  r="6"
                  fill="#10b981"
                  initial={{
                    cx: 930,
                    cy: 440,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [930, 970],
                    cy: [440, 440],
                    opacity: [0, 1, 0],
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.65,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <motion.circle
                  key="write-output"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 740,
                    cy: 635,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [740, 650],
                    cy: [635, 635],
                    opacity: [0, 1, 0],
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
          </AnimatePresence>
        </svg>

        {!powered ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-4 backdrop-blur-[1px]">
            <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                CPU
              </div>

              <p className="mt-3 font-semibold text-slate-900">
                CPU power is OFF
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Use the left control panel to
                power the processor and begin
                the instruction cycle.
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

export default function PlcCpuArchitecturePage() {
  const [mode, setMode] =
    useState<CpuMode>("off");

  const [stage, setStage] =
    useState<CpuStage>("idle");

  const [busy, setBusy] =
    useState(false);

  const [cycleCount, setCycleCount] =
    useState(0);

  const [
    programCounter,
    setProgramCounter,
  ] = useState(0);

  const [
    instructionRegister,
    setInstructionRegister,
  ] = useState("EMPTY");

  const [operation, setOperation] =
    useState<Operation>("AND");

  const [inputA, setInputA] =
    useState(12);

  const [inputB, setInputB] =
    useState(10);

  const [
    accumulator,
    setAccumulator,
  ] = useState(0);

  const [
    outputRegister,
    setOutputRegister,
  ] = useState(0);

  const [
    pendingResult,
    setPendingResult,
  ] = useState<Calculation | null>(
    null,
  );

  const [flags, setFlags] =
    useState<Flags>(EMPTY_FLAGS);

  const [
    cycleDuration,
    setCycleDuration,
  ] = useState(1800);

  const [
    selectedComponent,
    setSelectedComponent,
  ] = useState<CpuComponentId>(
    "controlUnit",
  );

  /* =======================================================
     REFS USED BY ASYNCHRONOUS CYCLE
  ======================================================= */

  const modeRef =
    useRef<CpuMode>(mode);

  const operationRef =
    useRef<Operation>(operation);

  const inputARef =
    useRef(inputA);

  const inputBRef =
    useRef(inputB);

  const programCounterRef =
    useRef(programCounter);

  const cycleDurationRef =
    useRef(cycleDuration);

  const busyRef =
    useRef(false);

  const abortVersionRef =
    useRef(0);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    operationRef.current = operation;
  }, [operation]);

  useEffect(() => {
    inputARef.current = inputA;
  }, [inputA]);

  useEffect(() => {
    inputBRef.current = inputB;
  }, [inputB]);

  useEffect(() => {
    programCounterRef.current =
      programCounter;
  }, [programCounter]);

  useEffect(() => {
    cycleDurationRef.current =
      cycleDuration;
  }, [cycleDuration]);

  const selectedOperation = useMemo(
    () =>
      OPERATIONS.find(
        (item) =>
          item.value === operation,
      ) ?? OPERATIONS[0],

    [operation],
  );

  const selectedInfo =
    COMPONENT_DETAILS[
      selectedComponent
    ];

  const stageInfo =
    STAGE_DETAILS[stage];

  /* =======================================================
     EXECUTE ONE CPU INSTRUCTION CYCLE
  ======================================================= */

  const performCycle =
    useCallback(
      async (): Promise<boolean> => {
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

        const phaseDuration =
          Math.max(
            150,

            Math.round(
              cycleDurationRef.current /
                4,
            ),
          );

        /*
         * Values are captured at the beginning
         * of the instruction cycle.
         */

        const cycleOperation =
          operationRef.current;

        const cycleA =
          inputARef.current;

        const cycleB =
          inputBRef.current;

        const cyclePc =
          programCounterRef.current;

        const isValid = () =>
          token ===
            abortVersionRef.current &&
          modeRef.current !== "off";

        try {
          /*
           * 1. FETCH
           */

          setStage("fetch");

          setInstructionRegister(
            cycleOperation,
          );

          await sleep(phaseDuration);

          if (!isValid()) {
            return false;
          }

          /*
           * 2. DECODE
           */

          setStage("decode");

          await sleep(phaseDuration);

          if (!isValid()) {
            return false;
          }

          /*
           * 3. EXECUTE
           */

          setStage("execute");

          const result =
            calculateOperation(
              cycleOperation,
              cycleA,
              cycleB,
            );

          setPendingResult(result);

          await sleep(phaseDuration);

          if (!isValid()) {
            return false;
          }

          /*
           * 4. WRITE BACK
           */

          setStage("writeback");

          setAccumulator(
            result.value,
          );

          setOutputRegister(
            result.value,
          );

          setFlags(result.flags);

          setCycleCount(
            (current) =>
              current + 1,
          );

          const nextPc =
            (cyclePc + 1) & 0xff;

          programCounterRef.current =
            nextPc;

          setProgramCounter(nextPc);

          await sleep(phaseDuration);

          if (!isValid()) {
            return false;
          }

          setStage("idle");

          return true;
        } finally {
          /*
           * Only the active cycle may clear
           * the busy state. This prevents an
           * old aborted cycle from interfering
           * with a newly started cycle.
           */

          if (
            token ===
            abortVersionRef.current
          ) {
            busyRef.current = false;
            setBusy(false);
          }
        }
      },
      [],
    );

  /* =======================================================
     CONTINUOUS RUN MODE
  ======================================================= */

  useEffect(() => {
    if (mode !== "run") {
      return;
    }

    let cancelled = false;

    const runLoop = async () => {
      while (
        !cancelled &&
        modeRef.current === "run"
      ) {
        await performCycle();

        if (
          !cancelled &&
          modeRef.current === "run"
        ) {
          await sleep(120);
        }
      }
    };

    void runLoop();

    return () => {
      cancelled = true;
    };
  }, [mode, performCycle]);

  /* =======================================================
     POWER CONTROL
  ======================================================= */

  const powerToggle =
    useCallback(() => {
      if (
        modeRef.current !== "off"
      ) {
        abortVersionRef.current += 1;

        modeRef.current = "off";
        busyRef.current = false;

        setMode("off");
        setBusy(false);
        setStage("idle");

        setInstructionRegister(
          "EMPTY",
        );

        return;
      }

      modeRef.current = "stop";

      setMode("stop");
      setStage("idle");
    }, []);

  /* =======================================================
     RUN / STOP CONTROL
  ======================================================= */

  const runToggle =
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

  /* =======================================================
     RESET SIMULATION
  ======================================================= */

  const resetSimulation =
    useCallback(() => {
      abortVersionRef.current += 1;

      modeRef.current = "off";
      operationRef.current = "AND";
      inputARef.current = 12;
      inputBRef.current = 10;
      programCounterRef.current = 0;
      cycleDurationRef.current = 1800;
      busyRef.current = false;

      setMode("off");
      setStage("idle");
      setBusy(false);
      setCycleCount(0);
      setProgramCounter(0);

      setInstructionRegister(
        "EMPTY",
      );

      setOperation("AND");
      setInputA(12);
      setInputB(10);
      setAccumulator(0);
      setOutputRegister(0);
      setPendingResult(null);
      setFlags(EMPTY_FLAGS);
      setCycleDuration(1800);

      setSelectedComponent(
        "controlUnit",
      );
    }, []);

  const handleOperationChange = (
    value: Operation,
  ) => {
    setOperation(value);
    operationRef.current = value;
  };

  const handleInputAChange = (
    value: number,
  ) => {
    setInputA(value);
    inputARef.current = value;
  };

  const handleInputBChange = (
    value: number,
  ) => {
    setInputB(value);
    inputBRef.current = value;
  };

  const handleSpeedChange = (
    value: number,
  ) => {
    setCycleDuration(value);
    cycleDurationRef.current =
      value;
  };

  const powered =
    mode !== "off";

  const controlsLocked =
    !powered ||
    busy ||
    mode === "run";

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-slate-50 px-3 py-4 text-slate-900 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1600px]">
          {/* Page header */}

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
                      ? "CPU RUNNING"
                      : "CPU STOPPED"}
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
                  PLC CPU Internal
                  Architecture Simulator
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                  Explore how a PLC processor
                  fetches instructions, decodes
                  opcodes, operates on data in
                  the ALU and writes results
                  into CPU registers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <MetricCard
                  label="Mode"
                  value={mode.toUpperCase()}
                  helper="Processor operating state"
                />

                <MetricCard
                  label="Cycles"
                  value={cycleCount}
                  helper="Completed instruction cycles"
                />

                <MetricCard
                  label="Accumulator"
                  value={accumulator}
                  helper={byteHex(
                    accumulator,
                  )}
                />

                <MetricCard
                  label="Output"
                  value={outputRegister}
                  helper={byteBinary(
                    outputRegister,
                  )}
                />
              </div>
            </div>
          </header>

          {/* Responsive page layout */}

          <div className="grid gap-5 md:grid-cols-[290px_minmax(0,1fr)] lg:grid-cols-[330px_minmax(0,1fr)]">
            {/* Left control panel */}

            <aside className="space-y-4 md:sticky md:top-4 md:self-start">
              <Card
                title="CPU controls"
                description="Power and execute the processor instruction cycle."
              >
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    type="button"
                    onClick={powerToggle}
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
                        : mode === "run"
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
                        ? { scale: 0.98 }
                        : undefined
                    }
                  >
                    {mode === "run"
                      ? "Stop CPU"
                      : "Run CPU"}
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={
                      !powered ||
                      mode === "run" ||
                      busy
                    }
                    onClick={() =>
                      void performCycle()
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
                    Single Cycle
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
                title="Instruction"
                description="Choose the operation decoded by the control unit."
              >
                <label
                  htmlFor="operation"
                  className="text-sm font-semibold text-slate-800"
                >
                  CPU operation
                </label>

                <select
                  id="operation"
                  value={operation}
                  disabled={
                    controlsLocked
                  }
                  onChange={(event) =>
                    handleOperationChange(
                      event.target
                        .value as Operation,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  {OPERATIONS.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ),
                  )}
                </select>

                <div className="mt-3 rounded-xl bg-slate-900 p-3 font-mono text-sm text-blue-200">
                  {
                    selectedOperation.formula
                  }
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {
                    selectedOperation.explanation
                  }
                </p>
              </Card>

              <Card
                title="Data registers"
                description="Set the two 8-bit operands supplied to the ALU."
              >
                <div className="space-y-3">
                  <ValueControl
                    id="register-a"
                    label="Register A"
                    value={inputA}
                    disabled={
                      controlsLocked
                    }
                    onChange={
                      handleInputAChange
                    }
                  />

                  <ValueControl
                    id="register-b"
                    label="Register B"
                    value={inputB}
                    disabled={
                      controlsLocked
                    }
                    onChange={
                      handleInputBChange
                    }
                  />
                </div>
              </Card>

              <Card
                title="Teaching speed"
                description="Slow the CPU so each internal stage is visible."
              >
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="cycle-speed"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full cycle
                  </label>

                  <span className="font-mono text-sm font-semibold text-blue-700">
                    {cycleDuration} ms
                  </span>
                </div>

                <input
                  id="cycle-speed"
                  type="range"
                  min={1000}
                  max={4000}
                  step={100}
                  value={
                    cycleDuration
                  }
                  onChange={(event) =>
                    handleSpeedChange(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="mt-4 w-full accent-blue-600"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Faster</span>
                  <span>Slower</span>
                </div>
              </Card>

              <Card
                title="CPU status flags"
                description="Flags are updated after the ALU result is written back."
              >
                <div className="space-y-2">
                  <FlagLamp
                    active={flags.zero}
                    label="Z — Zero"
                    description="Result equals zero"
                  />

                  <FlagLamp
                    active={flags.carry}
                    label="C — Carry"
                    description="8-bit overflow or borrow"
                  />

                  <FlagLamp
                    active={
                      flags.negative
                    }
                    label="N — Negative"
                    description="Most-significant bit is 1"
                  />

                  <FlagLamp
                    active={
                      flags.compare
                    }
                    label="GT — Compare"
                    description="A is greater than B"
                  />
                </div>
              </Card>
            </aside>

            {/* Right simulation area */}

            <section className="min-w-0 space-y-5">
              <CpuArchitectureCanvas
                mode={mode}
                stage={stage}
                operation={operation}
                inputA={inputA}
                inputB={inputB}
                programCounter={
                  programCounter
                }
                instructionRegister={
                  instructionRegister
                }
                accumulator={
                  accumulator
                }
                outputRegister={
                  outputRegister
                }
                flags={flags}
                selectedComponent={
                  selectedComponent
                }
                onSelectComponent={
                  setSelectedComponent
                }
              />

              {/* Instruction-cycle stages */}

              <Card
                title="CPU instruction cycle"
                description="The processor repeats these stages while it is in RUN mode."
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
                      "fetch",
                      "decode",
                      "execute",
                      "writeback",
                    ] as const
                  ).map(
                    (
                      item,
                      index,
                    ) => {
                      const active =
                        stage === item;

                      return (
                        <motion.div
                          key={item}
                          className={[
                            "rounded-xl border p-3",

                            active
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 bg-white",
                          ].join(" ")}
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

                            <span
                              className={[
                                "h-3 w-3 rounded-full",

                                active
                                  ? "bg-emerald-500"
                                  : "bg-slate-200",
                              ].join(
                                " ",
                              )}
                            />
                          </div>

                          <p className="mt-3 text-sm font-semibold capitalize text-slate-800">
                            {item ===
                            "writeback"
                              ? "Write back"
                              : item}
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

              {/* Component explanation and result */}

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <Card
                  title="Selected CPU component"
                  description="Click a block in the canvas to inspect it."
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={
                        selectedComponent
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
                          selectedInfo.title
                        }
                      </StatusBadge>

                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {
                          selectedInfo.summary
                        }
                      </p>

                      <ul className="mt-4 space-y-2">
                        {selectedInfo.points.map(
                          (point) => (
                            <li
                              key={point}
                              className="flex items-start gap-2 text-sm text-slate-600"
                            >
                              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                                ✓
                              </span>

                              <span>
                                {point}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </Card>

                <Card
                  title="Current result"
                  description="The ALU result becomes visible before write-back."
                >
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Pending ALU result
                      </p>

                      <p className="mt-1 font-mono text-2xl font-bold text-slate-900">
                        {pendingResult
                          ?.value ?? "—"}
                      </p>

                      <p className="mt-1 font-mono text-xs text-blue-700">
                        {pendingResult
                          ? byteBinary(
                              pendingResult.value,
                            )
                          : "--------"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Stored output
                      </p>

                      <p className="mt-1 font-mono text-2xl font-bold text-slate-900">
                        {outputRegister}
                      </p>

                      <p className="mt-1 font-mono text-xs text-blue-700">
                        {byteHex(
                          outputRegister,
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}