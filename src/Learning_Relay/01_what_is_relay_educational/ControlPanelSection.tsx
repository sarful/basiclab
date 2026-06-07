import type { RelayType } from "./types";

type ControlPanelSectionProps = {
  energized: boolean;
  setEnergized: (value: boolean) => void;
  relayType: RelayType;
  setRelayType: (value: RelayType) => void;
  description: string;
};

export default function ControlPanelSection({
  energized,
  setEnergized,
  relayType,
  setRelayType,
  description,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="text-lg font-black">Controls</h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {(["SPST", "SPDT", "DPDT"] as RelayType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setRelayType(type)}
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              relayType === type
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <button
        type="button"
        onMouseDown={() => setEnergized(true)}
        onMouseUp={() => setEnergized(false)}
        onMouseLeave={() => setEnergized(false)}
        onTouchStart={() => setEnergized(true)}
        onTouchEnd={() => setEnergized(false)}
        className={`mt-6 w-full rounded-3xl px-5 py-6 text-xl font-black shadow-lg ${
          energized ? "bg-green-700 text-white" : "bg-green-100 text-green-800"
        }`}
      >
        {energized ? "COIL ENERGIZED" : "PRESS TO ENERGIZE"}
      </button>

      <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Realtime Explanation
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {description}
        </p>
        <p className="mt-3 text-sm font-black text-blue-700">
          Electromagnetic field: {energized ? "ACTIVE" : "OFF"}
        </p>
      </div>
    </div>
  );
}
