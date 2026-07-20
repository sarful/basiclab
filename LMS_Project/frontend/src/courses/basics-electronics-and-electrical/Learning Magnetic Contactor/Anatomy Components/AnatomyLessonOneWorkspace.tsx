"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import Armature from "./Armature";
import AuxiliaryContacts from "./AuxiliaryContacts";
import CoilAssembly from "./CoilAssembly";
import IronCore from "./IronCore";
import LabelOverlay, { type OverlayLabel } from "./LabelOverlay";
import MagneticContactor from "./MagneticContactor";
import MainContacts from "./MainContacts";
import ReturnSpring from "./ReturnSpring";
import TerminalBlock from "./TerminalBlock";

type FocusPart =
  | "overview"
  | "coil"
  | "core"
  | "armature"
  | "spring"
  | "main-contacts"
  | "auxiliary"
  | "terminals";

type StatefulPart =
  | "coil"
  | "core"
  | "armature"
  | "spring"
  | "main-contacts"
  | "auxiliary";

type PartConfig = {
  id: FocusPart;
  stepLabel: string;
  title: string;
  summary: string;
  detail: string;
  learningGoal: string;
  inspectPrompt: string;
  stateHint: string;
  accent: string;
};

const partConfigs: PartConfig[] = [
  {
    id: "overview",
    stepLabel: "Intro",
    title: "Full Anatomy View",
    summary: "Shows the complete CJX2 contactor body and its external terminal layout.",
    detail: "Use this as the overall reference, then inspect the internal motion and electrical switching blocks below.",
    learningGoal: "Recognize the full shape of the magnetic contactor before studying each internal or functional part.",
    inspectPrompt: "Look at the top line terminals, the center operating body, and the bottom load terminals as three major visual zones.",
    stateHint: "This overview is your map for all the focused parts below.",
    accent: "sky",
  },
  {
    id: "coil",
    stepLabel: "Step 1",
    title: "Coil Assembly",
    summary: "The A1-A2 coil creates the electromagnetic field when energized.",
    detail: "When the coil is powered, it magnetizes the iron core and starts the contactor action.",
    learningGoal: "Understand that the coil is the electrical input that starts the entire contactor action.",
    inspectPrompt: "Turn the coil on and compare the other moving parts. Everything begins with the coil energizing the core.",
    stateHint: "Coil ON means the mechanism is being commanded to pull in.",
    accent: "amber",
  },
  {
    id: "core",
    stepLabel: "Step 2",
    title: "Iron Core",
    summary: "The laminated iron core concentrates the magnetic flux.",
    detail: "This reduces loss and gives the armature a strong path to pull toward when the coil is on.",
    learningGoal: "See how the iron core gives the magnetic field a controlled path and strengthens the pull force.",
    inspectPrompt: "Watch the core after energizing. It does not move, but it becomes the fixed magnetic anchor for the armature.",
    stateHint: "The core is the magnetic path, not the moving element.",
    accent: "slate",
  },
  {
    id: "armature",
    stepLabel: "Step 3",
    title: "Armature",
    summary: "The moving armature is the mechanical link between magnetism and contact motion.",
    detail: "It is released by the spring when de-energized and pulled inward when the coil is active.",
    learningGoal: "Identify the armature as the moving mechanical bridge between magnetic force and switching force.",
    inspectPrompt: "Toggle the coil and notice how the armature state changes from released to pulled in.",
    stateHint: "If the armature does not move, the contacts cannot change state correctly.",
    accent: "blue",
  },
  {
    id: "spring",
    stepLabel: "Step 4",
    title: "Return Spring",
    summary: "The return spring resets the mechanism back to its normal state.",
    detail: "Without coil power, the spring opens the main contacts and restores the normal NC/NO positions.",
    learningGoal: "Understand how the spring restores the contactor to its safe, de-energized condition.",
    inspectPrompt: "Turn the coil off and think of the spring as the reset force that pushes the system back home.",
    stateHint: "Spring force defines the normal state when there is no electrical command.",
    accent: "orange",
  },
  {
    id: "main-contacts",
    stepLabel: "Step 5",
    title: "Main Contacts",
    summary: "These contacts switch the three-phase line side to the load side.",
    detail: "When the armature moves in, the bridges close L1/L2/L3 to T1/T2/T3.",
    learningGoal: "Connect the armature movement to the actual switching of power from line to load.",
    inspectPrompt: "Follow L1 to T1, L2 to T2, and L3 to T3. These are the heavy-current switching paths.",
    stateHint: "Open means no load connection. Closed means the three poles are carrying power.",
    accent: "emerald",
  },
  {
    id: "auxiliary",
    stepLabel: "Step 6",
    title: "Auxiliary Contacts",
    summary: "The NO and NC auxiliaries are used for interlocking, holding, and signaling.",
    detail: "NO closes on energization, while NC opens on energization.",
    learningGoal: "Learn how the small auxiliary contacts mirror the main mechanism for control-circuit logic.",
    inspectPrompt: "Compare the NO and NC sides while toggling the coil. They change opposite to each other.",
    stateHint: "NO helps with holding circuits. NC helps with stop and interlock logic.",
    accent: "violet",
  },
  {
    id: "terminals",
    stepLabel: "Step 7",
    title: "Terminal Blocks",
    summary: "Top terminals take line input and bottom terminals send output to the load.",
    detail: "The external numbering helps wiring, testing, and troubleshooting.",
    learningGoal: "Recognize the wiring points and numbering system used during installation and troubleshooting.",
    inspectPrompt: "Use the terminal buttons to identify where input power enters and where output leaves the contactor.",
    stateHint: "Top is line side. Bottom is load side.",
    accent: "cyan",
  },
];

const hotspotLabels: OverlayLabel[] = [
  {
    id: "coil",
    title: "Coil",
    description: "Electrical input creates the magnetic pull.",
    targetX: 220,
    targetY: 345,
    labelX: 80,
    labelY: 285,
    position: "left",
    color: "#f59e0b",
  },
  {
    id: "core",
    title: "Iron Core",
    description: "Fixed magnetic path for the flux.",
    targetX: 282,
    targetY: 345,
    labelX: 96,
    labelY: 380,
    position: "left",
    color: "#64748b",
  },
  {
    id: "armature",
    title: "Armature",
    description: "Moves when the core pulls it in.",
    targetX: 355,
    targetY: 330,
    labelX: 535,
    labelY: 295,
    position: "right",
    color: "#2563eb",
  },
  {
    id: "spring",
    title: "Spring",
    description: "Returns the mechanism to normal.",
    targetX: 430,
    targetY: 346,
    labelX: 526,
    labelY: 368,
    position: "right",
    color: "#f97316",
  },
  {
    id: "main-contacts",
    title: "Main Contacts",
    description: "Three power poles switch line to load.",
    targetX: 315,
    targetY: 446,
    labelX: 525,
    labelY: 458,
    position: "right",
    color: "#10b981",
  },
  {
    id: "auxiliary",
    title: "Auxiliary",
    description: "Small NO/NC control contacts.",
    targetX: 520,
    targetY: 330,
    labelX: 520,
    labelY: 220,
    position: "top",
    color: "#8b5cf6",
  },
  {
    id: "terminals",
    title: "Terminals",
    description: "Line side on top, load side on bottom.",
    targetX: 308,
    targetY: 118,
    labelX: 310,
    labelY: 42,
    position: "top",
    color: "#06b6d4",
  },
];

const learningSequence: FocusPart[] = [
  "coil",
  "core",
  "armature",
  "spring",
  "main-contacts",
  "auxiliary",
  "terminals",
];

const specificationRows = [
  {
    label: "Contactor Type",
    value: "3-pole magnetic contactor",
    note: "Used for switching three-phase motor or power loads.",
  },
  {
    label: "Line / Load Terminals",
    value: "L1-L2-L3 to T1-T2-T3",
    note: "Line enters at the top and exits toward the load at the bottom.",
  },
  {
    label: "Coil Terminals",
    value: "A1 / A2",
    note: "The control voltage is applied across these two points.",
  },
  {
    label: "Auxiliary Contacts",
    value: "13-14 NO, 21-22 NC",
    note: "Used for self-holding, interlocking, and status feedback in control circuits.",
  },
  {
    label: "Duty Category",
    value: "IEC AC-3 is common for motors",
    note: "AC-3 ratings are typically used for squirrel-cage motor starting and stopping.",
  },
  {
    label: "Coil Voltage",
    value: "Must match the control circuit",
    note: "Common examples include 24 VDC, 110 VAC, or 220-240 VAC depending on design.",
  },
  {
    label: "Current Rating",
    value: "Choose by load current and duty",
    note: "The contactor ampere rating must be selected from the nameplate and application category.",
  },
  {
    label: "Standards Reference",
    value: "IEC 60947 low-voltage controlgear family",
    note: "This is the common standards family used for contactors and motor starters.",
  },
];

const selectionChecks = [
  "Match the coil voltage to the actual control supply.",
  "Choose the AC-3 or application duty rating, not only the physical size.",
  "Confirm the current rating is suitable for the motor or load.",
  "Check how many auxiliary NO and NC contacts are required by the control circuit.",
  "Verify terminal numbering before wiring line, load, and control conductors.",
];

function focusFromLabelId(id: string): FocusPart {
  if (id === "main-contacts") return "main-contacts";
  if (id === "auxiliary") return "auxiliary";
  if (id === "terminals") return "terminals";
  if (id === "coil") return "coil";
  if (id === "core") return "core";
  if (id === "armature") return "armature";
  if (id === "spring") return "spring";
  return "overview";
}

function isStatefulPart(part: FocusPart) {
  return part !== "overview" && part !== "terminals";
}

function nextTerminalId(current: string) {
  const order = ["L1", "L2", "L3", "T1", "T2", "T3"];
  const index = order.indexOf(current);
  return order[(index + 1) % order.length];
}

function DiagramInteractionOverlay({
  activePart,
  onPartClick,
}: {
  activePart: FocusPart;
  onPartClick: (part: FocusPart) => void;
}) {
  const interactiveZones: Array<{
    part: FocusPart;
    shape: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
  }> = [
    { part: "terminals", shape: "rect", x: 138, y: 24, width: 336, height: 138 },
    { part: "coil", shape: "rect", x: 132, y: 312, width: 104, height: 84 },
    { part: "core", shape: "rect", x: 238, y: 306, width: 58, height: 98 },
    { part: "armature", shape: "rect", x: 296, y: 318, width: 72, height: 86 },
    { part: "spring", shape: "rect", x: 372, y: 320, width: 98, height: 76 },
    { part: "auxiliary", shape: "rect", x: 494, y: 104, width: 72, height: 480 },
    { part: "main-contacts", shape: "rect", x: 138, y: 532, width: 324, height: 96 },
  ];

  return (
    <svg
      viewBox="0 0 620 720"
      className="absolute inset-0 h-full w-full"
      aria-label="Interactive magnetic contactor zones"
    >
      {interactiveZones.map((zone) => {
        const selected = activePart === zone.part;

        return (
          <rect
            key={`${zone.part}-${zone.x}`}
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            rx="18"
            fill={selected ? "rgba(14,165,233,0.08)" : "transparent"}
            stroke={selected ? "rgba(14,165,233,0.45)" : "transparent"}
            strokeWidth="3"
            className="cursor-pointer transition"
            onClick={() => onPartClick(zone.part)}
          />
        );
      })}
    </svg>
  );
}

function PartHighlightOverlay({
  activePart,
}: {
  activePart: FocusPart;
}) {
  if (activePart === "overview") {
    return (
      <svg
        viewBox="0 0 620 720"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect
          x="112"
          y="72"
          width="430"
          height="570"
          rx="28"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="6"
          strokeDasharray="12 10"
          opacity="0.7"
        />
      </svg>
    );
  }

  const highlightMap: Record<Exclude<FocusPart, "overview">, ReactElement> = {
    coil: (
      <>
        <rect x="132" y="312" width="190" height="84" rx="18" fill="#f59e0b" opacity="0.18" />
        <rect x="132" y="312" width="190" height="84" rx="18" fill="none" stroke="#f59e0b" strokeWidth="5" />
      </>
    ),
    core: (
      <>
        <rect x="238" y="306" width="58" height="98" rx="10" fill="#64748b" opacity="0.2" />
        <rect x="238" y="306" width="58" height="98" rx="10" fill="none" stroke="#64748b" strokeWidth="5" />
      </>
    ),
    armature: (
      <>
        <rect x="296" y="318" width="72" height="86" rx="12" fill="#2563eb" opacity="0.16" />
        <rect x="296" y="318" width="72" height="86" rx="12" fill="none" stroke="#2563eb" strokeWidth="5" />
      </>
    ),
    spring: (
      <>
        <rect x="372" y="320" width="98" height="76" rx="18" fill="#f97316" opacity="0.16" />
        <rect x="372" y="320" width="98" height="76" rx="18" fill="none" stroke="#f97316" strokeWidth="5" />
      </>
    ),
    "main-contacts": (
      <>
        <rect x="138" y="532" width="324" height="96" rx="24" fill="#10b981" opacity="0.14" />
        <rect x="138" y="532" width="324" height="96" rx="24" fill="none" stroke="#10b981" strokeWidth="5" />
      </>
    ),
    auxiliary: (
      <>
        <rect x="494" y="104" width="72" height="480" rx="22" fill="#8b5cf6" opacity="0.14" />
        <rect x="494" y="104" width="72" height="480" rx="22" fill="none" stroke="#8b5cf6" strokeWidth="5" />
      </>
    ),
    terminals: (
      <>
        <rect x="138" y="24" width="336" height="138" rx="26" fill="#06b6d4" opacity="0.12" />
        <rect x="138" y="540" width="336" height="108" rx="26" fill="#06b6d4" opacity="0.12" />
        <rect x="138" y="24" width="336" height="138" rx="26" fill="none" stroke="#06b6d4" strokeWidth="5" />
        <rect x="138" y="540" width="336" height="108" rx="26" fill="none" stroke="#06b6d4" strokeWidth="5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 620 720"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {highlightMap[activePart]}
    </svg>
  );
}

function getAccentClasses(accent: string, active: boolean) {
  const map: Record<string, { badge: string; button: string; ring: string }> = {
    sky: {
      badge: "bg-sky-100 text-sky-800",
      button: active ? "border-sky-400 bg-sky-50 text-sky-900" : "border-slate-200 bg-white text-slate-700",
      ring: active ? "border-sky-300 shadow-sky-100" : "border-slate-200",
    },
    amber: {
      badge: "bg-amber-100 text-amber-800",
      button: active ? "border-amber-400 bg-amber-50 text-amber-900" : "border-slate-200 bg-white text-slate-700",
      ring: active ? "border-amber-300 shadow-amber-100" : "border-slate-200",
    },
    slate: {
      badge: "bg-slate-200 text-slate-800",
      button: active ? "border-slate-400 bg-slate-100 text-slate-900" : "border-slate-200 bg-white text-slate-700",
      ring: active ? "border-slate-300 shadow-slate-100" : "border-slate-200",
    },
    blue: {
      badge: "bg-blue-100 text-blue-800",
      button: active ? "border-blue-400 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700",
      ring: active ? "border-blue-300 shadow-blue-100" : "border-slate-200",
    },
    orange: {
      badge: "bg-orange-100 text-orange-800",
      button: active ? "border-orange-400 bg-orange-50 text-orange-900" : "border-slate-200 bg-white text-slate-700",
      ring: active ? "border-orange-300 shadow-orange-100" : "border-slate-200",
    },
    emerald: {
      badge: "bg-emerald-100 text-emerald-800",
      button: active ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-white text-slate-700",
      ring: active ? "border-emerald-300 shadow-emerald-100" : "border-slate-200",
    },
    violet: {
      badge: "bg-violet-100 text-violet-800",
      button: active ? "border-violet-400 bg-violet-50 text-violet-900" : "border-slate-200 bg-white text-slate-700",
      ring: active ? "border-violet-300 shadow-violet-100" : "border-slate-200",
    },
    cyan: {
      badge: "bg-cyan-100 text-cyan-800",
      button: active ? "border-cyan-400 bg-cyan-50 text-cyan-900" : "border-slate-200 bg-white text-slate-700",
      ring: active ? "border-cyan-300 shadow-cyan-100" : "border-slate-200",
    },
  };

  return map[accent] ?? map.sky;
}

function ToggleRow({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <div className="text-sm font-black text-slate-900">{label}</div>
        <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div>
      </div>
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 h-7 w-12 rounded-full transition ${
          checked ? "bg-sky-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

export default function AnatomyLessonOneWorkspace() {
  const [partStates, setPartStates] = useState<Record<StatefulPart, boolean>>({
    coil: false,
    core: false,
    armature: false,
    spring: false,
    "main-contacts": false,
    auxiliary: false,
  });
  const [showLabels, setShowLabels] = useState(true);
  const [focusPart, setFocusPart] = useState<FocusPart>("overview");
  const [activeTerminalId, setActiveTerminalId] = useState("L1");
  const [learningMode, setLearningMode] = useState(true);

  const learningIndex = learningSequence.indexOf(focusPart);
  const currentLearningIndex = learningIndex >= 0 ? learningIndex : 0;
  const learningProgress = `${currentLearningIndex + 1} / ${learningSequence.length}`;
  const linkedDemoOn = Object.values(partStates).every(Boolean);

  const handleReset = () => {
    setPartStates({
      coil: false,
      core: false,
      armature: false,
      spring: false,
      "main-contacts": false,
      auxiliary: false,
    });
    setShowLabels(true);
    setFocusPart("overview");
    setActiveTerminalId("L1");
    setLearningMode(true);
  };

  const setFocusedPart = (part: FocusPart) => {
    setFocusPart(part);
    if (part === "terminals") {
      if (!["L1", "L2", "L3", "T1", "T2", "T3"].includes(activeTerminalId)) {
        setActiveTerminalId("L1");
      }
    }
  };

  const handleInteractivePartClick = (part: FocusPart) => {
    setFocusedPart(part);

    if (part === "terminals") {
      setActiveTerminalId((current) => nextTerminalId(current));
      return;
    }

    if (isStatefulPart(part)) {
      setPartStates((current) => ({
        ...current,
        [part]: !current[part],
      }));
    }
  };

  const toggleLinkedDemoState = () => {
    const nextValue = !linkedDemoOn;
    setPartStates({
      coil: nextValue,
      core: nextValue,
      armature: nextValue,
      spring: nextValue,
      "main-contacts": nextValue,
      auxiliary: nextValue,
    });
  };

  const goToLearningStep = (direction: -1 | 1) => {
    const baseIndex = learningIndex >= 0 ? learningIndex : 0;
    const nextIndex = Math.max(0, Math.min(learningSequence.length - 1, baseIndex + direction));
    setLearningMode(true);
    setFocusedPart(learningSequence[nextIndex]);
  };

  return (
    <div className="grid gap-5 2xl:grid-cols-[330px_minmax(0,1fr)]">
      <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
                Control Panel
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Anatomy Explorer
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              Lesson 01
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <ToggleRow
              checked={linkedDemoOn}
              label="Linked Demo State"
              description=""
              onChange={toggleLinkedDemoState}
            />
            <ToggleRow
              checked={showLabels}
              label="Show Labels"
              description=""
              onChange={setShowLabels}
            />
            <ToggleRow
              checked={learningMode}
              label="Learning Mode"
              description=""
              onChange={setLearningMode}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Live State
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  Coil
                </div>
                <div className={`mt-2 text-sm font-black ${partStates.coil ? "text-emerald-700" : "text-amber-700"}`}>
                  {partStates.coil ? "Energized" : "De-energized"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  Main Contacts
                </div>
                <div className={`mt-2 text-sm font-black ${partStates["main-contacts"] ? "text-emerald-700" : "text-red-700"}`}>
                  {partStates["main-contacts"] ? "Closed" : "Open"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  NO Auxiliary
                </div>
                <div className={`mt-2 text-sm font-black ${partStates.auxiliary ? "text-emerald-700" : "text-amber-700"}`}>
                  {partStates.auxiliary ? "Closed" : "Open"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  NC Auxiliary
                </div>
                <div className={`mt-2 text-sm font-black ${partStates.auxiliary ? "text-red-700" : "text-emerald-700"}`}>
                  {partStates.auxiliary ? "Open" : "Closed"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Guided Learning
                </div>
                <div className="mt-1 text-sm font-black text-slate-900">
                  {learningMode ? "Step-by-step mode is active" : "Manual exploration mode"}
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
                {learningProgress}
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => goToLearningStep(-1)}
                disabled={currentLearningIndex === 0}
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800 transition disabled:cursor-not-allowed disabled:opacity-45"
              >
                Previous Part
              </button>
              <button
                type="button"
                onClick={() => goToLearningStep(1)}
                disabled={currentLearningIndex === learningSequence.length - 1}
                className="flex-1 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next Part
              </button>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={toggleLinkedDemoState}
              className="flex-1 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-800"
            >
              {linkedDemoOn ? "Turn All Parts Off" : "Turn All Parts On"}
            </button>
          </div>
        </section>
      </aside>

      <div className="space-y-5">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Full Component
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">
                    Magnetic Contactor External Anatomy
                  </h3>
                </div>
                <span className={`rounded-full px-4 py-2 text-xs font-black ${
                  linkedDemoOn ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {linkedDemoOn ? "All Parts ON" : "Independent Part Preview"}
                </span>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-inner">
                <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[22px] bg-white">
                  <MagneticContactor
                    containerClassName="flex w-full items-center justify-center bg-white p-4 sm:p-6"
                    className="h-auto w-full max-w-[620px]"
                  />
                  <DiagramInteractionOverlay
                    activePart={focusPart}
                    onPartClick={handleInteractivePartClick}
                  />
                  <PartHighlightOverlay activePart={focusPart} />
                  <LabelOverlay
                    labels={hotspotLabels}
                    activeLabelId={focusPart === "overview" ? null : focusPart}
                    showLabels={showLabels}
                    width={620}
                    height={720}
                    hideInactiveDescriptions
                    onLabelClick={(label) => handleInteractivePartClick(focusFromLabelId(label.id))}
                  />
                </div>
              </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          <article className={`rounded-[28px] border bg-white p-5 shadow-sm ${getAccentClasses("amber", focusPart === "coil").ring}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950">Coil Assembly</h3>
              <button
                type="button"
                onClick={() => handleInteractivePartClick("coil")}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700"
              >
                {focusPart === "coil" && partStates.coil ? "Turn Off" : "Focus / Toggle"}
              </button>
            </div>
            <CoilAssembly energized={partStates.coil} showLabels={showLabels} />
          </article>

          <article className={`rounded-[28px] border bg-white p-5 shadow-sm ${getAccentClasses("slate", focusPart === "core").ring}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950">Iron Core</h3>
              <button
                type="button"
                onClick={() => handleInteractivePartClick("core")}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700"
              >
                {focusPart === "core" && partStates.core ? "Turn Off" : "Focus / Toggle"}
              </button>
            </div>
            <IronCore energized={partStates.core} showLabels={showLabels} />
          </article>

          <article className={`rounded-[28px] border bg-white p-5 shadow-sm ${getAccentClasses("blue", focusPart === "armature").ring}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950">Armature</h3>
              <button
                type="button"
                onClick={() => handleInteractivePartClick("armature")}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700"
              >
                {focusPart === "armature" && partStates.armature ? "Turn Off" : "Focus / Toggle"}
              </button>
            </div>
            <Armature energized={partStates.armature} showLabels={showLabels} />
          </article>

          <article className={`rounded-[28px] border bg-white p-5 shadow-sm ${getAccentClasses("orange", focusPart === "spring").ring}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950">Return Spring</h3>
              <button
                type="button"
                onClick={() => handleInteractivePartClick("spring")}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700"
              >
                {focusPart === "spring" && partStates.spring ? "Turn Off" : "Focus / Toggle"}
              </button>
            </div>
            <ReturnSpring compressed={partStates.spring} showLabels={showLabels} />
          </article>

          <article className={`rounded-[28px] border bg-white p-5 shadow-sm lg:col-span-2 2xl:col-span-1 ${getAccentClasses("emerald", focusPart === "main-contacts").ring}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950">Main Power Contacts</h3>
              <button
                type="button"
                onClick={() => handleInteractivePartClick("main-contacts")}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700"
              >
                {focusPart === "main-contacts" && partStates["main-contacts"] ? "Turn Off" : "Focus / Toggle"}
              </button>
            </div>
            <MainContacts closed={partStates["main-contacts"]} showLabels={showLabels} />
          </article>

          <article className={`rounded-[28px] border bg-white p-5 shadow-sm lg:col-span-2 2xl:col-span-1 ${getAccentClasses("violet", focusPart === "auxiliary").ring}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950">Auxiliary Contacts</h3>
              <button
                type="button"
                onClick={() => handleInteractivePartClick("auxiliary")}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700"
              >
                {focusPart === "auxiliary" && partStates.auxiliary ? "Turn Off" : "Focus / Toggle"}
              </button>
            </div>
            <AuxiliaryContacts energized={partStates.auxiliary} showLabels={showLabels} showStatus />
          </article>
        </section>

        <section className={`rounded-[28px] border bg-white p-5 shadow-sm ${getAccentClasses("cyan", focusPart === "terminals").ring}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Connection Points
              </p>
              <h3 className="mt-1 text-2xl font-black text-slate-950">
                Top and Bottom Terminal Blocks
              </h3>
            </div>
            <button
              type="button"
              onClick={() => handleInteractivePartClick("terminals")}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700"
            >
              Focus / Next Terminal
            </button>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <TerminalBlock
                title="Line/Input Terminals"
                orientation="top"
                showLabels={showLabels}
                activeTerminalId={["L1", "L2", "L3"].includes(activeTerminalId) ? activeTerminalId : undefined}
              />
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <TerminalBlock
                title="Load/Output Terminals"
                orientation="bottom"
                showLabels={showLabels}
                activeTerminalId={["T1", "T2", "T3"].includes(activeTerminalId) ? activeTerminalId : undefined}
                terminals={[
                  { id: "T1", topLabel: "2", bottomLabel: "T1" },
                  { id: "T2", topLabel: "4", bottomLabel: "T2" },
                  { id: "T3", topLabel: "6", bottomLabel: "T3" },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
                Standards
              </p>
              <h3 className="mt-1 text-2xl font-black text-slate-950">
                Proper Magnetic Contactor Specifications
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700">
              Nameplate and selection basics
            </span>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="overflow-hidden rounded-[24px] border border-slate-200">
              <div className="grid grid-cols-1 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div>Specification Item</div>
                <div>Meaning</div>
              </div>

              <div className="divide-y divide-slate-200">
                {specificationRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[180px_minmax(0,1fr)]"
                  >
                    <div className="text-sm font-black text-slate-900">
                      {row.label}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {row.value}
                      </div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">
                        {row.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <article className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
                <h4 className="text-lg font-black text-slate-950">
                  What Lesson 1 Covers
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This page teaches anatomy, terminal identification, auxiliary contact labels,
                  and the basic operating relationship between coil, armature, spring, and power contacts.
                </p>
              </article>

              <article className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)] p-5">
                <h4 className="text-lg font-black text-slate-950">
                  Specification Checklist
                </h4>
                <div className="mt-3 space-y-2">
                  {selectionChecks.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[24px] border border-sky-200 bg-sky-50 p-5">
                <h4 className="text-lg font-black text-slate-950">
                  Important Note
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Exact values like ampere rating, coil voltage, and AC-3 motor capacity depend on the actual model
                  nameplate. A label such as <span className="font-black">CJX2</span> identifies the product family,
                  but the full specification must be confirmed from the device marking or datasheet before wiring or selection.
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
