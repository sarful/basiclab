"use client";

import { useMemo, useState } from "react";

type Mode = "onoff" | "timeline";
type Stage = "OFF" | "SWITCHING" | "ON";
type CoilKind = "AC" | "DC";

type Phase = {
  id: string;
  inputLabel: string;
  outputLabel: string;
  inputTerminal: string;
  outputTerminal: string;
  y: number;
  color: string;
};

type MagneticFieldRing = {
  rx: number;
  ry: number;
  delay: string;
};

type CoilOption = {
  type: CoilKind;
  label: string;
  voltage: number;
  displayVoltage: string;
};

type DiagramState = {
  coilEnergized: boolean;
  coilVoltageProgress: number;
  contactsClosed: boolean;
  magneticFieldActive: boolean;
  mainCurrentFlowing: boolean;
  auxNoClosed: boolean;
  auxNcClosed: boolean;
  bridgeOffset: number;
  motionProgress: number;
  stage: Stage;
  previewText: string;
};

const phases: Phase[] = [
  {
    id: "l1",
    inputLabel: "L1",
    outputLabel: "T1",
    inputTerminal: "1L1",
    outputTerminal: "2T1",
    y: 150,
    color: "#e21a1a",
  },
  {
    id: "l2",
    inputLabel: "L2",
    outputLabel: "T2",
    inputTerminal: "3L2",
    outputTerminal: "4T2",
    y: 265,
    color: "#f4b400",
  },
  {
    id: "l3",
    inputLabel: "L3",
    outputLabel: "T3",
    inputTerminal: "5L3",
    outputTerminal: "6T3",
    y: 380,
    color: "#1746a2",
  },
];

const magneticFieldRings: MagneticFieldRing[] = [
  { rx: 135, ry: 42, delay: "0s" },
  { rx: 165, ry: 52, delay: "0.2s" },
  { rx: 195, ry: 62, delay: "0.4s" },
  { rx: 225, ry: 72, delay: "0.6s" },
];

const coilOptions: CoilOption[] = [
  { type: "AC", label: "AC Coil", voltage: 24, displayVoltage: "24 V AC" },
  {
    type: "AC",
    label: "AC Coil",
    voltage: 110,
    displayVoltage: "110 / 120 V AC",
  },
  {
    type: "AC",
    label: "AC Coil",
    voltage: 220,
    displayVoltage: "220 / 230 V AC",
  },
  {
    type: "AC",
    label: "AC Coil",
    voltage: 380,
    displayVoltage: "380 / 415 V AC",
  },
  { type: "DC", label: "DC Coil", voltage: 12, displayVoltage: "12 V DC" },
  { type: "DC", label: "DC Coil", voltage: 24, displayVoltage: "24 V DC" },
  { type: "DC", label: "DC Coil", voltage: 48, displayVoltage: "48 V DC" },
  { type: "DC", label: "DC Coil", voltage: 110, displayVoltage: "110 V DC" },
];

const OFF_BRIDGE_OFFSET = -48;
const ON_BRIDGE_OFFSET = 0;

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function getTimelineState(timeCursor: number): DiagramState {
  const voltageProgress = timeCursor / 100;

  if (timeCursor === 0) {
    return {
      coilEnergized: false,
      coilVoltageProgress: 0,
      contactsClosed: false,
      magneticFieldActive: false,
      mainCurrentFlowing: false,
      auxNoClosed: false,
      auxNcClosed: true,
      bridgeOffset: OFF_BRIDGE_OFFSET,
      motionProgress: 0,
      stage: "OFF",
      previewText:
        "Coil is de-energized. Magnetic field is off. Main contacts are open. NC auxiliary contact is closed.",
    };
  }

  if (timeCursor < 55) {
    return {
      coilEnergized: true,
      coilVoltageProgress: voltageProgress,
      contactsClosed: false,
      magneticFieldActive: voltageProgress > 0.15,
      mainCurrentFlowing: false,
      auxNoClosed: false,
      auxNcClosed: true,
      bridgeOffset: OFF_BRIDGE_OFFSET,
      motionProgress: 0,
      stage: "SWITCHING",
      previewText:
        "Control voltage is rising. Magnetic field is building, but the main contacts have not closed yet.",
    };
  }

  if (timeCursor < 85) {
    const progress = (timeCursor - 55) / 30;

    return {
      coilEnergized: true,
      coilVoltageProgress: voltageProgress,
      contactsClosed: false,
      magneticFieldActive: true,
      mainCurrentFlowing: false,
      auxNoClosed: false,
      auxNcClosed: false,
      bridgeOffset: OFF_BRIDGE_OFFSET + progress * Math.abs(OFF_BRIDGE_OFFSET),
      motionProgress: progress,
      stage: "SWITCHING",
      previewText:
        "The magnetic field pulls the armature. Main contacts are moving toward closed.",
    };
  }

  return {
    coilEnergized: true,
    coilVoltageProgress: voltageProgress,
    contactsClosed: true,
    magneticFieldActive: true,
    mainCurrentFlowing: true,
    auxNoClosed: true,
    auxNcClosed: false,
    bridgeOffset: ON_BRIDGE_OFFSET,
    motionProgress: 1,
    stage: "ON",
    previewText:
      "Main contacts are closed. Current flows to the three-phase motor.",
  };
}

function getManualState(isOn: boolean): DiagramState {
  return {
    coilEnergized: isOn,
    coilVoltageProgress: isOn ? 1 : 0,
    contactsClosed: isOn,
    magneticFieldActive: isOn,
    mainCurrentFlowing: isOn,
    auxNoClosed: isOn,
    auxNcClosed: !isOn,
    bridgeOffset: isOn ? ON_BRIDGE_OFFSET : OFF_BRIDGE_OFFSET,
    motionProgress: isOn ? 1 : 0,
    stage: isOn ? "ON" : "OFF",
    previewText: isOn
      ? "Coil is energized. Main contacts are closed and the motor is running."
      : "Coil is de-energized. Main contacts are open and the motor is stopped.",
  };
}

export default function MagneticContactorOperationDiagram() {
  const [mode, setMode] = useState<Mode>("onoff");
  const [manualOn, setManualOn] = useState(false);
  const [timeCursor, setTimeCursor] = useState(0);
  const [coilType, setCoilType] = useState<CoilKind>("AC");
  const [canvasScale, setCanvasScale] = useState(100);
  const [selectedCoilVoltage, setSelectedCoilVoltage] =
    useState("220 / 230 V AC");

  const diagramState = useMemo<DiagramState>(() => {
    return mode === "onoff"
      ? getManualState(manualOn)
      : getTimelineState(timeCursor);
  }, [mode, manualOn, timeCursor]);

  const visibleCoilOptions = coilOptions.filter(
    (option) => option.type === coilType,
  );

  const selectedCoilOption =
    coilOptions.find(
      (option) => option.displayVoltage === selectedCoilVoltage,
    ) ?? coilOptions[2];

  const coilVoltageValue = Math.round(
    selectedCoilOption.voltage * diagramState.coilVoltageProgress,
  );

  const coilVoltageLabel =
    diagramState.stage === "OFF"
      ? `0 V ${selectedCoilOption.type}`
      : `${coilVoltageValue} V ${selectedCoilOption.type}`;

  const coilVoltageDescription =
    diagramState.stage === "OFF"
      ? `No control voltage is present across A1 and A2. Selected coil: ${selectedCoilOption.displayVoltage}.`
      : diagramState.stage === "SWITCHING"
        ? `Control voltage is rising across A1 and A2. The ${selectedCoilOption.label} is building magnetic pull at ${coilVoltageValue} V.`
        : `Full control voltage of ${selectedCoilOption.displayVoltage} is present across A1 and A2.`;

  function handleModeChange(nextMode: Mode) {
    setMode(nextMode);

    if (nextMode === "timeline") {
      setTimeCursor(0);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f5f6fb] p-3 md:p-5">
      <div className="mx-auto grid w-full max-w-[1780px] gap-4 rounded-[28px] bg-white p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] xl:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f4f7fb_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.10)]">
          <h2 className="mb-4 text-center text-[24px] font-black uppercase tracking-wide text-[#123b9f]">
            Control Panel
          </h2>

          <div className="space-y-5">
            <section className="rounded-[18px] border border-slate-300 bg-white p-4">
              <h3 className="mb-3 text-[17px] font-black uppercase text-slate-800">
                Mode Select
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleModeChange("onoff")}
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
                  onClick={() => handleModeChange("timeline")}
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
                    onClick={() =>
                      setSelectedCoilVoltage(option.displayVoltage)
                    }
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
                      diagramState.stage === "OFF" && "bg-red-500",
                      diagramState.stage === "SWITCHING" && "bg-yellow-500",
                      diagramState.stage === "ON" && "bg-green-600",
                    )}
                    style={{ width: `${timeCursor}%` }}
                  />
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
                  diagramState.stage === "OFF" && "bg-slate-600",
                  diagramState.stage === "SWITCHING" && "bg-yellow-500",
                  diagramState.stage === "ON" && "bg-[#123b9f]",
                )}
              >
                {coilVoltageLabel}
              </div>

              <p className="text-[14px] font-semibold leading-6 text-slate-700">
                {coilVoltageDescription}
              </p>
            </section>

            <section className="rounded-[18px] border border-slate-300 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-[17px] font-black uppercase text-slate-800">
                  Canvas Scale
                </h3>
                <span className="text-[15px] font-black text-[#123b9f]">
                  {canvasScale}%
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={canvasScale}
                onChange={(event) =>
                  setCanvasScale(Number(event.target.value))
                }
                className="w-full accent-[#123b9f]"
              />

              <div className="mt-2 flex justify-between text-[12px] font-black text-slate-600">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </section>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="flex w-full items-start justify-center overflow-x-auto rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <svg
              viewBox="-40 -20 980 2100"
              preserveAspectRatio="xMidYMid meet"
              className="mx-auto block h-auto max-w-[720px] transition-all"
              style={{
                width: `${canvasScale}%`,
                minWidth: canvasScale === 0 ? 0 : 260,
              }}
              role="img"
              aria-label="Rotated magnetic contactor circuit diagram"
            >
              <defs>
                <linearGradient id="metalGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#d7dbe0" />
                  <stop offset="45%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#8f969f" />
                </linearGradient>

                <linearGradient id="darkMetal" x1="0" x2="1">
                  <stop offset="0%" stopColor="#2d343b" />
                  <stop offset="45%" stopColor="#b8c0c8" />
                  <stop offset="100%" stopColor="#1b2026" />
                </linearGradient>

                <linearGradient id="copperGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#f4b183" />
                  <stop offset="45%" stopColor="#c76f35" />
                  <stop offset="100%" stopColor="#f5c29b" />
                </linearGradient>

                <linearGradient id="coreGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#8a4d0d" />
                  <stop offset="45%" stopColor="#bf7827" />
                  <stop offset="100%" stopColor="#6f3d08" />
                </linearGradient>

                <linearGradient id="motorBodyGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="45%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>

                <linearGradient id="motorDarkGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <filter
                  id="softShadow"
                  x="-25%"
                  y="-25%"
                  width="150%"
                  height="150%"
                >
                  <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="6"
                    floodColor="#000000"
                    floodOpacity="0.18"
                  />
                </filter>

                <filter
                  id="blueGlow"
                  x="-45%"
                  y="-45%"
                  width="190%"
                  height="190%"
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
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {phases.map((phase) => (
                  <path
                    key={`phase-path-${phase.id}`}
                    id={`phasePath-${phase.id}`}
                    d={`M 120 ${phase.y} H 1665`}
                    fill="none"
                  />
                ))}

                <path
                  id="coilPositivePath"
                  d="M 525 610 H 660 Q 678 610 678 592 V 585"
                  fill="none"
                />

                <path id="coilReturnPath" d="M 660 760 H 525" fill="none" />
              </defs>

              <rect
                x="-40"
                y="-20"
                width="980"
                height="1720"
                rx="28"
                fill="#ffffff"
              />

              <g transform="translate(900 0) rotate(90)">
                <text
                  x="275"
                  y="65"
                  textAnchor="middle"
                  fontSize="30"
                  fontWeight="900"
                  fill="#123b9f"
                >
                  MAIN SUPPLY INPUT
                </text>

                <text
                  x="800"
                  y="50"
                  textAnchor="middle"
                  fontSize="30"
                  fontWeight="900"
                  fill="#123b9f"
                >
                  MOVING CONTACT BRIDGE
                </text>

                <text
                  x="1305"
                  y="65"
                  textAnchor="middle"
                  fontSize="30"
                  fontWeight="900"
                  fill="#123b9f"
                >
                  OUTPUT TERMINALS
                </text>

                {phases.map((phase) => (
                  <g key={phase.id}>
                    <text
                      x="42"
                      y={phase.y + 13}
                      fontSize="36"
                      fontWeight="900"
                      fill={phase.color}
                    >
                      {phase.inputLabel}
                    </text>

                    <rect
                      x="82"
                      y={phase.y - 50}
                      width="78"
                      height="28"
                      rx="7"
                      fill="#ffffff"
                      stroke={phase.color}
                      strokeWidth="2"
                    />

                    <text
                      x="121"
                      y={phase.y - 29}
                      textAnchor="middle"
                      fontSize="19"
                      fontWeight="900"
                      fill={phase.color}
                    >
                      {phase.inputTerminal}
                    </text>

                    <circle
                      cx="120"
                      cy={phase.y}
                      r="13"
                      fill="#ffffff"
                      stroke="#111111"
                      strokeWidth="3"
                    />

                    <line
                      x1="133"
                      y1={phase.y}
                      x2="455"
                      y2={phase.y}
                      stroke={phase.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity={diagramState.contactsClosed ? 1 : 0.42}
                    />

                    <g filter="url(#softShadow)">
                      <rect
                        x="455"
                        y={phase.y - 33}
                        width="82"
                        height="66"
                        rx="6"
                        fill="url(#metalGradient)"
                        stroke="#222"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="496"
                        cy={phase.y}
                        r="16"
                        fill="#8c8c8c"
                        stroke="#111"
                        strokeWidth="2.5"
                      />
                      <line
                        x1="484"
                        y1={phase.y - 12}
                        x2="508"
                        y2={phase.y + 12}
                        stroke="#111"
                        strokeWidth="3"
                      />
                      <line
                        x1="508"
                        y1={phase.y - 12}
                        x2="484"
                        y2={phase.y + 12}
                        stroke="#111"
                        strokeWidth="3"
                      />
                    </g>

                    <rect
                      x="537"
                      y={phase.y - 6}
                      width="128"
                      height="12"
                      fill="url(#copperGradient)"
                      stroke="#704020"
                      strokeWidth="1.5"
                      opacity={diagramState.contactsClosed ? 1 : 0.55}
                    />

                    <circle
                      cx="668"
                      cy={phase.y}
                      r="14"
                      fill="url(#copperGradient)"
                      stroke="#704020"
                      strokeWidth="2.5"
                    />

                    <g
                      transform={`translate(0 ${diagramState.bridgeOffset})`}
                      style={{ transition: "transform 350ms ease" }}
                    >
                      <rect
                        x="665"
                        y={phase.y - 11}
                        width="270"
                        height="22"
                        rx="5"
                        fill="url(#metalGradient)"
                        stroke="#222"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="668"
                        cy={phase.y}
                        r="14"
                        fill="url(#copperGradient)"
                        stroke="#704020"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="932"
                        cy={phase.y}
                        r="14"
                        fill="url(#copperGradient)"
                        stroke="#704020"
                        strokeWidth="2.5"
                      />
                    </g>

                    <circle
                      cx="932"
                      cy={phase.y}
                      r="14"
                      fill="url(#copperGradient)"
                      stroke="#704020"
                      strokeWidth="2.5"
                    />

                    <rect
                      x="935"
                      y={phase.y - 6}
                      width="128"
                      height="12"
                      fill="url(#copperGradient)"
                      stroke="#704020"
                      strokeWidth="1.5"
                      opacity={diagramState.contactsClosed ? 1 : 0.55}
                    />

                    <g filter="url(#softShadow)">
                      <rect
                        x="1063"
                        y={phase.y - 33}
                        width="82"
                        height="66"
                        rx="6"
                        fill="url(#metalGradient)"
                        stroke="#222"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="1104"
                        cy={phase.y}
                        r="16"
                        fill="#8c8c8c"
                        stroke="#111"
                        strokeWidth="2.5"
                      />
                      <line
                        x1="1092"
                        y1={phase.y - 12}
                        x2="1116"
                        y2={phase.y + 12}
                        stroke="#111"
                        strokeWidth="3"
                      />
                      <line
                        x1="1116"
                        y1={phase.y - 12}
                        x2="1092"
                        y2={phase.y + 12}
                        stroke="#111"
                        strokeWidth="3"
                      />
                    </g>

                    <line
                      x1="1145"
                      y1={phase.y}
                      x2="1467"
                      y2={phase.y}
                      stroke={phase.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity={diagramState.contactsClosed ? 1 : 0.42}
                    />

                    <circle
                      cx="1480"
                      cy={phase.y}
                      r="13"
                      fill="#ffffff"
                      stroke="#111111"
                      strokeWidth="3"
                    />

                    <line
                      x1="1493"
                      y1={phase.y}
                      x2="1618"
                      y2={phase.y}
                      stroke={phase.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity={diagramState.contactsClosed ? 1 : 0.42}
                    />

                    <rect
                      x="1439"
                      y={phase.y - 50}
                      width="82"
                      height="28"
                      rx="7"
                      fill="#ffffff"
                      stroke={phase.color}
                      strokeWidth="2"
                    />

                    <text
                      x="1480"
                      y={phase.y - 29}
                      textAnchor="middle"
                      fontSize="19"
                      fontWeight="900"
                      fill={phase.color}
                    >
                      {phase.outputTerminal}
                    </text>

                    <text
                      x="1515"
                      y={phase.y + 13}
                      fontSize="36"
                      fontWeight="900"
                      fill={phase.color}
                    >
                      {phase.outputLabel}
                    </text>

                    {diagramState.mainCurrentFlowing && (
                      <g>
                        {[0, 0.35, 0.7].map((delay, index) => (
                          <circle
                            key={`${phase.id}-current-dot-${index}`}
                            r="8"
                            fill={phase.color}
                            filter="url(#dotGlow)"
                          >
                            <animateMotion
                              dur="1.8s"
                              begin={`${delay}s`}
                              repeatCount="indefinite"
                            >
                              <mpath href={`#phasePath-${phase.id}`} />
                            </animateMotion>
                          </circle>
                        ))}
                      </g>
                    )}
                  </g>
                ))}

                <g transform="translate(1605 80)" filter="url(#softShadow)">
                  <text
                    x="105"
                    y="-25"
                    textAnchor="middle"
                    fontSize="28"
                    fontWeight="900"
                    fill="#123b9f"
                  >
                    THREE-PHASE MOTOR
                  </text>

                  <text
                    x="105"
                    y="5"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="800"
                    fill="#475569"
                  >
                    LOAD SECTION
                  </text>

                  <rect
                    x="-10"
                    y="42"
                    width="62"
                    height="335"
                    rx="14"
                    fill="#ffffff"
                    stroke="#8b9ab0"
                    strokeWidth="2.5"
                  />

                  {phases.map((phase, index) => {
                    const motorTerminal = ["U", "V", "W"][index];

                    return (
                      <g key={`motor-terminal-${phase.id}`}>
                        <circle
                          cx="22"
                          cy={phase.y - 80}
                          r="13"
                          fill="#ffffff"
                          stroke={phase.color}
                          strokeWidth="4"
                        />
                        <text
                          x="22"
                          y={phase.y - 103}
                          textAnchor="middle"
                          fontSize="17"
                          fontWeight="900"
                          fill={phase.color}
                        >
                          {motorTerminal}
                        </text>
                        <line
                          x1="35"
                          y1={phase.y - 80}
                          x2="75"
                          y2={phase.y - 80}
                          stroke={phase.color}
                          strokeWidth="6"
                          strokeLinecap="round"
                          opacity={diagramState.contactsClosed ? 1 : 0.42}
                        />
                      </g>
                    );
                  })}

                  <rect
                    x="75"
                    y="35"
                    width="230"
                    height="350"
                    rx="32"
                    fill="url(#motorBodyGradient)"
                    stroke="#1e3a8a"
                    strokeWidth="4"
                  />

                  <rect
                    x="98"
                    y="70"
                    width="184"
                    height="280"
                    rx="28"
                    fill="url(#motorDarkGradient)"
                    opacity="0.94"
                  />

                  {Array.from({ length: 8 }).map((_, index) => (
                    <line
                      key={`motor-fin-${index}`}
                      x1="112"
                      y1={92 + index * 30}
                      x2="268"
                      y2={92 + index * 30}
                      stroke="#bfdbfe"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  ))}

                  <circle
                    cx="190"
                    cy="210"
                    r="78"
                    fill="#ffffff"
                    stroke="#1e3a8a"
                    strokeWidth="5"
                  />

                  <circle
                    cx="190"
                    cy="210"
                    r="54"
                    fill="#dbeafe"
                    stroke="#2563eb"
                    strokeWidth="4"
                  />

                  <circle cx="190" cy="210" r="16" fill="#1e3a8a" />

                  <g
                    transform="translate(190 210)"
                    opacity={diagramState.mainCurrentFlowing ? 1 : 0.45}
                  >
                    <g>
                      <path
                        d="M 0 -12 C 36 -58 62 -34 28 -4 Z"
                        fill="#60a5fa"
                        opacity="0.9"
                      />
                      <path
                        d="M 10 8 C 58 34 36 64 4 28 Z"
                        fill="#60a5fa"
                        opacity="0.9"
                      />
                      <path
                        d="M -12 6 C -58 36 -64 -4 -26 -20 Z"
                        fill="#60a5fa"
                        opacity="0.9"
                      />

                      {diagramState.mainCurrentFlowing && (
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 0 0"
                          to="360 0 0"
                          dur="1.1s"
                          repeatCount="indefinite"
                        />
                      )}
                    </g>
                  </g>

                  <rect
                    x="305"
                    y="194"
                    width="80"
                    height="32"
                    rx="8"
                    fill="url(#darkMetal)"
                    stroke="#111827"
                    strokeWidth="3"
                  />

                  <circle
                    cx="392"
                    cy="210"
                    r="20"
                    fill="#cbd5e1"
                    stroke="#475569"
                    strokeWidth="4"
                  />

                  <rect
                    x="86"
                    y="405"
                    width="210"
                    height="44"
                    rx="12"
                    fill={
                      diagramState.mainCurrentFlowing ? "#dcfce7" : "#fee2e2"
                    }
                    stroke={
                      diagramState.mainCurrentFlowing ? "#16a34a" : "#dc2626"
                    }
                    strokeWidth="2"
                  />

                  <circle
                    cx="112"
                    cy="427"
                    r="10"
                    fill={
                      diagramState.mainCurrentFlowing ? "#16a34a" : "#dc2626"
                    }
                  />

                  <text
                    x="198"
                    y="434"
                    textAnchor="middle"
                    fontSize="17"
                    fontWeight="900"
                    fill={
                      diagramState.mainCurrentFlowing ? "#166534" : "#991b1b"
                    }
                  >
                    {diagramState.mainCurrentFlowing
                      ? "MOTOR RUNNING"
                      : "MOTOR STOPPED"}
                  </text>
                </g>

                <g transform="translate(1035 455)">
                  <rect
                    width="505"
                    height="122"
                    rx="16"
                    fill="#ffffff"
                    stroke="#8b9ab0"
                    strokeWidth="2.5"
                  />

                  <text
                    x="252"
                    y="28"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="900"
                    fill="#123b9f"
                  >
                    AUXILIARY CONTACTS
                  </text>

                  <g>
                    <text
                      x="22"
                      y="62"
                      fontSize="18"
                      fontWeight="900"
                      fill="#e21a1a"
                    >
                      NC 21-22
                    </text>

                    <line
                      x1="115"
                      y1="56"
                      x2="150"
                      y2="56"
                      stroke="#111"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="150"
                      cy="56"
                      r="8"
                      fill="url(#copperGradient)"
                      stroke="#704020"
                      strokeWidth="2"
                    />

                    <circle
                      cx="285"
                      cy="56"
                      r="8"
                      fill="url(#copperGradient)"
                      stroke="#704020"
                      strokeWidth="2"
                    />

                    <line
                      x1="150"
                      y1="56"
                      x2="270"
                      y2={56 + diagramState.motionProgress * 30}
                      stroke={diagramState.auxNcClosed ? "#16a34a" : "#111111"}
                      strokeWidth="5"
                      strokeLinecap="round"
                      style={{ transition: "all 350ms ease" }}
                    />

                    <line
                      x1="293"
                      y1="56"
                      x2="350"
                      y2="56"
                      stroke="#111"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="380"
                      cy="56"
                      r="9"
                      fill={diagramState.auxNcClosed ? "#16a34a" : "#dc2626"}
                    />

                    <text
                      x="397"
                      y="63"
                      fontSize="17"
                      fontWeight="900"
                      fill={diagramState.auxNcClosed ? "#16a34a" : "#dc2626"}
                    >
                      {diagramState.auxNcClosed ? "CLOSED" : "OPEN"}
                    </text>
                  </g>

                  <g>
                    <text
                      x="22"
                      y="102"
                      fontSize="18"
                      fontWeight="900"
                      fill="#0f8a27"
                    >
                      NO 13-14
                    </text>

                    <line
                      x1="115"
                      y1="96"
                      x2="150"
                      y2="96"
                      stroke="#111"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="150"
                      cy="96"
                      r="8"
                      fill="url(#copperGradient)"
                      stroke="#704020"
                      strokeWidth="2"
                    />

                    <circle
                      cx="285"
                      cy="96"
                      r="8"
                      fill="url(#copperGradient)"
                      stroke="#704020"
                      strokeWidth="2"
                    />

                    <line
                      x1="150"
                      y1="96"
                      x2="270"
                      y2={96 - (1 - diagramState.motionProgress) * 30}
                      stroke={diagramState.auxNoClosed ? "#16a34a" : "#111111"}
                      strokeWidth="5"
                      strokeLinecap="round"
                      style={{ transition: "all 350ms ease" }}
                    />

                    <line
                      x1="293"
                      y1="96"
                      x2="350"
                      y2="96"
                      stroke="#111"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="380"
                      cy="96"
                      r="9"
                      fill={diagramState.auxNoClosed ? "#16a34a" : "#dc2626"}
                    />

                    <text
                      x="397"
                      y="103"
                      fontSize="17"
                      fontWeight="900"
                      fill={diagramState.auxNoClosed ? "#16a34a" : "#dc2626"}
                    >
                      {diagramState.auxNoClosed ? "CLOSED" : "OPEN"}
                    </text>
                  </g>
                </g>

                <g
                  filter="url(#softShadow)"
                  transform={`translate(0 ${diagramState.bridgeOffset})`}
                  style={{ transition: "transform 350ms ease" }}
                >
                  <rect
                    x="778"
                    y="150"
                    width="44"
                    height="385"
                    rx="7"
                    fill="url(#darkMetal)"
                    stroke="#1d232a"
                    strokeWidth="3"
                  />
                </g>

                <g filter="url(#softShadow)">
                  <path
                    d="
                      M 620 480
                      H 765
                      V 540
                      H 835
                      V 480
                      H 980
                      V 615
                      H 835
                      V 570
                      H 765
                      V 615
                      H 620
                      Z
                    "
                    fill="url(#coreGradient)"
                    stroke="#4e2d08"
                    strokeWidth="4"
                  />
                </g>

                <g filter="url(#softShadow)">
                  <path
                    d="
                      M 620 755
                      H 765
                      V 710
                      H 835
                      V 755
                      H 980
                      V 875
                      H 620
                      Z
                    "
                    fill="url(#coreGradient)"
                    stroke="#4e2d08"
                    strokeWidth="4"
                  />
                </g>

                <g filter="url(#softShadow)">
                  <rect
                    x="780"
                    y="560"
                    width="40"
                    height="275"
                    rx="8"
                    fill="url(#darkMetal)"
                    stroke="#1d232a"
                    strokeWidth="3"
                  />
                </g>

                <g filter="url(#softShadow)">
                  <rect
                    x="726"
                    y="610"
                    width="148"
                    height="150"
                    rx="26"
                    fill="#1e1e1e"
                    stroke="#080808"
                    strokeWidth="4"
                  />

                  <ellipse
                    cx="800"
                    cy="610"
                    rx="88"
                    ry="21"
                    fill="#2b2b2b"
                    stroke="#080808"
                    strokeWidth="4"
                  />

                  <ellipse
                    cx="800"
                    cy="760"
                    rx="88"
                    ry="21"
                    fill="#2b2b2b"
                    stroke="#080808"
                    strokeWidth="4"
                  />
                </g>

                {diagramState.magneticFieldActive && (
                  <g filter="url(#blueGlow)" opacity="0.95">
                    {magneticFieldRings.map((ring, index) => (
                      <ellipse
                        key={`magnetic-field-${index}`}
                        cx="800"
                        cy="690"
                        rx={ring.rx}
                        ry={ring.ry}
                        fill="none"
                        stroke="#38a9ff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="18 14"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="0;-64"
                          dur="1.4s"
                          begin={ring.delay}
                          repeatCount="indefinite"
                        />

                        <animate
                          attributeName="opacity"
                          values="0.25;1;0.25"
                          dur="1.4s"
                          begin={ring.delay}
                          repeatCount="indefinite"
                        />

                        <animate
                          attributeName="rx"
                          values={`${ring.rx - 8};${ring.rx + 8};${ring.rx - 8}`}
                          dur="1.8s"
                          begin={ring.delay}
                          repeatCount="indefinite"
                        />

                        <animate
                          attributeName="ry"
                          values={`${ring.ry - 4};${ring.ry + 4};${ring.ry - 4}`}
                          dur="1.8s"
                          begin={ring.delay}
                          repeatCount="indefinite"
                        />
                      </ellipse>
                    ))}

                    <ellipse
                      cx="800"
                      cy="690"
                      rx="112"
                      ry="34"
                      fill="#38a9ff"
                      opacity="0.08"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.04;0.16;0.04"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </ellipse>
                  </g>
                )}

                <g>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <ellipse
                      key={index}
                      cx="800"
                      cy={620 + index * 12}
                      rx="92"
                      ry="11"
                      fill="none"
                      stroke="#e17a36"
                      strokeWidth="5"
                      opacity={diagramState.coilEnergized ? 1 : 0.62}
                    />
                  ))}
                </g>

                <g>
                  <path
                    d="M 398 610 H 426 M 398 610 V 760 M 398 760 H 426"
                    stroke="#123b9f"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />

                  <text
                    x="346"
                    y="687"
                    textAnchor="middle"
                    fontSize="21"
                    fontWeight="900"
                    fill="#123b9f"
                  >
                    COIL
                  </text>

                  <text
                    x="474"
                    y="692"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="500"
                    fill="#111111"
                  >
                    {coilVoltageLabel}
                  </text>

                  <rect
                    x="438"
                    y="586"
                    width="76"
                    height="42"
                    rx="8"
                    fill="#ffffff"
                    stroke="#8b9ab0"
                    strokeWidth="2"
                  />

                  <text
                    x="476"
                    y="615"
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="900"
                    fill="#123b9f"
                  >
                    A1
                  </text>

                  <circle
                    cx="525"
                    cy="610"
                    r="13"
                    fill="#ffffff"
                    stroke="#111111"
                    strokeWidth="3"
                  />

                  <path
                    d="M 538 610 H 660 Q 678 610 678 592 V 585"
                    stroke="#e21a1a"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    opacity={diagramState.coilEnergized ? 1 : 0.5}
                  />

                  <rect
                    x="438"
                    y="742"
                    width="76"
                    height="42"
                    rx="8"
                    fill="#ffffff"
                    stroke="#8b9ab0"
                    strokeWidth="2"
                  />

                  <text
                    x="476"
                    y="771"
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="900"
                    fill="#123b9f"
                  >
                    A2
                  </text>

                  <circle
                    cx="525"
                    cy="760"
                    r="13"
                    fill="#ffffff"
                    stroke="#111111"
                    strokeWidth="3"
                  />

                  <path
                    d="M 538 760 H 660"
                    stroke="#111111"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    opacity={diagramState.coilEnergized ? 1 : 0.5}
                  />

                  {diagramState.coilEnergized && (
                    <g>
                      {[0, 0.45].map((delay, index) => (
                        <circle
                          key={`coil-positive-dot-${index}`}
                          r="7"
                          fill="#e21a1a"
                          filter="url(#dotGlow)"
                        >
                          <animateMotion
                            dur="1.35s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          >
                            <mpath href="#coilPositivePath" />
                          </animateMotion>
                        </circle>
                      ))}

                      {[0.2, 0.65].map((delay, index) => (
                        <circle
                          key={`coil-return-dot-${index}`}
                          r="7"
                          fill="#111111"
                          filter="url(#dotGlow)"
                        >
                          <animateMotion
                            dur="1.35s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          >
                            <mpath href="#coilReturnPath" />
                          </animateMotion>
                        </circle>
                      ))}
                    </g>
                  )}
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
