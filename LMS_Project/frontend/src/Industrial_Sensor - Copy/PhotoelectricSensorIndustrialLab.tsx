"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
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
type SensorMode = "Diffuse" | "Retro-reflective" | "Through-beam";
type OutputType = "PNP NO" | "PNP NC" | "NPN NO" | "NPN NC";
type ObjectType = "Carton Box" | "Metal Part" | "Transparent Bottle" | "Black Rubber";

export default function PhotoelectricSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [sensorMode, setSensorMode] = useState<SensorMode>("Retro-reflective");
  const [outputType, setOutputType] = useState<OutputType>("PNP NO");
  const [objectType, setObjectType] = useState<ObjectType>("Carton Box");
  const [range, setRange] = useState(45);
  const [objectPosition, setObjectPosition] = useState(52);
  const [detectCount, setDetectCount] = useState(12);

  const objectInBeam = objectPosition >= 38 && objectPosition <= 68;
  const objectDifficult =
    objectType === "Transparent Bottle" || objectType === "Black Rubber";

  const detected =
    power &&
    objectInBeam &&
    (sensorMode === "Through-beam" ||
      sensorMode === "Retro-reflective" ||
      !objectDifficult) &&
    objectPosition <= range + 20;

  const noMode = outputType.includes("NO");
  const outputOn = power && (noMode ? detected : !detected);

  function moveObject(v: number) {
    const next = Number(Math.max(5, Math.min(95, v)).toFixed(1));
    if (!detected && next >= 38 && next <= 68 && power) {
      setDetectCount((n) => n + 1);
    }
    setObjectPosition(next);
  }

  function reset() {
    setPower(false);
    setSensorMode("Retro-reflective");
    setOutputType("PNP NO");
    setObjectType("Carton Box");
    setRange(45);
    setObjectPosition(52);
    setDetectCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Simulation Started", "text-slate-700"],
      detected
        ? ["10:24:18", "Object Detected", "text-green-600"]
        : ["10:24:23", "Beam Clear / No Object", "text-orange-500"],
      ["10:24:18", outputOn ? "Output ON" : "Output OFF", "text-slate-900"],
      ["LIVE", `${sensorMode} / ${objectType}`, "text-blue-600"],
    ];
  }, [power, detected, outputOn, sensorMode, objectType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} sensorMode={sensorMode} outputType={outputType} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="SENSOR CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Sensor Mode">
                  <Select value={sensorMode} onChange={(v) => setSensorMode(v as SensorMode)}>
                    <option>Diffuse</option>
                    <option>Retro-reflective</option>
                    <option>Through-beam</option>
                  </Select>
                </Control>

                <Control label="Sensing Range">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{range}</b>
                      <span>cm</span>
                    </div>
                    <button className="miniBtn" onClick={() => setRange(Math.max(10, range - 5))}>−</button>
                    <button className="miniBtn" onClick={() => setRange(Math.min(90, range + 5))}>+</button>
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

                <Control label="Object Type">
                  <Select value={objectType} onChange={(v) => setObjectType(v as ObjectType)}>
                    <option>Carton Box</option>
                    <option>Metal Part</option>
                    <option>Transparent Bottle</option>
                    <option>Black Rubber</option>
                  </Select>
                </Control>
              </Panel>

              <Panel title="SENSOR STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Output State" value={outputOn ? "ON" : "OFF"} badge={outputOn} />
                <Status label="Object Detected" value={detected ? "YES" : "NO"} badge={detected} />
                <Status label="Position" value={`${objectPosition.toFixed(1)} cm`} distance />
                <Status label="Mode" value={sensorMode} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select photoelectric sensor mode.</li>
                  <li>2. Drag the object on the conveyor.</li>
                  <li>3. Observe beam interruption and output lamp.</li>
                  <li>4. Compare object color and transparency effect.</li>
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
                  <PhotoelectricScene
                    power={power}
                    sensorMode={sensorMode}
                    objectType={objectType}
                    objectPosition={objectPosition}
                    range={range}
                    detected={detected}
                    outputOn={outputOn}
                    moveObject={moveObject}
                  />

                  <LiveReadout
                    objectPosition={objectPosition}
                    detected={detected}
                    outputOn={outputOn}
                    sensorMode={sensorMode}
                    outputType={outputType}
                    range={range}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={5}
                      max={95}
                      step={0.1}
                      value={objectPosition}
                      onChange={(e) => moveObject(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Left</span>
                      <span>Drag object / simulate conveyor movement</span>
                      <span>Right</span>
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
          <p className="text-base text-blue-600 sm:text-lg">Photoelectric Sensor Simulation</p>
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
    <div className="mb-4 grid grid-cols-[1fr_120px] items-center text-sm">
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

function PhotoelectricScene({
  power,
  sensorMode,
  objectType,
  objectPosition,
  range,
  detected,
  outputOn,
  moveObject,
}: any) {
  const objX = 120 + objectPosition * 8.7;
  const sensorX = 150;
  const receiverX = 920;

  function drag(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1120;
    moveObject((x - 120) / 8.7);
  }

  const objectFill =
    objectType === "Carton Box"
      ? "#c08457"
      : objectType === "Metal Part"
      ? "#a3a3a3"
      : objectType === "Transparent Bottle"
      ? "#bfdbfe"
      : "#111827";

  return (
    <svg
      viewBox="0 0 1120 560"
      className="h-full w-full cursor-ew-resize touch-none"
      onPointerDown={drag}
      onPointerMove={(e) => e.buttons === 1 && drag(e)}
    >
      <defs>
        <linearGradient id="sensorBody" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".25" stopColor="#e5e7eb" />
          <stop offset=".5" stopColor="#64748b" />
          <stop offset=".8" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" />
        </filter>
      </defs>

      <rect x="70" y="420" width="980" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="90" y="435" width="940" height="10" rx="5" fill="#cbd5e1" />
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={110 + i * 48} cy="442" r="14" fill="#9ca3af" stroke="#64748b" />
      ))}

      <text x="80" y="505" fontSize="13" fill="#475569">
        Industrial conveyor with photoelectric inspection point
      </text>

      <rect x="110" y="210" width="130" height="105" rx="16" fill="url(#sensorBody)" stroke="#111827" filter="url(#shadow)" />
      <rect x="220" y="238" width="28" height="48" rx="8" fill="#111827" />
      <circle cx="235" cy="262" r="16" fill={power ? "#ef4444" : "#991b1b"} />
      <circle cx="235" cy="262" r="7" fill={outputOn ? "#22c55e" : "#64748b"} />

      <rect x="135" y="315" width="28" height="95" fill="#9ca3af" stroke="#64748b" />
      <rect x="100" y="405" width="100" height="28" rx="6" fill="#d1d5db" stroke="#94a3b8" />

      {sensorMode === "Through-beam" && (
        <>
          <rect x="925" y="215" width="110" height="100" rx="16" fill="url(#sensorBody)" stroke="#111827" filter="url(#shadow)" />
          <rect x="910" y="240" width="25" height="45" rx="8" fill="#111827" />
          <circle cx="922" cy="262" r="13" fill="#ef4444" />
          <rect x="970" y="315" width="28" height="95" fill="#9ca3af" stroke="#64748b" />
          <rect x="930" y="405" width="110" height="28" rx="6" fill="#d1d5db" stroke="#94a3b8" />
          <text x="928" y="200" fontSize="13" fill="#475569">Receiver</text>
        </>
      )}

      {sensorMode === "Retro-reflective" && (
        <>
          <rect x="925" y="230" width="105" height="75" rx="10" fill="#fde68a" stroke="#b45309" filter="url(#shadow)" />
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={940 + i * 16} y1="235" x2={940 + i * 16} y2="300" stroke="#f59e0b" />
          ))}
          <text x="924" y="215" fontSize="13" fill="#475569">Reflector</text>
        </>
      )}

      <line
        x1="248"
        y1="262"
        x2={sensorMode === "Diffuse" ? objX : receiverX}
        y2="262"
        stroke="#ef4444"
        strokeWidth="4"
        strokeDasharray="12 8"
        opacity={power ? (detected ? 0.35 : 0.9) : 0.15}
      />

      {sensorMode === "Retro-reflective" && (
        <line
          x1="920"
          y1="278"
          x2="248"
          y2="278"
          stroke="#ef4444"
          strokeWidth="3"
          strokeDasharray="10 8"
          opacity={power ? (detected ? 0.25 : 0.7) : 0.1}
        />
      )}

      {power && !detected && (
        <circle r="5" fill="#ef4444">
          <animateMotion dur="1.2s" repeatCount="indefinite" path={`M248 262 L${sensorMode === "Diffuse" ? objX : receiverX} 262`} />
        </circle>
      )}

      {detected && (
        <>
          <rect x={objX - 10} y="170" width="120" height="205" rx="12" fill="none" stroke="#22c55e" strokeWidth="4">
            <animate attributeName="opacity" from="1" to=".25" dur="0.8s" repeatCount="indefinite" />
          </rect>
          <text x="500" y="150" fill="#16a34a" fontSize="24" fontWeight="700">
            OBJECT DETECTED
          </text>
        </>
      )}

      <rect
        x={objX}
        y={objectType === "Transparent Bottle" ? 205 : 220}
        width={objectType === "Transparent Bottle" ? 58 : 95}
        height={objectType === "Transparent Bottle" ? 155 : 120}
        rx={objectType === "Transparent Bottle" ? 25 : 8}
        fill={objectFill}
        opacity={objectType === "Transparent Bottle" ? 0.45 : 1}
        stroke={objectType === "Black Rubber" ? "#000" : "#475569"}
        strokeWidth="2"
        filter="url(#shadow)"
      />

      {objectType === "Carton Box" && (
        <>
          <line x1={objX} y1="250" x2={objX + 95} y2="250" stroke="#7c2d12" />
          <line x1={objX + 48} y1="220" x2={objX + 48} y2="340" stroke="#7c2d12" />
        </>
      )}

      <text x={objX - 5} y="200" fontSize="13" fill="#475569">
        {objectType}
      </text>

      <line x1="248" y1="350" x2={248 + range * 8} y2="350" stroke="#9ca3af" />
      <polygon points="248,350 260,343 260,357" fill="#9ca3af" />
      <polygon points={`${248 + range * 8},350 ${248 + range * 8 - 12},343 ${248 + range * 8 - 12},357`} fill="#9ca3af" />
      <text x={248 + range * 4} y="342" textAnchor="middle" fill="#16a34a" fontSize="18" fontWeight="700">
        Range {range} cm
      </text>

      <text x="110" y="195" fontSize="13" fill="#475569">
        Photoelectric Sensor
      </text>
      <text x="110" y="530" fontSize="13" fill="#64748b">
        Mode: {sensorMode}
      </text>
    </svg>
  );
}

function LiveReadout({ objectPosition, detected, outputOn, sensorMode, outputType, range }: any) {
  return (
    <div className="absolute right-3 top-3 w-[235px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[290px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Object Position" value={`${objectPosition.toFixed(1)} cm`} green />
        <Read label="Output State" value={outputOn ? "ON" : "OFF"} green={outputOn} />
        <Read label="Supply Voltage" value="24 V DC" />
        <Read label="Object" value={detected ? "Detected" : "Not Detected"} green={detected} />
        <Read label="Mode" value={sensorMode} />
        <Read label="Output" value={outputType} />
        <Read label="Set Range" value={`${range} cm`} />
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
      <rect x="25" y="62" width="95" height="70" rx="14" fill="#94a3b8" stroke="#334155" />
      <circle cx="108" cy="97" r="15" fill="#ef4444" />
      <circle cx="55" cy="80" r="5" fill={outputOn ? "#22c55e" : "#64748b"} />

      <polyline points="120,72 175,35 205,35" fill="none" stroke="#dc2626" strokeWidth="2" />
      <line x1="205" y1="35" x2="410" y2="35" stroke="#dc2626" strokeWidth="2" />
      <polygon points="410,29 426,35 410,41" fill="#dc2626" />

      <line x1="120" y1="95" x2="410" y2="95" stroke={outputOn ? "#16a34a" : "#111"} strokeWidth={outputOn ? 4 : 2} />
      <polygon points="410,88 426,95 410,102" fill={outputOn ? "#16a34a" : "#111"} />

      <polyline points="120,118 175,155 205,155" fill="none" stroke="#2563eb" strokeWidth="2" />
      <line x1="205" y1="155" x2="410" y2="155" stroke="#2563eb" strokeWidth="2" />
      <polygon points="410,149 426,155 410,161" fill="#2563eb" />

      {outputOn && (
        <circle r="5" fill="#22c55e">
          <animateMotion dur="1.2s" repeatCount="indefinite" path="M120 95 L410 95" />
        </circle>
      )}

      <text x="215" y="30" fontSize="14" fill="#7f1d1d">Brown</text>
      <text x="215" y="88" fontSize="14">Black</text>
      <text x="215" y="148" fontSize="14" fill="#2563eb">Blue</text>

      <text x="450" y="40" fontSize="14">+24 V DC</text>
      <text x="450" y="100" fontSize="14">PLC Input</text>
      <text x="450" y="160" fontSize="14">0 V DC</text>

      <text x="35" y="175" fontSize="12" fill="#475569">
        3-wire {pnp ? "PNP sourcing" : "NPN sinking"} photoelectric sensor
      </text>
    </svg>
  );
}

function LearningTab({ tab, sensorMode, outputType }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Photoelectric Sensor Theory",
      points: [
        "Photoelectric sensors detect objects using a light beam.",
        "Diffuse mode detects reflected light from the object surface.",
        "Retro-reflective mode uses a reflector and detects beam interruption.",
        "Through-beam mode uses separate transmitter and receiver units.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputType} Wiring Explanation`,
      points: [
        "Brown wire connects to +24 V DC.",
        "Blue wire connects to 0 V DC.",
        "Black wire is the output signal.",
        "PNP output sends positive voltage to PLC input; NPN output switches to 0 V.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: Which mode uses a reflector?",
        "Q2: Which mode uses separate transmitter and receiver?",
        "Q3: What is the black wire used for?",
        "Q4: Why can transparent objects be difficult to detect?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected sensor mode: ${sensorMode}`,
        `Selected output type: ${outputType}`,
        "Recommended activity: test carton, metal, transparent bottle and black rubber.",
        "Observe how object position changes beam interruption and output state.",
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
              <div className="mb-3 font-bold text-slate-800">Learning Point {i + 1}</div>
              <p className="leading-7 text-slate-700">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}