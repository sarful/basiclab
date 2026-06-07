import CurrentDots from "./CurrentDots";
import type { SelectedTerminal, TransistorType } from "./types";

type TransistorSymbolProps = {
  type: TransistorType;
  selected: SelectedTerminal;
  signal: number;
};

export default function TransistorSymbol({
  type,
  selected,
  signal,
}: TransistorSymbolProps) {
  const selectedColor =
    selected === "Emitter"
      ? "#dc2626"
      : selected === "Base"
        ? "#2563eb"
        : "#16a34a";

  const flowActive = signal > 0;
  const isNPN = type === "NPN";
  const collectorElectronPath = isNPN
    ? "M150 200 L246 150 V72"
    : "M246 72 V150 L150 200";
  const emitterElectronPath = isNPN
    ? "M246 410 V322 L150 270"
    : "M150 270 L246 322 V410";
  const baseElectronPath = isNPN ? "M126 243 H28" : "M28 243 H126";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            {type} Terminal Diagram
          </h2>
          <p className="text-sm text-slate-600">
            Interactive symbol for identifying Emitter, Base, and Collector.
            Electron flow: NPN = E to C, PNP = C to E.
          </p>
        </div>

        <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700">
          Selected: <span style={{ color: selectedColor }}>{selected}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-inner">
        <svg
          width="436"
          height="485"
          viewBox="0 0 436 485"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-auto w-full max-w-[436px]"
        >
          <rect width="436" height="485" fill="#FFFFFF" />

          <line x1="28" y1="243" x2="126" y2="243" stroke="#7A0000" strokeWidth="6" />
          <rect x="126" y="153" width="24" height="180" fill="#7A0000" />

          <line x1="150" y1="200" x2="246" y2="150" stroke="#7A0000" strokeWidth="6" />
          <line x1="246" y1="150" x2="246" y2="72" stroke="#7A0000" strokeWidth="6" />

          <line x1="150" y1="270" x2="246" y2="322" stroke="#7A0000" strokeWidth="6" />
          <line x1="246" y1="322" x2="246" y2="410" stroke="#7A0000" strokeWidth="6" />

          {isNPN ? (
            <polygon points="214,282 250,316 218,326" fill="#7A0000" />
          ) : (
            <polygon points="206,318 172,286 214,282" fill="#7A0000" />
          )}

          <text
            x="0"
            y="257"
            fontFamily="Arial"
            fontSize="72"
            fill={selected === "Base" ? selectedColor : "#000000"}
          >
            B
          </text>
          <text
            x="228"
            y="58"
            fontFamily="Arial"
            fontSize="72"
            fill={selected === "Collector" ? selectedColor : "#000000"}
          >
            C
          </text>
          <text
            x="228"
            y="470"
            fontFamily="Arial"
            fontSize="72"
            fill={selected === "Emitter" ? selectedColor : "#000000"}
          >
            E
          </text>

          <text x="255" y="280" fontFamily="Arial" fontSize="84" fill="#A8A8A8">
            {type}
          </text>

          <CurrentDots
            path={collectorElectronPath}
            active={flowActive && selected === "Collector"}
            color="#16a34a"
          />

          <CurrentDots
            path={emitterElectronPath}
            active={flowActive && selected === "Emitter"}
            color="#dc2626"
          />

          <CurrentDots
            path={baseElectronPath}
            active={flowActive && selected === "Base"}
            color="#2563eb"
          />
        </svg>
      </div>
    </div>
  );
}
