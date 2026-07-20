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

type ModuleMode = "off" | "stop" | "run";

type InputType = "digital" | "analog";

type ReadStage =
  | "idle"
  | "receive"
  | "protect"
  | "condition"
  | "convert"
  | "store";

type Quality =
  | "good"
  | "bad"
  | "uncertain";

type EngineeringRange =
  | "percent"
  | "temperature"
  | "pressure";

type ComponentId =
  | "fieldDevice"
  | "terminal"
  | "protection"
  | "conditioning"
  | "isolation"
  | "conversion"
  | "register"
  | "diagnostics"
  | "statusLed"
  | "backplane";

type SignalSample = {
  rawSignal: number;
  protectedSignal: number;
  filteredSignal: number;
  convertedValue: number;
  processImage: number;
  engineeringValue: number;
  quality: Quality;
  diagnostic: string;
};

type InputConfiguration = {
  inputType: InputType;
  digitalVoltage: number;
  analogCurrent: number;
  engineeringRange: EngineeringRange;
  openWire: boolean;
  electricalNoise: boolean;
  lineMonitoring: boolean;
  filterStrength: number;
  cycleDuration: number;
};

/* =========================================================
   CONSTANTS
========================================================= */

const DIGITAL_ON_THRESHOLD = 15;

/*
 * This vendor-neutral learning model uses a 12-bit ADC.
 * Actual PLC modules may use different resolutions and
 * different raw-data representations.
 */
const ADC_MAX_COUNT = 4095;

const INITIAL_SAMPLE: SignalSample = {
  rawSignal: 0,
  protectedSignal: 0,
  filteredSignal: 0,
  convertedValue: 0,
  processImage: 0,
  engineeringValue: 0,
  quality: "bad",
  diagnostic: "Module is powered off.",
};

const STAGE_INFORMATION: Record<
  ReadStage,
  {
    number: number;
    title: string;
    shortTitle: string;
    description: string;
    progress: number;
  }
> = {
  idle: {
    number: 0,
    title: "Input module ready",
    shortTitle: "Idle",
    description:
      "Power the module and perform an input read to observe the internal signal path.",
    progress: 0,
  },

  receive: {
    number: 1,
    title: "Receive the field signal",
    shortTitle: "Receive",
    description:
      "The input terminal receives voltage or current from the connected field device.",
    progress: 20,
  },

  protect: {
    number: 2,
    title: "Protect the input electronics",
    shortTitle: "Protect",
    description:
      "Current limiting, reverse-polarity protection and transient suppression protect the module electronics.",
    progress: 40,
  },

  condition: {
    number: 3,
    title: "Condition and isolate the signal",
    shortTitle: "Condition",
    description:
      "The signal is filtered, normalized and electrically isolated from the PLC logic side.",
    progress: 60,
  },

  convert: {
    number: 4,
    title: "Convert the electrical signal",
    shortTitle: "Convert",
    description:
      "A digital channel applies a voltage threshold. An analog channel uses an ADC and engineering scaling.",
    progress: 80,
  },

  store: {
    number: 5,
    title: "Store the CPU-visible value",
    shortTitle: "Store",
    description:
      "The converted value and diagnostic quality are stored in the input register for the CPU.",
    progress: 100,
  },
};

const COMPONENT_INFORMATION: Record<
  ComponentId,
  {
    title: string;
    description: string;
    points: string[];
  }
> = {
  fieldDevice: {
    title: "Field Device",
    description:
      "The field device converts a physical machine condition into an electrical signal.",
    points: [
      "Digital examples include push buttons and proximity sensors.",
      "Analog examples include pressure, level and temperature transmitters.",
      "The field device is outside the PLC input module.",
    ],
  },

  terminal: {
    title: "Input Terminal Block",
    description:
      "The terminal block connects the external field wiring to the input-module electronics.",
    points: [
      "Provides signal and common or reference connections.",
      "Must match the module wiring type and voltage or current range.",
      "Loose or broken wiring can produce missing or unstable signals.",
    ],
  },

  protection: {
    title: "Protection Circuit",
    description:
      "The protection stage limits damaging current and suppresses short electrical transients.",
    points: [
      "May include resistors, fuses and transient suppressors.",
      "Protects against reverse polarity on supported module designs.",
      "Clamps the teaching signal to the accepted input range.",
    ],
  },

  conditioning: {
    title: "Signal Conditioning",
    description:
      "Signal conditioning filters electrical noise and prepares the signal for reliable conversion.",
    points: [
      "Digital channels may use filtering and debounce delays.",
      "Analog channels may use precision resistors and amplifiers.",
      "Filtering reduces rapid changes but also adds response delay.",
    ],
  },

  isolation: {
    title: "Electrical Isolation",
    description:
      "Isolation separates the field-side circuit from the PLC logic-side electronics.",
    points: [
      "Reduces the effect of ground-potential differences.",
      "Helps prevent field faults from reaching the CPU-side electronics.",
      "May use optocouplers or isolated amplifier circuits.",
    ],
  },

  conversion: {
    title: "Signal Conversion",
    description:
      "The conversion stage turns the conditioned electrical signal into a CPU-readable value.",
    points: [
      "Digital conversion compares voltage with an ON threshold.",
      "Analog conversion samples the signal with an ADC.",
      "The analog raw count is scaled into an engineering value.",
    ],
  },

  register: {
    title: "Input Register",
    description:
      "The input register stores the converted channel value until the PLC CPU reads it.",
    points: [
      "A digital channel appears as a Boolean input bit.",
      "An analog channel normally appears as a numeric input word.",
      "The stored value represents the last completed module conversion.",
    ],
  },

  diagnostics: {
    title: "Channel Diagnostics",
    description:
      "Diagnostic logic evaluates signal range, wiring faults and channel quality.",
    points: [
      "An analog value below the valid live-zero range can indicate an open wire.",
      "A normal digital channel may not distinguish OFF from an open wire.",
      "Digital line monitoring requires suitable hardware and field wiring.",
    ],
  },

  statusLed: {
    title: "Channel Status LED",
    description:
      "The front-panel indicator gives a quick visual indication of input or fault state.",
    points: [
      "A digital LED commonly follows the detected ON state.",
      "An analog LED may indicate channel health rather than signal magnitude.",
      "Exact indicator behavior depends on the PLC module design.",
    ],
  },

  backplane: {
    title: "Backplane Interface",
    description:
      "The backplane interface transfers input values and diagnostic data to the PLC CPU.",
    points: [
      "Provides the module-to-CPU data path.",
      "Transfers channel status and diagnostic information.",
      "May be a local rack bus or a distributed-I/O network.",
    ],
  },
};

const ENGINEERING_RANGES: Record<
  EngineeringRange,
  {
    title: string;
    maximum: number;
    unit: string;
  }
> = {
  percent: {
    title: "0–100%",
    maximum: 100,
    unit: "%",
  },

  temperature: {
    title: "0–250 °C",
    maximum: 250,
    unit: "°C",
  },

  pressure: {
    title: "0–10 bar",
    maximum: 10,
    unit: "bar",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

function wait(
  milliseconds: number,
): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function formatNumber(
  value: number,
  digits = 1,
): string {
  return value.toFixed(digits);
}

function getAddress(
  inputType: InputType,
): string {
  return inputType === "digital"
    ? "I0.0"
    : "IW64";
}

function getSignalUnit(
  inputType: InputType,
): string {
  return inputType === "digital"
    ? "V"
    : "mA";
}

function formatSignal(
  value: number,
  inputType: InputType,
): string {
  return `${formatNumber(value)} ${getSignalUnit(
    inputType,
  )}`;
}

function getQualityLabel(
  quality: Quality,
): string {
  switch (quality) {
    case "good":
      return "Good";

    case "bad":
      return "Bad";

    case "uncertain":
      return "Uncertain";
  }
}

function getQualityClasses(
  quality: Quality,
): string {
  switch (quality) {
    case "good":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "bad":
      return "border-red-200 bg-red-50 text-red-700";

    case "uncertain":
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function createInitialSample(
  inputType: InputType,
): SignalSample {
  return {
    ...INITIAL_SAMPLE,
    diagnostic:
      inputType === "digital"
        ? "No digital input has been read."
        : "No analog input has been read.",
  };
}

/* =========================================================
   GENERAL UI COMPONENTS
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

                boxShadow: danger
                  ? [
                      "0 0 0 rgba(239,68,68,0)",
                      "0 0 10px rgba(239,68,68,.55)",
                      "0 0 0 rgba(239,68,68,0)",
                    ]
                  : warning
                    ? [
                        "0 0 0 rgba(245,158,11,0)",
                        "0 0 10px rgba(245,158,11,.55)",
                        "0 0 0 rgba(245,158,11,0)",
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

          checked
            ? "bg-blue-600"
            : "bg-slate-300",
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

/* =========================================================
   ACCESSIBLE SVG NODE
========================================================= */

function SvgNode({
  id,
  selected,
  active,
  children,
  onSelect,
}: {
  id: ComponentId;
  selected: boolean;
  active: boolean;
  children: ReactNode;
  onSelect: (
    id: ComponentId,
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
      onSelect(id);
    }
  };

  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${COMPONENT_INFORMATION[id].title}`}
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
              filter:
                "drop-shadow(0 0 0 rgba(0,0,0,0)",
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
   INPUT MODULE CANVAS
========================================================= */

function InputModuleCanvas({
  mode,
  stage,
  inputType,
  sample,
  digitalVoltage,
  analogCurrent,
  openWire,
  lineMonitoring,
  selectedComponent,
  onSelectComponent,
}: {
  mode: ModuleMode;
  stage: ReadStage;
  inputType: InputType;
  sample: SignalSample;
  digitalVoltage: number;
  analogCurrent: number;
  openWire: boolean;
  lineMonitoring: boolean;
  selectedComponent: ComponentId;
  onSelectComponent: (
    component: ComponentId,
  ) => void;
}) {
  const powered =
    mode !== "off";

  const physicalSignal =
    openWire
      ? 0
      : inputType === "digital"
        ? digitalVoltage
        : analogCurrent;

  const nodeClass = (
    id: ComponentId,
    active: boolean,
  ): string => {
    return [
      "fill-white transition-colors",

      selectedComponent === id
        ? "stroke-blue-600"
        : active
          ? "stroke-blue-400"
          : "stroke-slate-300",
    ].join(" ");
  };

  const pathClass = (
    active: boolean,
  ): string => {
    return [
      "fill-none",

      active
        ? "stroke-blue-600"
        : "stroke-slate-300",
    ].join(" ");
  };

  const receiveActive =
    stage === "receive";

  const protectActive =
    stage === "protect";

  const conditioningActive =
    stage === "condition";

  const conversionActive =
    stage === "convert";

  const storeActive =
    stage === "store";

  const statusActive =
    sample.quality === "good" &&
    sample.processImage !== 0;

  const statusFault =
    sample.quality === "bad";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            PLC input-module simulation canvas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a component or read the
            channel to follow the signal.
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
              ? "AUTO SCAN"
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

      <div className="relative aspect-[4/3] min-h-[500px] w-full bg-slate-50 sm:aspect-[16/10]">
        <svg
          viewBox="0 0 1220 760"
          className="h-full w-full"
          role="img"
          aria-label="Interactive PLC input module showing field device, terminal, protection, conditioning, isolation, conversion, input register, diagnostics and CPU interface"
        >
          <defs>
            <pattern
              id="inputGrid"
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
            width="1220"
            height="760"
            fill="url(#inputGrid)"
          />

          {/* Field device region */}

          <rect
            x="25"
            y="110"
            width="180"
            height="350"
            rx="26"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
          />

          <text
            x="115"
            y="145"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="15"
            fontWeight="700"
          >
            FIELD SIDE
          </text>

          {/* Input-module enclosure */}

          <rect
            x="225"
            y="45"
            width="850"
            height="630"
            rx="28"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="4"
          />

          <text
            x="255"
            y="83"
            fill="#0f172a"
            fontSize="21"
            fontWeight="800"
          >
            PLC INPUT MODULE
          </text>

          <text
            x="255"
            y="108"
            fill="#64748b"
            fontSize="13"
          >
            {inputType === "digital"
              ? "24 VDC digital channel"
              : "4–20 mA analog channel"}
          </text>

          {/* CPU region */}

          <rect
            x="1090"
            y="430"
            width="105"
            height="165"
            rx="22"
            fill="#eff6ff"
            stroke="#2563eb"
            strokeWidth="3"
          />

          <text
            x="1142"
            y="465"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="14"
            fontWeight="800"
          >
            PLC CPU
          </text>

          <rect
            x="1110"
            y="490"
            width="65"
            height="45"
            rx="8"
            fill="#0f172a"
          />

          <text
            x="1142"
            y="518"
            textAnchor="middle"
            fill="#86efac"
            fontSize="12"
            fontWeight="800"
          >
            {powered
              ? "READY"
              : "OFF"}
          </text>

          <text
            x="1142"
            y="560"
            textAnchor="middle"
            fill="#475569"
            fontSize="10"
          >
            Reads
          </text>

          <text
            x="1142"
            y="575"
            textAnchor="middle"
            fill="#475569"
            fontSize="10"
          >
            process image
          </text>

          {/* Signal paths */}

          <path
            d="M185 285 H255"
            className={pathClass(
              receiveActive,
            )}
            strokeWidth="4"
            strokeDasharray={
              receiveActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              receiveActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          <path
            d="M365 285 H410"
            className={pathClass(
              protectActive,
            )}
            strokeWidth="4"
            strokeDasharray={
              protectActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              protectActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          <path
            d="M535 285 H580"
            className={pathClass(
              conditioningActive,
            )}
            strokeWidth="4"
            strokeDasharray={
              conditioningActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              conditioningActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          <path
            d="M730 285 H775"
            className={pathClass(
              conditioningActive,
            )}
            strokeWidth="4"
            strokeDasharray={
              conditioningActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              conditioningActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          <path
            d="M905 285 H945"
            className={pathClass(
              conversionActive,
            )}
            strokeWidth="4"
            strokeDasharray={
              conversionActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              conversionActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          <path
            d="M1025 365 V430 H815 V465"
            className={pathClass(
              storeActive,
            )}
            strokeWidth="4"
            strokeDasharray={
              storeActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              storeActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          <path
            d="M900 530 H950"
            className={pathClass(
              storeActive,
            )}
            strokeWidth="4"
            strokeDasharray={
              storeActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              storeActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          <path
            d="M1050 530 H1090"
            className={pathClass(
              storeActive,
            )}
            strokeWidth="4"
            strokeDasharray={
              storeActive
                ? "12 9"
                : undefined
            }
            markerEnd={
              storeActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          <path
            d="M815 585 V625 H470 V570"
            className={pathClass(
              storeActive,
            )}
            strokeWidth="3"
            strokeDasharray="8 8"
            markerEnd={
              storeActive
                ? "url(#activeArrow)"
                : "url(#idleArrow)"
            }
          />

          {/* Field device */}

          <SvgNode
            id="fieldDevice"
            selected={
              selectedComponent ===
              "fieldDevice"
            }
            active={receiveActive}
            onSelect={onSelectComponent}
          >
            <rect
              x="50"
              y="180"
              width="130"
              height="205"
              rx="20"
              className={nodeClass(
                "fieldDevice",
                receiveActive,
              )}
              strokeWidth="3"
            />

            <text
              x="115"
              y="214"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="13"
              fontWeight="700"
            >
              FIELD DEVICE
            </text>

            {inputType === "digital" ? (
              <>
                <circle
                  cx="115"
                  cy="272"
                  r="38"
                  fill="#ffffff"
                  stroke="#64748b"
                  strokeWidth="4"
                />

                <circle
                  cx="115"
                  cy="272"
                  r="14"
                  fill={
                    physicalSignal >=
                    DIGITAL_ON_THRESHOLD
                      ? "#10b981"
                      : "#e2e8f0"
                  }
                  stroke={
                    physicalSignal >=
                    DIGITAL_ON_THRESHOLD
                      ? "#059669"
                      : "#94a3b8"
                  }
                  strokeWidth="3"
                />

                <path
                  d="M90 330 H140"
                  stroke="#475569"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <text
                  x="115"
                  y="354"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                >
                  PROXIMITY SENSOR
                </text>
              </>
            ) : (
              <>
                <circle
                  cx="115"
                  cy="272"
                  r="42"
                  fill="#ffffff"
                  stroke="#64748b"
                  strokeWidth="4"
                />

                <text
                  x="115"
                  y="267"
                  textAnchor="middle"
                  fill="#2563eb"
                  fontSize="14"
                  fontWeight="800"
                >
                  4–20
                </text>

                <text
                  x="115"
                  y="287"
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="11"
                  fontWeight="700"
                >
                  mA
                </text>

                <text
                  x="115"
                  y="350"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                >
                  TRANSMITTER
                </text>
              </>
            )}

            <text
              x="115"
              y="374"
              textAnchor="middle"
              fill={
                openWire
                  ? "#dc2626"
                  : "#2563eb"
              }
              fontSize="11"
              fontWeight="700"
            >
              {openWire
                ? "OPEN WIRE"
                : formatSignal(
                    physicalSignal,
                    inputType,
                  )}
            </text>
          </SvgNode>

          {/* Terminal */}

          <SvgNode
            id="terminal"
            selected={
              selectedComponent ===
              "terminal"
            }
            active={receiveActive}
            onSelect={onSelectComponent}
          >
            <rect
              x="255"
              y="195"
              width="110"
              height="180"
              rx="18"
              className={nodeClass(
                "terminal",
                receiveActive,
              )}
              strokeWidth="3"
            />

            <text
              x="310"
              y="226"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="700"
            >
              TERMINAL
            </text>

            <circle
              cx="310"
              cy="272"
              r="19"
              fill="#ffffff"
              stroke="#64748b"
              strokeWidth="3"
            />

            <circle
              cx="310"
              cy="320"
              r="19"
              fill="#ffffff"
              stroke="#64748b"
              strokeWidth="3"
            />

            <text
              x="310"
              y="278"
              textAnchor="middle"
              fill="#334155"
              fontSize="15"
              fontWeight="700"
            >
              +
            </text>

            <text
              x="310"
              y="326"
              textAnchor="middle"
              fill="#334155"
              fontSize="13"
              fontWeight="700"
            >
              M
            </text>

            <text
              x="310"
              y="360"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              FIELD WIRING
            </text>
          </SvgNode>

          {/* Protection */}

          <SvgNode
            id="protection"
            selected={
              selectedComponent ===
              "protection"
            }
            active={protectActive}
            onSelect={onSelectComponent}
          >
            <rect
              x="410"
              y="195"
              width="125"
              height="180"
              rx="18"
              className={nodeClass(
                "protection",
                protectActive,
              )}
              strokeWidth="3"
            />

            <text
              x="472"
              y="226"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="700"
            >
              PROTECTION
            </text>

            <path
              d="M435 282 H452 L462 260 L473 308 L484 282 H510"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M447 329 H498"
              stroke="#64748b"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <text
              x="472"
              y="352"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              LIMIT + CLAMP
            </text>
          </SvgNode>

          {/* Conditioning */}

          <SvgNode
            id="conditioning"
            selected={
              selectedComponent ===
              "conditioning"
            }
            active={conditioningActive}
            onSelect={onSelectComponent}
          >
            <rect
              x="580"
              y="195"
              width="150"
              height="180"
              rx="18"
              className={nodeClass(
                "conditioning",
                conditioningActive,
              )}
              strokeWidth="3"
            />

            <text
              x="655"
              y="226"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="700"
            >
              CONDITIONING
            </text>

            <path
              d="M605 280 C620 245 635 315 650 280 C665 245 680 315 705 280"
              fill="none"
              stroke={
                sample.quality === "bad"
                  ? "#ef4444"
                  : "#2563eb"
              }
              strokeWidth="4"
              strokeLinecap="round"
            />

            <path
              d="M605 320 H705"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <text
              x="655"
              y="350"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              FILTER + NORMALIZE
            </text>
          </SvgNode>

          {/* Isolation */}

          <SvgNode
            id="isolation"
            selected={
              selectedComponent ===
              "isolation"
            }
            active={conditioningActive}
            onSelect={onSelectComponent}
          >
            <rect
              x="775"
              y="195"
              width="130"
              height="180"
              rx="18"
              className={nodeClass(
                "isolation",
                conditioningActive,
              )}
              strokeWidth="3"
            />

            <text
              x="840"
              y="226"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="700"
            >
              ISOLATION
            </text>

            <circle
              cx="815"
              cy="286"
              r="21"
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth="3"
            />

            <path
              d="M804 286 L826 272 V300 Z"
              fill="#dbeafe"
              stroke="#2563eb"
              strokeWidth="2"
            />

            <path
              d="M842 270 L860 258 M842 286 L864 274"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M870 258 V314 M870 286 H890"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <text
              x="840"
              y="350"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              GALVANIC BARRIER
            </text>
          </SvgNode>

          {/* Conversion */}

          <SvgNode
            id="conversion"
            selected={
              selectedComponent ===
              "conversion"
            }
            active={conversionActive}
            onSelect={onSelectComponent}
          >
            <rect
              x="945"
              y="195"
              width="135"
              height="170"
              rx="18"
              className={nodeClass(
                "conversion",
                conversionActive,
              )}
              strokeWidth="3"
            />

            <text
              x="1012"
              y="226"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="700"
            >
              {inputType === "digital"
                ? "THRESHOLD"
                : "ADC + SCALE"}
            </text>

            <rect
              x="970"
              y="250"
              width="85"
              height="55"
              rx="9"
              fill="#0f172a"
            />

            <text
              x="1012"
              y="273"
              textAnchor="middle"
              fill="#86efac"
              fontSize="12"
              fontWeight="700"
            >
              {inputType === "digital"
                ? `LOGIC ${sample.convertedValue}`
                : `ADC ${sample.convertedValue}`}
            </text>

            <text
              x="1012"
              y="292"
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="9"
            >
              {inputType === "digital"
                ? `ON ≥ ${DIGITAL_ON_THRESHOLD} V`
                : "12-BIT MODEL"}
            </text>

            <text
              x="1012"
              y="340"
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              ELECTRICAL → DATA
            </text>
          </SvgNode>

          {/* Diagnostics */}

          <SvgNode
            id="diagnostics"
            selected={
              selectedComponent ===
              "diagnostics"
            }
            active={
              storeActive ||
              sample.quality !== "good"
            }
            onSelect={onSelectComponent}
          >
            <rect
              x="300"
              y="465"
              width="220"
              height="105"
              rx="18"
              className={nodeClass(
                "diagnostics",
                sample.quality !== "good",
              )}
              strokeWidth="3"
            />

            <text
              x="410"
              y="496"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="13"
              fontWeight="700"
            >
              CHANNEL DIAGNOSTICS
            </text>

            <text
              x="410"
              y="530"
              textAnchor="middle"
              fill={
                sample.quality === "good"
                  ? "#059669"
                  : sample.quality ===
                      "bad"
                    ? "#dc2626"
                    : "#d97706"
              }
              fontSize="17"
              fontWeight="800"
            >
              {getQualityLabel(
                sample.quality,
              ).toUpperCase()}
            </text>

            <text
              x="410"
              y="552"
              textAnchor="middle"
              fill="#64748b"
              fontSize="9"
            >
              RANGE + WIRE MONITORING
            </text>
          </SvgNode>

          {/* Status LED */}

          <SvgNode
            id="statusLed"
            selected={
              selectedComponent ===
              "statusLed"
            }
            active={
              statusActive ||
              statusFault
            }
            onSelect={onSelectComponent}
          >
            <rect
              x="550"
              y="465"
              width="130"
              height="105"
              rx="18"
              className={nodeClass(
                "statusLed",
                statusActive ||
                  statusFault,
              )}
              strokeWidth="3"
            />

            <text
              x="615"
              y="496"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="700"
            >
              CHANNEL LED
            </text>

            <motion.circle
              cx="615"
              cy="530"
              r="15"
              fill={
                statusFault
                  ? "#ef4444"
                  : statusActive
                    ? "#10b981"
                    : "#e2e8f0"
              }
              stroke={
                statusFault
                  ? "#dc2626"
                  : statusActive
                    ? "#059669"
                    : "#94a3b8"
              }
              strokeWidth="3"
              animate={
                statusFault
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

                repeat: statusFault
                  ? Number.POSITIVE_INFINITY
                  : 0,
              }}
            />

            <text
              x="615"
              y="557"
              textAnchor="middle"
              fill="#64748b"
              fontSize="9"
            >
              STATE / FAULT
            </text>
          </SvgNode>

          {/* Input register */}

          <SvgNode
            id="register"
            selected={
              selectedComponent ===
              "register"
            }
            active={storeActive}
            onSelect={onSelectComponent}
          >
            <rect
              x="730"
              y="465"
              width="170"
              height="120"
              rx="18"
              className={nodeClass(
                "register",
                storeActive,
              )}
              strokeWidth="3"
            />

            <text
              x="815"
              y="496"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="13"
              fontWeight="700"
            >
              INPUT REGISTER
            </text>

            <text
              x="815"
              y="535"
              textAnchor="middle"
              fill="#2563eb"
              fontSize="19"
              fontWeight="800"
            >
              {getAddress(inputType)}
            </text>

            <text
              x="815"
              y="563"
              textAnchor="middle"
              fill="#334155"
              fontSize="15"
              fontWeight="700"
            >
              = {sample.processImage}
            </text>
          </SvgNode>

          {/* Backplane */}

          <SvgNode
            id="backplane"
            selected={
              selectedComponent ===
              "backplane"
            }
            active={storeActive}
            onSelect={onSelectComponent}
          >
            <rect
              x="950"
              y="465"
              width="100"
              height="120"
              rx="18"
              className={nodeClass(
                "backplane",
                storeActive,
              )}
              strokeWidth="3"
            />

            <text
              x="1000"
              y="496"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="700"
            >
              BACKPLANE
            </text>

            {[0, 1, 2, 3].map(
              (index) => (
                <rect
                  key={index}
                  x={
                    970 +
                    (index % 2) * 28
                  }
                  y={
                    520 +
                    Math.floor(index / 2) *
                      25
                  }
                  width="18"
                  height="13"
                  rx="3"
                  fill={
                    storeActive
                      ? "#2563eb"
                      : "#cbd5e1"
                  }
                />
              ),
            )}
          </SvgNode>

          {/* Line-monitoring label */}

          <text
            x="280"
            y="650"
            fill="#64748b"
            fontSize="11"
          >
            Digital line monitoring:{" "}
            {lineMonitoring
              ? "ENABLED"
              : "DISABLED"}
          </text>

          <text
            x="610"
            y="710"
            textAnchor="middle"
            fill="#64748b"
            fontSize="12"
          >
            The CPU receives the stored value
            after the module completes signal
            conditioning and conversion.
          </text>

          {/* Animated signal packets */}

          <AnimatePresence>
            {stage === "receive" ? (
              <motion.circle
                key="receive-packet"
                r="7"
                fill="#2563eb"
                initial={{
                  cx: 185,
                  cy: 285,
                  opacity: 0,
                }}
                animate={{
                  cx: [185, 255],
                  cy: [285, 285],
                  opacity: [0, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  repeat:
                    Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ) : null}

            {stage === "protect" ? (
              <motion.circle
                key="protect-packet"
                r="7"
                fill="#2563eb"
                initial={{
                  cx: 365,
                  cy: 285,
                  opacity: 0,
                }}
                animate={{
                  cx: [365, 410],
                  cy: [285, 285],
                  opacity: [0, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.7,
                  repeat:
                    Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ) : null}

            {stage === "condition" ? (
              <>
                <motion.circle
                  key="condition-packet"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 535,
                    cy: 285,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [535, 580, 730],
                    cy: [285, 285, 285],
                    opacity: [0, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <motion.circle
                  key="isolation-packet"
                  r="6"
                  fill="#7c3aed"
                  initial={{
                    cx: 730,
                    cy: 285,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [730, 775, 905],
                    cy: [285, 285, 285],
                    opacity: [0, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: 0.15,
                  }}
                />
              </>
            ) : null}

            {stage === "convert" ? (
              <motion.circle
                key="conversion-packet"
                r="7"
                fill="#2563eb"
                initial={{
                  cx: 905,
                  cy: 285,
                  opacity: 0,
                }}
                animate={{
                  cx: [905, 945],
                  cy: [285, 285],
                  opacity: [0, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.7,
                  repeat:
                    Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ) : null}

            {stage === "store" ? (
              <>
                <motion.circle
                  key="register-packet"
                  r="7"
                  fill="#2563eb"
                  initial={{
                    cx: 1025,
                    cy: 365,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [
                      1025,
                      1025,
                      815,
                      815,
                    ],
                    cy: [
                      365,
                      430,
                      430,
                      465,
                    ],
                    opacity: [0, 1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.15,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <motion.circle
                  key="cpu-packet"
                  r="7"
                  fill="#10b981"
                  initial={{
                    cx: 900,
                    cy: 530,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [
                      900,
                      950,
                      1050,
                      1090,
                    ],
                    cy: [
                      530,
                      530,
                      530,
                      530,
                    ],
                    opacity: [0, 1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1,
                    repeat:
                      Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: 0.2,
                  }}
                />
              </>
            ) : null}
          </AnimatePresence>
        </svg>

        {!powered ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-4 backdrop-blur-[1px]">
            <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-mono text-sm font-bold text-blue-700">
                DI/AI
              </div>

              <p className="mt-3 font-semibold text-slate-900">
                Input module power is OFF
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Use the left control panel to
                power the module and begin a
                channel read.
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

export default function PlcInputModulePage() {
  const [
    mode,
    setMode,
  ] = useState<ModuleMode>("off");

  const [
    stage,
    setStage,
  ] = useState<ReadStage>("idle");

  const [
    busy,
    setBusy,
  ] = useState(false);

  const [
    inputType,
    setInputType,
  ] = useState<InputType>("digital");

  const [
    sensorActive,
    setSensorActive,
  ] = useState(false);

  const [
    digitalVoltage,
    setDigitalVoltage,
  ] = useState(0);

  const [
    analogCurrent,
    setAnalogCurrent,
  ] = useState(4);

  const [
    engineeringRange,
    setEngineeringRange,
  ] =
    useState<EngineeringRange>(
      "percent",
    );

  const [
    openWire,
    setOpenWire,
  ] = useState(false);

  const [
    electricalNoise,
    setElectricalNoise,
  ] = useState(false);

  const [
    lineMonitoring,
    setLineMonitoring,
  ] = useState(true);

  const [
    filterStrength,
    setFilterStrength,
  ] = useState(45);

  const [
    cycleDuration,
    setCycleDuration,
  ] = useState(2200);

  const [
    sample,
    setSample,
  ] = useState<SignalSample>(
    INITIAL_SAMPLE,
  );

  const [
    scanCount,
    setScanCount,
  ] = useState(0);

  const [
    selectedComponent,
    setSelectedComponent,
  ] = useState<ComponentId>(
    "conditioning",
  );

  /* =======================================================
     ASYNCHRONOUS REFS
  ======================================================= */

  const modeRef =
    useRef<ModuleMode>(mode);

  const busyRef =
    useRef(false);

  const abortVersionRef =
    useRef(0);

  const filteredSignalRef =
    useRef(0);

  const configurationRef =
    useRef<InputConfiguration>({
      inputType,
      digitalVoltage,
      analogCurrent,
      engineeringRange,
      openWire,
      electricalNoise,
      lineMonitoring,
      filterStrength,
      cycleDuration,
    });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    configurationRef.current = {
      inputType,
      digitalVoltage,
      analogCurrent,
      engineeringRange,
      openWire,
      electricalNoise,
      lineMonitoring,
      filterStrength,
      cycleDuration,
    };
  }, [
    inputType,
    digitalVoltage,
    analogCurrent,
    engineeringRange,
    openWire,
    electricalNoise,
    lineMonitoring,
    filterStrength,
    cycleDuration,
  ]);

  const selectedInformation =
    COMPONENT_INFORMATION[
      selectedComponent
    ];

  const stageInformation =
    STAGE_INFORMATION[stage];

  const rangeInformation =
    ENGINEERING_RANGES[
      engineeringRange
    ];

  const physicalSignal =
    openWire
      ? 0
      : inputType === "digital"
        ? digitalVoltage
        : analogCurrent;

  /* =======================================================
     INPUT CONVERSION
  ======================================================= */

  const performInputRead =
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

        const configuration = {
          ...configurationRef.current,
        };

        const phaseDuration =
          Math.max(
            150,
            Math.round(
              configuration.cycleDuration /
                5,
            ),
          );

        const validRead = () =>
          token ===
            abortVersionRef.current &&
          modeRef.current !== "off";

        try {
          /*
           * 1. RECEIVE
           */

          setStage("receive");

          const baseSignal =
            configuration.openWire
              ? 0
              : configuration.inputType ===
                  "digital"
                ? configuration.digitalVoltage
                : configuration.analogCurrent;

          const noiseAmplitude =
            configuration.inputType ===
            "digital"
              ? 2.5
              : 0.45;

          const rawSignal =
            configuration.openWire
              ? 0
              : configuration.electricalNoise
                ? baseSignal +
                  (
                    Math.random() -
                    0.5
                  ) *
                    noiseAmplitude *
                    2
                : baseSignal;

          setSample((current) => ({
            ...current,
            rawSignal,
            diagnostic:
              "Field signal received at the input terminal.",
          }));

          await wait(phaseDuration);

          if (!validRead()) {
            return false;
          }

          /*
           * 2. PROTECT
           */

          setStage("protect");

          const protectedSignal =
            configuration.inputType ===
            "digital"
              ? clamp(
                  rawSignal,
                  0,
                  30,
                )
              : clamp(
                  rawSignal,
                  0,
                  24,
                );

          setSample((current) => ({
            ...current,
            rawSignal,
            protectedSignal,
            diagnostic:
              "Signal clamped to the accepted teaching range.",
          }));

          await wait(phaseDuration);

          if (!validRead()) {
            return false;
          }

          /*
           * 3. CONDITION AND FILTER
           */

          setStage("condition");

          /*
           * Higher filter strength gives the
           * previous sample more influence.
           */
          const previousFiltered =
            filteredSignalRef.current;

          const newSignalWeight =
            1 -
            (
              configuration.filterStrength /
              100
            ) *
              0.8;

          const filteredSignal =
            previousFiltered *
              (
                1 -
                newSignalWeight
              ) +
            protectedSignal *
              newSignalWeight;

          filteredSignalRef.current =
            filteredSignal;

          setSample((current) => ({
            ...current,
            rawSignal,
            protectedSignal,
            filteredSignal,
            diagnostic:
              "Noise filtering and isolation completed.",
          }));

          await wait(phaseDuration);

          if (!validRead()) {
            return false;
          }

          /*
           * 4. CONVERT
           */

          setStage("convert");

          let convertedValue = 0;
          let processImage = 0;
          let engineeringValue = 0;
          let quality: Quality =
            "good";
          let diagnostic =
            "Signal conversion completed.";

          if (
            configuration.inputType ===
            "digital"
          ) {
            convertedValue =
              filteredSignal >=
              DIGITAL_ON_THRESHOLD
                ? 1
                : 0;

            processImage =
              convertedValue;

            engineeringValue =
              convertedValue;

            if (
              configuration.openWire &&
              configuration.lineMonitoring
            ) {
              quality = "bad";
              diagnostic =
                "Open-wire fault detected by the simulated line-monitoring circuit.";
            } else if (
              configuration.openWire &&
              !configuration.lineMonitoring
            ) {
              quality = "uncertain";
              diagnostic =
                "The channel reads OFF. Without line monitoring, a standard digital input may not distinguish an open wire from a normal OFF state.";
            } else {
              quality = "good";
              diagnostic =
                convertedValue === 1
                  ? "Voltage is above the digital ON threshold."
                  : "Voltage is below the digital ON threshold.";
            }
          } else {
            const normalized =
              clamp(
                (
                  filteredSignal -
                  4
                ) /
                  16,
                0,
                1,
              );

            convertedValue =
              Math.round(
                normalized *
                  ADC_MAX_COUNT,
              );

            processImage =
              convertedValue;

            engineeringValue =
              normalized *
              ENGINEERING_RANGES[
                configuration
                  .engineeringRange
              ].maximum;

            if (
              configuration.openWire
            ) {
              quality = "bad";
              diagnostic =
                "Open-wire fault: no valid loop current is reaching the module.";
            } else if (
              filteredSignal < 3.6
            ) {
              quality = "bad";
              diagnostic =
                "Analog signal is below the expected live-zero range.";
            } else if (
              filteredSignal > 21
            ) {
              quality = "bad";
              diagnostic =
                "Analog signal is above the normal operating range.";
            } else {
              quality = "good";
              diagnostic =
                "Analog signal is inside the accepted operating range.";
            }
          }

          setSample({
            rawSignal,
            protectedSignal,
            filteredSignal,
            convertedValue,
            processImage:
              sample.processImage,
            engineeringValue,
            quality,
            diagnostic,
          });

          await wait(phaseDuration);

          if (!validRead()) {
            return false;
          }

          /*
           * 5. STORE FOR CPU
           */

          setStage("store");

          setSample({
            rawSignal,
            protectedSignal,
            filteredSignal,
            convertedValue,
            processImage,
            engineeringValue,
            quality,
            diagnostic,
          });

          setScanCount(
            (current) =>
              current + 1,
          );

          await wait(phaseDuration);

          if (!validRead()) {
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
      [sample.processImage],
    );

  /* =======================================================
     CONTINUOUS AUTO SCAN
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
        await performInputRead();

        if (
          !cancelled &&
          modeRef.current ===
            "run"
        ) {
          await wait(120);
        }
      }
    };

    void runLoop();

    return () => {
      cancelled = true;
    };
  }, [mode, performInputRead]);

  /* =======================================================
     POWER CONTROL
  ======================================================= */

  const togglePower =
    useCallback(() => {
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

        filteredSignalRef.current =
          0;

        setMode("off");
        setBusy(false);
        setStage("idle");

        setSample(
          createInitialSample(
            configurationRef.current
              .inputType,
          ),
        );

        return;
      }

      modeRef.current =
        "stop";

      setMode("stop");
      setStage("idle");

      setSample((current) => ({
        ...current,
        quality: "uncertain",
        diagnostic:
          "Module powered. Perform a read to update the input register.",
      }));
    }, []);

  /* =======================================================
     AUTO SCAN CONTROL
  ======================================================= */

  const toggleRun =
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
     RESET
  ======================================================= */

  const resetSimulation =
    useCallback(() => {
      abortVersionRef.current +=
        1;

      modeRef.current =
        "off";

      busyRef.current =
        false;

      filteredSignalRef.current =
        0;

      setMode("off");
      setStage("idle");
      setBusy(false);

      setInputType("digital");
      setSensorActive(false);
      setDigitalVoltage(0);
      setAnalogCurrent(4);

      setEngineeringRange(
        "percent",
      );

      setOpenWire(false);
      setElectricalNoise(false);
      setLineMonitoring(true);
      setFilterStrength(45);
      setCycleDuration(2200);

      setSample(INITIAL_SAMPLE);
      setScanCount(0);

      setSelectedComponent(
        "conditioning",
      );
    }, []);

  /* =======================================================
     TYPE AND SIGNAL CONTROLS
  ======================================================= */

  const handleTypeChange = (
    nextType: InputType,
  ) => {
    abortVersionRef.current +=
      1;

    busyRef.current = false;
    filteredSignalRef.current =
      nextType === "digital"
        ? digitalVoltage
        : analogCurrent;

    if (
      modeRef.current === "run"
    ) {
      modeRef.current =
        "stop";

      setMode("stop");
    }

    setBusy(false);
    setStage("idle");
    setInputType(nextType);

    setSample(
      createInitialSample(
        nextType,
      ),
    );
  };

  const handleSensorToggle =
    () => {
      const next =
        !sensorActive;

      setSensorActive(next);

      setDigitalVoltage(
        next ? 24 : 0,
      );
    };

  const qualityLabel =
    getQualityLabel(
      sample.quality,
    );

  const engineeringDisplay =
    inputType === "digital"
      ? sample.processImage === 1
        ? "ON"
        : "OFF"
      : `${formatNumber(
          sample.engineeringValue,
        )} ${rangeInformation.unit}`;

  const selectedDetails =
    COMPONENT_INFORMATION[
      selectedComponent
    ];

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
                    active={
                      mode !== "off"
                    }
                    tone="green"
                  >
                    {mode !== "off"
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
                      ? "AUTO SCAN"
                      : "MODULE STOPPED"}
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
                  PLC Input Module
                  Interactive Simulator
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                  Explore how digital and
                  analog input modules receive,
                  protect, filter, isolate,
                  convert and store field
                  signals for the PLC CPU.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <MetricCard
                  label="Module"
                  value={
                    mode.toUpperCase()
                  }
                  helper="Current operating mode"
                />

                <MetricCard
                  label="Input type"
                  value={
                    inputType ===
                    "digital"
                      ? "DIGITAL"
                      : "ANALOG"
                  }
                  helper={
                    inputType ===
                    "digital"
                      ? "24 VDC teaching model"
                      : "4–20 mA teaching model"
                  }
                />

                <MetricCard
                  label="Field signal"
                  value={formatSignal(
                    physicalSignal,
                    inputType,
                  )}
                  helper={
                    openWire
                      ? "Cable disconnected"
                      : "At module terminal"
                  }
                />

                <MetricCard
                  label="CPU value"
                  value={
                    sample.processImage
                  }
                  helper={getAddress(
                    inputType,
                  )}
                />
              </div>
            </div>
          </header>

          {/* Main responsive layout */}

          <div className="grid gap-5 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)]">
            {/* Left control panel */}

            <aside className="space-y-4 md:sticky md:top-4 md:self-start">
              <Card
                title="Module controls"
                description="Power and read the selected input channel."
              >
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    type="button"
                    onClick={
                      togglePower
                    }
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
                    onClick={
                      toggleRun
                    }
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      mode === "off"
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : mode === "run"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-emerald-600 bg-emerald-600 text-white",
                    ].join(" ")}
                    whileHover={
                      mode !== "off"
                        ? { y: -2 }
                        : undefined
                    }
                    whileTap={
                      mode !== "off"
                        ? {
                            scale: 0.98,
                          }
                        : undefined
                    }
                  >
                    {mode === "run"
                      ? "Stop Scan"
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
                      void performInputRead()
                    }
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold",

                      mode === "off" ||
                      mode === "run" ||
                      busy
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : "border-violet-200 bg-violet-50 text-violet-700",
                    ].join(" ")}
                    whileHover={
                      mode !== "off" &&
                      mode !== "run" &&
                      !busy
                        ? { y: -2 }
                        : undefined
                    }
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
                    Single Read
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
                title="Input-module type"
                description="Select the electrical interface used by the channel."
              >
                <label
                  htmlFor="input-type"
                  className="text-sm font-semibold text-slate-800"
                >
                  Signal interface
                </label>

                <select
                  id="input-type"
                  value={inputType}
                  disabled={
                    busy ||
                    mode === "run"
                  }
                  onChange={(event) =>
                    handleTypeChange(
                      event.target
                        .value as InputType,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="digital">
                    24 VDC digital input
                  </option>

                  <option value="analog">
                    4–20 mA analog input
                  </option>
                </select>

                <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                  {inputType === "digital"
                    ? "The digital teaching model converts terminal voltage into a Boolean input bit."
                    : "The analog teaching model converts loop current into a 12-bit raw count and an engineering value."}
                </div>
              </Card>

              {inputType === "digital" ? (
                <Card
                  title="Digital field signal"
                  description="Operate the proximity sensor or adjust its terminal voltage."
                >
                  <div className="space-y-3">
                    <Toggle
                      checked={
                        sensorActive
                      }
                      disabled={
                        mode === "off"
                      }
                      label="Proximity sensor"
                      description={
                        sensorActive
                          ? "Sensor output is ON"
                          : "Sensor output is OFF"
                      }
                      onChange={
                        handleSensorToggle
                      }
                    />

                    <div className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <label
                          htmlFor="digital-voltage"
                          className="text-sm font-semibold text-slate-800"
                        >
                          Terminal voltage
                        </label>

                        <span className="font-mono text-sm font-semibold text-blue-700">
                          {formatNumber(
                            digitalVoltage,
                            0,
                          )}{" "}
                          V
                        </span>
                      </div>

                      <input
                        id="digital-voltage"
                        type="range"
                        min={0}
                        max={30}
                        step={1}
                        value={
                          digitalVoltage
                        }
                        disabled={
                          mode === "off"
                        }
                        onChange={(
                          event,
                        ) => {
                          const value =
                            Number(
                              event.target
                                .value,
                            );

                          setDigitalVoltage(
                            value,
                          );

                          setSensorActive(
                            value >=
                              DIGITAL_ON_THRESHOLD,
                          );
                        }}
                        className="mt-4 w-full accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                      />

                      <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>0 V</span>
                        <span>
                          ON threshold:{" "}
                          {
                            DIGITAL_ON_THRESHOLD
                          }{" "}
                          V
                        </span>
                        <span>30 V</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card
                  title="Analog field signal"
                  description="Adjust the transmitter current and engineering range."
                >
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <label
                          htmlFor="analog-current"
                          className="text-sm font-semibold text-slate-800"
                        >
                          Loop current
                        </label>

                        <span className="font-mono text-sm font-semibold text-blue-700">
                          {formatNumber(
                            analogCurrent,
                          )}{" "}
                          mA
                        </span>
                      </div>

                      <input
                        id="analog-current"
                        type="range"
                        min={0}
                        max={24}
                        step={0.1}
                        value={
                          analogCurrent
                        }
                        disabled={
                          mode === "off"
                        }
                        onChange={(
                          event,
                        ) =>
                          setAnalogCurrent(
                            Number(
                              event.target
                                .value,
                            ),
                          )
                        }
                        className="mt-4 w-full accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                      />

                      <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>0 mA</span>
                        <span>
                          4–20 mA operating
                          range
                        </span>
                        <span>24 mA</span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="engineering-range"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Engineering range
                      </label>

                      <select
                        id="engineering-range"
                        value={
                          engineeringRange
                        }
                        onChange={(
                          event,
                        ) =>
                          setEngineeringRange(
                            event.target
                              .value as EngineeringRange,
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {Object.entries(
                          ENGINEERING_RANGES,
                        ).map(
                          ([
                            key,
                            range,
                          ]) => (
                            <option
                              key={key}
                              value={key}
                            >
                              {
                                range.title
                              }
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                </Card>
              )}

              <Card
                title="Fault and filter settings"
                description="Introduce wiring and signal-quality conditions."
              >
                <div className="space-y-3">
                  <Toggle
                    checked={openWire}
                    disabled={
                      mode === "off"
                    }
                    label="Open wire"
                    description="Disconnect the field signal from the terminal."
                    onChange={() =>
                      setOpenWire(
                        (current) =>
                          !current,
                      )
                    }
                  />

                  <Toggle
                    checked={
                      electricalNoise
                    }
                    disabled={
                      mode === "off"
                    }
                    label="Electrical noise"
                    description="Add random variation before filtering."
                    onChange={() =>
                      setElectricalNoise(
                        (current) =>
                          !current,
                      )
                    }
                  />

                  {inputType ===
                  "digital" ? (
                    <Toggle
                      checked={
                        lineMonitoring
                      }
                      disabled={
                        mode === "off"
                      }
                      label="Line monitoring"
                      description="Allow the teaching model to diagnose an open digital cable."
                      onChange={() =>
                        setLineMonitoring(
                          (current) =>
                            !current,
                        )
                      }
                    />
                  ) : null}

                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor="filter-strength"
                        className="text-sm font-semibold text-slate-800"
                      >
                        Filter strength
                      </label>

                      <span className="font-mono text-sm font-semibold text-blue-700">
                        {filterStrength}%
                      </span>
                    </div>

                    <input
                      id="filter-strength"
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={
                        filterStrength
                      }
                      onChange={(
                        event,
                      ) =>
                        setFilterStrength(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="mt-4 w-full accent-blue-600"
                    />

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Higher filtering produces
                      a steadier result but
                      responds more slowly to
                      signal changes.
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                title="Teaching speed"
                description="Slow the read cycle so each internal stage is visible."
              >
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="cycle-speed"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full read cycle
                  </label>

                  <span className="font-mono text-sm font-semibold text-blue-700">
                    {cycleDuration} ms
                  </span>
                </div>

                <input
                  id="cycle-speed"
                  type="range"
                  min={1000}
                  max={5000}
                  step={100}
                  value={
                    cycleDuration
                  }
                  onChange={(
                    event,
                  ) =>
                    setCycleDuration(
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
            </aside>

            {/* Right learning area */}

            <section className="min-w-0 space-y-5">
              <InputModuleCanvas
                mode={mode}
                stage={stage}
                inputType={inputType}
                sample={sample}
                digitalVoltage={
                  digitalVoltage
                }
                analogCurrent={
                  analogCurrent
                }
                openWire={openWire}
                lineMonitoring={
                  lineMonitoring
                }
                selectedComponent={
                  selectedComponent
                }
                onSelectComponent={
                  setSelectedComponent
                }
              />

              {/* Read sequence */}

              <Card
                title="Input conversion sequence"
                description="The module completes these stages before the CPU receives the channel value."
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

                <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-5">
                  {(
                    [
                      "receive",
                      "protect",
                      "condition",
                      "convert",
                      "store",
                    ] as const
                  ).map(
                    (
                      item,
                      index,
                    ) => {
                      const information =
                        STAGE_INFORMATION[
                          item
                        ];

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
                            {
                              information.shortTitle
                            }
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
                      {
                        stageInformation.title
                      }
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      {
                        stageInformation.description
                      }
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Card>

              {/* Component information and current result */}

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                <Card
                  title="Selected input component"
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
                          selectedDetails.title
                        }
                      </StatusBadge>

                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {
                          selectedDetails.description
                        }
                      </p>

                      <ul className="mt-4 space-y-2">
                        {selectedDetails.points.map(
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
                  title="Channel result"
                  description="Values from the most recently completed conversion."
                >
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        CPU address
                      </p>

                      <p className="mt-1 font-mono text-2xl font-bold text-blue-700">
                        {getAddress(
                          inputType,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Process-image value
                      </p>

                      <p className="mt-1 font-mono text-2xl font-bold text-slate-900">
                        {
                          sample.processImage
                        }
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Engineering value
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {
                          engineeringDisplay
                        }
                      </p>
                    </div>

                    <div
                      className={[
                        "rounded-xl border p-3",

                        getQualityClasses(
                          sample.quality,
                        ),
                      ].join(" ")}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Channel quality
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {qualityLabel}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Signal values */}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card title="Electrical input">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        Raw signal
                      </span>

                      <strong className="font-mono text-sm">
                        {formatSignal(
                          sample.rawSignal,
                          inputType,
                        )}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        Protected
                      </span>

                      <strong className="font-mono text-sm">
                        {formatSignal(
                          sample.protectedSignal,
                          inputType,
                        )}
                      </strong>
                    </div>
                  </div>
                </Card>

                <Card title="Conditioned signal">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        Filtered
                      </span>

                      <strong className="font-mono text-sm">
                        {formatSignal(
                          sample.filteredSignal,
                          inputType,
                        )}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        Filter
                      </span>

                      <strong className="font-mono text-sm">
                        {filterStrength}%
                      </strong>
                    </div>
                  </div>
                </Card>

                <Card title="Conversion">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        Converted
                      </span>

                      <strong className="font-mono text-sm">
                        {
                          sample.convertedValue
                        }
                      </strong>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        Resolution
                      </span>

                      <strong className="text-sm">
                        {inputType ===
                        "digital"
                          ? "1 bit"
                          : "12-bit model"}
                      </strong>
                    </div>
                  </div>
                </Card>

                <Card title="CPU-visible data">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        Stored value
                      </span>

                      <strong className="font-mono text-sm">
                        {
                          sample.processImage
                        }
                      </strong>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        Read cycles
                      </span>

                      <strong className="font-mono text-sm">
                        {scanCount}
                      </strong>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Diagnostics */}

              <Card
                title="Module diagnostics"
                description="The diagnostic state is updated during conversion."
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                  <div
                    className={[
                      "rounded-xl border p-4",

                      getQualityClasses(
                        sample.quality,
                      ),
                    ].join(" ")}
                  >
                    <p className="font-semibold">
                      {qualityLabel} channel
                      quality
                    </p>

                    <p className="mt-1 text-sm leading-6">
                      {
                        sample.diagnostic
                      }
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                    <Led
                      active={
                        sample.quality ===
                        "good"
                      }
                      label="Channel healthy"
                    />

                    <Led
                      active={
                        sample.quality ===
                        "uncertain"
                      }
                      warning
                      label="Condition uncertain"
                    />

                    <Led
                      active={
                        sample.quality ===
                        "bad"
                      }
                      danger
                      label="Channel fault"
                    />
                  </div>
                </div>
              </Card>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <strong>
                  Teaching-model note:
                </strong>{" "}
                voltage thresholds, ADC
                resolution, filtering,
                diagnostics and raw-value
                formats vary among real PLC
                manufacturers and input
                modules. Match a real
                installation to its module
                datasheet and wiring manual.
              </div>
            </section>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}