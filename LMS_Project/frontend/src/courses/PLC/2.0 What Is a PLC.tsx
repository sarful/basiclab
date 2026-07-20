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

type ComponentId =
  | "sensor"
  | "inputModule"
  | "cpu"
  | "memory"
  | "program"
  | "outputModule"
  | "motor"
  | "valve"
  | "alarm";

type PhysicalInputs = {
  start: boolean;
  stop: boolean;
  level: boolean;
};

type InputImage = {
  start: boolean;
  stop: boolean;
  level: boolean;
};

type OutputImage = {
  motor: boolean;
  valve: boolean;
  alarm: boolean;
};

type PhysicalOutputs = {
  motor: boolean;
  valve: boolean;
  alarm: boolean;
};

type ComponentInformation = {
  title: string;
  description: string;
  example: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const EMPTY_INPUTS: PhysicalInputs = {
  start: false,
  stop: false,
  level: false,
};

const EMPTY_INPUT_IMAGE: InputImage = {
  start: false,
  stop: false,
  level: false,
};

const EMPTY_OUTPUTS: OutputImage = {
  motor: false,
  valve: false,
  alarm: false,
};

const SCAN_INFORMATION: Record<
  ScanStage,
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
    title: "PLC ready",
    shortTitle: "Idle",
    description:
      "Power the PLC and run a scan to observe how it reads inputs, executes logic, and controls outputs.",
    progress: 0,
  },

  read: {
    number: 1,
    title: "Read physical inputs",
    shortTitle: "Read",
    description:
      "The input module copies the current START, STOP, and LEVEL sensor states into the input process image.",
    progress: 25,
  },

  execute: {
    number: 2,
    title: "Execute the control program",
    shortTitle: "Execute",
    description:
      "The CPU reads the stored input image and solves the control logic from the user program.",
    progress: 50,
  },

  write: {
    number: 3,
    title: "Update physical outputs",
    shortTitle: "Write",
    description:
      "The output module transfers the calculated output-image values to the motor, valve, and alarm.",
    progress: 75,
  },

  service: {
    number: 4,
    title: "Perform system services",
    shortTitle: "Service",
    description:
      "The PLC performs diagnostics, communication, timing, and housekeeping before beginning the next scan.",
    progress: 100,
  },
};

const COMPONENT_INFORMATION: Record<
  ComponentId,
  ComponentInformation
> = {
  sensor: {
    title: "Field Sensors and Switches",
    description:
      "Field inputs detect conditions in the machine and convert them into electrical signals.",
    example:
      "Examples include push buttons, limit switches, proximity sensors, pressure switches, and level sensors.",
  },

  inputModule: {
    title: "PLC Input Module",
    description:
      "The input module protects, conditions, isolates, and converts field signals into CPU-readable values.",
    example:
      "A 24 VDC sensor signal may become the Boolean input-process-image value I0.0 = 1.",
  },

  cpu: {
    title: "PLC CPU",
    description:
      "The CPU coordinates the PLC and repeatedly executes the control program.",
    example:
      "It reads input memory, evaluates instructions, updates output memory, and performs communication and diagnostics.",
  },

  memory: {
    title: "PLC Memory",
    description:
      "PLC memory stores the user program, input image, output image, data registers, timers, counters, and internal states.",
    example:
      "The input and output process images allow the program to use a stable snapshot during one scan cycle.",
  },

  program: {
    title: "User Control Program",
    description:
      "The control program contains the instructions that define how the machine should respond to its inputs.",
    example:
      "The motor seal-in logic is: Motor = (START OR previous Motor) AND NOT STOP.",
  },

  outputModule: {
    title: "PLC Output Module",
    description:
      "The output module converts CPU output commands into electrical signals suitable for field actuators.",
    example:
      "Relay, transistor, triac, and analog output modules control different kinds of industrial loads.",
  },

  motor: {
    title: "Motor Actuator",
    description:
      "The motor converts electrical energy into mechanical rotation.",
    example:
      "The motor starts when Q0.0 is ON and remains running through the internal seal-in memory until STOP is activated.",
  },

  valve: {
    title: "Solenoid Valve",
    description:
      "The solenoid valve converts an electrical command into fluid or pneumatic flow control.",
    example:
      "In this simulation, the valve opens while the tank-level sensor is OFF.",
  },

  alarm: {
    title: "Warning Alarm",
    description:
      "The alarm provides a visible warning when the STOP or fault condition is active.",
    example:
      "Q0.2 becomes ON whenever the STOP input is detected during program execution.",
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

function bit(value: boolean): number {
  return value ? 1 : 0;
}

function byteString(values: boolean[]): string {
  return values
    .map((value) => (value ? "1" : "0"))
    .join("");
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

      <div className="mt-4">{children}</div>
    </section>
  );
}

function StatusBadge({
  active,
  tone = "blue",
  children,
}: {
  active: boolean;
  tone?: "blue" | "green" | "amber" | "red";
  children: ReactNode;
}) {
  const toneClasses = {
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
          ? toneClasses[tone]
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
                scale: [1, 1.18, 1],

                boxShadow: danger
                  ? [
                      "0 0 0 rgba(239,68,68,0)",
                      "0 0 10px rgba(239,68,68,.5)",
                      "0 0 0 rgba(239,68,68,0)",
                    ]
                  : [
                      "0 0 0 rgba(16,185,129,0)",
                      "0 0 10px rgba(16,185,129,.5)",
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
  description,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  address: string;
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
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-800">
            {label}
          </p>

          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-blue-700">
            {address}
          </span>
        </div>

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
   ACCESSIBLE SVG COMPONENT
========================================================= */

function DiagramNode({
  id,
  active,
  selected,
  children,
  onSelect,
}: {
  id: ComponentId;
  active: boolean;
  selected: boolean;
  children: ReactNode;
  onSelect: (id: ComponentId) => void;
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
      aria-label={`Inspect ${COMPONENT_INFORMATION[id].title}`}
      className="cursor-pointer outline-none"
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
      animate={
        active
          ? {
              filter: [
                "drop-shadow(0 0 0 rgba(37,99,235,0))",
                "drop-shadow(0 0 12px rgba(37,99,235,.3))",
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
   PLC ARCHITECTURE CANVAS
========================================================= */

function PlcArchitectureCanvas({
  mode,
  stage,
  physicalInputs,
  inputImage,
  outputImage,
  physicalOutputs,
  motorLatch,
  selectedComponent,
  onSelectComponent,
}: {
  mode: PlcMode;
  stage: ScanStage;
  physicalInputs: PhysicalInputs;
  inputImage: InputImage;
  outputImage: OutputImage;
  physicalOutputs: PhysicalOutputs;
  motorLatch: boolean;
  selectedComponent: ComponentId;
  onSelectComponent: (
    component: ComponentId,
  ) => void;
}) {
  const powered = mode !== "off";

  const nodeClass = (
    id: ComponentId,
    active: boolean,
  ): string =>
    [
      "fill-white stroke-[3]",

      selectedComponent === id
        ? "stroke-blue-600"
        : active
          ? "stroke-blue-400"
          : "stroke-slate-300",
    ].join(" ");

  const pathClass = (
    active: boolean,
  ): string =>
    [
      "fill-none stroke-[4]",

      active
        ? "stroke-blue-600"
        : "stroke-slate-300",
    ].join(" ");

  const readActive = stage === "read";
  const executeActive = stage === "execute";
  const writeActive = stage === "write";
  const serviceActive = stage === "service";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            PLC control architecture
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Sensors → input module → CPU →
            output module → actuators
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
              ? "PLC RUNNING"
              : "PLC STOPPED"}
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

      <div className="relative w-full overflow-x-auto bg-white">
        <div className="min-w-[920px]">
          <svg
            viewBox="0 0 1240 790"
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto w-full"
            role="img"
            aria-label="PLC system showing field inputs, input module, CPU, memory, program, output module, motor, valve, and alarm"
          >
            <defs>
              <pattern
                id="plcGrid"
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
              width="1240"
              height="790"
              fill="url(#plcGrid)"
            />

            <rect
              x="30"
              y="35"
              width="1180"
              height="690"
              rx="28"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="3"
            />

            <text
              x="60"
              y="78"
              fill="#0f172a"
              fontSize="22"
              fontWeight="800"
            >
              PROGRAMMABLE LOGIC CONTROLLER
            </text>

            <text
              x="60"
              y="105"
              fill="#64748b"
              fontSize="13"
            >
              A rugged industrial computer for
              automatic machine and process
              control
            </text>

            {/* Main signal paths */}

            <path
              d="M225 345 H280"
              className={pathClass(readActive)}
              strokeDasharray={
                readActive ? "12 9" : undefined
              }
              markerEnd={
                readActive
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            <path
              d="M420 345 H480"
              className={pathClass(readActive)}
              strokeDasharray={
                readActive ? "12 9" : undefined
              }
              markerEnd={
                readActive
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            <path
              d="M760 345 H820"
              className={pathClass(writeActive)}
              strokeDasharray={
                writeActive ? "12 9" : undefined
              }
              markerEnd={
                writeActive
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            <path
              d="M960 345 H1015"
              className={pathClass(writeActive)}
              strokeDasharray={
                writeActive ? "12 9" : undefined
              }
              markerEnd={
                writeActive
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            {/* Memory and program internal paths */}

            <path
              d="M620 245 V210"
              className={pathClass(executeActive)}
              strokeDasharray={
                executeActive ? "10 8" : undefined
              }
              markerEnd={
                executeActive
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            <path
              d="M620 475 V520"
              className={pathClass(executeActive)}
              strokeDasharray={
                executeActive ? "10 8" : undefined
              }
              markerEnd={
                executeActive
                  ? "url(#blueArrow)"
                  : "url(#grayArrow)"
              }
            />

            {/* Feedback */}

            <path
              d="M1105 600 V670 H620 V475"
              fill="none"
              stroke={
                serviceActive
                  ? "#8b5cf6"
                  : "#cbd5e1"
              }
              strokeWidth="4"
              strokeDasharray="9 8"
              markerEnd={
                serviceActive
                  ? "url(#violetArrow)"
                  : "url(#grayArrow)"
              }
            />

            <text
              x="865"
              y="697"
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              Optional actuator and process
              feedback
            </text>

            {/* Physical input devices */}

            <DiagramNode
              id="sensor"
              active={readActive}
              selected={
                selectedComponent === "sensor"
              }
              onSelect={onSelectComponent}
            >
              <rect
                x="60"
                y="235"
                width="165"
                height="220"
                rx="20"
                className={nodeClass(
                  "sensor",
                  readActive,
                )}
              />

              <text
                x="142"
                y="270"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="14"
                fontWeight="700"
              >
                FIELD INPUTS
              </text>

              {[
                {
                  label: "START",
                  address: "I0.0",
                  active:
                    physicalInputs.start,
                  danger: false,
                },
                {
                  label: "STOP",
                  address: "I0.1",
                  active:
                    physicalInputs.stop,
                  danger: true,
                },
                {
                  label: "LEVEL",
                  address: "I0.2",
                  active:
                    physicalInputs.level,
                  danger: false,
                },
              ].map((input, index) => (
                <g key={input.address}>
                  <circle
                    cx="94"
                    cy={315 + index * 50}
                    r="12"
                    fill={
                      input.active
                        ? input.danger
                          ? "#ef4444"
                          : "#10b981"
                        : "#e2e8f0"
                    }
                    stroke={
                      input.active
                        ? input.danger
                          ? "#dc2626"
                          : "#059669"
                        : "#94a3b8"
                    }
                    strokeWidth="3"
                  />

                  <text
                    x="118"
                    y={311 + index * 50}
                    fill="#334155"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {input.label}
                  </text>

                  <text
                    x="118"
                    y={328 + index * 50}
                    fill="#64748b"
                    fontSize="9"
                  >
                    {input.address}
                  </text>
                </g>
              ))}
            </DiagramNode>

            {/* Input module */}

            <DiagramNode
              id="inputModule"
              active={readActive}
              selected={
                selectedComponent ===
                "inputModule"
              }
              onSelect={onSelectComponent}
            >
              <rect
                x="280"
                y="235"
                width="140"
                height="220"
                rx="20"
                className={nodeClass(
                  "inputModule",
                  readActive,
                )}
              />

              <text
                x="350"
                y="270"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                INPUT MODULE
              </text>

              <rect
                x="304"
                y="300"
                width="92"
                height="100"
                rx="10"
                fill="#eff6ff"
                stroke="#93c5fd"
                strokeWidth="2"
              />

              <text
                x="350"
                y="325"
                textAnchor="middle"
                fill="#1d4ed8"
                fontSize="11"
                fontWeight="700"
              >
                I0.0 = {bit(inputImage.start)}
              </text>

              <text
                x="350"
                y="350"
                textAnchor="middle"
                fill="#1d4ed8"
                fontSize="11"
                fontWeight="700"
              >
                I0.1 = {bit(inputImage.stop)}
              </text>

              <text
                x="350"
                y="375"
                textAnchor="middle"
                fill="#1d4ed8"
                fontSize="11"
                fontWeight="700"
              >
                I0.2 = {bit(inputImage.level)}
              </text>

              <text
                x="350"
                y="428"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                PROTECT · FILTER · ISOLATE
              </text>
            </DiagramNode>

            {/* CPU */}

            <DiagramNode
              id="cpu"
              active={
                executeActive || serviceActive
              }
              selected={
                selectedComponent === "cpu"
              }
              onSelect={onSelectComponent}
            >
              <rect
                x="480"
                y="245"
                width="280"
                height="230"
                rx="24"
                fill="#eff6ff"
                stroke={
                  selectedComponent === "cpu"
                    ? "#2563eb"
                    : executeActive ||
                        serviceActive
                      ? "#60a5fa"
                      : "#2563eb"
                }
                strokeWidth="4"
              />

              <text
                x="620"
                y="283"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="20"
                fontWeight="800"
              >
                PLC CPU
              </text>

              <rect
                x="520"
                y="310"
                width="200"
                height="82"
                rx="12"
                fill="#0f172a"
              />

              <text
                x="620"
                y="341"
                textAnchor="middle"
                fill="#86efac"
                fontSize="16"
                fontWeight="800"
              >
                {!powered
                  ? "OFF"
                  : stage === "idle"
                    ? "READY"
                    : stage.toUpperCase()}
              </text>

              <text
                x="620"
                y="368"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="11"
              >
                {stage === "execute"
                  ? "Solving user-program logic"
                  : stage === "read"
                    ? "Receiving input image"
                    : stage === "write"
                      ? "Sending output image"
                      : stage === "service"
                        ? "Diagnostics and communication"
                        : powered
                          ? "Waiting for next scan"
                          : "No program execution"}
              </text>

              <text
                x="620"
                y="425"
                textAnchor="middle"
                fill="#475569"
                fontSize="11"
              >
                Repeats the scan cycle while in
                RUN mode
              </text>
            </DiagramNode>

            {/* Program memory */}

            <DiagramNode
              id="program"
              active={executeActive}
              selected={
                selectedComponent === "program"
              }
              onSelect={onSelectComponent}
            >
              <rect
                x="500"
                y="125"
                width="240"
                height="85"
                rx="18"
                className={nodeClass(
                  "program",
                  executeActive,
                )}
              />

              <text
                x="620"
                y="154"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                USER CONTROL PROGRAM
              </text>

              <text
                x="620"
                y="179"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="10"
                fontWeight="700"
              >
                Motor = (START OR M0) AND NOT
                STOP
              </text>

              <text
                x="620"
                y="196"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                Valve = NOT LEVEL · Alarm =
                STOP
              </text>
            </DiagramNode>

            {/* Memory */}

            <DiagramNode
              id="memory"
              active={executeActive}
              selected={
                selectedComponent === "memory"
              }
              onSelect={onSelectComponent}
            >
              <rect
                x="500"
                y="520"
                width="240"
                height="105"
                rx="18"
                className={nodeClass(
                  "memory",
                  executeActive,
                )}
              />

              <text
                x="620"
                y="551"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                PLC MEMORY
              </text>

              <text
                x="620"
                y="580"
                textAnchor="middle"
                fill="#2563eb"
                fontSize="11"
                fontWeight="700"
              >
                M0 = {bit(motorLatch)}
              </text>

              <text
                x="620"
                y="603"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                Input image · output image ·
                data · timers · counters
              </text>
            </DiagramNode>

            {/* Output module */}

            <DiagramNode
              id="outputModule"
              active={writeActive}
              selected={
                selectedComponent ===
                "outputModule"
              }
              onSelect={onSelectComponent}
            >
              <rect
                x="820"
                y="235"
                width="140"
                height="220"
                rx="20"
                className={nodeClass(
                  "outputModule",
                  writeActive,
                )}
              />

              <text
                x="890"
                y="270"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                OUTPUT MODULE
              </text>

              <rect
                x="844"
                y="300"
                width="92"
                height="100"
                rx="10"
                fill="#eff6ff"
                stroke="#93c5fd"
                strokeWidth="2"
              />

              <text
                x="890"
                y="325"
                textAnchor="middle"
                fill="#1d4ed8"
                fontSize="11"
                fontWeight="700"
              >
                Q0.0 = {bit(outputImage.motor)}
              </text>

              <text
                x="890"
                y="350"
                textAnchor="middle"
                fill="#1d4ed8"
                fontSize="11"
                fontWeight="700"
              >
                Q0.1 = {bit(outputImage.valve)}
              </text>

              <text
                x="890"
                y="375"
                textAnchor="middle"
                fill="#1d4ed8"
                fontSize="11"
                fontWeight="700"
              >
                Q0.2 = {bit(outputImage.alarm)}
              </text>

              <text
                x="890"
                y="428"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
              >
                RELAY · TRANSISTOR · ANALOG
              </text>
            </DiagramNode>

            {/* Motor actuator */}

            <DiagramNode
              id="motor"
              active={physicalOutputs.motor}
              selected={
                selectedComponent === "motor"
              }
              onSelect={onSelectComponent}
            >
              <rect
                x="1015"
                y="190"
                width="165"
                height="150"
                rx="20"
                className={nodeClass(
                  "motor",
                  physicalOutputs.motor,
                )}
              />

              <text
                x="1097"
                y="221"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                MOTOR
              </text>

              <circle
                cx="1097"
                cy="270"
                r="38"
                fill="#ffffff"
                stroke={
                  physicalOutputs.motor
                    ? "#2563eb"
                    : "#94a3b8"
                }
                strokeWidth="4"
              />

              <motion.g
                style={{
                  transformOrigin:
                    "1097px 270px",
                }}
                animate={{
                  rotate:
                    physicalOutputs.motor
                      ? 360
                      : 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "linear",
                  repeat:
                    physicalOutputs.motor
                      ? Number.POSITIVE_INFINITY
                      : 0,
                }}
              >
                <line
                  x1="1097"
                  y1="238"
                  x2="1097"
                  y2="302"
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <line
                  x1="1065"
                  y1="270"
                  x2="1129"
                  y2="270"
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <line
                  x1="1074"
                  y1="247"
                  x2="1120"
                  y2="293"
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <line
                  x1="1120"
                  y1="247"
                  x2="1074"
                  y2="293"
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </motion.g>

              <text
                x="1097"
                y="326"
                textAnchor="middle"
                fill={
                  physicalOutputs.motor
                    ? "#059669"
                    : "#64748b"
                }
                fontSize="10"
                fontWeight="700"
              >
                {physicalOutputs.motor
                  ? "RUNNING"
                  : "STOPPED"}
              </text>
            </DiagramNode>

            {/* Valve */}

            <DiagramNode
              id="valve"
              active={physicalOutputs.valve}
              selected={
                selectedComponent === "valve"
              }
              onSelect={onSelectComponent}
            >
              <rect
                x="1015"
                y="365"
                width="165"
                height="120"
                rx="20"
                className={nodeClass(
                  "valve",
                  physicalOutputs.valve,
                )}
              />

              <text
                x="1097"
                y="396"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                SOLENOID VALVE
              </text>

              <path
                d="M1055 430 L1085 410 V450 Z"
                fill={
                  physicalOutputs.valve
                    ? "#2563eb"
                    : "#e2e8f0"
                }
                stroke="#64748b"
                strokeWidth="3"
              />

              <path
                d="M1140 430 L1110 410 V450 Z"
                fill={
                  physicalOutputs.valve
                    ? "#2563eb"
                    : "#e2e8f0"
                }
                stroke="#64748b"
                strokeWidth="3"
              />

              <line
                x1="1085"
                y1="430"
                x2="1110"
                y2="430"
                stroke="#475569"
                strokeWidth="4"
              />

              <text
                x="1097"
                y="472"
                textAnchor="middle"
                fill={
                  physicalOutputs.valve
                    ? "#059669"
                    : "#64748b"
                }
                fontSize="10"
                fontWeight="700"
              >
                {physicalOutputs.valve
                  ? "OPEN"
                  : "CLOSED"}
              </text>
            </DiagramNode>

            {/* Alarm */}

            <DiagramNode
              id="alarm"
              active={physicalOutputs.alarm}
              selected={
                selectedComponent === "alarm"
              }
              onSelect={onSelectComponent}
            >
              <rect
                x="1015"
                y="510"
                width="165"
                height="115"
                rx="20"
                className={nodeClass(
                  "alarm",
                  physicalOutputs.alarm,
                )}
              />

              <text
                x="1097"
                y="541"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="700"
              >
                WARNING ALARM
              </text>

              <motion.circle
                cx="1097"
                cy="575"
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
                  duration: 0.65,
                  repeat:
                    physicalOutputs.alarm
                      ? Number.POSITIVE_INFINITY
                      : 0,
                }}
              />

              <text
                x="1097"
                y="614"
                textAnchor="middle"
                fill={
                  physicalOutputs.alarm
                    ? "#dc2626"
                    : "#64748b"
                }
                fontSize="10"
                fontWeight="700"
              >
                {physicalOutputs.alarm
                  ? "ACTIVE"
                  : "NORMAL"}
              </text>
            </DiagramNode>

            {/* Animated signal packets */}

            <AnimatePresence>
              {stage === "read" ? (
                <>
                  <motion.circle
                    key="input-packet-1"
                    r="7"
                    fill="#2563eb"
                    initial={{
                      cx: 225,
                      cy: 345,
                      opacity: 0,
                    }}
                    animate={{
                      cx: [225, 280],
                      cy: [345, 345],
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

                  <motion.circle
                    key="input-packet-2"
                    r="7"
                    fill="#2563eb"
                    initial={{
                      cx: 420,
                      cy: 345,
                      opacity: 0,
                    }}
                    animate={{
                      cx: [420, 480],
                      cy: [345, 345],
                      opacity: [0, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
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

              {stage === "execute" ? (
                <>
                  <motion.circle
                    key="program-packet"
                    r="7"
                    fill="#2563eb"
                    initial={{
                      cx: 620,
                      cy: 245,
                      opacity: 0,
                    }}
                    animate={{
                      cx: [620, 620],
                      cy: [245, 210],
                      opacity: [0, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.75,
                      repeat:
                        Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />

                  <motion.circle
                    key="memory-packet"
                    r="7"
                    fill="#7c3aed"
                    initial={{
                      cx: 620,
                      cy: 475,
                      opacity: 0,
                    }}
                    animate={{
                      cx: [620, 620],
                      cy: [475, 520],
                      opacity: [0, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.75,
                      repeat:
                        Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: 0.15,
                    }}
                  />
                </>
              ) : null}

              {stage === "write" ? (
                <>
                  <motion.circle
                    key="output-packet-1"
                    r="7"
                    fill="#2563eb"
                    initial={{
                      cx: 760,
                      cy: 345,
                      opacity: 0,
                    }}
                    animate={{
                      cx: [760, 820],
                      cy: [345, 345],
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

                  <motion.circle
                    key="output-packet-2"
                    r="7"
                    fill="#10b981"
                    initial={{
                      cx: 960,
                      cy: 345,
                      opacity: 0,
                    }}
                    animate={{
                      cx: [960, 1015],
                      cy: [345, 345],
                      opacity: [0, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
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

              {stage === "service" ? (
                <motion.circle
                  key="feedback-packet"
                  r="7"
                  fill="#8b5cf6"
                  initial={{
                    cx: 1105,
                    cy: 600,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [
                      1105,
                      1105,
                      620,
                      620,
                    ],
                    cy: [
                      600,
                      670,
                      670,
                      475,
                    ],
                    opacity: [0, 1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
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
              x="620"
              y="755"
              textAnchor="middle"
              fill="#64748b"
              fontSize="12"
            >
              A PLC repeatedly reads field
              conditions, executes logic, and
              updates machine actuators.
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
                Power the PLC from the left
                control panel, change the field
                inputs, and run a scan.
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

export default function WhatIsAPlcPage() {
  const [mode, setMode] =
    useState<PlcMode>("off");

  const [stage, setStage] =
    useState<ScanStage>("idle");

  const [busy, setBusy] =
    useState(false);

  const [scanCount, setScanCount] =
    useState(0);

  const [cycleDuration, setCycleDuration] =
    useState(2200);

  const [
    physicalInputs,
    setPhysicalInputs,
  ] =
    useState<PhysicalInputs>(
      EMPTY_INPUTS,
    );

  const [inputImage, setInputImage] =
    useState<InputImage>(
      EMPTY_INPUT_IMAGE,
    );

  const [motorLatch, setMotorLatch] =
    useState(false);

  const [outputImage, setOutputImage] =
    useState<OutputImage>(
      EMPTY_OUTPUTS,
    );

  const [
    physicalOutputs,
    setPhysicalOutputs,
  ] =
    useState<PhysicalOutputs>(
      EMPTY_OUTPUTS,
    );

  const [
    selectedComponent,
    setSelectedComponent,
  ] =
    useState<ComponentId>("cpu");

  /* =======================================================
     REFS USED BY THE ASYNCHRONOUS SCAN LOOP
  ======================================================= */

  const modeRef =
    useRef<PlcMode>(mode);

  const busyRef = useRef(false);

  const abortVersionRef = useRef(0);

  const cycleDurationRef =
    useRef(cycleDuration);

  const physicalInputsRef =
    useRef<PhysicalInputs>(
      physicalInputs,
    );

  const inputImageRef =
    useRef<InputImage>(
      inputImage,
    );

  const outputImageRef =
    useRef<OutputImage>(
      outputImage,
    );

  const motorLatchRef =
    useRef(motorLatch);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    cycleDurationRef.current =
      cycleDuration;
  }, [cycleDuration]);

  useEffect(() => {
    physicalInputsRef.current =
      physicalInputs;
  }, [physicalInputs]);

  useEffect(() => {
    inputImageRef.current =
      inputImage;
  }, [inputImage]);

  useEffect(() => {
    outputImageRef.current =
      outputImage;
  }, [outputImage]);

  useEffect(() => {
    motorLatchRef.current =
      motorLatch;
  }, [motorLatch]);

  const stageInformation =
    SCAN_INFORMATION[stage];

  const selectedInformation =
    COMPONENT_INFORMATION[
      selectedComponent
    ];

  /* =======================================================
     PHYSICAL INPUT CONTROL
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
     PLC SCAN
  ======================================================= */

  const performScan =
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
            170,
            Math.round(
              cycleDurationRef.current /
                4,
            ),
          );

        const validScan = () =>
          token ===
            abortVersionRef.current &&
          modeRef.current !== "off";

        try {
          /*
           * Stage 1: Read physical inputs.
           */

          setStage("read");

          const snapshot = {
            ...physicalInputsRef.current,
          };

          inputImageRef.current =
            snapshot;

          setInputImage(snapshot);

          await wait(phaseDuration);

          if (!validScan()) {
            return false;
          }

          /*
           * Stage 2: Execute user program.
           */

          setStage("execute");

          const previousLatch =
            motorLatchRef.current;

          const nextMotorLatch =
            (
              snapshot.start ||
              previousLatch
            ) &&
            !snapshot.stop;

          /*
           * Demonstration logic:
           *
           * M0 = (I0.0 OR M0) AND NOT I0.1
           * Q0.0 = M0
           * Q0.1 = NOT I0.2 AND NOT I0.1
           * Q0.2 = I0.1
           */

          const nextOutputImage: OutputImage =
            {
              motor:
                nextMotorLatch,

              valve:
                !snapshot.level &&
                !snapshot.stop,

              alarm:
                snapshot.stop,
            };

          motorLatchRef.current =
            nextMotorLatch;

          outputImageRef.current =
            nextOutputImage;

          setMotorLatch(
            nextMotorLatch,
          );

          setOutputImage(
            nextOutputImage,
          );

          await wait(phaseDuration);

          if (!validScan()) {
            return false;
          }

          /*
           * Stage 3: Write output image.
           */

          setStage("write");

          setPhysicalOutputs({
            ...nextOutputImage,
          });

          await wait(phaseDuration);

          if (!validScan()) {
            return false;
          }

          /*
           * Stage 4: System services.
           */

          setStage("service");

          setScanCount(
            (current) =>
              current + 1,
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
     POWER CONTROL
  ======================================================= */

  const togglePower =
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

        inputImageRef.current =
          EMPTY_INPUT_IMAGE;

        outputImageRef.current =
          EMPTY_OUTPUTS;

        motorLatchRef.current =
          false;

        setInputImage(
          EMPTY_INPUT_IMAGE,
        );

        setMotorLatch(false);

        setOutputImage(
          EMPTY_OUTPUTS,
        );

        setPhysicalOutputs(
          EMPTY_OUTPUTS,
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

  /* =======================================================
     RESET
  ======================================================= */

  const resetSimulation =
    useCallback(() => {
      abortVersionRef.current += 1;

      modeRef.current = "off";
      busyRef.current = false;

      physicalInputsRef.current =
        EMPTY_INPUTS;

      inputImageRef.current =
        EMPTY_INPUT_IMAGE;

      outputImageRef.current =
        EMPTY_OUTPUTS;

      motorLatchRef.current =
        false;

      cycleDurationRef.current =
        2200;

      setMode("off");
      setStage("idle");
      setBusy(false);
      setScanCount(0);
      setCycleDuration(2200);

      setPhysicalInputs(
        EMPTY_INPUTS,
      );

      setInputImage(
        EMPTY_INPUT_IMAGE,
      );

      setMotorLatch(false);

      setOutputImage(
        EMPTY_OUTPUTS,
      );

      setPhysicalOutputs(
        EMPTY_OUTPUTS,
      );

      setSelectedComponent("cpu");
    }, []);

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-white px-3 py-4 text-slate-900 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}

          <header className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    active={mode !== "off"}
                    tone="green"
                  >
                    {mode !== "off"
                      ? "POWER ON"
                      : "POWER OFF"}
                  </StatusBadge>

                  <StatusBadge
                    active={mode === "run"}
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
                  What Is a PLC?
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                  A Programmable Logic
                  Controller is a rugged
                  industrial computer that
                  reads sensors, executes a
                  stored control program, and
                  commands machines through
                  output devices.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <MetricCard
                  label="PLC mode"
                  value={mode.toUpperCase()}
                  helper="Current operating state"
                />

                <MetricCard
                  label="Scan stage"
                  value={
                    stageInformation.shortTitle
                  }
                  helper="Current CPU operation"
                />

                <MetricCard
                  label="Completed scans"
                  value={scanCount}
                  helper="Finished scan cycles"
                />

                <MetricCard
                  label="Output byte"
                  value={byteString([
                    outputImage.motor,
                    outputImage.valve,
                    outputImage.alarm,
                    false,
                    false,
                    false,
                    false,
                    false,
                  ])}
                  helper="Q0.0–Q0.7"
                />
              </div>
            </div>
          </header>

          {/* Responsive layout */}

          <div className="grid gap-5 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)]">
            {/* Left control panel */}

            <aside className="space-y-4 md:sticky md:top-4 md:self-start">
              <Card
                title="PLC controls"
                description="Power and operate the PLC scan cycle."
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
                    whileHover={{ y: -2 }}
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
                      ? "Stop PLC"
                      : "Run PLC"}
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
                    Single Scan
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={
                      resetSimulation
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700"
                    whileHover={{ y: -2 }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    Reset
                  </motion.button>
                </div>
              </Card>

              <Card
                title="Physical field inputs"
                description="Change the sensor states read during the next scan."
              >
                <div className="space-y-3">
                  <Toggle
                    checked={
                      physicalInputs.start
                    }
                    disabled={mode === "off"}
                    label="START push button"
                    address="I0.0"
                    description="Starts and seals in the motor."
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
                    disabled={mode === "off"}
                    label="STOP push button"
                    address="I0.1"
                    description="Stops the motor and activates the alarm."
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
                    disabled={mode === "off"}
                    label="Tank level sensor"
                    address="I0.2"
                    description="Closes the filling valve when the target level is reached."
                    onChange={() =>
                      updatePhysicalInput(
                        "level",
                        !physicalInputs.level,
                      )
                    }
                  />
                </div>

                <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                  Physical inputs may change at
                  any time, but the PLC program
                  uses the values captured
                  during the input-read stage.
                </div>
              </Card>

              <Card
                title="Teaching speed"
                description="Slow the scan so each stage remains visible."
              >
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="scan-speed"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full scan cycle
                  </label>

                  <span className="font-mono text-sm font-semibold text-blue-700">
                    {cycleDuration} ms
                  </span>
                </div>

                <input
                  id="scan-speed"
                  type="range"
                  min={1000}
                  max={5000}
                  step={100}
                  value={cycleDuration}
                  onChange={(event) => {
                    const value = Number(
                      event.target.value,
                    );

                    cycleDurationRef.current =
                      value;

                    setCycleDuration(value);
                  }}
                  className="mt-4 w-full accent-blue-600"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Faster</span>
                  <span>Slower</span>
                </div>
              </Card>

              <Card
                title="Current process images"
                description="Memory values used by the CPU."
              >
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Input image
                    </p>

                    <div className="mt-2 space-y-2">
                      <Led
                        active={
                          inputImage.start
                        }
                        label={`I0.0 START = ${bit(
                          inputImage.start,
                        )}`}
                      />

                      <Led
                        active={
                          inputImage.stop
                        }
                        danger
                        label={`I0.1 STOP = ${bit(
                          inputImage.stop,
                        )}`}
                      />

                      <Led
                        active={
                          inputImage.level
                        }
                        label={`I0.2 LEVEL = ${bit(
                          inputImage.level,
                        )}`}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Output image
                    </p>

                    <div className="mt-2 space-y-2">
                      <Led
                        active={
                          outputImage.motor
                        }
                        label={`Q0.0 MOTOR = ${bit(
                          outputImage.motor,
                        )}`}
                      />

                      <Led
                        active={
                          outputImage.valve
                        }
                        label={`Q0.1 VALVE = ${bit(
                          outputImage.valve,
                        )}`}
                      />

                      <Led
                        active={
                          outputImage.alarm
                        }
                        danger
                        label={`Q0.2 ALARM = ${bit(
                          outputImage.alarm,
                        )}`}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </aside>

            {/* Right content */}

            <section className="min-w-0 space-y-5">
              <PlcArchitectureCanvas
                mode={mode}
                stage={stage}
                physicalInputs={
                  physicalInputs
                }
                inputImage={inputImage}
                outputImage={outputImage}
                physicalOutputs={
                  physicalOutputs
                }
                motorLatch={motorLatch}
                selectedComponent={
                  selectedComponent
                }
                onSelectComponent={
                  setSelectedComponent
                }
              />

              {/* Scan cycle */}

              <Card
                title="PLC scan cycle"
                description="A PLC repeatedly completes these four operations while in RUN mode."
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
                      item,
                      index,
                    ) => {
                      const information =
                        SCAN_INFORMATION[item];

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

                            <Led
                              active={active}
                            />
                          </div>

                          <p className="mt-3 text-sm font-semibold text-slate-800">
                            {
                              information.shortTitle
                            }
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {item === "read"
                              ? "Capture sensor states"
                              : item ===
                                  "execute"
                                ? "Solve control logic"
                                : item ===
                                    "write"
                                  ? "Update field devices"
                                  : "Diagnostics and communication"}
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

              {/* Component explanation */}

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
                <Card
                  title="Selected PLC component"
                  description="Click any component in the architecture canvas."
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
                          selectedInformation.title
                        }
                      </StatusBadge>

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
                  </AnimatePresence>
                </Card>

                <Card
                  title="Physical output result"
                  description="The actual actuator states after the output-write stage."
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Motor
                        </p>

                        <p className="mt-1 font-mono text-xs text-blue-700">
                          Q0.0
                        </p>
                      </div>

                      <Led
                        active={
                          physicalOutputs.motor
                        }
                        label={
                          physicalOutputs.motor
                            ? "RUNNING"
                            : "STOPPED"
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Filling valve
                        </p>

                        <p className="mt-1 font-mono text-xs text-blue-700">
                          Q0.1
                        </p>
                      </div>

                      <Led
                        active={
                          physicalOutputs.valve
                        }
                        label={
                          physicalOutputs.valve
                            ? "OPEN"
                            : "CLOSED"
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Alarm
                        </p>

                        <p className="mt-1 font-mono text-xs text-blue-700">
                          Q0.2
                        </p>
                      </div>

                      <Led
                        active={
                          physicalOutputs.alarm
                        }
                        danger
                        label={
                          physicalOutputs.alarm
                            ? "ACTIVE"
                            : "NORMAL"
                        }
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Learning summary */}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card title="Inputs">
                  <p className="text-sm leading-6 text-slate-600">
                    Sensors tell the PLC what
                    is happening in the machine
                    or process.
                  </p>

                  <div className="mt-3 font-mono text-sm font-semibold text-blue-700">
                    I0.0 · I0.1 · I0.2
                  </div>
                </Card>

                <Card title="Program">
                  <p className="text-sm leading-6 text-slate-600">
                    The user program defines
                    how input conditions should
                    control machine behavior.
                  </p>

                  <div className="mt-3 font-mono text-xs font-semibold text-blue-700">
                    Logic · timers · counters
                  </div>
                </Card>

                <Card title="Outputs">
                  <p className="text-sm leading-6 text-slate-600">
                    Output modules convert CPU
                    commands into electrical
                    signals for field devices.
                  </p>

                  <div className="mt-3 font-mono text-sm font-semibold text-blue-700">
                    Q0.0 · Q0.1 · Q0.2
                  </div>
                </Card>

                <Card title="Repeat">
                  <p className="text-sm leading-6 text-slate-600">
                    The PLC repeats the scan
                    rapidly to keep the machine
                    under continuous control.
                  </p>

                  <div className="mt-3 font-mono text-sm font-semibold text-blue-700">
                    Scan #{scanCount}
                  </div>
                </Card>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <strong>
                  Learning-model note:
                </strong>{" "}
                this simulator simplifies PLC
                timing, memory, electrical
                interfaces, diagnostics, and
                hardware behavior. Real PLC
                installations must follow the
                manufacturer documentation,
                electrical ratings, wiring
                diagrams, and machine-safety
                requirements.
              </div>
            </section>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}