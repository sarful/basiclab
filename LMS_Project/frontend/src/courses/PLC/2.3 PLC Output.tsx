"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Mode = "off" | "stop" | "run";

type Stage =
  | "idle"
  | "receive"
  | "latch"
  | "isolate"
  | "drive"
  | "verify";

type Technology =
  | "relay"
  | "transistor"
  | "triac"
  | "analogVoltage"
  | "analogCurrent";

type Load =
  | "lamp"
  | "solenoid"
  | "contactor"
  | "valve"
  | "vfd";

type Supply = "24VDC" | "120VAC";

type Quality = "pending" | "good" | "fault";

type NodeId =
  | "cpu"
  | "backplane"
  | "latch"
  | "isolation"
  | "driver"
  | "terminal"
  | "supply"
  | "actuator"
  | "protection"
  | "diagnostics"
  | "feedback"
  | "led";

type Config = {
  technology: Technology;
  digitalCommand: boolean;
  analogCommand: number;
  load: Load;
  supply: Supply;
  supplyOn: boolean;
  openCircuit: boolean;
  overload: boolean;
  stuckOutput: boolean;
  cycleMs: number;
};

type Sample = {
  outputImage: number;
  latched: number;
  isolated: number;
  driver: number;

  /*
   * terminal:
   * Electrical value available at the PLC output terminal.
   *
   * loadInput:
   * Electrical value that actually reaches the actuator.
   * During an open-circuit fault, terminal voltage may exist
   * while loadInput remains zero.
   */
  terminal: number;
  loadInput: number;

  current: number;
  response: number;
  feedback: number;

  quality: Quality;
  diagnostic: string;
  protectionTripped: boolean;
};

const INITIAL: Sample = {
  outputImage: 0,
  latched: 0,
  isolated: 0,
  driver: 0,
  terminal: 0,
  loadInput: 0,
  current: 0,
  response: 0,
  feedback: 0,
  quality: "pending",
  diagnostic: "Power the module and transfer an output command.",
  protectionTripped: false,
};

const TECH: Record<
  Technology,
  {
    label: string;
    short: string;
    analog: boolean;
    help: string;
  }
> = {
  relay: {
    label: "Relay output",
    short: "Relay",
    analog: false,
    help:
      "A dry relay contact switches an external AC or DC field circuit.",
  },

  transistor: {
    label: "24 VDC transistor output",
    short: "Transistor",
    analog: false,
    help:
      "A semiconductor output rapidly switches a compatible 24 VDC load.",
  },

  triac: {
    label: "120 VAC triac output",
    short: "Triac",
    analog: false,
    help:
      "A solid-state triac switches a compatible AC load.",
  },

  analogVoltage: {
    label: "0–10 V analog output",
    short: "0–10 V",
    analog: true,
    help:
      "A DAC and voltage driver create a continuous 0–10 V command.",
  },

  analogCurrent: {
    label: "4–20 mA analog output",
    short: "4–20 mA",
    analog: true,
    help:
      "A DAC and current driver create a continuous 4–20 mA command.",
  },
};

const LOADS: Record<
  Load,
  {
    label: string;
    analog: boolean;
    amps: number;
  }
> = {
  lamp: {
    label: "Indicator lamp",
    analog: false,
    amps: 0.2,
  },

  solenoid: {
    label: "Solenoid valve coil",
    analog: false,
    amps: 0.4,
  },

  contactor: {
    label: "Motor contactor coil",
    analog: false,
    amps: 0.12,
  },

  valve: {
    label: "Control valve positioner",
    analog: true,
    amps: 0.02,
  },

  vfd: {
    label: "VFD speed reference",
    analog: true,
    amps: 0.01,
  },
};

const STAGES: Record<
  Stage,
  {
    title: string;
    text: string;
    progress: number;
  }
> = {
  idle: {
    title: "Module ready",
    text: "Set a CPU output command and start a transfer.",
    progress: 0,
  },

  receive: {
    title: "1. Receive output image",
    text:
      "The CPU sends the output-process-image value through the backplane.",
    progress: 20,
  },

  latch: {
    title: "2. Latch command",
    text:
      "The module stores a stable copy of the command in its output register.",
    progress: 40,
  },

  isolate: {
    title: "3. Isolate logic and field sides",
    text:
      "The command crosses an electrical isolation barrier.",
    progress: 60,
  },

  drive: {
    title: "4. Drive the field circuit",
    text:
      "The relay, transistor, triac, or analog driver applies the field signal.",
    progress: 80,
  },

  verify: {
    title: "5. Verify feedback",
    text:
      "Diagnostics compare command, supply, current, protection, and actuator response.",
    progress: 100,
  },
};

const NODE_INFO: Record<
  NodeId,
  {
    title: string;
    text: string;
  }
> = {
  cpu: {
    title: "CPU output image",
    text:
      "Stores the command calculated by the PLC program.",
  },

  backplane: {
    title: "Backplane",
    text:
      "Transfers output data and diagnostics between the CPU and module.",
  },

  latch: {
    title: "Output latch",
    text:
      "Holds the channel command stable while the field circuit updates.",
  },

  isolation: {
    title: "Isolation",
    text:
      "Separates PLC logic electronics from the external field circuit.",
  },

  driver: {
    title: "Output driver",
    text:
      "Converts the isolated command into switched power or an analog signal.",
  },

  terminal: {
    title: "Terminal block",
    text:
      "Connects COM, OUT, field supply, and actuator wiring.",
  },

  supply: {
    title: "Field supply",
    text:
      "Provides the electrical energy used by the actuator circuit.",
  },

  actuator: {
    title: "Field actuator",
    text:
      "Converts the electrical output into light, force, position, or speed.",
  },

  protection: {
    title: "Output protection",
    text:
      "Limits damage from overloads, shorts, and field transients.",
  },

  diagnostics: {
    title: "Diagnostics",
    text:
      "Evaluates supply, wiring, current, protection, and feedback.",
  },

  feedback: {
    title: "Actuator feedback",
    text:
      "Confirms the actual actuator state or position.",
  },

  led: {
    title: "Channel LED",
    text:
      "Shows command state or a channel fault on the module face.",
  },
};

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      Number.isFinite(value)
        ? value
        : minimum,
    ),
  );
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

function isAnalog(
  technology: Technology,
): boolean {
  return TECH[technology].analog;
}

function address(
  technology: Technology,
): string {
  return isAnalog(technology)
    ? "QW64"
    : "Q0.0";
}

function commandOf(
  config: Config,
): number {
  return isAnalog(config.technology)
    ? clamp(
        config.analogCommand,
        0,
        100,
      )
    : config.digitalCommand
      ? 1
      : 0;
}

function electricalSignal(
  technology: Technology,
  command: number,
  supply: Supply,
): number {
  if (
    technology ===
    "analogVoltage"
  ) {
    return (
      clamp(command, 0, 100) /
      10
    );
  }

  if (
    technology ===
    "analogCurrent"
  ) {
    return (
      4 +
      clamp(command, 0, 100) *
        0.16
    );
  }

  if (command < 0.5) {
    return 0;
  }

  return supply === "24VDC"
    ? 24
    : 120;
}

function signalText(
  technology: Technology,
  value: number,
  supply: Supply,
): string {
  if (
    technology ===
    "analogVoltage"
  ) {
    return `${value.toFixed(
      1,
    )} V`;
  }

  if (
    technology ===
    "analogCurrent"
  ) {
    return `${value.toFixed(
      1,
    )} mA`;
  }

  return `${value.toFixed(
    0,
  )} ${supply}`;
}

function compatibility(
  config: Config,
): string | null {
  if (
    TECH[config.technology]
      .analog !==
    LOADS[config.load].analog
  ) {
    return TECH[
      config.technology
    ].analog
      ? "Select a compatible analog actuator."
      : "Select a compatible digital load.";
  }

  if (
    config.technology ===
      "transistor" &&
    config.supply !== "24VDC"
  ) {
    return "This transistor model requires a 24 VDC field circuit.";
  }

  if (
    config.technology ===
      "triac" &&
    config.supply !== "120VAC"
  ) {
    return "This triac model requires a 120 VAC field circuit.";
  }

  return null;
}

function evaluate(
  config: Config,
  command: number,
): Omit<
  Sample,
  | "outputImage"
  | "latched"
  | "isolated"
  | "driver"
> {
  const error =
    compatibility(config);

  if (error) {
    return {
      terminal: 0,
      loadInput: 0,
      current: 0,
      response: 0,
      feedback: 0,
      quality: "fault",
      diagnostic: error,
      protectionTripped: false,
    };
  }

  if (!config.supplyOn) {
    return {
      terminal: 0,
      loadInput: 0,
      current: 0,
      response: 0,
      feedback: 0,
      quality: "fault",
      diagnostic:
        "The command is present, but the external field supply is OFF.",
      protectionTripped: false,
    };
  }

  if (config.overload) {
    return {
      terminal: 0,
      loadInput: 0,
      current: 0,
      response: 0,
      feedback: 0,
      quality: "fault",
      diagnostic:
        "The overload tripped output protection and removed field power.",
      protectionTripped: true,
    };
  }

  const wanted =
    electricalSignal(
      config.technology,
      command,
      config.supply,
    );

  if (config.stuckOutput) {
    const forced =
      isAnalog(
        config.technology,
      )
        ? config.technology ===
          "analogVoltage"
          ? 10
          : 20
        : config.supply ===
            "24VDC"
          ? 24
          : 120;

    return {
      terminal: forced,
      loadInput: forced,

      current: isAnalog(
        config.technology,
      )
        ? config.technology ===
          "analogCurrent"
          ? 0.02
          : 0.001
        : LOADS[config.load]
            .amps,

      response: 100,

      feedback: isAnalog(
        config.technology,
      )
        ? 100
        : 1,

      quality: "fault",

      diagnostic:
        "The field output is stuck ON or at maximum and ignores the CPU command.",

      protectionTripped: false,
    };
  }

  /*
   * Open-circuit behavior:
   *
   * The module terminal may still have the commanded
   * voltage or analog signal. However, no current reaches
   * the actuator, so actuator response and feedback remain zero.
   */
  if (config.openCircuit) {
    return {
      terminal: wanted,
      loadInput: 0,
      current: 0,
      response: 0,
      feedback: 0,
      quality: "fault",
      diagnostic:
        "Voltage or signal reaches OUT, but an open wire prevents load current.",
      protectionTripped: false,
    };
  }

  if (
    !isAnalog(
      config.technology,
    )
  ) {
    const active =
      command >= 0.5;

    return {
      terminal: active
        ? wanted
        : 0,

      loadInput: active
        ? wanted
        : 0,

      current: active
        ? LOADS[config.load]
            .amps
        : 0,

      response: active
        ? 100
        : 0,

      feedback: active
        ? 1
        : 0,

      quality: "good",

      diagnostic: active
        ? "The discrete output is energized and feedback is ON."
        : "The discrete output is safely de-energized and feedback is OFF.",

      protectionTripped: false,
    };
  }

  const response = clamp(
    command,
    0,
    100,
  );

  return {
    terminal: wanted,
    loadInput: wanted,

    current:
      config.technology ===
      "analogCurrent"
        ? wanted / 1000
        : wanted / 10000,

    response,
    feedback: response,
    quality: "good",

    diagnostic:
      "The analog signal is valid and the actuator follows the command.",

    protectionTripped: false,
  };
}

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

function Badge({
  children,
  active,
  tone = "blue",
}: {
  children: ReactNode;
  active: boolean;
  tone?:
    | "blue"
    | "green"
    | "amber"
    | "red";
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
        "rounded-full border px-3 py-1 text-xs font-semibold",

        active
          ? activeClass
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

      <p className="mt-1 text-xs text-slate-500">
        {helper}
      </p>
    </div>
  );
}

function Lamp({
  active,
  danger = false,
  label,
}: {
  active: boolean;
  danger?: boolean;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <motion.span
        className={[
          "h-3.5 w-3.5 rounded-full border",

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
        <span className="text-xs text-slate-600">
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
        "flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left",

        "focus:outline-none focus:ring-2 focus:ring-blue-500",

        disabled
          ? "cursor-not-allowed bg-slate-50 opacity-50"
          : checked
            ? "border-blue-300 bg-blue-50"
            : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        {description ? (
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      <span
        className={[
          "relative h-7 w-14 shrink-0 rounded-full",

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

function SvgNode({
  id,
  active,
  selected,
  onSelect,
  children,
}: {
  id: NodeId;
  active: boolean;
  selected: boolean;
  onSelect: (id: NodeId) => void;
  children: ReactNode;
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
      aria-label={`Inspect ${NODE_INFO[id].title}`}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer outline-none"
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
              filter: "none",
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

function Actuator({
  load,
  response,
  fault,
}: {
  load: Load;
  response: number;
  fault: boolean;
}) {
  const active =
    response > 1;

  if (load === "lamp") {
    return (
      <g>
        <motion.circle
          cx="1195"
          cy="415"
          r="44"
          fill={
            active
              ? "#fbbf24"
              : "#f8fafc"
          }
          stroke={
            fault
              ? "#ef4444"
              : active
                ? "#d97706"
                : "#94a3b8"
          }
          strokeWidth="4"
          animate={
            active
              ? {
                  opacity: [
                    0.65,
                    1,
                    0.65,
                  ],
                }
              : {
                  opacity: 1,
                }
          }
          transition={{
            duration: 1,

            repeat: active
              ? Number.POSITIVE_INFINITY
              : 0,
          }}
        />

        <path
          d="M1172 392 L1218 438 M1218 392 L1172 438"
          stroke="#92400e"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (
    load === "solenoid" ||
    load === "contactor"
  ) {
    return (
      <g>
        <text
          x="1122"
          y="370"
          fill="#475569"
          fontSize="10"
          fontWeight="700"
        >
          A1
        </text>

        <text
          x="1122"
          y="480"
          fill="#475569"
          fontSize="10"
          fontWeight="700"
        >
          A2
        </text>

        <rect
          x="1140"
          y="360"
          width="110"
          height="115"
          rx="18"
          fill="#ffffff"
          stroke={
            fault
              ? "#ef4444"
              : active
                ? "#2563eb"
                : "#94a3b8"
          }
          strokeWidth="4"
        />

        {[0, 1, 2, 3].map(
          (index) => (
            <path
              key={index}
              d={`M${
                1153 +
                index * 21
              } 410 C${
                1160 +
                index * 21
              } 387 ${
                1168 +
                index * 21
              } 433 ${
                1175 +
                index * 21
              } 410`}
              fill="none"
              stroke={
                active
                  ? "#2563eb"
                  : "#64748b"
              }
              strokeWidth="4"
            />
          ),
        )}

        <motion.rect
          x="1155"
          y="446"
          width="80"
          height="12"
          rx="6"
          fill="#475569"
          animate={{
            x: active
              ? 1171
              : 1155,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 18,
          }}
        />
      </g>
    );
  }

  return (
    <g>
      <circle
        cx="1195"
        cy="415"
        r="58"
        fill="#ffffff"
        stroke={
          fault
            ? "#ef4444"
            : "#2563eb"
        }
        strokeWidth="4"
      />

      <path
        d="M1155 443 A50 50 0 0 1 1235 443"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="12"
        strokeLinecap="round"
      />

      <motion.line
        x1="1195"
        y1="435"
        x2="1195"
        y2="388"
        stroke="#2563eb"
        strokeWidth="5"
        strokeLinecap="round"
        style={{
          transformOrigin:
            "1195px 435px",
        }}
        animate={{
          rotate:
            -70 +
            clamp(
              response,
              0,
              100,
            ) *
              1.4,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 18,
        }}
      />

      <circle
        cx="1195"
        cy="435"
        r="8"
        fill="#2563eb"
      />

      <text
        x="1195"
        y="493"
        textAnchor="middle"
        fill="#475569"
        fontSize="12"
        fontWeight="700"
      >
        {response.toFixed(1)}%
      </text>
    </g>
  );
}

function Canvas({
  mode,
  stage,
  config,
  sample,
  requested,
  selected,
  onSelect,
}: {
  mode: Mode;
  stage: Stage;
  config: Config;
  sample: Sample;
  requested: number;
  selected: NodeId;
  onSelect: (id: NodeId) => void;
}) {
  const powered =
    mode !== "off";

  const digital =
    !isAnalog(
      config.technology,
    );

  const feedbackText =
    digital
      ? sample.feedback >= 0.5
        ? "ON"
        : "OFF"
      : `${sample.feedback.toFixed(
          1,
        )}%`;

  const commandActive =
    sample.driver > 0;

  const terminalActive =
    sample.terminal > 0;

  const currentFlow =
    sample.current > 0;

  const node = (
    id: NodeId,
    active: boolean,
  ) =>
    [
      "fill-white stroke-[3]",

      selected === id
        ? "stroke-blue-600"
        : active
          ? "stroke-blue-400"
          : "stroke-slate-300",
    ].join(" ");

  const commandLine = (
    active: boolean,
  ) =>
    active
      ? "fill-none stroke-blue-600"
      : "fill-none stroke-slate-300";

  const powerLine = (
    active: boolean,
  ) =>
    active
      ? "fill-none stroke-emerald-500"
      : "fill-none stroke-slate-300";

  const feedbackLine = (
    active: boolean,
  ) =>
    active
      ? "fill-none stroke-violet-500"
      : "fill-none stroke-slate-300";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">
            PLC output-module actuator canvas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Blue command · green field power · violet feedback
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
            active={mode === "run"}
            tone="blue"
          >
            {mode === "run"
              ? "AUTO UPDATE"
              : "STOP"}
          </Badge>

          <Badge
            active={
              stage !== "idle"
            }
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
            viewBox="0 0 1380 850"
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto w-full"
            role="img"
            aria-label="PLC output module signal and field-power circuit"
          >
            <defs>
              <pattern
                id="grid"
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
                id="violetArrow"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path
                  d="M0,0 L10,5 L0,10 Z"
                  fill="#8b5cf6"
                />
              </marker>
            </defs>

            <rect
              width="1380"
              height="850"
              fill="url(#grid)"
            />

            <rect
              x="30"
              y="235"
              width="190"
              height="275"
              rx="26"
              fill="#eff6ff"
              stroke="#2563eb"
              strokeWidth="3"
            />

            <text
              x="125"
              y="274"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="17"
              fontWeight="800"
            >
              PLC CPU
            </text>

            <rect
              x="245"
              y="55"
              width="790"
              height="710"
              rx="28"
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth="4"
            />

            <text
              x="278"
              y="95"
              fill="#0f172a"
              fontSize="22"
              fontWeight="800"
            >
              PLC OUTPUT MODULE
            </text>

            <text
              x="278"
              y="121"
              fill="#64748b"
              fontSize="13"
            >
              {TECH[
                config.technology
              ].label}
            </text>

            <rect
              x="1055"
              y="115"
              width="285"
              height="600"
              rx="28"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="3"
            />

            <text
              x="1197"
              y="155"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="17"
              fontWeight="800"
            >
              FIELD ACTUATOR CIRCUIT
            </text>

            <line
              x1="800"
              y1="93"
              x2="838"
              y2="93"
              stroke="#2563eb"
              strokeWidth="5"
            />

            <text
              x="847"
              y="98"
              fill="#475569"
              fontSize="11"
            >
              Command
            </text>

            <line
              x1="908"
              y1="93"
              x2="946"
              y2="93"
              stroke="#10b981"
              strokeWidth="5"
            />

            <text
              x="955"
              y="98"
              fill="#475569"
              fontSize="11"
            >
              Field power
            </text>

            <line
              x1="800"
              y1="116"
              x2="838"
              y2="116"
              stroke="#8b5cf6"
              strokeWidth="4"
              strokeDasharray="8 7"
            />

            <text
              x="847"
              y="121"
              fill="#475569"
              fontSize="11"
            >
              Feedback
            </text>

            {/* CPU command paths */}

            <path
              d="M205 360 H285"
              className={commandLine(
                stage === "receive",
              )}
              strokeWidth="4"
              strokeDasharray={
                stage === "receive"
                  ? "12 9"
                  : undefined
              }
              markerEnd={
                stage === "receive"
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            <path
              d="M395 360 H440"
              className={commandLine(
                stage === "receive",
              )}
              strokeWidth="4"
              strokeDasharray={
                stage === "receive"
                  ? "12 9"
                  : undefined
              }
              markerEnd={
                stage === "receive"
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            <path
              d="M570 360 H615"
              className={commandLine(
                stage === "latch" ||
                  stage === "isolate",
              )}
              strokeWidth="4"
              strokeDasharray={
                stage === "latch" ||
                stage === "isolate"
                  ? "12 9"
                  : undefined
              }
              markerEnd={
                stage === "latch" ||
                stage === "isolate"
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            <path
              d="M745 360 H790"
              className={commandLine(
                stage === "isolate" ||
                  stage === "drive",
              )}
              strokeWidth="4"
              strokeDasharray={
                stage === "isolate" ||
                stage === "drive"
                  ? "12 9"
                  : undefined
              }
              markerEnd={
                stage === "isolate" ||
                stage === "drive"
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            {/* Feedback paths */}

            <path
              d="M1200 555 V665 H815 V595"
              className={feedbackLine(
                stage === "verify",
              )}
              strokeWidth="4"
              strokeDasharray="9 8"
              markerEnd={
                stage === "verify"
                  ? "url(#violetArrow)"
                  : "url(#grayArrow)"
              }
            />

            <path
              d="M735 555 H600"
              className={feedbackLine(
                stage === "verify",
              )}
              strokeWidth="4"
              strokeDasharray="9 8"
              markerEnd={
                stage === "verify"
                  ? "url(#violetArrow)"
                  : "url(#grayArrow)"
              }
            />

            {/* Complete field-power circuit:
                supply → COM → internal driver → OUT → A1 → load → A2 → return */}

            <path
              d="M1110 235 H1060 V420 H1025"
              className={powerLine(
                config.supplyOn,
              )}
              strokeWidth="5"
            />

            <path
              d="M960 420 H920 V390"
              className={powerLine(
                config.supplyOn,
              )}
              strokeWidth="5"
            />

            <path
              d="M920 330 H960"
              className={powerLine(
                terminalActive,
              )}
              strokeWidth="5"
            />

            <path
              d="M1025 330 H1070"
              className={powerLine(
                terminalActive,
              )}
              strokeWidth="5"
            />

            <path
              d="M1090 330 H1125 V365"
              className={powerLine(
                currentFlow,
              )}
              strokeWidth="5"
            />

            <path
              d="M1125 475 V520 H1110 V270"
              className={powerLine(
                currentFlow,
              )}
              strokeWidth="5"
            />

            {config.openCircuit &&
            commandActive ? (
              <g>
                <line
                  x1="1072"
                  y1="320"
                  x2="1088"
                  y2="340"
                  stroke="#ef4444"
                  strokeWidth="4"
                />

                <line
                  x1="1088"
                  y1="320"
                  x2="1072"
                  y2="340"
                  stroke="#ef4444"
                  strokeWidth="4"
                />

                <text
                  x="1080"
                  y="308"
                  textAnchor="middle"
                  fill="#dc2626"
                  fontSize="10"
                  fontWeight="800"
                >
                  OPEN
                </text>
              </g>
            ) : null}

            <SvgNode
              id="cpu"
              active={
                stage === "receive"
              }
              selected={
                selected === "cpu"
              }
              onSelect={onSelect}
            >
              <rect
                x="55"
                y="305"
                width="150"
                height="145"
                rx="18"
                className={node(
                  "cpu",
                  stage === "receive",
                )}
              />

              <text
                x="130"
                y="337"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                OUTPUT IMAGE
              </text>

              <rect
                x="78"
                y="355"
                width="104"
                height="52"
                rx="9"
                fill="#0f172a"
              />

              <text
                x="130"
                y="378"
                textAnchor="middle"
                fill="#86efac"
                fontSize="12"
                fontWeight="700"
              >
                {address(
                  config.technology,
                )}
              </text>

              <text
                x="130"
                y="398"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="12"
              >
                = {requested}
              </text>

              <text
                x="130"
                y="433"
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
              >
                CPU COMMAND
              </text>
            </SvgNode>

            <SvgNode
              id="backplane"
              active={
                stage === "receive"
              }
              selected={
                selected ===
                "backplane"
              }
              onSelect={onSelect}
            >
              <rect
                x="285"
                y="275"
                width="110"
                height="170"
                rx="18"
                className={node(
                  "backplane",
                  stage ===
                    "receive",
                )}
              />

              <text
                x="340"
                y="307"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                BACKPLANE
              </text>

              {[0, 1, 2, 3, 4, 5].map(
                (index) => (
                  <rect
                    key={index}
                    x={
                      310 +
                      (index % 2) *
                        33
                    }
                    y={
                      330 +
                      Math.floor(
                        index / 2,
                      ) *
                        31
                    }
                    width="21"
                    height="15"
                    rx="3"
                    fill={
                      stage ===
                      "receive"
                        ? "#2563eb"
                        : "#cbd5e1"
                    }
                  />
                ),
              )}

              <text
                x="340"
                y="430"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                CPU → MODULE
              </text>
            </SvgNode>

            <SvgNode
              id="latch"
              active={
                stage === "latch"
              }
              selected={
                selected === "latch"
              }
              onSelect={onSelect}
            >
              <rect
                x="440"
                y="275"
                width="130"
                height="170"
                rx="18"
                className={node(
                  "latch",
                  stage === "latch",
                )}
              />

              <text
                x="505"
                y="307"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                OUTPUT LATCH
              </text>

              <rect
                x="463"
                y="330"
                width="84"
                height="62"
                rx="9"
                fill="#eff6ff"
                stroke="#93c5fd"
                strokeWidth="2"
              />

              <text
                x="505"
                y="355"
                textAnchor="middle"
                fill="#1d4ed8"
                fontSize="12"
                fontWeight="700"
              >
                LATCH
              </text>

              <text
                x="505"
                y="380"
                textAnchor="middle"
                fill="#334155"
                fontSize="17"
                fontWeight="800"
              >
                {sample.latched}
              </text>

              <text
                x="505"
                y="428"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                STABLE COMMAND
              </text>
            </SvgNode>

            <SvgNode
              id="isolation"
              active={
                stage === "isolate"
              }
              selected={
                selected ===
                "isolation"
              }
              onSelect={onSelect}
            >
              <rect
                x="615"
                y="275"
                width="130"
                height="170"
                rx="18"
                className={node(
                  "isolation",
                  stage ===
                    "isolate",
                )}
              />

              <text
                x="680"
                y="307"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                ISOLATION
              </text>

              <circle
                cx="655"
                cy="360"
                r="22"
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth="3"
              />

              <path
                d="M643 360 L667 345 V375 Z"
                fill="#dbeafe"
                stroke="#2563eb"
                strokeWidth="2"
              />

              <path
                d="M683 343 L701 331 M683 360 L705 347"
                stroke="#2563eb"
                strokeWidth="3"
              />

              <path
                d="M711 330 V390 M711 360 H730"
                stroke="#2563eb"
                strokeWidth="4"
              />

              <text
                x="680"
                y="428"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                LOGIC / FIELD BARRIER
              </text>
            </SvgNode>

            <SvgNode
              id="driver"
              active={
                stage === "drive"
              }
              selected={
                selected === "driver"
              }
              onSelect={onSelect}
            >
              <rect
                x="790"
                y="255"
                width="150"
                height="210"
                rx="18"
                className={node(
                  "driver",
                  stage === "drive",
                )}
              />

              <text
                x="865"
                y="288"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                OUTPUT DRIVER
              </text>

              {config.technology ===
              "relay" ? (
                <>
                  <circle
                    cx="820"
                    cy="390"
                    r="6"
                    fill="#2563eb"
                  />

                  <circle
                    cx="915"
                    cy="330"
                    r="6"
                    fill="#2563eb"
                  />

                  <motion.line
                    x1="820"
                    y1="390"
                    x2="900"
                    y2="340"
                    stroke="#2563eb"
                    strokeWidth="5"
                    strokeLinecap="round"
                    animate={{
                      rotate:
                        commandActive
                          ? 26
                          : 0,
                    }}
                    style={{
                      transformOrigin:
                        "820px 390px",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                    }}
                  />

                  <text
                    x="865"
                    y="420"
                    textAnchor="middle"
                    fill={
                      commandActive
                        ? "#059669"
                        : "#64748b"
                    }
                    fontSize="10"
                    fontWeight="800"
                  >
                    {commandActive
                      ? "CONTACT CLOSED"
                      : "CONTACT OPEN"}
                  </text>
                </>
              ) : isAnalog(
                  config.technology,
                ) ? (
                <>
                  <path
                    d="M825 390 L865 320 L905 390 Z"
                    fill="#eff6ff"
                    stroke="#2563eb"
                    strokeWidth="4"
                  />

                  <text
                    x="865"
                    y="375"
                    textAnchor="middle"
                    fill="#2563eb"
                    fontSize="14"
                    fontWeight="800"
                  >
                    DAC
                  </text>
                </>
              ) : (
                <>
                  <path
                    d="M825 325 V400 M825 360 H855 L905 325 V400"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="5"
                  />

                  <path
                    d="M858 315 V410"
                    stroke="#64748b"
                    strokeWidth="3"
                  />
                </>
              )}

              <text
                x="865"
                y="445"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="12"
                fontWeight="700"
              >
                {TECH[
                  config.technology
                ].short}
              </text>
            </SvgNode>

            <SvgNode
              id="terminal"
              active={
                stage === "drive" ||
                stage === "verify"
              }
              selected={
                selected ===
                "terminal"
              }
              onSelect={onSelect}
            >
              <rect
                x="960"
                y="270"
                width="65"
                height="190"
                rx="18"
                className={node(
                  "terminal",
                  stage === "drive",
                )}
              />

              <text
                x="992"
                y="297"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="9"
                fontWeight="700"
              >
                TERMINAL
              </text>

              <circle
                cx="992"
                cy="330"
                r="17"
                fill="#ffffff"
                stroke="#64748b"
                strokeWidth="3"
              />

              <circle
                cx="992"
                cy="420"
                r="17"
                fill="#ffffff"
                stroke="#64748b"
                strokeWidth="3"
              />

              <text
                x="992"
                y="335"
                textAnchor="middle"
                fill="#334155"
                fontSize="10"
                fontWeight="700"
              >
                OUT
              </text>

              <text
                x="992"
                y="425"
                textAnchor="middle"
                fill="#334155"
                fontSize="10"
                fontWeight="700"
              >
                COM
              </text>
            </SvgNode>

            <SvgNode
              id="led"
              active={
                sample.driver > 0 ||
                sample.quality ===
                  "fault"
              }
              selected={
                selected === "led"
              }
              onSelect={onSelect}
            >
              <rect
                x="925"
                y="145"
                width="86"
                height="76"
                rx="16"
                className={node(
                  "led",
                  sample.driver > 0,
                )}
              />

              <text
                x="968"
                y="171"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="10"
                fontWeight="700"
              >
                OUTPUT LED
              </text>

              <motion.circle
                cx="968"
                cy="194"
                r="11"
                fill={
                  sample.quality ===
                  "fault"
                    ? "#ef4444"
                    : sample.driver > 0
                      ? "#10b981"
                      : "#e2e8f0"
                }
                stroke={
                  sample.quality ===
                  "fault"
                    ? "#dc2626"
                    : sample.driver > 0
                      ? "#059669"
                      : "#94a3b8"
                }
                strokeWidth="3"
                animate={
                  sample.quality ===
                  "fault"
                    ? {
                        opacity: [
                          0.35,
                          1,
                          0.35,
                        ],
                      }
                    : {
                        opacity: 1,
                      }
                }
                transition={{
                  duration: 0.7,

                  repeat:
                    sample.quality ===
                    "fault"
                      ? Number.POSITIVE_INFINITY
                      : 0,
                }}
              />

              <text
                x="968"
                y="216"
                textAnchor="middle"
                fill="#475569"
                fontSize="9"
                fontWeight="700"
              >
                {address(
                  config.technology,
                )}
              </text>
            </SvgNode>

            <SvgNode
              id="protection"
              active={
                sample.protectionTripped
              }
              selected={
                selected ===
                "protection"
              }
              onSelect={onSelect}
            >
              <rect
                x="315"
                y="515"
                width="190"
                height="115"
                rx="18"
                className={node(
                  "protection",
                  sample.protectionTripped,
                )}
              />

              <text
                x="410"
                y="548"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                OUTPUT PROTECTION
              </text>

              <path
                d="M345 585 H370 L382 557 L394 610 L406 585 H445"
                fill="none"
                stroke={
                  sample.protectionTripped
                    ? "#ef4444"
                    : "#2563eb"
                }
                strokeWidth="4"
              />

              <text
                x="470"
                y="589"
                textAnchor="middle"
                fill={
                  sample.protectionTripped
                    ? "#dc2626"
                    : "#059669"
                }
                fontSize="10"
                fontWeight="800"
              >
                {sample.protectionTripped
                  ? "TRIPPED"
                  : "READY"}
              </text>
            </SvgNode>

            <SvgNode
              id="diagnostics"
              active={
                stage === "verify" ||
                sample.quality ===
                  "fault"
              }
              selected={
                selected ===
                "diagnostics"
              }
              onSelect={onSelect}
            >
              <rect
                x="535"
                y="515"
                width="180"
                height="115"
                rx="18"
                className={node(
                  "diagnostics",
                  sample.quality ===
                    "fault",
                )}
              />

              <text
                x="625"
                y="548"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                DIAGNOSTICS
              </text>

              <text
                x="625"
                y="586"
                textAnchor="middle"
                fill={
                  sample.quality ===
                  "good"
                    ? "#059669"
                    : sample.quality ===
                        "fault"
                      ? "#dc2626"
                      : "#d97706"
                }
                fontSize="18"
                fontWeight="800"
              >
                {sample.quality.toUpperCase()}
              </text>

              <text
                x="625"
                y="611"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                SUPPLY · CURRENT · FEEDBACK
              </text>
            </SvgNode>

            <SvgNode
              id="feedback"
              active={
                stage === "verify"
              }
              selected={
                selected ===
                "feedback"
              }
              onSelect={onSelect}
            >
              <rect
                x="750"
                y="515"
                width="150"
                height="115"
                rx="18"
                className={node(
                  "feedback",
                  stage === "verify",
                )}
              />

              <text
                x="825"
                y="548"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                FEEDBACK
              </text>

              <text
                x="825"
                y="586"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="19"
                fontWeight="800"
              >
                {feedbackText}
              </text>

              <text
                x="825"
                y="611"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                ACTUAL RESPONSE
              </text>
            </SvgNode>

            <SvgNode
              id="supply"
              active={
                config.supplyOn
              }
              selected={
                selected === "supply"
              }
              onSelect={onSelect}
            >
              <rect
                x="1090"
                y="175"
                width="220"
                height="100"
                rx="18"
                className={node(
                  "supply",
                  config.supplyOn,
                )}
              />

              <text
                x="1200"
                y="208"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                FIELD SUPPLY
              </text>

              <text
                x="1200"
                y="244"
                textAnchor="middle"
                fill={
                  config.supplyOn
                    ? "#2563eb"
                    : "#dc2626"
                }
                fontSize="20"
                fontWeight="800"
              >
                {config.supplyOn
                  ? isAnalog(
                      config.technology,
                    )
                    ? "CHANNEL POWER"
                    : config.supply
                  : "OFF"}
              </text>

              <text
                x="1107"
                y="239"
                fill="#059669"
                fontSize="10"
                fontWeight="800"
              >
                +
              </text>

              <text
                x="1107"
                y="268"
                fill="#475569"
                fontSize="10"
                fontWeight="800"
              >
                0V/N
              </text>
            </SvgNode>

            <SvgNode
              id="actuator"
              active={
                sample.response > 1 ||
                stage === "verify"
              }
              selected={
                selected ===
                "actuator"
              }
              onSelect={onSelect}
            >
              <rect
                x="1090"
                y="315"
                width="220"
                height="245"
                rx="22"
                className={node(
                  "actuator",
                  sample.response > 1,
                )}
              />

              <text
                x="1200"
                y="347"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="700"
              >
                {LOADS[
                  config.load
                ].label}
              </text>

              <Actuator
                load={config.load}
                response={
                  sample.response
                }
                fault={
                  sample.quality ===
                  "fault"
                }
              />

              <text
                x="1200"
                y="535"
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
              >
                RESPONSE{" "}
                {sample.response.toFixed(
                  1,
                )}
                %
              </text>
            </SvgNode>

            <text
              x="1197"
              y="610"
              textAnchor="middle"
              fill="#334155"
              fontSize="12"
              fontWeight="700"
            >
              Terminal:{" "}
              {signalText(
                config.technology,
                sample.terminal,
                config.supply,
              )}
            </text>

            <text
              x="1197"
              y="636"
              textAnchor="middle"
              fill="#334155"
              fontSize="12"
              fontWeight="700"
            >
              Load input:{" "}
              {signalText(
                config.technology,
                sample.loadInput,
                config.supply,
              )}
            </text>

            <text
              x="1197"
              y="662"
              textAnchor="middle"
              fill="#334155"
              fontSize="12"
              fontWeight="700"
            >
              Current:{" "}
              {sample.current.toFixed(
                3,
              )}{" "}
              A
            </text>

            <AnimatePresence>
              {stage === "receive" ? (
                <>
                  <motion.circle
                    key="receive-one"
                    r="7"
                    fill="#2563eb"
                    initial={{
                      cx: 205,
                      cy: 360,
                      opacity: 0,
                    }}
                    animate={{
                      cx: [205, 285],
                      cy: [360, 360],
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
                    key="receive-two"
                    r="7"
                    fill="#2563eb"
                    initial={{
                      cx: 395,
                      cy: 360,
                      opacity: 0,
                    }}
                    animate={{
                      cx: [395, 440],
                      cy: [360, 360],
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
                      delay: 0.15,
                    }}
                  />
                </>
              ) : null}

              {stage === "latch" ? (
                <motion.circle
                  key="latch-packet"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 440,
                    cy: 360,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [440, 570],
                    cy: [360, 360],
                    opacity: [0, 1, 0],
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.9,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              ) : null}

              {stage === "isolate" ? (
                <motion.circle
                  key="isolation-packet"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 570,
                    cy: 360,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [
                      570,
                      615,
                      745,
                    ],
                    cy: [
                      360,
                      360,
                      360,
                    ],
                    opacity: [0, 1, 0],
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

              {stage === "drive" ? (
                <>
                  <motion.circle
                    key="drive-command"
                    r="7"
                    fill="#2563eb"
                    initial={{
                      cx: 745,
                      cy: 360,
                      opacity: 0,
                    }}
                    animate={{
                      cx: [
                        745,
                        790,
                        940,
                      ],
                      cy: [
                        360,
                        360,
                        360,
                      ],
                      opacity: [0, 1, 0],
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

                  {currentFlow ? (
                    <motion.circle
                      key="field-power"
                      r="7"
                      fill="#10b981"
                      initial={{
                        cx: 1110,
                        cy: 235,
                        opacity: 0,
                      }}
                      animate={{
                        cx: [
                          1110,
                          1060,
                          1025,
                          960,
                          920,
                          960,
                          1025,
                          1070,
                          1090,
                          1125,
                        ],

                        cy: [
                          235,
                          235,
                          420,
                          420,
                          390,
                          330,
                          330,
                          330,
                          330,
                          365,
                        ],

                        opacity: [
                          0,
                          1,
                          1,
                          1,
                          1,
                          1,
                          1,
                          1,
                          1,
                          0,
                        ],
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        duration: 1.8,
                        repeat:
                          Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  ) : null}
                </>
              ) : null}

              {stage === "verify" ? (
                <motion.circle
                  key="feedback-packet"
                  r="7"
                  fill="#8b5cf6"
                  initial={{
                    cx: 1200,
                    cy: 555,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [
                      1200,
                      1200,
                      815,
                      815,
                      735,
                      600,
                    ],

                    cy: [
                      555,
                      665,
                      665,
                      595,
                      555,
                      555,
                    ],

                    opacity: [
                      0,
                      1,
                      1,
                      1,
                      1,
                      0,
                    ],
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              ) : null}
            </AnimatePresence>

            <text
              x="690"
              y="815"
              textAnchor="middle"
              fill="#64748b"
              fontSize="12"
            >
              Relay path: field supply → COM → relay contact → OUT → A1 → coil → A2 → 0 V/N.
            </text>
          </svg>
        </div>

        {!powered ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-4 backdrop-blur-[1px]">
            <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-mono text-sm font-bold text-blue-700">
                DO/AO
              </div>

              <p className="mt-3 font-semibold">
                Output module power is OFF
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Power the module, set a command, and transfer the output.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function PlcOutputModulePage() {
  const [
    mode,
    setMode,
  ] = useState<Mode>("off");

  const [
    stage,
    setStage,
  ] = useState<Stage>("idle");

  const [
    busy,
    setBusy,
  ] = useState(false);

  const [
    technology,
    setTechnology,
  ] =
    useState<Technology>(
      "relay",
    );

  const [
    digitalCommand,
    setDigitalCommand,
  ] = useState(true);

  const [
    analogCommand,
    setAnalogCommand,
  ] = useState(50);

  const [
    load,
    setLoad,
  ] =
    useState<Load>(
      "contactor",
    );

  const [
    supply,
    setSupply,
  ] =
    useState<Supply>(
      "24VDC",
    );

  const [
    supplyOn,
    setSupplyOn,
  ] = useState(true);

  const [
    openCircuit,
    setOpenCircuit,
  ] = useState(false);

  const [
    overload,
    setOverload,
  ] = useState(false);

  const [
    stuckOutput,
    setStuckOutput,
  ] = useState(false);

  const [
    cycleMs,
    setCycleMs,
  ] = useState(2400);

  const [
    sample,
    setSample,
  ] =
    useState<Sample>(
      INITIAL,
    );

  const [
    transfers,
    setTransfers,
  ] = useState(0);

  const [
    selected,
    setSelected,
  ] =
    useState<NodeId>(
      "driver",
    );

  const modeRef =
    useRef<Mode>(mode);

  const busyRef =
    useRef(false);

  const abortRef =
    useRef(0);

  const configRef =
    useRef<Config>({
      technology,
      digitalCommand,
      analogCommand,
      load,
      supply,
      supplyOn,
      openCircuit,
      overload,
      stuckOutput,
      cycleMs,
    });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    configRef.current = {
      technology,
      digitalCommand,
      analogCommand,
      load,
      supply,
      supplyOn,
      openCircuit,
      overload,
      stuckOutput,
      cycleMs,
    };
  }, [
    technology,
    digitalCommand,
    analogCommand,
    load,
    supply,
    supplyOn,
    openCircuit,
    overload,
    stuckOutput,
    cycleMs,
  ]);

  const config =
    useMemo<Config>(
      () => ({
        technology,
        digitalCommand,
        analogCommand,
        load,
        supply,
        supplyOn,
        openCircuit,
        overload,
        stuckOutput,
        cycleMs,
      }),

      [
        technology,
        digitalCommand,
        analogCommand,
        load,
        supply,
        supplyOn,
        openCircuit,
        overload,
        stuckOutput,
        cycleMs,
      ],
    );

  const requested =
    commandOf(config);

  const digital =
    !isAnalog(technology);

  const stageInfo =
    STAGES[stage];

  const selectedInfo =
    NODE_INFO[selected];

  const compatibilityMessage =
    useMemo(
      () =>
        compatibility(config),

      [config],
    );

  const feedbackText =
    digital
      ? sample.feedback >= 0.5
        ? "ON"
        : "OFF"
      : `${sample.feedback.toFixed(
          1,
        )}%`;

  const transfer =
    useCallback(
      async () => {
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
          abortRef.current;

        const current = {
          ...configRef.current,
        };

        const command =
          commandOf(current);

        const stepMs =
          Math.max(
            160,

            Math.round(
              current.cycleMs /
                5,
            ),
          );

        const valid = () =>
          token ===
            abortRef.current &&
          modeRef.current !==
            "off";

        try {
          /*
           * Stage 1: CPU output image reaches the module.
           *
           * The previous channel quality is not changed here.
           * This prevents a normal automatic transfer from
           * incorrectly displaying WARNING.
           */
          setStage("receive");

          setSample(
            (old) => ({
              ...old,
              outputImage:
                command,

              diagnostic:
                "The CPU output image is moving through the backplane.",
            }),
          );

          await wait(stepMs);

          if (!valid()) {
            return false;
          }

          setStage("latch");

          setSample(
            (old) => ({
              ...old,
              latched: command,

              diagnostic:
                "The output register latched a stable command.",
            }),
          );

          await wait(stepMs);

          if (!valid()) {
            return false;
          }

          setStage("isolate");

          setSample(
            (old) => ({
              ...old,
              isolated:
                command,

              diagnostic:
                "The command crossed the isolation barrier.",
            }),
          );

          await wait(stepMs);

          if (!valid()) {
            return false;
          }

          /*
           * Apply the provisional field result during the drive stage
           * so the actuator and green power path move immediately.
           *
           * Keep the previous verified quality until diagnostics
           * completes in the verify stage.
           */
          setStage("drive");

          const preview =
            evaluate(
              current,
              command,
            );

          setSample(
            (old) => ({
              ...old,
              driver: command,
              ...preview,

              quality:
                old.quality,

              diagnostic:
                "The output driver is applying the field command.",
            }),
          );

          await wait(stepMs);

          if (!valid()) {
            return false;
          }

          setStage("verify");

          const result =
            evaluate(
              current,
              command,
            );

          setSample({
            outputImage:
              command,

            latched:
              command,

            isolated:
              command,

            driver:
              command,

            ...result,
          });

          setTransfers(
            (value) =>
              value + 1,
          );

          await wait(stepMs);

          if (!valid()) {
            return false;
          }

          setStage("idle");

          return true;
        } finally {
          if (
            token ===
            abortRef.current
          ) {
            busyRef.current =
              false;

            setBusy(false);
          }
        }
      },

      [],
    );

  useEffect(() => {
    if (mode !== "run") {
      return;
    }

    let cancelled = false;

    const loop =
      async () => {
        while (
          !cancelled &&
          modeRef.current ===
            "run"
        ) {
          await transfer();

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
  }, [mode, transfer]);

  const power = () => {
    if (
      modeRef.current !==
      "off"
    ) {
      abortRef.current += 1;
      busyRef.current = false;
      modeRef.current = "off";

      setMode("off");
      setBusy(false);
      setStage("idle");

      setSample({
        ...INITIAL,

        diagnostic:
          "Module power is OFF. The field output is de-energized.",
      });

      return;
    }

    modeRef.current =
      "stop";

    setMode("stop");

    setSample(
      (old) => ({
        ...old,
        quality: "pending",

        diagnostic:
          "Module powered. Transfer the command to verify the field output.",
      }),
    );
  };

  const run = () => {
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
      abortRef.current += 1;
      busyRef.current = false;
      modeRef.current = "stop";

      setMode("stop");
      setBusy(false);
      setStage("idle");

      return;
    }

    modeRef.current = "run";
    setMode("run");
  };

  const reset = () => {
    abortRef.current += 1;
    busyRef.current = false;
    modeRef.current = "off";

    setMode("off");
    setStage("idle");
    setBusy(false);

    setTechnology("relay");
    setDigitalCommand(true);
    setAnalogCommand(50);
    setLoad("contactor");
    setSupply("24VDC");
    setSupplyOn(true);
    setOpenCircuit(false);
    setOverload(false);
    setStuckOutput(false);
    setCycleMs(2400);
    setSample(INITIAL);
    setTransfers(0);
    setSelected("driver");
  };

  const changeTechnology = (
    next: Technology,
  ) => {
    abortRef.current += 1;
    busyRef.current = false;

    if (
      modeRef.current ===
      "run"
    ) {
      modeRef.current =
        "stop";

      setMode("stop");
    }

    setBusy(false);
    setStage("idle");
    setTechnology(next);

    if (next === "relay") {
      setSupply("24VDC");
      setLoad("contactor");
    }

    if (
      next ===
      "transistor"
    ) {
      setSupply("24VDC");
      setLoad("solenoid");
    }

    if (next === "triac") {
      setSupply("120VAC");
      setLoad("lamp");
    }

    if (
      next ===
      "analogVoltage"
    ) {
      setSupply("24VDC");
      setLoad("vfd");
    }

    if (
      next ===
      "analogCurrent"
    ) {
      setSupply("24VDC");
      setLoad("valve");
    }

    setSample({
      ...INITIAL,

      diagnostic:
        "Technology changed. Transfer the command to update the channel.",
    });
  };

  const qualityStyle =
    sample.quality === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : sample.quality ===
          "fault"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-white px-3 py-4 text-slate-900 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1650px]">
          <header className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    active={
                      mode !== "off"
                    }
                    tone="green"
                  >
                    {mode !== "off"
                      ? "POWER ON"
                      : "POWER OFF"}
                  </Badge>

                  <Badge
                    active={
                      mode === "run"
                    }
                    tone="blue"
                  >
                    {mode === "run"
                      ? "AUTO UPDATE"
                      : "MODULE STOPPED"}
                  </Badge>

                  <Badge
                    active={busy}
                    tone="amber"
                  >
                    {busy
                      ? stage.toUpperCase()
                      : "READY"}
                  </Badge>
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  PLC Output Module Interactive Simulator
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                  Follow the command from CPU memory through the module and complete actuator field circuit.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Metric
                  label="Mode"
                  value={
                    mode.toUpperCase()
                  }
                  helper="Module operating state"
                />

                <Metric
                  label="Technology"
                  value={
                    TECH[
                      technology
                    ].short
                  }
                  helper={
                    digital
                      ? "Digital output"
                      : "Analog output"
                  }
                />

                <Metric
                  label="CPU command"
                  value={requested}
                  helper={address(
                    technology,
                  )}
                />

                <Metric
                  label="Field output"
                  value={signalText(
                    technology,
                    sample.terminal,
                    supply,
                  )}
                  helper={`${sample.response.toFixed(
                    1,
                  )}% response`}
                />
              </div>
            </div>
          </header>

          <div className="grid gap-5 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-4 md:sticky md:top-4 md:self-start">
              <Card
                title="Module controls"
                description="Power and update the output channel."
              >
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    type="button"
                    onClick={power}
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      mode !== "off"
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
                    {mode !== "off"
                      ? "Power OFF"
                      : "Power ON"}
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={
                      mode === "off"
                    }
                    onClick={run}
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      mode === "off"
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : mode === "run"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-emerald-600 bg-emerald-600 text-white",
                    ].join(" ")}
                  >
                    {mode === "run"
                      ? "Stop Update"
                      : "Auto Update"}
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={
                      mode === "off" ||
                      mode === "run" ||
                      busy
                    }
                    onClick={() =>
                      void transfer()
                    }
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      mode === "off" ||
                      mode === "run" ||
                      busy
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : "border-violet-200 bg-violet-50 text-violet-700",
                    ].join(" ")}
                  >
                    Single Transfer
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={reset}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700"
                  >
                    Reset
                  </motion.button>
                </div>
              </Card>

              <Card
                title="Output technology"
                description="Select the module driver."
              >
                <select
                  value={technology}
                  disabled={
                    busy ||
                    mode === "run"
                  }
                  onChange={(
                    event,
                  ) =>
                    changeTechnology(
                      event.target
                        .value as Technology,
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:bg-slate-100"
                >
                  <option value="relay">
                    Relay output
                  </option>

                  <option value="transistor">
                    24 VDC transistor
                  </option>

                  <option value="triac">
                    120 VAC triac
                  </option>

                  <option value="analogVoltage">
                    0–10 V analog
                  </option>

                  <option value="analogCurrent">
                    4–20 mA analog
                  </option>
                </select>

                <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                  {
                    TECH[
                      technology
                    ].help
                  }
                </p>
              </Card>

              <Card
                title="CPU command"
                description="Set the output-process-image value."
              >
                {digital ? (
                  <Toggle
                    checked={
                      digitalCommand
                    }
                    disabled={
                      mode === "off"
                    }
                    label="Digital output"
                    description={`${address(
                      technology,
                    )} = ${
                      digitalCommand
                        ? 1
                        : 0
                    }`}
                    onChange={() =>
                      setDigitalCommand(
                        (value) =>
                          !value,
                      )
                    }
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="flex justify-between">
                      <label
                        htmlFor="analog-command"
                        className="text-sm font-semibold"
                      >
                        Analog command
                      </label>

                      <span className="font-mono text-blue-700">
                        {analogCommand}%
                      </span>
                    </div>

                    <input
                      id="analog-command"
                      type="range"
                      min={0}
                      max={100}
                      value={
                        analogCommand
                      }
                      disabled={
                        mode === "off"
                      }
                      onChange={(
                        event,
                      ) =>
                        setAnalogCommand(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="mt-4 w-full accent-blue-600"
                    />
                  </div>
                )}
              </Card>

              <Card
                title="Field circuit"
                description="Configure supply and actuator."
              >
                <div className="space-y-3">
                  <Toggle
                    checked={supplyOn}
                    disabled={
                      mode === "off"
                    }
                    label="Field supply"
                    description={
                      supplyOn
                        ? "Supply available"
                        : "Supply missing"
                    }
                    onChange={() =>
                      setSupplyOn(
                        (value) =>
                          !value,
                      )
                    }
                  />

                  {digital ? (
                    <select
                      value={supply}
                      disabled={
                        mode === "run" ||
                        busy
                      }
                      onChange={(
                        event,
                      ) =>
                        setSupply(
                          event.target
                            .value as Supply,
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                    >
                      <option value="24VDC">
                        24 VDC
                      </option>

                      <option value="120VAC">
                        120 VAC
                      </option>
                    </select>
                  ) : null}

                  <select
                    value={load}
                    disabled={
                      mode === "run" ||
                      busy
                    }
                    onChange={(
                      event,
                    ) =>
                      setLoad(
                        event.target
                          .value as Load,
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                  >
                    <optgroup label="Digital">
                      <option value="lamp">
                        Indicator lamp
                      </option>

                      <option value="solenoid">
                        Solenoid valve coil
                      </option>

                      <option value="contactor">
                        Motor contactor coil
                      </option>
                    </optgroup>

                    <optgroup label="Analog">
                      <option value="valve">
                        Valve positioner
                      </option>

                      <option value="vfd">
                        VFD reference
                      </option>
                    </optgroup>
                  </select>

                  {compatibilityMessage ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                      {
                        compatibilityMessage
                      }
                    </p>
                  ) : (
                    <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                      Technology, supply, and load are compatible.
                    </p>
                  )}
                </div>
              </Card>

              <Card title="Fault simulation">
                <div className="space-y-3">
                  <Toggle
                    checked={
                      openCircuit
                    }
                    disabled={
                      mode === "off"
                    }
                    label="Open circuit"
                    description="Break OUT-to-A1 wiring."
                    onChange={() =>
                      setOpenCircuit(
                        (value) =>
                          !value,
                      )
                    }
                  />

                  <Toggle
                    checked={overload}
                    disabled={
                      mode === "off"
                    }
                    label="Overload"
                    description="Trip output protection."
                    onChange={() =>
                      setOverload(
                        (value) =>
                          !value,
                      )
                    }
                  />

                  <Toggle
                    checked={
                      stuckOutput
                    }
                    disabled={
                      mode === "off"
                    }
                    label="Stuck output"
                    description="Force maximum field output."
                    onChange={() =>
                      setStuckOutput(
                        (value) =>
                          !value,
                      )
                    }
                  />
                </div>
              </Card>

              <Card title="Teaching speed">
                <div className="flex justify-between">
                  <label
                    htmlFor="speed"
                    className="text-sm"
                  >
                    Full transfer
                  </label>

                  <span className="font-mono text-sm text-blue-700">
                    {cycleMs} ms
                  </span>
                </div>

                <input
                  id="speed"
                  type="range"
                  min={1200}
                  max={5000}
                  step={100}
                  value={cycleMs}
                  onChange={(
                    event,
                  ) =>
                    setCycleMs(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="mt-4 w-full accent-blue-600"
                />
              </Card>
            </aside>

            <section className="min-w-0 space-y-5">
              <Canvas
                mode={mode}
                stage={stage}
                config={config}
                sample={sample}
                requested={requested}
                selected={selected}
                onSelect={
                  setSelected
                }
              />

              <Card
                title="Output transfer sequence"
                description="The channel completes five stages."
              >
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full bg-blue-600"
                    animate={{
                      width: `${stageInfo.progress}%`,
                    }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-5">
                  {(
                    [
                      "receive",
                      "latch",
                      "isolate",
                      "drive",
                      "verify",
                    ] as const
                  ).map(
                    (
                      item,
                      index,
                    ) => (
                      <div
                        key={item}
                        className={[
                          "rounded-xl border p-3",

                          stage === item
                            ? "border-blue-300 bg-blue-50"
                            : "border-slate-200",
                        ].join(" ")}
                      >
                        <div className="flex justify-between">
                          <span
                            className={[
                              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",

                              stage ===
                              item
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500",
                            ].join(
                              " ",
                            )}
                          >
                            {index + 1}
                          </span>

                          <Lamp
                            active={
                              stage ===
                              item
                            }
                          />
                        </div>

                        <p className="mt-3 text-sm font-semibold">
                          {
                            STAGES[
                              item
                            ].title.split(
                              ". ",
                            )[1]
                          }
                        </p>
                      </div>
                    ),
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

                    <p className="mt-1 text-sm text-blue-800">
                      {stageInfo.text}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Card>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                <Card
                  title="Selected component"
                  description="Click a block in the canvas."
                >
                  <Badge
                    active
                    tone="blue"
                  >
                    {selectedInfo.title}
                  </Badge>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {selectedInfo.text}
                  </p>
                </Card>

                <Card title="Channel result">
                  <div className="space-y-3">
                    <div className="rounded-xl border p-3">
                      <p className="text-xs uppercase text-slate-500">
                        Terminal
                      </p>

                      <p className="mt-1 font-mono text-xl font-bold">
                        {signalText(
                          technology,
                          sample.terminal,
                          supply,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border p-3">
                      <p className="text-xs uppercase text-slate-500">
                        Feedback
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {feedbackText}
                      </p>
                    </div>

                    <div
                      className={[
                        "rounded-xl border p-3",
                        qualityStyle,
                      ].join(" ")}
                    >
                      <p className="text-xs uppercase">
                        Quality
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {sample.quality ===
                        "fault"
                          ? "Fault"
                          : sample.quality ===
                              "good"
                            ? "Good"
                            : "Pending"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card title="CPU and latch">
                  <p className="flex justify-between text-sm">
                    <span>
                      Output image
                    </span>

                    <strong>
                      {
                        sample.outputImage
                      }
                    </strong>
                  </p>

                  <p className="mt-3 flex justify-between text-sm">
                    <span>Latched</span>

                    <strong>
                      {sample.latched}
                    </strong>
                  </p>
                </Card>

                <Card title="Driver">
                  <p className="flex justify-between text-sm">
                    <span>Isolated</span>

                    <strong>
                      {sample.isolated}
                    </strong>
                  </p>

                  <p className="mt-3 flex justify-between text-sm">
                    <span>Driver</span>

                    <strong>
                      {sample.driver}
                    </strong>
                  </p>
                </Card>

                <Card title="Field circuit">
                  <p className="flex justify-between gap-3 text-sm">
                    <span>
                      Load input
                    </span>

                    <strong>
                      {signalText(
                        technology,
                        sample.loadInput,
                        supply,
                      )}
                    </strong>
                  </p>

                  <p className="mt-3 flex justify-between text-sm">
                    <span>Current</span>

                    <strong>
                      {sample.current.toFixed(
                        3,
                      )}{" "}
                      A
                    </strong>
                  </p>
                </Card>

                <Card title="Feedback">
                  <p className="flex justify-between text-sm">
                    <span>Actual</span>

                    <strong>
                      {feedbackText}
                    </strong>
                  </p>

                  <p className="mt-3 flex justify-between text-sm">
                    <span>Transfers</span>

                    <strong>
                      {transfers}
                    </strong>
                  </p>
                </Card>
              </div>

              <Card title="Output diagnostics">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div
                    className={[
                      "rounded-xl border p-4",
                      qualityStyle,
                    ].join(" ")}
                  >
                    <p className="font-semibold">
                      {sample.quality.toUpperCase()}
                    </p>

                    <p className="mt-1 text-sm leading-6">
                      {sample.diagnostic}
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl border p-4">
                    <Lamp
                      active={
                        sample.quality ===
                        "good"
                      }
                      label="Channel healthy"
                    />

                    <Lamp
                      active={
                        sample.quality ===
                        "fault"
                      }
                      danger
                      label="Channel fault"
                    />

                    <Lamp
                      active={
                        sample.protectionTripped
                      }
                      danger
                      label="Protection tripped"
                    />
                  </div>
                </div>
              </Card>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <strong>
                  Teaching-model note:
                </strong>{" "}
                use the real module datasheet for ratings, leakage current, protection, diagnostics, and wiring.
              </div>
            </section>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}