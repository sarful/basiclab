"use client";

import { useMemo, useState } from "react";

type Mode = "onoff" | "timeline";
type Stage = "OFF" | "SWITCHING" | "ON";

type Phase = {
  id: "l1" | "l2" | "l3";
  lineLabel: string;
  loadLabel: string;
  lineNo: string;
  loadNo: string;
  x: number;
  color: string;
};

type CoilKind = "AC" | "DC";

type CoilOption = {
  type: CoilKind;
  label: string;
  voltage: number;
  displayVoltage: string;
};

type DiagramState = {
  coilOn: boolean;
  coilVoltageProgress: number;
  fieldOn: boolean;
  mainClosed: boolean;
  mainCurrent: boolean;
  auxNoClosed: boolean;
  auxNcClosed: boolean;
  motionProgress: number;
  stage: Stage;
  preview: string;
};

type FieldRing = {
  rx: number;
  ry: number;
  delay: string;
};

const phases: Phase[] = [
  {
    id: "l1",
    lineLabel: "L1",
    loadLabel: "T1",
    lineNo: "1",
    loadNo: "2",
    x: 365,
    color: "#ef2626",
  },
  {
    id: "l2",
    lineLabel: "L2",
    loadLabel: "T2",
    lineNo: "3",
    loadNo: "4",
    x: 535,
    color: "#ffd51f",
  },
  {
    id: "l3",
    lineLabel: "L3",
    loadLabel: "T3",
    lineNo: "5",
    loadNo: "6",
    x: 705,
    color: "#2563eb",
  },
];

const fieldRings: FieldRing[] = [
  { rx: 40, ry: 82, delay: "0s" },
  { rx: 54, ry: 104, delay: "0.18s" },
  { rx: 68, ry: 126, delay: "0.36s" },
  { rx: 82, ry: 148, delay: "0.54s" },
];

const coilOptions: CoilOption[] = [
  { type: "AC", label: "AC Coil", voltage: 24, displayVoltage: "24 V AC" },
  { type: "AC", label: "AC Coil", voltage: 110, displayVoltage: "110 / 120 V AC" },
  { type: "AC", label: "AC Coil", voltage: 220, displayVoltage: "220 / 230 V AC" },
  { type: "AC", label: "AC Coil", voltage: 380, displayVoltage: "380 / 415 V AC" },
  { type: "DC", label: "DC Coil", voltage: 12, displayVoltage: "12 V DC" },
  { type: "DC", label: "DC Coil", voltage: 24, displayVoltage: "24 V DC" },
  { type: "DC", label: "DC Coil", voltage: 48, displayVoltage: "48 V DC" },
  { type: "DC", label: "DC Coil", voltage: 110, displayVoltage: "110 V DC" },
];

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function getTimelineState(timeCursor: number): DiagramState {
  const voltageProgress = timeCursor / 100;

  if (timeCursor === 0) {
    return {
      coilOn: false,
      coilVoltageProgress: 0,
      fieldOn: false,
      mainClosed: false,
      mainCurrent: false,
      auxNoClosed: false,
      auxNcClosed: true,
      motionProgress: 0,
      stage: "OFF",
      preview:
        "Coil is OFF. Magnetic field is hidden. Main contacts are open. No main current flow.",
    };
  }

  if (timeCursor < 55) {
    return {
      coilOn: true,
      coilVoltageProgress: voltageProgress,
      fieldOn: voltageProgress > 0.15,
      mainClosed: false,
      mainCurrent: false,
      auxNoClosed: false,
      auxNcClosed: true,
      motionProgress: 0,
      stage: "SWITCHING",
      preview:
        "Control voltage rises with the timeline percentage. The magnetic field is building, but the armature has not started full travel yet.",
    };
  }

  if (timeCursor < 85) {
    return {
      coilOn: true,
      coilVoltageProgress: voltageProgress,
      fieldOn: true,
      mainClosed: false,
      mainCurrent: false,
      auxNoClosed: false,
      auxNcClosed: false,
      motionProgress: (timeCursor - 55) / 30,
      stage: "SWITCHING",
      preview:
        "The rising coil voltage now produces enough pull to move the armature. NC opens first while the main contacts travel toward closed.",
    };
  }

  return {
    coilOn: true,
    coilVoltageProgress: voltageProgress,
    fieldOn: true,
    mainClosed: true,
    mainCurrent: true,
    auxNoClosed: true,
    auxNcClosed: false,
    motionProgress: 1,
    stage: "ON",
    preview:
      "Contacts are fully closed. Main current flows from L1/L2/L3 to T1/T2/T3 while the coil reaches full selected voltage.",
  };
}

function getManualState(manualOn: boolean): DiagramState {
  return {
    coilOn: manualOn,
    coilVoltageProgress: manualOn ? 1 : 0,
    fieldOn: manualOn,
    mainClosed: manualOn,
    mainCurrent: manualOn,
    auxNoClosed: manualOn,
    auxNcClosed: !manualOn,
    motionProgress: manualOn ? 1 : 0,
    stage: manualOn ? "ON" : "OFF",
    preview: manualOn
      ? "Coil is energized. Magnetic field active. Main and NO auxiliary contacts are closed."
      : "Coil is OFF. Main contacts are open. NC auxiliary contact is closed.",
  };
}

function getMainCurrentPath(phase: Phase) {
  const x = phase.x;
  const xOffset = phase.id === "l1" ? 85 : phase.id === "l2" ? 0 : -85;

  return `M ${x} 207 V 275 H ${x + xOffset}
          V 400 H ${x}
          V 585 H ${x - xOffset * 0.45}
          V 670`;
}

function createSpringPath(
  centerX: number,
  topY: number,
  bottomY: number,
  turns: number,
  amplitude: number,
) {
  const height = bottomY - topY;
  const step = height / turns;

  let path = `M ${centerX} ${topY}`;

  for (let i = 0; i < turns; i += 1) {
    const controlX = i % 2 === 0 ? centerX + amplitude : centerX - amplitude;
    const controlY = topY + step * i + step / 2;
    const endY = topY + step * (i + 1);

    path += ` Q ${controlX} ${controlY}, ${centerX} ${endY}`;
  }

  return path;
}

export default function MagneticContactorOperationDiagram() {
  const [mode, setMode] = useState<Mode>("onoff");
  const [manualOn, setManualOn] = useState(false);
  const [timeCursor, setTimeCursor] = useState(0);
  const [coilType, setCoilType] = useState<CoilKind>("AC");
  const [selectedCoilVoltage, setSelectedCoilVoltage] = useState("220 / 230 V AC");

  const state = useMemo<DiagramState>(() => {
    return mode === "timeline"
      ? getTimelineState(timeCursor)
      : getManualState(manualOn);
  }, [mode, timeCursor, manualOn]);

  const visibleCoilOptions = coilOptions.filter((option) => option.type === coilType);
  const selectedCoilOption =
    coilOptions.find((option) => option.displayVoltage === selectedCoilVoltage) ??
    coilOptions[2];
  const coilVoltageValue = Math.round(
    selectedCoilOption.voltage * state.coilVoltageProgress,
  );
  const coilVoltageDiagramLabel = `${coilVoltageValue} V`;
  const coilVoltageDiagramType = selectedCoilOption.type;
  const coilPathOpacity = 0.25 + state.coilVoltageProgress * 0.75;
  const coilVoltageLabel =
    state.stage === "OFF"
      ? `0 V ${selectedCoilOption.type}`
      : `${coilVoltageValue} V ${selectedCoilOption.type}`;
  const coilVoltageDescription =
    state.stage === "OFF"
      ? `No control voltage is present across A1 and A2. Selected coil: ${selectedCoilOption.displayVoltage}.`
      : state.stage === "SWITCHING"
        ? `Control voltage is rising across A1 and A2. The ${selectedCoilOption.label} is building magnetic pull at ${coilVoltageValue} V toward ${selectedCoilOption.displayVoltage}.`
        : `Full control voltage of ${selectedCoilOption.displayVoltage} is present across A1 and A2, so the coil is holding the contactor in.`;

  const contactOffset = -34 + state.motionProgress * 34;
  const armatureOffsetY = state.motionProgress * 34;

  const springTopY = 38;
  const springBottomY = 300 - state.motionProgress * 54;
  const springAmplitude = 32 - state.motionProgress * 12;
  const springPath = createSpringPath(
    52,
    springTopY,
    springBottomY,
    11,
    springAmplitude,
  );

  const auxMoving = state.stage === "SWITCHING";

  const auxNoBladeX2 = 130 + (1 - state.motionProgress) * 58;
  const auxNoBladeY2 = 245 - (1 - state.motionProgress) * 75;

  const auxNcBladeX2 = 130 + state.motionProgress * 58;
  const auxNcBladeY2 = 220 - state.motionProgress * 50;

  const auxNoColor = auxMoving
    ? "#f59e0b"
    : state.auxNoClosed
      ? "#22c55e"
      : "#ef4444";

  const auxNcColor = auxMoving
    ? "#f59e0b"
    : state.auxNcClosed
      ? "#22c55e"
      : "#ef4444";

  const auxNoLabel = auxMoving
    ? "MOVING"
    : state.auxNoClosed
      ? "CLOSED"
      : "OPEN";

  const auxNcLabel = auxMoving
    ? "MOVING"
    : state.auxNcClosed
      ? "CLOSED"
      : "OPEN";

  function setModeSafe(nextMode: Mode) {
    setMode(nextMode);

    if (nextMode === "timeline") {
      setTimeCursor(0);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f5f6fb] p-3 md:p-5 text-slate-900">
      <div className="mx-auto grid w-full max-w-[1780px] gap-4 rounded-[28px] bg-white p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] xl:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f4f7fb_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.10)]">
          <div className="mb-4 text-center text-[24px] font-black uppercase tracking-wide text-[#123b9f]">
            Control Panel
          </div>

          <div className="space-y-5">
            <section className="rounded-[18px] border border-slate-300 bg-white p-4">
              <h3 className="mb-3 text-[17px] font-black uppercase text-slate-800">
                Mode Select
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModeSafe("onoff")}
                  className={cx(
                    "rounded-xl border px-3 py-3 text-[15px] font-black transition",
                    mode === "onoff"
                      ? "border-[#123b9f] bg-[#123b9f] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  ON/OFF
                </button>

                <button
                  type="button"
                  onClick={() => setModeSafe("timeline")}
                  className={cx(
                    "rounded-xl border px-3 py-3 text-[15px] font-black transition",
                    mode === "timeline"
                      ? "border-[#123b9f] bg-[#123b9f] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  Timeline
                </button>
              </div>
            </section>

            <section className="rounded-[18px] border border-slate-300 bg-white p-4">
              <h3 className="mb-3 text-[17px] font-black uppercase text-slate-800">
                Coil Select
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCoilType("AC");
                    setSelectedCoilVoltage("220 / 230 V AC");
                  }}
                  className={cx(
                    "rounded-xl border px-3 py-3 text-[15px] font-black transition",
                    coilType === "AC"
                      ? "border-[#123b9f] bg-[#123b9f] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  AC Coil
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCoilType("DC");
                    setSelectedCoilVoltage("24 V DC");
                  }}
                  className={cx(
                    "rounded-xl border px-3 py-3 text-[15px] font-black transition",
                    coilType === "DC"
                      ? "border-[#123b9f] bg-[#123b9f] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  DC Coil
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {visibleCoilOptions.map((option) => (
                  <button
                    key={option.displayVoltage}
                    type="button"
                    onClick={() => setSelectedCoilVoltage(option.displayVoltage)}
                    className={cx(
                      "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition",
                      selectedCoilVoltage === option.displayVoltage
                        ? "border-[#123b9f] bg-[#f4f7ff]"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                  >
                    <span className="text-[13px] font-black text-slate-700">
                      {option.label}
                    </span>
                    <span className="text-[13px] font-black text-[#123b9f]">
                      {option.displayVoltage}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {mode === "onoff" && (
              <section className="rounded-[18px] border border-slate-300 bg-white p-4">
                <h3 className="mb-3 text-[17px] font-black uppercase text-slate-800">
                  ON/OFF Mode
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setManualOn(false)}
                    className={cx(
                      "rounded-xl border px-4 py-4 text-[20px] font-black text-white transition",
                      !manualOn
                        ? "border-[#8f1010] bg-[linear-gradient(180deg,#ff3030_0%,#c91212_100%)] shadow-md"
                        : "border-red-300 bg-red-400 opacity-70 hover:opacity-100",
                    )}
                  >
                    OFF
                  </button>

                  <button
                    type="button"
                    onClick={() => setManualOn(true)}
                    className={cx(
                      "rounded-xl border px-4 py-4 text-[20px] font-black text-white transition",
                      manualOn
                        ? "border-[#0b5f1c] bg-[linear-gradient(180deg,#18a538_0%,#0b7a21_100%)] shadow-md"
                        : "border-green-300 bg-green-400 opacity-70 hover:opacity-100",
                    )}
                  >
                    ON
                  </button>
                </div>
              </section>
            )}

            {mode === "timeline" && (
              <section className="rounded-[18px] border border-slate-300 bg-white p-4">
                <h3 className="mb-3 text-[17px] font-black uppercase text-slate-800">
                  Timeline Mode
                </h3>

                <div className="mb-3 flex items-center justify-between text-[15px] font-bold text-slate-700">
                  <span>Time Cursor</span>
                  <span className="text-[#123b9f]">{timeCursor}%</span>
                </div>

                <input
                  type="range"
                  aria-label="Timeline time cursor"
                  min={0}
                  max={100}
                  value={timeCursor}
                  onChange={(event) =>
                    setTimeCursor(Number(event.target.value))
                  }
                  className="w-full accent-[#123b9f]"
                />

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[12px] font-black text-slate-600">
                  <span>0% OFF</span>
                  <span>1-54% VOLTAGE BUILD</span>
                  <span>55-100% PICKUP / HOLD</span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={cx(
                      "h-full transition-all",
                      state.stage === "OFF" && "bg-red-500",
                      state.stage === "SWITCHING" && "bg-yellow-500",
                      state.stage === "ON" && "bg-green-600",
                    )}
                    style={{ width: `${timeCursor}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTimeCursor(0)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] font-black text-slate-700 hover:bg-slate-50"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimeCursor(55)}
                    className="rounded-lg border border-yellow-500 bg-yellow-100 px-3 py-2 text-[13px] font-black text-yellow-800 hover:bg-yellow-200"
                  >
                    Pickup
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimeCursor(100)}
                    className="rounded-lg border border-green-600 bg-green-100 px-3 py-2 text-[13px] font-black text-green-800 hover:bg-green-200"
                  >
                    Closed
                  </button>
                </div>
              </section>
            )}

            <section className="rounded-[18px] border border-slate-300 bg-white p-4">
              <h3 className="mb-3 text-[17px] font-black uppercase text-slate-800">
                Coil Voltage
              </h3>

              <div
                className={cx(
                  "mb-3 rounded-xl px-4 py-3 text-center text-[22px] font-black text-white",
                  state.stage === "OFF" && "bg-slate-600",
                  state.stage === "SWITCHING" && "bg-yellow-500",
                  state.stage === "ON" && "bg-[#123b9f]",
                )}
              >
                {coilVoltageLabel}
              </div>

              <p className="text-[14px] font-semibold leading-6 text-slate-700">
                {coilVoltageDescription}
              </p>
            </section>
          </div>
        </aside>

        <main className="min-w-0 space-y-3">
          <section className="rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
            <div>
              <h2 className="mb-2 text-xl font-black uppercase tracking-wide text-slate-800">
                {mode === "timeline" ? "Timeline Mode" : "ON/OFF Mode"}
              </h2>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>Time Cursor</span>
                  <span>{timeCursor}%</span>
                </div>

                <input
                  type="range"
                  aria-label="Timeline time cursor"
                  min={0}
                  max={100}
                  value={timeCursor}
                  disabled={mode !== "timeline"}
                  onChange={(event) =>
                    setTimeCursor(Number(event.target.value))
                  }
                  className="w-full accent-blue-500 disabled:opacity-40"
                />

                <div className="mt-2 flex justify-between text-sm font-black text-slate-700">
                  <span>0%</span>
                  <span>55%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <svg
              viewBox="0 0 1360 940"
              preserveAspectRatio="xMidYMid meet"
              className="block h-auto w-full"
              role="img"
              aria-label="Magnetic contactor operation diagram"
            >
              <defs>
                <linearGradient id="bodyBlack" x1="0" x2="1">
                  <stop offset="0%" stopColor="#131817" />
                  <stop offset="48%" stopColor="#303634" />
                  <stop offset="100%" stopColor="#0c0f0f" />
                </linearGradient>

                <linearGradient id="creamBody" x1="0" x2="1">
                  <stop offset="0%" stopColor="#d5d6ce" />
                  <stop offset="50%" stopColor="#f4f5ee" />
                  <stop offset="100%" stopColor="#bfc1b8" />
                </linearGradient>

                <radialGradient id="screwHead" cx="50%" cy="42%" r="62%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="45%" stopColor="#8d948f" />
                  <stop offset="100%" stopColor="#111827" />
                </radialGradient>

                <linearGradient id="steel" x1="0" x2="1">
                  <stop offset="0%" stopColor="#8a8f96" />
                  <stop offset="45%" stopColor="#f3f4f6" />
                  <stop offset="100%" stopColor="#5b6168" />
                </linearGradient>

                <linearGradient id="copper" x1="0" x2="1">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="48%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>

                <filter
                  id="dropShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="8"
                    stdDeviation="8"
                    floodColor="#000"
                    floodOpacity="0.3"
                  />
                </filter>

                <filter
                  id="greenGlow"
                  x="-80%"
                  y="-80%"
                  width="260%"
                  height="260%"
                >
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter
                  id="fieldGlow"
                  x="-80%"
                  y="-80%"
                  width="260%"
                  height="260%"
                >
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter
                  id="dotGlow"
                  x="-90%"
                  y="-90%"
                  width="280%"
                  height="280%"
                >
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {phases.map((phase) => (
                  <path
                    key={`main-current-path-${phase.id}`}
                    id={`mainCurrentPath-${phase.id}`}
                    d={getMainCurrentPath(phase)}
                    fill="none"
                  />
                ))}
              </defs>

              <rect x="0" y="0" width="1360" height="940" fill="#ffffff" />

              <rect
                x="420"
                y="40"
                width="245"
                height="36"
                rx="6"
                fill="#0b2a4a"
              />
              <text
                x="542"
                y="65"
                textAnchor="middle"
                fontSize="22"
                fontWeight="900"
                fill="#ffffff"
              >
                LINE / INPUT (SUPPLY)
              </text>

              <rect
                x="500"
                y="820"
                width="185"
                height="36"
                rx="6"
                fill="#0b2a4a"
              />
              <text
                x="592"
                y="845"
                textAnchor="middle"
                fontSize="22"
                fontWeight="900"
                fill="#ffffff"
              >
                LOAD / OUTPUT
              </text>

              <g filter="url(#dropShadow)">
                <rect
                  x="190"
                  y="180"
                  width="735"
                  height="500"
                  rx="28"
                  fill="url(#bodyBlack)"
                />

                <rect
                  x="220"
                  y="210"
                  width="675"
                  height="440"
                  rx="20"
                  fill="#1f2524"
                  stroke="#050505"
                  strokeWidth="5"
                />

                <rect
                  x="250"
                  y="260"
                  width="615"
                  height="320"
                  rx="14"
                  fill="#111827"
                  stroke="#374151"
                  strokeWidth="3"
                />

                <path
                  d="M240 235 H865 M240 620 H865 M275 260 V595 M840 260 V595"
                  stroke="#475569"
                  strokeWidth="4"
                  opacity="0.38"
                />

                {[
                  { x: 235, y: 225 },
                  { x: 840, y: 225 },
                  { x: 235, y: 600 },
                  { x: 840, y: 600 },
                ].map((slot, index) => (
                  <rect
                    key={index}
                    x={slot.x}
                    y={slot.y}
                    width="48"
                    height="36"
                    rx="9"
                    fill="#080b0b"
                    stroke="#495057"
                    strokeWidth="3"
                  />
                ))}
              </g>

              {phases.map((phase) => (
                <g key={`terminal-${phase.id}`}>
                  <text
                    x={phase.x}
                    y="104"
                    textAnchor="middle"
                    fontSize="28"
                    fontWeight="900"
                    fill="#111111"
                  >
                    {phase.lineNo}
                  </text>

                  <g filter="url(#dropShadow)">
                    <rect
                      x={phase.x - 52}
                      y="122"
                      width="104"
                      height="105"
                      rx="10"
                      fill="url(#creamBody)"
                      stroke="#8d8f86"
                      strokeWidth="2"
                    />

                    <circle cx={phase.x} cy="172" r="34" fill="#cfd1c6" />
                    <circle
                      cx={phase.x}
                      cy="172"
                      r="24"
                      fill="url(#screwHead)"
                    />

                    <path
                      d={`M${phase.x - 17} 178 Q${phase.x} 161 ${phase.x + 17} 178`}
                      stroke="#111"
                      strokeWidth="5"
                      fill="none"
                    />
                  </g>

                  <text
                    x={phase.x}
                    y="217"
                    textAnchor="middle"
                    fontSize="26"
                    fontWeight="900"
                    fill={phase.color}
                  >
                    {phase.lineLabel}
                  </text>

                  <g filter="url(#dropShadow)">
                    <rect
                      x={phase.x - 52}
                      y="670"
                      width="104"
                      height="105"
                      rx="10"
                      fill="url(#creamBody)"
                      stroke="#8d8f86"
                      strokeWidth="2"
                    />

                    <circle cx={phase.x} cy="720" r="34" fill="#cfd1c6" />
                    <circle
                      cx={phase.x}
                      cy="720"
                      r="24"
                      fill="url(#screwHead)"
                    />

                    <path
                      d={`M${phase.x - 17} 714 Q${phase.x} 731 ${phase.x + 17} 714`}
                      stroke="#111"
                      strokeWidth="5"
                      fill="none"
                    />
                  </g>

                  <text
                    x={phase.x}
                    y="769"
                    textAnchor="middle"
                    fontSize="26"
                    fontWeight="900"
                    fill={phase.color}
                  >
                    {phase.loadLabel}
                  </text>

                  <text
                    x={phase.x}
                    y="800"
                    textAnchor="middle"
                    fontSize="26"
                    fontWeight="900"
                    fill="#111111"
                  >
                    {phase.loadNo}
                  </text>
                </g>
              ))}

              {state.fieldOn && (
                <g
                  transform="translate(305 460)"
                  opacity="0.38"
                  filter="url(#fieldGlow)"
                >
                  {fieldRings.map((ring, index) => (
                    <ellipse
                      key={index}
                      cx="0"
                      cy="0"
                      rx={ring.rx}
                      ry={ring.ry}
                      fill="none"
                      stroke="#74ff85"
                      strokeWidth="4"
                      strokeDasharray="14 12"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-52"
                        dur="1.1s"
                        begin={ring.delay}
                        repeatCount="indefinite"
                      />

                      <animate
                        attributeName="opacity"
                        values="0.22;0.50;0.22"
                        dur="1.35s"
                        begin={ring.delay}
                        repeatCount="indefinite"
                      />

                      <animate
                        attributeName="rx"
                        values={`${ring.rx - 4};${ring.rx + 4};${ring.rx - 4}`}
                        dur="1.6s"
                        begin={ring.delay}
                        repeatCount="indefinite"
                      />

                      <animate
                        attributeName="ry"
                        values={`${ring.ry - 6};${ring.ry + 6};${ring.ry - 6}`}
                        dur="1.6s"
                        begin={ring.delay}
                        repeatCount="indefinite"
                      />
                    </ellipse>
                  ))}
                </g>
              )}

              <g transform="translate(45 310)">
                <text
                  x="0"
                  y="42"
                  fontSize="28"
                  fontWeight="900"
                  fill="#111827"
                >
                  A1
                </text>

                <text
                  x="0"
                  y="250"
                  fontSize="28"
                  fontWeight="900"
                  fill="#111827"
                >
                  A2
                </text>

                <circle
                  cx="55"
                  cy="58"
                  r="12"
                  fill="#e5e7eb"
                  stroke="#111827"
                  strokeWidth="3"
                />
                <circle
                  cx="55"
                  cy="252"
                  r="12"
                  fill="#e5e7eb"
                  stroke="#111827"
                  strokeWidth="3"
                />

                <rect
                  x="108"
                  y="-42"
                  width="94"
                  height="32"
                  rx="6"
                  fill="#0b2a4a"
                />

                <text
                  x="155"
                  y="-18"
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="900"
                  fill="#ffffff"
                >
                  COIL
                </text>

                <text
                  x="18"
                  y="148"
                  fontSize="26"
                  fontWeight="500"
                  fill={state.coilOn ? "#111111" : "#6b7280"}
                  opacity={state.coilOn ? 1 : 0.82}
                >
                  <tspan x="18" dy="0">
                    {coilVoltageDiagramLabel}
                  </tspan>
                  <tspan
                    x="18"
                    dy="30"
                    fontSize="22"
                    fontWeight="700"
                    fill={state.coilOn ? "#111111" : "#64748b"}
                  >
                    {coilVoltageDiagramType}
                  </tspan>
                </text>

                <path
                  id="coilCurrentLocalPath"
                  d="M55 58 H80 M80 58 V252 M80 252 H55"
                  fill="none"
                />

                <g filter="url(#dropShadow)">
                  <rect
                    x="80"
                    y="20"
                    width="150"
                    height="270"
                    rx="16"
                    fill="#111827"
                    stroke="#020617"
                    strokeWidth="4"
                  />

                  <rect
                    x="106"
                    y="44"
                    width="96"
                    height="222"
                    rx="12"
                    fill="#2a1a0c"
                    stroke="#111"
                    strokeWidth="4"
                  />

                  <rect
                    x="124"
                    y="58"
                    width="58"
                    height="194"
                    rx="9"
                    fill="#3d2610"
                  />
                </g>

                {Array.from({ length: 22 }).map((_, index) => (
                  <ellipse
                    key={index}
                    cx="155"
                    cy={64 + index * 8}
                    rx="54"
                    ry="7"
                    fill="none"
                    stroke={state.coilOn ? "#f59e0b" : "#a16207"}
                    strokeWidth="4"
                    opacity={state.coilOn ? 1 : 0.62}
                  />
                ))}

                <path
                  d="M55 58 H80 M80 58 V252 M80 252 H55"
                  fill="none"
                  stroke={state.coilOn ? "#22c55e" : "#6b7280"}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={state.coilOn ? "10 9" : "0"}
                  filter={state.coilOn ? "url(#greenGlow)" : undefined}
                  opacity={coilPathOpacity}
                >
                  {state.coilOn && (
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-38"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  )}
                </path>

                {state.coilOn &&
                  [0, 0.45, 0.9].map((delay, index) => (
                    <circle
                      key={index}
                      r="6"
                      fill="#22c55e"
                      filter="url(#dotGlow)"
                    >
                      <animateMotion
                        path="M55 58 H80 M80 58 V252 M80 252 H55"
                        dur="1.4s"
                        begin={`${delay}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
              </g>

              <rect
                x="255"
                y="288"
                width="90"
                height="38"
                rx="7"
                fill="#0b2a4a"
              />

              <text
                x="300"
                y="314"
                textAnchor="middle"
                fontSize="20"
                fontWeight="900"
                fill="#ffffff"
              >
                CORE
              </text>

              <g transform="translate(275 345)" filter="url(#dropShadow)">
                <rect
                  x="0"
                  y="0"
                  width="45"
                  height="230"
                  rx="8"
                  fill="url(#steel)"
                  stroke="#374151"
                  strokeWidth="3"
                />

                <rect
                  x="55"
                  y="50"
                  width="42"
                  height="130"
                  rx="8"
                  fill="url(#steel)"
                  stroke="#374151"
                  strokeWidth="3"
                />
              </g>

              <g
                transform={`translate(0 ${armatureOffsetY})`}
                style={{ transition: "transform 350ms ease" }}
                filter="url(#dropShadow)"
              >
                <rect
                  x="395"
                  y="350"
                  width="305"
                  height="62"
                  rx="8"
                  fill="url(#steel)"
                  stroke="#374151"
                  strokeWidth="3"
                />

                <rect
                  x="465"
                  y="338"
                  width="170"
                  height="96"
                  rx="8"
                  fill="#d1d5db"
                  stroke="#4b5563"
                  strokeWidth="3"
                />

                <text
                  x="550"
                  y="380"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="900"
                  fill="#0f172a"
                >
                  MOVING
                </text>

                <text
                  x="550"
                  y="407"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="900"
                  fill="#0f172a"
                >
                  ARMATURE
                </text>

                <rect
                  x="350"
                  y="368"
                  width="55"
                  height="26"
                  rx="5"
                  fill="url(#steel)"
                  stroke="#374151"
                  strokeWidth="3"
                />

                <rect
                  x="700"
                  y="368"
                  width="65"
                  height="26"
                  rx="5"
                  fill="url(#steel)"
                  stroke="#374151"
                  strokeWidth="3"
                />
              </g>

              <g transform="translate(750 315)">
                <rect
                  x="-28"
                  y="-28"
                  width="158"
                  height="40"
                  rx="7"
                  fill="#0b2a4a"
                />

                <text
                  x="51"
                  y="-2"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="900"
                  fill="#ffffff"
                >
                  RETURN SPRING
                </text>

                <line
                  x1="52"
                  y1="20"
                  x2="52"
                  y2="305"
                  stroke="#374151"
                  strokeWidth="5"
                  strokeDasharray="8 8"
                  opacity="0.65"
                />

                <rect
                  x="18"
                  y="18"
                  width="68"
                  height="16"
                  rx="5"
                  fill="#374151"
                />

                <path
                  d={springPath}
                  fill="none"
                  stroke="url(#steel)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <path
                  d={springPath}
                  fill="none"
                  stroke={state.coilOn ? "#f97316" : "#94a3b8"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                <rect
                  x="18"
                  y={springBottomY}
                  width="68"
                  height="16"
                  rx="5"
                  fill="#374151"
                />

                <line
                  x1="-55"
                  y1={88 + armatureOffsetY}
                  x2="18"
                  y2={springBottomY + 8}
                  stroke="#64748b"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </g>

              {phases.map((phase) => {
                const xOffset =
                  phase.id === "l1" ? 85 : phase.id === "l2" ? 0 : -85;

                return (
                  <g key={`visible-path-${phase.id}`}>
                    <path
                      d={`M ${phase.x} 207 V 275 H ${phase.x + xOffset}
                         V 400 H ${phase.x} V 585 H ${phase.x - xOffset * 0.45} V 670`}
                      fill="none"
                      stroke={phase.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={
                        state.mainClosed ? 1 : state.coilOn ? 0.35 : 0.18
                      }
                      strokeDasharray={state.mainClosed ? "0" : "10 12"}
                    />

                    {state.mainCurrent &&
                      [0, 0.35, 0.7].map((delay, index) => (
                        <circle
                          key={`${phase.id}-dot-${index}`}
                          r="7"
                          fill={phase.color}
                          filter="url(#dotGlow)"
                        >
                          <animateMotion
                            dur="1.7s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          >
                            <mpath href={`#mainCurrentPath-${phase.id}`} />
                          </animateMotion>
                        </circle>
                      ))}
                  </g>
                );
              })}

              <g>
                {phases.map((phase) => (
                  <g key={`contact-${phase.id}`}>
                    <rect
                      x={phase.x - 18}
                      y="422"
                      width="36"
                      height="64"
                      rx="8"
                      fill="url(#copper)"
                      stroke="#78350f"
                      strokeWidth="3"
                    />

                    <circle
                      cx={phase.x}
                      cy="430"
                      r="9"
                      fill="#fde68a"
                      opacity="0.85"
                    />

                    <rect
                      x={phase.x - 18}
                      y="558"
                      width="36"
                      height="64"
                      rx="8"
                      fill="url(#copper)"
                      stroke="#78350f"
                      strokeWidth="3"
                    />

                    <circle
                      cx={phase.x}
                      cy="614"
                      r="9"
                      fill="#fde68a"
                      opacity="0.85"
                    />

                    <g
                      transform={`translate(0 ${contactOffset})`}
                      style={{ transition: "transform 350ms ease" }}
                    >
                      <rect
                        x={phase.x - 34}
                        y="506"
                        width="68"
                        height="28"
                        rx="8"
                        fill="url(#copper)"
                        stroke="#78350f"
                        strokeWidth="3"
                      />

                      <circle cx={phase.x - 22} cy="520" r="5" fill="#fde68a" />
                      <circle cx={phase.x + 22} cy="520" r="5" fill="#fde68a" />
                    </g>
                  </g>
                ))}
              </g>

              <g transform="translate(990 125)">
                <rect
                  x="0"
                  y="0"
                  width="320"
                  height="650"
                  rx="18"
                  fill="#ffffff"
                  stroke="#0f172a"
                  strokeWidth="4"
                />

                <rect
                  x="38"
                  y="-55"
                  width="245"
                  height="44"
                  rx="7"
                  fill="#0b2a4a"
                />

                <text
                  x="160"
                  y="-26"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="900"
                  fill="#ffffff"
                >
                  AUXILIARY CONTACTS
                </text>

                <g transform="translate(45 35)">
                  <rect
                    x="70"
                    y="0"
                    width="140"
                    height="34"
                    rx="7"
                    fill="#15803d"
                  />

                  <text
                    x="140"
                    y="24"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="900"
                    fill="#ffffff"
                  >
                    13 - 14 (NO)
                  </text>

                  <rect
                    x="20"
                    y="70"
                    width="46"
                    height="32"
                    rx="5"
                    fill="#e5e7eb"
                    stroke="#111827"
                  />

                  <text
                    x="43"
                    y="93"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="900"
                    fill="#111827"
                  >
                    13
                  </text>

                  <rect
                    x="20"
                    y="255"
                    width="46"
                    height="32"
                    rx="5"
                    fill="#e5e7eb"
                    stroke="#111827"
                  />

                  <text
                    x="43"
                    y="278"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="900"
                    fill="#111827"
                  >
                    14
                  </text>

                  <rect
                    x="90"
                    y="55"
                    width="125"
                    height="235"
                    rx="10"
                    fill="#111827"
                    stroke="#374151"
                    strokeWidth="4"
                  />

                  <circle cx="130" cy="95" r="20" fill="url(#screwHead)" />
                  <circle cx="130" cy="250" r="20" fill="url(#screwHead)" />

                  <line
                    x1="130"
                    y1="115"
                    x2="130"
                    y2="145"
                    stroke="#94a3b8"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />

                  <line
                    x1="130"
                    y1="220"
                    x2="130"
                    y2="235"
                    stroke="#94a3b8"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="130"
                    cy="145"
                    r="9"
                    fill="url(#copper)"
                    stroke="#78350f"
                    strokeWidth="2"
                  />

                  <circle
                    cx="130"
                    cy="245"
                    r="9"
                    fill="url(#copper)"
                    stroke="#78350f"
                    strokeWidth="2"
                  />

                  <line
                    x1="130"
                    y1="145"
                    x2={auxNoBladeX2}
                    y2={auxNoBladeY2}
                    stroke={auxNoColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    style={{ transition: "all 350ms ease" }}
                  />

                  {state.auxNoClosed && (
                    <line
                      x1="130"
                      y1="115"
                      x2="130"
                      y2="245"
                      stroke="#22c55e"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                      filter="url(#greenGlow)"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-32"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </line>
                  )}

                  <rect
                    x="220"
                    y="155"
                    width="85"
                    height="42"
                    rx="9"
                    fill={auxNoColor}
                  />

                  <text
                    x="262"
                    y="182"
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="900"
                    fill="#ffffff"
                  >
                    {auxNoLabel}
                  </text>
                </g>

                <g transform="translate(45 350)">
                  <rect
                    x="70"
                    y="0"
                    width="140"
                    height="34"
                    rx="7"
                    fill="#dc2626"
                  />

                  <text
                    x="140"
                    y="24"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="900"
                    fill="#ffffff"
                  >
                    21 - 22 (NC)
                  </text>

                  <rect
                    x="20"
                    y="70"
                    width="46"
                    height="32"
                    rx="5"
                    fill="#e5e7eb"
                    stroke="#111827"
                  />

                  <text
                    x="43"
                    y="93"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="900"
                    fill="#111827"
                  >
                    21
                  </text>

                  <rect
                    x="20"
                    y="220"
                    width="46"
                    height="32"
                    rx="5"
                    fill="#e5e7eb"
                    stroke="#111827"
                  />

                  <text
                    x="43"
                    y="243"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="900"
                    fill="#111827"
                  >
                    22
                  </text>

                  <rect
                    x="90"
                    y="55"
                    width="125"
                    height="205"
                    rx="10"
                    fill="#111827"
                    stroke="#374151"
                    strokeWidth="4"
                  />

                  <circle cx="130" cy="95" r="20" fill="url(#screwHead)" />
                  <circle cx="130" cy="220" r="20" fill="url(#screwHead)" />

                  <line
                    x1="130"
                    y1="115"
                    x2="130"
                    y2="145"
                    stroke="#94a3b8"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />

                  <line
                    x1="130"
                    y1="195"
                    x2="130"
                    y2="205"
                    stroke="#94a3b8"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="130"
                    cy="145"
                    r="9"
                    fill="url(#copper)"
                    stroke="#78350f"
                    strokeWidth="2"
                  />

                  <circle
                    cx="130"
                    cy="220"
                    r="9"
                    fill="url(#copper)"
                    stroke="#78350f"
                    strokeWidth="2"
                  />

                  <line
                    x1="130"
                    y1="145"
                    x2={auxNcBladeX2}
                    y2={auxNcBladeY2}
                    stroke={auxNcColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    style={{ transition: "all 350ms ease" }}
                  />

                  {state.auxNcClosed && (
                    <line
                      x1="130"
                      y1="115"
                      x2="130"
                      y2="220"
                      stroke="#22c55e"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                      filter="url(#greenGlow)"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-32"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </line>
                  )}

                  <rect
                    x="220"
                    y="120"
                    width="85"
                    height="42"
                    rx="9"
                    fill={auxNcColor}
                  />

                  <text
                    x="262"
                    y="147"
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="900"
                    fill="#ffffff"
                  >
                    {auxNcLabel}
                  </text>
                </g>
              </g>

              <g transform="translate(960 875)">
                <rect
                  x="0"
                  y="0"
                  width="365"
                  height="42"
                  rx="9"
                  fill="#f0fdf4"
                  stroke="#15803d"
                  strokeWidth="2"
                />

                <text
                  x="174"
                  y="28"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="900"
                  fill="#166534"
                >
                  SYSTEM STATUS : OPERATIONAL
                </text>

                <circle cx="335" cy="21" r="18" fill="#16a34a" />

                <path
                  d="M326 21 L333 28 L346 13"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </section>
        </main>
      </div>
    </div>
  );
}
