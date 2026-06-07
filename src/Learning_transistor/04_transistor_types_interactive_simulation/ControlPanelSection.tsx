import type { BjtType, Family, FetChannel, FetType } from "./types";

type ControlPanelSectionProps = {
  family: Family;
  setFamily: (value: Family) => void;
  bjtType: BjtType;
  setBjtType: (value: BjtType) => void;
  fetType: FetType;
  setFetType: (value: FetType) => void;
  fetChannel: FetChannel;
  setFetChannel: (value: FetChannel) => void;
  signal: number;
  setSignal: (value: number) => void;
  gain: number;
  setGain: (value: number) => void;
  mainCarrier: string;
};

export default function ControlPanelSection({
  family,
  setFamily,
  bjtType,
  setBjtType,
  fetType,
  setFetType,
  fetChannel,
  setFetChannel,
  signal,
  setSignal,
  gain,
  setGain,
  mainCarrier,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="text-lg font-black text-slate-900">Controls</h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => setFamily("BJT")}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            family === "BJT" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          BJT
        </button>
        <button
          onClick={() => setFamily("FET")}
          className={`rounded-2xl px-4 py-3 text-sm font-black ${
            family === "FET" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          FET
        </button>
      </div>

      {family === "BJT" ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => setBjtType("NPN")}
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              bjtType === "NPN" ? "bg-red-700 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            NPN
          </button>
          <button
            onClick={() => setBjtType("PNP")}
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              bjtType === "PNP" ? "bg-red-700 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            PNP
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => setFetType("JFET")}
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              fetType === "JFET" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            JFET
          </button>
          <button
            onClick={() => setFetType("MOSFET")}
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              fetType === "MOSFET" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            MOSFET
          </button>
        </div>
      )}

      {family === "FET" && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => setFetChannel("N-Channel")}
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              fetChannel === "N-Channel"
                ? "bg-cyan-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            N-Channel
          </button>
          <button
            onClick={() => setFetChannel("P-Channel")}
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              fetChannel === "P-Channel"
                ? "bg-red-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            P-Channel
          </button>
        </div>
      )}

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Input Signal: {signal}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={signal}
          onChange={(e) => setSignal(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Gain / Sensitivity: {gain}
        </label>
        <input
          type="range"
          min="20"
          max="200"
          value={gain}
          onChange={(e) => setGain(Number(e.target.value))}
          className="w-full accent-purple-600"
        />
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Realtime Logic
        </p>
        <p className="mt-2 text-sm text-slate-700">
          {family === "BJT"
            ? "BJT is a current-controlled device: a small base current controls a larger collector current."
            : "FET is a voltage-controlled device: gate voltage controls channel conduction between source and drain."}
        </p>
        <p className="mt-3 text-sm font-black text-slate-900">
          Carrier/Control: {mainCarrier}
        </p>
      </div>
    </div>
  );
}
