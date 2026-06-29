"use client";

import type { ReactNode } from "react";

import type { MultimeterJackId } from "./DigitalMultimeterProbeJacks";
import {
  multimeterDialStops,
  type MultimeterDialStopId,
} from "./DigitalMultimeterRotaryDial";
import type {
  MultimeterModeDefinition,
  MultimeterModeValidation,
} from "./multimeterModes";
import type { DigitalMultimeterCanvasSizeMode } from "./DigitalMultimeterCanvas";

const OMEGA = "\u03a9";

const dialStopGroups = [
  {
    title: "DCV",
    colorClass: "text-orange-500",
    stopIds: ["dcv_1000", "dcv_200", "dcv_20", "dcv_2000m", "dcv_200m"] as const,
  },
  {
    title: "ACV",
    colorClass: "text-sky-500",
    stopIds: ["acv_750", "acv_200"] as const,
  },
  {
    title: "DCA",
    colorClass: "text-violet-500",
    stopIds: ["dca_200u", "dca_2000u", "dca_20m", "dca_200m", "dca_10a"] as const,
  },
  {
    title: "Ohm",
    colorClass: "text-amber-500",
    stopIds: ["ohm_2000k", "ohm_200k", "ohm_20k", "ohm_2000", "ohm_200"] as const,
  },
];

const specialDialStops = ["off", "diode"] as const;

type DigitalMultimeterTrainerControlsProps = {
  blackLeadJack: MultimeterJackId;
  canvas: ReactNode;
  moveDial: (direction: "next" | "prev") => void;
  onSetDialStop: (id: MultimeterDialStopId) => void;
  onSetLeadJack: (lead: "red" | "black", jackId: MultimeterJackId) => void;
  onSetViewMode: (mode: DigitalMultimeterCanvasSizeMode) => void;
  redLeadJack: MultimeterJackId;
  resetToSafeDefault: () => void;
  selectedDialStopId: MultimeterDialStopId;
  selectedMode: MultimeterModeDefinition;
  validation: MultimeterModeValidation;
  viewMode: DigitalMultimeterCanvasSizeMode;
};

function getDialStopButtonClasses(id: MultimeterDialStopId, active: boolean) {
  if (!active) {
    return "border-slate-200 bg-white text-slate-700 hover:border-slate-300";
  }

  if (id === "off") {
    return "border-rose-300 bg-rose-50 text-rose-900";
  }

  if (id.startsWith("dcv_")) {
    return "border-orange-300 bg-orange-50 text-orange-900";
  }

  if (id.startsWith("acv_")) {
    return "border-sky-300 bg-sky-50 text-sky-900";
  }

  if (id.startsWith("dca_10")) {
    return "border-pink-300 bg-pink-50 text-pink-900";
  }

  if (id.startsWith("dca_")) {
    return "border-violet-300 bg-violet-50 text-violet-900";
  }

  if (id.startsWith("ohm_")) {
    return "border-amber-300 bg-amber-50 text-amber-900";
  }

  if (id === "diode") {
    return "border-emerald-300 bg-emerald-50 text-emerald-900";
  }

  return "border-emerald-300 bg-emerald-50 text-emerald-900";
}

function getGuidedTaskContent({
  blackLeadJack,
  redLeadJack,
  selectedMode,
  validation,
}: {
  blackLeadJack: MultimeterJackId;
  redLeadJack: MultimeterJackId;
  selectedMode: MultimeterModeDefinition;
  validation: MultimeterModeValidation;
}) {
  const checklist = [
    blackLeadJack === selectedMode.requiredBlackJack
      ? `Black lead is already in ${selectedMode.requiredBlackJack.replace("jack_", "").toUpperCase()}.`
      : `Move the black lead to ${selectedMode.requiredBlackJack.replace("jack_", "").toUpperCase()}.`,
    redLeadJack === selectedMode.requiredRedJack
      ? `Red lead is already in ${selectedMode.requiredRedJack.replace("jack_", "").replace("voma", `V${OMEGA}mA`).toUpperCase()}.`
      : `Move the red lead to ${selectedMode.requiredRedJack.replace("jack_", "").replace("voma", `V${OMEGA}mA`).toUpperCase()}.`,
    selectedMode.leadPlacementHint,
  ];

  return {
    badgeClass: validation.isSetupCorrect
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700",
    badgeText: validation.isSetupCorrect ? "Ready to Measure" : "Needs Correction",
    checklist,
    title: validation.isSetupCorrect
      ? `Now practice the ${selectedMode.label} setup`
      : `Fix the ${selectedMode.label} setup`,
  };
}

function JackButton({
  active,
  description,
  label,
  onClick,
}: {
  active: boolean;
  description: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-sky-300 bg-sky-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <p className="text-[13px] font-bold tracking-tight text-slate-900">
        {label}
      </p>
      <p className="mt-1 text-[11px] leading-5 text-slate-600">{description}</p>
    </button>
  );
}

function DialStopButton({
  active,
  id,
  label,
  onClick,
}: {
  active: boolean;
  id: MultimeterDialStopId;
  label: string;
  onClick: (id: MultimeterDialStopId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`rounded-xl border px-3 py-2 text-left text-[11px] font-semibold leading-4 transition ${getDialStopButtonClasses(
        id,
        active,
      )}`}
    >
      {label}
    </button>
  );
}

export default function DigitalMultimeterTrainerControls({
  blackLeadJack,
  canvas,
  moveDial,
  onSetDialStop,
  onSetLeadJack,
  onSetViewMode,
  redLeadJack,
  resetToSafeDefault,
  selectedDialStopId,
  selectedMode,
  validation,
  viewMode,
}: DigitalMultimeterTrainerControlsProps) {
  const groupedStops = dialStopGroups.map((group) => ({
    ...group,
    stops: group.stopIds
      .map((stopId) => multimeterDialStops.find((stop) => stop.id === stopId))
      .filter((stop) => stop !== undefined),
  }));

  const standaloneStops = specialDialStops
    .map((stopId) => multimeterDialStops.find((stop) => stop.id === stopId))
    .filter((stop) => stop !== undefined);
  const guidedTask = getGuidedTaskContent({
    blackLeadJack,
    redLeadJack,
    selectedMode,
    validation,
  });

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Traced Simulator
          </div>
          <h2 className="mt-3 text-[2rem] font-black tracking-[-0.03em] text-slate-950 md:text-[2.2rem]">
            Digital Multimeter Trainer
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600 md:text-base">
            Use the dial and jack controls below to practice the correct setup
            for voltage, current, resistance, and diode-style checks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-[22px] bg-slate-100 p-1 shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)]">
            <button
                type="button"
                onClick={() => onSetViewMode("fit")}
                className={`rounded-[18px] px-5 py-3 text-[13px] font-bold tracking-tight transition ${
                  viewMode === "fit"
                    ? "bg-emerald-100 text-emerald-950 shadow-sm"
                    : "bg-transparent text-slate-700 hover:text-slate-900"
              }`}
            >
              Fit
            </button>
            <button
                type="button"
                onClick={() => onSetViewMode("actual")}
                className={`rounded-[18px] px-5 py-3 text-[13px] font-bold tracking-tight transition ${
                  viewMode === "actual"
                    ? "bg-slate-200 text-slate-950 shadow-sm"
                    : "bg-transparent text-slate-700 hover:text-slate-900"
              }`}
            >
              Actual
            </button>
          </div>
            <button
              type="button"
              onClick={() => moveDial("prev")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold tracking-tight text-slate-700 hover:border-slate-300"
            >
              Prev Stop
            </button>
            <button
              type="button"
              onClick={() => moveDial("next")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold tracking-tight text-slate-700 hover:border-slate-300"
            >
              Next Stop
            </button>
            <button
              type="button"
              onClick={resetToSafeDefault}
              className="rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-[13px] font-semibold tracking-tight text-white hover:bg-slate-800"
            >
              Reset
            </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_320px] xl:items-start">
        <div className="space-y-4 xl:sticky xl:top-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <h3 className="text-[1.05rem] font-black tracking-tight text-slate-950">
              Dial Stops
            </h3>
            <div className="mt-4 space-y-4">
              {groupedStops.map((group) => (
                <div key={group.title}>
                  <p
                    className={`mb-2 text-[10px] font-black uppercase tracking-[0.22em] ${group.colorClass}`}
                  >
                    {group.title}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.stops.map((stop) => (
                      <DialStopButton
                        key={stop.id}
                        id={stop.id}
                        label={stop.label}
                        active={stop.id === selectedDialStopId}
                        onClick={onSetDialStop}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Special
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {standaloneStops.map((stop) => (
                    <DialStopButton
                      key={stop.id}
                      id={stop.id}
                      label={stop.label}
                      active={stop.id === selectedDialStopId}
                      onClick={onSetDialStop}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {canvas}

        <div className="space-y-4 xl:sticky xl:top-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <h3 className="text-[1.05rem] font-black tracking-tight text-rose-600">
              Red Lead Jack
            </h3>
            <div className="mt-4 grid gap-3">
              <JackButton
                active={redLeadJack === "jack_voma"}
                label={`V${OMEGA}mA`}
                description="Default jack for voltage, resistance, diode, and smaller current ranges."
                onClick={() => onSetLeadJack("red", "jack_voma")}
              />
              <JackButton
                active={redLeadJack === "jack_10a"}
                label="10A"
                description="Used only for the high-current 10A range."
                onClick={() => onSetLeadJack("red", "jack_10a")}
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <h3 className="text-[1.05rem] font-black tracking-tight text-slate-950">
              Black Lead Jack
            </h3>
            <div className="mt-4 grid gap-3">
              <JackButton
                active={blackLeadJack === "jack_com"}
                label="COM"
                description="The normal home for the black lead."
                onClick={() => onSetLeadJack("black", "jack_com")}
              />
              <JackButton
                active={blackLeadJack === "jack_voma"}
                label={`V${OMEGA}mA`}
                description="Incorrect for most setups, shown here for training and warnings."
                onClick={() => onSetLeadJack("black", "jack_voma")}
              />
              <JackButton
                active={blackLeadJack === "jack_10a"}
                label="10A"
                description="Incorrect for most setups, shown here so the trainer can teach mistakes."
                onClick={() => onSetLeadJack("black", "jack_10a")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Active Mode
          </div>
          <h3 className="mt-3 text-[1.8rem] font-black tracking-[-0.02em] text-slate-950 md:text-[2rem]">
            {selectedMode.label}
          </h3>
          <p className="mt-2 text-[15px] leading-7 text-slate-600 md:text-base">
            {selectedMode.description}
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${guidedTask.badgeClass}`}
          >
            {guidedTask.badgeText}
          </div>
          <h4 className="mt-3 text-[1.05rem] font-black tracking-tight text-slate-950">
            Guided Task
          </h4>
          <p className="mt-2 text-[15px] leading-7 text-slate-700">
            {guidedTask.title}
          </p>
          <div className="mt-3 space-y-2">
            {guidedTask.checklist.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[13px] leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-2xl border px-4 py-4 ${
            validation.isSetupCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <p className="text-[13px] font-black uppercase tracking-[0.14em]">
            Setup feedback
          </p>
          <p className="mt-2 text-[15px] leading-7">{validation.message}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
              Range
            </p>
            <p className="mt-2 text-[1.1rem] font-bold tracking-tight text-slate-900">
              {selectedMode.rangeLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
              Lead Hint
            </p>
            <p className="mt-2 text-[15px] leading-7 text-slate-700">
              {selectedMode.leadPlacementHint}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
