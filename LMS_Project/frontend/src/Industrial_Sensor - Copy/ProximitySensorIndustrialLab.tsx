"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Cpu,
  FileText,
  Info,
  Maximize,
  Monitor,
  Play,
  RotateCcw,
  Settings,
  Square,
  Sun,
  Volume2,
  Zap,
} from "lucide-react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type SensorType = "Inductive" | "Capacitive";
type OutputType = "PNP NO" | "PNP NC" | "NPN NO" | "NPN NC";
type Material = "Steel" | "Aluminium" | "Plastic" | "Wood" | "Liquid";

export default function ProximitySensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [sensorType, setSensorType] = useState<SensorType>("Inductive");
  const [outputType, setOutputType] = useState<OutputType>("PNP NO");
  const [material, setMaterial] = useState<Material>("Steel");
  const [range, setRange] = useState(10);
  const [distance, setDistance] = useState(6.2);
  const [detectCount, setDetectCount] = useState(7);

  const materialOk =
    sensorType === "Inductive"
      ? material === "Steel" || material === "Aluminium"
      : true;

  const detected = power && materialOk && distance <= range;
  const noMode = outputType.includes("NO");
  const outputOn = power && (noMode ? detected : !detected);
  const pnpMode = outputType.includes("PNP");

  function setDistanceSafe(v: number) {
    const next = Number(Math.max(1, Math.min(18, v)).toFixed(1));
    if (!detected && power && materialOk && next <= range) {
      setDetectCount((n) => n + 1);
    }
    setDistance(next);
  }

  function reset() {
    setPower(false);
    setSensorType("Inductive");
    setOutputType("PNP NO");
    setMaterial("Steel");
    setRange(10);
    setDistance(6.2);
    setDetectCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Simulation Started", "text-slate-700"],
      detected
        ? ["10:24:18", "Target Entered Range", "text-green-600"]
        : ["10:24:23", "Target Exited Range", "text-orange-500"],
      ["10:24:18", outputOn ? "Output ON" : "Output OFF", "text-slate-900"],
      ["LIVE", `${sensorType} / ${material}`, "text-blue-600"],
    ];
  }, [power, detected, outputOn, sensorType, material]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} sensorType={sensorType} outputType={outputType} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="SENSOR CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Sensor Type">
                  <Select value={sensorType} onChange={(v) => setSensorType(v as SensorType)}>
                    <option>Inductive</option>
                    <option>Capacitive</option>
                  </Select>
                </Control>

                <Control label="Sensing Distance">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{range}</b>
                      <span>mm</span>
                    </div>
                    <button className="miniBtn" onClick={() => setRange(Math.max(1, range - 1))}>−</button>
                    <button className="miniBtn" onClick={() => setRange(Math.min(30, range + 1))}>+</button>
                  </div>
                </Control>

                <Control label="Output Type">
                  <Select value={outputType} onChange={(v) => setOutputType(v as OutputType)}>
                    <option>PNP NO</option>
                    <option>PNP NC</option>
                    <option>NPN NO</option>
                    <option>NPN NC</option>
                  </Select>
                </Control>

                <Control label="Supply Voltage">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>

                <Control label="Target Material">
                  <Select value={material} onChange={(v) => setMaterial(v as Material)}>
                    <option>Steel</option>
                    <option>Aluminium</option>
                    <option>Plastic</option>
                    <option>Wood</option>
                    <option>Liquid</option>
                  </Select>
                </Control>
              </Panel>

              <Panel title="SENSOR STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Output State" value={outputOn ? "ON" : "OFF"} badge={outputOn} />
                <Status label="Target Detected" value={detected ? "YES" : "NO"} badge={detected} />
                <Status label="Distance" value={`${distance.toFixed(1)} mm`} distance />
                <Status label="Mode" value={pnpMode ? "PNP" : "NPN"} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select sensor type and output mode.</li>
                  <li>2. Drag target block or use slider.</li>
                  <li>3. Watch sensor LED, output wire and lamps.</li>
                  <li>4. Compare inductive vs capacitive detection.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn">
                    <Play size={17} /> Start
                  </button>
                  <button onClick={() => setPower(false)} className="secondaryBtn">
                    <Square size={15} /> Stop
                  </button>
                  <button onClick={reset} className="secondaryBtn col-span-2">
                    <RotateCcw size={17} /> Reset
                  </button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <IndustrialScene
                    power={power}
                    distance={distance}
                    range={range}
                    detected={detected}
                    outputOn={outputOn}
                    sensorType={sensorType}
                    material={material}
                    setDistance={setDistanceSafe}
                  />

                  <LiveReadout
                    distance={distance}
                    detected={detected}
                    outputOn={outputOn}
                    sensorType={sensorType}
                    outputType={outputType}
                    range={range}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={1}
                      max={18}
                      step={0.1}
                      value={distance}
                      onChange={(e) => setDistanceSafe(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Near</span>
                      <span>Drag target / adjust distance</span>
                      <span>Far</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel title="I/O INDICATOR" icon={<Cpu size={19} />} className="xl:col-span-3">
                  <div className="grid h-[190px] grid-cols-2 place-items-center">
                    <Lamp label="POWER" on={power} />
                    <Lamp label="OUTPUT" on={outputOn} />
                  </div>
                </Panel>

                <Panel title="SENSOR CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg outputType={outputType} outputOn={outputOn} />
                </Panel>

                <Panel title="EVENT LOG" icon={<ClipboardList size={19} />} className="md:col-span-2 xl:col-span-4">
                  <div className="space-y-4 pt-2 text-sm">
                    {logs.map(([time, msg, color], i) => (
                      <div key={i} className="grid grid-cols-[75px_1fr]">
                        <span>{time}</span>
                        <span className={color}>{msg}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs">
                    Detection Count: <b>{detectCount}</b>
                  </div>
                </Panel>
              </div>
            </section>
          </div>
        )}
      </div>

      <style jsx global>{`
        .input {
          height: 42px;
          width: 100%;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: white;
          padding: 0 12px;
          outline: none;
          font-size: 14px;
        }
        .miniBtn {
          height: 42px;
          width: 42px;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: white;
          font-size: 23px;
        }
        .primaryBtn {
          display: flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-weight: 600;
        }
        .secondaryBtn {
          display: flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          border: 1px solid #dbe3ef;
          background: white;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}

function Header({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: Tab[] = ["Simulator", "Theory", "Wiring Diagram", "Quiz", "Report"];

  return (
    <header className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
      <div className="flex items-center gap-4 lg:col-span-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white">
          <Cpu size={30} />
        </div>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">INDUSTRIAL LAB</h1>
          <p className="text-base text-blue-600 sm:text-lg">Proximity Sensor Simulation</p>
        </div>
      </div>

      <nav className="flex overflow-x-auto rounded-xl border bg-white shadow-sm lg:col-span-6">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`min-w-[135px] flex-1 px-4 py-4 text-sm ${
              tab === item ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="hidden justify-end gap-8 text-slate-800 lg:col-span-3 lg:flex">
        <Sun size={24} />
        <Volume2 size={24} />
        <Maximize size={24} />
      </div>
    </header>
  );
}

function Panel({ title, icon, children, className = "" }: any) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex h-14 items-center gap-3 border-b px-5 font-bold text-blue-600">
        {icon}
        {title}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Control({ label, children }: any) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-[120px_1fr] sm:items-center">
      <span>{label}</span>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }: any) {
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
    </select>
  );
}

function Status({ label, value, dot, badge, distance }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_110px] items-center text-sm">
      <span>{label}</span>
      <span
        className={`flex h-8 items-center justify-center rounded-md ${
          badge ? "bg-green-600 font-semibold text-white" : ""
        } ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}
      >
        {dot && <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />}
        {value}
      </span>
    </div>
  );
}

function IndustrialScene({
  power,
  distance,
  range,
  detected,
  outputOn,
  sensorType,
  material,
  setDistance,
}: any) {
  const targetX = 495 + distance * 27;

  function drag(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1120;
    setDistance((x - 495) / 27);
  }

  return (
    <svg
      viewBox="0 0 1120 560"
      className="h-full w-full cursor-ew-resize touch-none"
      onPointerDown={drag}
      onPointerMove={(e) => e.buttons === 1 && drag(e)}
    >
      <defs>
        <linearGradient id="body" x1="0" x2="1">
          <stop offset="0" stopColor="#4b5563" />
          <stop offset=".18" stopColor="#f8fafc" />
          <stop offset=".32" stopColor="#6b7280" />
          <stop offset=".55" stopColor="#f1f5f9" />
          <stop offset=".78" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="block" x1="0" x2="1">
          <stop offset="0" stopColor="#707070" />
          <stop offset=".5" stopColor="#c7c7c7" />
          <stop offset="1" stopColor="#777" />
        </linearGradient>
        <filter id="softShadow">
          <feDropShadow dx="0" dy="9" stdDeviation="8" floodOpacity=".22" />
        </filter>
      </defs>

      <rect x="70" y="430" width="960" height="32" rx="8" fill="#e5e7eb" stroke="#b8c0cc" />
      <rect x="90" y="445" width="920" height="8" rx="4" fill="#cbd5e1" />
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={i} x1={120 + i * 42} y1="427" x2={120 + i * 42} y2="462" stroke="#9ca3af" />
      ))}

      <path d="M30 330 C90 290 55 200 160 205" fill="none" stroke="#111" strokeWidth="34" strokeLinecap="round" />
      <path d="M160 205 L215 205" stroke="#1f2937" strokeWidth="38" strokeLinecap="round" />

      <rect x="215" y="168" width="235" height="74" rx="35" fill="url(#body)" stroke="#111827" filter="url(#softShadow)" />

      {Array.from({ length: 46 }).map((_, i) => (
        <line key={i} x1={235 + i * 4.3} y1="171" x2={231 + i * 4.3} y2="239" stroke="#f8fafc" strokeWidth="1.2" opacity=".9" />
      ))}

      <polygon points="205,145 246,145 263,265 222,265" fill="#9ca3af" stroke="#475569" />
      <polygon points="370,145 414,145 431,265 387,265" fill="#9ca3af" stroke="#475569" />

      <rect x="430" y="177" width="52" height="58" rx="9" fill="#111" />
      <circle cx="350" cy="205" r="9" fill={outputOn ? "#39d353" : "#9ca3af"} />
      {outputOn && <circle cx="350" cy="205" r="17" fill="none" stroke="#39d353" opacity=".55" />}

      <rect x="348" y="242" width="22" height="165" fill="#a3a3a3" stroke="#737373" />
      <rect x="292" y="398" width="140" height="36" fill="#c0c0c0" stroke="#737373" />
      {[315, 350, 385, 420].map((x) => (
        <circle key={x} cx={x} cy="416" r="8" fill="#777" stroke="#333" />
      ))}

      <line x1="482" y1="205" x2={targetX} y2="176" stroke="#22c55e" strokeWidth="2" strokeDasharray="8 8" opacity={power ? 1 : 0.2} />
      <line x1="482" y1="205" x2={targetX} y2="245" stroke="#22c55e" strokeWidth="2" strokeDasharray="8 8" opacity={power ? 1 : 0.2} />
      <line x1="570" y1="160" x2="570" y2="345" stroke="#86efac" strokeDasharray="6 6" />

      {detected && (
        <>
          <circle cx="482" cy="205" r="18" fill="none" stroke="#22c55e" strokeWidth="2">
            <animate attributeName="r" from="14" to="42" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from=".8" to="0" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x="570" y="120" fill="#16a34a" fontSize="22" fontWeight="700">
            TARGET DETECTED
          </text>
        </>
      )}

      <line x1="570" y1="350" x2={targetX + 75} y2="350" stroke="#9ca3af" />
      <polygon points="570,350 582,343 582,357" fill="#9ca3af" />
      <polygon points={`${targetX + 75},350 ${targetX + 63},343 ${targetX + 63},357`} fill="#9ca3af" />
      <line x1={targetX + 75} y1="315" x2={targetX + 75} y2="370" stroke="#9ca3af" />

      <text x={(570 + targetX + 75) / 2} y="344" textAnchor="middle" fill="#16a34a" fontSize="20" fontWeight="700">
        {distance.toFixed(1)} mm
      </text>
      <text x={(570 + targetX + 75) / 2} y="378" textAnchor="middle" fill="#111" fontSize="13">
        Sensing Distance: {range} mm
      </text>

      <rect x={targetX} y="155" width="150" height="185" rx="12" fill="url(#block)" stroke={detected ? "#16a34a" : "#555"} strokeWidth={detected ? 5 : 2} filter="url(#softShadow)" />
      <rect x={targetX + 12} y="168" width="126" height="158" rx="8" fill="#b8b8b8" opacity=".9" />

      <rect x={targetX + 40} y="340" width="70" height="88" fill="#a3a3a3" stroke="#737373" />
      <rect x={targetX + 5} y="425" width="140" height="30" rx="6" fill="#d1d5db" stroke="#94a3b8" />

      <text x="80" y="505" fontSize="13" fill="#475569">Industrial linear guide rail</text>
      <text x={targetX + 10} y="145" fontSize="13" fill="#475569">{material} Target</text>
      <text x="220" y="135" fontSize="13" fill="#475569">{sensorType} Proximity Sensor</text>
    </svg>
  );
}

function LiveReadout({ distance, detected, outputOn, sensorType, outputType, range }: any) {
  return (
    <div className="absolute right-3 top-3 w-[230px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[285px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Distance" value={`${distance.toFixed(1)} mm`} green />
        <Read label="Output State" value={outputOn ? "ON" : "OFF"} green={outputOn} />
        <Read label="Supply Voltage" value="24 V DC" />
        <Read label="Target" value={detected ? "Detected" : "Not Detected"} green={detected} />
        <Read label="Sensor" value={sensorType} />
        <Read label="Output" value={outputType} />
        <Read label="Detection Zone" value={`${range} mm`} />
      </div>
    </div>
  );
}

function Read({ label, value, green }: any) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <b className={green ? "text-green-600" : ""}>{value}</b>
    </div>
  );
}

function Lamp({ label, on }: any) {
  return (
    <div className="text-center">
      <p className="mb-5 text-sm">{label}</p>
      <div className="grid h-16 w-16 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div className={`h-10 w-10 rounded-full ${on ? "bg-green-500 shadow-[0_0_20px_#22c55e]" : "bg-slate-300"}`} />
      </div>
    </div>
  );
}

function WiringSvg({ outputType, outputOn }: any) {
  const pnp = outputType.includes("PNP");

  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <rect x="25" y="72" width="90" height="42" rx="20" fill="#aaa" stroke="#555" />
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={i} x1={45 + i * 4.5} y1="74" x2={45 + i * 4.5} y2="112" stroke="#eee" />
      ))}
      <rect x="105" y="58" width="18" height="70" fill="#bbb" stroke="#555" />
      <rect x="12" y="84" width="22" height="18" fill="#222" />

      <polyline points="123,72 175,35 205,35" fill="none" stroke="#dc2626" strokeWidth="2" />
      <line x1="205" y1="35" x2="410" y2="35" stroke="#dc2626" strokeWidth="2" />
      <polygon points="410,29 426,35 410,41" fill="#dc2626" />

      <line x1="123" y1="95" x2="410" y2="95" stroke={outputOn ? "#16a34a" : "#111"} strokeWidth={outputOn ? 4 : 2} />
      <polygon points="410,88 426,95 410,102" fill={outputOn ? "#16a34a" : "#111"} />

      <polyline points="123,116 175,155 205,155" fill="none" stroke="#2563eb" strokeWidth="2" />
      <line x1="205" y1="155" x2="410" y2="155" stroke="#2563eb" strokeWidth="2" />
      <polygon points="410,149 426,155 410,161" fill="#2563eb" />

      {outputOn && (
        <circle r="5" fill="#22c55e">
          <animateMotion dur="1.2s" repeatCount="indefinite" path="M123 95 L410 95" />
        </circle>
      )}

      <text x="215" y="30" fontSize="14" fill="#7f1d1d">Brown</text>
      <text x="215" y="88" fontSize="14">Black</text>
      <text x="215" y="148" fontSize="14" fill="#2563eb">Blue</text>

      <text x="450" y="40" fontSize="14">+24 V DC</text>
      <text x="450" y="100" fontSize="14">PLC Input / Load</text>
      <text x="450" y="160" fontSize="14">0 V DC</text>

      <text x="35" y="170" fontSize="12" fill="#475569">
        3-wire {pnp ? "PNP sourcing" : "NPN sinking"} sensor wiring
      </text>
    </svg>
  );
}

function LearningTab({ tab, sensorType, outputType }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Proximity Sensor Theory",
      points: [
        "Inductive sensors detect metal objects using an electromagnetic field.",
        "Capacitive sensors detect metal and non-metal objects by capacitance change.",
        "NO output turns ON when the target is detected.",
        "NC output stays ON normally and turns OFF when the target is detected.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputType} Wiring Explanation`,
      points: [
        "Brown wire connects to +24 V DC.",
        "Blue wire connects to 0 V DC.",
        "Black wire is the output signal wire.",
        "PNP output sources positive voltage; NPN output sinks to 0 V.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: Which sensor is best for metal target detection?",
        "Q2: What does NO mean in sensor output?",
        "Q3: What is the function of the black wire?",
        "Q4: Which sensor can detect liquid or plastic objects?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected sensor type: ${sensorType}`,
        `Selected output type: ${outputType}`,
        "Recommended training activity: test different materials and compare output state.",
        "Observe how sensing distance affects detection reliability.",
      ],
    },
  };

  const item = data[tab];

  return (
    <Panel title={tab.toUpperCase()} icon={item.icon}>
      <div className="min-h-[520px] rounded-xl bg-slate-50 p-6">
        <h2 className="mb-5 text-2xl font-bold text-blue-600">{item.title}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {item.points.map((p, i) => (
            <div key={i} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                <AlertTriangle size={18} className="text-blue-600" />
                Learning Point {i + 1}
              </div>
              <p className="leading-7 text-slate-700">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}