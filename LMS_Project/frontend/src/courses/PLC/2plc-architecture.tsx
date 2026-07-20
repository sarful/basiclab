"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type ScanStage = 0 | 1 | 2 | 3 | 4;

type PlcInputs = {
  start: boolean;
  stop: boolean;
  level: boolean;
};

type PlcOutputs = {
  motor: boolean;
  valve: boolean;
  alarm: boolean;
};

type ModuleKey =
  | "power"
  | "input"
  | "cpu"
  | "memory"
  | "communication"
  | "output";

/* =========================================================
   CONSTANT DATA
========================================================= */

const EMPTY_INPUTS: PlcInputs = {
  start: false,
  stop: false,
  level: false,
};

const EMPTY_OUTPUTS: PlcOutputs = {
  motor: false,
  valve: false,
  alarm: false,
};

const scanStageInformation: Record<
  ScanStage,
  {
    short: string;
    title: string;
    description: string;
  }
> = {
  0: {
    short: "Idle",
    title: "PLC idle",
    description:
      "Switch on the PLC, then select Run PLC or Single Scan.",
  },
  1: {
    short: "Read",
    title: "Read physical inputs",
    description:
      "The input module reads the field devices and saves their current states in the input process-image table.",
  },
  2: {
    short: "Logic",
    title: "Execute control program",
    description:
      "The CPU executes the user program using the stored input image and previous internal states.",
  },
  3: {
    short: "Write",
    title: "Update physical outputs",
    description:
      "The CPU transfers the output process image to the output module, which energizes the connected actuators.",
  },
  4: {
    short: "Service",
    title: "Communication and diagnostics",
    description:
      "The PLC communicates with the HMI, checks diagnostics and prepares for the next scan cycle.",
  },
};

const moduleInformation: Record<
  ModuleKey,
  {
    name: string;
    purpose: string;
    lesson: string;
  }
> = {
  power: {
    name: "Power Supply",
    purpose:
      "Converts the incoming electrical supply into regulated DC power for the PLC rack.",
    lesson:
      "Many industrial PLC systems use 24 VDC for their CPU, sensors and control circuits.",
  },
  input: {
    name: "Input Module",
    purpose:
      "Receives electrical signals from push buttons, switches and sensors.",
    lesson:
      "The module isolates and converts field signals before the CPU reads them.",
  },
  cpu: {
    name: "Central Processing Unit",
    purpose:
      "Reads inputs, executes the program, calculates outputs and performs diagnostics.",
    lesson:
      "The CPU continuously repeats the scan cycle while the PLC is in RUN mode.",
  },
  memory: {
    name: "PLC Memory",
    purpose:
      "Stores the user program, variables, timer values, counter values and process-image tables.",
    lesson:
      "The input process image is a snapshot of inputs captured at the start of a scan.",
  },
  communication: {
    name: "Communication Module",
    purpose:
      "Connects the PLC with an HMI, SCADA system, engineering computer, VFD or another PLC.",
    lesson:
      "Common industrial protocols include Modbus TCP, Profinet and EtherNet/IP.",
  },
  output: {
    name: "Output Module",
    purpose:
      "Converts CPU commands into electrical signals for motors, valves, lamps and alarms.",
    lesson:
      "Output modules may use relay, transistor or triac switching technologies.",
  },
};

/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

function StatusDot({
  active,
  color = "green",
}: {
  active: boolean;
  color?: "green" | "red" | "blue" | "amber";
}) {
  const colors = {
    green: active ? "#22c55e" : "#dbe3ec",
    red: active ? "#ef4444" : "#dbe3ec",
    blue: active ? "#2563eb" : "#dbe3ec",
    amber: active ? "#f59e0b" : "#dbe3ec",
  };

  return (
    <motion.span
      aria-hidden="true"
      className="inline-block h-2.5 w-2.5 rounded-full"
      animate={{
        backgroundColor: colors[color],
        boxShadow: active
          ? `0 0 0 4px ${colors[color]}20`
          : "0 0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.2 }}
    />
  );
}

function ToggleControl({
  label,
  address,
  description,
  checked,
  disabled,
  color = "blue",
  onChange,
}: {
  label: string;
  address: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  color?: "blue" | "red" | "amber";
  onChange: () => void;
}) {
  const activeColors = {
    blue: "bg-blue-600",
    red: "bg-red-500",
    amber: "bg-amber-500",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={checked}
      onClick={onChange}
      className={[
        "group w-full rounded-xl border p-3 text-left transition",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        checked
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            checked ? activeColors[color] : "bg-slate-300",
          ].join(" ")}
        >
          <motion.span
            className="absolute top-1 h-4 w-4 rounded-full bg-white shadow"
            animate={{ left: checked ? 24 : 4 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 32,
            }}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-800">{label}</span>

            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
              {address}
            </span>
          </span>

          <span className="mt-1 block text-xs leading-5 text-slate-500">
            {description}
          </span>
        </span>
      </div>
    </button>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: ReactNode;
  helper?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div className="mt-1 text-lg font-bold text-slate-900">{value}</div>

      {helper ? (
        <p className="mt-0.5 text-xs text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

/* =========================================================
   SVG COMPONENTS
========================================================= */

function SignalPath({
  d,
  active,
  strong = false,
}: {
  d: string;
  active: boolean;
  strong?: boolean;
}) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="#d8e0e9"
        strokeWidth={strong ? 8 : 5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <motion.path
        d={d}
        fill="none"
        stroke="#2563eb"
        strokeWidth={strong ? 5 : 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="12 12"
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          strokeDashoffset: active ? [0, -48] : 0,
        }}
        transition={{
          opacity: { duration: 0.18 },
          strokeDashoffset: {
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />
    </>
  );
}

function SvgLed({
  cx,
  cy,
  active,
  color = "green",
}: {
  cx: number;
  cy: number;
  active: boolean;
  color?: "green" | "red" | "blue" | "amber";
}) {
  const activeColors = {
    green: "#22c55e",
    red: "#ef4444",
    blue: "#2563eb",
    amber: "#f59e0b",
  };

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r="9"
      stroke={active ? activeColors[color] : "#cbd5e1"}
      strokeWidth="3"
      initial={false}
      animate={{
        fill: active ? activeColors[color] : "#f1f5f9",
      }}
      transition={{ duration: 0.2 }}
    />
  );
}

function PlcModule({
  x,
  y,
  width,
  height,
  moduleKey,
  title,
  subtitle,
  selected,
  children,
  onSelect,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  moduleKey: ModuleKey;
  title: string;
  subtitle?: string;
  selected: boolean;
  children?: ReactNode;
  onSelect: (module: ModuleKey) => void;
}) {
  function handleKeyboard(event: KeyboardEvent<SVGGElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(moduleKey);
    }
  }

  return (
    <motion.g
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex={0}
      aria-label={`Learn about ${title}`}
      className="cursor-pointer outline-none"
      onClick={() => onSelect(moduleKey)}
      onKeyDown={handleKeyboard}
      whileHover={{ opacity: 0.92 }}
      whileTap={{ opacity: 0.8 }}
    >
      <title>Select {title}</title>

      <motion.rect
        width={width}
        height={height}
        rx="16"
        initial={false}
        animate={{
          fill: selected ? "#eff6ff" : "#ffffff",
          stroke: selected ? "#2563eb" : "#cbd5e1",
          strokeWidth: selected ? 4 : 2,
        }}
        transition={{ duration: 0.2 }}
      />

      <rect
        x="12"
        y="12"
        width={width - 24}
        height="8"
        rx="4"
        fill={selected ? "#2563eb" : "#e2e8f0"}
      />

      <text
        x={width / 2}
        y="48"
        textAnchor="middle"
        fill="#0f172a"
        fontSize="15"
        fontWeight="700"
      >
        {title}
      </text>

      {subtitle ? (
        <text
          x={width / 2}
          y="68"
          textAnchor="middle"
          fill="#64748b"
          fontSize="11"
        >
          {subtitle}
        </text>
      ) : null}

      {children}
    </motion.g>
  );
}

function FieldDevice({
  x,
  y,
  label,
  address,
  active,
  color = "green",
}: {
  x: number;
  y: number;
  label: string;
  address: string;
  active: boolean;
  color?: "green" | "red" | "blue" | "amber";
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.rect
        width="180"
        height="74"
        rx="16"
        strokeWidth="2"
        initial={false}
        animate={{
          fill: active ? "#f0fdf4" : "#ffffff",
          stroke: active ? "#22c55e" : "#cbd5e1",
        }}
      />

      <SvgLed
        cx={26}
        cy={37}
        active={active}
        color={color}
      />

      <text
        x="48"
        y="32"
        fill="#0f172a"
        fontSize="14"
        fontWeight="700"
      >
        {label}
      </text>

      <text
        x="48"
        y="53"
        fill="#64748b"
        fontSize="12"
        fontFamily="monospace"
      >
        {address}
      </text>
    </g>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function PLCArchitecturePage() {
  const [powered, setPowered] = useState(false);
  const [running, setRunning] = useState(false);
  const [singleScan, setSingleScan] = useState(false);

  const [scanStage, setScanStage] = useState<ScanStage>(0);
  const [scanCount, setScanCount] = useState(0);
  const [scanSpeed, setScanSpeed] = useState(1200);

  const [physicalInputs, setPhysicalInputs] =
    useState<PlcInputs>(EMPTY_INPUTS);

  const [inputImage, setInputImage] =
    useState<PlcInputs>(EMPTY_INPUTS);

  const [outputs, setOutputs] =
    useState<PlcOutputs>(EMPTY_OUTPUTS);

  const [selectedModule, setSelectedModule] =
    useState<ModuleKey>("cpu");

  const physicalInputsRef = useRef<PlcInputs>(EMPTY_INPUTS);
  const inputImageRef = useRef<PlcInputs>(EMPTY_INPUTS);

  const simulationActive =
    powered && (running || singleScan);

  const stageDuration = Math.max(160, scanSpeed / 4);

  /* -------------------------------------------------------
     PLC SCAN ENGINE
  ------------------------------------------------------- */

  useEffect(() => {
    if (!powered || scanStage === 0) return;

    if (scanStage === 1) {
      const capturedInputs = {
        ...physicalInputsRef.current,
      };

      inputImageRef.current = capturedInputs;
      setInputImage(capturedInputs);
    }

    if (scanStage === 2) {
      const inputSnapshot = inputImageRef.current;

      setOutputs((previousOutputs) => {
        /*
          DEMO PLC PROGRAM

          Q0.0 Motor:
          (I0.0 OR Q0.0) AND NOT I0.1

          Q0.1 Valve:
          I0.2

          Q0.2 Alarm:
          I0.1
        */

        return {
          motor:
            (inputSnapshot.start || previousOutputs.motor) &&
            !inputSnapshot.stop,

          valve: inputSnapshot.level,

          alarm: inputSnapshot.stop,
        };
      });
    }

    if (scanStage === 4) {
      setScanCount((current) => current + 1);
    }
  }, [powered, scanStage]);

  useEffect(() => {
    if (!simulationActive || scanStage === 0) return;

    const timer = window.setTimeout(() => {
      if (scanStage < 4) {
        setScanStage((scanStage + 1) as ScanStage);
        return;
      }

      if (singleScan) {
        setSingleScan(false);
        setScanStage(0);
        return;
      }

      if (running) {
        setScanStage(1);
      }
    }, stageDuration);

    return () => window.clearTimeout(timer);
  }, [
    running,
    scanStage,
    simulationActive,
    singleScan,
    stageDuration,
  ]);

  /* -------------------------------------------------------
     CONTROL FUNCTIONS
  ------------------------------------------------------- */

  function setInput(
    input: keyof PlcInputs,
    value: boolean,
  ) {
    const nextInputs = {
      ...physicalInputsRef.current,
      [input]: value,
    };

    physicalInputsRef.current = nextInputs;
    setPhysicalInputs(nextInputs);
  }

  function togglePower() {
    if (powered) {
      setPowered(false);
      setRunning(false);
      setSingleScan(false);
      setScanStage(0);

      physicalInputsRef.current = EMPTY_INPUTS;
      inputImageRef.current = EMPTY_INPUTS;

      setPhysicalInputs(EMPTY_INPUTS);
      setInputImage(EMPTY_INPUTS);
      setOutputs(EMPTY_OUTPUTS);
      return;
    }

    setPowered(true);
    setScanStage(0);
  }

  function toggleRun() {
    if (!powered) return;

    if (running) {
      setRunning(false);
      setSingleScan(false);
      setScanStage(0);
      return;
    }

    setSingleScan(false);
    setRunning(true);
    setScanStage(1);
  }

  function performSingleScan() {
    if (!powered || running || singleScan) return;

    setSingleScan(true);
    setScanStage(1);
  }

  function resetSimulation() {
    setPowered(false);
    setRunning(false);
    setSingleScan(false);
    setScanStage(0);
    setScanCount(0);
    setScanSpeed(1200);
    setSelectedModule("cpu");

    physicalInputsRef.current = EMPTY_INPUTS;
    inputImageRef.current = EMPTY_INPUTS;

    setPhysicalInputs(EMPTY_INPUTS);
    setInputImage(EMPTY_INPUTS);
    setOutputs(EMPTY_OUTPUTS);
  }

  /* -------------------------------------------------------
     FORMATTED VALUES
  ------------------------------------------------------- */

  const inputImageBits = [
    inputImage.start,
    inputImage.stop,
    inputImage.level,
  ]
    .map((value) => (value ? "1" : "0"))
    .join("");

  const outputImageBits = [
    outputs.motor,
    outputs.valve,
    outputs.alarm,
  ]
    .map((value) => (value ? "1" : "0"))
    .join("");

  const plcStatus = !powered
    ? "POWER OFF"
    : running
      ? "RUN"
      : singleScan
        ? "SINGLE SCAN"
        : "STOP";

  const statusColor = !powered
    ? "text-slate-500"
    : running || singleScan
      ? "text-green-600"
      : "text-amber-600";

  const selectedInformation =
    moduleInformation[selectedModule];

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-7">
          {/* HEADER */}

          <header className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <StatusDot
                  active={powered}
                  color={powered ? "green" : "blue"}
                />
                Industrial Automation Learning Lab
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Interactive PLC Architecture
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Control the digital inputs and observe how the
                PLC reads inputs, executes logic, updates outputs
                and communicates with external systems.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <StatusDot
                active={powered}
                color={
                  running || singleScan ? "green" : "amber"
                }
              />

              <span className="text-xs font-medium text-slate-500">
                PLC MODE
              </span>

              <span
                className={`text-sm font-bold ${statusColor}`}
              >
                {plcStatus}
              </span>
            </div>
          </header>

          {/* RESPONSIVE MAIN LAYOUT */}

          <div className="grid items-start gap-5 lg:grid-cols-[310px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
            {/* =================================================
                LEFT CONTROL PANEL
            ================================================= */}

            <aside className="space-y-4 lg:sticky lg:top-5">
              {/* POWER AND OPERATING MODE */}

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Control Panel
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Operate the virtual PLC.
                    </p>
                  </div>

                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      powered
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {powered ? "24 VDC ON" : "NO POWER"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    type="button"
                    onClick={togglePower}
                    whileTap={{ scale: 0.97 }}
                    className={[
                      "rounded-xl px-3 py-3 text-sm font-bold transition",
                      "focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      powered
                        ? "bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100"
                        : "bg-blue-600 text-white hover:bg-blue-700",
                    ].join(" ")}
                  >
                    {powered ? "Power OFF" : "Power ON"}
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={!powered}
                    onClick={toggleRun}
                    whileTap={powered ? { scale: 0.97 } : {}}
                    className={[
                      "rounded-xl px-3 py-3 text-sm font-bold transition",
                      "focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-green-500 focus-visible:ring-offset-2",
                      !powered
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : running
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-green-600 text-white hover:bg-green-700",
                    ].join(" ")}
                  >
                    {running ? "Stop PLC" : "Run PLC"}
                  </motion.button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!powered || running || singleScan}
                    onClick={performSingleScan}
                    className={[
                      "rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                      "focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      !powered || running || singleScan
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                        : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
                    ].join(" ")}
                  >
                    Single Scan
                  </button>

                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Reset
                  </button>
                </div>
              </section>

              {/* DIGITAL INPUTS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3">
                  <h2 className="font-bold text-slate-900">
                    Physical Inputs
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Change field-device states. New values enter
                    the input image during the next Read stage.
                  </p>
                </div>

                <div className="space-y-2">
                  <ToggleControl
                    label="Start Push Button"
                    address="I0.0"
                    description="Starts and seals in the motor output."
                    checked={physicalInputs.start}
                    disabled={!powered}
                    onChange={() =>
                      setInput(
                        "start",
                        !physicalInputs.start,
                      )
                    }
                  />

                  <ToggleControl
                    label="Stop Push Button"
                    address="I0.1"
                    description="Stops the motor and activates the alarm."
                    checked={physicalInputs.stop}
                    disabled={!powered}
                    color="red"
                    onChange={() =>
                      setInput(
                        "stop",
                        !physicalInputs.stop,
                      )
                    }
                  />

                  <ToggleControl
                    label="Level Sensor"
                    address="I0.2"
                    description="Controls the automatic filling valve."
                    checked={physicalInputs.level}
                    disabled={!powered}
                    color="amber"
                    onChange={() =>
                      setInput(
                        "level",
                        !physicalInputs.level,
                      )
                    }
                  />
                </div>
              </section>

              {/* SCAN SPEED */}

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Animation Speed
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Slowed for educational observation.
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
                    {scanSpeed} ms
                  </span>
                </div>

                <input
                  aria-label="PLC scan animation speed"
                  type="range"
                  min="600"
                  max="2400"
                  step="100"
                  value={scanSpeed}
                  onChange={(event) =>
                    setScanSpeed(Number(event.target.value))
                  }
                  className="mt-4 w-full accent-blue-600"
                />

                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>Fast</span>
                  <span>Slow</span>
                </div>
              </section>

              {/* PROGRAM LOGIC */}

              <section className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
                <h2 className="font-bold">
                  Demonstration Program
                </h2>

                <div className="mt-3 space-y-3 font-mono text-xs leading-6">
                  <div>
                    <span className="text-blue-300">
                      Q0.0 Motor
                    </span>

                    <p className="text-slate-300">
                      (I0.0 OR Q0.0) AND NOT I0.1
                    </p>
                  </div>

                  <div>
                    <span className="text-blue-300">
                      Q0.1 Valve
                    </span>

                    <p className="text-slate-300">I0.2</p>
                  </div>

                  <div>
                    <span className="text-blue-300">
                      Q0.2 Alarm
                    </span>

                    <p className="text-slate-300">I0.1</p>
                  </div>
                </div>
              </section>
            </aside>

            {/* =================================================
                RIGHT SIMULATION AREA
            ================================================= */}

            <section className="min-w-0 space-y-4">
              {/* METRICS */}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <MetricCard
                  label="PLC status"
                  value={
                    <span className={statusColor}>
                      {plcStatus}
                    </span>
                  }
                />

                <MetricCard
                  label="Scan count"
                  value={scanCount}
                  helper="Completed cycles"
                />

                <MetricCard
                  label="Input image"
                  value={
                    <span className="font-mono">
                      {inputImageBits}
                    </span>
                  }
                  helper="I0.0 · I0.1 · I0.2"
                />

                <MetricCard
                  label="Output image"
                  value={
                    <span className="font-mono">
                      {outputImageBits}
                    </span>
                  }
                  helper="Q0.0 · Q0.1 · Q0.2"
                />
              </div>

              {/* SCAN STAGE INDICATORS */}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {([1, 2, 3, 4] as ScanStage[]).map(
                  (stage) => {
                    const active = scanStage === stage;

                    return (
                      <motion.div
                        key={stage}
                        animate={{
                          borderColor: active
                            ? "#2563eb"
                            : "#e2e8f0",
                          backgroundColor: active
                            ? "#eff6ff"
                            : "#ffffff",
                        }}
                        className="rounded-xl border p-3"
                      >
                        <div className="flex items-center gap-2">
                          <motion.span
                            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                            animate={{
                              backgroundColor: active
                                ? "#2563eb"
                                : "#f1f5f9",
                              color: active
                                ? "#ffffff"
                                : "#64748b",
                            }}
                          >
                            {stage}
                          </motion.span>

                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {
                                scanStageInformation[stage]
                                  .short
                              }
                            </p>

                            <p className="text-[11px] text-slate-500">
                              {stage === 1
                                ? "Inputs"
                                : stage === 2
                                  ? "Program"
                                  : stage === 3
                                    ? "Outputs"
                                    : "Comms"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  },
                )}
              </div>

              {/* ARCHITECTURE CANVAS */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      PLC Architecture Simulation Canvas
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Click any PLC module to display its
                      function and learning notes.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusDot
                      active={simulationActive}
                      color="blue"
                    />

                    <span className="text-xs font-semibold text-slate-600">
                      {scanStageInformation[scanStage].title}
                    </span>
                  </div>
                </div>

                {/*
                  On small screens, the detailed industrial
                  architecture can be scrolled horizontally.

                  On desktop, it automatically fills the canvas.
                */}

                <div className="overflow-x-auto bg-white">
                  <motion.svg
                    viewBox="0 0 1180 620"
                    role="img"
                    aria-label="Interactive PLC architecture showing field inputs, PLC modules and field outputs"
                    className="block h-auto min-w-[780px] w-full lg:min-w-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <defs>
                      <pattern
                        id="grid-pattern"
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 24 0 L 0 0 0 24"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>

                    <rect
                      width="1180"
                      height="620"
                      fill="#ffffff"
                    />

                    <rect
                      width="1180"
                      height="620"
                      fill="url(#grid-pattern)"
                    />

                    {/* TITLES */}

                    <text
                      x="30"
                      y="48"
                      fill="#475569"
                      fontSize="15"
                      fontWeight="700"
                    >
                      FIELD INPUT DEVICES
                    </text>

                    <text
                      x="985"
                      y="48"
                      fill="#475569"
                      fontSize="15"
                      fontWeight="700"
                    >
                      FIELD OUTPUT DEVICES
                    </text>

                    {/* PLC RACK */}

                    <rect
                      x="265"
                      y="70"
                      width="660"
                      height="445"
                      rx="28"
                      fill="#f8fafc"
                      stroke="#94a3b8"
                      strokeWidth="3"
                    />

                    <rect
                      x="285"
                      y="90"
                      width="620"
                      height="39"
                      rx="10"
                      fill="#e2e8f0"
                    />

                    <text
                      x="595"
                      y="116"
                      textAnchor="middle"
                      fill="#334155"
                      fontSize="16"
                      fontWeight="700"
                    >
                      PLC RACK AND BACKPLANE BUS
                    </text>

                    {/* INPUT FIELD DEVICES */}

                    <FieldDevice
                      x={30}
                      y={130}
                      label="Start Button"
                      address="I0.0"
                      active={physicalInputs.start}
                      color="green"
                    />

                    <FieldDevice
                      x={30}
                      y={240}
                      label="Stop Button"
                      address="I0.1"
                      active={physicalInputs.stop}
                      color="red"
                    />

                    <FieldDevice
                      x={30}
                      y={350}
                      label="Level Sensor"
                      address="I0.2"
                      active={physicalInputs.level}
                      color="amber"
                    />

                    {/* INPUT WIRING */}

                    <SignalPath
                      d="M210 167 H345 V190 H385"
                      active={
                        scanStage === 1 &&
                        physicalInputs.start
                      }
                    />

                    <SignalPath
                      d="M210 277 H335 V260 H385"
                      active={
                        scanStage === 1 &&
                        physicalInputs.stop
                      }
                    />

                    <SignalPath
                      d="M210 387 H345 V330 H385"
                      active={
                        scanStage === 1 &&
                        physicalInputs.level
                      }
                    />

                    {/* POWER SUPPLY */}

                    <PlcModule
                      x={285}
                      y={145}
                      width={85}
                      height={340}
                      moduleKey="power"
                      title="POWER"
                      subtitle="SUPPLY"
                      selected={selectedModule === "power"}
                      onSelect={setSelectedModule}
                    >
                      <path
                        d="M45 110 L27 155 H45 L35 205 L64 145 H47 L58 110 Z"
                        fill={powered ? "#2563eb" : "#cbd5e1"}
                      />

                      <text
                        x="42.5"
                        y="240"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="11"
                      >
                        230 VAC
                      </text>

                      <text
                        x="42.5"
                        y="258"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="11"
                      >
                        24 VDC
                      </text>

                      <SvgLed
                        cx={42.5}
                        cy={298}
                        active={powered}
                        color="green"
                      />

                      <text
                        x="42.5"
                        y="323"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                      >
                        POWER
                      </text>
                    </PlcModule>

                    {/* INPUT MODULE */}

                    <PlcModule
                      x={385}
                      y={145}
                      width={115}
                      height={340}
                      moduleKey="input"
                      title="INPUT"
                      subtitle="DIGITAL INPUT"
                      selected={selectedModule === "input"}
                      onSelect={setSelectedModule}
                    >
                      <SvgLed
                        cx={28}
                        cy={100}
                        active={inputImage.start}
                        color="green"
                      />

                      <text
                        x="50"
                        y="105"
                        fill="#475569"
                        fontSize="12"
                        fontFamily="monospace"
                      >
                        I0.0
                      </text>

                      <SvgLed
                        cx={28}
                        cy={170}
                        active={inputImage.stop}
                        color="red"
                      />

                      <text
                        x="50"
                        y="175"
                        fill="#475569"
                        fontSize="12"
                        fontFamily="monospace"
                      >
                        I0.1
                      </text>

                      <SvgLed
                        cx={28}
                        cy={240}
                        active={inputImage.level}
                        color="amber"
                      />

                      <text
                        x="50"
                        y="245"
                        fill="#475569"
                        fontSize="12"
                        fontFamily="monospace"
                      >
                        I0.2
                      </text>

                      <text
                        x="57.5"
                        y="292"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                      >
                        ISOLATION
                      </text>

                      <text
                        x="57.5"
                        y="308"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                      >
                        &amp; CONVERSION
                      </text>
                    </PlcModule>

                    {/* CPU */}

                    <PlcModule
                      x={520}
                      y={145}
                      width={135}
                      height={340}
                      moduleKey="cpu"
                      title="CPU"
                      subtitle="PROCESSOR"
                      selected={selectedModule === "cpu"}
                      onSelect={setSelectedModule}
                    >
                      <rect
                        x="18"
                        y="88"
                        width="99"
                        height="82"
                        rx="10"
                        fill="#0f172a"
                      />

                      <text
                        x="67.5"
                        y="119"
                        textAnchor="middle"
                        fill={
                          powered ? "#86efac" : "#64748b"
                        }
                        fontSize="14"
                        fontFamily="monospace"
                        fontWeight="700"
                      >
                        {plcStatus}
                      </text>

                      <text
                        x="67.5"
                        y="145"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                      >
                        {
                          scanStageInformation[scanStage]
                            .short
                        }
                      </text>

                      <SvgLed
                        cx={34}
                        cy={208}
                        active={running || singleScan}
                        color="green"
                      />

                      <text
                        x="53"
                        y="213"
                        fill="#475569"
                        fontSize="11"
                      >
                        RUN
                      </text>

                      <SvgLed
                        cx={34}
                        cy={248}
                        active={false}
                        color="red"
                      />

                      <text
                        x="53"
                        y="253"
                        fill="#475569"
                        fontSize="11"
                      >
                        ERROR
                      </text>

                      <text
                        x="67.5"
                        y="291"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                      >
                        SCAN COUNT
                      </text>

                      <text
                        x="67.5"
                        y="316"
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="17"
                        fontFamily="monospace"
                        fontWeight="700"
                      >
                        {scanCount}
                      </text>
                    </PlcModule>

                    {/* MEMORY */}

                    <PlcModule
                      x={675}
                      y={145}
                      width={105}
                      height={155}
                      moduleKey="memory"
                      title="MEMORY"
                      subtitle="PROGRAM + DATA"
                      selected={selectedModule === "memory"}
                      onSelect={setSelectedModule}
                    >
                      <rect
                        x="20"
                        y="88"
                        width="65"
                        height="42"
                        rx="7"
                        fill="#dbeafe"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />

                      <text
                        x="52.5"
                        y="113"
                        textAnchor="middle"
                        fill="#1d4ed8"
                        fontSize="9"
                        fontWeight="700"
                      >
                        EEPROM
                      </text>
                    </PlcModule>

                    {/* COMMUNICATION */}

                    <PlcModule
                      x={675}
                      y={320}
                      width={105}
                      height={165}
                      moduleKey="communication"
                      title="COMMS"
                      subtitle="ETHERNET / BUS"
                      selected={
                        selectedModule === "communication"
                      }
                      onSelect={setSelectedModule}
                    >
                      <rect
                        x="24"
                        y="90"
                        width="57"
                        height="38"
                        rx="6"
                        fill="#f1f5f9"
                        stroke="#64748b"
                        strokeWidth="2"
                      />

                      {[0, 1, 2, 3].map((port) => (
                        <rect
                          key={port}
                          x={31 + port * 12}
                          y="101"
                          width="7"
                          height="10"
                          rx="1"
                          fill="#2563eb"
                        />
                      ))}

                      <text
                        x="52.5"
                        y="151"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="9"
                      >
                        HMI / SCADA
                      </text>
                    </PlcModule>

                    {/* OUTPUT MODULE */}

                    <PlcModule
                      x={800}
                      y={145}
                      width={105}
                      height={340}
                      moduleKey="output"
                      title="OUTPUT"
                      subtitle="DIGITAL OUTPUT"
                      selected={selectedModule === "output"}
                      onSelect={setSelectedModule}
                    >
                      <SvgLed
                        cx={27}
                        cy={100}
                        active={outputs.motor}
                        color="green"
                      />

                      <text
                        x="49"
                        y="105"
                        fill="#475569"
                        fontSize="12"
                        fontFamily="monospace"
                      >
                        Q0.0
                      </text>

                      <SvgLed
                        cx={27}
                        cy={170}
                        active={outputs.valve}
                        color="blue"
                      />

                      <text
                        x="49"
                        y="175"
                        fill="#475569"
                        fontSize="12"
                        fontFamily="monospace"
                      >
                        Q0.1
                      </text>

                      <SvgLed
                        cx={27}
                        cy={240}
                        active={outputs.alarm}
                        color="red"
                      />

                      <text
                        x="49"
                        y="245"
                        fill="#475569"
                        fontSize="12"
                        fontFamily="monospace"
                      >
                        Q0.2
                      </text>

                      <text
                        x="52.5"
                        y="292"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                      >
                        LOAD
                      </text>

                      <text
                        x="52.5"
                        y="308"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                      >
                        SWITCHING
                      </text>
                    </PlcModule>

                    {/* INTERNAL BUS SIGNALS */}

                    <SignalPath
                      d="M500 315 H520"
                      active={scanStage === 1}
                      strong
                    />

                    <SignalPath
                      d="M655 235 H675"
                      active={scanStage === 2}
                      strong
                    />

                    <SignalPath
                      d="M675 270 H655"
                      active={scanStage === 2}
                      strong
                    />

                    <SignalPath
                      d="M655 315 H800"
                      active={scanStage === 3}
                      strong
                    />

                    <SignalPath
                      d="M655 405 H675"
                      active={scanStage === 4}
                      strong
                    />

                    {/* OUTPUT DEVICES */}

                    <FieldDevice
                      x={970}
                      y={130}
                      label="Motor Contactor"
                      address="Q0.0"
                      active={outputs.motor}
                      color="green"
                    />

                    <FieldDevice
                      x={970}
                      y={240}
                      label="Solenoid Valve"
                      address="Q0.1"
                      active={outputs.valve}
                      color="blue"
                    />

                    <FieldDevice
                      x={970}
                      y={350}
                      label="Alarm Lamp"
                      address="Q0.2"
                      active={outputs.alarm}
                      color="red"
                    />

                    {/* OUTPUT SIGNALS */}

                    <SignalPath
                      d="M905 245 H940 V167 H970"
                      active={
                        scanStage === 3 && outputs.motor
                      }
                    />

                    <SignalPath
                      d="M905 315 H970 V277"
                      active={
                        scanStage === 3 && outputs.valve
                      }
                    />

                    <SignalPath
                      d="M905 385 H940 V387 H970"
                      active={
                        scanStage === 3 && outputs.alarm
                      }
                    />

                    {/* ENGINEERING COMPUTER */}

                    <motion.g
                      animate={{
                        opacity: powered ? 1 : 0.55,
                      }}
                    >
                      <rect
                        x="445"
                        y="545"
                        width="305"
                        height="55"
                        rx="14"
                        fill="#ffffff"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                      />

                      <text
                        x="597.5"
                        y="569"
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="13"
                        fontWeight="700"
                      >
                        Engineering PC · HMI · SCADA
                      </text>

                      <text
                        x="597.5"
                        y="588"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="11"
                      >
                        Programming, monitoring and diagnostics
                      </text>
                    </motion.g>

                    <SignalPath
                      d="M727 485 V520 H597 V545"
                      active={scanStage === 4}
                    />
                  </motion.svg>
                </div>
              </section>

              {/* CURRENT STAGE AND SELECTED MODULE */}

              <div className="grid gap-4 xl:grid-cols-2">
                <motion.section
                  layout
                  className="rounded-2xl border border-blue-200 bg-blue-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      key={scanStage}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white"
                    >
                      {scanStage}
                    </motion.div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                        Current PLC Operation
                      </p>

                      <h3 className="mt-1 font-bold text-slate-900">
                        {
                          scanStageInformation[scanStage]
                            .title
                        }
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {
                          scanStageInformation[scanStage]
                            .description
                        }
                      </p>
                    </div>
                  </div>
                </motion.section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Selected Architecture Component
                  </p>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedModule}
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
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        {selectedInformation.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {selectedInformation.purpose}
                      </p>

                      <div className="mt-3 rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Learning note
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {selectedInformation.lesson}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </section>
              </div>

              {/* I/O STATE TABLE */}

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-bold text-slate-900">
                    PLC Process-Image Monitor
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Compare physical input states with the input
                    snapshot stored by the CPU.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-3">Address</th>
                        <th className="px-3 py-3">Device</th>
                        <th className="px-3 py-3">
                          Physical state
                        </th>
                        <th className="px-3 py-3">
                          Process image
                        </th>
                        <th className="px-3 py-3">
                          Controlled result
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-3 font-mono font-bold text-blue-700">
                          I0.0
                        </td>

                        <td className="px-3 py-3">
                          Start button
                        </td>

                        <td className="px-3 py-3">
                          {physicalInputs.start ? "ON" : "OFF"}
                        </td>

                        <td className="px-3 py-3">
                          {inputImage.start ? "1" : "0"}
                        </td>

                        <td className="px-3 py-3">
                          Motor seal-in request
                        </td>
                      </tr>

                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-3 font-mono font-bold text-blue-700">
                          I0.1
                        </td>

                        <td className="px-3 py-3">
                          Stop button
                        </td>

                        <td className="px-3 py-3">
                          {physicalInputs.stop ? "ON" : "OFF"}
                        </td>

                        <td className="px-3 py-3">
                          {inputImage.stop ? "1" : "0"}
                        </td>

                        <td className="px-3 py-3">
                          Motor stop and alarm
                        </td>
                      </tr>

                      <tr className="border-b border-slate-100">
                        <td className="px-3 py-3 font-mono font-bold text-blue-700">
                          I0.2
                        </td>

                        <td className="px-3 py-3">
                          Level sensor
                        </td>

                        <td className="px-3 py-3">
                          {physicalInputs.level
                            ? "ON"
                            : "OFF"}
                        </td>

                        <td className="px-3 py-3">
                          {inputImage.level ? "1" : "0"}
                        </td>

                        <td className="px-3 py-3">
                          Valve control request
                        </td>
                      </tr>

                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="px-3 py-3 font-mono font-bold text-green-700">
                          Q0.0
                        </td>

                        <td className="px-3 py-3">
                          Motor contactor
                        </td>

                        <td className="px-3 py-3">—</td>

                        <td className="px-3 py-3">
                          {outputs.motor ? "1" : "0"}
                        </td>

                        <td className="px-3 py-3 font-semibold">
                          {outputs.motor
                            ? "MOTOR RUNNING"
                            : "MOTOR STOPPED"}
                        </td>
                      </tr>

                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="px-3 py-3 font-mono font-bold text-green-700">
                          Q0.1
                        </td>

                        <td className="px-3 py-3">
                          Solenoid valve
                        </td>

                        <td className="px-3 py-3">—</td>

                        <td className="px-3 py-3">
                          {outputs.valve ? "1" : "0"}
                        </td>

                        <td className="px-3 py-3 font-semibold">
                          {outputs.valve
                            ? "VALVE OPEN"
                            : "VALVE CLOSED"}
                        </td>
                      </tr>

                      <tr className="bg-slate-50">
                        <td className="px-3 py-3 font-mono font-bold text-green-700">
                          Q0.2
                        </td>

                        <td className="px-3 py-3">
                          Alarm lamp
                        </td>

                        <td className="px-3 py-3">—</td>

                        <td className="px-3 py-3">
                          {outputs.alarm ? "1" : "0"}
                        </td>

                        <td className="px-3 py-3 font-semibold">
                          {outputs.alarm
                            ? "ALARM ACTIVE"
                            : "ALARM CLEAR"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </section>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}