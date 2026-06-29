import EffectBar from "./EffectBar";
import type { TransistorLevel } from "./types";

type LearningSectionsProps = {
  transistorBiased: boolean;
  rawBaseCurrent: number;
  amplification: number;
  lampPower: number;
  transistorLevel: TransistorLevel;
};

export default function LearningSections({
  transistorBiased,
  rawBaseCurrent,
  amplification,
  lampPower,
  transistorLevel,
}: LearningSectionsProps) {
  return (
    <div className="grid gap-3 sm:gap-6 xl:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:rounded-3xl sm:p-5">
        <h2 className="mb-4 font-semibold text-slate-900">
          Transistor Indicators
        </h2>
        <div className="space-y-4">
          <EffectBar
            label="Switching State"
            value={transistorBiased ? 1 : 0}
            maxValue={1}
            color="#16a34a"
            note="The transistor will not turn on until minimum base bias current is reached."
          />
          <EffectBar
            label="Base Bias Level"
            value={rawBaseCurrent}
            maxValue={0.0002}
            color="#2563eb"
            note="Conduction starts once the base current crosses the minimum bias level."
          />
          <EffectBar
            label="Current Amplification"
            value={amplification}
            maxValue={1}
            color="#22c55e"
            note="Collector current is controlled by the current gain beta."
          />
          <EffectBar
            label="Lamp Brightness"
            value={lampPower}
            maxValue={0.35}
            color="#facc15"
            note="More collector current makes the lamp brighter."
          />
          <EffectBar
            label="Control Efficiency"
            value={transistorBiased ? 0.9 : 0}
            maxValue={1}
            color="#f97316"
            note="Without base bias, the output control path stays inactive."
          />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Transistor Level
              </p>
              <p
                className={`text-sm font-black ${
                  transistorLevel === "SATURATION"
                    ? "text-green-600"
                    : transistorLevel === "ACTIVE"
                      ? "text-blue-600"
                      : transistorLevel === "WEAK ACTIVE"
                        ? "text-yellow-600"
                        : "text-red-600"
                }`}
              >
                {transistorLevel}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <div
                className={`h-2 flex-1 rounded-full ${
                  transistorLevel === "CUT-OFF" || transistorLevel === "OFF"
                    ? "bg-red-500"
                    : "bg-slate-200"
                }`}
              />
              <div
                className={`h-2 flex-1 rounded-full ${
                  transistorLevel === "WEAK ACTIVE"
                    ? "bg-yellow-500"
                    : "bg-slate-200"
                }`}
              />
              <div
                className={`h-2 flex-1 rounded-full ${
                  transistorLevel === "ACTIVE"
                    ? "bg-blue-500"
                    : "bg-slate-200"
                }`}
              />
              <div
                className={`h-2 flex-1 rounded-full ${
                  transistorLevel === "SATURATION"
                    ? "bg-green-500"
                    : "bg-slate-200"
                }`}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-500">
              <span>OFF</span>
              <span>WEAK</span>
              <span>ACTIVE</span>
              <span>SAT</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:rounded-3xl sm:p-5">
        <h2 className="mb-4 font-semibold text-slate-900">
          What is Transistor?
        </h2>
        <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Definition</p>
          <p className="mt-1">
            A transistor is a three-terminal semiconductor device: Base,
            Collector, and Emitter. It is commonly used as a switch or an
            amplifier.
          </p>
        </div>
        <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-slate-700 ring-1 ring-green-100">
          <p className="font-semibold text-green-700">Working Principle</p>
          <p className="mt-1">
            A small current into the base can make the collector-emitter path
            conductive, allowing a larger load current to flow.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:rounded-3xl sm:p-5">
        <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-green-50 p-3 ring-1 ring-green-100 sm:p-4">
            <p className="font-semibold text-green-700">Switch Mode</p>
            <p className="mt-1">
              With a base signal, the transistor turns on. Without it, the
              transistor stays off.
            </p>
          </div>
          <div className="rounded-2xl bg-yellow-50 p-3 ring-1 ring-yellow-100 sm:p-4">
            <p className="font-semibold text-yellow-700">Amplifier Mode</p>
            <p className="mt-1">
              It can turn a small input signal into a larger output signal.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="font-semibold text-red-700">Current Limiting</p>
            <p className="mt-1">
              Without a base resistor, excessive base current can damage the
              transistor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
