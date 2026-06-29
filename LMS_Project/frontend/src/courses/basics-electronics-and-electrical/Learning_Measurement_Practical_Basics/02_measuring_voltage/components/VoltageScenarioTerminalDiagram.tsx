"use client";

import {
  ACSocket220V,
  Battery9V,
  DCPowerSupply12V,
} from "@/src/library";
import type {
  MeasuringVoltageScenario,
  VoltageProbeTargetId,
} from "../measuringVoltageScenarios";

function getDiagramTone(sourceType: string) {
  switch (sourceType) {
    case "dc_battery":
      return {
        accent: "bg-emerald-500",
        board:
          "border-emerald-200 bg-[linear-gradient(180deg,#f2fbf6_0%,#ffffff_100%)]",
        line: "bg-emerald-400",
        title: "Battery Circuit",
      };
    case "dc_supply":
      return {
        accent: "bg-sky-500",
        board:
          "border-sky-200 bg-[linear-gradient(180deg,#f2f9ff_0%,#ffffff_100%)]",
        line: "bg-sky-400",
        title: "DC Supply Rails",
      };
    case "ac_source":
      return {
        accent: "bg-violet-500",
        board:
          "border-violet-200 bg-[linear-gradient(180deg,#f6f2ff_0%,#ffffff_100%)]",
        line: "bg-violet-400",
        title: "AC Terminals",
      };
    default:
      return {
        accent: "bg-amber-500",
        board:
          "border-amber-200 bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)]",
        line: "bg-amber-400",
        title: "Voltage Practice Board",
      };
  }
}

function getTerminalPosition(index: number, count: number) {
  if (count === 2) {
    return index === 0
      ? { left: "24%", top: "48%" }
      : { left: "76%", top: "48%" };
  }

  if (count === 3) {
    return [
      { left: "18%", top: "56%" },
      { left: "50%", top: "28%" },
      { left: "82%", top: "56%" },
    ][index];
  }

  const step = 60 / Math.max(1, count - 1);

  return {
    left: `${20 + index * step}%`,
    top: "48%",
  };
}

function getTerminalRoleStyles(role: MeasuringVoltageScenario["terminals"][number]["role"]) {
  switch (role) {
    case "positive":
      return {
        accent: "text-emerald-700",
        role: "text-emerald-600",
      };
    case "negative":
      return {
        accent: "text-rose-700",
        role: "text-rose-600",
      };
    default:
      return {
        accent: "text-sky-700",
        role: "text-sky-600",
      };
  }
}

function ScenarioSourcePreview({
  scenario,
}: {
  scenario: MeasuringVoltageScenario;
}) {
  switch (scenario.id) {
    case "battery_9v_dc":
      return (
        <div className="flex min-h-[210px] items-center justify-center">
          <Battery9V width={145} height={238} />
        </div>
      );
    case "dc_supply_12v":
      return (
        <div className="flex min-h-[210px] items-center justify-center">
          <DCPowerSupply12V width={290} />
        </div>
      );
    case "ac_outlet_220v":
      return (
        <div className="flex min-h-[210px] items-center justify-center">
          <ACSocket220V width={285} />
        </div>
      );
    default:
      return null;
  }
}

export default function VoltageScenarioTerminalDiagram({
  blackProbeTarget,
  redProbeTarget,
  scenario,
  setBlackProbeTarget,
  setRedProbeTarget,
}: {
  blackProbeTarget: VoltageProbeTargetId | null;
  redProbeTarget: VoltageProbeTargetId | null;
  scenario: MeasuringVoltageScenario;
  setBlackProbeTarget: (target: VoltageProbeTargetId) => void;
  setRedProbeTarget: (target: VoltageProbeTargetId) => void;
}) {
  const tone = getDiagramTone(scenario.sourceType);
  const redIndex = scenario.terminals.findIndex(
    (terminal) => terminal.id === redProbeTarget,
  );
  const blackIndex = scenario.terminals.findIndex(
    (terminal) => terminal.id === blackProbeTarget,
  );

  return (
    <div className={`rounded-[24px] border p-4 ${tone.board}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Visual Source
          </p>
          <h4 className="mt-2 text-[1.05rem] font-black tracking-tight text-slate-950">
            {tone.title}
          </h4>
        </div>
        <div className={`h-3 w-3 rounded-full ${tone.accent}`} />
      </div>

      <div className="mt-4 rounded-[22px] border border-white/80 bg-white/70 p-4">
        <ScenarioSourcePreview scenario={scenario} />

        <div className="relative mt-5 h-[208px] rounded-[18px] border border-slate-100 bg-white/75 px-6 py-6">
          <div
            className={`absolute left-[20%] right-[20%] top-[55%] h-[4px] -translate-y-1/2 rounded-full ${tone.line}`}
          />

          {redIndex >= 0 ? (
            <div
              className="absolute top-[18px] h-[4px] w-[76px] rounded-full bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.45)] transition-all duration-300"
              style={{
                left: `calc(${getTerminalPosition(
                  redIndex,
                  scenario.terminals.length,
                ).left} - 38px)`,
              }}
            />
          ) : null}

          {blackIndex >= 0 ? (
            <div
              className="absolute bottom-[18px] h-[4px] w-[76px] rounded-full bg-slate-500 shadow-[0_0_14px_rgba(100,116,139,0.35)] transition-all duration-300"
              style={{
                left: `calc(${getTerminalPosition(
                  blackIndex,
                  scenario.terminals.length,
                ).left} - 38px)`,
              }}
            />
          ) : null}

          {scenario.terminals.map((terminal, index) => {
            const position = getTerminalPosition(index, scenario.terminals.length);
            const redActive = redProbeTarget === terminal.id;
            const blackActive = blackProbeTarget === terminal.id;
            const roleStyles = getTerminalRoleStyles(terminal.role);

            return (
              <div
                key={terminal.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ ...position, top: "46%" }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setRedProbeTarget(terminal.id)}
                      className={`absolute -left-14 top-[12px] rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] transition ${
                        redActive
                          ? "border-rose-300 bg-rose-50 text-rose-800 shadow-[0_0_14px_rgba(251,113,133,0.2)]"
                          : "border-rose-200 bg-rose-50/80 text-rose-700 hover:border-rose-300"
                      }`}
                    >
                      Red
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlackProbeTarget(terminal.id)}
                      className={`absolute -right-15 top-[12px] rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] transition ${
                        blackActive
                          ? "border-slate-400 bg-slate-100 text-slate-900 shadow-[0_0_12px_rgba(100,116,139,0.16)]"
                          : "border-slate-300 bg-slate-100/85 text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      Black
                    </button>
                    {redActive ? (
                      <div className="absolute left-1/2 top-[-16px] h-[16px] w-[4px] -translate-x-1/2 rounded-full bg-rose-400 shadow-[0_0_14px_rgba(251,113,133,0.45)]" />
                    ) : null}
                    {blackActive ? (
                      <div className="absolute left-1/2 bottom-[-16px] h-[16px] w-[4px] -translate-x-1/2 rounded-full bg-slate-500 shadow-[0_0_12px_rgba(100,116,139,0.35)]" />
                    ) : null}
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition ${
                        redActive || blackActive ? "scale-105" : ""
                      }`}
                    >
                      <span className="text-[14px] font-black">{terminal.label}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-center">
                    <p
                      className={`text-[11px] font-bold tracking-tight ${roleStyles.accent}`}
                    >
                      {terminal.label}
                    </p>
                    <p
                      className={`mt-1.5 text-[9px] uppercase tracking-[0.18em] ${roleStyles.role}`}
                    >
                      {terminal.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
