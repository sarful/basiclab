"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  DigitalMultimeterCanvas,
  type MultimeterJackId,
} from "../../01_what_is_a_multimeter/image_to_component_workspace";
import { multimeterGeometry } from "../../01_what_is_a_multimeter/image_to_component_workspace/multimeterGeometry";
import type { MultimeterDialStopId } from "../../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import type {
  MeasuringCurrentProbeTargetId,
  MeasuringCurrentScenario,
} from "../measuringCurrentScenarios";

const WIRE_BLACK = "#111111";
const WIRE_RED = "#e5252a";
const WIRE_RED_DARK = "#9f151b";
const WIRE_WHITE = "#ffffff";

const METER_BOX = {
  x: 0.04,
  y: 0.09,
  width: 0.34,
  height: 0.82,
} as const;

const SOURCE_BOX = {
  x: 0.56,
  y: 0.21,
  width: 0.16,
  height: 0.18,
} as const;

const LOAD_BOX = {
  x: 0.79,
  y: 0.43,
  width: 0.12,
  height: 0.19,
} as const;

const GAP_TARGETS: Record<MeasuringCurrentProbeTargetId, { x: number; y: number }> = {
  gap_left: { x: 0.703, y: 0.3 },
  gap_right: { x: 0.752, y: 0.3 },
};

const PROBE_OPEN_POINTS = {
  red: { x: 0.63, y: 0.19 },
  black: { x: 0.58, y: 0.19 },
} as const;

const JACK_POINTS = {
  jack_10a: {
    x:
      METER_BOX.x +
      METER_BOX.width *
        (multimeterGeometry.probeJacks.tenAmp.cx / multimeterGeometry.canvas.width),
    y:
      METER_BOX.y +
      METER_BOX.height *
        (multimeterGeometry.probeJacks.tenAmp.cy / multimeterGeometry.canvas.height),
  },
  jack_voma: {
    x:
      METER_BOX.x +
      METER_BOX.width *
        (multimeterGeometry.probeJacks.vmA.cx / multimeterGeometry.canvas.width),
    y:
      METER_BOX.y +
      METER_BOX.height *
        (multimeterGeometry.probeJacks.vmA.cy / multimeterGeometry.canvas.height),
  },
  jack_com: {
    x:
      METER_BOX.x +
      METER_BOX.width *
        (multimeterGeometry.probeJacks.com.cx / multimeterGeometry.canvas.width),
    y:
      METER_BOX.y +
      METER_BOX.height *
        (multimeterGeometry.probeJacks.com.cy / multimeterGeometry.canvas.height),
  },
} as const satisfies Record<MultimeterJackId, { x: number; y: number }>;

function ProbePill({
  active,
  label,
  tone,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  tone: "black" | "red";
}) {
  const inactiveClass =
    tone === "red"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-slate-300 bg-slate-100 text-slate-700";
  const activeClass =
    tone === "red"
      ? "border-rose-500 bg-rose-500 text-white"
      : "border-slate-900 bg-slate-900 text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] transition ${active ? activeClass : inactiveClass}`}
    >
      {label}
    </button>
  );
}

function LeadProbe({
  color,
  dragging,
}: {
  color: "red" | "black";
  dragging: boolean;
}) {
  const fill = color === "red" ? WIRE_RED : "#232323";
  const stroke = color === "red" ? WIRE_RED_DARK : WIRE_BLACK;

  return (
    <svg
      viewBox="0 0 36 72"
      className={`h-14 w-8 drop-shadow-[0_8px_10px_rgba(15,23,42,0.2)] ${dragging ? "scale-105" : ""}`}
      aria-hidden="true"
    >
      <rect x="9" y="4" width="18" height="44" rx="6" fill={fill} stroke={stroke} strokeWidth="3" />
      <rect x="3" y="42" width="30" height="10" rx="5" fill={fill} stroke={stroke} strokeWidth="3" />
      <path d="M8 53 H28 L23 66 H13 Z" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      <path d="M18 66 V71" stroke={WIRE_BLACK} strokeWidth="4" strokeLinecap="round" />
      <g stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <line x1="11" y1="14" x2="25" y2="14" />
        <line x1="11" y1="24" x2="25" y2="24" />
        <line x1="11" y1="34" x2="25" y2="34" />
      </g>
    </svg>
  );
}

function SourceBlock({ scenario }: { scenario: MeasuringCurrentScenario }) {
  return (
    <div className="flex h-full flex-col justify-center rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
        Source
      </p>
      <p className="mt-2 text-[12px] font-bold text-emerald-950">
        {scenario.sourceLabel}
      </p>
      <p className="mt-1 text-[11px] font-semibold text-emerald-700">
        {scenario.sourceType === "dc_battery" ? "DC battery" : "DC supply"}
      </p>
    </div>
  );
}

function LoadBlock({ scenario }: { scenario: MeasuringCurrentScenario }) {
  return (
    <div className="flex h-full flex-col justify-center rounded-[24px] border border-sky-200 bg-sky-50 px-4 py-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-700">
        Load
      </p>
      <p className="mt-2 text-[12px] font-bold text-sky-950">{scenario.loadLabel}</p>
      <p className="mt-1 text-[11px] font-semibold text-sky-700">Current path</p>
    </div>
  );
}

function CurrentIntegratedScene({
  blackLeadJack,
  blackProbeTarget,
  displayValue,
  redLeadJack,
  redProbeTarget,
  scenario,
  selectedDialStopId,
  setProbeTarget,
}: {
  blackLeadJack: MultimeterJackId;
  blackProbeTarget: MeasuringCurrentProbeTargetId | null;
  displayValue: string;
  redLeadJack: MultimeterJackId;
  redProbeTarget: MeasuringCurrentProbeTargetId | null;
  scenario: MeasuringCurrentScenario;
  selectedDialStopId: MultimeterDialStopId;
  setProbeTarget: (
    probe: "red" | "black",
    target: MeasuringCurrentProbeTargetId,
  ) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragLead, setDragLead] = useState<"red" | "black" | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(
    null,
  );

  const snappedProbePositions = useMemo(
    () => ({
      red: redProbeTarget ? GAP_TARGETS[redProbeTarget] : PROBE_OPEN_POINTS.red,
      black: blackProbeTarget
        ? GAP_TARGETS[blackProbeTarget]
        : PROBE_OPEN_POINTS.black,
    }),
    [blackProbeTarget, redProbeTarget],
  );

  useEffect(() => {
    if (!dragLead) return;

    function updatePosition(clientX: number, clientY: number) {
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      setDragPosition({
        x: Math.max(0.04, Math.min(0.96, (clientX - rect.left) / rect.width)),
        y: Math.max(0.08, Math.min(0.92, (clientY - rect.top) / rect.height)),
      });
    }

    function handlePointerMove(event: PointerEvent) {
      updatePosition(event.clientX, event.clientY);
    }

    function handlePointerUp(event: PointerEvent) {
      const element = containerRef.current;
      const rect = element?.getBoundingClientRect();
      let bestTarget: MeasuringCurrentProbeTargetId | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      if (rect) {
        for (const targetId of Object.keys(GAP_TARGETS) as MeasuringCurrentProbeTargetId[]) {
          const point = GAP_TARGETS[targetId];
          const dx = event.clientX - (rect.left + point.x * rect.width);
          const dy = event.clientY - (rect.top + point.y * rect.height);
          const distance = Math.hypot(dx, dy);

          if (distance < bestDistance) {
            bestDistance = distance;
            bestTarget = targetId;
          }
        }
      }

      if (bestTarget && bestDistance <= 58) {
        setProbeTarget(dragLead, bestTarget);
      }

      setDragLead(null);
      setDragPosition(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragLead, setProbeTarget]);

  function startDrag(
    lead: "red" | "black",
    event: React.PointerEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setDragLead(lead);
    setDragPosition({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  }

  function getProbePoint(lead: "red" | "black") {
    if (dragLead === lead && dragPosition) return dragPosition;
    return snappedProbePositions[lead];
  }

  function buildLeadPath(lead: "red" | "black") {
    const start = lead === "red" ? JACK_POINTS[redLeadJack] : JACK_POINTS[blackLeadJack];
    const end = getProbePoint(lead);
    const controlOneX = start.x + (lead === "red" ? 0.1 : 0.08);
    const controlOneY = start.y + (lead === "red" ? 0.02 : 0.06);
    const controlTwoX = end.x - (lead === "red" ? 0.14 : 0.1);
    const controlTwoY = end.y + (lead === "red" ? 0.08 : 0.1);

    return `M ${start.x * 100} ${start.y * 100} C ${controlOneX * 100} ${controlOneY * 100}, ${controlTwoX * 100} ${controlTwoY * 100}, ${end.x * 100} ${end.y * 100}`;
  }

  function getProbeRotation(lead: "red" | "black") {
    if (dragLead === lead) return lead === "red" ? 30 : -30;
    const target = lead === "red" ? redProbeTarget : blackProbeTarget;
    if (lead === "red") return target === "gap_left" ? -8 : 16;
    return target === "gap_right" ? -34 : -10;
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[1200/620] w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white"
    >
      <div
        className="absolute"
        style={{
          left: `${METER_BOX.x * 100}%`,
          top: `${METER_BOX.y * 100}%`,
          width: `${METER_BOX.width * 100}%`,
          height: `${METER_BOX.height * 100}%`,
        }}
      >
        <DigitalMultimeterCanvas
          blackLeadJack={blackLeadJack}
          displayValue={displayValue}
          redLeadJack={redLeadJack}
          selectedStopId={selectedDialStopId}
          showLeadRoutes={false}
          sizeMode="actual"
          className="h-full max-w-none w-full"
        />
      </div>

      <div
        className="absolute"
        style={{
          left: `${SOURCE_BOX.x * 100}%`,
          top: `${SOURCE_BOX.y * 100}%`,
          width: `${SOURCE_BOX.width * 100}%`,
          height: `${SOURCE_BOX.height * 100}%`,
        }}
      >
        <SourceBlock scenario={scenario} />
      </div>

      <div
        className="absolute"
        style={{
          left: `${LOAD_BOX.x * 100}%`,
          top: `${LOAD_BOX.y * 100}%`,
          width: `${LOAD_BOX.width * 100}%`,
          height: `${LOAD_BOX.height * 100}%`,
        }}
      >
        <LoadBlock scenario={scenario} />
      </div>

      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M 72 30 H 70.3" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 75.2 30 H 79" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 87 30 H 90.5 V 52" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 90.5 52 V 70 H 66 V 39" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx={70.3} cy={30} r="1.6" fill={WIRE_WHITE} stroke="#1f2937" strokeWidth="0.5" />
        <circle cx={75.2} cy={30} r="1.6" fill={WIRE_WHITE} stroke="#1f2937" strokeWidth="0.5" />

        <path d={buildLeadPath("black")} fill="none" stroke="rgba(17,17,17,0.34)" strokeWidth="3.8" strokeLinecap="round" />
        <path d={buildLeadPath("black")} fill="none" stroke={WIRE_BLACK} strokeWidth="2.4" strokeLinecap="round" />
        <path d={buildLeadPath("red")} fill="none" stroke="rgba(229,37,42,0.34)" strokeWidth="3.8" strokeLinecap="round" />
        <path d={buildLeadPath("red")} fill="none" stroke={WIRE_RED} strokeWidth="2.4" strokeLinecap="round" />
      </svg>

      <div className="pointer-events-none absolute left-[67.4%] top-[20%] rounded-full border border-dashed border-emerald-300 bg-emerald-50/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
        Insert meter here
      </div>

      <div className="absolute left-[65.2%] top-[34.8%] flex -translate-x-1/2 gap-2">
        <ProbePill
          active={redProbeTarget === "gap_left"}
          label="RED"
          onClick={() => setProbeTarget("red", "gap_left")}
          tone="red"
        />
        <ProbePill
          active={blackProbeTarget === "gap_left"}
          label="BLACK"
          onClick={() => setProbeTarget("black", "gap_left")}
          tone="black"
        />
      </div>

      <div className="absolute left-[77.2%] top-[34.8%] flex -translate-x-1/2 gap-2">
        <ProbePill
          active={redProbeTarget === "gap_right"}
          label="RED"
          onClick={() => setProbeTarget("red", "gap_right")}
          tone="red"
        />
        <ProbePill
          active={blackProbeTarget === "gap_right"}
          label="BLACK"
          onClick={() => setProbeTarget("black", "gap_right")}
          tone="black"
        />
      </div>

      {(["black", "red"] as const).map((lead) => {
        const point = getProbePoint(lead);
        return (
          <button
            key={lead}
            type="button"
            onPointerDown={(event) => startDrag(lead, event)}
            className="absolute h-16 w-10 touch-none"
            style={{
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`,
              transform: `translate(-50%, -72%) rotate(${getProbeRotation(lead)}deg)`,
              transformOrigin: "50% 88%",
            }}
            aria-label={`Drag ${lead} current probe`}
          >
            <LeadProbe color={lead} dragging={dragLead === lead} />
          </button>
        );
      })}
    </div>
  );
}

function CurrentSeriesPathBoard({
  blackProbeTarget,
  clearProbeTargets,
  displayValue,
  redLeadJack,
  redProbeTarget,
  scenario,
  selectedDialStopId,
  setProbeTarget,
  blackLeadJack,
}: {
  blackLeadJack: MultimeterJackId;
  blackProbeTarget: MeasuringCurrentProbeTargetId | null;
  clearProbeTargets: () => void;
  displayValue: string;
  redLeadJack: MultimeterJackId;
  redProbeTarget: MeasuringCurrentProbeTargetId | null;
  scenario: MeasuringCurrentScenario;
  selectedDialStopId: MultimeterDialStopId;
  setProbeTarget: (
    probe: "red" | "black",
    target: MeasuringCurrentProbeTargetId,
  ) => void;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Series Path Board
          </p>
          <h4 className="mt-1 text-[1.05rem] font-black tracking-tight text-slate-950">
            {scenario.seriesPathTitle}
          </h4>
        </div>
        <button
          type="button"
          onClick={clearProbeTargets}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-700 transition hover:border-slate-300 hover:bg-white"
        >
          Clear Probes
        </button>
      </div>

      <div className="mt-5">
        <CurrentIntegratedScene
          blackLeadJack={blackLeadJack}
          blackProbeTarget={blackProbeTarget}
          displayValue={displayValue}
          redLeadJack={redLeadJack}
          redProbeTarget={redProbeTarget}
          scenario={scenario}
          selectedDialStopId={selectedDialStopId}
          setProbeTarget={setProbeTarget}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-100 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-[180px]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
              Left Gap Node
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Put the red probe on the source side of the open circuit.
            </p>
          </div>
          <div className="min-w-[180px] text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-700">
              Right Gap Node
            </p>
            <p className="mt-1 text-[12px] font-semibold text-slate-700">
              Put the black probe on the load side to complete the series path.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CurrentSeriesWorkbench({
  blackLeadJack,
  blackProbeTarget,
  clearProbeTargets,
  displayValue,
  redLeadJack,
  redProbeTarget,
  scenario,
  selectedDialStopId,
  setProbeTarget,
}: {
  blackLeadJack: MultimeterJackId;
  blackProbeTarget: MeasuringCurrentProbeTargetId | null;
  clearProbeTargets: () => void;
  displayValue: string;
  redLeadJack: MultimeterJackId;
  redProbeTarget: MeasuringCurrentProbeTargetId | null;
  scenario: MeasuringCurrentScenario;
  selectedDialStopId: MultimeterDialStopId;
  setProbeTarget: (
    probe: "red" | "black",
    target: MeasuringCurrentProbeTargetId,
  ) => void;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Visual Source
          </p>
          <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-slate-950">
            Current Practice Source
          </h3>
        </div>
        <div className="h-3 w-3 rounded-full bg-orange-500" />
      </div>

      <div className="mt-4">
        <CurrentSeriesPathBoard
          blackLeadJack={blackLeadJack}
          blackProbeTarget={blackProbeTarget}
          clearProbeTargets={clearProbeTargets}
          displayValue={displayValue}
          redLeadJack={redLeadJack}
          redProbeTarget={redProbeTarget}
          scenario={scenario}
          selectedDialStopId={selectedDialStopId}
          setProbeTarget={setProbeTarget}
        />
      </div>
    </div>
  );
}
